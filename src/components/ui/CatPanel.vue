<script setup lang="ts">
import { ref } from 'vue'
import { useFocusStore } from '@/stores/focus'
import { purr } from '@/lib/sound'
import { t, tr } from '@/i18n'
import { ABOUT, FACTS, TIMELINE } from '@/data/profile'

const store = useFocusStore()
const hearts = ref<{ id: number; x: number }[]>([])
let n = 0

function pet() {
  store.pet() // кіт у 3D підстрибне
  if (store.sound) purr()
  if (store.pets % 10 === 0) store.say(t('petMilestone'))
  const id = ++n
  hearts.value.push({ id, x: 8 + Math.random() * 84 })
  setTimeout(() => (hearts.value = hearts.value.filter((h) => h.id !== id)), 1400)
}
</script>

<template>
  <div>
    <p class="about">{{ tr(ABOUT) }}</p>
    <ul class="facts"><li v-for="(f, i) in FACTS" :key="i">{{ tr(f) }}</li></ul>

    <div class="pet-row">
      <button class="pet" @click="pet">{{ t('pet') }}</button>
      <span v-if="store.pets" class="count">{{ t('purr') }} × {{ store.pets }}</span>
      <div class="hearts" aria-hidden="true"><i v-for="h in hearts" :key="h.id" :style="{ left: h.x + '%' }">♥</i></div>
    </div>

    <ol class="timeline">
      <li v-for="(row, i) in TIMELINE" :key="i" :style="{ '--i': i }">
        <span class="years">{{ tr(row.years) }}</span>
        <strong>{{ tr(row.title) }}</strong>
        <p>{{ tr(row.text) }}</p>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.about { margin-top: 18px; line-height: 1.55; opacity: .9; }
.facts { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
.facts li { font-size: 12px; padding: 4px 10px; border-radius: 999px; background: rgba(255,255,255,.08); border: 1px solid var(--line); }
.pet-row { position: relative; display: flex; align-items: center; gap: 14px; margin-top: 20px; }
.pet { padding: 11px 20px; border-radius: 999px; font-weight: 600; color: var(--night); background: linear-gradient(120deg, #ffb36b, var(--pink)); transition: transform .2s; }
.pet:hover { transform: scale(1.05); }
.pet:active { transform: scale(.94); }
.count { font-size: 14px; opacity: .75; }
.hearts { position: absolute; inset: 0; pointer-events: none; }
.hearts i { position: absolute; bottom: 30px; font-style: normal; color: var(--pink); font-size: 22px; animation: float 1.4s ease-out forwards; }
@keyframes float { from { opacity: 1; transform: translateY(0) scale(.6); } to { opacity: 0; transform: translateY(-70px) scale(1.3) rotate(12deg); } }
.timeline { list-style: none; padding: 0 0 0 18px; margin-top: 26px; border-left: 2px solid var(--line); display: grid; gap: 16px; }
.timeline li { position: relative; animation: rise .6s cubic-bezier(.2,.8,.2,1) both; animation-delay: calc(var(--i) * .1s + .2s); }
.timeline li::before { content: ''; position: absolute; left: -25px; top: 5px; width: 10px; height: 10px; border-radius: 50%; background: var(--cyan); box-shadow: 0 0 0 4px rgba(98,240,255,.2); }
.years { display: block; font-size: 12px; opacity: .6; }
.timeline strong { font-size: 15px; }
.timeline p { margin-top: 2px; font-size: 13px; opacity: .72; line-height: 1.45; }
@keyframes rise { from { opacity: 0; transform: translateY(14px); } }
</style>
