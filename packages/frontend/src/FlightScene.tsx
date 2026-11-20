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

function Fir({ snow = false }: { snow?: boolean }) {
  return <>
    <path d="M-5 0h10v16H-5z" fill="#604e43" />
    <path d="M0-108 18-70 11-71 28-45 19-47 38-17 27-19 47 5Q0 24-47 5l20-24-11 2 19-30-9 2 17-26-7 1Z" fill="currentColor" />
    {snow && <path d="M0-108 16-74 5-78-7-74l-9-2Zm-12 42L-24-47l13 3 12-6 10 4 14-2-12-19-5 8-11 2Zm-8 26-15 24 16 3 15-8 11 5 24-1-12-20-11 12-15 1Zm-9 24L-44 4l21 6 13-9 15 7 11-6 13 5 16-4-13-17-10 9-17 1-15-5-9 6Z" fill="#a5cecc" opacity=".8" />}
  </>;
}

function Deer({ x, y, scale, angle }: { x: number; y: number; scale: number; angle: number }) {
  return <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}>
    <g className="deer-float">
      <path d="M-69 27Q-147 47-175 75m91-25q-65 25-97 55m74-28-39 19" stroke="#f8ce81" strokeWidth="2" opacity=".55" fill="none" strokeLinecap="round" />
      {[[ -126, 54], [-158, 85], [-95, 78], [-115, 93], [-170, 61]].map(([sx, sy], i) =>
        <path key={i} d="M0-5 1-1 5 0 1 1 0 5-1 1-5 0-1-1Z" fill="#ffdb8d" transform={`translate(${sx} ${sy})`} />)}
      <path d="M-62 19Q-89 2-92 11q5 14 29 18" fill="#e1a16d" stroke="#432923" strokeWidth="2.5" />
      <path d="M-40 29-65 51-84 56l-1 9 23-5 36-22m34-15L1 47l-16 13 4 8 21-16L26 27" fill="#a66039" stroke="#442925" strokeWidth="3" strokeLinejoin="round" />
      <path d="M-72 27Q-62 7-35 6l42-3 15-27 30 10L45 9Q32 37 4 41l-36 4q-31 6-40-18Z" fill="url(#fur)" stroke="#4e2c23" strokeWidth="3" />
      <path d="M-57 34q21 13 57-1 19-8 25-25-3 24-25 34l-34 4q-16 0-23-12Z" fill="#f2bc83" opacity=".8" />
      <path d="M-47 38-62 64-78 76l3 8 21-12 24-34m50-12 26 10 19-9 5 7-25 15-33-10" fill="#ca8350" stroke="#4e2c23" strokeWidth="3" strokeLinejoin="round" />
      <path d="m-78 76 8-5 5 8-10 5Zm-7-20 8-3 3 9-11 3Zm147-29 6-4 5 10-9 6Zm-77 33 7-6 5 8-8 6Z" fill="#432b29" />
      <path d="M25-40 13-54 12-77m1 22L2-61l-5-13m16 10 7-13-2-13m26 45-3-15 7-15-4-17m0 22 17-9 4-15m-4 14 15-6" fill="none" stroke="#593729" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M25-40 13-54 12-77m1 22L2-61l-5-13m16 10 7-13-2-13m26 45-3-15 7-15-4-17m0 22 17-9 4-15m-4 14 15-6" fill="none" stroke="#d7a672" strokeWidth="3.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M28-31Q7-30 3-46q18-4 30 9m11 1q8-16 25-15-3 15-18 20" fill="#da9a61" stroke="#4e2c23" strokeWidth="2.5" />
      <path d="M10-44q12 0 17 9-13-1-17-9" fill="#a25e52" />
      <path d="M21-28q4-20 25-18 15 2 17 18l16 5q10 10-1 18l-27 5q-26-4-30-28Z" fill="url(#fur)" stroke="#4e2c23" strokeWidth="3" />
      <path d="M53-20q12 2 24-1 11 8 1 15L56-4q-12-4-3-16Z" fill="#f7c991" />
      <path d="M61-10q6 4 13 0" stroke="#834730" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <ellipse cx="46" cy="-27" rx="4" ry="5" fill="#2d211b" /><circle cx="47" cy="-29" r="1.4" fill="#fff5da" />
      <circle cx="80" cy="-20" r="16" fill="url(#noseGlow)" /><ellipse cx="80" cy="-20" rx="8" ry="6" fill="#ed493e" stroke="#952f2b" strokeWidth="1.5" />
      <ellipse cx="78" cy="-22" rx="3" ry="1.5" fill="#ffb5a2" />
      <path d="M19-8q13 13 30 9l-3 9Q27 13 16 1l-9 11-23 3 7-10-10-3L5-2l14-6Z" fill="#c9443d" stroke="#7b302a" strokeWidth="2" />
      <path d="m-12 4 14-2m-11 8 14-3m18-9q10 9 21 6" stroke="#f18462" strokeWidth="2" strokeLinecap="round" />
      <circle cx="39" cy="12" r="4.5" fill="#ffd47c" stroke="#985a31" strokeWidth="1.5" />
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

export function FlightScene({ flight, active }: { flight: Flight | null; active: boolean }) {
  return <svg className="flight-art" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <linearGradient id="flightSky" x2="0" y2="1" gradientUnits="objectBoundingBox">
        <stop stopColor="#0c282d" /><stop offset=".52" stopColor="#2b5b59" /><stop offset="1" stopColor="#9cc8bd" />
      </linearGradient>
      <radialGradient id="moonGlow"><stop stopColor="#ffe7ad" stopOpacity=".33" /><stop offset="1" stopColor="#ffe7ad" stopOpacity="0" /></radialGradient>
      <radialGradient id="noseGlow"><stop stopColor="#ff7153" stopOpacity=".8" /><stop offset="1" stopColor="#ff7153" stopOpacity="0" /></radialGradient>
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
      <path d="M7 9v-29h16V9m-48-28h18v15h-18Z" fill="#f5c46e" /><path d="M-16-19v15m-9-8h18" stroke="#7b5543" strokeWidth="2" />
      <path d="M25-43v-20h10v27" fill="#6d4940" /><path d="M24-64h13" stroke="#e2eee2" strokeWidth="3" />
      <path d="M-45 10q45-9 98 0" fill="none" stroke="#dcebe1" strokeWidth="6" strokeLinecap="round" />
    </g>
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
      <Deer x={710} y={303} scale={1.35} angle={-11} />
      <path d="M840 175q13-2 15-15 2 13 15 15-13 2-15 15-2-13-15-15Zm69 150q9-1 10-10 1 9 10 10-9 1-10 10-1-9-10-10Z" fill="#fff1af" />
    </> : <>
      {flight.hoops.slice().reverse().map((hoop) => <Ring key={hoop.id} {...project(hoop)} opacity={hoop.id === flight.hoops[0].id ? 1 : .50} />)}
      <circle cx={flight.deer.x} cy={flight.deer.y} r="23" fill="none" stroke="#fff0ba" strokeDasharray="2 8" strokeWidth="2" opacity=".85" />
      <Deer x={flight.deer.x} y={flight.deer.y} scale={.42} angle={flight.bank} />
    </>}
    {active && flight?.flash ? <path d="M0 0h1000v600H0z" fill="none" stroke={flight.feedback === 'hit' ? '#ffe29a' : '#e2685a'} strokeWidth="18" opacity={flight.flash * .48} /> : null}
  </svg>;
}
