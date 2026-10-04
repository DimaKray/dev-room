<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import gsap from 'gsap'
import { useFocusStore } from '@/stores/focus'

const store = useFocusStore()
const root = ref<HTMLElement>()
const bar = ref<HTMLElement>()
const gone = ref(false)
const barDone = ref(false)

onMounted(() => {
  gsap.from('.loader-title .clip span', { yPercent: 110, stagger: 0.04, duration: 0.9, ease: 'power4.out' })
  gsap.to(bar.value!, { scaleX: 1, duration: 1.8, ease: 'power2.inOut', onComplete: () => (barDone.value = true) })
})

// чекаємо і смужку, і готовність 3D-сцени, потім "розсуваємо" завісу
watch([barDone, () => store.canvasReady], ([b, c]) => {
  if (!b || !c) return
  store.ready = true
  gsap.to(root.value!, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'power4.inOut', onComplete: () => (gone.value = true) })
})

const title = 'Кімната розробника'.split('')
</script>

<template>
  <div v-if="!gone" ref="root" class="loader">
    <h1 class="loader-title" aria-label="Кімната розробника">
      <span v-for="(ch, i) in title" :key="i" class="clip" aria-hidden="true"><span>{{ ch === ' ' ? '\u00A0' : ch }}</span></span>
    </h1>
    <div class="track"><div ref="bar" class="fill" /></div>
  </div>
</template>

<style scoped>
.loader {
  position: fixed; inset: 0; z-index: 50; display: grid; place-content: center; gap: 28px;
  background: radial-gradient(circle at 50% 40%, var(--plum), var(--night) 70%);
  clip-path: inset(0 0 0 0);
}
.loader-title { display: flex; font-size: clamp(34px, 7vw, 76px); font-weight: 700; letter-spacing: -0.03em; }
.clip { overflow: hidden; display: inline-block; }
.clip span { display: inline-block; }
.track { height: 3px; background: var(--line); border-radius: 3px; overflow: hidden; }
.fill { height: 100%; background: linear-gradient(90deg, var(--pink), var(--cyan)); transform: scaleX(0); transform-origin: left; }
</style>
