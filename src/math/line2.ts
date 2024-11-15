import * as THREE from 'three'
import { TOLERANCE } from './config'
import { LineSegment2 } from './lineSegment2'

export class Line2 {
  point: THREE.Vector2
  direction: THREE.Vector2

  constructor(point: THREE.Vector2, direction: THREE.Vector2) {
    this.point = point.clone()
    this.direction = direction.clone()
  }

  clone() {
    return new Line2(this.point, this.direction)
  }

  getRightNormal() {
    return new THREE.Vector2(this.direction.y, -this.direction.x)
  }

  translation(v: THREE.Vector2) {
    this.point.add(v)
    return this
  }

  intersect(other: Line2) {
    const p1 = this.point;
    const d1 = this.direction;
    const p2 = other.point;
    const d2 = other.direction;

    const cross = d1.cross(d2);
    if (Math.abs(cross) <= TOLERANCE) {
        return undefined
    }

    const t = p2.clone().sub(p1).cross(d2) / cross;
    return new THREE.Vector2(p1.x + t * d1.x, p1.y + t * d1.y);
  }

  getNearestPoint(p: THREE.Vector2): THREE.Vector2 {
    // 计算参数 t
    const t = (this.direction.x * (p.x - this.point.x) + this.direction.y * (p.y - this.point.y)) / (this.direction.x * this.direction.x + this.direction.y * this.direction.y);
    // 计算最近点的坐标
    const closestPoint = new THREE.Vector2(
      this.point.x + this.direction.x * t,
      this.point.y + this.direction.y * t
    )
    return closestPoint;
  }

  static fromLineSegment2(lineSegment: LineSegment2) {
    return new Line2(lineSegment.start, lineSegment.direction)
  }
}
