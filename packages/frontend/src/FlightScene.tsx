import { HEIGHT, WIDTH, project, type Flight } from './flight';

const hash = (n: number) => ((Math.sin(n * 127.1 + 31.7) * 43758.5453) % 1 + 1) % 1;
const stars = Array.from({ length: 92 }, (_, i) => ({
  x: hash(i + 11) * 1000, y: hash(i + 130) * 450, r: 0.6 + hash(i + 249) * 1.8,
}));
const trees = Array.from({ length: 36 }, (_, i) => ({
  x: i * 31 - 24 + hash(i + 55) * 20,
  y: 465 + hash(i + 98) * 95,
  scale: 0.49 + hash(i + 51) * 0.66,
}));
const glints = Array.from({ length: 19 }, (_, i) => ({
  x: (hash(i + 360) - .5) * 112,
  y: 29 + hash(i + 391) * 110,
  size: 2 + hash(i + 410) * 4.5,
  delay: `${-hash(i + 440) * 2}s`,
  duration: `${1 + hash(i + 480) * 1.15}s`,
}));
const sparkle = 'M0-1Q.15-.15 1 0Q.15.15 0 1Q-.15.15-1 0Q-.15-.15 0-1Z';
const antler = 'M13-34q10-9 12-24l8-20m-10 27q13-7 19-25l3-12M32-62q13 2 22-13m-29 15q-7-8-5-21';

function Fir({ snow = false }: { snow?: boolean }) {
  return <>
    <path d="M-5 0h10v16H-5z" fill="#604e43" />
    <path d="M0-108 18-70 11-71 28-45 19-47 38-17 27-19 47 5Q0 24-47 5l20-24-11 2 19-30-9 2 17-26-7 1Z" fill="currentColor" />
    {snow && <path d="M0-108 16-74 5-78-7-74l-9-2Zm-12 42L-24-47l13 3 12-6 10 4 14-2-12-19-5 8-11 2Zm-8 26-15 24 16 3 15-8 11 5 24-1-12-20-11 12-15 1Zm-9 24L-44 4l21 6 13-9 15 7 11-6 13 5 16-4-13-17-10 9-17 1-15-5-9 6Z" fill="#a5cecc" opacity=".8" />}
  </>;
}

function Deer({ x, y, scale, angle }: { x: number; y: number; scale: number; angle: number }) {
  return <g data-testid="rear-view-reindeer" transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}>
    <g className="sparkle-trail" data-testid="sparkle-trail">
      {glints.map(({ x: sx, y: sy, size, delay, duration }, i) =>
        <g key={i} transform={`translate(${sx} ${sy})`}>
          <g className="trail-drift" style={{ animationDelay: delay, animationDuration: duration }}>
            <path d={sparkle} transform={`scale(${size})`} fill={i % 3 === 0 ? '#fff7df' : '#ffd477'} />
          </g>
        </g>)}
    </g>
    <g className="deer-float">
      {[1, -1].map((side) => <g key={side} transform={`scale(${side} 1)`}>
        <path d={antler} fill="none" stroke="#4e2c23" strokeWidth="8" strokeLinecap="round" />
        <path d={antler} fill="none" stroke="#ddb27e" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M13-29q9-18 33-15-3 18-26 20Z" fill="#ce8b59" stroke="#4e2c23" strokeWidth="3" />
        <path d="M23-30q5-9 16-10-4 8-16 10Z" fill="#f1bc94" />
        <path d="M20 2q17-6 22 1l11 12-6 8-16-9-11 6Z" fill="#a96644" stroke="#4e2c23" strokeWidth="3" />
        <path d="m43 23 10-8 5 7-10 8Z" fill="#402a28" />
        <path d="M18 29q18-7 21 5l8 25-9 5-15-21-9 3Z" fill="#ba784c" stroke="#4e2c23" strokeWidth="3" />
        <path d="m35 60 12-5 3 8-9 6Z" fill="#402a28" />
      </g>)}
      <path d="M-24-20Q-21-42 0-41q21-1 24 21L18 4h-36Z" fill="url(#fur)" stroke="#4e2c23" strokeWidth="3" />
      <path d="M-10-31Q0-37 10-31" fill="none" stroke="#f2bf8c" strokeWidth="3" strokeLinecap="round" />
      <path d="M-20-10Q0 0 20-10l2 10Q0 10-22 0Z" fill="#c9443d" stroke="#7b302a" strokeWidth="2.5" />
      <path d="M-16 1Q0-5 16 1q20 13 19 29Q33 49 0 50t-35-20Q-36 14-16 1Z" fill="url(#fur)" stroke="#4e2c23" strokeWidth="3" />
      <path d="M-28 25q8-14 28-14t28 14q-10-7-28-7t-28 7Z" fill="#f3bc87" opacity=".58" />
      <path d="M-20 34q3-13 20-12 17-1 20 12Q18 47 0 47t-20-13Z" fill="#efb981" />
      <path d="M-6 32Q-9 19 3 15q8 11 0 20-4 5-9-3Z" fill="#80513b" stroke="#5d392c" strokeWidth="2" />
      <path d="M-17-6q-14 5-26 2l2 7-9 5q14 6 36-7" fill="#c9443d" stroke="#7b302a" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M-45 7l7 1m16-12 4 4" stroke="#f18f6d" strokeWidth="2" strokeLinecap="round" />
    </g>
  </g>;
}

function Santa({ lookX, lookY }: { lookX: number; lookY: number }) {
  const facing = lookX > 753 ? -1 : 1;
  const tilt = Math.min(20, Math.max(3, (501 - lookY) * .045));
  return <g transform="translate(827 518)">
    <g className="santa-walk" data-testid="cabin-santa">
      <ellipse cy="1" rx="17" ry="4" fill="#213a37" opacity=".28" />
      <path className="santa-boot santa-boot-back" d="M8-17v13h9v5H3v-18Z" fill="#292626" />
      <path className="santa-boot" d="M-4-17v13h-7v5H2v-18Z" fill="#292626" />
      <path d="M-10-39q12-8 22 2 8 9 7 23h-35q-1-15 6-25Z" fill="#c34038" stroke="#692f2d" strokeWidth="2" />
      <path d="M-15-24h33v5h-33Z" fill="#47312d" />
      <path d="M-7-25h7v7h-7Z" fill="#ffcc75" /><path d="M-5-23h3v3h-3Z" fill="#47312d" />
      <path d="M-15-15h34v5h-34Z" fill="#fff0d9" />
      <path d="M10-33q7 2 6 10l-9 4-3-5 5-3-4-4Z" fill="#ec6e55" />
      <circle cx="6" cy="-22" r="3.5" fill="#fff0d9" />
      <g transform={`translate(-3 -43) scale(${facing} 1) rotate(${tilt})`}>
        <path d="M-12 0q1-12 13-10 10 2 11 12L4 10-9 7Z" fill="#f1ad83" stroke="#692f2d" strokeWidth="1.5" />
        <path d="M-13 1q9 5 15 0l8-3q4 7-2 14-7 8-17 1-6-4-4-12Z" fill="#fff3dc" />
        <circle cx="-8" cy="-2" r="1.5" fill="#342821" />
        <circle cx="-13" cy="1" r="3" fill="#efa281" />
        <path d="M-14-6q1-14 16-14 12 0 14 11L7-13l3 7Z" fill="#ce483b" stroke="#692f2d" strokeWidth="1.5" />
        <path d="M-14-6Q-3-10 11-6" fill="none" stroke="#fff3dc" strokeWidth="4.5" strokeLinecap="round" />
        <circle cx="16" cy="-8" r="3.5" fill="#fff3dc" />
      </g>
    </g>
  </g>;
}

function Ring({ x, y, radius, opacity = 1 }: { x: number; y: number; radius: number; opacity?: number }) {
  return <g opacity={opacity} transform={`translate(${x} ${y}) scale(${radius / 100})`}>
    <ellipse rx="101" ry="82" fill="none" stroke="#f9b548" strokeWidth="23" opacity=".19" filter="url(#halo)" />
    <ellipse cx="5" cy="4" rx="100" ry="83" fill="none" stroke="#a95028" strokeWidth="12" />
    <ellipse rx="100" ry="83" fill="none" stroke="url(#ringGold)" strokeWidth="11" />
    <ellipse rx="100" ry="83" fill="none" stroke="#fff4b7" strokeWidth="2" strokeDasharray="2 12" />
    {[0, 60, 120, 180, 240, 300].map((deg) => {
      const a = deg * Math.PI / 180;
      return <circle key={deg} cx={100 * Math.cos(a)} cy={83 * Math.sin(a)} r="3" fill="#fff4c2" />;
    })}
  </g>;
}

export function FlightScene({ flight, active, santa }: { flight: Flight | null; active: boolean; santa: boolean }) {
  return <svg className="flight-art" data-flight-paused={flight && !active ? true : undefined} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <linearGradient id="flightSky" x2="0" y2="1" gradientUnits="objectBoundingBox">
        <stop stopColor="#0c282d" /><stop offset=".52" stopColor="#2b5b59" /><stop offset="1" stopColor="#9cc8bd" />
      </linearGradient>
      <radialGradient id="moonGlow"><stop stopColor="#ffe7ad" stopOpacity=".33" /><stop offset="1" stopColor="#ffe7ad" stopOpacity="0" /></radialGradient>
      <linearGradient id="moonFace" x2=".3" y2="1"><stop stopColor="#fff4c9" /><stop offset="1" stopColor="#e9c78e" /></linearGradient>
      <linearGradient id="ringGold" x2="0" y2="1"><stop stopColor="#fff1b6" /><stop offset=".43" stopColor="#ffd480" /><stop offset="1" stopColor="#df8c37" /></linearGradient>
      <linearGradient id="fur" x2="0" y2="1"><stop stopColor="#f4bc81" /><stop offset=".52" stopColor="#d59356" /><stop offset="1" stopColor="#a6613a" /></linearGradient>
      <linearGradient id="snowField" x2="0" y2="1"><stop stopColor="#bcd9d6" /><stop offset="1" stopColor="#72a5a9" /></linearGradient>
      <linearGradient id="introShade"><stop stopColor="#0a2225" stopOpacity=".93" /><stop offset=".36" stopColor="#0a2225" stopOpacity=".71" /><stop offset=".65" stopColor="#0a2225" stopOpacity="0" /></linearGradient>
      <filter id="halo" x="-.5" y="-.5" width="2" height="2"><feGaussianBlur stdDeviation="9" /></filter>
    </defs>
    <path d="M0 0h1000v600H0z" fill="url(#flightSky)" />
    <circle cx="771" cy="123" r="157" fill="url(#moonGlow)" />
    <path d="M-40 135Q134 95 306 162T623 133 1023 34M510 153q255 11 527-100" fill="none" stroke="#92d2aa" strokeWidth="25" opacity=".09" filter="url(#halo)" />
    {stars.slice(0, 64).map(({ x, y, r }, i) => <circle key={i} cx={x} cy={y * .79} r={r} fill={i % 5 === 0 ? '#ffe8ad' : '#dbebdf'} opacity={.21 + hash(i + 2) * .65} />)}
    <circle cx="771" cy="123" r="49" fill="url(#moonFace)" />
    <path d="M745 98q19-16 35-5l-8 12-17 7Zm28 39q6-17 23-13l9 12-10 15-16 3Zm-29 11q9-7 16 2l-5 9Z" fill="#e2bb81" opacity=".44" />
    <path d="M0 389 91 283l61 45 87-111 109 121 63-56 79 74 119-120 70 68 70-61 100 118 68-70 83 63v246H0Z" fill="#427575" />
    <path d="m50 333 41-50 37 27-30-8-12 12Zm133-44 56-72 64 71-32-14-19 8-15-22-21 7Zm382-10 44-43 50 49-37-15-16 9-12-10Zm154-9 30-27 43 50-30-12-10 5-11-18Z" fill="#a4c6c5" opacity=".72" />
    <path d="M0 414 105 337l101 46 89-58 119 61 95-55 94 72 109-73 75 37 72-44 141 87v190H0Z" fill="#518782" />
    <path d="M0 460q166-75 333-39t303 12q143-61 364-10v177H0Z" fill="#7cacaa" />
    <g color="#487976" opacity=".86">
      {trees.map((tree, i) => <g key={i} transform={`translate(${tree.x} ${tree.y - 49}) scale(${tree.scale * .53})`}><Fir /></g>)}
    </g>
    <path d="M0 485q133-33 260-17 139 17 216 29 140 14 248-31 128-49 276-18v152H0Z" fill="url(#snowField)" />
    <path d="M1000 518q-143-36-287-2-132 29-242 27 121 22 240 3 169-24 289 21M0 530q129-39 258-8l74 18Q155 519 0 570Z" fill="#d2e7df" opacity=".65" />
    <g color="#315e5c">
      {trees.filter((_, i) => i % 2 === 0 && (i < 13 || i > 18)).map((tree, i) =>
        <g key={i} transform={`translate(${tree.x} ${tree.y}) scale(${tree.scale})`}><Fir snow /></g>)}
    </g>
    <g transform="translate(812 509)">
      <path d="M-37-19 0-52l43 28 1 33h-80Z" fill="#603d38" /><path d="M-43-19 0-57l49 33-10 6L0-44l-35 31Z" fill="#e2eee2" />
      <path d="M-25-19h18v15h-18Z" fill="#f5c46e" /><path d="M-16-19v15m-9-8h18" stroke="#7b5543" strokeWidth="2" />
      <path d="M7 9v-29h16V9Z" fill={santa ? '#ffd580' : '#f5c46e'} />
      {santa && <path className="cabin-light" d="M7 9h16l17 15h-53Z" fill="#ffdf91" />}
      <path className={santa ? 'cabin-door-open' : undefined} d="M7 9v-29h16V9Z" fill="#734132" stroke="#4a3330" strokeWidth="1.5" />
      {!santa && <circle cx="19" cy="-5" r="1.3" fill="#f5c46e" />}
      <path d="M25-43v-20h10v27" fill="#6d4940" /><path d="M24-64h13" stroke="#e2eee2" strokeWidth="3" />
      <path d="M-45 10q45-9 98 0" fill="none" stroke="#dcebe1" strokeWidth="6" strokeLinecap="round" />
    </g>
    {santa && flight && <Santa lookX={flight.deer.x} lookY={flight.deer.y} />}
    <g color="#214a48">
      <g transform="translate(988 582) scale(1.6)"><Fir snow /></g>
      <g transform="translate(39 585) scale(1.55)"><Fir snow /></g>
      <g transform="translate(910 600) scale(1.05)"><Fir snow /></g>
      <g transform="translate(108 603) scale(1)"><Fir snow /></g>
    </g>
    {stars.slice(48).map(({ x, y, r }, i) => <circle key={i} cx={x} cy={150 + y} r={r} fill="#f6f1dc" opacity={.28 + hash(i + 4) * .55} />)}
    {!flight && <path d="M0 0h1000v600H0z" fill="url(#introShade)" />}
    {!flight ? <>
      <Ring x={917} y={216} radius={26} opacity={.51} />
      <Ring x={870} y={235} radius={48} opacity={.75} />
      <Ring x={800} y={276} radius={106} />
      <Deer x={748} y={344} scale={1.48} angle={27} />
      <path d="M840 175q13-2 15-15 2 13 15 15-13 2-15 15-2-13-15-15Zm69 150q9-1 10-10 1 9 10 10-9 1-10 10-1-9-10-10Z" fill="#fff1af" />
    </> : <>
      {flight.hoops.slice().reverse().map((hoop) => <Ring key={hoop.id} {...project(hoop)} opacity={hoop.id === flight.hoops[0].id ? 1 : .50} />)}
      <circle cx={flight.deer.x} cy={flight.deer.y} r="23" fill="none" stroke="#fff0ba" strokeDasharray="2 8" strokeWidth="2" opacity=".85" />
      <Deer x={flight.deer.x} y={flight.deer.y} scale={.49} angle={flight.bank} />
    </>}
    {active && flight?.flash ? <path d="M0 0h1000v600H0z" fill="none" stroke={flight.feedback === 'hit' ? '#ffe29a' : '#e2685a'} strokeWidth="18" opacity={flight.flash * .48} /> : null}
  </svg>;
}
