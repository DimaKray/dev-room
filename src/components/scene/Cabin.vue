<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useLoop } from '@tresjs/core'
import gsap from 'gsap'
import type { Mesh } from 'three'
import { useFocusStore } from '@/stores/focus'
import Part from './Part.vue'

// Зовнішня «оболонка» хатинки: передня й права стіни та дах.
// Коли заходимо, дах злітає вгору, а стіни занурюються в землю.
const store = useFocusStore()
const a = reactive({ roof: 0, walls: 0, door: 0 })

watch(() => store.inside, (inside) => {
  gsap.killTweensOf(a)
  if (inside) {
    // спершу двері відчиняються, потім злітає дах і опускаються стіни
    gsap.to(a, { door: 1, duration: 0.5, ease: 'power2.out' })
    gsap.to(a, { roof: 1, duration: 1.5, delay: 0.5, ease: 'power3.inOut' })
    gsap.to(a, { walls: 1, duration: 1.3, delay: 0.9, ease: 'power2.inOut' })
  } else {
    gsap.to(a, { walls: 0, duration: 1.2, ease: 'power2.inOut' })
    gsap.to(a, { roof: 0, duration: 1.4, delay: 0.9, ease: 'power3.inOut' })
    gsap.to(a, { door: 0, duration: 0.5, delay: 2.1, ease: 'power2.in' })
  }
})

// дим із димаря
const puffs = ref<Mesh[]>([])
const { onBeforeRender } = useLoop()
onBeforeRender(({ elapsed }) => {
  puffs.value.forEach((m, i) => {
    const p = (elapsed * 0.22 + i / 4) % 1
    m.position.set(2 + p * 0.8, 2 + p * 2.2, -1 - p * 0.3)
    m.scale.setScalar(0.12 + p * 0.4)
    ;(m.material as any).opacity = (1 - p) * 0.75
  })
})

function onDoor(over: boolean) {
  if (store.inside) return
  store.hovered = over ? 'outside' : null
  document.body.style.cursor = over ? 'pointer' : ''
}

const flowerColors = ['#ff5fa8', '#ffc83d', '#ffffff', '#ff5fa8']
</script>

<template>
  <TresGroup>
    <!-- фундамент і ґанок: підлога кімнати більше не «висить у повітрі» -->
    <Part kind="box" :args="[7.3, 0.2, 6.3]" color="#8d8aa8" map="stone" :tile="1.2" :position="[0, -0.11, 0]" :ink="0.025" no-shadow :receive="false" />
    <Part kind="box" :args="[1.9, 0.14, 0.8]" color="#a9a4c4" map="stone" :tile="1.2" :position="[0, 0.04, 3.5]" :ink="0.02" no-shadow />

    <!-- передня стіна з дверима, вікнами й квітами -->
    <TresGroup :position="[0, 2 - a.walls * 4.4, 3]">
      <Part kind="box" :args="[7, 4, 0.1]" color="#d49a66" map="logs" :tile="1" :ink="0.03" no-shadow />
      <TresGroup :position="[-0.55, -0.95, 0.08]" :rotation="[0, -a.door * 1.6, 0]">
        <Part kind="box" :args="[1.1, 2.1, 0.08]" color="#8a4f2b" map="wood" :tile="0.8" spot="outside" :position="[0.55, 0, 0]" :ink="0.02" no-shadow />
        <Part kind="sphere" :args="[0.05, 10, 10]" color="#ffd166" :position="[0.95, 0, 0.08]" :ink="0.008" no-shadow />
      </TresGroup>
      <TresGroup v-for="x in [-2.2, 2.2]" :key="x" :position="[x, 0, 0]">
        <Part kind="box" :args="[1.1, 1.1, 0.05]" color="#ffd88a" emissive="#ffb347" :emissive-intensity="0.8" :position="[0, 0.3, 0.07]" :ink="0.025" no-shadow />
        <Part kind="box" :args="[1.3, 0.2, 0.28]" map="wood" :tile="0.6" color="#8a4f2b" :position="[0, -0.42, 0.2]" :ink="0.015" no-shadow />
        <Part v-for="(c, j) in flowerColors" :key="j" kind="sphere" :args="[0.09, 8, 8]" :color="c" :position="[-0.45 + j * 0.3, -0.27, 0.22]" :ink="0.01" no-shadow />
      </TresGroup>
      <TresMesh :position="[0, -0.95, 0.15]" @click="store.enter()" @pointer-enter="onDoor(true)" @pointer-leave="onDoor(false)">
        <TresBoxGeometry :args="[1.4, 2.3, 0.5]" />
        <TresMeshBasicMaterial transparent :opacity="0" :depth-write="false" />
      </TresMesh>
    </TresGroup>

    <!-- права стіна -->
    <TresGroup :position="[3.5, 2 - a.walls * 4.4, 0]" :rotation="[0, Math.PI / 2, 0]">
      <Part kind="box" :args="[6, 4, 0.1]" color="#c98a5a" map="logs" :tile="1" :ink="0.03" no-shadow />
      <Part kind="box" :args="[1.3, 1.1, 0.05]" color="#ffd88a" emissive="#ffb347" :emissive-intensity="0.8" :position="[0, 0.3, 0.07]" :ink="0.025" no-shadow />
    </TresGroup>

    <!-- двосхилий дах: трикутна призма (замість піраміди з артефактами) -->
    <TresGroup :position="[0, 4.8 + a.roof * 16, 0]">
      <Part kind="cyl" :args="[3.9, 3.9, 7.4, 3]" color="#d49a66" :rotation="[-Math.PI / 2, 0, Math.PI / 2]" :scale="[1, 1, 0.4]" :ink="0" no-shadow />
      <Part kind="box" :args="[7.6, 0.2, 4.56]" color="#e05a4a" map="shingles" :tile="1.2" :position="[0, 0.27, 1.82]" :rotation="[0.606, 0, 0]" :ink="0.03" no-shadow />
      <Part kind="box" :args="[7.6, 0.2, 4.56]" color="#e05a4a" map="shingles" :tile="1.2" :position="[0, 0.27, -1.82]" :rotation="[-0.606, 0, 0]" :ink="0.03" no-shadow />
      <Part kind="box" :args="[7.7, 0.2, 0.36]" color="#b8483b" map="wood" :tile="1" :position="[0, 1.6, 0]" :ink="0.03" no-shadow />
      <Part kind="box" :args="[0.6, 1.6, 0.6]" map="bricks" :tile="0.9" color="#9a7a68" :position="[2, 1.1, -1]" :ink="0.03" no-shadow />
      <TresMesh v-for="i in 4" :key="i" ref="puffs">
        <TresSphereGeometry :args="[1, 12, 12]" />
        <TresMeshBasicMaterial color="#ffffff" transparent :opacity="0.6" :depth-write="false" />
      </TresMesh>
    </TresGroup>
  </TresGroup>
</template>
