<script setup lang="ts">
import { useFocusStore } from '@/stores/focus'
import { t, tr } from '@/i18n'
import { PROJECTS } from '@/data/projects'
import ShelfPanel from './ShelfPanel.vue'
import CatPanel from './CatPanel.vue'
import PlantPanel from './PlantPanel.vue'

const store = useFocusStore()
</script>

<template>
  <Transition name="panel">
    <aside v-if="store.ready && store.inside && store.current !== 'overview'" class="panel glass">
      <!-- key змушує панель програвати анімацію при зміні об'єкта -->
      <Transition name="swap" mode="out-in">
        <div :key="store.current" class="body">
          <button class="close" :aria-label="t('close')" @click="store.reset()">✕</button>
          <h2>{{ tr(store.spot.title) }}</h2>
          <p class="lead">{{ tr(store.spot.text) }}</p>

          <ul v-if="store.current === 'monitor'" class="cards">
            <li v-for="(p, i) in PROJECTS" :key="i" :style="{ '--i': i }">
              <h3>{{ tr(p.title) }}</h3>
              <p>{{ tr(p.text) }}</p>
              <div class="tags"><span v-for="t in p.stack" :key="t">{{ t }}</span></div>
            </li>
          </ul>
          <ShelfPanel v-else-if="store.current === 'shelf'" />
          <CatPanel v-else-if="store.current === 'cat'" />
          <PlantPanel v-else-if="store.current === 'plant'" />
        </div>
      </Transition>
    </aside>
  </Transition>
</template>

<style scoped>
.panel { position: fixed; z-index: 10; top: 50%; right: 32px; translate: 0 -50%; width: min(440px, calc(100vw - 40px)); max-height: 80vh; overflow: auto; border-radius: 28px; padding: 28px; }
.body { position: relative; }
.close { position: absolute; top: -8px; right: -8px; width: 36px; height: 36px; border-radius: 50%; transition: background .2s, transform .3s; }
.close:hover { background: rgba(255,255,255,.14); transform: rotate(90deg); }
h2 { font-size: 30px; letter-spacing: -0.02em; line-height: 1.1; padding-right: 36px; }
.lead { margin-top: 10px; opacity: .8; line-height: 1.5; }
.cards { list-style: none; padding: 0; margin-top: 22px; display: grid; gap: 12px; }
.cards li { padding: 16px 18px; border-radius: 18px; background: rgba(255,255,255,.06); border: 1px solid var(--line); animation: rise .6s cubic-bezier(.2,.8,.2,1) both; animation-delay: calc(var(--i) * 0.09s + 0.15s); transition: transform .3s, border-color .3s; }
.cards li:hover { transform: translateX(-6px); border-color: var(--cyan); }
h3 { font-size: 18px; }
.cards p { margin: 4px 0 10px; opacity: .75; font-size: 14px; line-height: 1.45; }
.tags { display: flex; flex-wrap: wrap; gap: 6px; }
.tags span { font-size: 12px; padding: 3px 10px; border-radius: 999px; background: rgba(98,240,255,.14); color: var(--cyan); }

@keyframes rise { from { opacity: 0; transform: translateY(18px); } }
.panel-enter-active { transition: opacity .6s, transform .8s cubic-bezier(.2,.8,.2,1); }
.panel-leave-active { transition: opacity .3s, transform .4s ease-in; }
.panel-enter-from, .panel-leave-to { opacity: 0; transform: translateX(60px); }
.swap-enter-active, .swap-leave-active { transition: opacity .25s, transform .25s; }
.swap-enter-from { opacity: 0; transform: translateY(12px); }
.swap-leave-to { opacity: 0; transform: translateY(-12px); }
@media (max-width: 640px) {
  .panel { top: auto; bottom: 90px; right: 50%; translate: 50% 0; max-height: 52vh; }
}
</style>
