import { describe, expect, it } from 'vitest';
import { advanceFlight, flightSpeed, isRecord, newFlight, project } from './flight';

describe('flight simulation', () => {
  it('opens with a centered hoop and randomizes the later route', () => {
    const a = newFlight(() => 0);
    const b = newFlight(() => 1);
    expect(a.hoops[0]).toEqual(b.hoops[0]);
    expect(a.hoops[1].x).toBeLessThan(b.hoops[1].x);
    expect(a.hoops[1].y).toBeLessThan(b.hoops[1].y);
    expect(a.lives).toBe(3);
  });

  it('grows hoops with depth and gradually raises the pace to a cap', () => {
    const hoop = newFlight().hoops[0];
    expect(project({ ...hoop, z: 0 }).radius).toBeGreaterThan(project(hoop).radius);
    expect(flightSpeed(15)).toBeGreaterThan(flightSpeed(0));
    expect(flightSpeed(1000)).toBe(0.88);
  });

  it('counts each crossing once and ends exactly on the third miss', () => {
    const still = { x: 0, y: 0 };
    const crossing = (flight: ReturnType<typeof newFlight>) => ({
      ...flight, hoops: [{ ...flight.hoops[0], z: 0.001 }, ...flight.hoops.slice(1)],
    });
    const hit = advanceFlight(crossing(newFlight(() => 0.5)), still, 0.05, () => .5);
    expect(hit.score).toBe(1);
    expect(advanceFlight(hit, still, 0.05).score).toBe(1);
    let missed = { ...hit, deer: { x: 945, y: 545 } };
    for (let remaining = 2; remaining >= 0; remaining--) {
      missed = advanceFlight(crossing(missed), still, 0.05, () => .5);
      expect(missed.lives).toBe(remaining);
      expect(missed.score).toBe(1);
    }
    expect(advanceFlight(missed, still, 0.05)).toBe(missed);
  });

  it('requires a strictly higher score for a new record', () => {
    expect(isRecord(0, 0)).toBe(false);
    expect(isRecord(8, 8)).toBe(false);
    expect(isRecord(9, 8)).toBe(true);
  });
});
