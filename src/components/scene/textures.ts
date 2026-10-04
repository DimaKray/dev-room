import { CanvasTexture, RepeatWrapping, SRGBColorSpace, type BufferGeometry, type Texture } from 'three'

// Процедурні текстури: малюємо на canvas, без жодних файлів.
// Це «деталь-карти» (світлі, з темними штрихами): матеріал множить їх на свій колір.

function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
type G = CanvasRenderingContext2D
type Draw = (g: G, S: number, r: () => number) => void
const TAU = Math.PI * 2

// малюємо елемент 9 разів зі зсувом, щоб текстура стикувалась без швів
function tiled(g: G, S: number, fn: () => void) {
  for (const dx of [-S, 0, S]) for (const dy of [-S, 0, S]) { g.save(); g.translate(dx, dy); fn(); g.restore() }
}
function wavy(g: G, S: number, vertical: boolean, pos: number, amp: number, k: number, p: number) {
  g.beginPath()
  for (let t = 0; t <= S; t += 8) {
    const o = pos + Math.sin((t / S) * TAU * k + p) * amp
    const x = vertical ? o : t, y = vertical ? t : o
    t ? g.lineTo(x, y) : g.moveTo(x, y)
  }
}

const GEN: Record<string, { size: number; base: string; draw: Draw }> = {
  wood: { size: 256, base: '#f6f2ec', draw: (g, S, r) => {
    g.fillStyle = 'rgba(40,22,12,.45)'; g.fillRect(0, 0, S, 3); g.fillRect(0, S / 2, S, 3)
    const L = Array.from({ length: 46 }, () => ({ y: r() * S, a: 1 + r() * 3, k: 1 + Math.floor(r() * 3), p: r() * TAU, w: 0.6 + r() * 1.6, al: 0.08 + r() * 0.16 }))
    tiled(g, S, () => L.forEach((l) => { wavy(g, S, false, l.y, l.a, l.k, l.p); g.strokeStyle = `rgba(80,50,30,${l.al})`; g.lineWidth = l.w; g.stroke() }))
    const K = [{ x: r() * S, y: 20 + r() * (S / 2 - 40) }, { x: r() * S, y: S / 2 + 20 + r() * (S / 2 - 40) }]
    tiled(g, S, () => K.forEach((k) => { for (let i = 1; i <= 4; i++) { g.beginPath(); g.ellipse(k.x, k.y, i * 6, i * 2.4, 0, 0, TAU); g.strokeStyle = `rgba(70,40,20,${0.34 - i * 0.06})`; g.lineWidth = 1.4; g.stroke() } }))
  } },
  logs: { size: 256, base: '#ffffff', draw: (g, S, r) => {
    const h = S / 4
    for (let i = 0; i < 4; i++) {
      const gr = g.createLinearGradient(0, i * h, 0, (i + 1) * h)
      gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.55, '#ece4dc'); gr.addColorStop(1, '#bdb2a8')
      g.fillStyle = gr; g.fillRect(0, i * h, S, h)
      g.fillStyle = 'rgba(30,14,8,.7)'; g.fillRect(0, i * h + h - 4, S, 4)
      for (let k = 0; k < 10; k++) { const y = i * h + 6 + r() * (h - 16), x = r() * S; g.strokeStyle = 'rgba(80,45,25,.16)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 30 + r() * 70, y + (r() - 0.5) * 3); g.stroke() }
    }
  } },
  wallpaper: { size: 256, base: '#f3effa', draw: (g, S) => {
    for (let x = 0; x < S; x += 32) {
      g.fillStyle = 'rgba(110,90,180,.12)'; g.fillRect(x, 0, 14, S)
      for (let y = 16; y < S; y += 32) { g.fillStyle = 'rgba(110,90,170,.28)'; g.beginPath(); g.moveTo(x + 23, y - 7); g.lineTo(x + 30, y); g.lineTo(x + 23, y + 7); g.lineTo(x + 16, y); g.fill() }
    }
  } },
  shingles: { size: 256, base: '#ffffff', draw: (g, S) => {
    const h = 32, w = 32
    for (let row = 0; row < S / h; row++) for (let x = -w; x < S + w; x += w) {
      const ox = x + (row % 2) * (w / 2), y = row * h
      g.beginPath(); g.moveTo(ox, y - 4); g.lineTo(ox + w, y - 4); g.lineTo(ox + w, y + h - w / 2); g.arc(ox + w / 2, y + h - w / 2, w / 2, 0, Math.PI); g.lineTo(ox, y - 4)
      const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, '#ffffff'); gr.addColorStop(1, '#d8cfd0')
      g.fillStyle = gr; g.fill(); g.strokeStyle = 'rgba(30,10,14,.6)'; g.lineWidth = 2; g.stroke()
    }
  } },
  bricks: { size: 256, base: '#b9b0aa', draw: (g, S, r) => {
    const bh = 32, bw = 64
    for (let row = 0; row < S / bh; row++) for (let x = -bw; x < S + bw; x += bw) {
      const ox = x + (row % 2) * (bw / 2), sh = 235 + Math.floor(r() * 20)
      g.fillStyle = `rgb(${sh},${sh - 6},${sh - 10})`; g.fillRect(ox + 3, row * bh + 3, bw - 6, bh - 6)
    }
  } },
  stone: { size: 256, base: '#8f8a9a', draw: (g, S, r) => {
    const n = 5, c = S / n, cells: { x: number; y: number; rx: number; ry: number; sh: number }[] = []
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) cells.push({ x: (i + 0.5 + (r() - 0.5) * 0.4) * c, y: (j + 0.5 + (r() - 0.5) * 0.4) * c, rx: c * 0.46, ry: c * 0.42, sh: 225 + Math.floor(r() * 30) })
    tiled(g, S, () => cells.forEach((k) => { g.beginPath(); g.ellipse(k.x, k.y, k.rx, k.ry, 0, 0, TAU); g.fillStyle = `rgb(${k.sh},${k.sh},${k.sh + 6})`; g.fill() }))
  } },
  pebbles: { size: 256, base: '#f2eadf', draw: (g, S, r) => {
    const P = Array.from({ length: 70 }, () => ({ x: r() * S, y: r() * S, rx: 4 + r() * 7, ry: 3 + r() * 5, a: r() * 3 }))
    tiled(g, S, () => P.forEach((p) => {
      g.beginPath(); g.ellipse(p.x, p.y, p.rx, p.ry, p.a, 0, TAU); g.fillStyle = 'rgba(120,90,60,.30)'; g.fill()
      g.beginPath(); g.ellipse(p.x - 1, p.y - 1, p.rx * 0.6, p.ry * 0.5, p.a, 0, TAU); g.fillStyle = 'rgba(255,255,255,.55)'; g.fill()
    }))
  } },
  grass: { size: 256, base: '#f4f4f0', draw: (g, S, r) => {
    const B = Array.from({ length: 30 }, () => ({ x: r() * S, y: r() * S, r: 20 + r() * 40, d: r() < 0.5 }))
    tiled(g, S, () => B.forEach((b) => { g.beginPath(); g.arc(b.x, b.y, b.r, 0, TAU); g.fillStyle = b.d ? 'rgba(0,50,20,.07)' : 'rgba(255,255,200,.10)'; g.fill() }))
    const L = Array.from({ length: 260 }, () => ({ x: r() * S, y: r() * S, h: 8 + r() * 14, l: r() - 0.5, d: r() < 0.6 }))
    tiled(g, S, () => L.forEach((b) => { g.beginPath(); g.moveTo(b.x, b.y); g.quadraticCurveTo(b.x + b.l * 6, b.y - b.h * 0.6, b.x + b.l * 12, b.y - b.h); g.strokeStyle = b.d ? 'rgba(10,60,25,.28)' : 'rgba(255,255,210,.45)'; g.lineWidth = 1.6; g.stroke() }))
  } },
  bark: { size: 256, base: '#f2ece4', draw: (g, S, r) => {
    const L = Array.from({ length: 34 }, () => ({ x: r() * S, w: 1 + r() * 3, a: 2 + r() * 4, k: 1 + Math.floor(r() * 2), p: r() * TAU, al: 0.15 + r() * 0.25 }))
    tiled(g, S, () => L.forEach((l) => { wavy(g, S, true, l.x, l.a, l.k, l.p); g.strokeStyle = `rgba(40,20,10,${l.al})`; g.lineWidth = l.w; g.stroke() }))
  } },
  needles: { size: 256, base: '#f4f4ee', draw: (g, S, r) => {
    const N = Array.from({ length: 420 }, () => ({ x: r() * S, y: r() * S, l: 6 + r() * 8, d: r() < 0.55 }))
    tiled(g, S, () => N.forEach((n) => { g.beginPath(); g.moveTo(n.x, n.y); g.lineTo(n.x + n.l * 0.7, n.y + n.l); g.strokeStyle = n.d ? 'rgba(0,40,15,.30)' : 'rgba(255,255,200,.35)'; g.lineWidth = 1.4; g.stroke() }))
  } },
  leaves: { size: 256, base: '#f4f4ee', draw: (g, S, r) => {
    const C = Array.from({ length: 60 }, () => ({ x: r() * S, y: r() * S, r: 12 + r() * 14, t: r() }))
    tiled(g, S, () => C.forEach((c) => {
      g.beginPath(); g.arc(c.x, c.y, c.r, 0, TAU); g.fillStyle = c.t < 0.5 ? 'rgba(255,255,200,.18)' : 'rgba(0,40,15,.10)'; g.fill()
      g.beginPath(); g.arc(c.x, c.y, c.r, 0.15, Math.PI - 0.15); g.strokeStyle = 'rgba(0,45,18,.38)'; g.lineWidth = 2; g.stroke()
    }))
  } },
  fur: { size: 256, base: '#fbf6f0', draw: (g, S, r) => {
    const st = Array.from({ length: 7 }, (_, i) => ({ x: (i + 0.5) * (S / 7) + (r() - 0.5) * 10, w: 8 + r() * 8, p: r() * TAU }))
    tiled(g, S, () => st.forEach((s) => { wavy(g, S, true, s.x, 4, 2, s.p); g.strokeStyle = 'rgba(120,55,10,.38)'; g.lineWidth = s.w; g.lineCap = 'round'; g.stroke() }))
    const D = Array.from({ length: 520 }, () => ({ x: r() * S, y: r() * S, l: 4 + r() * 6, d: r() < 0.6 }))
    tiled(g, S, () => D.forEach((d) => { g.beginPath(); g.moveTo(d.x, d.y); g.lineTo(d.x + 1, d.y + d.l); g.strokeStyle = d.d ? 'rgba(120,60,20,.16)' : 'rgba(255,255,255,.28)'; g.lineWidth = 1; g.stroke() }))
  } },
  fabric: { size: 128, base: '#f7f4f6', draw: (g, S) => {
    for (let i = 0; i < S; i += 4) { g.fillStyle = 'rgba(60,20,50,.08)'; g.fillRect(i, 0, 1.5, S); g.fillRect(0, i, S, 1.5) }
  } },
  quilt: { size: 256, base: '#f6f3fb', draw: (g, S) => {
    g.strokeStyle = 'rgba(40,20,80,.32)'; g.lineWidth = 2.5
    for (let i = -S; i <= S * 2; i += 64) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + S, S); g.stroke(); g.beginPath(); g.moveTo(i, S); g.lineTo(i + S, 0); g.stroke() }
    g.fillStyle = 'rgba(40,20,80,.4)'
    for (let x = 0; x < S; x += 64) for (let y = 0; y < S; y += 64) { g.beginPath(); g.arc(x + 32, y, 3, 0, TAU); g.arc(x, y + 32, 3, 0, TAU); g.fill() }
  } },
  rug: { size: 512, base: '#ffffff', draw: (g, S) => {
    const c = S / 2
    for (let i = 1; i <= 7; i++) { g.beginPath(); g.arc(c, c, (i * S) / 15.5, 0, TAU); g.strokeStyle = i % 2 ? 'rgba(255,255,255,.7)' : 'rgba(120,20,70,.30)'; g.lineWidth = i % 3 === 0 ? 12 : 6; g.stroke() }
    g.beginPath()
    for (let a = 0; a <= 48; a++) { const rad = a % 2 ? S * 0.33 : S * 0.38, t = (a / 48) * TAU; a ? g.lineTo(c + Math.cos(t) * rad, c + Math.sin(t) * rad) : g.moveTo(c + Math.cos(t) * rad, c + Math.sin(t) * rad) }
    g.strokeStyle = 'rgba(80,10,50,.35)'; g.lineWidth = 4; g.stroke()
  } },
  water: { size: 256, base: '#eaf7ff', draw: (g, S, r) => {
    const A = Array.from({ length: 16 }, () => ({ x: r() * S, y: r() * S, r: 10 + r() * 22 }))
    tiled(g, S, () => A.forEach((a) => {
      g.beginPath(); g.arc(a.x, a.y, a.r, 3.4, 5.9); g.strokeStyle = 'rgba(255,255,255,.95)'; g.lineWidth = 2.5; g.stroke()
      g.beginPath(); g.arc(a.x, a.y + 4, a.r, 0.3, 2.6); g.strokeStyle = 'rgba(30,120,180,.20)'; g.lineWidth = 2; g.stroke()
    }))
  } },
}

const bases = new Map<string, Texture>()
const variants = new Map<string, Texture>()

function finish(c: HTMLCanvasElement) {
  const t = new CanvasTexture(c)
  t.wrapS = t.wrapT = RepeatWrapping; t.colorSpace = SRGBColorSpace; t.anisotropy = 8
  return t
}

// Текстура за назвою. Варіанти (повтор, поворот) кешуються: той самий об'єкт можна анімувати.
export function getTex(name: string, rotate = false, repeat: number[] = [1, 1]): Texture {
  const key = `${name}|${rotate ? 1 : 0}|${repeat.join(',')}`
  const hit = variants.get(key); if (hit) return hit
  let base = bases.get(name)
  if (!base) {
    const d = GEN[name]
    const c = document.createElement('canvas'); c.width = c.height = d.size
    const g = c.getContext('2d')!
    g.fillStyle = d.base; g.fillRect(0, 0, d.size, d.size)
    d.draw(g, d.size, rng(name.length * 97 + name.charCodeAt(0)))
    base = finish(c); bases.set(name, base)
  }
  const t = base.clone(); t.needsUpdate = true
  t.repeat.set(repeat[0], repeat[1])
  if (rotate) { t.center.set(0.5, 0.5); t.rotation = Math.PI / 2 }
  variants.set(key, t)
  return t
}

// UV коробки в одиницях світу: візерунок не розтягується на великих гранях
export function scaleBoxUV(g: BufferGeometry, [w, h, d]: number[], tile: number) {
  const uv = g.attributes.uv; if (!uv) return
  const dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]] // +x, -x, +y, -y, +z, -z
  for (let f = 0; f < 6; f++) for (let i = 0; i < 4; i++) {
    const k = f * 4 + i
    uv.setXY(k, (uv.getX(k) * dims[f][0]) / tile, (uv.getY(k) * dims[f][1]) / tile)
  }
  uv.needsUpdate = true
}

// Паркет кімнати: кольорові дошки з волокнами, швами й цвяхами
export function floorWood() {
  const S = 1024, c = document.createElement('canvas'); c.width = c.height = S
  const g = c.getContext('2d')!, r = rng(5)
  const shades = ['#d9965f', '#e3a36d', '#cf8a55', '#dc9c66'], rows = 8, h = S / rows
  for (let i = 0; i < rows; i++) {
    g.fillStyle = shades[i % 4]; g.fillRect(0, i * h, S, h)
    for (let j = 0; j < 16; j++) { wavy(g, S, false, i * h + 8 + r() * (h - 16), 1 + r() * 2.5, 1 + Math.floor(r() * 3), r() * TAU); g.strokeStyle = `rgba(90,45,20,${0.12 + r() * 0.14})`; g.lineWidth = 1 + r(); g.stroke() }
    const kx = r() * S, ky = i * h + h / 2
    for (let q = 1; q <= 3; q++) { g.beginPath(); g.ellipse(kx, ky, q * 9, q * 3.5, 0, 0, TAU); g.strokeStyle = `rgba(90,45,20,${0.3 - q * 0.07})`; g.lineWidth = 1.6; g.stroke() }
    g.fillStyle = '#0d0816'; g.fillRect(0, i * h, S, 4)
    const o1 = (i * 337) % S, o2 = (o1 + S / 2) % S
    g.fillRect(o1, i * h, 4, h); g.fillRect(o2, i * h, 4, h)
    g.fillStyle = 'rgba(60,30,15,.55)'
    for (const o of [o1, o2]) for (const dx of [10, -10]) { g.beginPath(); g.arc(o + dx, i * h + 14, 2.5, 0, TAU); g.arc(o + dx, i * h + h - 14, 2.5, 0, TAU); g.fill() }
  }
  const t = finish(c); t.repeat.set(2, 6 / 3.5)
  return t
}
