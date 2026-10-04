<script setup lang="ts">
import { useFocusStore } from '@/stores/focus'

const store = useFocusStore()

function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const r = rng(11)
const stars = Array.from({ length: 110 }, () => ({
  left: r() * 100 + '%', top: r() * 66 + '%',
  size: 1.5 + r() * 2.5 + 'px', delay: r() * 5 + 's', dur: 2 + r() * 3 + 's',
}))
const clouds = [
  { top: 6, w: 260, dur: 120, delay: -30 },
  { top: 16, w: 170, dur: 170, delay: -110 },
  { top: 26, w: 340, dur: 150, delay: -60 },
  { top: 11, w: 210, dur: 200, delay: -160 },
  { top: 34, w: 150, dur: 190, delay: -15 },
]
</script>

<template>
  <div class="sky" :class="{ night: store.night }" aria-hidden="true">
    <div class="layer day" />
    <div class="layer nightbg" />
    <div class="stars"><i v-for="(s, i) in stars" :key="i" :style="{ left: s.left, top: s.top, width: s.size, height: s.size, animationDelay: s.delay, animationDuration: s.dur }" /></div>
    <i class="shoot" />
    <div class="sun" />
    <div class="moon" />

    <!-- хмарка описана один раз, далі її лише повторюємо -->
    <svg width="0" height="0" style="position:absolute">
      <defs>
        <g id="cloud-shape">
          <circle cx="55" cy="55" r="28" /><circle cx="95" cy="40" r="34" /><circle cx="140" cy="52" r="28" />
          <rect x="40" y="55" width="120" height="28" rx="14" />
        </g>
      </defs>
    </svg>
    <svg v-for="(c, i) in clouds" :key="i" class="cloud" viewBox="0 0 200 95"
      :style="{ top: c.top + '%', width: c.w + 'px', animationDuration: c.dur + 's', animationDelay: c.delay + 's' }">
      <use href="#cloud-shape" class="outline" />
      <use href="#cloud-shape" class="fill" />
    </svg>
  </div>
</template>

<style scoped>
.sky { position: fixed; inset: 0; z-index: -1; overflow: hidden; }
.layer { position: absolute; inset: 0; transition: opacity 1.6s ease; }
.day { background: linear-gradient(180deg, #5eb2ff 0%, #9fd3ff 55%, #ffe9d6 100%); }
.nightbg { opacity: 0; background: linear-gradient(180deg, #080517 0%, #1a1245 60%, #3a2570 100%); }
.night .nightbg { opacity: 1; }

.stars { position: absolute; inset: 0; opacity: 0; transition: opacity 1.6s ease; }
.night .stars { opacity: 1; }
.stars i { position: absolute; border-radius: 50%; background: #fff; box-shadow: 0 0 6px 1px rgba(255,255,255,.7); animation: twinkle 3s ease-in-out infinite; }
@keyframes twinkle { 0%, 100% { opacity: .25; transform: scale(.8); } 50% { opacity: 1; transform: scale(1.2); } }

.shoot { position: absolute; top: 10%; left: 70%; width: 130px; height: 2px; opacity: 0; border-radius: 2px; background: linear-gradient(90deg, #fff, transparent); }
.night .shoot { animation: shoot 9s linear 2s infinite; }
@keyframes shoot {
  0%, 92% { opacity: 0; transform: translate(0, 0) rotate(-25deg); }
  94% { opacity: 1; }
  100% { opacity: 0; transform: translate(-320px, 150px) rotate(-25deg); }
}

.sun, .moon { position: absolute; border-radius: 50%; border: 4px solid #0d0816; transition: transform 1.8s cubic-bezier(.6,0,.3,1), opacity 1.2s; }
.sun { left: 16%; top: 12%; width: 92px; height: 92px; background: #ffd23f; box-shadow: 0 0 60px 20px rgba(255,210,63,.55); }
.night .sun { transform: translateY(85vh); opacity: 0; }
.moon { left: 22%; top: 14%; width: 78px; height: 78px; opacity: 0; transform: translateY(70vh);
  background: radial-gradient(circle at 30% 35%, #d8d2b8 0 9px, transparent 10px), radial-gradient(circle at 65% 60%, #d8d2b8 0 12px, transparent 13px), radial-gradient(circle at 55% 22%, #d8d2b8 0 6px, transparent 7px), #fff6d0;
  box-shadow: 0 0 50px 14px rgba(255,246,208,.4); }
.night .moon { opacity: 1; transform: translateY(0); }

.cloud { position: absolute; left: 0; animation: drift linear infinite; transition: opacity 1.6s; }
.cloud use { transition: fill 1.6s; }
.cloud .outline { fill: #0d0816; stroke: #0d0816; stroke-width: 9; stroke-linejoin: round; }
.cloud .fill { fill: #ffffff; }
.night .cloud { opacity: .55; }
.night .cloud .fill { fill: #5a4aa0; }
@keyframes drift { from { transform: translateX(-40vw); } to { transform: translateX(120vw); } }
</style>
