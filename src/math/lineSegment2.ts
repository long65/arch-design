import * as THREE from 'three'
import { TOLERANCE } from './config'
import { Line2 } from './line2'
import { Ray2 } from './ray2'

export enum ExpandDirection {
  Start = 0,
  End,
  Both
}

export class LineSegment2 {
  start: THREE.Vector2
  end: THREE.Vector2
  middle: THREE.Vector2
  direction: THREE.Vector2
  length: number

  constructor(start: THREE.Vector2, end: THREE.Vector2) {
    this.start = start.clone()
    this.end = end.clone()
    this.middle = new THREE.Vector2().addVectors(this.start, this.end).multiplyScalar(0.5)
    this.direction = new THREE.Vector2().subVectors(this.end, this.start).normalize()
    this.length = this.start.distanceTo(this.end)
  }

  copy(line: LineSegment2) {
    this.start.copy(line.start)
    this.end.copy(line.end)
    this.middle = new THREE.Vector2().addVectors(this.start, this.end).multiplyScalar(0.5)
    this.direction = new THREE.Vector2().subVectors(this.end, this.start).normalize()
    this.length = this.start.distanceTo(this.end)
  }

  clone() {
    return new LineSegment2(this.start, this.end)
  }

  reverse() {
    return new LineSegment2(this.end, this.start)
  }

  set(start: THREE.Vector2, end: THREE.Vector2) {
    this.start.copy(start)
    this.end.copy(end)
    this.middle.addVectors(this.start, this.end).multiplyScalar(0.5)
    this.direction.subVectors(this.end, this.start).normalize()
    this.length = this.start.distanceTo(this.end)
  }

  expand(n: number, dir: ExpandDirection) {
    const offset = this.direction.clone().multiplyScalar(n)
    const newStart = this.start.clone()
    const newEnd = this.end.clone()
    if (dir === ExpandDirection.Start || dir === ExpandDirection.Both) {
      newStart.sub(offset)
    }
    if (dir === ExpandDirection.End || dir === ExpandDirection.Both) {
      newEnd.add(offset)
    }
    this.set(newStart, newEnd)
  }

  translation(v: THREE.Vector2) {
    this.start.add(v)
    this.end.add(v)
    this.middle.addVectors(this.start, this.end).multiplyScalar(0.5)
    return this
  }

  getRightNormal() {
    return new THREE.Vector2(this.direction.y, -this.direction.x)
  }

  isEqual(line: LineSegment2, tolerance = TOLERANCE) {
    return this.start.distanceTo(line.start) <= tolerance && this.end.distanceTo(line.end) <= tolerance
  }

  isOpposite(line: LineSegment2, tolerance = TOLERANCE) {
    return this.start.distanceTo(line.end) <= tolerance && this.end.distanceTo(line.start) <= tolerance
  }

  isStart(p: THREE.Vector2, tolerance = TOLERANCE) {
    return p.distanceTo(this.start) <= tolerance
  }

  isEnd(p: THREE.Vector2, tolerance = TOLERANCE) {
    return p.distanceTo(this.end) <= tolerance
  }

  isTerminal(p: THREE.Vector2, tolerance = TOLERANCE) {
    return this.isStart(p, tolerance) || this.isEnd(p, tolerance)
  }

  other(p: THREE.Vector2) {
    if (this.isStart(p)) {
      return this.end
    } else {
      return this.start
    }
  }

  containPoint(p: THREE.Vector2, allowTerminal = true, tolerance = TOLERANCE) {
    const distanceStart = p.distanceTo(this.start)
    const distanceEnd = p.distanceTo(this.end)
    if (!allowTerminal && (distanceStart <= tolerance || distanceEnd <= tolerance)) {
      return false
    }
    return Math.abs(distanceStart + distanceEnd - this.length) <= tolerance
  }

  getNearestPoint(point: THREE.Vector2) {
    const pointToStart = new THREE.Vector2().subVectors(point, this.start)
    const t = pointToStart.dot(this.direction)
    const projection = this.direction.clone().multiplyScalar(t).add(this.start)

    let closestPoint: THREE.Vector2
    if (t < 0) {
      closestPoint = this.start.clone()
    } else if (t > this.length) {
      closestPoint = this.end.clone()
    } else {
      closestPoint = projection
    }
    return closestPoint
  }

  distanceTo(point: THREE.Vector2) {
    const res = this.getNearestPoint(point)
    return res.distanceTo(point)
  }

  containLine(other: LineSegment2, tolerance = TOLERANCE) {
    return this.containPoint(other.start, true, tolerance) && this.containPoint(other.end, true, tolerance)
  }

  isCoincide(other: LineSegment2, tolerance = TOLERANCE) {
    if (Math.abs(this.direction.cross(other.direction)) <= tolerance) {
      if (this.containPoint(other.start, false, tolerance) && !this.containPoint(other.end, false, tolerance)) {
        return true
      }
      if (this.containPoint(other.end, false, tolerance) && !this.containPoint(other.start, false, tolerance)) {
        return true
      }
    }
    return false
  }

  intersect(other: LineSegment2) {
    const x1 = this.start.x,
      y1 = this.start.y
    const x2 = this.end.x,
      y2 = this.end.y
    const x3 = other.start.x,
      y3 = other.start.y
    const x4 = other.end.x,
      y4 = other.end.y

    const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)

    if (denominator === 0) {
      return undefined
    }

    const t1 = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator
    const t2 = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator

    if (t1 >= 0 && t1 <= 1 && t2 >= 0 && t2 <= 1) {
      const x = x1 + t1 * (x2 - x1)
      const y = y1 + t1 * (y2 - y1)
      return new THREE.Vector2(x, y)
    } else {
      return undefined
    }
  }

  split(line: LineSegment2) {
    if (this.isEqual(line)) {
      return [this]
    }
    const points = [this.start, this.end, line.start, line.end].reduce((uniquePoints: THREE.Vector2[], point) => {
      if (!uniquePoints.some((uniquePoint) => point.distanceTo(uniquePoint) < TOLERANCE)) {
        uniquePoints.push(point)
      }
      return uniquePoints
    }, [])
    points.sort((a, b) => a.distanceTo(this.start) - b.distanceTo(this.start))

    const lineArr: LineSegment2[] = []
    for (let i = 0; i < points.length - 1; i++) {
      lineArr.push(new LineSegment2(points[i], points[i + 1]))
    }
    return lineArr
  }

  static createMergeLineByPoints(points: THREE.Vector2[]) {
    const lines: LineSegment2[] = []
    let i = 0
    while (i < points.length) {
      let next = i + 1
      let afterNext = i + 2
      let line: LineSegment2
      while (afterNext <= points.length) {
        const tmpLine = new LineSegment2(points[i], points[afterNext % points.length])
        if (tmpLine.containPoint(points[next % points.length])) {
          line = tmpLine
          next++
          afterNext++
        } else {
          break
        }
      }
      if (!line) {
        line = new LineSegment2(points[i], points[next % points.length])
      }
      lines.push(line)
      i = next
    }

    if (
      lines.length > 1 &&
      Math.abs(lines[0].direction.cross(lines[lines.length - 1].direction)) <= TOLERANCE &&
      (lines[0].containPoint(lines[lines.length - 1].start) || lines[0].containPoint(lines[lines.length - 1].end))
    ) {
      const last = lines.splice(lines.length - 1)
      const newFirst = new LineSegment2(last[0].start, lines[0].end)
      lines[0] = newFirst
    }
    return lines
  }

  static getDatas(coordinates: THREE.Vector2[], thickness: number) {
    const originLineSegments: LineSegment2[] = []
    for (let i = 0; i < coordinates.length; i++) {
      originLineSegments.push(new LineSegment2(coordinates[i], coordinates[(i + 1) % coordinates.length]))
    }

    const mergeLineSegments = LineSegment2.createMergeLineByPoints(coordinates)
    const lines = mergeLineSegments.map((l) => new Line2(l.start, l.direction))
    const leftLines: Line2[] = []
    const rightLines: Line2[] = []
    lines.forEach((line) => {
      const rightNormal = line.getRightNormal()
      const rightOffset = rightNormal.clone().multiplyScalar(thickness / 2)
      const leftOffset = rightOffset.clone().negate()
      const leftLine = line.clone().translation(leftOffset)
      const rightLine = line.clone().translation(rightOffset)
      leftLines.push(leftLine)
      rightLines.push(rightLine)
    })

    const leftCoordinates: THREE.Vector2[] = []
    const rightCoordinates: THREE.Vector2[] = []
    for (let i = 0; i < lines.length; i++) {
      const pre = (i + lines.length - 1) % lines.length
      const mergeCoordinate = lines[pre].intersect(lines[i])
      const leftCoordinate = leftLines[pre].intersect(leftLines[i])
      const rightCoordinate = rightLines[pre].intersect(rightLines[i])
      if (mergeCoordinate && leftCoordinate && rightCoordinate) {
        leftCoordinates.push(leftCoordinate)
        rightCoordinates.push(rightCoordinate)
      }
    }

    const leftBox = new THREE.Box2().setFromPoints(leftCoordinates)
    const rightBox = new THREE.Box2().setFromPoints(rightCoordinates)
    const leftSize = leftBox.getSize(new THREE.Vector2())
    const rightSize = rightBox.getSize(new THREE.Vector2())

    const innerDirection = leftSize.lengthSq() < rightSize.lengthSq() ? 'left' : 'right'
    const innerCoordinates = innerDirection === 'left' ? leftCoordinates : rightCoordinates
    const outerCoordinates = innerDirection === 'left' ? rightCoordinates : leftCoordinates
    const innerBox2 = innerDirection === 'left' ? leftBox : rightBox
    const outerBox2 = innerDirection === 'left' ? rightBox : leftBox

    const innerLineSegments = innerCoordinates.map((c, index) => {
      return new LineSegment2(c, innerCoordinates[(index + 1) % innerCoordinates.length])
    })
    const outerLineSegments = outerCoordinates.map((c, index) => {
      return new LineSegment2(c, outerCoordinates[(index + 1) % outerCoordinates.length])
    })

    return {
      originLineSegments,
      mergeLineSegments,
      innerLineSegments,
      outerLineSegments,
      innerDirection,
      innerBox2,
      outerBox2
    }
  }

  static loopExpand(points: THREE.Vector2[], value: number, dir: 'left' | 'right') {
    const mergeLineSegments = LineSegment2.createMergeLineByPoints(points)
    const lines = mergeLineSegments.map((l) => new Line2(l.start, l.direction))
    const expandLines: Line2[] = []
    lines.forEach((line) => {
      const rightNormal = line.getRightNormal()
      const rightOffset = rightNormal.clone().multiplyScalar(value)
      const offset = dir === 'left' ? rightOffset.negate() : rightOffset
      expandLines.push(line.clone().translation(offset))
    })
    const expandCoordinates: THREE.Vector2[] = []
    for (let i = 0; i < expandLines.length; i++) {
      const pre = (i + expandLines.length - 1) % expandLines.length
      const coordinate = expandLines[pre].intersect(expandLines[i])
      expandCoordinates.push(coordinate)
    }
    return expandCoordinates
    // const expandLineSegments = expandCoordinates.map((c, index) => {
    //   return new LineSegment2(c, expandCoordinates[(index + 1) % expandCoordinates.length])
    // })
    // return expandLineSegments
  }

  static loopContainPoint(loop: LineSegment2[], point: THREE.Vector2) {
    if (loop.some((l) => l.containPoint(point))) {
      return true
    }
    const right = new THREE.Vector2(1, 0)
    const ray = new Ray2(point, right)
    const res = ray.intersectLoop(loop)
    if (res.length % 2 === 1) {
      return true
    }
    return false
  }

  static loopContainBox(loop: LineSegment2[], box: THREE.Box2) {
    const points = [
      new THREE.Vector2(box.min.x, box.min.y),
      new THREE.Vector2(box.max.x, box.min.y),
      new THREE.Vector2(box.max.x, box.max.y),
      new THREE.Vector2(box.min.x, box.max.y)
    ]
    if (points.every((p) => LineSegment2.loopContainPoint(loop, p))) {
      return true
    }
    return false
  }

  isParallel(other: LineSegment2) {
    return Math.abs(this.direction.cross(other.direction)) <= TOLERANCE
  }

  haveCommonPoint(other: LineSegment2) {
    return this.isStart(other.start) || this.isEnd(other.start) || this.isStart(other.end) || this.isEnd(other.end)
  }

  // 建立线段图
  static buildSegmentGraph(segments: LineSegment2[]): Map<number, number[]> {
    const graph = new Map<number, number[]>()
    for (let i = 0; i < segments.length; i++) {
      for (let j = i + 1; j < segments.length; j++) {
        if (segments[i].isParallel(segments[j]) && segments[i].haveCommonPoint(segments[j])) {
          if (!graph.has(i)) {
            graph.set(i, [])
          }
          if (!graph.has(j)) {
            graph.set(j, [])
          }
          graph.get(i)!.push(j)
          graph.get(j)!.push(i)
        }
      }
    }
    return graph
  }

  // 使用DFS找到所有连通分量
  static findConnectedComponents(graph: Map<number, number[]>, n: number): number[][] {
    const visited = new Array(n).fill(false)
    const components: number[][] = []

    const dfs = (node: number, component: number[]) => {
      const stack = [node]
      while (stack.length > 0) {
        const v = stack.pop()!
        if (!visited[v]) {
          visited[v] = true
          component.push(v)
          const neighbors = graph.get(v) || []
          for (const neighbor of neighbors) {
            if (!visited[neighbor]) {
              stack.push(neighbor)
            }
          }
        }
      }
    }

    for (let i = 0; i < n; i++) {
      if (!visited[i]) {
        const component: number[] = []
        dfs(i, component)
        components.push(component)
      }
    }

    return components
  }

  // 合并线段
  static mergeSegments(segments: LineSegment2[]): LineSegment2[] {
    const graph = LineSegment2.buildSegmentGraph(segments)
    const components = LineSegment2.findConnectedComponents(graph, segments.length)
    const mergeSegments: LineSegment2[] = []

    for (const component of components) {
      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity
      for (const index of component) {
        const ls = segments[index]
        minX = Math.min(minX, ls.start.x, ls.end.x)
        minY = Math.min(minY, ls.start.y, ls.end.y)
        maxX = Math.max(maxX, ls.start.x, ls.end.x)
        maxY = Math.max(maxY, ls.start.y, ls.end.y)
      }
      mergeSegments.push(new LineSegment2(new THREE.Vector2(minX, minY), new THREE.Vector2(maxX, maxY)))
    }

    return mergeSegments
  }
}
