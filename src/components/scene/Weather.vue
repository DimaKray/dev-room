<script setup lang="ts">
import { ref } from 'vue'
import { useLoop } from '@tresjs/core'
import type { BufferAttribute, LineSegments, Points } from 'three'
import { useFocusStore } from '@/stores/focus'
import { perf } from '@/lib/perf'

// Дощ (лінії) і сніг (точки). Над хатинкою краплі «зникають» на рівні даху, щоб не лило в кімнату.
const store = useFocusStore()
const RAIN = perf.rain, SNOW = perf.snow, R = 16
const rand = (n: number) => (Math.random() - 0.5) * 2 * n

const rainInit = new Float32Array(RAIN * 6)
for (let i = 0; i < RAIN; i++) {
  const x = rand(R), y = Math.random() * 14, z = rand(R), o = i * 6
  rainInit.set([x, y, z, x + 0.1, y + 0.5, z], o)
}
const snowInit = new Float32Array(SNOW * 3)
for (let i = 0; i < SNOW; i++) snowInit.set([rand(R), Math.random() * 14, rand(R)], i * 3)

const rainRef = ref<LineSegments>()
const snowRef = ref<Points>()
const underRoof = (x: number, z: number, y: number) => Math.abs(x) < 3.9 && Math.abs(z) < 3.5 && y < 5.3

const { onBeforeRender } = useLoop()
onBeforeRender(({ delta, elapsed }) => {
  if (store.weather === 'rain' && rainRef.value) {
    const attr = rainRef.value.geometry.attributes.position as BufferAttribute, a = attr.array as Float32Array
    for (let i = 0; i < RAIN; i++) {
      const o = i * 6
      let y = a[o + 1] - 24 * delta
      if (y < 0 || underRoof(a[o], a[o + 2], y)) { y = 12 + Math.random() * 4; a[o] = rand(R); a[o + 2] = rand(R) }
      a[o + 1] = y; a[o + 3] = a[o] + 0.1; a[o + 4] = y + 0.5; a[o + 5] = a[o + 2]
    }
    attr.needsUpdate = true
  } else if (store.weather === 'snow' && snowRef.value) {
    const attr = snowRef.value.geometry.attributes.position as BufferAttribute, a = attr.array as Float32Array
    for (let i = 0; i < SNOW; i++) {
      const o = i * 3
      let y = a[o + 1] - (1.2 + (i % 5) * 0.25) * delta
      a[o] += Math.sin(elapsed * 0.8 + i) * 0.35 * delta
      if (y < 0 || underRoof(a[o], a[o + 2], y)) { y = 12 + Math.random() * 3; a[o] = rand(R); a[o + 2] = rand(R) }
      a[o + 1] = y
    }
    attr.needsUpdate = true
  }
})
</script>

<template>
  <TresGroup>
    <TresLineSegments ref="rainRef" :visible="store.weather === 'rain'" :frustum-culled="false">
      <TresBufferGeometry :position="[rainInit, 3]" />
      <TresLineBasicMaterial color="#cfe6ff" transparent :opacity="0.55" />
    </TresLineSegments>
    <TresPoints ref="snowRef" :visible="store.weather === 'snow'" :frustum-culled="false">
      <TresBufferGeometry :position="[snowInit, 3]" />
      <TresPointsMaterial color="#ffffff" :size="0.12" transparent :opacity="0.9" :depth-write="false" />
    </TresPoints>
  </TresGroup>
</template>
