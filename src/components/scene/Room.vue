<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useLoop } from '@tresjs/core'
import {
  AdditiveBlending, CanvasTexture, Color, DoubleSide, Euler, Quaternion, SRGBColorSpace, Vector3,
  type Group, type Mesh,
} from 'three'
import gsap from 'gsap'
import { useFocusStore } from '@/stores/focus'
import { gradient } from './toon'
import { pointer } from '@/lib/pointer'
import { screenTex, updateScreen } from './screen'
import { floorWood } from './textures'
import HotSpot from './HotSpot.vue'
import Part from './Part.vue'

const props = defineProps<{ night: number; lamp: number }>()
const store = useFocusStore()

const catRoot = ref<Group>()
const catHead = ref<Group>()
const eyes = ref<Group>()
let blinkAt = 2, blinkUntil = 0
const catBody = ref<Group>()
const tail = ref<Group>()
const plant = ref<Group>()
const handM = ref<Group>()
const handH = ref<Group>()
const screen = ref<Mesh>()
const neon = ref<Mesh>()

const books = [['#ff5fa8', 0.5], ['#3fe0f0', 0.7], ['#ffc83d', 0.45], ['#8a63ff', 0.6], ['#ff6b5e', 0.52]] as const
const deskLegs = [[-1.5, -2.7], [1.5, -2.7], [-1.5, -1.7], [1.5, -1.7]]
const leaves = [[0, 0.75, 0, 0.3], [0.17, 0.52, 0.1, 0.22], [-0.17, 0.58, -0.08, 0.24]]
const posters = [['#ff5fa8', -2.4, 2.45], ['#3fe0f0', -1.55, 2.3]] as const
// гірлянда на лівій стіні
const bulbs = Array.from({ length: 11 }, (_, i) => ({
  z: -2.7 + i * 0.54, y: 3.6 - 0.35 * Math.sin((Math.PI * i) / 10), c: ['#ff5fa8', '#ffc83d', '#3fe0f0', '#8a63ff'][i % 4],
}))

// колір «неба» у вікні: день → ніч
const windowColor = computed(() => '#' + new Color('#9fdcff').lerp(new Color('#1b2250'), props.night).getHexString())

// промінь із вікна: сонячний вдень, місячний вночі
const from = new Vector3(-3.35, 2.1, -0.6)
const to = new Vector3(0.4, 0.02, 0.4)
const dir = to.clone().sub(from)
const beam = {
  len: dir.length(),
  mid: from.clone().add(to).multiplyScalar(0.5).toArray() as [number, number, number],
  rot: (() => {
    const e = new Euler().setFromQuaternion(new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), dir.clone().negate().normalize()))
    return [e.x, e.y, e.z] as [number, number, number]
  })(),
}
const beamColor = computed(() => '#' + new Color('#ffe7a8').lerp(new Color('#9bbcff'), props.night).getHexString())

// м'яке радіальне сяйво (для неону)
const glowTex = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 128
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, 'rgba(255,255,255,1)'); grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad; g.fillRect(0, 0, 128, 128)
  return new CanvasTexture(c)
})()

// паркет: дошки з волокнами, сучками й цвяхами
const floorTex = floorWood()

// кіт підстрибує й крутиться, коли його гладять
watch(() => store.pets, () => {
  const g = catRoot.value
  if (!g) return
  gsap.timeline()
    .to(g.position, { y: 0.8, duration: 0.22, ease: 'power2.out' })
    .to(g.position, { y: 0.28, duration: 0.5, ease: 'bounce.out' })
  gsap.fromTo(g.rotation, { y: -0.6 }, { y: -0.6 + Math.PI * 2, duration: 0.9, ease: 'power2.inOut' })
})

const { onBeforeRender } = useLoop()
onBeforeRender(({ elapsed }) => {
  updateScreen(elapsed) // на екрані друкується код
  // кіт: дихає, стежить за курсором, кліпає, а якщо курсор довго стоїть, засинає
  const asleep = performance.now() - pointer.last > 9000
  if (catBody.value) catBody.value.scale.y = 1 + Math.sin(elapsed * (asleep ? 1.1 : 2)) * 0.04
  if (catHead.value) {
    const h = catHead.value
    h.rotation.y += ((asleep ? 0.25 : pointer.x * 0.8) - h.rotation.y) * 0.06
    h.rotation.z += ((asleep ? -0.55 : -pointer.y * 0.3) - h.rotation.z) * 0.06
  }
  if (eyes.value) {
    if (elapsed > blinkAt) { blinkUntil = elapsed + 0.14; blinkAt = elapsed + 2.5 + Math.random() * 3 }
    const closed = asleep || elapsed < blinkUntil
    eyes.value.scale.y += ((closed ? 0.08 : 1) - eyes.value.scale.y) * 0.4
  }
  if (tail.value) tail.value.rotation.z = 0.6 + Math.sin(elapsed * 3) * 0.45
  if (plant.value) plant.value.rotation.z = Math.sin(elapsed * 1.2) * 0.03
  if (handM.value) handM.value.rotation.z = -elapsed * 0.6
  if (handH.value) handH.value.rotation.z = -elapsed * 0.05
  const sm = screen.value?.material as any
  if (sm) sm.emissiveIntensity = (store.hovered === 'monitor' ? 1.7 : 1) + Math.sin(elapsed * 3) * 0.15
  const nm = neon.value?.material as any
  if (nm) nm.emissiveIntensity = 0.9 + Math.sin(elapsed * 9) * 0.06
})
</script>

<template>
  <TresGroup>
    <!-- підлога, стіни, килим -->
    <TresMesh :rotation="[-Math.PI / 2, 0, 0]" receive-shadow>
      <TresPlaneGeometry :args="[7, 6]" />
      <TresMeshToonMaterial :map="floorTex" :gradient-map="gradient" />
    </TresMesh>
    <Part kind="box" :args="[7, 4, 0.1]" color="#9a86f2" map="wallpaper" :tile="1.4" :position="[0, 2, -3]" :ink="0.03" no-shadow />
    <Part kind="box" :args="[6, 4, 0.1]" color="#8672e6" map="wallpaper" :tile="1.4" :position="[-3.5, 2, 0]" :rotation="[0, Math.PI / 2, 0]" :ink="0.03" no-shadow />
    <Part kind="cyl" :args="[1.6, 1.6, 0.02, 48]" map="rug" color="#ff6fb5" :position="[0, 0.012, -0.2]" :ink="0.02" no-shadow />

    <!-- неонова смуга + сяйво від неї по стіні -->
    <TresMesh ref="neon" :position="[0, 3.4, -2.93]">
      <TresBoxGeometry :args="[4, 0.07, 0.05]" />
      <TresMeshStandardMaterial color="#ff6fb5" emissive="#ff6fb5" :emissive-intensity="0.9" />
    </TresMesh>
    <TresMesh v-if="night > 0.02" :position="[0, 3.4, -2.92]">
      <TresPlaneGeometry :args="[6.5, 2.4]" />
      <TresMeshBasicMaterial color="#ff6fb5" :map="glowTex" transparent :opacity="night * 0.55" :depth-write="false" :blending="AdditiveBlending" />
    </TresMesh>

    <!-- вікно + промінь світла -->
    <TresGroup :position="[-3.42, 2.1, -0.6]" :rotation="[0, Math.PI / 2, 0]">
      <Part kind="box" :args="[1.9, 1.6, 0.08]" color="#f4efff" :ink="0.025" no-shadow />
      <TresMesh :position="[0, 0, 0.05]"><TresPlaneGeometry :args="[1.7, 1.4]" /><TresMeshBasicMaterial :color="windowColor" /></TresMesh>
      <Part kind="box" :args="[0.06, 1.4, 0.03]" color="#f4efff" :position="[0, 0, 0.07]" :ink="0.012" no-shadow />
      <Part kind="box" :args="[1.7, 0.06, 0.03]" color="#f4efff" :position="[0, 0, 0.07]" :ink="0.012" no-shadow />
    </TresGroup>
    <TresMesh :position="beam.mid" :rotation="beam.rot">
      <TresCylinderGeometry :args="[0.8, 1.3, beam.len, 24, 1, true]" />
      <TresMeshBasicMaterial :color="beamColor" transparent :opacity="0.09 + night * 0.07" :depth-write="false" :blending="AdditiveBlending" :side="DoubleSide" />
    </TresMesh>

    <!-- гірлянда -->
    <Part v-for="(b, i) in bulbs" :key="'bl' + i" kind="sphere" :args="[0.05, 8, 8]" :color="b.c" :position="[-3.38, b.y, b.z]" :ink="0.008" no-shadow :emissive="b.c" :emissive-intensity="0.3 + night * 1.4" />

    <!-- постери -->
    <TresGroup v-for="(p, i) in posters" :key="i" :position="[p[1], p[2], -2.92]">
      <Part kind="box" :args="[0.7, 0.95, 0.04]" color="#f4efff" :ink="0.02" no-shadow />
      <TresMesh :position="[0, 0, 0.025]"><TresPlaneGeometry :args="[0.58, 0.83]" /><TresMeshToonMaterial :color="p[0]" :gradient-map="gradient" /></TresMesh>
    </TresGroup>

    <!-- годинник на стіні -->
    <TresGroup :position="[0.6, 2.75, -2.9]">
      <Part kind="cyl" :args="[0.34, 0.34, 0.06, 28]" color="#fff7ea" :rotation="[Math.PI / 2, 0, 0]" :ink="0.02" no-shadow />
      <TresGroup ref="handH" :position="[0, 0, 0.05]"><Part kind="box" :args="[0.045, 0.18, 0.012]" color="#2a2340" :position="[0, 0.08, 0]" :ink="0" no-shadow /></TresGroup>
      <TresGroup ref="handM" :position="[0, 0, 0.06]"><Part kind="box" :args="[0.03, 0.26, 0.012]" color="#2a2340" :position="[0, 0.12, 0]" :ink="0" no-shadow /></TresGroup>
    </TresGroup>

    <!-- стіл -->
    <Part kind="box" :args="[3.2, 0.1, 1.3]" map="wood" :tile="1.6" color="#e8a56c" :position="[0, 0.8, -2.2]" />
    <Part v-for="(p, i) in deskLegs" :key="i" kind="box" :args="[0.1, 0.8, 0.1]" color="#b9763f" map="wood" :tile="0.8" :position="[p[0], 0.4, p[1]]" :ink="0.015" />

    <!-- монітор (ніжка тепер не пробиває екран) -->
    <Part kind="box" :args="[0.5, 0.04, 0.3]" spot="monitor" color="#2a2340" :position="[0, 0.87, -2.35]" :ink="0.012" />
    <Part kind="box" :args="[0.12, 0.25, 0.08]" spot="monitor" color="#2a2340" :position="[0, 1.0, -2.43]" :ink="0.012" />
    <Part kind="box" :args="[1.6, 0.95, 0.06]" spot="monitor" color="#2a2340" :position="[0, 1.55, -2.38]" />
    <TresMesh ref="screen" :position="[0, 1.55, -2.34]">
      <TresPlaneGeometry :args="[1.48, 0.83]" />
      <TresMeshStandardMaterial color="#000000" emissive="#ffffff" :emissive-map="screenTex" :emissive-intensity="1" />
    </TresMesh>
    <Part kind="box" :args="[1, 0.04, 0.3]" spot="monitor" color="#3a3158" :position="[0, 0.87, -1.85]" :ink="0.012" />
    <Part kind="cyl" :args="[0.07, 0.06, 0.12, 16]" color="#ffffff" :position="[0.95, 0.91, -1.95]" :ink="0.012" />
    <!-- стос книжок на столі -->
    <Part kind="box" :args="[0.5, 0.08, 0.35]" color="#3fe0f0" :position="[1.15, 0.89, -2.5]" :ink="0.012" />
    <Part kind="box" :args="[0.45, 0.08, 0.32]" color="#ffc83d" :position="[1.15, 0.97, -2.5]" :rotation="[0, 0.2, 0]" :ink="0.012" />
    <Part kind="box" :args="[0.4, 0.08, 0.3]" color="#ff5fa8" :position="[1.15, 1.05, -2.5]" :rotation="[0, -0.15, 0]" :ink="0.012" />
    <HotSpot id="monitor" :position="[0, 1.4, -2.3]" :size="[1.9, 1.4, 0.8]" />

    <!-- крісло -->
    <TresGroup :position="[0.15, 0, -1.15]" :rotation="[0, 0.35, 0]">
      <Part kind="cyl" :args="[0.32, 0.32, 0.05, 16]" color="#2a2340" :position="[0, 0.03, 0]" :ink="0.012" />
      <Part kind="cyl" :args="[0.05, 0.05, 0.5, 10]" color="#2a2340" :position="[0, 0.27, 0]" :ink="0.01" />
      <Part kind="box" :args="[0.7, 0.1, 0.7]" map="fabric" :tile="0.5" color="#ff5fa8" :position="[0, 0.52, 0]" :ink="0.02" />
      <Part kind="box" :args="[0.7, 0.75, 0.08]" map="fabric" :tile="0.5" color="#ff5fa8" :position="[0, 0.95, 0.36]" :ink="0.02" />
    </TresGroup>

    <!-- пуф -->
    <Part kind="sphere" :args="[0.5, 20, 20]" map="quilt" :repeat="[4, 3]" color="#8a63ff" :position="[-2.3, 0.32, 0.9]" :scale="[1.1, 0.7, 1]" :ink="0.03" />

    <!-- лампа з видимим конусом світла -->
    <TresGroup :position="[-1.2, 0.85, -2.3]">
      <Part kind="cyl" :args="[0.15, 0.18, 0.04, 20]" spot="lamp" color="#2a2340" :position="[0, 0.02, 0]" :ink="0.012" />
      <Part kind="cyl" :args="[0.02, 0.02, 0.7, 8]" spot="lamp" color="#2a2340" :position="[0, 0.35, 0]" :ink="0.012" />
      <Part kind="cone" :args="[0.22, 0.28, 20]" spot="lamp" color="#ffd166" :position="[0, 0.75, 0]" :ink="0.015" emissive="#ffb066" :emissive-intensity="lamp * (0.3 + night * 1.2)" />
      <TresMesh v-if="lamp > 0.02" :position="[0, 0.3, 0]">
        <TresCylinderGeometry :args="[0.2, 0.75, 0.62, 24, 1, true]" />
        <TresMeshBasicMaterial color="#ffc470" transparent :opacity="lamp * (0.07 + night * 0.17)" :depth-write="false" :blending="AdditiveBlending" :side="DoubleSide" />
      </TresMesh>
    </TresGroup>

    <HotSpot id="lamp" :position="[-1.2, 1.3, -2.3]" :size="[0.5, 0.9, 0.5]" />

    <!-- полиця з книгами -->
    <TresGroup :position="[2.3, 2.2, -2.78]">
      <Part kind="box" :args="[2, 0.08, 0.4]" spot="shelf" map="wood" :tile="1.6" color="#e8a56c" />
      <Part v-for="(b, i) in books" :key="i" kind="box" :args="[0.13, b[1], 0.3]" spot="shelf" :color="b[0]" :position="[-0.75 + i * 0.17, 0.04 + b[1] / 2, 0]" :ink="0.012" />
    </TresGroup>
    <HotSpot id="shelf" :position="[2.3, 2.5, -2.8]" :size="[2.1, 1.1, 0.6]" />

    <!-- кіт Баг -->
    <TresGroup ref="catRoot" :position="[1.8, 0.28, -0.5]" :rotation="[0, -0.6, 0]">
      <TresGroup ref="catBody">
        <Part kind="sphere" :args="[0.35, 24, 24]" color="#ffae5c" map="fur" :repeat="[3, 1]" spot="cat" :scale="[1.3, 0.8, 0.9]" :ink="0.02" />
      </TresGroup>
      <TresGroup ref="catHead" :position="[0.45, 0.2, 0]">
        <Part kind="sphere" :args="[0.22, 24, 24]" color="#ffae5c" map="fur" :repeat="[2, 1]" spot="cat" :ink="0.02" />
        <Part kind="cone" :args="[0.07, 0.14, 4]" color="#ff8f45" spot="cat" :position="[0.05, 0.22, 0.1]" :rotation="[0, 0, -0.2]" :ink="0.012" />
        <Part kind="cone" :args="[0.07, 0.14, 4]" color="#ff8f45" spot="cat" :position="[0.05, 0.22, -0.1]" :rotation="[0, 0, -0.2]" :ink="0.012" />
        <TresGroup ref="eyes" :position="[0.18, 0.06, 0]">
          <Part kind="sphere" :args="[0.035, 12, 12]" color="#0d0816" :position="[0, 0, 0.09]" :ink="0" />
          <Part kind="sphere" :args="[0.035, 12, 12]" color="#0d0816" :position="[0, 0, -0.09]" :ink="0" />
        </TresGroup>
      </TresGroup>
      <TresGroup ref="tail" :position="[-0.42, 0.05, 0]">
        <Part kind="cyl" :args="[0.05, 0.04, 0.5, 10]" color="#ffae5c" spot="cat" :position="[-0.25, 0.1, 0]" :rotation="[0, 0, Math.PI / 2]" :ink="0.015" />
      </TresGroup>
    </TresGroup>
    <HotSpot id="cat" :position="[1.8, 0.4, -0.5]" :size="[1.1, 0.8, 1]" />

    <!-- рослина -->
    <TresGroup ref="plant" :position="[-2.8, 0, -2.5]">
      <Part kind="cyl" :args="[0.28, 0.2, 0.4, 16]" spot="plant" color="#ff6b5e" :position="[0, 0.2, 0]" />
      <Part v-for="(l, i) in leaves" :key="i" kind="sphere" :args="[l[3], 16, 16]" spot="plant" map="leaves" :repeat="[2, 1]" color="#3fd180" :position="[l[0], l[1], l[2]]" :scale="[1, 1.4, 1]" :ink="0.018" />
    </TresGroup>
    <HotSpot id="plant" :position="[-2.8, 0.7, -2.5]" :size="[0.9, 1.4, 0.9]" />
  </TresGroup>
</template>
