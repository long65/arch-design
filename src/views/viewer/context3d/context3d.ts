import * as THREE from 'three'
import { Environment } from './environment'
import { GraphicContext } from './graphicContext'
import { Controller } from './controller'

export class Context3d {
  rootElement: HTMLElement
  renderer: THREE.WebGLRenderer
  env: Environment
  gtx: GraphicContext

  enableRendering: boolean
  controller: Controller

  constructor() {
    this.env = new Environment()
    this.gtx = new GraphicContext(this)
  }

  init(opts: any) {
    this.rootElement = opts.rootElement
    this.enableRendering = true

    this.renderer = new THREE.WebGLRenderer({
      antialias: true, //是否执行抗锯齿
      logarithmicDepthBuffer: true
    })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setClearColor(0x000000)
    this.renderer.setSize(this.rootElement.clientWidth, this.rootElement.clientHeight)
    this.rootElement.appendChild(this.renderer.domElement)

    this.controller = new Controller(this)
    this.renderer.setAnimationLoop(this.animate)
  }

  private animate = () => {
    if (this.enableRendering) {
      this.controller.update()
      this.renderer.render(this.env.scene, this.controller.camera)
    }
  }
  
  resize = () => {
    const width = this.rootElement.clientWidth
    const height = this.rootElement.clientHeight
    this.controller.resize(width, height)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(width, height)
  }

  dispose() {
    this.renderer.setAnimationLoop(null)
    this.controller.dispose()
    this.env.dispose()
    this.renderer.dispose()
    THREE.Cache.clear()
    window.removeEventListener('resize', this.resize)
    this.rootElement.innerHTML = ''
  }
}