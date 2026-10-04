export interface Project { title: string; stack: string[]; text: string }

export const PROJECTS: Project[] = [
  { title: 'Шлях розробника', stack: ['React', 'TypeScript', 'Vite', 'GSAP', 'ScrollTrigger', 'Lenis', 'Web Audio'],
    text: 'Портфоліо-комікс: кар\u2019єра як історія героя. Кадри з\u2019являються під час скролу, удари супроводжуються тряскою і звуком.' },
  { title: 'Кімната розробника', stack: ['Vue 3', 'TypeScript', 'TresJS', 'Three.js', 'Pinia', 'GSAP'],
    text: 'Цей сайт: 3D-хатинка в лісі, у яку можна зайти. Мультяшні контури, день і ніч, анімована камера.' },
  { title: 'EduJournal', stack: ['React', 'Vite', 'React Router', 'Recharts', 'Axios', 'Node.js', 'Express', 'PostgreSQL', 'JWT'],
    text: 'Електронний журнал школи: ролі (адмін, вчитель, учень, батьки), матриця оцінок, розклад, домашні завдання, аналітика.' },
  { title: 'Платформа party-ігор', stack: ['TypeScript', 'React', 'Vite', 'React Router', 'Node.js', 'Express', 'Prisma', 'SQLite'],
    text: 'Монорепо з трьома іграми для компанії: «Я ніколи не…», «Правда чи дія», «Крокодил», плюс адмін-сторінка питань.' },
]
