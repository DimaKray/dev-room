// Звуки через Web Audio API: без жодних аудіофайлів.
let ctx: AudioContext | null = null

export function audio(): AudioContext | null {
  const AC = window.AudioContext || (window as any).webkitAudioContext
  if (!AC) return null
  ctx ??= new AC()
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

// Мурчання: низька «пилкова» хвиля, яку модулює повільний LFO ~25 Гц
export function purr(seconds = 2.8) {
  const c = audio(); if (!c) return
  const t = c.currentTime
  const osc = c.createOscillator(); osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(48, t)
  osc.frequency.linearRampToValueAtTime(58, t + seconds / 2)
  osc.frequency.linearRampToValueAtTime(46, t + seconds)
  const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 700
  const am = c.createGain(); am.gain.value = 0.5
  const lfo = c.createOscillator(); lfo.frequency.value = 25
  const depth = c.createGain(); depth.gain.value = 0.5
  lfo.connect(depth).connect(am.gain)
  const master = c.createGain()
  master.gain.setValueAtTime(0, t)
  master.gain.linearRampToValueAtTime(0.45, t + 0.35)
  master.gain.setValueAtTime(0.45, t + seconds - 0.6)
  master.gain.linearRampToValueAtTime(0, t + seconds)
  osc.connect(lp).connect(am).connect(master).connect(c.destination)
  osc.start(t); lfo.start(t); osc.stop(t + seconds); lfo.stop(t + seconds)
}

// короткий «клік» для підтвердження
export function blip() {
  const c = audio(); if (!c) return
  const t = c.currentTime
  const o = c.createOscillator(); o.type = 'sine'
  o.frequency.setValueAtTime(660, t); o.frequency.exponentialRampToValueAtTime(990, t + 0.09)
  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.18, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14)
  o.connect(g).connect(c.destination); o.start(t); o.stop(t + 0.15)
}
