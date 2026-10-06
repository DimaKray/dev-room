import { audio } from './sound'

// Фонові звуки через Web Audio: пташки вдень, цвіркуни вночі, дощ і вітер. Жодних файлів.
let master: GainNode | null = null
let rainGain: GainNode | null = null
let windGain: GainNode | null = null
let started = false
const st = { sound: true, night: false, weather: 'clear' as string }

function setup(c: AudioContext) {
  master = c.createGain(); master.gain.value = 0; master.connect(c.destination)
  const len = c.sampleRate * 2, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
  const src = c.createBufferSource(); src.buffer = buf; src.loop = true
  const rainF = c.createBiquadFilter(); rainF.type = 'bandpass'; rainF.frequency.value = 2200; rainF.Q.value = 0.5
  rainGain = c.createGain(); rainGain.gain.value = 0
  const windF = c.createBiquadFilter(); windF.type = 'lowpass'; windF.frequency.value = 380
  windGain = c.createGain(); windGain.gain.value = 0
  src.connect(rainF).connect(rainGain).connect(master)
  src.connect(windF).connect(windGain).connect(master)
  src.start()
}

function apply() {
  const c = audio()
  if (!c || !master || !rainGain || !windGain) return
  const t = c.currentTime
  master.gain.setTargetAtTime(st.sound ? 0.6 : 0, t, 0.25)
  rainGain.gain.setTargetAtTime(st.weather === 'rain' ? 0.35 : 0, t, 0.6)
  windGain.gain.setTargetAtTime(st.weather === 'rain' ? 0.2 : st.weather === 'snow' ? 0.35 : 0.04, t, 0.6)
}

function bird(c: AudioContext) {
  const t0 = c.currentTime, base = 2400 + Math.random() * 1800, notes = 2 + Math.floor(Math.random() * 3)
  for (let i = 0; i < notes; i++) {
    const t = t0 + i * 0.12
    const o = c.createOscillator(); o.type = 'sine'
    o.frequency.setValueAtTime(base * (1 + i * 0.06), t)
    o.frequency.exponentialRampToValueAtTime(base * (1.25 + i * 0.05), t + 0.08)
    const g = c.createGain()
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.09, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09)
    o.connect(g).connect(master!); o.start(t); o.stop(t + 0.1)
  }
}

function cricket(c: AudioContext) {
  const t0 = c.currentTime
  const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = 4200 + Math.random() * 400
  const g = c.createGain(); g.gain.value = 0
  for (let i = 0; i < 6; i++) {
    const t = t0 + i * 0.045
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.035, t + 0.012); g.gain.linearRampToValueAtTime(0.0001, t + 0.03)
  }
  o.connect(g).connect(master!); o.start(t0); o.stop(t0 + 0.3)
}

function loop() {
  const c = audio()
  if (c && master && st.sound && st.weather !== 'rain') (st.night ? cricket(c) : bird(c))
  window.setTimeout(loop, st.night ? 500 + Math.random() * 700 : 1800 + Math.random() * 3500)
}

// Запускати лише після дії користувача (браузер забороняє звук без кліка)
export function startAmbient() {
  const c = audio()
  if (!c || started) return
  started = true; setup(c); apply(); loop()
}
export function updateAmbient(s: { sound: boolean; night: boolean; weather: string }) { Object.assign(st, s); apply() }

// грім: низький гул, що затухає
export function thunder() {
  const c = audio()
  if (!c || !master || !st.sound) return
  const len = c.sampleRate * 2.2, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2)
  const s = c.createBufferSource(); s.buffer = buf
  const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 170
  const g = c.createGain(); g.gain.value = 1.4
  s.connect(f).connect(g).connect(master); s.start()
}
