import { getCinematicSynth } from "./cinematicSynth";

// ─── Tunable constants — adjust by ear ───────────────────────────────────────
// The file contains prominent big-swoosh hits concentrated in the first ~2s,
// followed by a continuous low-swoosh texture through the rest of the file.

/** Offset (seconds) where the main "big swoosh" hit begins. */
export const BIG_SWOOSH_START_S = 0.0;
/** Offset (seconds) where the big-swoosh slice ends (one-shot accent duration). */
export const BIG_SWOOSH_END_S   = 1.8;
/** Offset (seconds) to begin the seamless bed loop (quiet continuous texture). */
export const LOOP_START_S       = 2.0;
/** End of the loop region in seconds. 0 = use buffer.duration (file end). */
export const LOOP_END_S         = 0;
/** Layer A (bed) volume — "always-there" motion feel. */
export const BED_VOLUME         = 0.10;
/** Layer B (accent) volume — per-transition hit, slightly above bed. */
export const ACCENT_VOLUME      = 0.20;
// ─────────────────────────────────────────────────────────────────────────────

const AUDIO_PATH: string | null = null;
const ATTACK_S     = 0.03;  // 30ms soft attack on accent — no pop
const BED_FADEIN_S = 0.8;   // gentle bed fade-in so it doesn't snap in

class SwooshPlayer {
  private buffer: AudioBuffer | null = null;
  private loadingPromise: Promise<AudioBuffer | null> | null = null;

  // Layer A — looping bed
  private bedSource:   AudioBufferSourceNode | null = null;
  private bedGain:     GainNode | null = null;
  private bedStarting: boolean = false; // guard against concurrent _ensureBed calls

  // Layer B — accent one-shot
  private accentSource:   AudioBufferSourceNode | null = null;
  private accentGain:     GainNode | null = null;
  private lastAccentTime: number = -Infinity;

  private ctxListenerAttached: boolean = false;

  // ── Context management ──────────────────────────────────────────────────────

  private _getCtx(): AudioContext | null {
    const ctx = getCinematicSynth().getAudioContext();
    if (!ctx) return null;

    if (!this.ctxListenerAttached) {
      this.ctxListenerAttached = true;
      ctx.addEventListener("statechange", () => {
        if (ctx.state === "running" && getCinematicSynth().isActive) {
          void this._ensureBed(ctx);
        }
        // On suspend/close: bed nodes are paused automatically by context;
        // they resume when context resumes — no explicit stop needed.
      });
      // Context is already running at listener-attach time — start bed now
      if (ctx.state === "running" && getCinematicSynth().isActive) {
        void this._ensureBed(ctx);
      }
    }
    return ctx;
  }

  // ── Buffer loading ──────────────────────────────────────────────────────────

  private _loadBuffer(ctx: AudioContext): Promise<AudioBuffer | null> {
    if (this.loadingPromise) return this.loadingPromise;
    this.loadingPromise = (async (): Promise<AudioBuffer | null> => {
      if (!AUDIO_PATH) return null;
      try {
        const res = await fetch(AUDIO_PATH);
        const ab  = await res.arrayBuffer();
        return await ctx.decodeAudioData(ab);
      } catch {
        return null; // silent fail — swoosh is a polish effect
      }
    })();
    return this.loadingPromise;
  }

  // ── Layer A: bed loop ───────────────────────────────────────────────────────

  private async _ensureBed(ctx: AudioContext): Promise<void> {
    if (this.bedSource || this.bedStarting) return;
    this.bedStarting = true;
    try {
      if (!this.buffer) {
        this.buffer = await this._loadBuffer(ctx);
        if (!this.buffer) return;
      }
      // Re-check after async load — context state may have changed
      if (ctx.state !== "running" || !getCinematicSynth().isActive) return;

      const loopEnd = LOOP_END_S > 0 ? LOOP_END_S : this.buffer.duration;

      const source = ctx.createBufferSource();
      source.buffer     = this.buffer;
      source.loop       = true;
      source.loopStart  = LOOP_START_S;
      source.loopEnd    = loopEnd;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(BED_VOLUME, ctx.currentTime + BED_FADEIN_S);

      source.connect(gain);
      gain.connect(ctx.destination);
      // Start playback at LOOP_START so the big hit is NOT in the loop
      source.start(0, LOOP_START_S);

      this.bedSource = source;
      this.bedGain   = gain;

      source.onended = () => {
        if (this.bedSource === source) {
          this.bedSource = null;
          this.bedGain   = null;
        }
      };
    } finally {
      this.bedStarting = false;
    }
  }

  private _stopBed(ctx: AudioContext | null): void {
    const gain = this.bedGain;
    const src  = this.bedSource;
    if (gain && ctx && ctx.state === "running") {
      try { gain.gain.setTargetAtTime(0, ctx.currentTime, 0.15); } catch {}
    }
    if (src) {
      setTimeout(() => { try { src.stop(); } catch {} }, 600);
    }
    this.bedSource = null;
    this.bedGain   = null;
  }

  // ── Layer B: accent one-shot ────────────────────────────────────────────────

  async playAccent(): Promise<void> {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (document.visibilityState === "hidden") return;

    const synth = getCinematicSynth();
    if (!synth.isActive) return;

    const ctx = this._getCtx();
    if (!ctx || ctx.state !== "running") return;

    if (!this.buffer) {
      this.buffer = await this._loadBuffer(ctx);
      if (!this.buffer) return;
    }

    // Ensure bed is running (catches the case where context was already running
    // before the first accent fire)
    void this._ensureBed(ctx);

    const accentDurationMs = (BIG_SWOOSH_END_S - BIG_SWOOSH_START_S) * 1000;
    const now = Date.now();

    // Hard throttle: skip if within own slice duration
    if (now - this.lastAccentTime < accentDurationMs) return;

    // Ramp down any still-active accent (safety — shouldn't fire with throttle)
    if (this.accentGain) {
      try { this.accentGain.gain.setTargetAtTime(0, ctx.currentTime, 0.05); } catch {}
    }

    this.lastAccentTime = now;

    const source = ctx.createBufferSource();
    source.buffer = this.buffer;

    const gain = ctx.createGain();
    // Soft attack → natural echo tail decays to silence; no scheduled ramp-down
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(ACCENT_VOLUME, ctx.currentTime + ATTACK_S);

    source.connect(gain);
    gain.connect(ctx.destination);

    const sliceDuration = BIG_SWOOSH_END_S - BIG_SWOOSH_START_S;
    source.start(ctx.currentTime, BIG_SWOOSH_START_S, sliceDuration);

    this.accentSource = source;
    this.accentGain   = gain;

    source.onended = () => {
      if (this.accentSource === source) {
        this.accentSource = null;
        this.accentGain   = null;
      }
    };
  }

  // ── Lifecycle ───────────────────────────────────────────────────────────────

  /** Full stop — call on component unmount only. */
  muteAll(): void {
    const ctx = getCinematicSynth().getAudioContext();
    this._stopBed(ctx);
    if (this.accentGain && ctx && ctx.state === "running") {
      try { this.accentGain.gain.setTargetAtTime(0, ctx.currentTime, 0.04); } catch {}
    }
  }
}

let _instance: SwooshPlayer | null = null;
export function getSwooshPlayer(): SwooshPlayer {
  if (!_instance) _instance = new SwooshPlayer();
  return _instance;
}
