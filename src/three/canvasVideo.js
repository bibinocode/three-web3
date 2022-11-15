import * as THREE from 'three'


export default class CanvasVideo {
  /**
   * 
   * @param {THREE.Scene} scene 世界场景
   * @param {string} text 绘制文本内容
   * @param {THREE.Vector3} position 
   * @param {THREE.Euler} euler 欧拉角 
   */
  constructor(scene, text = "hello world", position = new THREE.Vector3(0, 0, 0), euler = new THREE.Euler(0, 0, 0)) {
    this.text = text
    this.canvas = document.createElement("canvas")
    this.canvas.width = 1024
    this.canvas.height = 1024
    this.context = this.canvas.getContext("2d")
    // 创建图片作为绘制纹理
    this.video = document.createElement("video")
    this.video.src = "video/chatFrame.mp4"
    this.video.loop = true
    this.video.muted = true
    this.video.play()
    this.texture = new THREE.CanvasTexture(this.canvas)
    // 创建一个平面用来承载
    const planeGeometry = new THREE.PlaneGeometry(4, 4, 1, 1)
    this.planeMaterial = new THREE.MeshBasicMaterial({
      map: this.texture,
      alphaMap: this.texture,
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.mesh = new THREE.Mesh(planeGeometry, this.planeMaterial);
    this.mesh.position.copy(position)
    this.mesh.rotation.copy(euler)
    scene.add(this.mesh)
  }
  drawVideoText () {
    // 渲染器清空上一次
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    // 准备画笔
    this.context.drawImage(this.video, 0, 0, 1024, 1024)
    this.context.textAlign = "center"
    this.context.textBaseline = "middle"
    this.context.font = "bold 100px Arial"
    this.context.fillStyle = "rgba(0,255,255,1)"
    this.context.fillText(this.text, this.canvas.width / 2, this.canvas.height / 2)

    this.texture.needsUpdate = true
    this.planeMaterial.needsUpdate = true
  }
  update () {
    this.drawVideoText()
  }
}