import * as THREE from 'three'

export default class CanvasImage {
  constructor(scene, text = "hello world", position = new THREE.Vector3(0, 0, 0), euler = new THREE.Euler(0, 0, 0)) {
    const canvas = document.createElement("canvas")
    canvas.width = 1024
    canvas.height = 1024
    const context = canvas.getContext("2d")
    const image = new Image()
    image.src = 'texture/frame/frame2.png'
    image.onload = () => {
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      context.textAlign = "center"
      context.textBaseline = "middle"
      context.font = "bold 100px Arial"
      context.fillStyle = "rgba(0,255,255,1)"
      context.fillText(text, 0, 0, canvas.width / 2, canvas.height / 2)
      const texture = THREE.CanvasTexture(canvas)

      const geometry = new THREE.PlaneGeometry(2, 2, 1, 1)
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        alphaMap: texture,
        color: 0xffffff,
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
      this.mesh = new THREE.Mesh(geometry, material)
      this.mesh.position.copy(position)
      this.mesh.rotation.copy(euler)
      scene.add(this.mesh)
    }
  }
}