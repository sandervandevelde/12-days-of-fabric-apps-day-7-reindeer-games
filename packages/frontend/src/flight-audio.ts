const melody = [64, 64, 64, 0, 64, 64, 64, 0, 64, 67, 60, 62, 64, 0, 0, 0,
  65, 65, 65, 65, 65, 64, 64, 64, 64, 62, 62, 64, 62, 0, 67, 0];

export class FlightAudio {
  private context?: AudioContext;
  private output?: GainNode;
  private timer?: number;
  private step = 0;
  private muted = false;

  async unlock() {
    if (!this.context) {
      this.context = new AudioContext();
      this.output = this.context.createGain();
      this.output.gain.value = this.muted ? 0 : 0.62;
      this.output.connect(this.context.destination);
    }
    if (this.context.state !== 'running') await this.context.resume();
  }

  mute(value: boolean) {
    this.muted = value;
    if (this.context && this.output) {
      this.output.gain.setTargetAtTime(value ? 0 : 0.62, this.context.currentTime, 0.025);
    }
  }

  music(active: boolean) {
    if (!active) {
      window.clearInterval(this.timer);
      this.timer = undefined;
      return;
    }
    if (this.timer !== undefined) return;
    this.step = 0;
    this.timer = window.setInterval(() => {
      const step = this.step++ % melody.length;
      if (melody[step]) {
        this.note(melody[step], 0, 0.17, 0.075, 'triangle');
        this.note(melody[step] + 24, 0, 0.075, 0.016, 'sine');
      }
      if (step % 4 === 0) this.note(step < 16 ? 43 : 48, 0, 0.2, 0.055, 'sine');
      if (step % 4 === 2) this.note(step < 16 ? 55 : 52, 0, 0.1, 0.04, 'triangle');
    }, 215);
  }

  cue(kind: 'hit' | 'miss' | 'winner' | 'launch') {
    const notes = { hit: [79, 84], miss: [48, 38], winner: [72, 76, 79, 84, 88, 91], launch: [60, 67, 72] };
    notes[kind].forEach((note, i) => this.note(note, i * 0.09, 0.22, 0.17, kind === 'miss' ? 'sawtooth' : 'triangle'));
  }

  dispose() {
    this.music(false);
    if (this.context && this.context.state !== 'closed') {
      void this.context.close().catch((error: unknown) => console.warn('Could not close flight audio.', error));
    }
  }

  private note(midi: number, delay: number, duration: number, volume: number, type: OscillatorType) {
    if (!this.context || !this.output || this.context.state !== 'running') return;
    const start = this.context.currentTime + delay;
    const oscillator = this.context.createOscillator();
    const envelope = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = 440 * 2 ** ((midi - 69) / 12);
    envelope.gain.setValueAtTime(0.001, start);
    envelope.gain.exponentialRampToValueAtTime(volume, start + 0.014);
    envelope.gain.exponentialRampToValueAtTime(0.001, start + duration);
    oscillator.connect(envelope).connect(this.output);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.01);
  }
}
