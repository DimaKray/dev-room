<script setup lang="ts">
import { computed } from 'vue'
import { useFocusStore } from '@/stores/focus'
import { SPOT_LIST, SPOTS } from '@/data/spots'

const store = useFocusStore()
const hint = computed(() => {
  const h = store.hovered
  if (!h) return ''
  return h === 'outside' ? 'Клікни, щоб увійти' : `Відкрити: ${SPOTS[h].nav}`
})
</script>

<template>
  <div class="hud" :class="{ on: store.ready }">
    <div class="brand">
      <strong>Дмитро Крайнов</strong>
      <span>web-розробник</span>
    </div>

    <button v-if="store.current === 'overview'" class="exit-btn glass" @click="store.exit()">← Вийти</button>
    <button class="sound-btn glass" :aria-label="store.sound ? 'Вимкнути звук' : 'Увімкнути звук'" :aria-pressed="store.sound" @click="store.toggleSound()">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M11 5 6 9H3v6h3l5 4z" />
        <path v-if="store.sound" d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
        <path v-else d="m16 9 5 6m0-6-5 6" />
      </svg>
    </button>
    <button class="night-btn glass" :aria-label="store.night ? 'Увімкнути день' : 'Увімкнути ніч'" @click="store.toggleNight()">
      {{ store.night ? '☀' : '☾' }}
    </button>

    <Transition name="hint">
      <div v-if="hint" class="hint glass">{{ hint }}</div>
    </Transition>

    <!-- зовні: велика кнопка входу -->
    <button v-if="!store.inside" class="cta" @click="store.enter()">Увійти в будинок</button>

    <!-- всередині: меню розділів -->
    <nav v-else class="dock glass" aria-label="Розділи кімнати">
      <button
        v-for="(s, i) in SPOT_LIST" :key="s.id" class="pill" :style="{ '--i': i }"
        :class="{ active: store.current === s.id }" @click="store.go(s.id)"
      >{{ s.nav }}</button>
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
.hud.on .night-btn { animation: spin-in .8s cubic-bezier(.2,1.4,.4,1) 1.8s both; }
.hud.on .sound-btn { animation: spin-in .8s cubic-bezier(.2,1.4,.4,1) 1.9s both; }
.hud.on .cta { animation: pop .9s cubic-bezier(.2,1.4,.4,1) 3.2s both, glow 2.4s ease-in-out 4.2s infinite; }
.exit-btn { animation: pop .6s cubic-bezier(.2,1.4,.4,1) .9s both; }
@keyframes slide-in { from { opacity: 0; transform: translateX(-40px); } }
@keyframes pop { from { opacity: 0; transform: translateY(50px) scale(.8); } }
@keyframes spin-in { from { opacity: 0; transform: scale(0) rotate(-90deg); } }
@keyframes glow { 0%, 100% { box-shadow: 0 0 0 0 rgba(255,111,181,.55); } 50% { box-shadow: 0 0 0 16px rgba(255,111,181,0); } }

.brand { position: absolute; top: 28px; left: 32px; display: grid; line-height: 1.2; text-shadow: 0 2px 20px rgba(0,0,0,.35); }
.brand strong { font-size: 20px; letter-spacing: -0.01em; }
.brand span { opacity: .7; font-size: 14px; }
.night-btn, .sound-btn { position: absolute; top: 24px; width: 48px; height: 48px; border-radius: 50%; font-size: 20px; display: grid; place-items: center; transition: background .3s; }
.night-btn { right: 32px; }
.sound-btn { right: 88px; }
.night-btn:hover, .sound-btn:hover { background: rgba(255,255,255,.18); }
.exit-btn { position: absolute; top: 24px; right: 144px; height: 48px; padding: 0 20px; border-radius: 999px; font-size: 15px; font-weight: 500; transition: background .3s; }
.exit-btn:hover { background: rgba(255,255,255,.18); }
.cta { position: absolute; bottom: 44px; left: 50%; translate: -50% 0; padding: 16px 38px; border-radius: 999px; font-size: 18px; font-weight: 600; color: var(--night); background: linear-gradient(120deg, var(--pink), var(--cyan)); }
.dock { position: absolute; bottom: 28px; left: 50%; translate: -50% 0; display: flex; gap: 4px; padding: 6px; border-radius: 999px; }
.pill { padding: 10px 18px; border-radius: 999px; font-size: 15px; font-weight: 500; color: var(--text); transition: background .3s, color .3s; }
.pill:hover { background: rgba(255,255,255,.14); }
.pill.active { color: var(--night); background: linear-gradient(120deg, var(--pink), var(--cyan)); }
.hint { position: absolute; bottom: 110px; left: 50%; translate: -50% 0; padding: 8px 16px; border-radius: 12px; font-size: 14px; }
.hint-enter-active, .hint-leave-active { transition: opacity .25s, transform .25s; }
.hint-enter-from, .hint-leave-to { opacity: 0; transform: translateY(8px); }
@media (max-width: 640px) {
  .dock { width: calc(100% - 24px); overflow-x: auto; }
  .pill { white-space: nowrap; padding: 10px 14px; }
  .brand { left: 18px; top: 20px; }
  .night-btn { right: 16px; } .sound-btn { right: 72px; } .exit-btn { right: 128px; padding: 0 14px; }
}
</style>
