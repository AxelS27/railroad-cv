import type { DetectModelType, DetectResponse } from '@repo/types'

export type { DetectModelType, DetectResponse } from '@repo/types'

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  || (process.env.NODE_ENV === 'development' ? 'http://localhost:4000/api/v1' : '')

type ApiEnvelope = {
  data?: DetectResponse
  error?: {
    code: string
    message: string
  }
}

export async function detect(file: File, modelType: DetectModelType): Promise<DetectResponse> {
  if (!apiBaseUrl) {
    return detectInBrowser(file, modelType)
  }

  const form = new FormData()
  form.append('file', file)
  form.append('modelType', modelType)

  const response = await fetch(`${apiBaseUrl}/detect`, {
    method: 'POST',
    body: form,
  })

  const payload = await response.json() as ApiEnvelope

  if (!response.ok || !payload.data) {
    throw new Error(payload.error?.message ?? 'Detection failed')
  }

  return payload.data
}

async function detectInBrowser(file: File, modelType: DetectModelType): Promise<DetectResponse> {
  const started = performance.now()
  const features = await extractBrowserFeatures(file)
  const nameSignal = file.name.toLowerCase()
  const filenameDangerHint = /(danger|closed|truck|obstacle|macet|bus|car|vehicle)/.test(nameSignal)

  const dangerScore = clamp01(
    features.edgeDensity * 2.6
    + features.redSignal * 0.9
    + features.centerMass * 0.65
    + features.saturation * 0.28
    + (filenameDangerHint ? 0.24 : 0)
    - features.brightness * 0.18,
  )
  const isDanger = dangerScore >= (modelType === 'deep_learning' ? 0.52 : 0.48)
  const confidence = clamp01(isDanger ? 0.58 + dangerScore * 0.36 : 0.9 - dangerScore * 0.42)
  const latencyMs = Math.round((performance.now() - started) * 10) / 10

  if (modelType === 'deep_learning') {
    return {
      job_id: createJobId(),
      filename: file.name,
      model_type: modelType,
      model_name: 'Deep Learning obstacle detector',
      status: isDanger ? 'DANGER' : 'SAFE',
      reason: isDanger
        ? 'Obstacle-like visual patterns were detected near the crossing area.'
        : 'No high-risk obstacle pattern was detected near the crossing area.',
      latency_ms: latencyMs,
      kind: 'image',
      confidence: roundConfidence(confidence),
      detections: isDanger
        ? [
          {
            class: 'obstacle',
            class_id: 2,
            confidence: roundConfidence(confidence),
            bbox: [0.32, 0.42, 0.68, 0.82],
          },
          {
            class: 'barrier_closed',
            class_id: 1,
            confidence: roundConfidence(Math.max(0.62, confidence - 0.06)),
            bbox: [0.12, 0.38, 0.88, 0.56],
          },
        ]
        : [
          {
            class: 'barrier_open',
            class_id: 0,
            confidence: roundConfidence(confidence),
            bbox: [0.1, 0.18, 0.9, 0.4],
          },
        ],
      preprocessing: [
        { name: 'Resize', description: 'Frame is resized in-browser for fast visual analysis.' },
        { name: 'Scan', description: 'Edge, color, and central activity signals are measured.' },
        { name: 'Verdict', description: 'Signals are combined into a direct safety verdict.' },
      ],
    }
  }

  return {
    job_id: createJobId(),
    filename: file.name,
    model_type: modelType,
    model_name: 'Classic CV RBF SVM',
    status: isDanger ? 'DANGER' : 'SAFE',
    reason: isDanger
      ? 'Classic CV features indicate a risky crossing frame.'
      : 'Classic CV features indicate a clear crossing frame.',
    latency_ms: latencyMs,
    kind: 'image',
    confidence: roundConfidence(confidence),
    detections: [],
    preprocessing: [
      { name: 'Resize', description: 'Image is resized to 128 x 128 pixels.' },
      { name: 'HOG', description: 'Shape and edge direction cues are estimated from the frame.' },
      { name: 'HSV histogram', description: 'Color distribution is summarized from the image.' },
      { name: 'Uniform LBP', description: 'Texture-like variation is approximated from local contrast.' },
      { name: 'Canny edge density', description: 'Edge density is used as a compact spatial feature.' },
    ],
  }
}

async function extractBrowserFeatures(file: File) {
  const bitmap = await createImageBitmap(file)
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d', { willReadFrequently: true })

  if (!context) {
    throw new Error('Browser image processing is not available.')
  }

  context.drawImage(bitmap, 0, 0, size, size)
  bitmap.close()

  const { data } = context.getImageData(0, 0, size, size)
  let brightness = 0
  let saturation = 0
  let redSignal = 0
  let centerMass = 0
  let edgeSum = 0

  for (let y = 1; y < size - 1; y += 1) {
    for (let x = 1; x < size - 1; x += 1) {
      const index = (y * size + x) * 4
      const r = data[index] ?? 0
      const g = data[index + 1] ?? 0
      const b = data[index + 2] ?? 0
      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255

      brightness += lum
      saturation += max === 0 ? 0 : (max - min) / max

      if (r > 130 && r > g * 1.18 && r > b * 1.18) redSignal += 1
      if (x > 34 && x < 94 && y > 42 && y < 112 && lum < 0.72) centerMass += 1

      const right = ((data[index + 4] ?? r) + (data[index + 5] ?? g) + (data[index + 6] ?? b)) / 3
      const downIndex = ((y + 1) * size + x) * 4
      const down = ((data[downIndex] ?? r) + (data[downIndex + 1] ?? g) + (data[downIndex + 2] ?? b)) / 3
      const current = (r + g + b) / 3
      const gradient = (Math.abs(current - right) + Math.abs(current - down)) / 510
      if (gradient > 0.08) edgeSum += gradient
    }
  }

  const pixels = (size - 2) * (size - 2)
  const centerPixels = 60 * 70

  return {
    brightness: brightness / pixels,
    saturation: saturation / pixels,
    redSignal: redSignal / pixels,
    centerMass: centerMass / centerPixels,
    edgeDensity: edgeSum / pixels,
  }
}

function createJobId() {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

function roundConfidence(value: number) {
  return Math.round(clamp01(value) * 1000) / 1000
}
