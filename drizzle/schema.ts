import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  json,
} from 'drizzle-orm/mysql-core';

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  openId: varchar('openId', { length: 64 }).notNull().unique(),
  name: text('name'),
  email: varchar('email', { length: 320 }),
  loginMethod: varchar('loginMethod', { length: 64 }),
  role: mysqlEnum('role', ['user', 'admin']).default('user').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp('lastSignedIn').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Simulation configurations and metadata
 */
export const simulations = mysqlTable('simulations', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('userId').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  simulationType: mysqlEnum('simulationType', [
    'photonic_manifold',
    'cosmological_bridge',
    'mhrma_antenna',
    'iof_resonance',
  ]).notNull(),
  isPublic: int('isPublic').default(0).notNull(), // 0 = private, 1 = public
  parameters: json('parameters').notNull(), // Store simulation parameters as JSON
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
});

export type Simulation = typeof simulations.$inferSelect;
export type InsertSimulation = typeof simulations.$inferInsert;

/**
 * Saved simulation states for version history
 */
export const simulationStates = mysqlTable('simulationStates', {
  id: int('id').autoincrement().primaryKey(),
  simulationId: int('simulationId').notNull(),
  userId: int('userId').notNull(),
  stateData: json('stateData').notNull(), // Full state snapshot
  metrics: json('metrics'), // Associated metrics at time of save
  notes: text('notes'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
});

export type SimulationState = typeof simulationStates.$inferSelect;
export type InsertSimulationState = typeof simulationStates.$inferInsert;

/**
 * Real-time metrics and performance data
 */
export const metrics = mysqlTable('metrics', {
  id: int('id').autoincrement().primaryKey(),
  simulationId: int('simulationId').notNull(),
  userId: int('userId').notNull(),
  metricType: mysqlEnum('metricType', [
    'resonance_quality',
    'energy_efficiency',
    'phase_alignment',
    'frequency_lock',
    'amplitude_response',
    'system_health',
  ]).notNull(),
  value: decimal('value', { precision: 10, scale: 4 }).notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

export type Metric = typeof metrics.$inferSelect;
export type InsertMetric = typeof metrics.$inferInsert;

/**
 * Anomaly detection and alerts
 */
export const anomalies = mysqlTable('anomalies', {
  id: int('id').autoincrement().primaryKey(),
  simulationId: int('simulationId').notNull(),
  userId: int('userId').notNull(),
  anomalyType: varchar('anomalyType', { length: 100 }).notNull(),
  severity: mysqlEnum('severity', ['low', 'medium', 'high', 'critical']).notNull(),
  description: text('description'),
  detectedAt: timestamp('detectedAt').defaultNow().notNull(),
  resolvedAt: timestamp('resolvedAt'),
  metadata: json('metadata'), // Additional context
});

export type Anomaly = typeof anomalies.$inferSelect;
export type InsertAnomaly = typeof anomalies.$inferInsert;

/**
 * Shared simulations between users
 */
export const sharedSimulations = mysqlTable('sharedSimulations', {
  id: int('id').autoincrement().primaryKey(),
  simulationId: int('simulationId').notNull(),
  ownerId: int('ownerId').notNull(),
  sharedWithUserId: int('sharedWithUserId').notNull(),
  accessLevel: mysqlEnum('accessLevel', ['view', 'edit', 'admin']).default('view').notNull(),
  sharedAt: timestamp('sharedAt').defaultNow().notNull(),
});

export type SharedSimulation = typeof sharedSimulations.$inferSelect;
export type InsertSharedSimulation = typeof sharedSimulations.$inferInsert;

/**
 * AI analysis and insights
 */
export const aiInsights = mysqlTable('aiInsights', {
  id: int('id').autoincrement().primaryKey(),
  simulationId: int('simulationId').notNull(),
  userId: int('userId').notNull(),
  insightType: varchar('insightType', { length: 100 }).notNull(),
  content: text('content').notNull(),
  confidence: decimal('confidence', { precision: 3, scale: 2 }).notNull(), // 0.00 to 1.00
  recommendations: json('recommendations'), // Array of suggested actions
  generatedAt: timestamp('generatedAt').defaultNow().notNull(),
});

export type AIInsight = typeof aiInsights.$inferSelect;
export type InsertAIInsight = typeof aiInsights.$inferInsert;
