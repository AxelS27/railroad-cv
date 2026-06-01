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
    throw new Error('Inference API is not configured. Set NEXT_PUBLIC_API_BASE_URL in Vercel.')
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
