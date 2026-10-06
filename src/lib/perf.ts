// Рівні якості: на телефонах і слабких пристроях сцена легша (менше дерев, трави, крапель, менші тіні).
// Примусово: ?quality=low або ?quality=high в адресі.
const q = new URLSearchParams(location.search).get('quality')
const mem = (navigator as any).deviceMemory ?? 8
const touch = window.matchMedia('(pointer: coarse)').matches
const small = Math.min(window.innerWidth, window.innerHeight) < 700

const low = q === 'low' || (q !== 'high' && (touch || small || mem <= 4))

export const perf = {
  low,
  trees: low ? 14 : 38,
  bits: low ? 6 : 16,
  tufts: low ? 10 : 40,
  flowerPairs: low ? 5 : 12,
  flies: low ? 30 : 70,
  dust: low ? 60 : 140,
  rain: low ? 220 : 450,
  snow: low ? 200 : 420,
  shadowSize: low ? 1024 : 2048,
}
