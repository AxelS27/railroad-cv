const items = [
  'RAILWAY CROSSING SAFETY',
  'IMAGE-BASED ANALYSIS',
  'DEEP LEARNING MODEL',
  'CLASSIC ML MODEL',
  'BARRIER STATE MONITORING',
  'COMPUTER VISION PIPELINE',
  'DIRECT SAFETY VERDICT',
]

export default function Ticker() {
  const Loop = () => (
    <div className="rl-ticker-content">
      {items.map((t, i) => (
        <span key={i} className="rl-ticker-item">{t}</span>
      ))}
    </div>
  )
  return (
    <div className="rl-ticker">
      <div className="rl-ticker-track">
        <Loop />
        <Loop />
      </div>
    </div>
  )
}
