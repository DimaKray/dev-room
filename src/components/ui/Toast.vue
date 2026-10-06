<script setup lang="ts">
import { useFocusStore } from '@/stores/focus'
const store = useFocusStore()
</script>

<template>
  <Transition name="toast">
    <div v-if="store.toast" class="toast glass" role="status">{{ store.toast }}</div>
  </Transition>
</template>

<style scoped>
.toast { position: fixed; z-index: 45; top: 92px; left: 50%; translate: -50% 0; padding: 12px 22px; border-radius: 999px; font-size: 15px; font-weight: 500; pointer-events: none; }
.toast-enter-active { transition: opacity .35s, transform .5s cubic-bezier(.2,1.4,.4,1); }
.toast-leave-active { transition: opacity .3s, transform .3s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(-14px) scale(.9); }
</style>
