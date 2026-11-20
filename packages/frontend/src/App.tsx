//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
//        Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
//-----------------------------------------------------------------------

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUp, AudioLines, CircleDot, Heart, Moon,
  Pause, Play, RotateCcw, Snowflake, Sparkles, Sun, Trophy, VolumeX,
} from 'lucide-react';
import type { FlightRecord } from '@rayfin-app/shared';
import { useAppTheme } from '@/hooks/use-theme';
import { getRayfinClient } from '@/lib/rayfin-client';
import { advanceFlight, flightSpeed, isRecord, newFlight, START_LIVES, type Flight } from './flight';
import { FlightAudio } from './flight-audio';
import { FlightScene } from './FlightScene';

const controls = [
  { key: 'ArrowUp', Icon: ArrowUp, name: 'Up' },
  { key: 'ArrowLeft', Icon: ArrowLeft, name: 'Left' },
  { key: 'ArrowDown', Icon: ArrowDown, name: 'Down' },
  { key: 'ArrowRight', Icon: ArrowRight, name: 'Right' },
];
const scoreText = (n: number) => n.toLocaleString('en-US', { minimumIntegerDigits: 2 });
const confetti = Array.from({ length: 64 }, (_, i) => ({
  left: `${(i * 47) % 101}%`,
  animationDelay: `${(i % 11) * .14}s`,
  animationDuration: `${2.35 + (i % 9) * .19}s`,
}));
const pageSize = 5;

async function readScores() {
  const rows = await (await getRayfinClient()).data.FlightRecord.select(['id', 'alias', 'score'])
    .where({ score: { gt: 0 } }).orderBy({ score: 'desc' }).first(pageSize).execute();
  return rows.filter((row) => typeof row.alias === 'string' && Number.isSafeInteger(row.score) && row.score > 0);
}

function App() {
  const { isDark, toggleTheme } = useAppTheme();
  const [scores, setScores] = useState<FlightRecord[]>([]);
  const [board, setBoard] = useState<'loading' | 'ready' | 'error'>('loading');
  const [phase, setPhase] = useState<'menu' | 'playing' | 'paused' | 'finished'>('menu');
  const [flight, setFlight] = useState<Flight | null>(null);
  const [muted, setMuted] = useState(false);
  const [soundError, setSoundError] = useState(false);
  const [recordCheck, setRecordCheck] = useState<'idle' | 'checking' | 'winner' | 'not-record' | 'error' | 'saved'>('idle');
  const [alias, setAlias] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const audio = useRef<FlightAudio | null>(null);
  const keys = useRef(new Set<string>());
  const sim = useRef<Flight | null>(null);
  const stage = useRef<HTMLElement>(null);
  const mounted = useRef(false);
  const boardRequest = useRef(0);
  const submissionId = useRef<string | null>(null);
  const best = scores[0]?.score ?? 0;

  const refreshBoard = useCallback(async () => {
    const request = ++boardRequest.current;
    try {
      const rows = await readScores();
      if (mounted.current && request === boardRequest.current) {
        setScores(rows);
        setBoard('ready');
      }
      return rows;
    } catch (error) {
      console.warn('Could not load flight records.', error);
      if (mounted.current && request === boardRequest.current) setBoard('error');
      return null;
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    audio.current = new FlightAudio();
    let active = true;
    queueMicrotask(() => { if (active) void refreshBoard(); });
    return () => {
      active = false;
      mounted.current = false;
      audio.current?.dispose();
      audio.current = null;
    };
  }, [refreshBoard]);

  const checkRecord = useCallback(async (score: number) => {
    if (!score) {
      setRecordCheck('not-record');
      return;
    }
    setRecordCheck('checking');
    setBoard('loading');
    const rows = await refreshBoard();
    if (!mounted.current) return;
    if (!rows) {
      setRecordCheck('error');
    } else if (isRecord(score, rows[0]?.score ?? 0)) {
      setRecordCheck('winner');
      audio.current?.cue('winner');
    } else {
      setRecordCheck('not-record');
    }
  }, [refreshBoard]);

  function unlockAudio(cue = false) {
    void audio.current?.unlock().then(() => {
      if (mounted.current) {
        setSoundError(false);
        if (cue) audio.current?.cue('launch');
      }
    }).catch((error: unknown) => {
      console.warn('Could not play flight audio.', error);
      if (mounted.current) setSoundError(true);
    });
  }

  function launch() {
    keys.current.clear();
    sim.current = newFlight();
    setFlight(sim.current);
    setAlias('');
    submissionId.current = null;
    setSaveError(false);
    setRecordCheck('idle');
    setPhase('playing');
    stage.current?.focus({ preventScroll: true });
    if (!muted) unlockAudio(true);
  }

  function toggleSound() {
    const next = !muted;
    setMuted(next);
    audio.current?.mute(next);
    if (!next) unlockAudio();
  }

  useEffect(() => {
    audio.current?.music(phase === 'playing');
    if (phase !== 'playing') return;
    let frame = 0;
    let last: number | undefined;
    const loop = (now: number) => {
      const dt = last === undefined ? 0 : Math.min((now - last) / 1000, .05);
      last = now;
      const previous = sim.current;
      if (!previous) return;
      const held = keys.current;
      const next = advanceFlight(previous, {
        x: Number(held.has('ArrowRight')) - Number(held.has('ArrowLeft')),
        y: Number(held.has('ArrowDown')) - Number(held.has('ArrowUp')),
      }, dt);
      sim.current = next;
      setFlight(next);
      if (next.score !== previous.score) audio.current?.cue('hit');
      if (next.lives !== previous.lives) audio.current?.cue('miss');
      if (next.lives > 0) frame = requestAnimationFrame(loop);
      else {
        setPhase('finished');
        void checkRecord(next.score);
      }
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [phase, checkRecord]);

  useEffect(() => {
    if (phase !== 'playing' && phase !== 'paused') return;
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !event.repeat) {
        event.preventDefault();
        keys.current.clear();
        setPhase(phase === 'playing' ? 'paused' : 'playing');
      } else if (phase === 'playing' && controls.some(({ key }) => key === event.key)) {
        event.preventDefault();
        keys.current.add(event.key);
      }
    };
    const keyup = (event: KeyboardEvent) => keys.current.delete(event.key);
    const pauseOnBlur = () => {
      keys.current.clear();
      if (phase === 'playing') setPhase('paused');
    };
    window.addEventListener('keydown', keydown);
    window.addEventListener('keyup', keyup);
    window.addEventListener('blur', pauseOnBlur);
    return () => {
      window.removeEventListener('keydown', keydown);
      window.removeEventListener('keyup', keyup);
      window.removeEventListener('blur', pauseOnBlur);
    };
  }, [phase]);

  async function saveRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = alias.trim();
    if (!flight || recordCheck !== 'winner' || !name || saving) return;
    setSaving(true);
    setSaveError(false);
    try {
      const retryId = submissionId.current;
      const id = submissionId.current ??= crypto.randomUUID();
      const records = (await getRayfinClient()).data.FlightRecord;
      const existing = retryId
        ? await records.select(['id', 'alias', 'score']).where({ id: { eq: id } }).findFirst()
        : null;
      const row = existing ?? await records.create({ id, alias: name, score: flight.score });
      setScores((current) => [...current.filter((entry) => entry.id !== row.id), row]
        .sort((a, b) => b.score - a.score).slice(0, pageSize));
      setRecordCheck('saved');
      void refreshBoard();
    } catch (error) {
      console.warn('Could not save the flight record.', error);
      setSaveError(true);
    } finally {
      setSaving(false);
    }
  }

  const lives = flight?.lives ?? START_LIVES;
  const winner = recordCheck === 'winner' || recordCheck === 'saved';

  return <div className="game-shell min-h-full">
    <header className="club-header">
      <div className="club-brand">
        <div className="club-mark"><img src="/reindeer.svg" alt="" /></div>
        <div><p>North Pole Flight Club</p><span>THE CHRISTMAS ARCADE</span></div>
      </div>
      <div className="header-actions">
        <button type="button" className="utility-button sound-button" onClick={toggleSound} aria-label="Mute game audio" aria-pressed={muted}>
          {muted ? <VolumeX /> : <AudioLines />} <span>Sound {muted ? 'off' : 'on'}</span>
        </button>
        <button type="button" className="utility-button theme-button" onClick={toggleTheme} aria-label={isDark ? 'Switch to light trim' : 'Switch to dark trim'}>
          {isDark ? <Sun /> : <Moon />}
        </button>
      </div>
    </header>

    <main className="game-grid">
      <div className="flight-column">
        <section className="flight-stage" ref={stage} tabIndex={-1} aria-label="Flight course">
          <FlightScene flight={flight} active={phase === 'playing'} />
          <div className="stage-top">
            <div className="stage-tag"><Snowflake /> <span>CHRISTMAS EVE FLIGHT</span></div>
            <div className="stage-hud">
              <span className="stat-label">SCORE <strong>{scoreText(flight?.score ?? 0)}</strong></span>
              <span className="heart-group" aria-label={`${lives} of ${START_LIVES} lives left`}>
                {Array.from({ length: START_LIVES }, (_, i) => <Heart key={i} className={i < lives ? 'heart-full' : 'heart-empty'} aria-hidden="true" />)}
              </span>
              {phase === 'playing' && <button type="button" className="stage-pause" aria-label="Pause flight" onClick={() => { keys.current.clear(); setPhase('paused'); }}><Pause /></button>}
            </div>
          </div>
          {phase === 'menu' && <div className="stage-intro">
            <p className="hero-kicker"><span /> THE NORTH POLE INVITATIONAL</p>
            <h1>Reindeer<br /><em>Games.</em></h1>
            <p className="hero-copy">Take Rudolph on a moonlit dash through golden hoops. How far can you fly?</p>
            <button type="button" className="launch-button" onClick={launch}><Play fill="currentColor" /> Start flight</button>
          </div>}
          {phase === 'playing' && <div className="flight-status">
            <span>PACE · {(flightSpeed(flight?.elapsed ?? 0) / .32).toFixed(1)}×</span>
            <span role="status">{flight?.flash ? flight.feedback === 'hit' ? '+1 · HOOP CLEARED' : 'HOOP MISSED' : ''}</span>
          </div>}
          {phase === 'paused' && <div className="stage-overlay">
            <div className="result-card">
              <div className="result-mark"><Pause /></div>
              <h2>Flight paused</h2>
              <p>Rudolph’s taking a breather.</p>
              <button type="button" className="launch-button" onClick={() => { setPhase('playing'); stage.current?.focus({ preventScroll: true }); }}><Play fill="currentColor" /> Resume flight</button>
              <button type="button" className="text-button" onClick={() => { setFlight(null); setPhase('menu'); }}>Back to hangar</button>
            </div>
          </div>}
          {phase === 'finished' && <div className="stage-overlay">
            {winner && <div className="confetti" aria-hidden="true">{confetti.map((style, i) => <i key={i} style={style} />)}</div>}
            <div className="result-card">
              <div className="result-mark">{winner ? <Trophy /> : <Snowflake />}</div>
              <h2>{winner ? 'New flight record!' : 'Flight complete'}</h2>
              <p>You cleared <strong>{flight?.score ?? 0}</strong> {flight?.score === 1 ? 'hoop' : 'hoops'}.</p>
              {recordCheck === 'checking' && <p role="status">Checking the leaderboard…</p>}
              {recordCheck === 'error' && <div role="alert">
                <p>Couldn’t check your record.</p>
                <button type="button" className="text-button" onClick={() => { void checkRecord(flight?.score ?? 0); }}>Retry record check</button>
              </div>}
              {recordCheck === 'winner' && <form className="record-form" onSubmit={(event) => { void saveRecord(event); }}>
                <label htmlFor="pilot-alias">Your pilot alias</label>
                <input id="pilot-alias" value={alias} onChange={(event) => setAlias(event.target.value)} placeholder="e.g. Comet" maxLength={20} required disabled={saving} />
                <button type="submit" className="launch-button" disabled={saving || !alias.trim()}>{saving ? 'Saving…' : 'Save record'}</button>
                {saveError && <p role="alert">Couldn’t save your record. Try again.</p>}
              </form>}
              {recordCheck === 'saved' && <p role="status" className="gold-text">Your alias is on the leaderboard.</p>}
              {recordCheck !== 'checking' && recordCheck !== 'winner' && <button type="button" className="launch-button" onClick={launch}><RotateCcw /> Fly again</button>}
              {recordCheck === 'winner' && <button type="button" className="text-button" onClick={launch} disabled={saving}>Fly again without saving</button>}
            </div>
          </div>}
        </section>
        <div className="flight-strip">
          <div><span className="strip-icon"><Sparkles /></span><span><strong>Flight briefing</strong><small>Fly through hoops to score. Miss one and lose a life.</small></span></div>
          <div className="strip-keys" aria-label="Arrow keys steer; Escape pauses">
            {controls.map(({ key, Icon, name }) => <kbd key={key} aria-label={name}><Icon /></kbd>)}
            <span>TO STEER</span>
          </div>
        </div>
        {soundError && <p className="audio-error" role="status">Audio couldn’t start. Toggle sound off and on to retry.</p>}
      </div>

      <aside className="flight-sidebar" aria-label="Scores and flight tips">
        <section className="scoreboard" aria-labelledby="leaderboard-title">
          <div className="side-heading">
            <span className="trophy-mark"><Trophy /></span>
            <div><p>THE NICE LIST</p><h2 id="leaderboard-title">High Scores</h2></div>
          </div>
          <div className="best-score">
            <span><small>ALL-TIME BEST</small><strong>{scores.length ? scoreText(best) : '—'}</strong></span>
            <Trophy aria-hidden="true" />
          </div>
          <div className="score-labels"><span>RANK / PILOT</span><span>SCORE</span></div>
          {scores.length > 0 && <ol className="score-list">
            {scores.map((row, i) => <li key={row.id}><span>{String(i + 1).padStart(2, '0')}</span><strong title={row.alias}>{row.alias}</strong><b>{scoreText(row.score)}</b></li>)}
          </ol>}
          {board === 'loading' && <p className="score-state" role="status">Loading flight records…</p>}
          {board === 'ready' && !scores.length && <p className="score-state">No records yet. Be the first to land on the Nice List!</p>}
          {board === 'error' && <div className="score-state" role="alert">The scores couldn’t load. <button type="button" className="text-button" onClick={() => { setBoard('loading'); void refreshBoard(); }}>Try again</button></div>}
        </section>
        <section className="tip-card">
          <span className="tip-mark"><CircleDot /></span>
          <div><h2>Pilot’s tip</h2><p>Line up with the glowing hoop early. The farther you fly, the faster they come!</p></div>
        </section>
      </aside>
    </main>
    <footer className="club-footer"><span><Snowflake /> NORTH POLE FLIGHT CLUB</span><span>BUILT FOR THE MERRIEST NIGHT OF THE YEAR</span></footer>
  </div>;
}

export default App;
