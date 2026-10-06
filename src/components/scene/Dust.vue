<script setup lang="ts">
import { ref } from 'vue'
import { useLoop } from '@tresjs/core'
import { perf } from '@/lib/perf'
import type { Points } from 'three'

// Пил у повітрі: 260 точок, що повільно кружляють і дихають.
const N = perf.dust
const positions = new Float32Array(N * 3)
for (let i = 0; i < N; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 7
  positions[i * 3 + 1] = Math.random() * 3.6
  positions[i * 3 + 2] = (Math.random() - 0.5) * 6
}
const points = ref<Points>()
const { onBeforeRender } = useLoop()
onBeforeRender(({ elapsed }) => {
  if (!points.value) return
  points.value.rotation.y = elapsed * 0.03
  points.value.position.y = Math.sin(elapsed * 0.5) * 0.12
})
</script>

<template>
  <TresPoints ref="points">
    <TresBufferGeometry :position="[positions, 3]" />
    <TresPointsMaterial color="#ffe3b3" :size="0.022" transparent :opacity="0.65" :depth-write="false" />
  </TresPoints>
</template>
