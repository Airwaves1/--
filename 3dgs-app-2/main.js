import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';  // 引入GLTFLoader
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';  // 引入RGBELoader

// 事件监听
document.getElementById('pos-x').addEventListener('input', updatePosition);
document.getElementById('pos-y').addEventListener('input', updatePosition);
document.getElementById('pos-z').addEventListener('input', updatePosition);
document.getElementById('scale').addEventListener('input', updateScale);
document.getElementById('rot-x').addEventListener('input', updateRotation);
document.getElementById('rot-y').addEventListener('input', updateRotation);
document.getElementById('rot-z').addEventListener('input', updateRotation);
document.getElementById('material-color').addEventListener('input', updateMaterialColor);
document.getElementById('toggle-pointcloud').addEventListener('click', togglePointCloudMode);
document.getElementById('splat-scale').addEventListener('input', (e) => updateSplatScale(e.target.value));


// 创建渲染容器
const renderContainer = document.getElementById('render-container');
const containerWidth = renderContainer.clientWidth;
const containerHeight = renderContainer.clientHeight;

// 初始化Three.js渲染器
const renderer = new THREE.WebGLRenderer({
    antialias: false,
    alpha: true
});
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(containerWidth, containerHeight);
renderContainer.appendChild(renderer.domElement);

const mainScene = new THREE.Scene();
let model;
let animateModel;
let mixer;

// 创建相机系统
const camera = new THREE.PerspectiveCamera(65, containerWidth / containerHeight, 0.1, 500);
camera.position.set(-1, -4, 6);
camera.up.set(0.0, -1, -0.0).normalize();
camera.lookAt(0, 4, 0);


// 初始化GaussianSplats Viewer
const viewer = new GaussianSplats3D.Viewer({
    threeScene: mainScene,
    renderer: renderer,
    camera: camera,
    selfDrivenMode: true,
    useBuiltInControls: true,
    antialiased: true,
    renderMode: GaussianSplats3D.RenderMode.OnChange,
    useBuiltInControls: true,
    showLoadingUI: true,
});

// 响应式调整
window.addEventListener('resize', () => {
    const width = renderContainer.clientWidth;
    const height = renderContainer.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
});

window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        viewer.stop();
    }
});

function update() {
    requestAnimationFrame(update);
    if (mixer) mixer.update(0.016); // 更新动画
    viewer.update();
    viewer.render();
}

// 加载Splat模型
viewer.addSplatScene('/truck.ksplat', {
    splatAlphaRemovalThreshold: 5,
    position: [0, 1, 0],
    scale: [1.5, 1.5, 1.5],
}).then(() => {
    viewer.start();
    requestAnimationFrame(update);
});


// 太阳光
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 10, 0).normalize();
mainScene.add(directionalLight);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
mainScene.add(ambientLight);

// 加载HDR环境贴图
const rgbeLoader = new RGBELoader();
rgbeLoader.setDataType(THREE.HalfFloatType);  // 使用半浮点类型，适合HDR格式
rgbeLoader.load('test.hdr', (texture) => {
    texture.flipY = false;  // 设置为 false，修正反向的问题
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envMap = pmremGenerator.fromEquirectangular(texture).texture;

    const rotation = new THREE.Euler(0, Math.PI / 1.1, 0);  // 设置旋转角度

    // 设置场景的环境贴图
    mainScene.environment = envMap;  // 设置环境贴图
    mainScene.environmentIntensity = 0.8;  // 设置环境贴图强度
    mainScene.environmentRotation = rotation;  // 设置环境贴图的旋转角度
    mainScene.background = envMap;  // 设置场景背景为环境贴图
    mainScene.backgroundIntensity = 0.8;  // 设置背景强度
    mainScene.backgroundRotation = rotation;  // 设置背景的旋转角度

    texture.dispose();  // 释放不需要的纹理
});


// 加载GLB模型
const loader = new GLTFLoader();
loader.load('su7.glb', (gltf) => {
    model = gltf.scene;


    // 设置模型的旋转、缩放和位置
    model.rotation.set(0.15, 0, Math.PI);  // 设置模型的旋转
    model.scale.set(1.2, 1.2, 1.2);  // 设置模型的缩放
    model.position.set(3, 2.2, 4.5);  // 设置模型的位置

    // 将模型添加到场景中
    mainScene.add(model);
});

loader.load('man.glb', (gltf) => {
    animateModel = gltf.scene;

    // 设置模型的旋转、缩放和位置
    animateModel.rotation.set(0.15, 0, Math.PI);
    animateModel.scale.set(0.6, 0.6, 0.6);
    animateModel.position.set(-1.3, 2.6, 1.5);

    mainScene.add(animateModel);

    // ✅ 初始化动画系统
    if (gltf.animations && gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(animateModel);

        const firstAnimation = gltf.animations[0]; // 获取第一个动画
        const action = mixer.clipAction(firstAnimation);
        action.play();              // 播放动画
        action.setLoop(THREE.LoopRepeat); // 设置为循环播放
    }
});

// 加载模型动画

// 更新模型位置
function updatePosition() {
    console.log('Updating position...');
    if (model) {
        model.position.x = parseFloat(document.getElementById('pos-x').value);
        model.position.y = parseFloat(document.getElementById('pos-y').value);
        model.position.z = parseFloat(document.getElementById('pos-z').value);
    }
}

// 更新模型缩放
function updateScale() {
    if (model) {
        const scaleValue = parseFloat(document.getElementById('scale').value);
        model.scale.set(scaleValue, scaleValue, scaleValue);
    }
}

// 更新模型旋转
function updateRotation() {
    if (model) {
        model.rotation.x = THREE.MathUtils.degToRad(parseFloat(document.getElementById('rot-x').value));
        model.rotation.y = THREE.MathUtils.degToRad(parseFloat(document.getElementById('rot-y').value));
        model.rotation.z = THREE.MathUtils.degToRad(parseFloat(document.getElementById('rot-z').value));
    }
}

// 更新材质颜色
function updateMaterialColor() {
    if (model) {
        const color = document.getElementById('material-color').value;
        model.traverse((child) => {
            if (child.isMesh) {
                child.material.color.set(color);
            }
        });
    }
}

let point = false;
function togglePointCloudMode(){
    point = !point;
    viewer.splatMesh.setPointCloudModeEnabled(point);
}


function updateSplatScale(scaleValue) {
    console.log(scaleValue)
    const scale = parseFloat(scaleValue);

    viewer.splatMesh.setSplatScale(scaleValue)
}

//

function updatsePosition() {
    console.log('Updating position...');
    if (model) {
        model.position.x = parseFloat(document.getElementById('pos-x').value);
        model.position.y = parseFloat(document.getElementById('pos-y').value);
        model.position.z = parseFloat(document.getElementById('pos-z').value);
    }
}

