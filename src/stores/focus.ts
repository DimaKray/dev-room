import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { SPOTS, type SpotId } from '@/data/spots'

export const useFocusStore = defineStore('focus', () => {
  const current = ref<SpotId>('outside')
  const hovered = ref<SpotId | null>(null)
  const night = ref(false)
  const sound = ref(true)
  const pets = ref(0) // скільки разів погладили кота; Room стежить і підстрибує
  const canvasReady = ref(false)
  const ready = ref(false)

  const inside = computed(() => current.value !== 'outside')
  const spot = computed(() => SPOTS[current.value])

  const go = (id: SpotId) => { current.value = id }
  const enter = () => { current.value = 'overview' }
  const exit = () => { current.value = 'outside' }
  const reset = () => { if (current.value !== 'outside') current.value = 'overview' }
  const toggleNight = () => { night.value = !night.value }
  const toggleSound = () => { sound.value = !sound.value }
  const pet = () => { pets.value++ }

  return { current, hovered, night, sound, pets, canvasReady, ready, inside, spot, go, enter, exit, reset, toggleNight, toggleSound, pet }
})
