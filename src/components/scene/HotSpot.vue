<script setup lang="ts">
import { useFocusStore } from '@/stores/focus'
import type { SpotId } from '@/data/spots'

// Невидима коробка-«кнопка» навколо об'єкта. Поки ми зовні, вона не реагує.
defineProps<{ id: SpotId; position: [number, number, number]; size: [number, number, number] }>()
const store = useFocusStore()

function click(id: SpotId) { if (store.inside) store.go(id) }
function enter(id: SpotId) { if (!store.inside) return; store.hovered = id; document.body.style.cursor = 'pointer' }
function leave() { store.hovered = null; document.body.style.cursor = '' }
</script>

<template>
  <TresMesh :position="position" @click="click(id)" @pointer-enter="enter(id)" @pointer-leave="leave">
    <TresBoxGeometry :args="size" />
    <TresMeshBasicMaterial transparent :opacity="0" :depth-write="false" />
  </TresMesh>
</template>
