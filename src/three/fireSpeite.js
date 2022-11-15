import * as THREE from 'three'
import { PositionalAudioHelper } from "three/examples/jsm/helpers/PositionalAudioHelper.js";
import fragmentShader from './shader/fireSprite/fragmentShader.glsl'
export default class {
  constructor(camera, position = new THREE.Vector3(-4.9, 1.8, 25.1), scale = 1) {
    this.camera = camera
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        rotation: {
          value: 0
        },
        center: {
          value: new THREE.Vector2(0.5, 0.5)
        },
        iTime: {
          value: 0
        },
        iResolution: {
          value: new THREE.Vector2(1000, 1000)
        },
        iMouse: {
          value: new THREE.Vector2(0, 0)
        },
        uFrequency: {
          value: 0
        }
      },
      vertexShader: `
        uniform float rotation;
        uniform vec2 center;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
          vec2 scale;
          scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
          scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
          // 因为我们默认就是透视相机,所以这里将条件判断去掉
          scale *= - mvPosition.z;
          // 视图位置 / - mvPosition.z
          vec2 alignedPosition = -( position.xy - ( center - vec2( 0.5 ) ) ) * scale / mvPosition.z ;
          vec2 rotatedPosition;
          rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
          rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
          mvPosition.xy += rotatedPosition;
          gl_Position = projectionMatrix * mvPosition;
          gl_Position.z = -5.0;
        }`,
      fragmentShader: fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    // this.material = new THREE.SpriteMaterial({
    //   map: new THREE.TextureLoader().load("textures/effect/ke123.png"),
    //   transparent: true,
    //   side: THREE.DoubleSide,
    //   blending: THREE.AdditiveBlending,
    //   depthWrite: false,
    // })
    // this.material.onBeforeCompile = (shader) => {
    //   console.log(shader.fragmentShader)
    // }
    this.mesh = new THREE.Sprite(this.material)
    this.mesh.renderOeder = 1
    this.mesh.position.copy(position)
    this.mesh.scale.set(scale, scale, scale)

    // 添加音频
    this.listener = new THREE.AudioListener(); // 声音监听器
    this.sound = new THREE.PositionalAudio(this.listener); // 声音源
    this.audioLoader = new THREE.AudioLoader();
    this.audioLoader.load("./audio/gnzw.mp3", (buffer) => {
      this.sound.setBuffer(buffer);
      this.sound.setRefDistance(10); // 这个衰减在这里没有用，因为我们的监听器绑定在我们的人物笑相机上，所以我们需要自己计算
      this.sound.setLoop(true);
      this.sound.setVolume(0.5);
      this.sound.play();
    });
    const helper = new PositionalAudioHelper(this.sound, 10);
    this.sound.add(helper);
    this.mesh.add(this.sound);

    // 律动
    this.analyser = new THREE.AudioAnalyser(this.sound, 32);
  }
  update (time) {
    // 将相机的位置转换为世界位置
    const position = this.camera.localToWorld(new THREE.Vector3(0, 0, 0));
    console.log(position)
    // 通过世界位置计算出衰减距离
    const distanceSquared = position.distanceToSquared(this.mesh.position);
    this.sound.setVolume((1 / distanceSquared) * 200);
    // 获取律动信息
    let frequency = this.analyser.getAverageFrequency();
    this.spriteMaterial.uniforms.uFrequency.value = frequency;
    this.material.uniforms.iTime.value += time
  }
}