import { L } from '@/i18n'

export type SpotId = 'outside' | 'overview' | 'monitor' | 'shelf' | 'cat' | 'plant'
export type HoverId = SpotId | 'lamp'
type V3 = [number, number, number]

export interface Spot {
  id: SpotId
  nav: L      // короткий підпис у меню
  title: L    // заголовок панелі
  text: L
  cam: V3     // де стоїть камера
  look: V3    // куди дивиться
}

export const SPOTS: Record<SpotId, Spot> = {
  outside:  { id: 'outside',  nav: L('Назовні', 'Outside'), title: L(''), text: L(''), cam: [9.5, 5, 13], look: [0, 2, 0] },
  overview: { id: 'overview', nav: L('Кімната', 'Room'), title: L('Кімната розробника', "Developer's room"), text: L('Клікай на предмети: монітор, полицю, кота, рослину, лампу.', 'Click the objects: monitor, shelf, cat, plant, lamp.'), cam: [4.6, 3.4, 5.6], look: [0, 1.4, -1] },
  monitor:  { id: 'monitor',  nav: L('Проєкти', 'Projects'), title: L('Мої проєкти', 'My projects'), text: L('Те, що я зібрав сам.', 'Things I built myself.'), cam: [0, 1.6, 0.6], look: [0, 1.5, -2.35] },
  shelf:    { id: 'shelf',    nav: L('Навички', 'Skills'), title: L('Полиця зі стеком', 'The tech shelf'), text: L('Інструменти, з якими працюю щодня.', 'Tools I use every day.'), cam: [2.4, 2.4, 0.2], look: [2.3, 2.2, -2.8] },
  cat:      { id: 'cat',      nav: L('Про мене', 'About me'), title: L('Знайомся, це Баг', 'Meet Bug'), text: L('Баг охороняє код від ночей без сну.', 'Bug guards the code from sleepless nights.'), cam: [3.2, 1.2, 1.8], look: [1.8, 0.3, -0.5] },
  plant:    { id: 'plant',    nav: L('Контакти', 'Contact'), title: L('Напиши мені', 'Write to me'), text: L('Відповідаю швидше, ніж росте ця рослина.', 'I reply faster than this plant grows.'), cam: [-1.5, 1.8, 0.5], look: [-2.8, 0.9, -2.5] },
}

// у меню всередині кімнати «Назовні» не потрібна
export const SPOT_LIST = Object.values(SPOTS).filter((s) => s.id !== 'outside')
