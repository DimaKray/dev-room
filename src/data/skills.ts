import { L } from '@/i18n'

// Навички зібрані з резюме та описів усіх проєктів.
// used: де саме це застосовано (підказка при наведенні)
export interface Skill { name: string | L; used?: L }
export interface SkillGroup { id: string; title: L; skills: Skill[] }

const O = L('ОРІОН', 'ORION'), E = L('EduJournal'), P = L('Party-ігри', 'Party games')
const J = L('Шлях розробника', "Developer's Journey"), R = L('Кімната розробника', "Developer's Room")
const LAND = L('лендінги', 'landing pages')
const j = (...p: L[]): L => ({ uk: p.map((x) => x.uk).join(', '), en: p.map((x) => x.en).join(', ') })

export const SKILL_GROUPS: SkillGroup[] = [
  { id: 'markup', title: L('Верстка', 'Markup'), skills: [
    { name: 'HTML', used: j(O, LAND) },
    { name: 'CSS', used: j(O, LAND, J) },
    { name: 'JavaScript', used: j(O, LAND) },
    { name: 'SASS', used: LAND },
    { name: 'Bootstrap', used: LAND },
    { name: L('Адаптивна верстка', 'Responsive layout'), used: L('Шлях розробника: на телефоні кадри йдуть стовпчиком', "Developer's Journey: frames stack in a column on phones") },
    { name: L('CSS-ефекти', 'CSS effects'), used: L('Шлях розробника: halftone, зерно, віньєтка', "Developer's Journey: halftone, grain, vignette") },
    { name: 'Pubcoder', used: L('ОРІОН: електронні додатки до підручників', 'ORION: interactive textbook companions') },
  ] },
  { id: 'front', title: L('React і Vue', 'React & Vue'), skills: [
    { name: 'React', used: j(E, P, J) },
    { name: 'TypeScript', used: j(P, J, R) },
    { name: 'Vite', used: L('усі сучасні проєкти', 'all recent projects') },
    { name: 'React Router', used: j(E, P) },
    { name: 'Recharts', used: L('EduJournal: аналітика успішності', 'EduJournal: performance analytics') },
    { name: 'Axios', used: E },
    { name: 'Vue 3', used: R },
    { name: 'Pinia', used: R },
  ] },
  { id: 'motion', title: L('Анімація і 3D', 'Animation & 3D'), skills: [
    { name: 'GSAP', used: j(J, R) },
    { name: 'ScrollTrigger', used: L('Шлях розробника: єдиний закріплений таймлайн', "Developer's Journey: one pinned timeline") },
    { name: 'Lenis', used: L('Шлях розробника: плавний скрол', "Developer's Journey: smooth scroll") },
    { name: 'Web Audio API', used: j(J, R) },
    { name: 'Three.js', used: R },
    { name: 'TresJS', used: R },
    { name: L('Оптимізація WebP', 'WebP optimization'), used: J },
  ] },
  { id: 'back', title: L('Backend і дані', 'Backend & data'), skills: [
    { name: 'Node.js', used: j(E, P) },
    { name: 'Express', used: j(E, P) },
    { name: 'REST API', used: j(E, P) },
    { name: L('JWT-авторизація', 'JWT auth'), used: E },
    { name: 'RBAC', used: L('EduJournal: адмін, вчитель, учень, батьки', 'EduJournal: admin, teacher, student, parent') },
    { name: 'PostgreSQL', used: E },
    { name: 'SQLite', used: P },
    { name: 'Prisma', used: P },
    { name: 'npm workspaces', used: L('Party-ігри: монорепозиторій', 'Party games: monorepo') },
    { name: L('CRUD і пагінація', 'CRUD & pagination'), used: j(E, P) },
  ] },
  { id: 'tools', title: L('Інструменти', 'Tools'), skills: [
    { name: 'Git' }, { name: 'GitHub' }, { name: 'Figma' },
    { name: 'Joomla', used: L('фріланс: сайти на CMS', 'freelance: CMS sites') },
  ] },
  { id: 'design', title: L('Дизайн і медіа', 'Design & media'), skills: [
    { name: 'Photoshop', used: O }, { name: 'Illustrator', used: O },
    { name: 'Blender' }, { name: 'Premiere Pro' }, { name: 'Adobe Acrobat' },
  ] },
  { id: 'seo', title: L('SEO'), skills: [
    { name: 'Google Search Console' }, { name: 'Ahrefs' }, { name: 'Screaming Frog' },
    { name: L('Семантичне ядро', 'Semantic core'), used: L('збір і кластеризація', 'collection and clustering') },
    { name: L('Мета-теги', 'Meta tags') },
    { name: L('Технічний SEO-аудит', 'Technical SEO audit') },
    { name: L('Структура сайту', 'Site structure'), used: L('SEO-логіка сторінок', 'SEO logic of pages') },
  ] },
  { id: 'practice', title: L('Практики', 'Practices'), skills: [
    { name: L('Доступність', 'Accessibility'), used: L('Шлях розробника, Кімната: prefers-reduced-motion, alt-тексти', "Developer's Journey, Room: prefers-reduced-motion, alt texts") },
    { name: L('SEO-метадані', 'SEO metadata'), used: J },
    { name: L('Українська локалізація', 'Ukrainian localization'), used: j(J, P) },
    { name: L('Контент у JSON', 'JSON-driven content'), used: L('Шлях розробника: story.json', "Developer's Journey: story.json") },
    { name: L('Розмежування прав', 'Access control'), used: E },
    { name: L('Менторство', 'Mentoring'), used: L('ОРІОН: навчання нових працівників', 'ORION: training new staff') },
    { name: L('Технічна англійська', 'Technical English'), used: L('читання документації', 'reading documentation') },
  ] },
]
