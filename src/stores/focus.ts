import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { SPOTS, type HoverId, type SpotId } from '@/data/spots'

export type Weather = 'clear' | 'rain' | 'snow'
let toastTimer = 0

export const useFocusStore = defineStore('focus', () => {
  const current = ref<SpotId>('outside')
  const hovered = ref<HoverId | null>(null)
  const hour = new Date().getHours()
  const night = ref(hour < 7 || hour >= 20) // початковий стан за місцевим часом відвідувача
  const lampOn = ref(true)
  const weather = ref<Weather>('clear')
  const sound = ref(true)
  const pets = ref(0) // скільки разів погладили кота; Room стежить і підстрибує
  const fireworks = ref(0)
  const toast = ref('')
  const canvasReady = ref(false)
  const ready = ref(false)

  // Проста версія (чистий HTML): якщо немає WebGL, за ?mode=simple, або якщо відвідувач її обрав раніше
  const webgl = () => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')) } catch { return false } }
  const q = new URLSearchParams(location.search).get('mode')
  const saved = () => { try { return localStorage.getItem('mode') === 'simple' } catch { return false } }
  const simple = ref(q === 'simple' || (q !== '3d' && saved()) || !webgl())
  const setSimple = (v: boolean) => {
    simple.value = v
    try { localStorage.setItem('mode', v ? 'simple' : '3d') } catch { /* ігноруємо */ }
    if (v) { ready.value = false; canvasReady.value = false; current.value = 'outside'; hovered.value = null; document.body.style.cursor = '' }
  }

  const inside = computed(() => current.value !== 'outside')
  const spot = computed(() => SPOTS[current.value])

  const go = (id: SpotId) => { current.value = id }
  const enter = () => { current.value = 'overview' }
  const exit = () => { current.value = 'outside' }
  const reset = () => { if (current.value !== 'outside') current.value = 'overview' }
  const toggleNight = () => { night.value = !night.value }
  const toggleSound = () => { sound.value = !sound.value }
  const toggleLamp = () => { lampOn.value = !lampOn.value }
  const cycleWeather = () => { weather.value = weather.value === 'clear' ? 'rain' : weather.value === 'rain' ? 'snow' : 'clear' }
  const pet = () => { pets.value++ }
  const boom = () => { fireworks.value++ }
  const say = (msg: string, ms = 2600) => {
    toast.value = msg
    clearTimeout(toastTimer)
    toastTimer = window.setTimeout(() => (toast.value = ''), ms)
  }

  return { simple, setSimple, current, hovered, night, lampOn, weather, sound, pets, fireworks, toast, canvasReady, ready, inside, spot, go, enter, exit, reset, toggleNight, toggleSound, toggleLamp, cycleWeather, pet, boom, say }
})
