import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/mysql2';
import {
  InsertUser,
  users,
  simulations,
  simulationStates,
  metrics,
  anomalies,
  aiInsights,
} from '../drizzle/schema';
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn('[Database] Failed to connect:', error);
      _db = null;
    }
  }
  return _db;
}

// ============ USER OPERATIONS ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error('User openId is required for upsert');
  }

  const db = await getDb();
  if (!db) {
    console.warn('[Database] Cannot upsert user: database not available');
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ['name', 'email', 'loginMethod'] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error('[Database] Failed to upsert user:', error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn('[Database] Cannot get user: database not available');
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ SIMULATION OPERATIONS ============

export async function createSimulation(
  userId: number,
  name: string,
  simulationType: string,
  parameters: Record<string, unknown>
) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const result = await db.insert(simulations).values({
    userId,
    name,
    simulationType: simulationType as any,
    parameters: JSON.stringify(parameters),
    isPublic: 0,
  });

  return result;
}

export async function getUserSimulations(userId: number) {
  const db = await getDb();
  if (!db) return [];

  const results = await db
    .select()
    .from(simulations)
    .where(eq(simulations.userId, userId));

  return results.map((sim) => ({
    ...sim,
    parameters: typeof sim.parameters === 'string' ? JSON.parse(sim.parameters) : sim.parameters,
  }));
}

export async function getSimulationById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(simulations).where(eq(simulations.id, id)).limit(1);

  if (result.length === 0) return null;

  const sim = result[0];
  return {
    ...sim,
    parameters: typeof sim.parameters === 'string' ? JSON.parse(sim.parameters) : sim.parameters,
  };
}

// ============ SIMULATION STATE OPERATIONS ============

export async function saveSimulationState(
  simulationId: number,
  userId: number,
  stateData: Record<string, unknown>,
  metrics?: Record<string, unknown>,
  notes?: string
) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const result = await db.insert(simulationStates).values({
    simulationId,
    userId,
    stateData: JSON.stringify(stateData),
    metrics: metrics ? JSON.stringify(metrics) : null,
    notes,
  });

  return result;
}

export async function getSimulationStates(simulationId: number, limit = 10) {
  const db = await getDb();
  if (!db) return [];

  const results = await db
    .select()
    .from(simulationStates)
    .where(eq(simulationStates.simulationId, simulationId))
    .limit(limit);

  return results.map((state) => ({
    ...state,
    stateData: typeof state.stateData === 'string' ? JSON.parse(state.stateData) : state.stateData,
    metrics: state.metrics ? (typeof state.metrics === 'string' ? JSON.parse(state.metrics) : state.metrics) : null,
  }));
}

// ============ METRICS OPERATIONS ============

export async function recordMetric(
  simulationId: number,
  userId: number,
  metricType: string,
  value: number
) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const result = await db.insert(metrics).values({
    simulationId,
    userId,
    metricType: metricType as any,
    value: value.toString() as any,
  });

  return result;
}

export async function getSimulationMetrics(simulationId: number, limit = 100) {
  const db = await getDb();
  if (!db) return [];

  const results = await db
    .select()
    .from(metrics)
    .where(eq(metrics.simulationId, simulationId))
    .limit(limit);

  return results.map((m) => ({
    ...m,
    value: parseFloat(m.value.toString()),
  }));
}

// ============ ANOMALY OPERATIONS ============

export async function recordAnomaly(
  simulationId: number,
  userId: number,
  anomalyType: string,
  severity: string,
  description?: string,
  metadata?: Record<string, unknown>
) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const result = await db.insert(anomalies).values({
    simulationId,
    userId,
    anomalyType,
    severity: severity as any,
    description,
    metadata: metadata ? JSON.stringify(metadata) : null,
  });

  return result;
}

export async function getSimulationAnomalies(simulationId: number) {
  const db = await getDb();
  if (!db) return [];

  const results = await db
    .select()
    .from(anomalies)
    .where(eq(anomalies.simulationId, simulationId));

  // Filter for unresolved anomalies (resolvedAt is null)
  return results
    .filter((a) => a.resolvedAt === null)
    .map((a) => ({
      ...a,
      metadata: a.metadata ? (typeof a.metadata === 'string' ? JSON.parse(a.metadata) : a.metadata) : null,
    }));
}

// ============ AI INSIGHTS OPERATIONS ============

export async function recordAIInsight(
  simulationId: number,
  userId: number,
  insightType: string,
  content: string,
  confidence: number,
  recommendations?: string[]
) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const result = await db.insert(aiInsights).values({
    simulationId,
    userId,
    insightType,
    content,
    confidence: confidence.toString() as any,
    recommendations: recommendations ? JSON.stringify(recommendations) : null,
  });

  return result;
}

export async function getSimulationInsights(simulationId: number, limit = 10) {
  const db = await getDb();
  if (!db) return [];

  const results = await db
    .select()
    .from(aiInsights)
    .where(eq(aiInsights.simulationId, simulationId))
    .limit(limit);

  return results.map((i) => ({
    ...i,
    confidence: parseFloat(i.confidence.toString()),
    recommendations: i.recommendations
      ? typeof i.recommendations === 'string'
        ? JSON.parse(i.recommendations)
        : i.recommendations
      : null,
  }));
}
