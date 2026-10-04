<script setup lang="ts">
import { computed } from 'vue'
import { BackSide } from 'three'
import { gradient, INK } from './toon'

type V3 = [number, number, number]

// Один предмет = мультяшний матеріал + чорний контур.
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
}>(), {
  position: () => [0, 0, 0],
  rotation: () => [0, 0, 0],
  scale: () => [1, 1, 1],
  ink: 0.02,
  emissive: '#000000',
  emissiveIntensity: 1,
  receive: true,
})

const hull = computed(() => {
  const a = props.args, t = props.ink
  if (props.kind === 'box') return [a[0] + 2 * t, a[1] + 2 * t, a[2] + 2 * t]
  if (props.kind === 'sphere') return [a[0] + t, a[1], a[2]]
  if (props.kind === 'cyl') return [a[0] + t, a[1] + t, a[2] + 2 * t, a[3]]
  return [a[0] + t, a[1] + 2 * t, a[2]] // cone
})
</script>

<template>
  <TresMesh :position="position" :rotation="rotation" :scale="scale" :cast-shadow="!noShadow" :receive-shadow="receive">
    <TresBoxGeometry v-if="kind === 'box'" :args="args" />
    <TresSphereGeometry v-else-if="kind === 'sphere'" :args="args" />
    <TresCylinderGeometry v-else-if="kind === 'cyl'" :args="args" />
    <TresConeGeometry v-else :args="args" />
    <TresMeshToonMaterial :color="color" :gradient-map="gradient" :emissive="emissive" :emissive-intensity="emissiveIntensity" />

    <TresMesh v-if="ink > 0">
      <TresBoxGeometry v-if="kind === 'box'" :args="hull" />
      <TresSphereGeometry v-else-if="kind === 'sphere'" :args="hull" />
      <TresCylinderGeometry v-else-if="kind === 'cyl'" :args="hull" />
      <TresConeGeometry v-else :args="hull" />
      <TresMeshBasicMaterial :color="INK" :side="BackSide" />
    </TresMesh>
  </TresMesh>
</template>
