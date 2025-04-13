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