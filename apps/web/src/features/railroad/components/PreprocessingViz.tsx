import { useCallback, useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion'

const steps = [
  {
    title: 'Raw Input',
    subtitle: 'Dataset frame',
    img: '/preprocess/classic-raw.jpg',
    color: '#6366f1',
    desc: 'A real railway crossing frame is loaded from the cleaned model-compvis dataset before any feature extraction is applied.',
    details: [
      'Source: model-compvis dataset_clean',
      'Original crossing camera frame',
      'Same sample is used through every stage',
    ],
  },
  {
    title: 'Resize to 128',
    subtitle: 'Classic ML input size',
    img: '/preprocess/classic-resize.jpg',
    color: '#d97706',
    desc: 'The classic ML pipeline resizes the image to a 128 x 128 square using area interpolation before extracting features.',
    details: [
      'Matches cv_features.py',
      'cv2.INTER_AREA resize',
      'Compact model-ready frame',
    ],
  },
  {
    title: 'Grayscale',
    subtitle: 'Shape and texture base',
    img: '/preprocess/classic-gray.jpg',
    color: '#0ea5e9',
    desc: 'The resized frame is converted to grayscale. HOG, LBP, and Canny features are computed from this channel.',
    details: [
      'cv2.COLOR_BGR2GRAY',
      'Used by shape features',
      'Used by edge extraction',
    ],
  },
  {
    title: 'HSV Histogram',
    subtitle: 'Color feature vector',
    img: '/preprocess/classic-hsv-hist.jpg',
    color: '#ef7d00',
    desc: 'Hue, saturation, and value are summarized into 16-bin histograms per channel, then normalized into color features.',
    details: [
      '16 bins for H, S, and V',
      '48 normalized values',
      'Encodes crossing color distribution',
    ],
  },
  {
    title: 'HOG',
    subtitle: 'Gradient orientation features',
    img: '/preprocess/classic-hog.jpg',
    color: '#10b981',
    desc: 'Histogram of oriented gradients captures shape direction around barriers, vehicles, road markings, and rail edges.',
    details: [
      '9 orientations',
      '16 x 16 pixels per cell',
      'L2-Hys block normalization',
    ],
  },
  {
    title: 'Uniform LBP',
    subtitle: 'Texture pattern features',
    img: '/preprocess/classic-lbp.jpg',
    color: '#8b5cf6',
    desc: 'Local binary patterns summarize repeated texture around the crossing scene before classification.',
    details: [
      'P=8, R=1',
      'Uniform pattern method',
      'Histogram normalized for the classifier',
    ],
  },
  {
    title: 'Canny Edges',
    subtitle: 'Final spatial cue',
    img: '/preprocess/classic-canny.jpg',
    color: '#10b981',
    desc: 'Canny edge density is added as the final scalar feature. These features are concatenated and passed into the classic ML model.',
    details: [
      'Thresholds 80 and 160',
      'Edge count divided by image area',
      'Ready for outputs_clean/best_model.pkl',
    ],
  },
]

function Milestone({
  step,
  index,
  isCheckpointHit,
  onActive,
}: {
  step: typeof steps[0]
  index: number
  isCheckpointHit: boolean
  onActive: (i: number) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isLeft = index % 2 === 0
  const [isReached, setIsReached] = useState(false)

  const { scrollYProgress: local } = useScroll({
    target: ref,
    offset: ['start center', 'end center'],
  })
  useMotionValueEvent(local, 'change', (value) => {
    if (value >= 0.5) setIsReached(true)
    if (value > 0.25 && value < 0.75) onActive(index)
  })

  useEffect(() => {
    if (isCheckpointHit) setIsReached(true)
  }, [isCheckpointHit])

  return (
    <div ref={ref} className="ppviz-milestone">
      <div
        className={`ppviz-milestone-dot-wrap ${isCheckpointHit ? 'active' : ''}`}
        data-ppviz-dot
      >
        {isCheckpointHit && (
          <>
            <motion.div
              className="ppviz-ring"
              style={{ borderColor: step.color }}
              initial={{ scale: 1, opacity: 0.7 }}
              animate={{ scale: 4.5, opacity: 0 }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
            />
            <motion.div
              className="ppviz-ring ppviz-ring-fill"
              style={{ backgroundColor: step.color }}
              initial={{ scale: 1, opacity: 0.4 }}
              animate={{ scale: 2.8, opacity: 0 }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay: 0.75 }}
            />
            <motion.div
              className="ppviz-impact"
              style={{ backgroundColor: step.color }}
              initial={{ scale: 0.8, opacity: 0.95 }}
              animate={{ scale: 7, opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            />
          </>
        )}
        <motion.div
          className="ppviz-milestone-dot"
          animate={{
            scale: isCheckpointHit ? 2.05 : isReached ? 1.45 : 1,
            backgroundColor: isCheckpointHit || isReached ? step.color : 'var(--bg)',
            borderColor: step.color,
            borderWidth: isCheckpointHit || isReached ? 2 : 1,
            opacity: isCheckpointHit || isReached ? 1 : 0.4,
            boxShadow: isCheckpointHit || isReached ? `0 0 42px ${step.color}` : 'none',
          }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        />
      </div>

      <div className={`ppviz-milestone-inner ${isLeft ? '' : 'row-reverse'}`}>
        <motion.div
          className="ppviz-milestone-text"
          initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <h3 className="ppviz-ms-title">{step.title}</h3>
          <p className="ppviz-ms-subtitle">{step.subtitle}</p>
          <p className="ppviz-ms-desc">{step.desc}</p>
          <ul className="ppviz-ms-details">
            {step.details.map((detail) => (
              <li key={detail} className="ppviz-ms-detail-item">
                <span className="ppviz-detail-bullet" style={{ background: step.color }} />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className={`ppviz-img-card ${isCheckpointHit ? 'checkpoint-active' : ''}`}
          initial={{ opacity: 0, x: isLeft ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          animate={{
            boxShadow: isReached
              ? `0 24px 64px -16px ${step.color}50`
              : '0 8px 24px -8px rgba(26,20,16,0.10)',
            borderColor: isReached ? step.color : 'var(--border)',
          }}
        >
          <motion.img
            src={step.img}
            alt={step.title}
            className="ppviz-img"
          />
          <div className="ppviz-img-badge" style={{ background: step.color }}>
            {step.title}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function PreprocessingViz() {
  const [, setActiveIndex] = useState(0)
  const [hitIndex, setHitIndex] = useState(-1)
  const trackRef = useRef<HTMLDivElement>(null)
  const hitTimerRef = useRef<number | null>(null)

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start center', 'end center'],
  })
  const lineScaleY = scrollYProgress

  const handleActive = useCallback((i: number) => setActiveIndex(i), [])

  useEffect(() => {
    let frame = 0

    const updateHitIndex = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const cursor = document.querySelector<HTMLElement>('.ppviz-cursor')
        const cursorRect = cursor?.getBoundingClientRect()
        const centerY = cursorRect
          ? cursorRect.top + cursorRect.height / 2
          : window.innerHeight / 2
        const dots = Array.from(document.querySelectorAll<HTMLElement>('[data-ppviz-dot]'))
        const nextHit = dots.findIndex((dot) => {
          const rect = dot.getBoundingClientRect()
          const dotCenter = rect.top + rect.height / 2
          return Math.abs(dotCenter - centerY) <= 72
        })

        if (nextHit >= 0) {
          setHitIndex(nextHit)
          if (hitTimerRef.current) window.clearTimeout(hitTimerRef.current)
          hitTimerRef.current = window.setTimeout(() => {
            setHitIndex(-1)
            hitTimerRef.current = null
          }, 1200)
        }
      })
    }

    updateHitIndex()
    window.addEventListener('scroll', updateHitIndex, { passive: true })
    window.addEventListener('resize', updateHitIndex)

    return () => {
      cancelAnimationFrame(frame)
      if (hitTimerRef.current) window.clearTimeout(hitTimerRef.current)
      window.removeEventListener('scroll', updateHitIndex)
      window.removeEventListener('resize', updateHitIndex)
    }
  }, [])

  return (
    <section className="ppviz-section">
      <div className="ppviz-header">
        <h2 className="ppviz-title">Classic ML Preprocessing Pipeline</h2>
        <p className="ppviz-sub">
          A real dataset frame transformed through the same computer vision steps used by the classifier.
        </p>
      </div>

      <div ref={trackRef} className="ppviz-track">
        <div className="ppviz-line-bg" />
        <div className="ppviz-line-fill-wrap">
          <motion.div
            className="ppviz-line-fill"
            style={{ scaleY: lineScaleY, originY: 0 }}
          />
        </div>
        <motion.div className="ppviz-cursor">
          <div className="ppviz-cursor-inner" />
        </motion.div>

        {steps.map((step, index) => (
          <Milestone
            key={step.title}
            step={step}
            index={index}
            isCheckpointHit={hitIndex === index}
            onActive={handleActive}
          />
        ))}
      </div>
    </section>
  )
}
