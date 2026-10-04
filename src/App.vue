<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { useFocusStore } from '@/stores/focus'
import Experience from '@/components/scene/Experience.vue'
import Loader from '@/components/ui/Loader.vue'
import HudNav from '@/components/ui/HudNav.vue'
import InfoPanel from '@/components/ui/InfoPanel.vue'
import Sky from '@/components/ui/Sky.vue'

const store = useFocusStore()
const onKey = (e: KeyboardEvent) => e.key === 'Escape' && store.reset()
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <Sky />
  <Experience />
  <HudNav />
  <InfoPanel />
  <Loader />
</template>
