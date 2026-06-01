import type { ReactElement } from 'react'

type SceneState = 'idle' | 'safe' | 'danger'

type Props = {
  state: SceneState
}

const labelMap: Record<SceneState, string> = {
  idle: 'AWAITING INPUT',
  safe: 'CLEAR. TRAIN PASSING',
  danger: 'OBSTACLE DETECTED. BRAKING',
}

export default function TrainScene({ state }: Props) {
  return (
    <div className="train-scene-wrap">
      <div className="scene-header">
        <div className="scene-label">TRACK MONITOR</div>
        <div className={`scene-label-status ${state}`}>{labelMap[state]}</div>
      </div>
      <div className="train-scene">
        <div className="train-scene-sky" />
        <div className="train-scene-ground" />
        <div className="train-scene-rail" />
        <div className="train-scene-sleepers" />

        <SignalLamp state={state} />
        <Train key={state} state={state} />
        {state === 'danger' && <BrakeSparks />}
      </div>
    </div>
  )
}

function Coupling({ x }: { x: number }) {
  return (
    <g>
      <rect x={x} y={42} width={10} height={5} rx={1} fill="#1a1411" stroke="#3a2e26" strokeWidth="0.5" />
      <circle cx={x + 1.5} cy={44.5} r={1.2} fill="#3a2e26" />
      <circle cx={x + 8.5} cy={44.5} r={1.2} fill="#3a2e26" />
    </g>
  )
}

type WagonVariant = 'box' | 'tank' | 'flatbed' | 'passenger' | 'hopper' | 'logging' | 'reefer' | 'oil'

function Wheel({ cx, state }: { cx: number; state: SceneState }) {
  const spinAnim = state === 'danger' ? 'none' : 'spin 0.8s linear infinite'
  return (
    <g>
      <circle cx={cx} cy={45} r={9} fill="#1a1411" stroke="#3a2e26" strokeWidth={2} />
      <circle cx={cx} cy={45} r={3} fill="#f59e0b" />
      <g style={{ transformOrigin: `${cx}px 45px`, animation: spinAnim }}>
        <line x1={cx} y1={38} x2={cx} y2={52} stroke="#3a2e26" strokeWidth={1.5} />
        <line x1={cx - 7} y1={45} x2={cx + 7} y2={45} stroke="#3a2e26" strokeWidth={1.5} />
      </g>
    </g>
  )
}

function BoxWagon({ state }: { state: SceneState }) {
  return (
    <g>
      <rect x={-1} y={11} width={46} height={4} rx={1} fill="#3a2e26" />
      <rect x={0} y={15} width={44} height={26} rx={2} fill="url(#loco-body)" stroke="#000" strokeOpacity={0.4} />
      <rect x={6} y={20} width={32} height={12} fill="#0a0807" rx={1} />
      <line x1={22} y1={20} x2={22} y2={32} stroke="#3a2e26" strokeWidth={0.5} />
      <rect x={3} y={36} width={38} height={2} fill="#3a2e26" opacity={0.5} />
      <Wheel cx={10} state={state} />
      <Wheel cx={34} state={state} />
    </g>
  )
}

function TankWagon({ state }: { state: SceneState }) {
  return (
    <g>
      {/* chassis */}
      <rect x={0} y={36} width={44} height={5} fill="#1a1411" />
      {/* tank body */}
      <rect x={2} y={17} width={40} height={20} rx={10} fill="url(#tank-body)" stroke="#000" strokeOpacity={0.4} />
      {/* end caps */}
      <ellipse cx={2} cy={27} rx={2.5} ry={10} fill="#3a2e26" />
      <ellipse cx={42} cy={27} rx={2.5} ry={10} fill="#3a2e26" />
      {/* dome / valve */}
      <rect x={19} y={12} width={6} height={6} fill="#3a2e26" />
      <circle cx={22} cy={12} r={3} fill="#f59e0b" opacity={0.7} />
      {/* hazard band */}
      <rect x={18} y={24} width={8} height={6} fill="#f59e0b" opacity={0.85} />
      <text x={22} y={29} textAnchor="middle" fontSize="5" fill="#1a1411" fontWeight="bold">!</text>
      <Wheel cx={10} state={state} />
      <Wheel cx={34} state={state} />
    </g>
  )
}

function FlatbedWagon({ state }: { state: SceneState }) {
  return (
    <g>
      {/* deck */}
      <rect x={0} y={32} width={44} height={9} rx={1} fill="#1a1411" stroke="#3a2e26" strokeWidth={0.5} />
      <rect x={0} y={36} width={44} height={1.5} fill="#3a2e26" opacity={0.6} />
      {/* shipping container on top */}
      <rect x={3} y={15} width={38} height={17} rx={1} fill="url(#container)" stroke="#000" strokeOpacity={0.4} />
      {/* container ribs */}
      <line x1={11} y1={16} x2={11} y2={31} stroke="#0a0807" strokeWidth={0.6} />
      <line x1={19} y1={16} x2={19} y2={31} stroke="#0a0807" strokeWidth={0.6} />
      <line x1={27} y1={16} x2={27} y2={31} stroke="#0a0807" strokeWidth={0.6} />
      <line x1={35} y1={16} x2={35} y2={31} stroke="#0a0807" strokeWidth={0.6} />
      {/* logo plate */}
      <rect x={14} y={21} width={16} height={5} fill="#0a0807" opacity={0.7} />
      <text x={22} y={25.2} textAnchor="middle" fontSize="3.5" fill="#f59e0b" fontFamily="monospace">CV</text>
      <Wheel cx={10} state={state} />
      <Wheel cx={34} state={state} />
    </g>
  )
}

function PassengerWagon({ state }: { state: SceneState }) {
  const lit = state !== 'danger'
  return (
    <g>
      {/* roof */}
      <rect x={-1} y={12} width={46} height={4} rx={1} fill="#3a2e26" />
      <rect x={1} y={11} width={42} height={2} rx={1} fill="#221c19" />
      {/* body */}
      <rect x={0} y={16} width={44} height={25} rx={2} fill="url(#loco-body)" stroke="#000" strokeOpacity={0.4} />
      {/* belt */}
      <rect x={0} y={36} width={44} height={2} fill="#f59e0b" opacity={0.7} />
      {/* row of windows */}
      {[3, 12, 21, 30].map((wx) => (
        <rect
          key={wx}
          x={wx}
          y={20}
          width={7}
          height={9}
          rx={0.5}
          fill={lit ? 'url(#window)' : '#0a0807'}
          stroke="#1a1411"
          strokeWidth={0.5}
        />
      ))}
      {/* door */}
      <rect x={39} y={20} width={3.5} height={14} fill="#0a0807" stroke="#3a2e26" strokeWidth={0.4} />
      <Wheel cx={10} state={state} />
      <Wheel cx={34} state={state} />
    </g>
  )
}

function HopperWagon({ state }: { state: SceneState }) {
  return (
    <g>
      {/* trapezoidal hopper body */}
      <polygon points="0,15 44,15 38,41 6,41" fill="url(#loco-body)" stroke="#000" strokeOpacity={0.4} />
      {/* top rim */}
      <rect x={-1} y={13} width={46} height={3} fill="#3a2e26" />
      {/* grain visible at top */}
      <rect x={2} y={16} width={40} height={3} fill="#b45309" opacity={0.7} />
      <circle cx={10} cy={17} r={1.2} fill="#f59e0b" opacity={0.8} />
      <circle cx={22} cy={17} r={1.2} fill="#f59e0b" opacity={0.8} />
      <circle cx={34} cy={17} r={1.2} fill="#f59e0b" opacity={0.8} />
      {/* discharge cones at bottom */}
      <polygon points="14,41 20,41 17,46" fill="#1a1411" />
      <polygon points="24,41 30,41 27,46" fill="#1a1411" />
      <Wheel cx={10} state={state} />
      <Wheel cx={34} state={state} />
    </g>
  )
}

function LoggingWagon({ state }: { state: SceneState }) {
  return (
    <g>
      {/* deck */}
      <rect x={0} y={34} width={44} height={7} rx={1} fill="#1a1411" stroke="#3a2e26" strokeWidth={0.5} />
      {/* stanchions */}
      <rect x={1} y={20} width={1.5} height={16} fill="#3a2e26" />
      <rect x={41.5} y={20} width={1.5} height={16} fill="#3a2e26" />
      {/* logs (stacked) */}
      <ellipse cx={4} cy={32} rx={2} ry={2.2} fill="#7c5a3a" stroke="#3a2e26" strokeWidth={0.4} />
      <ellipse cx={9} cy={32} rx={2} ry={2.2} fill="#8b6a47" stroke="#3a2e26" strokeWidth={0.4} />
      <ellipse cx={14} cy={32} rx={2} ry={2.2} fill="#7c5a3a" stroke="#3a2e26" strokeWidth={0.4} />
      <ellipse cx={19} cy={32} rx={2} ry={2.2} fill="#8b6a47" stroke="#3a2e26" strokeWidth={0.4} />
      <ellipse cx={24} cy={32} rx={2} ry={2.2} fill="#7c5a3a" stroke="#3a2e26" strokeWidth={0.4} />
      <ellipse cx={29} cy={32} rx={2} ry={2.2} fill="#8b6a47" stroke="#3a2e26" strokeWidth={0.4} />
      <ellipse cx={34} cy={32} rx={2} ry={2.2} fill="#7c5a3a" stroke="#3a2e26" strokeWidth={0.4} />
      <ellipse cx={39} cy={32} rx={2} ry={2.2} fill="#8b6a47" stroke="#3a2e26" strokeWidth={0.4} />
      {/* upper layer */}
      <ellipse cx={6.5} cy={28} rx={2} ry={2.2} fill="#6b4d2e" stroke="#3a2e26" strokeWidth={0.4} />
      <ellipse cx={11.5} cy={28} rx={2} ry={2.2} fill="#7c5a3a" stroke="#3a2e26" strokeWidth={0.4} />
      <ellipse cx={16.5} cy={28} rx={2} ry={2.2} fill="#6b4d2e" stroke="#3a2e26" strokeWidth={0.4} />
      <ellipse cx={21.5} cy={28} rx={2} ry={2.2} fill="#7c5a3a" stroke="#3a2e26" strokeWidth={0.4} />
      <ellipse cx={26.5} cy={28} rx={2} ry={2.2} fill="#6b4d2e" stroke="#3a2e26" strokeWidth={0.4} />
      <ellipse cx={31.5} cy={28} rx={2} ry={2.2} fill="#7c5a3a" stroke="#3a2e26" strokeWidth={0.4} />
      <ellipse cx={36.5} cy={28} rx={2} ry={2.2} fill="#6b4d2e" stroke="#3a2e26" strokeWidth={0.4} />
      <Wheel cx={10} state={state} />
      <Wheel cx={34} state={state} />
    </g>
  )
}

function ReeferWagon({ state }: { state: SceneState }) {
  return (
    <g>
      {/* roof with cooling units */}
      <rect x={-1} y={11} width={46} height={4} rx={1} fill="#3a2e26" />
      <rect x={6} y={8} width={6} height={4} fill="#1a1411" />
      <rect x={32} y={8} width={6} height={4} fill="#1a1411" />
      {/* white refrigerated body */}
      <rect x={0} y={15} width={44} height={26} rx={2} fill="url(#reefer-body)" stroke="#000" strokeOpacity={0.4} />
      {/* horizontal ribs */}
      <line x1={2} y1={20} x2={42} y2={20} stroke="#3a2e26" strokeWidth={0.4} opacity={0.5} />
      <line x1={2} y1={26} x2={42} y2={26} stroke="#3a2e26" strokeWidth={0.4} opacity={0.5} />
      <line x1={2} y1={32} x2={42} y2={32} stroke="#3a2e26" strokeWidth={0.4} opacity={0.5} />
      {/* snowflake mark */}
      <text x={22} y={29} textAnchor="middle" fontSize="6" fill="#3a8fb7">CV</text>
      <rect x={3} y={36} width={38} height={2} fill="#3a2e26" opacity={0.5} />
      <Wheel cx={10} state={state} />
      <Wheel cx={34} state={state} />
    </g>
  )
}

function OilTankWagon({ state }: { state: SceneState }) {
  return (
    <g>
      {/* chassis */}
      <rect x={0} y={36} width={44} height={5} fill="#1a1411" />
      {/* black oil tank */}
      <rect x={2} y={18} width={40} height={18} rx={9} fill="#0a0807" stroke="#3a2e26" strokeWidth={0.5} />
      <ellipse cx={2} cy={27} rx={2.5} ry={9} fill="#1a1411" />
      <ellipse cx={42} cy={27} rx={2.5} ry={9} fill="#1a1411" />
      {/* highlight */}
      <rect x={6} y={20} width={32} height={1.5} fill="#3a2e26" opacity={0.7} />
      {/* label */}
      <rect x={16} y={25} width={12} height={5} fill="#f59e0b" />
      <text x={22} y={29} textAnchor="middle" fontSize="3.5" fill="#0a0807" fontWeight="bold">OIL</text>
      {/* dome */}
      <rect x={20} y={14} width={4} height={4} fill="#3a2e26" />
      <Wheel cx={10} state={state} />
      <Wheel cx={34} state={state} />
    </g>
  )
}

const WAGON_RENDERERS: Record<WagonVariant, (state: SceneState) => ReactElement> = {
  box: (s) => <BoxWagon state={s} />,
  tank: (s) => <TankWagon state={s} />,
  flatbed: (s) => <FlatbedWagon state={s} />,
  passenger: (s) => <PassengerWagon state={s} />,
  hopper: (s) => <HopperWagon state={s} />,
  logging: (s) => <LoggingWagon state={s} />,
  reefer: (s) => <ReeferWagon state={s} />,
  oil: (s) => <OilTankWagon state={s} />,
}

function Wagon({ x, variant, state }: { x: number; variant: WagonVariant; state: SceneState }) {
  return <g transform={`translate(${x}, 13)`}>{WAGON_RENDERERS[variant](state)}</g>
}

function Train({ state }: { state: SceneState }) {
  return (
    <svg
      className={`train-svg ${state}`}
      viewBox="0 0 510 80"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="loco-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a2e26" />
          <stop offset="50%" stopColor="#221c19" />
          <stop offset="100%" stopColor="#0d0a08" />
        </linearGradient>
        <linearGradient id="loco-roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id="window" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="tank-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a4a3e" />
          <stop offset="50%" stopColor="#3a2e26" />
          <stop offset="100%" stopColor="#1a1411" />
        </linearGradient>
        <linearGradient id="container" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c2410c" />
          <stop offset="100%" stopColor="#7c2d12" />
        </linearGradient>
        <linearGradient id="reefer-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e5e7eb" />
          <stop offset="100%" stopColor="#9ca3af" />
        </linearGradient>
      </defs>

      {/* Varied wagon consist (rearmost first → toward locomotive) */}
      <Wagon x={0}   variant="logging"   state={state} />
      <Coupling x={42} />
      <Wagon x={50}  variant="passenger" state={state} />
      <Coupling x={92} />
      <Wagon x={100} variant="hopper"    state={state} />
      <Coupling x={142} />
      <Wagon x={150} variant="reefer"    state={state} />
      <Coupling x={192} />
      <Wagon x={200} variant="flatbed"   state={state} />
      <Coupling x={242} />
      <Wagon x={250} variant="tank"      state={state} />
      <Coupling x={292} />

      {/* Coal car (closest to loco) — body bottom y=41 (group) = real 54, wheels real cy=58 (bottom 67) */}
      <g transform="translate(300, 13)">
        <rect x="0" y="11" width="58" height="30" rx="3" fill="url(#loco-body)" stroke="#000" strokeOpacity="0.4" />
        <rect x="4" y="15" width="50" height="20" fill="#0a0807" />
        {/* coal lumps */}
        <circle cx="14" cy="19" r="4" fill="#1a1411" />
        <circle cx="26" cy="17" r="5" fill="#1a1411" />
        <circle cx="40" cy="19" r="4" fill="#1a1411" />
        {/* wheels r=9 (matching loco) */}
        <circle cx="14" cy="45" r="9" fill="#1a1411" stroke="#3a2e26" strokeWidth="2" />
        <circle cx="44" cy="45" r="9" fill="#1a1411" stroke="#3a2e26" strokeWidth="2" />
        <circle cx="14" cy="45" r="3" fill="#f59e0b" />
        <circle cx="44" cy="45" r="3" fill="#f59e0b" />
        {/* spinning spokes */}
        <g style={{ transformOrigin: '14px 45px', animation: state === 'danger' ? 'none' : 'spin 0.8s linear infinite' }}>
          <line x1={14} y1={38} x2={14} y2={52} stroke="#3a2e26" strokeWidth={1.5} />
          <line x1={7} y1={45} x2={21} y2={45} stroke="#3a2e26" strokeWidth={1.5} />
        </g>
        <g style={{ transformOrigin: '44px 45px', animation: state === 'danger' ? 'none' : 'spin 0.8s linear infinite' }}>
          <line x1={44} y1={38} x2={44} y2={52} stroke="#3a2e26" strokeWidth={1.5} />
          <line x1={37} y1={45} x2={51} y2={45} stroke="#3a2e26" strokeWidth={1.5} />
        </g>
      </g>

      {/* Coupling: coal car → locomotive */}
      <Coupling x={356} />

      {/* Locomotive */}
      <g transform="translate(364, 0)">
        {/* Smokestack */}
        <rect x="22" y="14" width="10" height="14" fill="#1a1411" />
        <ellipse cx="27" cy="14" rx="6" ry="2" fill="#3a2e26" />
        {/* smoke puffs */}
        <circle cx="27" cy="9" r="3" fill="#6b635a" opacity="0.6">
          <animate attributeName="cy" values="9;-2;9" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0;0.6" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="r" values="3;6;3" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <circle cx="29" cy="6" r="2.5" fill="#6b635a" opacity="0.5">
          <animate attributeName="cy" values="6;-6;6" dur="2.4s" begin="0.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="2.4s" begin="0.4s" repeatCount="indefinite" />
        </circle>

        {/* Cabin */}
        <rect x="0" y="28" width="36" height="26" rx="2" fill="url(#loco-body)" stroke="#000" strokeOpacity="0.4" />
        <rect x="4" y="32" width="14" height="14" fill="url(#window)" rx="1" />
        {/* roof */}
        <rect x="-2" y="24" width="40" height="6" rx="1" fill="url(#loco-roof)" />

        {/* Boiler (cylinder front) */}
        <rect x="36" y="30" width="80" height="24" rx="3" fill="url(#loco-body)" stroke="#000" strokeOpacity="0.4" />
        <rect x="38" y="34" width="76" height="2" fill="#f59e0b" opacity="0.4" />
        <rect x="38" y="48" width="76" height="2" fill="#f59e0b" opacity="0.4" />
        {/* Front bumper */}
        <rect x="116" y="36" width="6" height="12" fill="#3a2e26" />
        <polygon points="116,30 122,30 130,38 130,46 122,54 116,54" fill="#1a1411" />
        {/* Headlight */}
        <circle cx="124" cy="42" r="3" fill={state === 'danger' ? '#ef4444' : '#fbbf24'}>
          {state === 'danger' && (
            <animate attributeName="opacity" values="1;0.3;1" dur="0.4s" repeatCount="indefinite" />
          )}
        </circle>

        {/* Wheels — cabin wheel + 3 drive wheels under boiler (all r=9) */}
        <circle cx="14" cy="58" r="9" fill="#1a1411" stroke="#3a2e26" strokeWidth="2" />
        <circle cx="14" cy="58" r="3" fill="#f59e0b" />
        <circle cx="48" cy="58" r="9" fill="#1a1411" stroke="#3a2e26" strokeWidth="2" />
        <circle cx="76" cy="58" r="9" fill="#1a1411" stroke="#3a2e26" strokeWidth="2" />
        <circle cx="104" cy="58" r="9" fill="#1a1411" stroke="#3a2e26" strokeWidth="2" />
        <circle cx="48" cy="58" r="3" fill="#f59e0b" />
        <circle cx="76" cy="58" r="3" fill="#f59e0b" />
        <circle cx="104" cy="58" r="3" fill="#f59e0b" />
        {/* wheel spokes (rotation) */}
        <g style={{ transformOrigin: '14px 58px', animation: state === 'danger' ? 'none' : 'spin 0.8s linear infinite' }}>
          <line x1="14" y1="51" x2="14" y2="65" stroke="#3a2e26" strokeWidth="1.5" />
          <line x1="7" y1="58" x2="21" y2="58" stroke="#3a2e26" strokeWidth="1.5" />
        </g>
        <g style={{ transformOrigin: '48px 58px', animation: state === 'danger' ? 'none' : 'spin 0.8s linear infinite' }}>
          <line x1="48" y1="51" x2="48" y2="65" stroke="#3a2e26" strokeWidth="1.5" />
          <line x1="41" y1="58" x2="55" y2="58" stroke="#3a2e26" strokeWidth="1.5" />
        </g>
        <g style={{ transformOrigin: '76px 58px', animation: state === 'danger' ? 'none' : 'spin 0.8s linear infinite' }}>
          <line x1="76" y1="51" x2="76" y2="65" stroke="#3a2e26" strokeWidth="1.5" />
          <line x1="69" y1="58" x2="83" y2="58" stroke="#3a2e26" strokeWidth="1.5" />
        </g>
        <g style={{ transformOrigin: '104px 58px', animation: state === 'danger' ? 'none' : 'spin 0.8s linear infinite' }}>
          <line x1="104" y1="51" x2="104" y2="65" stroke="#3a2e26" strokeWidth="1.5" />
          <line x1="97" y1="58" x2="111" y2="58" stroke="#3a2e26" strokeWidth="1.5" />
        </g>

        {/* Cow catcher */}
        <polygon points="122,54 134,54 130,62 126,62" fill="#3a2e26" />
      </g>
    </svg>
  )
}

function SignalLamp({ state }: { state: SceneState }) {
  return (
    <div className={`signal-lamp ${state}`}>
      <div className="signal-lamp-light" />
      <div className="signal-lamp-pole" />
    </div>
  )
}

function BrakeSparks() {
  return (
    <svg
      className="brake-sparks"
      style={{ left: 'calc(40% + 100px)' }}
      viewBox="0 0 60 30"
      xmlns="http://www.w3.org/2000/svg"
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <circle
          key={i}
          cx={6 + i * 6}
          cy={20 + Math.sin(i) * 5}
          r={1.2 + (i % 3) * 0.4}
          fill={i % 2 === 0 ? '#fbbf24' : '#f59e0b'}
        />
      ))}
      <line x1="0" y1="22" x2="58" y2="22" stroke="#fbbf24" strokeWidth="0.5" opacity="0.6" />
    </svg>
  )
}
