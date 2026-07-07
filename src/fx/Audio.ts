/**
 * WordPal Audio Engine
 * Web Audio API — procedural ambient pad + short SFX
 * Quiet, non-intrusive. All generated, no audio files needed.
 */

let ctx: AudioContext | null = null;
let ambientGain: GainNode | null = null;
let ambientNodes: AudioNode[] = [];
let masterGain: GainNode | null = null;

function getCtx(): AudioContext | null {
  try {
    if (!ctx) {
      ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.gain.value = 0.6;
      masterGain.connect(ctx.destination);
    }
    return ctx;
  } catch {
    return null;
  }
}

export const AudioEngine = {
  init() {
    getCtx();
  },

  setVolume(v: number) {
    if (masterGain) masterGain.gain.value = Math.max(0, Math.min(1, v));
  },

  /** One-shot SFX envelope */
  playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    vol: number = 0.3,
    attack = 0.01,
    release = 0.1,
    detune = 0
  ) {
    const c = getCtx();
    if (!c || !masterGain) return;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.detune.value = detune;
    gain.gain.setValueAtTime(0, c.currentTime);
    gain.gain.linearRampToValueAtTime(vol, c.currentTime + attack);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + duration + release);
  },

  /** Correct answer — bright two-note chime */
  correct() {
    this.playTone(523.25, 0.15, 'sine', 0.25); // C5
    setTimeout(() => this.playTone(659.25, 0.25, 'sine', 0.2), 100); // E5
  },

  /** Wrong answer — low buzzy */
  wrong() {
    this.playTone(200, 0.3, 'triangle', 0.15, 0.01, 0.2);
  },

  /** Feed — soft pop + descending */
  feed() {
    this.playTone(800, 0.1, 'sine', 0.2);
    setTimeout(() => this.playTone(600, 0.1, 'sine', 0.15), 60);
    setTimeout(() => this.playTone(450, 0.15, 'sine', 0.12), 120);
  },

  /** Button click — tiny tick */
  click() {
    this.playTone(1200, 0.05, 'sine', 0.08);
  },

  /** Evolution / unlock — sparkly ascending arpeggio */
  evolve() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((n, i) => {
      setTimeout(() => this.playTone(n, 0.3, 'sine', 0.18), i * 100);
    });
  },

  /** Heal / recover */
  heal() {
    this.playTone(440, 0.4, 'sine', 0.15);
    this.playTone(554, 0.4, 'sine', 0.12);
  },

  /** Heart collect */
  heart() {
    this.playTone(880, 0.15, 'sine', 0.15);
    setTimeout(() => this.playTone(1100, 0.2, 'sine', 0.12), 80);
  },

  /** Start ambient pad — soft drone */
  startAmbient() {
    const c = getCtx();
    if (!c || !masterGain || ambientGain) return;
    ambientGain = c.createGain();
    ambientGain.gain.value = 0.04;
    ambientGain.connect(masterGain);

    const notes = [261.63, 329.63, 392.00]; // C4, E4, G4 — major chord drone
    notes.forEach((freq) => {
      const osc = c.createOscillator();
      const g = c.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      g.gain.value = 0.3;
      // slow LFO on gain for movement
      const lfo = c.createOscillator();
      const lfoGain = c.createGain();
      lfo.frequency.value = 0.15 + Math.random() * 0.2;
      lfoGain.gain.value = 0.15;
      lfo.connect(lfoGain);
      lfoGain.connect(g.gain);
      osc.connect(g);
      g.connect(ambientGain);
      osc.start();
      lfo.start();
      ambientNodes.push(osc, lfo);
    });
  },

  stopAmbient() {
    ambientNodes.forEach(n => {
      try { (n as OscillatorNode).stop(); } catch {}
    });
    ambientNodes = [];
    if (ambientGain) {
      try { ambientGain.disconnect(); } catch {}
      ambientGain = null;
    }
  },
};
