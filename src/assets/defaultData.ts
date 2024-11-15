import { getMaterial } from '@/views/viewer/utils/util'
import * as THREE from 'three'

export const boxGeometry = new THREE.BoxGeometry(1, 1, 1)

export const lineMaterial = new THREE.LineBasicMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
  polygonOffset: true,
  polygonOffsetFactor: -1,
  polygonOffsetUnits: -1
})
export const wallMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
  polygonOffset: true,
  polygonOffsetFactor: 1,
  polygonOffsetUnits: 1
})
export const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  polygonOffset: true,
  polygonOffsetFactor: 1,
  polygonOffsetUnits: 1,
  side: THREE.FrontSide
})
export const ceilingMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  polygonOffset: true,
  polygonOffsetFactor: 1,
  polygonOffsetUnits: 1,
  side: THREE.BackSide
})
export const blackMaterial = new THREE.MeshBasicMaterial({
  color: 0x0000ff,
  side: THREE.DoubleSide,
  polygonOffset: true,
  polygonOffsetFactor: 1,
  polygonOffsetUnits: 1
})
export const floorMaskMaterial = new THREE.MeshBasicMaterial({ color: 0x503232 })
export const ceilingMaskMaterial = new THREE.MeshBasicMaterial({ color: 0x787850, side: THREE.DoubleSide })
export const depthMaterial = new THREE.MeshDepthMaterial({
  side: THREE.FrontSide,
  polygonOffset: true,
  polygonOffsetFactor: 1,
  polygonOffsetUnits: 1
})
export const normalMaterial = new THREE.MeshNormalMaterial({
  polygonOffset: true,
  polygonOffsetFactor: -1,
  polygonOffsetUnits: -1
})

const imageUrls = {
  beige_ceramic_tiles:'https://ai-train-data3.s3.us-west-1.amazonaws.com/3d/image/beige_ceramic_tiles.jpg',
  floor_tiles: 'https://ai-train-data3.s3.us-west-1.amazonaws.com/3d/image/floor_tiles.jpg',
  hexagon_ceramic_tiles: 'https://ai-train-data3.s3.us-west-1.amazonaws.com/3d/image/hexagon_ceramic_tiles.jpg',
  wooden_flooring: 'https://ai-train-data3.s3.us-west-1.amazonaws.com/3d/image/wooden_flooring.jpg',
  wooden_flooring2: 'https://ai-train-data3.s3.us-west-1.amazonaws.com/3d/image/wooden_flooring2.jpg',
  ceramic_tile1: 'https://ai-train-data3.s3.us-west-1.amazonaws.com/3d/image/ceramic_tile1.jpg',
  ceramic_tile2:'https://ai-train-data3.s3.us-west-1.amazonaws.com/3d/image/ceramic_tile2.jpg',
  marble1: 'https://ai-train-data3.s3.us-west-1.amazonaws.com/3d/image/marble1.jpg',
  marble2: 'https://ai-train-data3.s3.us-west-1.amazonaws.com/3d/image/marble2.jpg',
  marble3: 'https://ai-train-data3.s3.us-west-1.amazonaws.com/3d/image/marble3.jpg',
  suspended_ceiling1:'https://ai-train-data3.s3.us-west-1.amazonaws.com/3d/image/suspended_ceiling1.jpg',
  suspended_ceiling2: 'https://ai-train-data3.s3.us-west-1.amazonaws.com/3d/image/suspended_ceiling2.jpg',
}

export const surfaceMaterial = {
  beige_ceramic_tiles: {
    url: imageUrls.beige_ceramic_tiles,
    mtrl: getMaterial(imageUrls.beige_ceramic_tiles)
  },
  hexagon_ceramic_tiles: {
    url: imageUrls.hexagon_ceramic_tiles,
    mtrl: getMaterial(imageUrls.hexagon_ceramic_tiles)
  },
  wooden_flooring: {
    url: imageUrls.wooden_flooring,
    mtrl: getMaterial(imageUrls.wooden_flooring)
  },
  suspended_ceiling1: {
    url: imageUrls.suspended_ceiling1,
    mtrl: getMaterial(imageUrls.suspended_ceiling1)
  },
  suspended_ceiling2: {
    url: imageUrls.suspended_ceiling2,
    mtrl: getMaterial(imageUrls.suspended_ceiling2)
  },
  ceramic_tile1: {
    url: imageUrls.ceramic_tile1,
    mtrl: getMaterial(imageUrls.ceramic_tile1, {
      side: THREE.DoubleSide
    })
  },
  ceramic_tile2: {
    url: imageUrls.ceramic_tile2,
    mtrl: getMaterial(imageUrls.ceramic_tile2, {
      side: THREE.DoubleSide
    })
  },
  marble1: {
    url: imageUrls.marble1,
    mtrl: getMaterial(imageUrls.marble1, {
      side: THREE.DoubleSide
    })
  }
}

export const suspendedCeilingModel = {
  lamp: {
    image: getMaterial('https://ai-train-data3.s3.us-west-1.amazonaws.com/3d/image/lamp.jpg', {
      emissive: 0xbbbbbb,
    }),
    width: 0.6,
    height: 0.3
  },
  warm_breeze: {
    image: getMaterial('https://ai-train-data3.s3.us-west-1.amazonaws.com/3d/image/warm_breeze.jpg'),
    width: 0.352,
    height: 0.7
  }
}

export const dwParams = {
  doorway: {
    height: 2.7,
    bottom: 0
  },
  door: {
    height: 2.2,
    bottom: 0,
    url: '/models/door.glb'
  },
  window: {
    height: 1.5,
    bottom: 0.9,
    url: '/models/window.glb'
  },
  sliding_door_1: {
    height: 2.4,
    bottom: 0
  },
  sliding_door_2: {
    height: 2.4,
    bottom: 0
  },
  sliding_door_3: {
    height: 2.4,
    bottom: 0
  },
  french_window: {
    height: 2.2,
    bottom: 0.2
  },
  bay_window: {
    height: 1.998,
    bottom: 0.55
  }
}