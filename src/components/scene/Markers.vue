<script setup lang="ts">
import { useLoop } from '@tresjs/core'
import { CanvasTexture, SRGBColorSpace, type Sprite } from 'three'
import { useFocusStore } from '@/stores/focus'
import type { HoverId } from '@/data/spots'

// Пульсуючі кільця над усім, на що можна клікнути. Зовні це двері, всередині монітор, полиця, кіт, рослина.
const store = useFocusStore()
const list: { id: HoverId; pos: [number, number, number]; outside?: boolean }[] = [
  { id: 'outside', pos: [0, 2.8, 3.4], outside: true },
  { id: 'monitor', pos: [0, 2.45, -2.3] },
  { id: 'shelf', pos: [2.3, 3.4, -2.7] },
  { id: 'cat', pos: [1.8, 1.2, -0.5] },
  { id: 'plant', pos: [-2.8, 1.7, -2.5] },
  { id: 'lamp', pos: [-1.2, 1.95, -2.3] },
]

const tex = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 128
  const g = c.getContext('2d')!
  const glow = g.createRadialGradient(64, 64, 10, 64, 64, 62)
  glow.addColorStop(0, 'rgba(98,240,255,.40)'); glow.addColorStop(1, 'rgba(98,240,255,0)')
  g.fillStyle = glow; g.fillRect(0, 0, 128, 128)
  g.lineWidth = 14; g.strokeStyle = '#0d0816'; g.beginPath(); g.arc(64, 64, 38, 0, Math.PI * 2); g.stroke()
  g.lineWidth = 7; g.strokeStyle = '#62f0ff'; g.beginPath(); g.arc(64, 64, 38, 0, Math.PI * 2); g.stroke()
  g.fillStyle = '#0d0816'; g.beginPath(); g.arc(64, 64, 19, 0, Math.PI * 2); g.fill()
  g.fillStyle = '#ff6fb5'; g.beginPath(); g.arc(64, 64, 13, 0, Math.PI * 2); g.fill()
  const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace
  return t
})()

const sprites: Sprite[] = []
const { onBeforeRender } = useLoop()
onBeforeRender(({ elapsed }) => {
  sprites.forEach((s, i) => {
    const m = list[i]
    const show = m.outside ? store.current === 'outside' : store.current === 'overview'
    const mat = s.material
    mat.opacity += ((show ? 1 : 0) - mat.opacity) * 0.12
    s.visible = mat.opacity > 0.02
    const k = (0.36 + Math.sin(elapsed * 3 + i) * 0.04) * (store.hovered === m.id ? 1.35 : 1)
    s.scale.set(k, k, 1)
    s.position.y = m.pos[1] + Math.sin(elapsed * 2 + i * 1.7) * 0.07
  })
})
</script>

<template>
  <TresGroup>
    <TresSprite v-for="(m, i) in list" :key="m.id" :ref="(el: any) => { if (el) sprites[i] = el }" :position="m.pos" :render-order="10">
      <TresSpriteMaterial :map="tex" transparent :opacity="0" :depth-test="false" />
    </TresSprite>
  </TresGroup>
</template>
