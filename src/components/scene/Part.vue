<script setup lang="ts">
import { computed, onMounted, shallowRef } from 'vue'
import { BackSide } from 'three'
import { useFocusStore } from '@/stores/focus'
import type { HoverId } from '@/data/spots'
import { gradient, INK } from './toon'
import { getTex, scaleBoxUV } from './textures'

type V3 = [number, number, number]

// Один предмет = мультяшний матеріал + чорний контур + (за потреби) текстура.
// Контур це трохи більша копія, видима лише зі зворотного боку («inverted hull»).
const props = withDefaults(defineProps<{
  kind: 'box' | 'sphere' | 'cyl' | 'cone'
  args: number[]
  color: string
  position?: V3
  rotation?: V3
  scale?: V3
  ink?: number
  emissive?: string
  emissiveIntensity?: number
  noShadow?: boolean   // не кидає тінь
  receive?: boolean    // приймає тіні
  map?: string         // назва текстури з textures.ts
  tile?: number        // для коробок: скільки одиниць світу займає один повтор
  repeat?: number[]    // для сфер, циліндрів і конусів: скільки повторів по колу/висоті
  rotateMap?: boolean  // повернути текстуру на 90° (волокна вздовж циліндра)
  spot?: HoverId        // до якого клікабельного об'єкта належить: світиться при наведенні
}>(), {
  position: () => [0, 0, 0],
  rotation: () => [0, 0, 0],
  scale: () => [1, 1, 1],
  ink: 0.02,
  emissive: '#000000',
  emissiveIntensity: 1,
  receive: true,
  tile: 1.5,
  repeat: () => [1, 1],
})

const store = useFocusStore()
const hot = computed(() => !!props.spot && store.hovered === props.spot)

const hull = computed(() => {
  const a = props.args, t = props.ink
  if (props.kind === 'box') return [a[0] + 2 * t, a[1] + 2 * t, a[2] + 2 * t]
  if (props.kind === 'sphere') return [a[0] + t, a[1], a[2]]
  if (props.kind === 'cyl') return [a[0] + t, a[1] + t, a[2] + 2 * t, a[3]]
  return [a[0] + t, a[1] + 2 * t, a[2]] // cone
})
const hullScale = computed<V3>(() => (hot.value ? [1.06, 1.06, 1.06] : [1, 1, 1]))

const texture = computed(() => (props.map ? getTex(props.map, !!props.rotateMap, props.kind === 'box' ? [1, 1] : props.repeat) : null))

const boxGeo = shallowRef<any>()
onMounted(() => {
  if (props.kind === 'box' && props.map && boxGeo.value) scaleBoxUV(boxGeo.value, props.args, props.tile)
})
</script>

<template>
  <TresMesh :position="position" :rotation="rotation" :scale="scale" :cast-shadow="!noShadow" :receive-shadow="receive">
    <TresBoxGeometry v-if="kind === 'box'" ref="boxGeo" :args="args" />
    <TresSphereGeometry v-else-if="kind === 'sphere'" :args="args" />
    <TresCylinderGeometry v-else-if="kind === 'cyl'" :args="args" />
    <TresConeGeometry v-else :args="args" />
    <TresMeshToonMaterial :color="color" :map="texture" :gradient-map="gradient" :emissive="hot ? '#62f0ff' : emissive" :emissive-intensity="hot ? 0.28 : emissiveIntensity" />

    <!-- при наведенні контур стає неоново-блакитним і трохи товщає -->
    <TresMesh v-if="ink > 0" :scale="hullScale">
      <TresBoxGeometry v-if="kind === 'box'" :args="hull" />
      <TresSphereGeometry v-else-if="kind === 'sphere'" :args="hull" />
      <TresCylinderGeometry v-else-if="kind === 'cyl'" :args="hull" />
      <TresConeGeometry v-else :args="hull" />
      <TresMeshBasicMaterial :color="hot ? '#62f0ff' : INK" :side="BackSide" />
    </TresMesh>
  </TresMesh>
</template>
