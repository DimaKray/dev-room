<script setup lang="ts">
import { ref } from 'vue'
import { useLoop } from '@tresjs/core'
import type { Mesh, Points, PointLight } from 'three'
import Part from './Part.vue'

const props = defineProps<{ night: number }>()

// детермінований «рандом»: ліс завжди однаковий
function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rand = rng(7)
const greens = ['#2f9e5b', '#3fb36a', '#27875a', '#55c47c']
const wood = '#8a5530'

// зони, де дерев і кущів не буде: стежка, двір, ставок, будинок, місце камери
const blocked = (x: number, z: number) =>
  (Math.abs(x) < 2.4 && z > 0) ||
  Math.hypot(x - 9.5, z - 13) < 6 ||
  (z > 3.5 && z < 9.5 && Math.abs(x) < 8.5) ||
  Math.hypot(x + 6.8, z - 3.2) < 3.8 ||
  (Math.abs(x) < 5.6 && Math.abs(z) < 4.6)

const trees: { x: number; z: number; s: number; round: boolean; c: string }[] = []
for (let g = 0; trees.length < 38 && g < 800; g++) {
  const a = rand() * Math.PI * 2, r = 7 + rand() * 19
  const x = Math.cos(a) * r, z = Math.sin(a) * r
  if (blocked(x, z)) continue
  const c = rand() < 0.12 ? '#ff9d42' : greens[Math.floor(rand() * 4)]
  trees.push({ x, z, s: 0.9 + rand() * 0.9, round: rand() < 0.3, c })
}

const bits: { x: number; z: number; s: number; bush: boolean; c: string }[] = []
for (let g = 0; bits.length < 16 && g < 400; g++) {
  const a = rand() * Math.PI * 2, r = 5 + rand() * 12
  const x = Math.cos(a) * r, z = Math.sin(a) * r
  if (blocked(x, z)) continue
  const bush = rand() < 0.6
  bits.push({ x, z, s: 0.5 + rand() * 0.6, bush, c: bush ? greens[Math.floor(rand() * 4)] : '#a59fc4' })
}

// пагорби на горизонті
const hills = Array.from({ length: 10 }, (_, i) => {
  const a = (i / 10) * Math.PI * 2 + 0.3, r = 36 + rand() * 8
  return { x: Math.cos(a) * r, z: Math.sin(a) * r, s: 9 + rand() * 6, c: i % 2 ? '#3f9a62' : '#35835a' }
})

// трава
const tufts: { x: number; z: number; s: number; r: number }[] = []
for (let g = 0; tufts.length < 40 && g < 500; g++) {
  const a = rand() * Math.PI * 2, r = 3.5 + rand() * 12
  const x = Math.cos(a) * r, z = Math.sin(a) * r
  if ((Math.abs(x) < 1.5 && z > 0) || (Math.abs(x) < 4.2 && Math.abs(z) < 3.8) || Math.hypot(x + 6.8, z - 3.2) < 3) continue
  tufts.push({ x, z, s: 0.7 + rand() * 0.8, r: rand() * 3 })
}

// квіти вздовж стежки
const flowerCols = ['#ff5fa8', '#ffc83d', '#ffffff', '#8a63ff', '#ff7b5e']
const flowers: { x: number; z: number; c: string }[] = []
for (let i = 0; i < 12; i++) {
  flowers.push({ x: -1.3 - rand() * 0.4, z: 4 + i * 0.7, c: flowerCols[i % 5] })
  flowers.push({ x: 1.3 + rand() * 0.4, z: 4.3 + i * 0.7, c: flowerCols[(i + 2) % 5] })
}

// паркан із прогалиною для стежки
const posts: number[] = []
for (let x = -7; x <= 7.01; x += 1) if (Math.abs(x) > 1.2) posts.push(x)

// вогнище
const stones = Array.from({ length: 8 }, (_, i) => ({ x: -4 + Math.cos((i / 8) * Math.PI * 2) * 0.55, z: 7.5 + Math.sin((i / 8) * Math.PI * 2) * 0.55 }))
const flameDefs = [{ c: '#ff8a2b', r: 0.22, h: 0.55 }, { c: '#ffd23f', r: 0.15, h: 0.42 }, { c: '#fff0a0', r: 0.09, h: 0.3 }]
const flames = ref<Mesh[]>([])
const fireLight = ref<PointLight>()

// світлячки
const N = 70
const pos = new Float32Array(N * 3)
for (let i = 0; i < N; i++) {
  const a = rand() * Math.PI * 2, r = 4 + rand() * 11
  pos[i * 3] = Math.cos(a) * r
  pos[i * 3 + 1] = 0.3 + rand() * 2.8
  pos[i * 3 + 2] = Math.sin(a) * r
}
const flies = ref<Points>()

const { onBeforeRender } = useLoop()
onBeforeRender(({ elapsed }) => {
  if (flies.value) { flies.value.rotation.y = elapsed * 0.04; flies.value.position.y = Math.sin(elapsed * 0.8) * 0.2 }
  flames.value.forEach((m, i) => { m.scale.y = 0.85 + 0.35 * Math.sin(elapsed * 9 + i * 2); m.rotation.y = elapsed * 2 + i })
  if (fireLight.value) fireLight.value.intensity = (2.2 + Math.sin(elapsed * 13) * 0.5 + Math.sin(elapsed * 7.3) * 0.4) * (0.4 + props.night * 1.3)
})
</script>

<template>
  <TresGroup>
    <!-- земля, галявина, стежка -->
    <Part kind="cyl" :args="[60, 60, 0.2, 64]" color="#4fae6b" :position="[0, -0.12, 0]" :ink="0" no-shadow :receive="false" />
    <Part kind="cyl" :args="[11, 11, 0.02, 48]" color="#6cc27e" :position="[0, -0.015, 0]" :ink="0.02" no-shadow :receive="false" />
    <Part kind="box" :args="[1.6, 0.02, 9]" color="#e3bd8c" :position="[0, -0.005, 7.4]" :ink="0.012" no-shadow :receive="false" />

    <!-- пагорби -->
    <Part v-for="(h, i) in hills" :key="'h' + i" kind="sphere" :args="[h.s, 16, 16]" :color="h.c" :position="[h.x, -1.5, h.z]" :scale="[1, 0.45, 1]" :ink="0.08" no-shadow :receive="false" />

    <!-- дерева -->
    <TresGroup v-for="(t, i) in trees" :key="i" :position="[t.x, 0, t.z]" :scale="[t.s, t.s, t.s]" :rotation="[0, i, 0]">
      <Part kind="cyl" :args="[0.18, 0.22, 0.8, 8]" :color="wood" :position="[0, 0.4, 0]" :ink="0.03" no-shadow :receive="false" />
      <template v-if="t.round">
        <Part kind="sphere" :args="[1.1, 14, 14]" :color="t.c" :position="[0, 2.1, 0]" :ink="0.04" no-shadow :receive="false" />
        <Part kind="sphere" :args="[0.7, 12, 12]" :color="t.c" :position="[0.55, 2.9, 0.2]" :ink="0.04" no-shadow :receive="false" />
      </template>
      <template v-else>
        <Part kind="cone" :args="[1.2, 1.8, 8]" :color="t.c" :position="[0, 1.7, 0]" :ink="0.04" no-shadow :receive="false" />
        <Part kind="cone" :args="[0.9, 1.5, 8]" :color="t.c" :position="[0, 2.6, 0]" :ink="0.04" no-shadow :receive="false" />
        <Part kind="cone" :args="[0.6, 1.2, 8]" :color="t.c" :position="[0, 3.4, 0]" :ink="0.04" no-shadow :receive="false" />
      </template>
    </TresGroup>

    <!-- кущі й камені -->
    <Part v-for="(b, i) in bits" :key="'b' + i" kind="sphere" :args="[b.s, 10, 10]" :color="b.c" :position="[b.x, b.s * 0.45, b.z]" :scale="[1, b.bush ? 0.75 : 0.6, 1]" :ink="0.03" no-shadow :receive="false" />

    <!-- трава -->
    <Part v-for="(t, i) in tufts" :key="'t' + i" kind="cone" :args="[0.12, 0.45, 4]" color="#3fb36a" :position="[t.x, 0.2 * t.s, t.z]" :rotation="[0, t.r, 0]" :scale="[t.s, t.s, t.s]" :ink="0.01" no-shadow :receive="false" />

    <!-- квіти -->
    <TresGroup v-for="(f, i) in flowers" :key="'f' + i" :position="[f.x, 0, f.z]">
      <Part kind="cyl" :args="[0.015, 0.015, 0.28, 5]" color="#2f9e5b" :position="[0, 0.14, 0]" :ink="0" no-shadow :receive="false" />
      <Part kind="sphere" :args="[0.1, 8, 8]" :color="f.c" :position="[0, 0.3, 0]" :ink="0.012" no-shadow :receive="false" />
    </TresGroup>

    <!-- паркан -->
    <Part v-for="x in posts" :key="'p' + x" kind="box" :args="[0.12, 0.7, 0.12]" color="#f4e2c0" :position="[x, 0.35, 6.2]" :ink="0.015" no-shadow :receive="false" />
    <Part v-for="s in [-4.5, 4.5]" :key="'r' + s" kind="box" :args="[5, 0.07, 0.05]" color="#e8cfa6" :position="[s, 0.5, 6.2]" :ink="0.012" no-shadow :receive="false" />
    <Part v-for="s in [-4.5, 4.5]" :key="'r2' + s" kind="box" :args="[5, 0.07, 0.05]" color="#e8cfa6" :position="[s, 0.25, 6.2]" :ink="0.012" no-shadow :receive="false" />

    <!-- скринька -->
    <Part kind="box" :args="[0.1, 0.9, 0.1]" color="#8a5530" :position="[1.9, 0.45, 8]" :ink="0.015" no-shadow />
    <Part kind="box" :args="[0.4, 0.28, 0.55]" color="#ff5fa8" :position="[1.9, 1, 8]" :ink="0.02" no-shadow />
    <Part kind="box" :args="[0.04, 0.26, 0.04]" color="#ffc83d" :position="[2.12, 1.15, 7.85]" :ink="0.008" no-shadow />

    <!-- ліхтар біля стежки -->
    <Part kind="cyl" :args="[0.05, 0.06, 2.2, 8]" color="#2a2340" :position="[-1.7, 1.1, 4.8]" :ink="0.015" no-shadow />
    <Part kind="box" :args="[0.3, 0.35, 0.3]" color="#ffe9b0" :position="[-1.7, 2.3, 4.8]" :ink="0.02" no-shadow emissive="#ffcf80" :emissive-intensity="0.5 + night * 1.2" />
    <Part kind="cone" :args="[0.26, 0.2, 4]" color="#2a2340" :position="[-1.7, 2.58, 4.8]" :rotation="[0, Math.PI / 4, 0]" :ink="0.015" no-shadow />
    <TresPointLight :position="[-1.7, 2.3, 4.8]" color="#ffd9a0" :intensity="1 + night * 7" :distance="9" />

    <!-- вогнище -->
    <Part v-for="(s, i) in stones" :key="'s' + i" kind="sphere" :args="[0.13, 8, 8]" color="#a59fc4" :position="[s.x, 0.1, s.z]" :scale="[1, 0.7, 1]" :ink="0.015" no-shadow />
    <Part kind="cyl" :args="[0.07, 0.07, 0.8, 8]" :color="wood" :position="[-4, 0.1, 7.5]" :rotation="[0, 0, Math.PI / 2]" :ink="0.012" no-shadow />
    <Part kind="cyl" :args="[0.07, 0.07, 0.8, 8]" :color="wood" :position="[-4, 0.14, 7.5]" :rotation="[Math.PI / 2, 0, 0]" :ink="0.012" no-shadow />
    <TresMesh v-for="(f, i) in flameDefs" :key="'fl' + i" ref="flames" :position="[-4, 0.2 + f.h / 2, 7.5]">
      <TresConeGeometry :args="[f.r, f.h, 8]" />
      <TresMeshBasicMaterial :color="f.c" />
    </TresMesh>
    <TresPointLight ref="fireLight" :position="[-4, 0.9, 7.5]" color="#ff9a3d" :intensity="2" :distance="8" />

    <!-- дрова біля будинку -->
    <Part v-for="(l, i) in [[0, 0.22], [0.46, 0.22], [0.23, 0.62]]" :key="'l' + i" kind="cyl" :args="[0.22, 0.22, 1.6, 10]" color="#b9763f" :position="[5.2 + l[0], l[1], -1.2]" :rotation="[Math.PI / 2, 0, 0]" :ink="0.02" no-shadow />

    <!-- ставок -->
    <Part kind="cyl" :args="[2, 2, 0.04, 40]" color="#58c6f5" :position="[-6.8, 0.02, 3.2]" :scale="[1.5, 1, 1.1]" :ink="0.03" no-shadow :receive="false" />
    <Part v-for="(p, i) in [[-7.4, 3.0], [-6.2, 3.8], [-7.9, 3.9]]" :key="'lp' + i" kind="cyl" :args="[0.28, 0.28, 0.02, 12]" color="#3fb36a" :position="[p[0], 0.06, p[1]]" :ink="0.012" no-shadow :receive="false" />
    <Part kind="sphere" :args="[0.09, 8, 8]" color="#ff5fa8" :position="[-6.2, 0.14, 3.8]" :ink="0.01" no-shadow :receive="false" />

    <!-- світлячки: вночі яскравіші -->
    <TresPoints ref="flies">
      <TresBufferGeometry :position="[pos, 3]" />
      <TresPointsMaterial color="#fff2a0" :size="0.16" transparent :opacity="0.15 + night * 0.85" :depth-write="false" />
    </TresPoints>
  </TresGroup>
</template>
