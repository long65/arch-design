import * as THREE from 'three'
import { TOLERANCE } from './config'
import { LineSegment2 } from './lineSegment2'

export class Ray2 {
  origin: THREE.Vector2
  direction: THREE.Vector2

  constructor(origin: THREE.Vector2, direction: THREE.Vector2) {
    this.origin = origin.clone()
    this.direction = direction.clone()
  }

  set(origin: THREE.Vector2, direction: THREE.Vector2) {
    this.origin.copy(origin)
    this.direction.copy(direction)
  }

  distanceSqToPoint(point: THREE.Vector2) {
    const directionDistance = new THREE.Vector2().subVectors(point, this.origin).dot(this.direction)
    if (directionDistance < 0) {
      return this.origin.distanceToSquared(point)
    }
    const v = this.origin.clone().addScaledVector(this.direction, directionDistance)
    return v.distanceToSquared(point)
  }

  distanceToPoint(point: THREE.Vector2) {
    return Math.sqrt(this.distanceSqToPoint(point))
  }

  intersectLine(line: LineSegment2) {
    const cross = line.direction.cross(this.direction)
    if (Math.abs(cross) <= TOLERANCE) {
      return undefined
    }

    const t = this.origin.clone().sub(line.start).cross(this.direction) / cross
    const point = new THREE.Vector2(line.start.x + t * line.direction.x, line.start.y + t * line.direction.y)
    if (line.containPoint(point) && this.distanceSqToPoint(point) <= TOLERANCE) {
      return {
        distance: this.origin.distanceTo(point),
        point,
        line
      }
    }
    return undefined
  }

  intersectLoop(loop: LineSegment2[]) {
    const intersects: {
      distance: number
      point: THREE.Vector2,
      line: LineSegment2
    }[] = []
    loop.forEach((l) => {
      const p = this.intersectLine(l)
      if (p) {
        intersects.push(p)
      }
    })
    if (intersects.length > 1) {
      intersects.sort((a, b) => a.distance - b.distance)
    }
    return intersects
  }
}
