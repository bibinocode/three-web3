import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { Clounds, CloundsPlus } from './clounds'
import Ocean from './ocean'
import Physics from './physics'
import VideoPlane from './videoPlane'
import LightCircle from './lightCircle'
import CanvasVideo from './canvasVideo'
import CanvasImage from './canvasImage'
import FireSprite from './fireSpeite'

export default class ThreePlus {
  constructor(selector) {
    this.domElement = document.querySelector(selector)
    this.scene = null
    this.camera = null
    this.width = this.domElement.clientWidth
    this.height = this.domElement.clientHeight
    this.mixers = null // 动画混合器
    // this.control = null
    this.effectComposer = null // 后期合成器管道
    this.renderer = null
    this.canvasVideoArr = []
    this.spriteArr = []
    this.clock = new THREE.Clock()
    this.init()
  }

  init () {
    console.log("THREE 初始化")
    this.initScene()
    this.initCamera()
    this.initRender()
    this.initControl()
    this.initAexs()
    this.initEffect()
    this.render()
    console.log(this.renderer.info)
  }
  initScene () {
    this.scene = new THREE.Scene()
  }
  initCamera () {
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.00001, 10000)
    this.camera.position.set(0, 10, 50)
    this.camera.aspect = this.width / this.height
    // 更新摄像机投影矩阵
    this.camera.updateProjectionMatrix()
  }
  initRender () {
    this.renderer = new THREE.WebGLRenderer({
      logarithmicDepthBuffer: true,
      antialias: true,
    })
    // 设置渲染器大小
    this.renderer.setSize(this.width, this.height)
    // 设置渲染器阴影开启
    this.renderer.shadowMap.enabled = true
    // 设置渲染器输出解码为srgb
    this.renderer.outputEncoding = THREE.sRGBEncoding
    // 使用正确物理光照
    this.renderer.physicallyCorrectLights = true
    // 设置投影模式为电影级别
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    // 曝光成都
    this.renderer.toneMappingExposure = 0.75
    // 设置对渲染器对象进行排序
    this.renderer.sortObjects = true
    this.domElement.appendChild(this.renderer.domElement)
  }
  initControl () {
    this.control = new OrbitControls(this.camera, this.renderer.domElement)
  }
  render () {
    const deltaTime = this.clock.getDelta()
    // 更新控制器
    // this.control && this.control.update()
    // 更新渲染器
    // this.renderer.render(this.scene, this.camera)
    // 使用后期合成器渲染
    if (this.physics) {
      this.physics.update(deltaTime)
    }
    // canvas视频集合更新
    if (this.canvasVideoArr.length > 0) {
      for (let i = 0; i < this.canvasVideoArr.length; i++) {
        this.canvasVideoArr[i].update()
      }
    }
    if (this.spriteArr.length > 0) {
      for (let i = 0; i < this.spriteArr.length; i++) {
        this.spriteArr[i].update(deltaTime)
      }
    }
    this.effectComposer.render()
    // 请求帧
    requestAnimationFrame(this.render.bind(this))
  }
  gltLoder (path) {
    const gltloader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    // 设置解压器路径
    dracoLoader.setDecoderPath('./draco/gltf/')
    dracoLoader.setDecoderConfig({ type: "js" })
    // 重载解压器
    dracoLoader.preload()
    gltloader.setDRACOLoader(dracoLoader)
    return new Promise((resolve, reject) => {
      gltloader.load(path, gltf => {
        resolve(gltf)
      })
    })
  }
  hdrLoader (path) {
    const rgbLoader = new RGBELoader()
    return new Promise((resolve, reject) => {
      rgbLoader.load(path, hdr => {
        resolve(hdr)
      })
    })
  }
  setBg (path) {
    this.hdrLoader(path).then(texture => {
      // 将纹理映射模式改为圆柱形
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.anisotropy = 16 // 设置纹理清晰度
      texture.format = THREE.RGBAFormat // 设置纹理格式为rgb
      this.scene.background = texture // 设置场景背景
      this.scene.environment = texture // 设置默认环境纹理
    })
  }
  setLight () {
    // 环境光
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
    this.scene.add(this.ambientLight)
    // 平行光
    const light1 = new THREE.DirectionalLight(0xffffff, 0.1);
    light1.position.set(0, 10, 10);
    const light2 = new THREE.DirectionalLight(0xffffff, 0.1);
    light2.position.set(0, 10, -10);
    const light3 = new THREE.DirectionalLight(0xffffff, 0.6);
    light3.position.set(10, 10, 10);
    light1.castShadow = true;
    light2.castShadow = true;
    light3.castShadow = true;
    light1.shadow.mapSize.width = 10240;
    light1.shadow.mapSize.height = 10240;
    light2.shadow.mapSize.width = 10240;
    light2.shadow.mapSize.height = 10240;
    light3.shadow.mapSize.width = 10240;
    light3.shadow.mapSize.height = 10240;
    this.scene.add(light1, light2, light3);
  }
  initEffect () {
    // 后期合成器
    this.effectComposer = new EffectComposer(this.renderer)
    this.effectComposer.setSize(this.width, this.height)
    // 渲染通道
    const renderPass = new RenderPass(this.scene, this.camera)
    this.effectComposer.addPass(renderPass)
  }
  initAexs () {
    const axes = new THREE.AxesHelper(5)
    this.scene.add(axes)
  }
  addClound () {
    const clounds = new Clounds()
    this.scene.add(clounds.mesh)
  }
  addCloundPlus () {
    const clounds = new CloundsPlus()
    this.scene.add(clounds.mesh)
  }
  addOcean () {
    const ocean = new Ocean()
    this.scene.add(ocean.mesh)
  }
  addPhysics (checkGroup) {
    this.physics = new Physics(checkGroup, this.camera, this.scene)
    return this.physics;
  }
  addVideoPlane (videoSrc, size, position) {
    const videoPlane = new VideoPlane(videoSrc, size, position)
    this.scene.add(videoPlane.mesh)
    return videoPlane
  }
  addLightCircle (position, scale) {
    const lightcircle = new LightCircle(this.scene, position, scale)
    return lightcircle
  }
  addCanvasImage (text, position, euler) {
    this.canvasImage = new CanvasImage(this.scene, text, position, euler)
    return this.canvasImage
  }
  addCanvasVideo (text, position, euler) {
    const canvasVideo = new CanvasVideo(this.scene, text, position, euler)
    this.canvasVideoArr.push(canvasVideo)
    return canvasVideo
  }
  addFireSprite () {
    const sprite = new FireSprite(this.camera)
    this.scene.add(sprite.mesh)
    return sprite
  }
}