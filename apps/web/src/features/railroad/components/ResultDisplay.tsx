import { Activity, AlertOctagon, ShieldCheck } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import type { DetectResponse } from '../services/api'

type Props = {
  result: DetectResponse | null
  loading: boolean
}

export default function ResultDisplay({ result, loading }: Props) {
  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="empty-result"
        >
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Running analysis...
          </div>
        </motion.div>
      )}

      {!loading && !result && (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="empty-result"
        >
          <Activity size={42} className="empty-result-icon" />
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Awaiting upload
          </div>
        </motion.div>
      )}

      {!loading && result && (
        <motion.div
          key={result.job_id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={`status-banner ${result.status === 'DANGER' ? 'danger' : 'safe'}`}>
            <div className="status-icon-box">
              {result.status === 'DANGER' ? (
                <AlertOctagon size={26} color="#fff" strokeWidth={2.5} />
              ) : (
                <ShieldCheck size={26} color="#fff" strokeWidth={2.5} />
              )}
            </div>
            <div className="status-text">
              <div className="status-label">{result.model_name}</div>
              <div className="status-value">{result.status}</div>
              <p className="status-reason">{result.reason}</p>
            </div>
          </div>

          <div className="result-grid">
            <div>
              <h4 className="card-title" style={{ marginBottom: 12 }}>Detections</h4>
              {result.detections.length > 0 ? (
                <div className="detection-list">
                  {result.detections.map((detection) => (
                    <div
                      key={`${detection.class}-${detection.confidence}-${detection.bbox.join('-')}`}
                      className="detection-row"
                    >
                      <span className={`detection-dot ${detection.class}`} />
                      <span className="detection-name">{formatClassName(detection.class)}</span>
                      <span className="detection-conf">
                        {(detection.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="result-empty-copy">
                  This model returns a direct image verdict instead of object boxes.
                </div>
              )}
            </div>

            <div>
              <h4 className="card-title" style={{ marginBottom: 12 }}>Preprocessing</h4>
              <div className="preprocess-list">
                {result.preprocessing.map((step) => (
                  <div className="preprocess-row" key={step.name}>
                    <span className="preprocess-name">{step.name}</span>
                    <span className="preprocess-description">{step.description}</span>
                  </div>
                ))}
              </div>
              {typeof result.confidence === 'number' && (
                <div className="model-confidence">
                  Confidence {(result.confidence * 100).toFixed(1)}%
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function formatClassName(value: string): string {
  return value.replaceAll('_', ' ')
}
