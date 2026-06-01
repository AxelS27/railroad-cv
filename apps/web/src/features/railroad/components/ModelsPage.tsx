import { motion } from 'framer-motion'
import HowItWorks from './HowItWorks'
import PreprocessingViz from './PreprocessingViz'

const models = [
  {
    name: 'Deep Learning',
    role: 'Object detection and rule-based crossing verdict',
    output: 'Barrier state, obstacle detections, and SAFE or DANGER status',
  },
  {
    name: 'Classic ML',
    role: 'Computer vision feature extraction with the selected RBF SVM',
    output: 'Direct SAFE or DANGER image classification',
  },
]

const preprocessing = [
  'Image resizing',
  'Grayscale and color-space conversion',
  'HOG texture features',
  'HSV color histograms',
  'Local binary pattern texture features',
  'Canny edge density',
  'RBF SVM classification',
]

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
          The upload flow can run the trained deep learning detector or the classic ML
          classifier from the computer vision experiment outputs.
        </p>
      </div>

      <div className="metrics-grid model-choice-grid">
        {models.map((model, index) => (
          <motion.div
            key={model.name}
            className="metric-card model-choice-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <div className="metric-card-label">{model.role}</div>
            <div className="metric-card-value accent">{model.name}</div>
            <p>{model.output}</p>
          </motion.div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Classic ML preprocessing</h3>
        </div>

        <div className="preprocess-list">
          {preprocessing.map((step) => (
            <div className="preprocess-row" key={step}>
              <span className="preprocess-name">{step}</span>
            </div>
          ))}
        </div>
      </div>

      <HowItWorks />
      <PreprocessingViz />
    </motion.div>
  )
}
