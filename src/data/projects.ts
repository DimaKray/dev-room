import { L } from '@/i18n'

export interface Project { title: L; stack: string[]; text: L }

export const PROJECTS: Project[] = [
  { title: L('Шлях розробника', "The Developer's Journey"),
    stack: ['React', 'TypeScript', 'Vite', 'GSAP', 'ScrollTrigger', 'Lenis', 'Web Audio'],
    text: L('Портфоліо-комікс: кар\u2019єра як історія героя. Кадри з\u2019являються під час скролу, удари супроводжуються тряскою і звуком.',
            "Portfolio comic: a developer's career told as a hero's story. Frames appear on scroll, hits come with shake and sound.") },
  { title: L('Кімната розробника', "Developer's Room"),
    stack: ['Vue 3', 'TypeScript', 'TresJS', 'Three.js', 'Pinia', 'GSAP'],
    text: L('Цей сайт: 3D-хатинка в лісі, у яку можна зайти. Мультяшні контури, день і ніч, погода, анімована камера.',
            'This site: a 3D cabin in the forest you can walk into. Cartoon outlines, day and night, weather, animated camera.') },
  { title: L('EduJournal'),
    stack: ['React', 'Vite', 'React Router', 'Recharts', 'Axios', 'Node.js', 'Express', 'PostgreSQL', 'JWT'],
    text: L('Електронний журнал школи: ролі (адмін, вчитель, учень, батьки), матриця оцінок, розклад, домашні завдання, аналітика.',
            'School grade book: roles (admin, teacher, student, parent), grade matrix, schedule, homework, analytics.') },
  { title: L('Платформа party-ігор', 'Party games platform'),
    stack: ['TypeScript', 'React', 'Vite', 'React Router', 'Node.js', 'Express', 'Prisma', 'SQLite'],
    text: L('Монорепо з трьома іграми для компанії: «Я ніколи не…», «Правда чи дія», «Крокодил», плюс адмін-сторінка питань.',
            'Monorepo with three party games: "Never Have I Ever", "Truth or Dare", "Charades", plus an admin page for questions.') },
]
