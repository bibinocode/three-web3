import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
export default class LightCircle {
  constructor(scene, position = new THREE.Vector3(0, 0, 0), scale = 1) {
    this.video = document.createElement("video")
    this.video.src = "/video/zp2.mp4"
    this.video.muted = true
    this.video.loop = true
    this.video.play()
    const texture = new THREE.VideoTexture(this.video)
    // 因为视频不是一个圆，而是一个长方体 16:9的比例，所以映射会压扁，我们可以自己裁剪变换
    texture.repeat.set(9 / 16, 1)
    texture.offset.set((1 - 9 / 16) / 2, 0) //重复后让其居中
    this.gltfLoader("model/lightCircle.glb").then(gltf => {
      this.mesh = gltf.scene.children[0]
      this.mesh.material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        blending: THREE.AdditiveBlending,
        map: texture,
        alphaMap: texture,
        depthWrite: false
      })
      this.mesh.position.copy(position)
      this.mesh.scale.set(scale, scale, scale)
      scene.add(this.mesh)
    })
  }
  gltfLoader (url) {
    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("./draco/gltf/");
    dracoLoader.setDecoderConfig({ type: "js" });
    dracoLoader.preload();
    gltfLoader.setDRACOLoader(dracoLoader);

    return new Promise((resolve, reject) => {
      gltfLoader.load(url, (gltf) => {
        resolve(gltf);
      });
    });
  }
}