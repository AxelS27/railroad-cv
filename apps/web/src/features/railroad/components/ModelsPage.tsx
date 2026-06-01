import { motion } from 'framer-motion'
import HowItWorks from './HowItWorks'
import PreprocessingViz from './PreprocessingViz'

export default function ModelsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="section-header">
        <h2 className="section-title">
          Model <span className="accent">selection.</span>
        </h2>
        <p className="section-subtitle">
          The model page documents the classic computer vision pipeline used by the
          selected RBF SVM classifier.
        </p>
      </div>

      <motion.div
        className="metric-card model-choice-card model-single-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
      >
        <div className="metric-card-label">Computer vision feature extraction with the selected RBF SVM</div>
        <div className="metric-card-value accent">Classic ML</div>
        <p>Direct SAFE or DANGER image classification.</p>
      </motion.div>

      <HowItWorks />
      <PreprocessingViz />
    </motion.div>
  )
}
