export default function Footer() {
  return (
    <footer className="rl-footer">
      <div className="rl-footer-content">
        <div className="rl-footer-brand">Railroad CV</div>
        <div className="rl-footer-text">
          Realtime Obstacle Detection for Railway Level Crossings
        </div>
        <div className="rl-footer-credits">
          Copyright {new Date().getFullYear()} Group 11, Computer Vision Class LC01
        </div>
      </div>
    </footer>
  )
}
