<script setup lang="ts">
import { computed } from 'vue'
import { useFocusStore } from '@/stores/focus'
import { SPOT_LIST, SPOTS } from '@/data/spots'
import { lang, t, toggleLang, tr } from '@/i18n'
import { NAME } from '@/data/profile'

const store = useFocusStore()
const hint = computed(() => {
  const h = store.hovered
  if (!h) return ''
  if (h === 'outside') return t('hintEnter')
  if (h === 'lamp') return t('hintLamp')
  return t('hintOpen') + tr(SPOTS[h].nav)
})
const weatherLabel = computed(() => `${t('weather')}: ${t(store.weather === 'clear' ? 'weatherClear' : store.weather === 'rain' ? 'weatherRain' : 'weatherSnow')}`)
</script>

<template>
  <div class="hud" :class="{ on: store.ready }">
    <div class="brand">
      <strong>{{ tr(NAME) }}</strong>
      <span>{{ t('role') }}</span>
    </div>

    <div class="tools">
      <button v-if="store.current === 'overview'" class="tool exit glass" @click="store.exit()">{{ t('exit') }}</button>

      <button class="tool exit glass" @click="store.setSimple(true)">{{ t('simpleMode') }}</button>

      <button class="tool lang glass" :aria-label="t('langAria')" @click="toggleLang()">
        <b :class="{ on: lang === 'uk' }">UA</b><i>/</i><b :class="{ on: lang === 'en' }">EN</b>
      </button>

      <button class="tool round glass" :aria-label="weatherLabel" :title="weatherLabel" @click="store.cycleWeather()">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <template v-if="store.weather === 'clear'"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></template>
          <template v-else-if="store.weather === 'rain'"><path d="M7 14a4.5 4.5 0 1 1 1.2-8.8A5.5 5.5 0 0 1 18.5 7 3.5 3.5 0 0 1 18 14Z" /><path d="M8 17l-1 3M12 17l-1 3M16 17l-1 3" /></template>
          <template v-else><path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7" /></template>
        </svg>
      </button>

      <button class="tool round glass" :aria-label="store.sound ? t('soundOff') : t('soundOn')" :aria-pressed="store.sound" @click="store.toggleSound()">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 5 6 9H3v6h3l5 4z" />
          <path v-if="store.sound" d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
          <path v-else d="m16 9 5 6m0-6-5 6" />
        </svg>
      </button>

      <button class="tool round glass" :aria-label="store.night ? t('toDay') : t('toNight')" @click="store.toggleNight()">
        {{ store.night ? '☀' : '☾' }}
      </button>
    </div>

    <Transition name="hint">
      <div v-if="hint" class="hint glass">{{ hint }}</div>
    </Transition>

    <!-- зовні: велика кнопка входу -->
    <button v-if="!store.inside" class="cta" @click="store.enter()">{{ t('enter') }}</button>

    <!-- всередині: меню розділів -->
    <nav v-else class="dock glass" aria-label="Room sections">
      <button
        v-for="(s, i) in SPOT_LIST" :key="s.id" class="pill" :style="{ '--i': i }"
        :class="{ active: store.current === s.id }" @click="store.go(s.id)"
      >{{ tr(s.nav) }}</button>
    </nav>
  </div>
</template>

<style scoped>
.hud { position: fixed; inset: 0; pointer-events: none; z-index: 10; visibility: hidden; }
.hud.on { visibility: visible; }
.hud > * { pointer-events: auto; }

/* поява через CSS-анімації */
.hud.on .brand { animation: slide-in 1s cubic-bezier(.2,.8,.2,1) 1.2s both; }
.hud.on .pill { animation: pop .8s cubic-bezier(.2,1.4,.4,1) calc(.9s + var(--i) * .08s) both; }
.hud.on .tools { animation: slide-down .9s cubic-bezier(.2,1.2,.4,1) 1.8s both; }
.hud.on .cta { animation: pop .9s cubic-bezier(.2,1.4,.4,1) 3.2s both, glow 2.4s ease-in-out 4.2s infinite; }
@keyframes slide-in { from { opacity: 0; transform: translateX(-40px); } }
@keyframes slide-down { from { opacity: 0; transform: translateY(-30px); } }
@keyframes pop { from { opacity: 0; transform: translateY(50px) scale(.8); } }
@keyframes glow { 0%, 100% { box-shadow: 0 0 0 0 rgba(255,111,181,.55); } 50% { box-shadow: 0 0 0 16px rgba(255,111,181,0); } }

.brand { position: absolute; top: 28px; left: 32px; display: grid; line-height: 1.2; text-shadow: 0 2px 20px rgba(0,0,0,.35); }
.brand strong { font-size: 20px; letter-spacing: -0.01em; }
.brand span { opacity: .7; font-size: 14px; }

.tools { position: absolute; top: 24px; right: 32px; display: flex; gap: 8px; align-items: center; }
.tool { height: 48px; border-radius: 999px; display: grid; place-items: center; font-size: 15px; font-weight: 500; transition: background .3s; }
.tool:hover { background: rgba(255,255,255,.18); }
.round { width: 48px; font-size: 20px; }
.exit { padding: 0 20px; }
.lang { grid-auto-flow: column; gap: 4px; padding: 0 16px; font-size: 13px; }
.lang b { opacity: .5; font-weight: 600; transition: opacity .3s, color .3s; }
.lang b.on { opacity: 1; color: var(--cyan); }
.lang i { font-style: normal; opacity: .4; }

.cta { position: absolute; bottom: 44px; left: 50%; translate: -50% 0; padding: 16px 38px; border-radius: 999px; font-size: 18px; font-weight: 600; color: var(--night); background: linear-gradient(120deg, var(--pink), var(--cyan)); }
.dock { position: absolute; bottom: 28px; left: 50%; translate: -50% 0; display: flex; gap: 4px; padding: 6px; border-radius: 999px; }
.pill { padding: 10px 18px; border-radius: 999px; font-size: 15px; font-weight: 500; color: var(--text); transition: background .3s, color .3s; }
.pill:hover { background: rgba(255,255,255,.14); }
.pill.active { color: var(--night); background: linear-gradient(120deg, var(--pink), var(--cyan)); }
.hint { position: absolute; bottom: 110px; left: 50%; translate: -50% 0; padding: 8px 16px; border-radius: 12px; font-size: 14px; text-align: center; }
.hint-enter-active, .hint-leave-active { transition: opacity .25s, transform .25s; }
.hint-enter-from, .hint-leave-to { opacity: 0; transform: translateY(8px); }
@media (max-width: 640px) {
  .dock { width: calc(100% - 24px); overflow-x: auto; }
  .pill { white-space: nowrap; padding: 10px 14px; }
  .brand { left: 18px; top: 20px; }
  .tools { top: 70px; right: 12px; gap: 6px; flex-wrap: wrap; justify-content: flex-end; max-width: calc(100vw - 24px); }
  .tool { height: 40px; } .round { width: 40px; font-size: 18px; } .exit { padding: 0 14px; }
}
</style>
