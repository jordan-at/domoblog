// Tiny shared Web Audio engine for the /mason page toys and chiptune studio.

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuf: AudioBuffer | null = null;

export function ac(): AudioContext | null {
  try {
    if (!ctx) {
      ctx = new AudioContext();
      master = ctx.createGain();
      master.gain.value = 0.8;
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

export function out(): AudioNode | null {
  return ac() ? master : null;
}

function noise(a: AudioContext) {
  if (!noiseBuf) {
    noiseBuf = a.createBuffer(1, a.sampleRate, a.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  return noiseBuf;
}

export const midiToFreq = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

type ToneOpts = {
  time?: number;
  dur?: number;
  type?: OscillatorType;
  vol?: number;
  slideTo?: number;
  dest?: AudioNode | null;
};

export function tone(freq: number, opts: ToneOpts = {}) {
  const a = ac();
  if (!a) return;
  const { dur = 0.1, type = "square", vol = 0.08, slideTo } = opts;
  const t = opts.time ?? a.currentTime;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.005);
  g.gain.setValueAtTime(vol, t + Math.max(0.006, dur * 0.7));
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(opts.dest ?? master!);
  o.start(t);
  o.stop(t + dur + 0.02);
}

function noiseHit(
  a: AudioContext,
  t: number,
  filter: BiquadFilterType,
  freq: number,
  vol: number,
  dur: number,
  dest: AudioNode
) {
  const src = a.createBufferSource();
  const f = a.createBiquadFilter();
  const g = a.createGain();
  src.buffer = noise(a);
  f.type = filter;
  f.frequency.value = freq;
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f).connect(g).connect(dest);
  src.start(t, Math.random() * 0.5);
  src.stop(t + dur + 0.02);
}

export type DrumKind = "kick" | "snare" | "hat" | "clap";

export function drum(kind: DrumKind, time?: number, dest?: AudioNode | null) {
  const a = ac();
  if (!a) return;
  const t = time ?? a.currentTime;
  const d = dest ?? master!;
  if (kind === "kick") {
    const o = a.createOscillator();
    const g = a.createGain();
    o.frequency.setValueAtTime(160, t);
    o.frequency.exponentialRampToValueAtTime(42, t + 0.13);
    g.gain.setValueAtTime(0.7, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    o.connect(g).connect(d);
    o.start(t);
    o.stop(t + 0.2);
  } else if (kind === "snare") {
    noiseHit(a, t, "highpass", 1200, 0.35, 0.13, d);
    tone(190, { time: t, dur: 0.07, type: "triangle", vol: 0.15, dest: d });
  } else if (kind === "hat") {
    noiseHit(a, t, "highpass", 7500, 0.14, 0.04, d);
  } else {
    for (const off of [0, 0.012, 0.024])
      noiseHit(a, t + off, "bandpass", 1500, 0.3, 0.09, d);
  }
}

export function pop() {
  const a = ac();
  if (!a) return;
  noiseHit(
    a,
    a.currentTime,
    "bandpass",
    1200 + Math.random() * 1200,
    0.9,
    0.05,
    master!
  );
}
