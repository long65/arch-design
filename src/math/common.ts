import * as THREE from 'three'
import { TOLERANCE } from './config'

export const equals = <T>(a: T, b: T) => {
  if (a instanceof THREE.Vector2 && b instanceof THREE.Vector2 && a.distanceTo(b) <= TOLERANCE) {
    return true
  }
  if (a instanceof THREE.Vector3 && b instanceof THREE.Vector3  && a.distanceTo(b) <= TOLERANCE) {
    return true
  }
  if (a instanceof THREE.Box3 && b instanceof THREE.Box3 && a.max.distanceTo(b.max) <= TOLERANCE && a.min.distanceTo(b.min) <= TOLERANCE) {
    return true
  }
  return false
}

export const toVector2 = (v: THREE.Vector3) => {
  return new THREE.Vector2(v.x, v.y)
}

export const toVector3 = (v: THREE.Vector2) => {
  return new THREE.Vector3(v.x, v.y, 0)
}

export const getRight = (v: THREE.Vector2) => {
  return new THREE.Vector2(v.y, -v.x)
}

export const toBox2 = (b: THREE.Box3) => {
  const min = toVector2(b.min)
  const max = toVector2(b.max)
  return new THREE.Box2(min, max)
}

export const determinePolygonDirection = (points: THREE.Vector2[]) => {
  let sum = 0;

  for (let i = 0; i < points.length; i++) {
    const current = points[i];
    const next = points[(i + 1) % points.length]; // 确保最后一个点与第一个点相连

    sum += (next.x - current.x) * (next.y + current.y);
  }

  if (sum < 0) {
    return "clockwise";
  } else if (sum > 0) {
    return "counterclockwise";
  } else {
    return "degenerate"; // 面积为0，可能是退化多边形
  }
}
