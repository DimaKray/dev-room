<script setup lang="ts">
import { reactive, watch } from 'vue'
import { TresCanvas } from '@tresjs/core'
import { Color, NoToneMapping } from 'three'
import gsap from 'gsap'
import { useFocusStore } from '@/stores/focus'
import CameraRig from './CameraRig.vue'
import Room from './Room.vue'
import Cabin from './Cabin.vue'
import Forest from './Forest.vue'
import Dust from './Dust.vue'
import Markers from './Markers.vue'

const store = useFocusStore()

// t: 0 = день, 1 = ніч. Одне число анімується GSAP, усе світло рахується з нього.
const env = reactive({ t: 0 })
watch(() => store.night, (n) => gsap.to(env, { t: n ? 1 : 0, duration: 1.4, ease: 'power2.inOut' }))
const mix = (day: number, night: number) => day + (night - day) * env.t
const hex = (day: string, night: string) => '#' + new Color(day).lerp(new Color(night), env.t).getHexString()
</script>

<template>
  <!-- NoToneMapping: кольори лишаються чистими й яскравими, як у мультфільмі -->
  <TresCanvas shadows alpha :clear-alpha="0" window-size :tone-mapping="NoToneMapping" :enable-provide-bridge="false" @ready="store.canvasReady = true">
    <TresPerspectiveCamera :position="[20, 14, 28]" :fov="38" />
    <CameraRig />

    <!-- сонце / місяць зліва: світло вночі стає синім і м'якшим -->
    <TresAmbientLight :intensity="mix(0.55, 0.3)" :color="hex('#ffffff', '#7f8cff')" />
    <TresHemisphereLight :color="hex('#fff1dd', '#6f86ff')" :ground-color="hex('#9a7bff', '#2a1f5c')" :intensity="mix(0.7, 0.45)" />
    <TresDirectionalLight
      :position="[-4, 6, 3]"
      :color="hex('#ffe2bd', '#a9bcff')"
      :intensity="mix(2.2, 0.9)"
      cast-shadow
      :shadow-mapSize-width="2048"
      :shadow-mapSize-height="2048"
      :shadow-camera-left="-6"
      :shadow-camera-right="6"
      :shadow-camera-top="6"
      :shadow-camera-bottom="-6"
      :shadow-bias="-0.0005"
    />
    <!-- місячне світло з вікна (його ж показує промінь у кімнаті) -->
    <TresSpotLight :position="[-3.3, 2.1, -0.6]" color="#a9c4ff" :intensity="mix(0, 35)" :angle="0.7" :penumbra="1" :distance="12" :decay="1.6" />
    <!-- лампа на столі -->
    <TresPointLight :position="[-1.2, 1.7, -2.1]" color="#ffb066" :intensity="mix(0, 8)" :distance="7" />
    <!-- неон: стоїть далі від стіни, щоб не було засвіченої плями -->
    <TresPointLight :position="[0, 3.0, -1.6]" color="#ff6fb5" :intensity="mix(0, 5)" :distance="9" />

    <Forest :night="env.t" />
    <Cabin />
    <Room :night="env.t" />
    <Dust />
    <Markers />
  </TresCanvas>
</template>
