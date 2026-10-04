// Навички зібрані з резюме та описів усіх проєктів.
// used: де саме це застосовано (показується підказкою при наведенні)
export interface Skill { name: string; used?: string }
export interface SkillGroup { id: string; title: string; skills: Skill[] }

const O = 'ОРІОН', E = 'EduJournal', P = 'Party-ігри', J = 'Шлях розробника', R = 'Кімната розробника'

export const SKILL_GROUPS: SkillGroup[] = [
  { id: 'markup', title: 'Верстка', skills: [
    { name: 'HTML', used: `${O}, лендінги` },
    { name: 'CSS', used: `${O}, лендінги, ${J}` },
    { name: 'JavaScript', used: `${O}, лендінги` },
    { name: 'SASS', used: 'лендінги' },
    { name: 'Bootstrap', used: 'лендінги' },
    { name: 'Адаптивна верстка', used: `${J}: на телефоні кадри йдуть стовпчиком` },
    { name: 'CSS-ефекти', used: `${J}: halftone, зерно, віньєтка` },
    { name: 'Pubcoder', used: `${O}: електронні додатки до підручників` },
  ] },
  { id: 'front', title: 'React і Vue', skills: [
    { name: 'React', used: `${E}, ${P}, ${J}` },
    { name: 'TypeScript', used: `${P}, ${J}, ${R}` },
    { name: 'Vite', used: 'усі сучасні проєкти' },
    { name: 'React Router', used: `${E}, ${P}` },
    { name: 'Recharts', used: `${E}: аналітика успішності` },
    { name: 'Axios', used: E },
    { name: 'Vue 3', used: R },
    { name: 'Pinia', used: R },
  ] },
  { id: 'motion', title: 'Анімація і 3D', skills: [
    { name: 'GSAP', used: `${J}, ${R}` },
    { name: 'ScrollTrigger', used: `${J}: єдиний закріплений таймлайн` },
    { name: 'Lenis', used: `${J}: плавний скрол` },
    { name: 'Web Audio API', used: `${J}, ${R}` },
    { name: 'Three.js', used: R },
    { name: 'TresJS', used: R },
    { name: 'Оптимізація WebP', used: J },
  ] },
  { id: 'back', title: 'Backend і дані', skills: [
    { name: 'Node.js', used: `${E}, ${P}` },
    { name: 'Express', used: `${E}, ${P}` },
    { name: 'REST API', used: `${E}, ${P}` },
    { name: 'JWT-авторизація', used: E },
    { name: 'RBAC', used: `${E}: адмін, вчитель, учень, батьки` },
    { name: 'PostgreSQL', used: E },
    { name: 'SQLite', used: P },
    { name: 'Prisma', used: P },
    { name: 'npm workspaces', used: `${P}: монорепозиторій` },
    { name: 'CRUD і пагінація', used: `${E}, ${P}` },
  ] },
  { id: 'tools', title: 'Інструменти', skills: [
    { name: 'Git' }, { name: 'GitHub' },
    { name: 'Figma' },
    { name: 'Joomla', used: 'фріланс: сайти на CMS' },
  ] },
  { id: 'design', title: 'Дизайн і медіа', skills: [
    { name: 'Photoshop', used: `${O}` },
    { name: 'Illustrator', used: `${O}` },
    { name: 'Blender' },
    { name: 'Premiere Pro' },
    { name: 'Adobe Acrobat' },
  ] },
  { id: 'seo', title: 'SEO', skills: [
    { name: 'Google Search Console' },
    { name: 'Ahrefs' },
    { name: 'Screaming Frog' },
    { name: 'Семантичне ядро', used: 'збір і кластеризація' },
    { name: 'Мета-теги' },
    { name: 'Технічний SEO-аудит' },
    { name: 'Структура сайту', used: 'SEO-логіка сторінок' },
  ] },
  { id: 'practice', title: 'Практики', skills: [
    { name: 'Доступність', used: `${J}, ${R}: prefers-reduced-motion, alt-тексти` },
    { name: 'SEO-метадані', used: J },
    { name: 'Українська локалізація', used: `${J}, ${P}` },
    { name: 'Контент у JSON', used: `${J}: story.json` },
    { name: 'Розмежування прав', used: E },
    { name: 'Менторство', used: `${O}: навчання нових працівників` },
    { name: 'Технічна англійська', used: 'читання документації' },
  ] },
]
