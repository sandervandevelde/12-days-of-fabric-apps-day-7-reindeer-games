export const WIDTH = 1000;
export const HEIGHT = 600;
export const START_LIVES = 3;
export const TARGET = { x: 500, y: 295 };
export const VANISH = { x: 500, y: 260 };

export type Point = { x: number; y: number };
export type Hoop = Point & { id: number; z: number };
export type Flight = {
  deer: Point; hoops: Hoop[]; score: number; lives: number;
  elapsed: number; bank: number; feedback: 'hit' | 'miss' | null; flash: number;
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
export const flightSpeed = (elapsed: number) => Math.min(0.88, 0.32 + elapsed * 0.0045);
export const aperture = (id: number) => Math.max(49, 80 - id * 1.3);
export const isRecord = (score: number, best: number) => score > best;

function nextHoop(last: Hoop, random: () => number): Hoop {
  const id = last.id + 1;
  const reach = Math.min(365, 150 + id * 19);
  return {
    id, z: last.z + 0.85,
    x: clamp(last.x + (random() * 2 - 1) * reach, 130, 870),
    y: clamp(last.y + (random() * 2 - 1) * reach * 0.66, 120, 470),
  };
}

export function newFlight(random = Math.random): Flight {
  const first: Hoop = { ...TARGET, id: 0, z: 0.95 };
  const second = nextHoop(first, random);
  return {
    deer: { ...TARGET }, hoops: [first, second, nextHoop(second, random)],
    score: 0, lives: START_LIVES, elapsed: 0, bank: 0, feedback: null, flash: 0,
  };
}

export function project(hoop: Hoop) {
  const scale = 1 / (1 + Math.max(0, hoop.z) * 2.25);
  return {
    x: VANISH.x + (hoop.x - VANISH.x) * scale,
    y: VANISH.y + (hoop.y - VANISH.y) * scale,
    radius: aperture(hoop.id) * scale,
    scale,
  };
}

export function advanceFlight(flight: Flight, direction: Point, dt: number, random = Math.random): Flight {
  if (!flight.lives) return flight;
  const elapsed = flight.elapsed + dt;
  const norm = Math.max(1, Math.hypot(direction.x, direction.y));
  const deer = {
    x: clamp(flight.deer.x + direction.x * 355 * dt / norm, 55, 945),
    y: clamp(flight.deer.y + direction.y * 355 * dt / norm, 55, 545),
  };
  const hoops = flight.hoops.map((hoop) => ({ ...hoop, z: hoop.z - flightSpeed(elapsed) * dt }));
  const target = hoops[0];
  const bank = flight.bank + (direction.x * 13 - flight.bank) * Math.min(dt * 9, 1);
  const next = { ...flight, deer, hoops, elapsed, bank, flash: Math.max(0, flight.flash - dt) };
  if (target.z > 0) return next;

  const hit = Math.hypot(deer.x - target.x, (deer.y - target.y) / 0.83) <= aperture(target.id) - 8;
  return {
    ...next, hoops: [...hoops.slice(1), nextHoop(hoops[hoops.length - 1], random)],
    score: flight.score + Number(hit), lives: flight.lives - Number(!hit),
    feedback: hit ? 'hit' : 'miss', flash: 0.65,
  };
}
