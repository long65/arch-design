import * as THREE from 'three'

export const getCameraParam = (camera: THREE.PerspectiveCamera, target?: THREE.Vector3) => {
  const json = JSON.stringify(camera)
  const param = JSON.parse(json).object
  if (target) {
    param.target = {x: target.x, y: target.y, z: target.z}
  }
  return param
}

export const initModel = (parent: THREE.Object3D, color?: string, texture?: THREE.Texture) => {
  if (parent instanceof THREE.Mesh) {
    const normal = parent.geometry.getAttribute('normal')
    if (!normal) {
      parent.geometry.computeVertexNormals()
    }

    if (color) {
      parent.material.color = new THREE.Color(color)
    }
    if (texture) {
      parent.material.map = texture
      parent.material.needsUpdate = true
    }
    // parent.material.metalness = 0
    // parent.material.vertexColors = false
    parent.userData = {
      defaultColor: parent.material.color,
      defaultMaterial: parent.material
    }
  } else if (parent.children) {
    parent.children.forEach((child) => {
      initModel(child, color, texture)
    })
  }
}

export const hexToRGB = (hex: string) => {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return { r, g, b };
}

export const isEqualArray = (a: any[], b: any[]) => {
  return a.length === b.length && a.every((v, i) => v === b[i])
}

export const dispose = (o: any) => {
  if (o.geometry) {
    o.geometry.dispose()
  }
  if (o.material) {
    const material = o.material
    if (material instanceof Array) {
      material.forEach((m) => {
        m.dispose()
        if (m['map']) {
          m['map'].dispose()
        }
      })
    } else {
      material.dispose()
      if (material['map']) {
        material['map'].dispose()
      }
    }
  }
  if (o.children.length) {
    o.children.forEach((c: any) => {
      dispose(c)
    })
  }
}

export const getTexture = (url: string, callback: Function) => {
  new THREE.TextureLoader().load(url, t => {
    t.wrapS = THREE.RepeatWrapping
    t.wrapT = THREE.RepeatWrapping
    callback(t)
  })
}

export const getMaterial = (url: string, p?: any) => {
  let params = {
    polygonOffset: true,
    polygonOffsetFactor: 20,
    polygonOffsetUnits: 20,
    side: THREE.FrontSide,
  }
  if (p) {
    params = {
      ...params, ...p
    }
  }
  const material = new THREE.MeshStandardMaterial(params)
  getTexture(url, (texture: THREE.Texture) => {
    material.map = texture
    material.needsUpdate = true
  })
  return material
}