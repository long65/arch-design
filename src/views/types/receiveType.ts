import { LineSegment2 } from "@/math/lineSegment2"

export interface PolygonNode {
  edge_type: string
  coordinates: [number, number][]
  pixel_coordinates: [number, number][]
  edge_params?: any[]
  struct_params?: {
    thickness_delta: number
    height_delta: number
    z_position: number
  }
  attachId?: number
  curve2d?: LineSegment2
  attrs?: any
}

export interface SpaceNode {
  space_type: string
  furniture_list: any[]
  id: string
  struct_polygon: PolygonNode[]
}