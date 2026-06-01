import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertOctagon, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react'

type Detection = { cls: string; conf: number }
type Sample = {
  src: string
  status: 'DANGER' | 'SAFE'
  reason: string
  title: string
  detections: Detection[]
  latency: number
}

const samples: Sample[] = [
  {
    src: '/samples/sample-danger1.jpg',
    status: 'DANGER',
    reason: 'barrier_closed + obstacle detected on track',
    title: 'Flatbed Truck, Barrier Down',
    detections: [
      { cls: 'barrier_closed', conf: 0.91 },
      { cls: 'obstacle',       conf: 0.87 },
    ],
    latency: 18.4,
  },
  {
    src: '/samples/sample-danger2.jpg',
    status: 'DANGER',
    reason: 'barrier_closed + obstacle detected on track',
    title: 'Car Trapped, Night Conditions',
    detections: [
      { cls: 'barrier_closed', conf: 0.88 },
      { cls: 'obstacle',       conf: 0.76 },
    ],
    latency: 21.2,
  },
  {
    src: '/samples/sample-danger3.jpg',
    status: 'DANGER',
    reason: 'barrier_closed + obstacle detected on track',
    title: 'SUV Stuck on Crossing',
    detections: [
      { cls: 'barrier_closed', conf: 0.93 },
      { cls: 'obstacle',       conf: 0.81 },
    ],
    latency: 17.9,
  },
  {
    src: '/samples/sample-danger4.jpg',
    status: 'DANGER',
    reason: 'barrier_closed + obstacle detected on track',
    title: 'Motorcyclist, Barrier Closed',
    detections: [
      { cls: 'barrier_closed', conf: 0.89 },
      { cls: 'obstacle',       conf: 0.72 },
    ],
    latency: 19.6,
  },
  {
    src: '/samples/sample-safe.jpg',
    status: 'SAFE',
    reason: 'barrier_closed, no obstacle on track',
    title: 'Barrier Down, Track Clear',
    detections: [
      { cls: 'barrier_closed', conf: 0.94 },
    ],
    latency: 16.1,
  },
  {
    src: '/samples/sample-safe2.jpg',
    status: 'SAFE',
    reason: 'barrier_open detected, crossing clear',
    title: 'Open Barrier, Daylight',
    detections: [
      { cls: 'barrier_open', conf: 0.96 },
    ],
    latency: 15.3,
  },
  {
    src: '/samples/sample-standby.jpg',
    status: 'SAFE',
    reason: 'barrier_open detected, crossing clear',
    title: 'Multi-Lane Open Crossing',
    detections: [
      { cls: 'barrier_open', conf: 0.90 },
    ],
    latency: 17.0,
  },
  {
    src: '/samples/sample-standby2.jpg',
    status: 'SAFE',
    reason: 'barrier_closed, no obstacle on track',
    title: 'Vehicle Cleared, Barrier Down',
    detections: [
      { cls: 'barrier_closed', conf: 0.92 },
    ],
    latency: 16.8,
  },
]

const DOT_COLOR: Record<string, string> = {
  barrier_open:   'var(--safe)',
  barrier_closed: 'var(--accent)',
  obstacle:       'var(--danger)',
}

export default function DetectionShowcase() {
  const [active, setActive] = useState(0)
  const s = samples[active]!
  const prev = () => setActive(i => (i - 1 + samples.length) % samples.length)
  const next = () => setActive(i => (i + 1) % samples.length)

  return (
    <div className="showcase-section">
      <div className="showcase-header">
        <div className="showcase-header-left">
          <span className="showcase-badge">Dataset Sample</span>
          <span className="showcase-title">Detection Results</span>
        </div>
        <div className="showcase-nav">
          <button className="showcase-nav-btn" onClick={prev} aria-label="Previous">
            <ChevronLeft size={16} />
          </button>
          <span className="showcase-nav-count">{active + 1} / {samples.length}</span>
          <button className="showcase-nav-btn" onClick={next} aria-label="Next">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="showcase-body"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {/* Image */}
            <div className="showcase-img-wrap">
              <img src={s.src} alt={s.title} className="showcase-img" />
              <div className={`showcase-img-badge ${s.status === 'DANGER' ? 'danger' : 'safe'}`}>
                {s.status === 'DANGER'
                  ? <AlertOctagon size={13} strokeWidth={2.5} />
                  : <ShieldCheck size={13} strokeWidth={2.5} />
                }
                {s.status}
              </div>
            </div>

            {/* Result panel */}
            <div className="showcase-result">
              <div className={`status-banner ${s.status === 'DANGER' ? 'danger' : 'safe'}`}>
                <div className="status-icon-box">
                  {s.status === 'DANGER'
                    ? <AlertOctagon size={22} color="#fff" strokeWidth={2.5} />
                    : <ShieldCheck   size={22} color="#fff" strokeWidth={2.5} />
                  }
                </div>
                <div className="status-text">
                  <div className="status-label">Status</div>
                  <div className="status-value">{s.status}</div>
                  <p className="status-reason">{s.reason}</p>
                </div>
              </div>

              <div className="showcase-section-label">Detections</div>
              <div className="detection-list" style={{ marginBottom: 14 }}>
                {s.detections.map((d, i) => (
                  <div key={i} className="detection-row">
                    <span className="detection-dot" style={{ background: DOT_COLOR[d.cls] }} />
                    <span className="detection-name">{d.cls}</span>
                    <span className="detection-conf">{(d.conf * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>

              <div className="showcase-thumbs">
                {samples.map((sm, i) => (
                  <button
                    key={i}
                    className={`showcase-thumb ${i === active ? 'active' : ''}`}
                    onClick={() => setActive(i)}
                    title={sm.title}
                  >
                    <img src={sm.src} alt={sm.title} />
                    <span className={`showcase-thumb-dot ${sm.status === 'DANGER' ? 'danger' : 'safe'}`} />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
      </AnimatePresence>
    </div>
  )
}
