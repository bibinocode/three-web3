import * as THREE from 'three'
import gsap from 'gsap'
export class Clounds {
  /**
   * 
   * @param {number} num 生成数量
   * @param {number} size 大小
   * @param {number} height 高度
   * @param {number} scope 范围
   * @param {number} audtoRotate 自动旋转
   */
  constructor(num = 300, size = 15, height = 10, scope = 10, audtoRotate = true) {
    const textureLoader = new THREE.TextureLoader()
    const map1 = textureLoader.load('/textures/cloud/cloud1.jfif')
    const map2 = textureLoader.load('/textures/cloud/cloud2.jfif')
    const map3 = textureLoader.load('/textures/cloud/cloud3.jpg')

    const material1 = new THREE.SpriteMaterial({
      color: 0xffffff,
      map: map1,
      alphaMap: map2,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false, // 深度检测
      depthWrite: false
    })
    const material2 = new THREE.SpriteMaterial({
      color: 0xffffff,
      map: map2,
      alphaMap: map3,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false, // 深度检测
      depthWrite: false
    })
    const material3 = new THREE.SpriteMaterial({
      color: 0xffffff,
      map: map3,
      alphaMap: map1,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false, // 深度检测
      depthWrite: false
    })
    this.materials = [material1, material2, material3]
    this.mesh = new THREE.Group()
    for (let i = 0; i < num; i++) {
      // 随机材质
      const index = Math.floor(Math.random() * 3)
      // 遍历生成精灵物体往组内加
      const sprite = new THREE.Sprite(this.materials[index])
      // 随机精灵大小 用于缩放
      const randomSize = Math.random() * size
      sprite.scale.set(randomSize, randomSize, randomSize)
      // 随机精灵的位置，但是有一个固定的范围和固定的高度
      const randomX = (Math.random() - 0.5) * 2 * scope // -1 to +1 * 
      const randomY = Math.random() * (height / 2) + height // 0-1 * 高度的一半 + 高度
      const randomZ = (Math.random() - 0.5) * 2 * scope
      sprite.position.set(randomX, randomY, randomZ)
      this.mesh.add(sprite)
    }
    if (audtoRotate) {
      // 调用旋转动画
      this.animate()
    }
  }
  animate () {
    gsap.to(this.mesh.rotation, {
      duration: 60,
      repeat: -1,
      y: Math.PI / 2
    })
  }
}

// 粒子群点积云
export class CloundsPlus {
  constructor(num = 100, height = 20, size = 400, scope = 100, audtoRotate = true) {
    this.height = height
    this.scope = scope
    const textureLoader = new THREE.TextureLoader()
    const map1 = textureLoader.load('/textures/cloud/cloud1.jfif')
    const map2 = textureLoader.load('/textures/cloud/cloud2.jfif')
    const map3 = textureLoader.load('/textures/cloud/cloud3.jpg')
    const material1 = new THREE.PointsMaterial({
      color: 0xffffff,
      map: map1,
      alphaMap: map2,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false, // 深度检测
      depthWrite: false,
      size: 0.3 * size
    })
    const material2 = new THREE.PointsMaterial({
      color: 0xffffff,
      map: map2,
      alphaMap: map3,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false, // 深度检测
      depthWrite: false,
      size: 0.5 * size
    })
    const material3 = new THREE.PointsMaterial({
      color: 0xffffff,
      map: map3,
      alphaMap: map1,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false, // 深度检测
      depthWrite: false,
      size: 0.8 * size
    })
    const material4 = new THREE.PointsMaterial({
      color: 0xffffff,
      map: map2,
      alphaMap: map1,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false, // 深度检测
      depthWrite: false,
      size: 1 * size
    })

    const materials = [material1, material2, material3, material4]

    this.mesh = new THREE.Group()
    // 根据材质生成数量生成粒子群
    for (let i = 0; i < materials.length; i++) {
      const materila = materials[i]
      const geometry = this.generateGeometry(num)
      const points = new THREE.Points(geometry, materila)
      this.mesh.add(points)
    }
    if (audtoRotate) {
      this.animate()
    }
  }
  generateGeometry (num = 300) {
    const positions = []
    for (let i = 0; i < num; i++) {
      // 生成点位置
      const randomX = (Math.random() - 0.5) * 2 * this.scope
      const randomY = Math.random() * (this.height / 2) * this.height
      const randomZ = (Math.random() - 0.5) * 2 * this.scope
      positions.push(randomX, randomY, randomZ)
    }
    const geometery = new THREE.BufferGeometry()
    geometery.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))
    return geometery
  }
  animate () {
    let i = 1
    this.mesh.traverse((item) => {
      const steep = 40 * i
      if (item instanceof THREE.Points) {
        gsap.to(item.rotation, {
          duration: steep,
          repeat: -1,
          y: Math.PI / 2
        })
      }
    })
    i++
  }

}