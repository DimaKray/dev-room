<script setup lang="ts">
import { useFocusStore } from '@/stores/focus'
import { blip } from '@/lib/sound'
import type { HoverId, SpotId } from '@/data/spots'

// Невидима коробка-«кнопка» навколо об'єкта. Поки ми зовні, вона не реагує.
defineProps<{ id: HoverId; position: [number, number, number]; size: [number, number, number] }>()
const store = useFocusStore()

function click(id: HoverId) {
  if (!store.inside) return
  if (id === 'lamp') { store.toggleLamp(); if (store.sound) blip() } // лампа вмикається, а не відкриває розділ
  else store.go(id as SpotId)
}
function enter(id: HoverId) { if (!store.inside) return; store.hovered = id; document.body.style.cursor = 'pointer' }
function leave() { store.hovered = null; document.body.style.cursor = '' }
</script>

<template>
  <TresMesh :position="position" @click="click(id)" @pointer-enter="enter(id)" @pointer-leave="leave">
    <TresBoxGeometry :args="size" />
    <TresMeshBasicMaterial transparent :opacity="0" :depth-write="false" />
  </TresMesh>
</template>
