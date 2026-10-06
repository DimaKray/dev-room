import { ref, watch } from 'vue'

// Легкий власний i18n: без залежностей. Тексти лежать поруч з перекладом: { uk, en }.
export type Lang = 'uk' | 'en'
export type L = { uk: string; en: string }
export const L = (uk: string, en = uk): L => ({ uk, en })

function initial(): Lang {
  try {
    const s = localStorage.getItem('lang')
    if (s === 'uk' || s === 'en') return s
  } catch { /* storage недоступний */ }
  return navigator.language.toLowerCase().startsWith('uk') ? 'uk' : 'en'
}
export const lang = ref<Lang>(initial())
export const toggleLang = () => { lang.value = lang.value === 'uk' ? 'en' : 'uk' }
export const tr = (v: string | L): string => (typeof v === 'string' ? v : v[lang.value])

const UI = {
  uk: {
    title: 'Кімната розробника', role: 'web-розробник', enter: 'Увійти в будинок', exit: '← Вийти',
    hintEnter: 'Клікни, щоб увійти', hintOpen: 'Відкрити: ', hintLamp: 'Клікни, щоб увімкнути чи вимкнути лампу',
    close: 'Закрити', soundOff: 'Вимкнути звук', soundOn: 'Увімкнути звук', toDay: 'Увімкнути день', toNight: 'Увімкнути ніч',
    weather: 'Погода', weatherClear: 'ясно', weatherRain: 'дощ', weatherSnow: 'сніг', langAria: 'Змінити мову',
    usedIn: 'Де використано: ', skillsTotal: 'Усього {n} навичок.', skillsHint: 'Наведи на тег, щоб побачити, де це застосовано.',
    pet: 'Погладити Бага', purr: 'мурр', petMilestone: 'Баг у захваті!',
    copy: 'Копіювати', copied: 'Скопійовано ✓', open: 'Відкрити ↗', download: 'Завантажити ↓', resume: 'Резюме', resumeMeta: 'PDF, 2 сторінки',
    konami: 'Konami-код активовано!',
    simpleMode: 'Проста версія', room3d: 'Увійти в 3D-кімнату', secAbout: 'Про мене', secProjects: 'Проєкти', secSkills: 'Навички', secExp: 'Досвід', secContact: 'Контакти', builtWith: 'Зроблено на Vue 3, TresJS і Three.js. Усі текстури й звуки згенеровані кодом.', navAria: 'Розділи сторінки',
    metaTitle: 'Дмитро Крайнов: web-розробник | Кімната розробника',
    metaDesc: 'Інтерактивне 3D-портфоліо Дмитра Крайнова: web-розробник, верстка, React, Vue, Node.js. Зайди в хатинку в лісі та подивись проєкти.',
  },
  en: {
    title: "Developer's Room", role: 'web developer', enter: 'Enter the house', exit: '← Go outside',
    hintEnter: 'Click to enter', hintOpen: 'Open: ', hintLamp: 'Click to toggle the lamp',
    close: 'Close', soundOff: 'Mute sound', soundOn: 'Unmute sound', toDay: 'Switch to day', toNight: 'Switch to night',
    weather: 'Weather', weatherClear: 'clear', weatherRain: 'rain', weatherSnow: 'snow', langAria: 'Change language',
    usedIn: 'Used in: ', skillsTotal: '{n} skills in total.', skillsHint: 'Hover a tag to see where it was used.',
    pet: 'Pet Bug', purr: 'purr', petMilestone: 'Bug is delighted!',
    copy: 'Copy', copied: 'Copied ✓', open: 'Open ↗', download: 'Download ↓', resume: 'Resume', resumeMeta: 'PDF, 2 pages (Ukrainian)',
    konami: 'Konami code unlocked!',
    simpleMode: 'Simple version', room3d: 'Enter the 3D room', secAbout: 'About', secProjects: 'Projects', secSkills: 'Skills', secExp: 'Experience', secContact: 'Contact', builtWith: 'Built with Vue 3, TresJS and Three.js. All textures and sounds are generated in code.', navAria: 'Page sections',
    metaTitle: 'Dmytro Krainov: web developer | Developer\u2019s Room',
    metaDesc: 'Interactive 3D portfolio of Dmytro Krainov, web developer: HTML/CSS, React, Vue, Node.js. Step into a cabin in the forest and see the projects.',
  },
}
export type UiKey = keyof typeof UI.uk
export const t = (k: UiKey): string => UI[lang.value][k]

export const MOON: L[] = [L('Тссс, я сплю', "Shh, I'm sleeping"), L('Гарна ніч для коду', 'Great night for coding'), L('Це не сир, до речі', "It's not cheese, by the way")]
export const SUN: L[] = [L('Сонце підморгнуло', 'The sun winked'), L('Не забудь про SPF', "Don't forget your sunscreen"), L('Ще один гарний день для комітів', 'Another good day for commits')]

function apply() {
  try { localStorage.setItem('lang', lang.value) } catch { /* ігноруємо */ }
  document.documentElement.lang = lang.value
  document.title = t('metaTitle')
  document.querySelector('meta[name="description"]')?.setAttribute('content', t('metaDesc'))
}
watch(lang, apply, { immediate: true })
