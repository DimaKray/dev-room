<script setup lang="ts">
import { useFocusStore } from '@/stores/focus'
import { t, toggleLang, tr } from '@/i18n'
import { ABOUT, CONTACTS, FACTS, NAME, TIMELINE } from '@/data/profile'
import { PROJECTS } from '@/data/projects'
import { SKILL_GROUPS } from '@/data/skills'
import { lang } from '@/i18n'

// Проста версія = звичайна семантична сторінка. Вона завжди є в DOM:
// пошуковики й скрінрідери читають її, а у 3D-режимі вона візуально прихована.
const store = useFocusStore()
const sections = [['about', 'secAbout'], ['projects', 'secProjects'], ['skills', 'secSkills'], ['experience', 'secExp'], ['contact', 'secContact']] as const
</script>

<template>
  <div class="page" :class="{ visible: store.simple, light: !store.night }" :inert="store.simple ? undefined : ''">
    <header class="top">
      <a class="brand" href="#top">{{ tr(NAME) }}</a>
      <nav :aria-label="t('navAria')" class="nav">
        <a v-for="[id, key] in sections" :key="id" :href="'#' + id">{{ t(key) }}</a>
      </nav>
      <div class="actions">
        <button class="chip" @click="toggleLang()">{{ lang === 'uk' ? 'EN' : 'UA' }}</button>
        <button class="chip" :aria-label="store.night ? t('toDay') : t('toNight')" @click="store.toggleNight()">{{ store.night ? '☀' : '☾' }}</button>
        <button class="chip go" @click="store.setSimple(false)">{{ t('room3d') }}</button>
      </div>
    </header>

    <main id="top">
      <section id="about" class="hero" aria-labelledby="h-about">
        <p class="kicker">{{ t('role') }}</p>
        <h1 id="h-about">{{ tr(NAME) }}</h1>
        <p class="lead">{{ tr(ABOUT) }}</p>
        <ul class="facts"><li v-for="(f, i) in FACTS" :key="i">{{ tr(f) }}</li></ul>
        <p class="cta-row">
          <a class="btn" href="#contact">{{ t('secContact') }}</a>
          <a class="btn ghost" :href="CONTACTS.cv[lang]" download>{{ t('resume') }}</a>
        </p>
      </section>

      <section id="projects" aria-labelledby="h-projects">
        <h2 id="h-projects">{{ t('secProjects') }}</h2>
        <div class="grid">
          <article v-for="(p, i) in PROJECTS" :key="i" class="card">
            <h3>{{ tr(p.title) }}</h3>
            <p>{{ tr(p.text) }}</p>
            <ul class="tags"><li v-for="s in p.stack" :key="s">{{ s }}</li></ul>
          </article>
        </div>
      </section>

      <section id="skills" aria-labelledby="h-skills">
        <h2 id="h-skills">{{ t('secSkills') }}</h2>
        <div class="grid">
          <div v-for="g in SKILL_GROUPS" :key="g.id" class="card">
            <h3>{{ tr(g.title) }}</h3>
            <ul class="tags"><li v-for="(s, i) in g.skills" :key="i" :title="s.used ? t('usedIn') + tr(s.used) : undefined">{{ tr(s.name) }}</li></ul>
          </div>
        </div>
      </section>

      <section id="experience" aria-labelledby="h-exp">
        <h2 id="h-exp">{{ t('secExp') }}</h2>
        <ol class="timeline">
          <li v-for="(row, i) in TIMELINE" :key="i">
            <time>{{ tr(row.years) }}</time>
            <h3>{{ tr(row.title) }}</h3>
            <p>{{ tr(row.text) }}</p>
          </li>
        </ol>
      </section>

      <section id="contact" aria-labelledby="h-contact">
        <h2 id="h-contact">{{ t('secContact') }}</h2>
        <ul class="contacts">
          <li><span>Email</span><a :href="'mailto:' + CONTACTS.email">{{ CONTACTS.email }}</a></li>
          <li><span>GitHub</span><a :href="CONTACTS.github.url" rel="noopener" target="_blank">{{ CONTACTS.github.label }}</a></li>
          <li><span>Telegram</span><a :href="CONTACTS.telegram.url" rel="noopener" target="_blank">{{ CONTACTS.telegram.label }}</a></li>
          <li><span>{{ t('resume') }}</span><a :href="CONTACTS.cv[lang]" download>{{ t('resumeMeta') }}</a></li>
        </ul>
      </section>
    </main>

    <footer class="foot">{{ t('builtWith') }}</footer>
  </div>
</template>

<style scoped>
.page { --bg: radial-gradient(120% 80% at 50% 0%, #2b1d5c 0%, #150f2e 60%, #0a0716 100%); --fg: #f4efff; --muted: rgba(244,239,255,.72); --card: rgba(255,255,255,.07); --line: rgba(255,255,255,.14); --accent: #62f0ff; --accent2: #ff6fb5;
  background: var(--bg); color: var(--fg); }
.page.light { --bg: linear-gradient(180deg, #dff0ff 0%, #efe9ff 55%, #fff1e6 100%); --fg: #1d1537; --muted: rgba(29,21,55,.74); --card: rgba(255,255,255,.7); --line: rgba(29,21,55,.14); --accent: #5a46c8; --accent2: #d93f8e; }

/* у 3D-режимі сторінка прихована візуально, але лишається в DOM для пошуковиків і скрінрідерів */
.page:not(.visible) { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; pointer-events: none; left: 0; top: 0; }
.page.visible { position: fixed; inset: 0; z-index: 20; overflow-y: auto; scroll-behavior: smooth; }

.top { position: sticky; top: 0; z-index: 2; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; padding: 14px clamp(16px, 4vw, 40px); backdrop-filter: blur(14px); background: color-mix(in srgb, var(--card) 70%, transparent); border-bottom: 1px solid var(--line); }
.brand { font-weight: 700; font-size: 18px; color: var(--fg); text-decoration: none; margin-right: auto; }
.nav { display: flex; gap: 4px; flex-wrap: wrap; }
.nav a { padding: 8px 12px; border-radius: 999px; color: var(--muted); text-decoration: none; font-size: 14px; transition: background .25s, color .25s; }
.nav a:hover { background: var(--card); color: var(--fg); }
.actions { display: flex; gap: 8px; }
.chip { padding: 8px 14px; border-radius: 999px; border: 1px solid var(--line); background: var(--card); font-size: 14px; font-weight: 600; transition: transform .2s; }
.chip:hover { transform: translateY(-2px); }
.chip.go { background: linear-gradient(120deg, var(--accent2), var(--accent)); color: #120d24; border-color: transparent; }

main { max-width: 920px; margin: 0 auto; padding: 0 clamp(16px, 4vw, 40px) 40px; }
section { padding: 48px 0 8px; scroll-margin-top: 80px; }
.hero { padding-top: 72px; }
.kicker { color: var(--accent); font-weight: 600; }
h1 { font-size: clamp(40px, 8vw, 72px); line-height: 1; letter-spacing: -0.03em; margin: 8px 0 18px; }
h2 { font-size: 30px; letter-spacing: -0.02em; margin-bottom: 20px; }
h3 { font-size: 18px; margin-bottom: 6px; }
.lead { font-size: 19px; line-height: 1.6; color: var(--muted); max-width: 680px; }
.facts { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; margin: 20px 0; }
.facts li, .tags li { font-size: 13px; padding: 5px 12px; border-radius: 999px; background: color-mix(in srgb, var(--accent) 16%, transparent); border: 1px solid var(--line); }
.cta-row { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 8px; }
.btn { padding: 13px 26px; border-radius: 999px; font-weight: 600; text-decoration: none; color: #120d24; background: linear-gradient(120deg, var(--accent2), var(--accent)); transition: transform .2s; }
.btn.ghost { background: transparent; color: var(--fg); border: 1px solid var(--line); }
.btn:hover { transform: translateY(-3px); }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px; }
.card { padding: 20px; border-radius: 20px; background: var(--card); border: 1px solid var(--line); transition: transform .3s, border-color .3s; }
.card:hover { transform: translateY(-4px); border-color: var(--accent); }
.card p { color: var(--muted); line-height: 1.5; margin-bottom: 12px; font-size: 15px; }
.tags { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 6px; }
.timeline { list-style: none; padding: 0 0 0 20px; border-left: 2px solid var(--line); display: grid; gap: 22px; }
.timeline li { position: relative; }
.timeline li::before { content: ''; position: absolute; left: -27px; top: 6px; width: 10px; height: 10px; border-radius: 50%; background: var(--accent); }
.timeline time { font-size: 13px; color: var(--muted); }
.timeline p { color: var(--muted); }
.contacts { list-style: none; padding: 0; display: grid; gap: 10px; }
.contacts li { display: flex; gap: 16px; padding: 14px 18px; border-radius: 16px; background: var(--card); border: 1px solid var(--line); }
.contacts span { width: 90px; color: var(--muted); }
.contacts a { color: var(--accent); font-weight: 500; overflow-wrap: anywhere; }
.foot { text-align: center; padding: 28px 16px 48px; color: var(--muted); font-size: 13px; }
</style>
