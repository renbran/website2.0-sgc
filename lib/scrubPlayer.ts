import { getCinematicSynth } from "./cinematicSynth";

// ─── Tunable constants — adjust by ear ───────────────────────────────────────
/** Continuous ambient bed gain — always-on floor when audio is enabled. */
export const BED_VOLUME     = 0.03;
/** Max gain for the scroll-velocity scrub layer (rides on top of bed).
 *  Kept below BED_VOLUME so fast scroll adds texture, never volume spike. */
export const GAIN_MAX       = 0.04;
/** Max playback rate at peak scroll speed. */
export const RATE_MAX       = 1.60;
/** Playback rate at rest (inaudible but keeps buffer position live). */
export const REST_RATE      = 0.70;
/** Lerp factor per animation frame (~60fps). 0.07 ≈ 170ms settle. */
export const SMOOTHING      = 0.07;
/** Scales raw Lenis velocity (px/s) to a 0–1 intensity.
 *  ~14 px/s × 0.07 = 1.0 (clamped). Observed fast scroll: 36 px/s → normVel 1.0. */
export const VELOCITY_SCALE = 0.07;
// ─────────────────────────────────────────────────────────────────────────────

const AUDIO_PATH = "/bg-music/bg-audio.mp3";

class ScrubPlayer {
  private buffer: AudioBuffer | null = null;
  private loadingPromise: Promise<AudioBuffer | null> | null = null;

  // ── Scrub layer (velocity-driven) ───────────────────────────────────────────
  private source:   AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private sourceStarting = false;

  // ── Bed layer (constant ambient floor) ──────────────────────────────────────
  private bedSource:   AudioBufferSourceNode | null = null;
  private bedGain:     GainNode | null = null;
  private bedStarting = false;

  // Smoothed audio state (JS-side lerp, applied to Web Audio params each frame)
  private smoothGain = 0;
  private smoothRate = REST_RATE;
  private _inSection = true; // tracks last known section state for ramp-on-change

  private ctxListenerAttached = false;

  // ── Context ─────────────────────────────────────────────────────────────────

  private _getCtx(): AudioContext | null {
    const ctx = getCinematicSynth().getAudioContext();
    if (!ctx) return null;

    if (!this.ctxListenerAttached) {
      this.ctxListenerAttached = true;
      ctx.addEventListener("statechange", () => {
        if (ctx.state === "running" && getCinematicSynth().isActive) {
          void this._ensureSource(ctx);
          void this._ensureBed(ctx);
        }
        // On suspend: both layers pause automatically with context — no action needed.
      });
      if (ctx.state === "running" && getCinematicSynth().isActive) {
        void this._ensureSource(ctx);
        void this._ensureBed(ctx);
      }
    }
    return ctx;
  }

  // ── Buffer loading ───────────────────────────────────────────────────────────

  private _loadBuffer(ctx: AudioContext): Promise<AudioBuffer | null> {
    if (this.loadingPromise) return this.loadingPromise;
    this.loadingPromise = (async (): Promise<AudioBuffer | null> => {
      try {
        const res = await fetch(AUDIO_PATH);
        const ab  = await res.arrayBuffer();
        return await ctx.decodeAudioData(ab);
      } catch {
        return null;
      }
    })();
    return this.loadingPromise;
  }

  // ── Source management ────────────────────────────────────────────────────────

  private async _ensureSource(ctx: AudioContext): Promise<void> {
    if (this.source || this.sourceStarting) return;
    this.sourceStarting = true;
    try {
      if (!this.buffer) {
        this.buffer = await this._loadBuffer(ctx);
        if (!this.buffer) return;
      }
      if (ctx.state !== "running" || !getCinematicSynth().isActive) return;

      const source   = ctx.createBufferSource();
      const gainNode = ctx.createGain();

      source.buffer       = this.buffer;
      source.loop         = true;
      source.playbackRate.value = this.smoothRate;

      gainNode.gain.value = 0; // start silent; tick() drives it up on scroll

      source.connect(gainNode);
      gainNode.connect(ctx.destination);
      source.start();

      this.source   = source;
      this.gainNode = gainNode;

      source.onended = () => {
        if (this.source === source) {
          this.source   = null;
          this.gainNode = null;
        }
      };
    } finally {
      this.sourceStarting = false;
    }
  }

  // ── Bed layer management ─────────────────────────────────────────────────────

  private async _ensureBed(ctx: AudioContext): Promise<void> {
    if (this.bedSource || this.bedStarting) return;
    this.bedStarting = true;
    try {
      if (!this.buffer) {
        this.buffer = await this._loadBuffer(ctx);
        if (!this.buffer) return;
      }
      if (ctx.state !== "running" || !getCinematicSynth().isActive) return;

      const source   = ctx.createBufferSource();
      const gainNode = ctx.createGain();

      source.buffer = this.buffer;
      source.loop   = true;
      source.playbackRate.value = 1.0; // constant pitch — no velocity coupling

      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(BED_VOLUME, ctx.currentTime + 1.2); // gentle fade-in

      source.connect(gainNode);
      gainNode.connect(ctx.destination);
      source.start();

      this.bedSource = source;
      this.bedGain   = gainNode;

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

  // ── Per-frame update (called from rAF loop) ──────────────────────────────────

  /**
   * Drive audio params from normalized scroll velocity (0 = idle, 1 = peak).
   * inSection = false when user has scrolled outside the helix pin — both layers
   * fade to silence. Called every animation frame by useHelixScrub.
   */
  tick(normVelocity: number, inSection = true): void {
    const synth = getCinematicSynth();

    // Scrub layer mutes when outside the helix; bed continues unaffected
    if (inSection !== this._inSection) {
      this._inSection = inSection;
      if (!inSection) this.smoothGain = 0;
    }
    if (!inSection) normVelocity = 0;
    if (!synth.isActive) return;

    const ctx = this._getCtx();
    if (!ctx || ctx.state !== "running") return;

    // Ensure both layers are running (covers first tick after audio enabled)
    if (!this.source && !this.sourceStarting) {
      void this._ensureSource(ctx);
    }
    if (!this.bedSource && !this.bedStarting) {
      void this._ensureBed(ctx);
    }

    const targetGain = normVelocity * GAIN_MAX;
    const targetRate = REST_RATE + normVelocity * (RATE_MAX - REST_RATE);

    // JS-side lerp — smooth, no Web Audio scheduling complexity
    this.smoothGain += (targetGain - this.smoothGain) * SMOOTHING;
    this.smoothRate += (targetRate - this.smoothRate) * SMOOTHING;

    if (this.gainNode) {
      // setValueAtTime at "now" — immediate, no ramp, no pop (delta is tiny per frame)
      this.gainNode.gain.setValueAtTime(
        Math.max(0, this.smoothGain),
        ctx.currentTime,
      );
    }
    if (this.source) {
      this.source.playbackRate.setValueAtTime(
        Math.max(0.1, this.smoothRate),
        ctx.currentTime,
      );
    }
  }

  // ── Lifecycle ────────────────────────────────────────────────────────────────

  /** Fade both layers to zero and stop. Call on unmount only. */
  muteAll(): void {
    const ctx = getCinematicSynth().getAudioContext();
    // Scrub layer
    if (this.gainNode && ctx && ctx.state === "running") {
      try { this.gainNode.gain.setTargetAtTime(0, ctx.currentTime, 0.1); } catch {}
    }
    const src = this.source;
    if (src) {
      setTimeout(() => { try { src.stop(); } catch {} }, 400);
    }
    this.source   = null;
    this.gainNode = null;
    this.smoothGain = 0;
    this.smoothRate = REST_RATE;
    // Bed layer
    if (this.bedGain && ctx && ctx.state === "running") {
      try { this.bedGain.gain.setTargetAtTime(0, ctx.currentTime, 0.1); } catch {}
    }
    const bed = this.bedSource;
    if (bed) {
      setTimeout(() => { try { bed.stop(); } catch {} }, 400);
    }
    this.bedSource = null;
    this.bedGain   = null;
  }
}

let _instance: ScrubPlayer | null = null;
export function getScrubPlayer(): ScrubPlayer {
  if (!_instance) _instance = new ScrubPlayer();
  return _instance;
}
