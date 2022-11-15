<template>
  <div class="home" ref="screenDom">
    <div class="canvas-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ThreePlus from '../three/index'
import eventHub from '../utils/envHub'
import * as THREE from 'three'
let screenDom = ref(null)
const resizeFn = () => {
  const scale = window.innerWidth / 1920
  screenDom.value.style.transform = `scale(${scale})`
}


onMounted(() => {
  resizeFn()
  window.addEventListener("resize", resizeFn)
})

onMounted(() => {
  const container = document.querySelector(".canvas-container")
  const threePlus = new ThreePlus(".canvas-container")
  threePlus.setBg("/assets/textures/sky11.hdr")

  // 添加云朵
  // threePlus.addClound()
  // 点积云
  threePlus.addCloundPlus()
  // 海洋
  threePlus.addOcean()
  // 防止重复添加音乐
  let spriteAudio = null
  // 加载场景
  threePlus.gltLoder("/model/metaScene03.glb").then(gltf => {
    // console.log(gltf);

    let planeGroup = new THREE.Group();
    planeGroup.position.copy(gltf.scene.children[0].position);
    gltf.scene.add(planeGroup);
    gltf.scene.traverse((child) => {
      if (
        child.isMesh &&
        child.material &&
        child.material.name.indexOf("KB3D_DLA_ConcreteRiverRock") != -1
      ) {
        // console.log("地面", child);
        // child.material.color.set(0xffffff);
        // child.material.map = null;
        planeGroup.add(child.clone());
        child.visible = false;
      }
      if (
        child.isMesh &&
        child.material &&
        child.material.name.indexOf("KB3D_DLA_ConcreteScreedTan") != -1
      ) {
        // console.log("墙", child);
        planeGroup.add(child.clone());
        child.visible = false;
      }
      if (
        child.isMesh &&
        child.material &&
        child.material.name.indexOf("KB3D_DLA_ConcretePittedGrayLight") != -1
      ) {
        // console.log("光墙", child);
        planeGroup.add(child.clone());
        child.visible = false;
      }
    });
    threePlus.addPhysics(planeGroup);
    threePlus.scene.add(gltf.scene);
    // 添加视频纹理
    // const videoPlane = threePlus.addVideoPlane("video/6.mp4", new THREE.Vector2(3, 3), new THREE.Vector3(1.5, 0.2, 2))
    // videoPlane.mesh.rotation.x = -Math.PI / 2
    //  const光阵位置 
    const lightCirclePosition = new THREE.Vector3(-3, -0.3, 15);
    // 添加立体光阵
    const lightcircle = threePlus.addLightCircle(lightCirclePosition)
    // 监听是否进入光阵
    threePlus.physics.onPosition(lightCirclePosition, () => {
      console.log("进入光圈")
      lightcircle.mesh.visible = false
      // 聊天框位置
      const canvasPlanePosition = new THREE.Vector3(-3, 1.3, 18)
      // 欧拉角旋转角度
      const canvasRotation = new THREE.Euler(0, Math.PI, 0);
      threePlus.addCanvasVideo("恭喜您到达指定位置", canvasPlanePosition, canvasRotation)
      // 防止添加音频
      spriteAudio || (spriteAudio = threePlus.addFireSprite())
    }, () => {
      console.log("离开光圈")
      lightcircle.mesh.visible = true
    })

  })
  // 添加灯光
  threePlus.setLight()
})


</script>

<style lang="scss">
.home {
  width: 1920px;
  height: 1080px;
  transform-origin: 0 0;
}

.canvas-container {
  width: 100%;
  height: 100%;
}
</style>