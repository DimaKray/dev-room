<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch } from 'vue'
import { useFocusStore } from '@/stores/focus'
import { t } from '@/i18n'
import { startAmbient, updateAmbient } from '@/lib/ambient'
import Experience from '@/components/scene/Experience.vue'
import Loader from '@/components/ui/Loader.vue'
import HudNav from '@/components/ui/HudNav.vue'
import InfoPanel from '@/components/ui/InfoPanel.vue'
import Sky from '@/components/ui/Sky.vue'
import Toast from '@/components/ui/Toast.vue'
import Fireworks from '@/components/ui/Fireworks.vue'
import SimplePage from '@/components/ui/SimplePage.vue'

const store = useFocusStore()

// Konami-код: ↑ ↑ ↓ ↓ ← → ← → B A
const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a']
let idx = 0
const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') store.reset()
  const k = e.key.toLowerCase()
  idx = k === KONAMI[idx] ? idx + 1 : k === KONAMI[0] ? 1 : 0
  if (idx === KONAMI.length) { idx = 0; store.boom(); store.say(t('konami')) }
}

// фонові звуки: браузер дозволяє їх лише після першого кліку; у простій версії вони вимкнені
const sync = () => updateAmbient({ sound: store.sound && !store.simple, night: store.night, weather: store.weather })
const first = () => { startAmbient(); sync(); window.removeEventListener('pointerdown', first) }
watch(() => [store.sound, store.night, store.weather, store.simple], sync)

onMounted(() => { window.addEventListener('keydown', onKey); window.addEventListener('pointerdown', first) })
onBeforeUnmount(() => { window.removeEventListener('keydown', onKey); window.removeEventListener('pointerdown', first) })
</script>

<template>
  <!-- проста версія завжди в DOM: її читають пошуковики й скрінрідери -->
  <SimplePage />
  <template v-if="!store.simple">
    <Sky />
    <Experience />
    <HudNav />
    <InfoPanel />
    <Loader />
  </template>
  <Toast />
  <Fireworks />
</template>
