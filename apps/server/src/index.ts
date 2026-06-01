import { serve } from '@hono/node-server';
import { randomUUID } from 'node:crypto';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { execFile } from 'node:child_process';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { detectModelTypeSchema, detectResponseSchema, type DetectModelType } from '@repo/types';

export const app = new Hono().basePath('/api/v1');
const runFile = promisify(execFile);

const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.bmp']);

const modelConfig: Record<DetectModelType, {
  pythonPath: string;
  script: string;
  args: string[];
}> = {
  deep_learning: {
    pythonPath: process.env.DL_PYTHON_PATH
      ?? 'D:\\Binus-Projects\\obstacle-detection\\venv\\Scripts\\python.exe',
    script: path.resolve(process.cwd(), 'python', 'deep_learning_infer.py'),
    args: [
      '--weights',
      process.env.DL_WEIGHTS_PATH
        ?? 'D:\\Binus-Projects\\obstacle-detection\\website\\backend\\models\\best.pt',
      '--conf',
      process.env.DL_CONFIDENCE ?? '0.4',
    ],
  },
  classic_ml: {
    pythonPath: process.env.ML_PYTHON_PATH
      ?? 'D:\\Binus-Projects\\model-compvis\\.venv\\Scripts\\python.exe',
    script: path.resolve(process.cwd(), 'python', 'classic_ml_infer.py'),
    args: [
      '--model',
      process.env.ML_MODEL_PATH
        ?? 'D:\\Binus-Projects\\model-compvis\\outputs_clean\\best_model.pkl',
      '--project-root',
      process.env.ML_PROJECT_ROOT ?? 'D:\\Binus-Projects\\model-compvis',
    ],
  },
};

type UploadedFile = {
  name: string;
  arrayBuffer: () => Promise<ArrayBuffer>;
};

app.use('*', cors());

app.get('/health', (c) => c.json({ data: { status: 'ok' } }));

app.post('/detect', async (c) => {
  let tempPath: string | null = null;

  try {
    const body = await c.req.parseBody();
    const file = body.file;
    const modelType = detectModelTypeSchema.safeParse(body.modelType ?? 'classic_ml');

    if (!modelType.success) {
      return c.json(
        { error: { code: 'INVALID_MODEL_TYPE', message: 'Choose Deep Learning or Classic ML.' } },
        400,
      );
    }

    if (!isUploadedFile(file)) {
      return c.json(
        { error: { code: 'FILE_REQUIRED', message: 'Upload one image file to analyze.' } },
        400,
      );
    }

    const extension = path.extname(file.name).toLowerCase();
    if (!allowedExtensions.has(extension)) {
      return c.json(
        { error: { code: 'UNSUPPORTED_FILE', message: 'Use a JPG, PNG, WEBP, or BMP image.' } },
        400,
      );
    }

    const jobId = randomUUID();
    const tempDir = path.join(tmpdir(), 'railroad-cv');
    await mkdir(tempDir, { recursive: true });
    tempPath = path.join(tempDir, `${jobId}${extension}`);
    await writeFile(tempPath, Buffer.from(await file.arrayBuffer()));

    const config = modelConfig[modelType.data];
    const { stdout } = await runFile(
      config.pythonPath,
      [config.script, '--image', tempPath, ...config.args],
      {
        timeout: Number(process.env.INFERENCE_TIMEOUT_MS ?? 120_000),
        maxBuffer: 1024 * 1024 * 8,
      },
    );

    const workerResult = parseWorkerJson(stdout);
    const payload = detectResponseSchema.parse({
      ...workerResult,
      job_id: jobId,
      filename: file.name,
      model_type: modelType.data,
      kind: 'image',
      detections: workerResult.detections ?? [],
      preprocessing: workerResult.preprocessing ?? [],
    });

    return c.json({ data: payload });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Inference failed.';
    return c.json(
      { error: { code: 'INFERENCE_FAILED', message } },
      500,
    );
  } finally {
    if (tempPath) {
      await rm(tempPath, { force: true }).catch(() => undefined);
    }
  }
});

function isUploadedFile(value: unknown): value is UploadedFile {
  return (
    typeof value === 'object'
    && value !== null
    && 'name' in value
    && 'arrayBuffer' in value
    && typeof (value as { name?: unknown }).name === 'string'
    && typeof (value as { arrayBuffer?: unknown }).arrayBuffer === 'function'
  );
}

function parseWorkerJson(stdout: string): Record<string, unknown> {
  const lines = stdout.trim().split(/\r?\n/).reverse();
  const jsonLine = lines.find((line) => line.trim().startsWith('{'));

  if (!jsonLine) {
    throw new Error('Model worker did not return JSON.');
  }

  const parsed: unknown = JSON.parse(jsonLine);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Model worker returned an invalid payload.');
  }

  return parsed as Record<string, unknown>;
}

const port = Number(process.env.PORT ?? 4000);

serve({
  fetch: app.fetch,
  port,
});
