<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { useFocusStore } from '@/stores/focus'

// Феєрверк на 2D canvas поверх усього (Konami-код або 5 кліків по сонцю чи місяцю)
const store = useFocusStore()
const cv = ref<HTMLCanvasElement>()
type P = { x: number; y: number; vx: number; vy: number; life: number; max: number; c: string }
const ps: P[] = []
const colors = ['#ff6fb5', '#62f0ff', '#ffd166', '#8a63ff', '#7ee787', '#ffffff']
let raf = 0, until = 0, nextBurst = 0

function burst(w: number, h: number) {
  const x = w * (0.15 + Math.random() * 0.7), y = h * (0.12 + Math.random() * 0.4)
  const c = colors[Math.floor(Math.random() * colors.length)]
  for (let i = 0; i < 70; i++) {
    const a = Math.random() * Math.PI * 2, s = 1 + Math.random() * 5
    ps.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0, max: 60 + Math.random() * 40, c })
  }
}

function frame(t: number) {
  const c = cv.value!, g = c.getContext('2d')!, w = c.width, h = c.height
  g.globalCompositeOperation = 'destination-out'; g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(0, 0, w, h)
  g.globalCompositeOperation = 'lighter'
  if (t < until && t > nextBurst) { burst(w, h); nextBurst = t + 320 + Math.random() * 250 }
  for (let i = ps.length - 1; i >= 0; i--) {
    const p = ps[i]
    p.vy += 0.06; p.x += p.vx; p.y += p.vy; p.vx *= 0.985; p.life++
    if (p.life > p.max) { ps.splice(i, 1); continue }
    g.globalAlpha = 1 - p.life / p.max; g.fillStyle = p.c
    g.beginPath(); g.arc(p.x, p.y, 2.2, 0, Math.PI * 2); g.fill()
  }
  g.globalAlpha = 1
  if (t < until || ps.length) raf = requestAnimationFrame(frame)
  else { g.clearRect(0, 0, w, h); raf = 0 }
}

watch(() => store.fireworks, () => {
  const c = cv.value; if (!c) return
  c.width = window.innerWidth; c.height = window.innerHeight
  until = performance.now() + 6500; nextBurst = 0
  if (!raf) raf = requestAnimationFrame(frame)
})
onBeforeUnmount(() => cancelAnimationFrame(raf))
</script>

<template><canvas ref="cv" class="fw" aria-hidden="true" /></template>

<style scoped>
.fw { position: fixed; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 40; }
</style>
