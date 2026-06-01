import { z } from 'zod';

export const detectModelTypeSchema = z.enum(['deep_learning', 'classic_ml']);

export const detectionSchema = z.object({
  class: z.string(),
  class_id: z.number().int(),
  confidence: z.number(),
  bbox: z.array(z.number()),
});

export const preprocessingStepSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export const detectResponseSchema = z.object({
  job_id: z.string(),
  filename: z.string(),
  model_type: detectModelTypeSchema,
  model_name: z.string(),
  status: z.enum(['DANGER', 'SAFE']),
  reason: z.string(),
  latency_ms: z.number(),
  kind: z.enum(['image']),
  confidence: z.number().optional(),
  detections: z.array(detectionSchema).default([]),
  preprocessing: z.array(preprocessingStepSchema).default([]),
});

export type DetectModelType = z.infer<typeof detectModelTypeSchema>;
export type Detection = z.infer<typeof detectionSchema>;
export type PreprocessingStep = z.infer<typeof preprocessingStepSchema>;
export type DetectResponse = z.infer<typeof detectResponseSchema>;
