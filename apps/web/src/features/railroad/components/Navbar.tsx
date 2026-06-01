type Page = 'home' | 'models' | 'about'

type Props = {
  active: Page
  onChange: (p: Page) => void
}

const links: { id: Page; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'models', label: 'Model' },
  { id: 'about', label: 'About' },
]

export default function Navbar({ active, onChange }: Props) {
  return (
    <nav className="rl-nav">
      <div className="rl-nav-inner">
        <div
          className="rl-nav-brand"
          onClick={() => onChange('home')}
          role="button"
          tabIndex={0}
        >
          <div className="rl-nav-logo">
            Railroad <span className="accent">CV</span>
          </div>
          <div className="rl-nav-divider" />
          <div className="rl-nav-tag">
            Realtime Obstacle Detection<br />for Railway Crossings
          </div>
        </div>

        <ul className="rl-nav-links">
          {links.map((l) => (
            <li key={l.id} className={active === l.id ? 'active' : ''}>
              <button onClick={() => onChange(l.id)}>{l.label}</button>
            </li>
          ))}
        </ul>

        <div className="rl-nav-cta">
          <a
            className="rl-nav-pill"
            href="https://github.com/AxelS27/obstacle-detection"
            target="_blank"
            rel="noreferrer noopener"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1-.02-1.96-3.2.7-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.96 10.96 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.67.8.55C20.22 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/>
            </svg>
            SOURCE
          </a>
        </div>
      </div>
    </nav>
  )
}
