import * as THREE from 'three'
import { Water } from 'three/examples/jsm/objects/Water2'


export default class Ocean {
  constructor(radius = 1000) {
    const geometry = new THREE.CircleGeometry(radius, 128)
    const water = new Water(geometry, {
      textureWidth: 1024, // 分段
      textureHeight: 1024,
      color: 0x08dbea,
      flowDirection: new THREE.Vector2(1, 1),
      scale: 100,
    })
    water.position.y = -5
    water.rotation.x = -Math.PI / 2
    this.mesh = water
    water.renderOrder = -1 // 渲染顺序
    // hooks材质，修改渐变效果
    // console.log(water.material.fragmentShader)
    water.material.fragmentShader = water.material.fragmentShader.replace("gl_FragColor = vec4( color, 1.0 ) * mix( refractColor, reflectColor, reflectance );", `
      gl_FragColor = vec4( color, 1.0 ) * mix( refractColor, reflectColor, reflectance );
      // mix混合gl_FragColor ,然后渐变通过眼睛视角也就是世界坐标z轴的位置来混合
      gl_FragColor = mix(gl_FragColor,vec4(0.05,0.3,0.7,1.0),vToEye.z * 0.0005 + 0.5);
    `)
  }
}