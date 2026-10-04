<script setup lang="ts">
import { computed, ref } from 'vue'
import { SKILL_GROUPS } from '@/data/skills'

const active = ref(SKILL_GROUPS[0].id)
const group = computed(() => SKILL_GROUPS.find((g) => g.id === active.value)!)
const total = SKILL_GROUPS.reduce((n, g) => n + g.skills.length, 0)
</script>

<template>
  <div>
    <div class="tabs" role="tablist">
      <button v-for="g in SKILL_GROUPS" :key="g.id" class="tab" :class="{ on: g.id === active }" role="tab" :aria-selected="g.id === active" @click="active = g.id">
        {{ g.title }}<small>{{ g.skills.length }}</small>
      </button>
    </div>
    <!-- key змушує список програвати появу тегів щоразу, коли міняєш вкладку -->
    <ul :key="active" class="tags">
      <li v-for="(s, i) in group.skills" :key="s.name" class="tag" :style="{ '--i': i }" :title="s.used ? 'Де використано: ' + s.used : undefined">{{ s.name }}</li>
    </ul>
    <p class="hint">Усього {{ total }} навичок. Наведи на тег, щоб побачити, де це застосовано.</p>
  </div>
</template>

<style scoped>
.tabs { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 20px; }
.tab { padding: 7px 12px; border-radius: 999px; font-size: 13px; background: rgba(255,255,255,.07); border: 1px solid var(--line); transition: background .25s, color .25s, transform .25s; }
.tab small { margin-left: 6px; opacity: .55; }
.tab:hover { background: rgba(255,255,255,.14); transform: translateY(-2px); }
.tab.on { color: var(--night); border-color: transparent; background: linear-gradient(120deg, var(--pink), var(--cyan)); }
.tags { list-style: none; padding: 0; margin-top: 18px; display: flex; flex-wrap: wrap; gap: 8px; min-height: 120px; align-content: flex-start; }
.tag { padding: 8px 14px; border-radius: 12px; font-size: 14px; background: rgba(98,240,255,.12); color: var(--cyan); border: 1px solid rgba(98,240,255,.25); cursor: default;
  animation: tag-in .5s cubic-bezier(.2,1.4,.4,1) both; animation-delay: calc(var(--i) * .05s); transition: transform .25s, background .25s; }
.tag:hover { transform: translateY(-3px) rotate(-2deg); background: rgba(98,240,255,.24); }
.hint { margin-top: 16px; font-size: 12px; opacity: .55; }
@keyframes tag-in { from { opacity: 0; transform: translateY(14px) scale(.7); } }
</style>
