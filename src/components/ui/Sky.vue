<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useFocusStore } from '@/stores/focus'
import { MOON, SUN, tr } from '@/i18n'
import { thunder } from '@/lib/ambient'

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

// ---- блискавка під час дощу ----
const flash = ref(false)
let lightning = 0
function schedule(first = false) {
  lightning = window.setTimeout(() => {
    flash.value = true
    setTimeout(() => (flash.value = false), 120)
    setTimeout(() => { flash.value = true; setTimeout(() => (flash.value = false), 90) }, 230)
    setTimeout(thunder, 500 + Math.random() * 900)
    schedule()
  }, first ? 3000 : 7000 + Math.random() * 12000)
}
watch(() => store.weather, (w) => { clearTimeout(lightning); if (w === 'rain') schedule(true) })

// ---- пасхалки: клік по сонцю чи місяцю ----
const sun = ref<HTMLElement>()
const moon = ref<HTMLElement>()
const wink = ref(false)
let taps = 0, tapTimer = 0
function onClick(e: MouseEvent) {
  const body = store.night ? moon.value : sun.value
  if (!body) return
  const b = body.getBoundingClientRect()
  if (e.clientX < b.left || e.clientX > b.right || e.clientY < b.top || e.clientY > b.bottom) return
  wink.value = true; setTimeout(() => (wink.value = false), 700)
  const pool = store.night ? MOON : SUN
  store.say(tr(pool[Math.floor(Math.random() * pool.length)]))
  taps++; clearTimeout(tapTimer); tapTimer = window.setTimeout(() => (taps = 0), 2500)
  if (taps >= 5) { taps = 0; store.boom() } // 5 швидких кліків = феєрверк
}
onMounted(() => window.addEventListener('click', onClick))
onBeforeUnmount(() => { window.removeEventListener('click', onClick); clearTimeout(lightning) })
</script>

<template>
  <div class="sky" :class="[store.weather, { night: store.night }]" aria-hidden="true">
    <div class="layer day" />
    <div class="layer nightbg" />
    <div class="stars"><i v-for="(s, i) in stars" :key="i" :style="{ left: s.left, top: s.top, width: s.size, height: s.size, animationDelay: s.delay, animationDuration: s.dur }" /></div>
    <i class="shoot" />
    <div ref="sun" class="sun" :class="{ wink }" />
    <div ref="moon" class="moon" :class="{ wink }" />

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

    <div class="gloom" />
  </div>
  <div class="flash" :class="{ on: flash }" aria-hidden="true" />
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
.wink { animation: wink .7s ease; }
@keyframes wink { 30% { transform: scale(1.25) rotate(-12deg); } 60% { transform: scale(.9) rotate(8deg); } }

.cloud { position: absolute; left: 0; animation: drift linear infinite; transition: opacity 1.6s; }
.cloud use { transition: fill 1.6s; }
.cloud .outline { fill: #0d0816; stroke: #0d0816; stroke-width: 9; stroke-linejoin: round; }
.cloud .fill { fill: #ffffff; }
.night .cloud { opacity: .55; }
.night .cloud .fill { fill: #5a4aa0; }
.rain .cloud .fill { fill: #8d96b5; }
.rain.night .cloud .fill { fill: #3d3a6b; }
@keyframes drift { from { transform: translateX(-40vw); } to { transform: translateX(120vw); } }

/* погода: дощ темнить небо, сніг робить його молочним */
.gloom { position: absolute; inset: 0; opacity: 0; transition: opacity 1.4s ease, background 1.4s ease; }
.rain .gloom { opacity: 1; background: linear-gradient(rgba(60,70,105,.55), rgba(45,55,90,.35)); }
.snow .gloom { opacity: 1; background: rgba(235,242,255,.26); }

.flash { position: fixed; inset: 0; z-index: 5; background: #fff; opacity: 0; pointer-events: none; transition: opacity .25s; }
.flash.on { opacity: .55; transition: none; }
</style>
