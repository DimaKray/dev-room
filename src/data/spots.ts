export type SpotId = 'outside' | 'overview' | 'monitor' | 'shelf' | 'cat' | 'plant'
type V3 = [number, number, number]

export interface Spot {
  id: SpotId
  nav: string      // короткий підпис у меню
  title: string    // заголовок панелі
  text: string
  cam: V3          // де стоїть камера
  look: V3         // куди дивиться
}

export const SPOTS: Record<SpotId, Spot> = {
  outside:  { id: 'outside',  nav: 'Назовні', title: '', text: '', cam: [9.5, 5, 13], look: [0, 2, 0] },
  overview: { id: 'overview', nav: 'Кімната', title: 'Кімната розробника', text: 'Клікай на предмети: монітор, полицю, кота, рослину.', cam: [4.6, 3.4, 5.6], look: [0, 1.4, -1] },
  monitor:  { id: 'monitor',  nav: 'Проєкти', title: 'Мої проєкти', text: 'Те, що я зібрав сам.', cam: [0, 1.6, 0.6], look: [0, 1.5, -2.35] },
  shelf:    { id: 'shelf',    nav: 'Навички', title: 'Полиця зі стеком', text: 'Інструменти, з якими працюю щодня.', cam: [2.4, 2.4, 0.2], look: [2.3, 2.2, -2.8] },
  cat:      { id: 'cat',      nav: 'Про мене', title: 'Знайомся, це Баг', text: 'Баг охороняє код від ночей без сну.', cam: [3.2, 1.2, 1.8], look: [1.8, 0.3, -0.5] },
  plant:    { id: 'plant',    nav: 'Контакти', title: 'Напиши мені', text: 'Відповідаю швидше, ніж росте ця рослина.', cam: [-1.5, 1.8, 0.5], look: [-2.8, 0.9, -2.5] },
}

// у меню всередині кімнати «Назовні» не потрібна
export const SPOT_LIST = Object.values(SPOTS).filter((s) => s.id !== 'outside')
