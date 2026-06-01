import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import DetectorForm from './DetectorForm'
import ResultDisplay from './ResultDisplay'
import TrainScene from './TrainScene'
import type { DetectResponse } from '../services/api'

export default function Hero() {
  const [result, setResult] = useState<DetectResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const analysisRef = useRef<HTMLElement>(null)

  const sceneState: 'idle' | 'safe' | 'danger' =
    !result || loading ? 'idle' : result.status === 'DANGER' ? 'danger' : 'safe'

  const showAnalysis = loading || !!result || !!error

  useEffect(() => {
    if (loading) {
      const id = requestAnimationFrame(() =>
        analysisRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      )
      return () => cancelAnimationFrame(id)
    }
  }, [loading])

  return (
    <>
      <section className="hero-section">
        <div className="hero-grid">
          <motion.div
            className="hero-left"
          >
            <h1 className="hero-title">
              <span className="hero-title-desktop">
                Obstacle Detection<br />
                <span className="hero-title-accent">at Level Crossings</span>
              </span>
              <span className="hero-title-mobile">
                Obstacle<br />
                Detection<br />
                <span className="hero-title-accent">
                  at Level<br />
                  Crossings
                </span>
              </span>
            </h1>

            <p className="hero-copy">
              Upload a crossing frame. Choose a model. Get a clear{' '}
              <strong style={{ color: 'var(--danger)' }}>DANGER</strong> or{' '}
              <strong style={{ color: 'var(--safe)' }}>SAFE</strong> verdict.
            </p>

          </motion.div>

          <motion.div
            className="hero-right"
          >
            <div className="detect-card">
              <div className="detect-card-header">
                <span className="detect-card-label">Upload frame</span>
                <span className="detect-card-model">Choose model below</span>
              </div>
              <DetectorForm
                busy={loading}
                onLoading={setLoading}
                onError={setError}
                onResult={setResult}
              />
            </div>
          </motion.div>
        </div>

        <TrainScene state={sceneState} />
      </section>

      <AnimatePresence>
        {showAnalysis && (
          <motion.section
            ref={analysisRef}
            className="analysis-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="analysis-inner">
              <div className="analysis-label">
                <span className="detect-card-dot" />
                Analysis Result
              </div>
              <ResultDisplay result={result} loading={loading} />
              {error && <div className="error-banner">&#9888; {error}</div>}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

    </>
  )
}
