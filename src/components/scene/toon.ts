import { DataTexture, NearestFilter, RedFormat } from 'three'

// 4 різких «сходинки» світла: це і дає мультяшний вигляд тіней
const data = new Uint8Array([80, 150, 215, 255])
export const gradient = new DataTexture(data, data.length, 1, RedFormat)
gradient.minFilter = gradient.magFilter = NearestFilter
gradient.needsUpdate = true

export const INK = '#0d0816' // колір контуру
