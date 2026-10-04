<script setup lang="ts">
import { ref } from 'vue'
import { useFocusStore } from '@/stores/focus'
import { blip } from '@/lib/sound'
import { CONTACTS } from '@/data/profile'

const store = useFocusStore()
const copied = ref(false)

async function copy() {
  try { await navigator.clipboard.writeText(CONTACTS.email) } catch { /* буфер недоступний */ }
  copied.value = true
  if (store.sound) blip()
  setTimeout(() => (copied.value = false), 1800)
}
</script>

<template>
  <ul class="links">
    <li style="--i: 0">
      <button class="row" @click="copy">
        <span class="lab">Email</span><span class="val">{{ CONTACTS.email }}</span>
        <span class="act" :class="{ ok: copied }">{{ copied ? 'Скопійовано ✓' : 'Копіювати' }}</span>
      </button>
    </li>
    <li style="--i: 1">
      <a class="row" :href="CONTACTS.github.url" target="_blank" rel="noopener">
        <span class="lab">GitHub</span><span class="val">{{ CONTACTS.github.label }}</span><span class="act">Відкрити ↗</span>
      </a>
    </li>
    <li style="--i: 2">
      <a class="row" :href="CONTACTS.telegram.url" target="_blank" rel="noopener">
        <span class="lab">Telegram</span><span class="val">{{ CONTACTS.telegram.label }}</span><span class="act">Відкрити ↗</span>
      </a>
    </li>
    <li style="--i: 3">
      <a class="row cv" :href="CONTACTS.cv" download>
        <span class="lab">Резюме</span><span class="val">PDF, 2 сторінки</span><span class="act">Завантажити ↓</span>
      </a>
    </li>
  </ul>
</template>

<style scoped>
.links { list-style: none; padding: 0; margin-top: 22px; display: grid; gap: 10px; }
.links li { animation: rise .6s cubic-bezier(.2,.8,.2,1) both; animation-delay: calc(var(--i) * .09s + .15s); }
.row { width: 100%; display: grid; grid-template-columns: 74px 1fr auto; align-items: center; gap: 10px; text-align: left; text-decoration: none; color: inherit;
  padding: 14px 16px; border-radius: 16px; background: rgba(255,255,255,.06); border: 1px solid var(--line); transition: transform .3s, border-color .3s, background .3s; }
.row:hover { transform: translateX(-6px); border-color: var(--pink); background: rgba(255,255,255,.1); }
.lab { font-size: 12px; opacity: .6; }
.val { font-size: 14px; overflow-wrap: anywhere; }
.act { font-size: 12px; padding: 4px 10px; border-radius: 999px; background: rgba(255,111,181,.18); color: var(--pink); white-space: nowrap; transition: background .3s, color .3s; }
.act.ok { background: rgba(98,240,255,.2); color: var(--cyan); }
.cv .act { background: linear-gradient(120deg, var(--pink), var(--cyan)); color: var(--night); font-weight: 600; }
@keyframes rise { from { opacity: 0; transform: translateY(16px); } }
</style>
