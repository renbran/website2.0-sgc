// Synthesized cinematic ambient engine for SGC Tech AI
// Root: A1 = 55 Hz
// Chord: A major in just intonation (A–E–C#) — warm, spacious, premium
// All frequencies are integer multiples of root = zero beating between layers

type OscLayer = { osc: OscillatorNode; gain: GainNode };

const ROOT = 55; // A1

// [frequency, peak volume, waveform, optional lowpass cutoff Hz]
// Frequencies: ROOT * [1,2,3,4,5,6,8,16] — pure harmonic series, no beating
// ROOT*5 = 275 Hz = just-intonation C#4 (5/4 * A3)  ← was wrong (ROOT*4.5=247.5)
const HARMONIC_SPEC: Array<[number, number, OscillatorType, number?]> = [
  [ROOT,        0.07, "triangle",  80],   // A1 sub-bass — felt, not heard
  [ROOT * 2,    0.06, "triangle", 200],   // A2 bass body
  [ROOT * 3,    0.028,"sine"          ],  // E3 perfect fifth
  [ROOT * 4,    0.048,"triangle", 650],   // A3 mid fundamental
  [ROOT * 5,    0.018,"sine"          ],  // C#4 just major third (275 Hz)
  [ROOT * 6,    0.022,"sine"          ],  // E4 perfect fifth (330 Hz)
  [ROOT * 8,    0.012,"sine"          ],  // A4 presence (440 Hz)
  [ROOT * 16,   0.004,"sine"          ],  // A5 shimmer — barely audible
];

export class CinematicSynth {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private layers: OscLayer[] = [];
  private lfo: OscillatorNode | null = null;
  private _running = false;

  private getCtx(): AudioContext | null {
    if (typeof window === "undefined") return null;
    try {
      if (!this.ctx) {
        const Ctor =
          window.AudioContext ??
          (window as Window & { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;
        if (!Ctor) return null;
        this.ctx = new Ctor();
      }
      if (this.ctx.state === "suspended") void this.ctx.resume();
      return this.ctx;
    } catch {
      return null;
    }
  }

  async start(): Promise<void> {
    if (this._running) return;
    const ctx = this.getCtx();
    if (!ctx) return;
    this._running = true;

    // Soft limiter
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -14;
    compressor.knee.value = 10;
    compressor.ratio.value = 3;
    compressor.attack.value = 0.01;
    compressor.release.value = 0.8;
    compressor.connect(ctx.destination);

    const master = ctx.createGain();
    master.gain.value = 0;
    this.master = master;
    master.connect(compressor);

    // Reverb via two feedback delay lines
    const d1 = ctx.createDelay(1.0); d1.delayTime.value = 0.29;
    const d2 = ctx.createDelay(1.0); d2.delayTime.value = 0.51;
    const fb1 = ctx.createGain(); fb1.gain.value = 0.18;
    const fb2 = ctx.createGain(); fb2.gain.value = 0.12;
    const revOut = ctx.createGain(); revOut.gain.value = 0.22;
    d1.connect(fb1); fb1.connect(d2);
    d2.connect(fb2); fb2.connect(d1);
    d1.connect(revOut); d2.connect(revOut);
    revOut.connect(master);

    const now = ctx.currentTime;

    for (const [freq, vol, type, lpf] of HARMONIC_SPEC) {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.value = freq;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, now);
      // Staggered bloom: layers swell in over 4-7s for a cinematic opening
      const attackDuration = 4 + Math.random() * 3;
      gain.gain.linearRampToValueAtTime(vol, now + attackDuration);

      let node: AudioNode = osc;
      if (lpf !== undefined) {
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = lpf;
        filter.Q.value = 0.6;
        osc.connect(filter);
        node = filter;
      }
      node.connect(gain);
      gain.connect(master);
      // Only bass/mid frequencies feed reverb — keeps highs clean
      if (freq < 500) gain.connect(d1);

      osc.start(now);
      this.layers.push({ osc, gain });
    }

    // Very slow breathing LFO — 0.05 Hz (~20s per cycle), depth 0.025
    // Subtle enough that you feel the room "breathe" without hearing a tremolo
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.05;
    const lfoDepth = ctx.createGain();
    lfoDepth.gain.value = 0.025;
    lfo.connect(lfoDepth);
    lfoDepth.connect(master.gain);
    lfo.start(now);
    this.lfo = lfo;

    // Master fade-in — unhurried 2s entrance
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(0.82, now + 2);
  }

  /** Start only the AudioContext — no oscillator layers. Use when the synth
   *  is acting purely as a context/gate manager for downstream audio effects. */
  async startContextOnly(): Promise<void> {
    if (this._running) return;
    this.getCtx(); // creates + resumes context
    this._running = true;
  }

  fadeIn(durationMs: number): void {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return; // no oscillator layers — nothing to fade
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(0.82, now + durationMs / 1000);
  }

  fadeOut(durationMs: number, onComplete?: () => void): void {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) {
      // No oscillator layers — call back immediately
      if (onComplete) onComplete();
      return;
    }
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(0, now + durationMs / 1000);
    if (onComplete) setTimeout(onComplete, durationMs);
  }

  suspend(): void { void this.ctx?.suspend(); }
  resume(): void { if (this.ctx?.state === "suspended") void this.ctx.resume(); }

  get running(): boolean { return this._running; }

  /** True only when the AudioContext is actively running (not suspended/closed). */
  get isActive(): boolean {
    return this._running && this.ctx?.state === "running";
  }

  /** Exposes the AudioContext for motion-accent effects (e.g. swoosh player). */
  getAudioContext(): AudioContext | null {
    return this.ctx;
  }
}

let _instance: CinematicSynth | null = null;
export function getCinematicSynth(): CinematicSynth {
  if (!_instance) _instance = new CinematicSynth();
  return _instance;
}
