import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import type { FlightRecord } from '@rayfin-app/shared';
import App from './App';

const mock = vi.hoisted(() => ({ rows: [] as FlightRecord[], create: vi.fn() }));

vi.mock('./lib/rayfin-client', () => {
  const query = { where: () => query, orderBy: () => query, first: () => query, execute: async () => mock.rows };
  return { getRayfinClient: async () => ({ data: { FlightRecord: { select: () => query, create: mock.create } } }) };
});

vi.mock('./flight-audio', () => ({
  FlightAudio: class {
    async unlock() {}
    dispose() {}
    music() {}
    mute() {}
    cue() {}
  },
}));

describe('Reindeer Games', () => {
  beforeEach(() => {
    mock.rows = [];
    mock.create.mockReset().mockImplementation(async (row: FlightRecord) => {
      mock.rows = [row];
      return row;
    });
    vi.stubGlobal('matchMedia', () => ({
      matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('loads the saved leaderboard before starting a flight', async () => {
    mock.rows = [{ id: 'existing', alias: 'Dasher', score: 12 }];
    render(<App />);
    expect(await screen.findByText('Dasher')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Start flight' })).toBeVisible();
  });

  it('scores the first hoop, ends after three misses, and saves a record alias', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(.5);
    let frame: FrameRequestCallback | undefined;
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => { frame = callback; return 1; });
    vi.stubGlobal('cancelAnimationFrame', () => { frame = undefined; });
    const app = render(<App />);
    await screen.findByText(/No records yet/);
    fireEvent.click(screen.getByRole('button', { name: 'Start flight' }));
    act(() => { for (let time = 0; time <= 3100; time += 25) frame?.(time); });
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    act(() => { for (let time = 3125; time <= 12000; time += 25) frame?.(time); });
    expect(await screen.findByRole('heading', { name: 'New flight record!' })).toBeVisible();
    expect(screen.getByLabelText('0 of 3 lives left')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Your pilot alias'), { target: { value: '  Comet  ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save record' }));
    expect(await screen.findByText('Your alias is on the leaderboard.')).toBeVisible();
    expect(mock.create).toHaveBeenCalledWith(expect.objectContaining({ alias: 'Comet', score: 1 }));
    app.unmount();
    render(<App />);
    expect(await screen.findByText('Comet')).toBeVisible();
  });
});
