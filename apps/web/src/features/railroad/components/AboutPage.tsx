import { motion } from 'framer-motion'

const steps = [
  { title: 'Frame Upload', desc: 'The user uploads one still image from a railway crossing camera.' },
  { title: 'Model Selection', desc: 'The server runs either the deep learning detector or the classic ML classifier.' },
  { title: 'Feature Processing', desc: 'The selected pipeline prepares the frame before prediction.' },
  { title: 'Safety Verdict', desc: 'The interface returns a direct SAFE or DANGER result.' },
]

export default function AboutPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="section-header">
        <h2 className="section-title">
          Built for <span className="accent">level crossings.</span>
        </h2>
        <p className="section-subtitle">
          A railway crossing obstacle detection system with two model paths:
          deep learning for object detection and classic ML for direct image classification.
        </p>
      </div>

      <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginTop: 32, marginBottom: 16 }}>
        Pipeline
      </h3>
      <div className="pipeline-steps">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            className="pipeline-step"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <h4 className="pipeline-step-title">{step.title}</h4>
            <p className="pipeline-step-desc">{step.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="card prose" style={{ marginTop: 28 }}>
        <h3>Deep Learning Decision Rules</h3>
        <ul>
          <li><code>barrier_open</code> present: <strong style={{ color: 'var(--safe)' }}>SAFE</strong></li>
          <li><code>barrier_closed</code> + <code>obstacle</code>: <strong style={{ color: 'var(--danger)' }}>DANGER</strong></li>
          <li><code>barrier_closed</code> alone: SAFE</li>
          <li>Otherwise: SAFE</li>
        </ul>

        <h3>Classic ML Pipeline</h3>
        <p>
          The classic model uses resized image features, HOG, HSV histograms, local binary
          patterns, and edge density before returning a binary crossing verdict.
        </p>

        <h3>Dataset</h3>
        <p>
          The project uses labeled railway crossing frames collected from fixed camera
          perspectives under daytime and nighttime conditions.
        </p>
      </div>
    </motion.div>
  )
}
