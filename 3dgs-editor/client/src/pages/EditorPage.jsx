import React, { useEffect } from 'react';
import * as THREE from 'three';
import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';  // 引入GLTFLoader
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';  // 引入RGBELoader
import { Block, Text } from 'three-mesh-ui';

// 创建一个渲染器类
class Renderer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = new THREE.Scene();

        // 创建相机
        this.camera = new THREE.PerspectiveCamera(
            75, // 视野角度
            window.innerWidth / window.innerHeight, // 宽高比
            0.1, // 近裁剪面
            1000 // 远裁剪面
        );
        this.camera.position.z = 5;

        // 创建WebGL渲染器
        this.renderer = new THREE.WebGLRenderer({
            antialias: false,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight); // 设置渲染器大小为窗口大小
        this.container.appendChild(this.renderer.domElement);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.objects = [];

        this.viewer = new GaussianSplats3D.Viewer({
            threeScene: this.scene,
            renderer: this.renderer,
            camera: this.camera,
            selfDrivenMode: true,
            useBuiltInControls: true,
            antialiased: true,
            renderMode: GaussianSplats3D.RenderMode.OnChange,
            showLoadingUI: true,
        });

        // 加载Splat模型
        this.viewer.addSplatScene('/truck.ksplat', {
            splatAlphaRemovalThreshold: 5,
            position: [0, 0, 0],
            scale: [1.0, -1.0, 1.0],
            rotation: [0.0, 0.0, 0.0, 1.0],
        }).then(() => {
            this.viewer.start();
        });

        // 监听窗口大小变化
        window.addEventListener('resize', this.onResize.bind(this));

        // 初始化并启动动画
        this.animate();

        // 添加 three-mesh-ui 界面
        this.setupUI();
    }

    // 处理窗口大小变化
    onResize() {
        // 更新渲染器大小
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // 更新相机宽高比
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    // 添加物体到场景
    addObject(object) {
        this.objects.push(object);
        this.scene.add(object);
    }

    // 动画循环
    animate() {
        requestAnimationFrame(this.animate.bind(this));

        this.viewer.update();
        this.viewer.render();
    }

    // 销毁渲染器
    destroy() {
        this.container.removeChild(this.renderer.domElement);
    }

    // 设置 three-mesh-ui 界面
    setupUI() {
        // 创建一个块作为主面板
        const mainPanel = new Block({
            width: 2,
            height: 1.5,
            backgroundColor: new THREE.Color(0x333333),
            borderRadius: 0.05,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 0.05
        });
        mainPanel.position.set(0, 0, -2);
        this.scene.add(mainPanel);

        // 创建一个文本
        const titleText = new Text({
            content: '3DGS 编辑器',
            fontSize: 0.1,
            fontColor: new THREE.Color(0xffffff)
        });
        mainPanel.add(titleText);

        // 创建一个按钮
        // const actionButton = new Button({
        //     width: 0.8,
        //     height: 0.2,
        //     backgroundColor: new THREE.Color(0x0080ff),
        //     borderRadius: 0.03,
        //     justifyContent: 'center',
        //     alignItems: 'center'
        // });
        // actionButton.position.set(0, -0.3, 0);
        // const buttonText = new Text({
        //     content: '执行操作',
        //     fontSize: 0.08,
        //     fontColor: new THREE.Color(0xffffff)
        // });
        // actionButton.add(buttonText);
        // mainPanel.add(actionButton);

        // // 按钮点击事件
        // actionButton.onClick(() => {
        //     console.log('按钮被点击');
        // });
    }
}

export default function EditorPage() {
    useEffect(() => {
        // 创建渲染器实例
        const renderer = new Renderer('render-container');

        // 清理工作：组件卸载时销毁渲染器
        return () => {
            renderer.destroy();
        };
    }, []);

    return (
        <div
            id="render-container"
            style={{
                margin: 0,
                padding: 0,
                width: '100%',
                height: '100vh', // 确保容器高度为视口高度
                overflow: 'hidden', // 防止出现滚动条
            }}
        ></div>
    );
}    