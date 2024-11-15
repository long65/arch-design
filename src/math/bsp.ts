
// @ts-nocheck
/* eslint-disable */
import * as THREE from 'three';

const EPSILON = 1e-5;
const COPLANAR = 0;
const FRONT = 1;
const BACK = 2;
const SPANNING = 3;

class Node {
  polygons: Polygon[];
  divider?: Polygon;
  front?: Node;
  back?: Node;

  constructor(polygons?: Polygon[]) {
    this.polygons = polygons || [];
    if (this.polygons.length) {
      this.build(this.polygons);
    }
  }

  clone(): Node {
    const node = new Node();
    node.divider = this.divider != null ? this.divider.clone() : void 0;
    node.polygons = this.polygons.map((item) => item.clone());
    node.front = this.front != null ? this.front.clone() : void 0;
    node.back = this.back != null ? this.back.clone() : void 0;
    return node;
  }

  build(polygons: Polygon[]) {
    let polys,
      sides = {
        front: [],
        back: [],
      };
    if (this.divider == null) {
      this.divider = polygons[0].clone();
    }
    for (let _i = 0, _len = polygons.length; _i < _len; _i++) {
      this.divider.subdivide(
        polygons[_i],
        this.polygons,
        this.polygons,
        sides.front,
        sides.back
      );
    }
    for (const side in sides) {
      if (!sides.hasOwnProperty(side)) continue;
      polys = sides[side];
      if (polys.length) {
        if (this[side] == null) {
          this[side] = new Node();
        }
        this[side].build(polys);
      }
    }
    return this;
  }

  isConvex(polys: Polygon[]): boolean {
    let inner, outer;
    for (let _i = 0, _len = polys.length; _i < _len; _i++) {
      inner = polys[_i];
      for (let _j = 0, _len1 = polys.length; _j < _len1; _j++) {
        outer = polys[_j];
        if (inner !== outer && outer.classifySide(inner) !== BACK) {
          return false;
        }
      }
    }
    return true;
  }

  allPolygons(): Polygon[] {
    return this.polygons
      .slice()
      .concat(this.front != null ? this.front.allPolygons() : [])
      .concat(this.back != null ? this.back.allPolygons() : []);
  }

  invert(): this {
    this.polygons.forEach((item) => item.invert());

    [this.divider, this.front, this.back].forEach((item) => {
      if (item != null) {
        item.invert();
      }
    });

    const _ref2 = [this.back, this.front];
    this.front = _ref2[0];
    this.back = _ref2[1];
    return this;
  }

  clipPolygons(polygons: Polygon[]): Polygon[] {
    let back: Polygon[] = [],
      front: Polygon[] = [];
    if (!this.divider) {
      return polygons.slice();
    }
    polygons.forEach((poly) =>
      this.divider!.subdivide(poly, front, back, front, back)
    );
    if (this.front) {
      front = this.front.clipPolygons(front);
    }
    if (this.back) {
      back = this.back.clipPolygons(back);
    }
    return front.concat(this.back ? back : []);
  }

  clipTo(node: Node): this {
    this.polygons = node.clipPolygons(this.polygons);
    if (this.front != null) {
      this.front.clipTo(node);
    }
    if (this.back != null) {
      this.back.clipTo(node);
    }
    return this;
  }
}

class Vertex {
  position: THREE.Vector3;
  normal: THREE.Vector3;
  uv: THREE.Vector2;

  constructor(p: THREE.Vector3, normal?: THREE.Vector3, uv?: THREE.Vector2) {
    this.position = p;
    this.normal = normal || new THREE.Vector3();
    this.uv = uv || new THREE.Vector2();
  }

  clone() {
    return new Vertex(
      this.position.clone(),
      this.normal.clone(),
      this.uv.clone()
    );
  }

  lerp(v: Vertex, alpha: number) {
    this.position.lerp(v.position, alpha);
    this.uv.add(v.uv.clone().sub(this.uv).multiplyScalar(alpha));
    this.normal.lerp(v.normal, alpha);
  }

  interpolate(v: Vertex, n: number): Vertex {
    const cloneVertex = this.clone();
    cloneVertex.lerp(v, n);
    return cloneVertex;
  }

  equals(vertex: Vertex): boolean {
    if (vertex) {
      if (
        this.position.x === vertex.position.x &&
        this.position.y === vertex.position.y &&
        this.position.z === vertex.position.z
      ) {
        const checkUv = function (uv1: THREE.Vector2, uv2: THREE.Vector2) {
          if (uv1 && uv2 && uv1.x === uv2.x && uv1.y === uv2.y) {
            return true;
          } else if (!uv1 && !uv2) {
            return true;
          }
          return false;
        };
        if (
          this.normal &&
          vertex.normal &&
          this.normal.x === vertex.normal.x &&
          this.normal.y === vertex.normal.y &&
          this.normal.z === vertex.normal.z
        ) {
          return checkUv(this.uv, vertex.uv);
        }
        if (!this.normal && !vertex.normal) {
          return checkUv(this.uv, vertex.uv);
        }
      }
    }
    return false;
  }
}

class Polygon {
  vertices: Vertex[];
  normal: THREE.Vector3;
  w: number;

  constructor(vertices?: Vertex[], normal?: THREE.Vector3, w?: number) {
    this.vertices = vertices || [];
    this.normal = normal ?? new THREE.Vector3();
    this.w = w ?? 0;
    if (this.vertices.length) {
      this.calculateProperties();
    }
  }

  calculateProperties() {
    const a = this.vertices[0],
      b = this.vertices[1],
      c = this.vertices[2];
    this.normal = b.position
      .clone()
      .sub(a.position)
      .cross(c.position.clone().sub(a.position))
      .normalize();
    this.w = this.normal.clone().dot(a.position);
    return this;
  }

  clone(): Polygon {
    return new Polygon(this.vertices.map((v) => v.clone()), this.normal.clone(), this.w);
  }

  invert() {
    this.normal.multiplyScalar(-1);
    this.w *= -1;
    this.vertices.reverse();
    return this;
  }

  classifyVertex(vertex: THREE.Vector3): number {
    const side = this.normal.dot(vertex) - this.w;
    switch (false) {
      case !(side < -EPSILON):
        return BACK;
      case !(side > EPSILON):
        return FRONT;
      default:
        return COPLANAR;
    }
  }

  classifySide(polygon: Polygon): number {
    let back = 0,
      front = 0;
    polygon.vertices.forEach((vertice) => {
      switch (this.classifyVertex(vertice.position)) {
        case FRONT:
          front += 1;
          break;
        case BACK:
          back += 1;
          break;
      }
    });

    if (front > 0 && back === 0) {
      return FRONT;
    }
    if (front === 0 && back > 0) {
      return BACK;
    }
    if (front === back && back === 0) {
      return COPLANAR;
    }
    return SPANNING;
  }

  tessellate(poly: Polygon): Polygon[] {
    if (this.classifySide(poly) !== SPANNING) {
      return [poly];
    }
    let frontVertices: Vertex[] = [],
      backVertices: Vertex[] = [],
      count = poly.vertices.length,
      t: number,
      ti: number,
      tj: number,
      v: Vertex,
      vi: Vertex,
      vj: Vertex;
    for (let i = 0, _len = poly.vertices.length; i < _len; i++) {
      vi = poly.vertices[i];
      vj = poly.vertices[(i + 1) % count];
      (ti = this.classifyVertex(vi.position)),
        (tj = this.classifyVertex(vj.position));
      if (ti !== BACK) {
        frontVertices.push(vi);
      }
      if (ti !== FRONT) {
        backVertices.push(vi);
      }
      if ((ti | tj) === SPANNING) {
        t =
          (this.w - this.normal.dot(vi.position)) /
          this.normal.dot(vj.position.clone().sub(vi.position));
        v = vi.interpolate(vj, t);
        frontVertices.push(v);
        backVertices.push(v);
      }
    }
    const polys: Polygon[] = [],
      frontLength = frontVertices.length,
      backLength = backVertices.length;
    if (frontLength >= 3) {
      polys.push(new Polygon(frontVertices.slice(0, 3)));
      if (frontLength > 3) {
        let newVertices;
        for (let start = 2; start < frontLength; start++) {
          newVertices = [
            frontVertices[start],
            frontVertices[(start + 1) % frontLength],
            frontVertices[(start + 2) % frontLength],
          ];
          polys.push(new Polygon(newVertices));
        }
      }
    }
    if (backLength >= 3) {
      polys.push(new Polygon(backVertices.slice(0, 3)));
      if (backLength > 3) {
        let newVertices;
        for (let start = 2; start < backLength - 1; start++) {
          newVertices = [
            backVertices[start],
            backVertices[(start + 1) % backLength],
            backVertices[(start + 2) % backLength],
          ];
          polys.push(new Polygon(newVertices));
        }
      }
    }
    return polys;
  }

  subdivide(
    polygon: Polygon,
    coplanar_front: Polygon[],
    coplanar_back: Polygon[],
    front: Polygon[],
    back: Polygon[]
  ): void {
    let poly,
      side,
      _ref = this.tessellate(polygon);
    for (let _i = 0, _len = _ref.length; _i < _len; _i++) {
      poly = _ref[_i];
      side = this.classifySide(poly);
      switch (side) {
        case FRONT:
          front.push(poly);
          break;
        case BACK:
          back.push(poly);
          break;
        case COPLANAR:
          if (this.normal.dot(poly.normal) > 0) {
            coplanar_front.push(poly);
          } else {
            coplanar_back.push(poly);
          }
          break;
        default:
          throw new Error(
            "BUG: Polygon of classification " + side + " in subdivision"
          );
      }
    }
  }
}

export class BSP {
  matrix: THREE.Matrix4;
  tree: Node;

  constructor(treeIsh: THREE.BufferGeometry | THREE.Mesh | Node, matrix?: THREE.Matrix4) {
    this.matrix = matrix || new THREE.Matrix4();
    this.tree = this.toTree(treeIsh);
  }

  private toTree(treeIsh: THREE.BufferGeometry | THREE.Mesh | Node): Node {
    if (treeIsh instanceof Node) {
      return treeIsh;
    }
    const polygons: Polygon[] = [];
    let geometry: THREE.BufferGeometry;
    if (treeIsh instanceof THREE.BufferGeometry) {
      geometry = treeIsh
    } else {
      treeIsh.updateMatrix();
      this.matrix = treeIsh.matrix.clone();
      geometry = treeIsh.geometry;
    }
    if (geometry && geometry.attributes) {
      const attributes = geometry.attributes, normal = attributes.normal, position = attributes.position, uv = attributes.uv;
      const pointsLength = attributes.position.array.length / attributes.position.itemSize;

      const normalMatrix = new THREE.Matrix3().getNormalMatrix( this.matrix );
      if (geometry.index) {
        const pointsArr: THREE.Vector3[] = [], normalsArr: THREE.Vector3[] = [], uvsArr: THREE.Vector2[] = [];
        for (let i = 0, len = pointsLength; i < len; i++) {
          const startIndex = 3 * i
          const p = new THREE.Vector3(position.array[startIndex], position.array[startIndex + 1], position.array[startIndex + 2])
          const n = new THREE.Vector3(normal.array[startIndex], normal.array[startIndex + 1], normal.array[startIndex + 2])
          p.applyMatrix4(this.matrix)
          n.applyNormalMatrix(normalMatrix)
          pointsArr.push(p);
          normalsArr.push(n);
          uvsArr.push(new THREE.Vector2(uv.array[2 * i], uv.array[2 * i + 1]));
        }
        const index = geometry.index.array;
        for (let i = 0, len = index.length; i < len;) {
          const polygon = new Polygon();
          for (let j = 0; j < 3; j++) {
            const pointIndex = index[i], point = pointsArr[pointIndex];
            let vertex = new Vertex(pointsArr[pointIndex], normalsArr[pointIndex], uvsArr[pointIndex]);
            polygon.vertices.push(vertex);
            i++;
          }
          polygons.push(polygon.calculateProperties());
        }
      } else {
        for (let i = 0, len = pointsLength; i < len;) {
          const polygon = new Polygon();
          for (let j = 0; j < 3; j++) {
            const startIndex = 3 * i
            const p = new THREE.Vector3(position.array[startIndex], position.array[startIndex + 1], position.array[startIndex + 2]);
            const n = new THREE.Vector3(normal.array[startIndex], normal.array[startIndex + 1], normal.array[startIndex + 2]);
            const u = new THREE.Vector2(uv.array[2 * i], uv.array[2 * i + 1])
            const vertex = new Vertex(p, n, u);
            vertex.position.applyMatrix4(this.matrix);
            vertex.normal.applyNormalMatrix(normalMatrix);
            polygon.vertices.push(vertex);
            i++;
          }
          polygons.push(polygon.calculateProperties());
        }
      }
    } else {
      console.error("初始化BSP时未获取到几何数据信息");
    }
    return new Node(polygons);
  }

  toMesh(material: THREE.TMaterial, groupByCoplanar: boolean, uniqueMaterial: boolean): THREE.Mesh {
    const geometry = this.toGeometry(groupByCoplanar, uniqueMaterial);
    if (material == null) {
      material = new THREE.MeshNormalMaterial();
    }
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  }

  toGeometry(groupByCoplanar: boolean, uniqueMaterial: boolean) {
    const geometry = new THREE.BufferGeometry();
    const matrix = this.matrix.clone().invert();
    const position: number[] = [], normal: number[] = [], uv: number[] = [], verticesArr: Vertex[] = [], index: number[] = [];
    const resolvePolygon = (polygon: Polygon) => {
      polygon.vertices.forEach(item => {
        const vertice = item.clone();
        vertice.position.applyMatrix4(matrix);
        let verticeIndex: number | null = null;
        for (let i = 0, len = verticesArr.length; i < len; i++) {
          if (vertice.equals(verticesArr[i])) {
            verticeIndex = i;
            break;
          }
        }
        if (verticeIndex == null) {
          verticeIndex = verticesArr.length;
          verticesArr.push(vertice);
          position.push(vertice.position.x);
          position.push(vertice.position.y);
          position.push(vertice.position.z);
          normal.push(vertice.normal.x);
          normal.push(vertice.normal.y);
          normal.push(vertice.normal.z);
          uv.push(vertice.uv.x);
          uv.push(vertice.uv.y);
        }
        index.push(verticeIndex);
      })
    };
    if (groupByCoplanar) {
      const polygonGroups: Polygon[][] = [], groups: any[] = [];
      this.tree.allPolygons().forEach(polygon => {
        let flag = false;
        for (let i = 0, len = polygonGroups.length; i < len; i++) {
          if (COPLANAR === polygon.classifySide(polygonGroups[i][0])) {
            polygonGroups[i].push(polygon);
            flag = true;
            break;
          }
        }
        if (!flag) {
          polygonGroups.push([polygon]);
        }
      });
      let start = 0;
      for (let i = 0, len = polygonGroups.length; i < len; i++) {
        const polygonGroup = polygonGroups[i], count = polygonGroup.length * 3;
        const groupItem: any = {
          start: start,
          count: count
        };
        if (uniqueMaterial) {
          groupItem.materialIndex = i;
        }
        polygonGroup.forEach(resolvePolygon);
        groups.push(groupItem);
        start = start + count;
      }
      geometry.groups = groups;
    } else {
      this.tree.allPolygons().forEach(resolvePolygon);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(Float32Array.from(position), 3, false));
    geometry.setAttribute('normal', new THREE.BufferAttribute(Float32Array.from(normal), 3, false));
    geometry.setAttribute('uv', new THREE.BufferAttribute(Float32Array.from(uv), 2, false));
    geometry.index = new THREE.Uint16BufferAttribute(new Uint16Array(index), 1, false);
    return geometry;
  }

  subtract(other: BSP) {
    const us = this.tree.clone(), them = other.tree.clone();
    us.invert().clipTo(them);
    them.clipTo(us).invert().clipTo(us).invert();
    return new BSP(us.build(them.allPolygons()).invert());
  };

  union(other: BSP) {
    const us = this.tree.clone(), them = other.tree.clone();
    us.clipTo(them);
    them.clipTo(us).invert().clipTo(us).invert();
    return new BSP(us.build(them.allPolygons()));
  };

  intersect(other: BSP) {
    const us = this.tree.clone(), them = other.tree.clone();
    them.clipTo(us.invert()).invert().clipTo(us.clipTo(them));
    return new BSP(us.build(them.allPolygons()).invert());
  };
}
