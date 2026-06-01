import { motion } from 'framer-motion'
import { ImageUp, ScanEye, GitBranch, ShieldAlert } from 'lucide-react'

const steps = [
  {
    icon: ImageUp,
    title: 'Upload CCTV Image',
    desc: 'Drag and drop or click to upload a JPG/PNG frame from a level crossing CCTV camera.',
    color: '#6366f1',
  },
  {
    icon: ScanEye,
    title: 'Choose Detection Model',
    desc: 'Run either the deep learning detector or the classic ML pipeline on the uploaded frame.',
    color: 'var(--accent)',
  },
  {
    icon: GitBranch,
    title: 'Preprocessing',
    desc: 'The selected pipeline prepares the image before the model returns its prediction.',
    color: '#0ea5e9',
  },
  {
    icon: ShieldAlert,
    title: 'Safety Verdict',
    desc: 'The page shows a direct SAFE or DANGER result.',
    color: 'var(--danger)',
  },
]

export default function HowItWorks() {
  return (
    <section className="hiw-section">
      <div className="hiw-header">
        <h2 className="hiw-title">How It Works</h2>
        <p className="hiw-sub">Detection pipeline from input to output</p>
      </div>

      <div className="hiw-steps">
        {steps.map((s, i) => {
          const Icon = s.icon
          return (
            <motion.div
              key={s.title}
              className="hiw-step"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {i < steps.length - 1 && <div className="hiw-connector" />}
              <div className="hiw-icon-wrap" style={{ '--step-color': s.color } as React.CSSProperties}>
                <Icon size={22} strokeWidth={1.8} />
              </div>
              <h3 className="hiw-step-title">{s.title}</h3>
              <p className="hiw-step-desc">{s.desc}</p>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
