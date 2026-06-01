import { useEffect, useRef, useState } from 'react'
import { Loader2, RefreshCw, Upload } from 'lucide-react'
import { detect, type DetectModelType, type DetectResponse } from '../services/api'

type Props = {
  onResult: (r: DetectResponse) => void
  onLoading: (b: boolean) => void
  onError: (msg: string | null) => void
  busy: boolean
}

export default function DetectorForm({ onResult, onLoading, onError, busy }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [modelType, setModelType] = useState<DetectModelType>('classic_ml')

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const runDetection = async (selectedFile: File, selectedModel: DetectModelType) => {
    onLoading(true)
    onError(null)

    try {
      const result = await detect(selectedFile, selectedModel)
      onResult(result)
    } catch (error: unknown) {
      onError((error as { message?: string })?.message ?? 'Detection failed')
    } finally {
      onLoading(false)
    }
  }

  const handleFile = (selectedFile: File | null | undefined) => {
    if (!selectedFile) return

    setFile(selectedFile)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(URL.createObjectURL(selectedFile))
    onError(null)
    void runDetection(selectedFile, modelType)
  }

  const selectModel = (nextModel: DetectModelType) => {
    setModelType(nextModel)
    if (file && !busy) {
      void runDetection(file, nextModel)
    }
  }

  const sizeLabel = file ? formatBytes(file.size) : ''

  return (
    <div className="detector-form">
      <div className="model-switch" aria-label="Detection model">
        <button
          type="button"
          className={modelType === 'classic_ml' ? 'active' : ''}
          onClick={(event) => {
            event.stopPropagation()
            selectModel('classic_ml')
          }}
          disabled={busy}
        >
          Classic ML
        </button>
        <button
          type="button"
          className={modelType === 'deep_learning' ? 'active' : ''}
          onClick={(event) => {
            event.stopPropagation()
            selectModel('deep_learning')
          }}
          disabled={busy}
        >
          Deep Learning
        </button>
      </div>

      <div
        className={`drop-zone ${dragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
        onClick={() => !busy && inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault()
          if (!busy) setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          if (!busy) handleFile(event.dataTransfer.files?.[0])
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(event) => handleFile(event.target.files?.[0])}
        />

        {file && previewUrl ? (
          <>
            <div className="drop-zone-preview">
              <img src={previewUrl} alt="Selected crossing frame" />
              {busy ? (
                <div className="drop-zone-preview-overlay">
                  <Loader2 size={28} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Analyzing...</span>
                </div>
              ) : (
                <div className="drop-zone-preview-overlay hover-only">
                  <RefreshCw size={28} />
                  <span>Click or drag to replace</span>
                </div>
              )}
            </div>

            {!busy && (
              <h4 className="drop-zone-replace-title">
                <RefreshCw size={16} />
                Click or drag to replace
              </h4>
            )}

            <p className="drop-zone-meta">
              <span className="drop-zone-file-name">{file.name}</span>
              <span className="drop-zone-file-size">{sizeLabel}</span>
            </p>
          </>
        ) : (
          <>
            <div className="drop-zone-icon">
              <Upload size={20} />
            </div>
            <p className="drop-zone-text">
              {dragging ? 'Drop here' : 'Click or drag a file'}
            </p>
            <p className="drop-zone-hint">JPG, PNG, WEBP, BMP</p>
          </>
        )}
      </div>
    </div>
  )
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
