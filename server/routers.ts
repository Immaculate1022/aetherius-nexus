import { z } from 'zod';
import { COOKIE_NAME } from '@shared/const';
import { getSessionCookieOptions } from './_core/cookies';
import { systemRouter } from './_core/systemRouter';
import { publicProcedure, protectedProcedure, router } from './_core/trpc';
import {
  createSimulation,
  getUserSimulations,
  getSimulationById,
  saveSimulationState,
  getSimulationStates,
  recordMetric,
  getSimulationMetrics,
  recordAnomaly,
  getSimulationAnomalies,
  recordAIInsight,
  getSimulationInsights,
} from './db';

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============ SIMULATION MANAGEMENT ============
  simulations: router({
    // Create a new simulation
    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1).max(255),
          simulationType: z.enum([
            'photonic_manifold',
            'cosmological_bridge',
            'mhrma_antenna',
            'iof_resonance',
          ]),
          parameters: z.record(z.string(), z.unknown()),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await createSimulation(
          ctx.user.id,
          input.name,
          input.simulationType,
          input.parameters
        );
        return { success: true };
      }),

    // Get all simulations for current user
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserSimulations(ctx.user.id);
    }),

    // Get a specific simulation
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getSimulationById(input.id);
      }),

    // Update simulation parameters
    updateParameters: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          parameters: z.record(z.string(), z.unknown()),
        })
      )
      .mutation(async ({ ctx, input }) => {
        // Verify ownership
        const sim = await getSimulationById(input.id);
        if (!sim || sim.userId !== ctx.user.id) {
          throw new Error('Unauthorized');
        }

        // Save as a new state
        await saveSimulationState(input.id, ctx.user.id, input.parameters);
        return { success: true };
      }),
  }),

  // ============ SIMULATION STATES ============
  states: router({
    // Save current simulation state
    save: protectedProcedure
      .input(
        z.object({
          simulationId: z.number(),
          stateData: z.record(z.string(), z.unknown()),
          metrics: z.record(z.string(), z.unknown()).optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const sim = await getSimulationById(input.simulationId);
        if (!sim || sim.userId !== ctx.user.id) {
          throw new Error('Unauthorized');
        }

        await saveSimulationState(
          input.simulationId,
          ctx.user.id,
          input.stateData,
          input.metrics,
          input.notes
        );
        return { success: true };
      }),

    // Get state history
    history: protectedProcedure
      .input(z.object({ simulationId: z.number(), limit: z.number().default(10) }))
      .query(async ({ ctx, input }) => {
        const sim = await getSimulationById(input.simulationId);
        if (!sim || sim.userId !== ctx.user.id) {
          throw new Error('Unauthorized');
        }

        return await getSimulationStates(input.simulationId, input.limit);
      }),
  }),

  // ============ METRICS & MONITORING ============
  metrics: router({
    // Record a metric
    record: protectedProcedure
      .input(
        z.object({
          simulationId: z.number(),
          metricType: z.enum([
            'resonance_quality',
            'energy_efficiency',
            'phase_alignment',
            'frequency_lock',
            'amplitude_response',
            'system_health',
          ]),
          value: z.number(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const sim = await getSimulationById(input.simulationId);
        if (!sim || sim.userId !== ctx.user.id) {
          throw new Error('Unauthorized');
        }

        await recordMetric(input.simulationId, ctx.user.id, input.metricType, input.value);
        return { success: true };
      }),

    // Get metrics for a simulation
    get: protectedProcedure
      .input(z.object({ simulationId: z.number(), limit: z.number().default(100) }))
      .query(async ({ ctx, input }) => {
        const sim = await getSimulationById(input.simulationId);
        if (!sim || sim.userId !== ctx.user.id) {
          throw new Error('Unauthorized');
        }

        return await getSimulationMetrics(input.simulationId, input.limit);
      }),
  }),

  // ============ ANOMALY DETECTION ============
  anomalies: router({
    // Record an anomaly
    record: protectedProcedure
      .input(
        z.object({
          simulationId: z.number(),
          anomalyType: z.string(),
          severity: z.enum(['low', 'medium', 'high', 'critical']),
          description: z.string().optional(),
          metadata: z.record(z.string(), z.unknown()).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const sim = await getSimulationById(input.simulationId);
        if (!sim || sim.userId !== ctx.user.id) {
          throw new Error('Unauthorized');
        }

        await recordAnomaly(
          input.simulationId,
          ctx.user.id,
          input.anomalyType,
          input.severity,
          input.description,
          input.metadata
        );
        return { success: true };
      }),

    // Get active anomalies
    get: protectedProcedure
      .input(z.object({ simulationId: z.number() }))
      .query(async ({ ctx, input }) => {
        const sim = await getSimulationById(input.simulationId);
        if (!sim || sim.userId !== ctx.user.id) {
          throw new Error('Unauthorized');
        }

        return await getSimulationAnomalies(input.simulationId);
      }),
  }),

  // ============ AI INSIGHTS ============
  insights: router({
    // Record an AI insight
    record: protectedProcedure
      .input(
        z.object({
          simulationId: z.number(),
          insightType: z.string(),
          content: z.string(),
          confidence: z.number().min(0).max(1),
          recommendations: z.array(z.string()).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const sim = await getSimulationById(input.simulationId);
        if (!sim || sim.userId !== ctx.user.id) {
          throw new Error('Unauthorized');
        }

        await recordAIInsight(
          input.simulationId,
          ctx.user.id,
          input.insightType,
          input.content,
          input.confidence,
          input.recommendations
        );
        return { success: true };
      }),

    // Get AI insights
    get: protectedProcedure
      .input(z.object({ simulationId: z.number(), limit: z.number().default(10) }))
      .query(async ({ ctx, input }) => {
        const sim = await getSimulationById(input.simulationId);
        if (!sim || sim.userId !== ctx.user.id) {
          throw new Error('Unauthorized');
        }

        return await getSimulationInsights(input.simulationId, input.limit);
      }),
  }),
});

export type AppRouter = typeof appRouter;
