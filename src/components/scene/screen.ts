import { CanvasTexture, SRGBColorSpace } from 'three'

// Екран монітора: «друкується» код. Малюємо на canvas, оновлюємо лише коли змінився вигляд.
const W = 512, H = 288
const canvas = document.createElement('canvas'); canvas.width = W; canvas.height = H
const g = canvas.getContext('2d')!
export const screenTex = new CanvasTexture(canvas)
screenTex.colorSpace = SRGBColorSpace

type Tok = [string, string]
const LINES: Tok[][] = [
  [['const ', '#ff7edb'], ['room', '#62f0ff'], [' = ', '#ffffff'], ['useRoom', '#ffd166'], ['()', '#ffffff']],
  [['watch', '#ffd166'], ['(', '#ffffff'], ['night', '#62f0ff'], [', () => {', '#ffffff']],
  [['  sky', '#62f0ff'], ['.fadeTo', '#ffd166'], ['(', '#ffffff'], ["'stars'", '#7ee787'], [')', '#ffffff']],
  [['  lamp', '#62f0ff'], ['.turnOn', '#ffd166'], ['()', '#ffffff']],
  [['})', '#ffffff']],
  [['// hello, world', '#6b7aa8']],
  [['await ', '#ff7edb'], ['coffee', '#62f0ff'], ['.pour', '#ffd166'], ['()', '#ffffff']],
]
const total = LINES.reduce((n, l) => n + l.reduce((m, [s]) => m + s.length, 0), 0)
let shown = -1

function draw(n: number, cursorOn: boolean) {
  g.fillStyle = '#0b1f2a'; g.fillRect(0, 0, W, H)
  g.fillStyle = '#12303f'; g.fillRect(0, 0, W, 28)
  ;['#ff5f56', '#ffbd2e', '#27c93f'].forEach((c, i) => { g.fillStyle = c; g.beginPath(); g.arc(16 + i * 18, 14, 5, 0, 6.283); g.fill() })
  g.font = '13px monospace'; g.fillStyle = '#8fb3c4'; g.fillText('room.ts', 78, 18)
  g.font = '20px monospace'
  let left = n, cx = 46, cy = 58
  for (let li = 0; li < LINES.length && left > 0; li++) {
    const y = 58 + li * 30
    g.fillStyle = '#3d5a6b'; g.fillText(String(li + 1), 14, y)
    let x = 46
    for (const [s, c] of LINES[li]) {
      if (left <= 0) break
      const part = s.slice(0, left)
      g.fillStyle = c; g.fillText(part, x, y)
      x += g.measureText(part).width; left -= s.length
    }
    cx = x; cy = y
  }
  if (cursorOn) { g.fillStyle = '#62f0ff'; g.fillRect(cx + 2, cy - 16, 10, 20) }
}

export function updateScreen(elapsed: number) {
  const cps = 14, cycle = total / cps + 3
  const n = Math.min(total, Math.floor((elapsed % cycle) * cps))
  const cursorOn = Math.floor(elapsed * 2) % 2 === 0
  const key = n * 2 + (cursorOn ? 1 : 0)
  if (key === shown) return
  shown = key; draw(n, cursorOn); screenTex.needsUpdate = true
}
