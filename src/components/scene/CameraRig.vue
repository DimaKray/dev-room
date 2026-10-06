<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from 'vue'
import { useLoop, useTres } from '@tresjs/core'
import gsap from 'gsap'
import { useFocusStore } from '@/stores/focus'
import { perf } from '@/lib/perf'
import { SPOTS, type SpotId } from '@/data/spots'

const store = useFocusStore()
const { camera, renderer } = useTres()
// prefers-reduced-motion: без польоту камери й паралаксу
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
// менше пікселів на телефонах
watch(renderer, (r) => r?.setPixelRatio(Math.min(window.devicePixelRatio, perf.low ? 1.5 : 2)), { immediate: true })
const { onBeforeRender } = useLoop()

// власний "стан камери": GSAP анімує його, а кожен кадр ми переносимо в справжню камеру
const pos = { x: 20, y: 14, z: 28 }
const look = { x: 0, y: 2, z: 0 }
const offset = { x: 0, y: 0 }
const mouse = { x: 0, y: 0 }

function fly(id: SpotId, dur = 1.8) {
  const duration = reduce ? 0.01 : dur
  const s = SPOTS[id]
  gsap.killTweensOf([pos, look])
  gsap.to(pos, { x: s.cam[0], y: s.cam[1], z: s.cam[2], duration, ease: 'power3.inOut' })
  gsap.to(look, { x: s.look[0], y: s.look[1], z: s.look[2], duration, ease: 'power3.inOut' })
}

const onMove = (e: PointerEvent) => {
  mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
  mouse.y = (e.clientY / window.innerHeight - 0.5) * 2
}
onMounted(() => window.addEventListener('pointermove', onMove))
onBeforeUnmount(() => window.removeEventListener('pointermove', onMove))

// кінематографічний виліт до хатинки після лоадера
watch(() => store.ready, (r) => r && fly(store.current, 3.6))
// вхід/вихід з будинку летить довше
watch(() => store.current, (id, old) => {
  if (!store.ready) return
  fly(id, id === 'outside' || old === 'outside' ? 2.8 : 1.8)
})

onBeforeRender(() => {
  const cam = camera.value
  if (!cam) return
  // паралакс від миші: слабший, коли камера вже "вчепилась" в об'єкт
  const k = (store.current === 'outside' || store.current === 'overview' ? 0.6 : 0.12) * (reduce ? 0 : 1)
  offset.x += (mouse.x * k - offset.x) * 0.05
  offset.y += (-mouse.y * k * 0.6 - offset.y) * 0.05
  cam.position.set(pos.x + offset.x, pos.y + offset.y, pos.z)
  cam.lookAt(look.x, look.y, look.z)
})
</script>

<template><TresGroup /></template>
