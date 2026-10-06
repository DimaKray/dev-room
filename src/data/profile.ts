import { L } from '@/i18n'

export const ABOUT = L(
  'Я Дмитро, web-розробник із Києва. Понад три роки верстаю лендінги й інтерактивні додатки до підручників, ' +
  'а зараз опановую React, TypeScript і Node.js на власних проєктах. Люблю, коли інтерфейс не просто працює, а ще й радує.',
  "I'm Dmytro, a web developer from Kyiv. For over three years I've been building landing pages and interactive companions to textbooks, " +
  "and now I'm mastering React, TypeScript and Node.js on my own projects. I like interfaces that don't just work but also delight.",
)

export const FACTS = [L('Київ', 'Kyiv'), L('Магістратура: комп\u2019ютерні науки', "Master's: computer science"), L('Технічна англійська', 'Technical English')]

export const TIMELINE = [
  { years: L('2022 — зараз', '2022 — now'), title: L('Фріланс web-розробник', 'Freelance web developer'),
    text: L('Лендінги на HTML, CSS, JavaScript, Bootstrap, сайти на Joomla.', 'Landing pages in HTML, CSS, JavaScript, Bootstrap; sites on Joomla.') },
  { years: L('2023 — 2024'), title: L('HTML-кодер, «ОРІОН»', 'HTML coder, "ORION"'),
    text: L('Електронні додатки до підручників у Pubcoder.', 'Interactive companions to textbooks in Pubcoder.') },
  { years: L('2024 — 2025'), title: L('Заступник начальника відділу дизайну', 'Deputy head of the design department'),
    text: L('Графіка, додатки, навчання й координація нових працівників.', 'Graphics, interactive apps, training and coordinating new staff.') },
  { years: L('2025 — зараз', '2025 — now'), title: L('Фріланс SEO-спеціаліст', 'Freelance SEO specialist'),
    text: L('Семантичне ядро, технічні завдання, технічний аудит.', 'Semantic core, briefs for copywriters, technical audits.') },
]

export const CONTACTS = {
  email: 'dima.kray313@gmail.com',
  github: { label: 'github.com/DimaKray', url: 'https://github.com/DimaKray' },
  telegram: { label: 't.me/d_krainov_web', url: 'https://t.me/d_krainov_web' },
  // за потреби додай англійське резюме й вкажи його в en
  cv: { uk: '/cv_web_dev_Krainov.pdf', en: '/cv_web_dev_Krainov.pdf' },
}

export const NAME = L('Дмитро Крайнов', 'Dmytro Krainov')
