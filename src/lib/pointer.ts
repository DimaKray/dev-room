// Положення курсора (-1..1) і час останнього руху. Кіт стежить за курсором і засинає, якщо той стоїть.
export const pointer = { x: 0, y: 0, last: performance.now() }
window.addEventListener('pointermove', (e) => {
  pointer.x = (e.clientX / window.innerWidth - 0.5) * 2
  pointer.y = (e.clientY / window.innerHeight - 0.5) * 2
  pointer.last = performance.now()
})
