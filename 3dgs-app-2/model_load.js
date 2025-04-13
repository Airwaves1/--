// 更新模型缩放
function upsdateScale() {
    if (model) {
        const scaleValue = parseFloat(document.getElementById('scale').value);
        model.scale.set(scaleValue, scaleValue, scaleValue);
    }
}

// 更新模型旋转
function updateRostation() {
    if (model) {
        model.rotation.x = THREE.MathUtils.degToRad(parseFloat(document.getElementById('rot-x').value));
        model.rotation.y = THREE.MathUtils.degToRad(parseFloat(document.getElementById('rot-y').value));
        model.rotation.z = THREE.MathUtils.degToRad(parseFloat(document.getElementById('rot-z').value));
    }
}

// 更新材质颜色
function updateMsaterialColor() {
    if (model) {
        const color = document.getElementById('material-color').value;
        model.traverse((child) => {
            if (child.isMesh) {
                child.material.color.set(color);
            }
        });
    }
}

let poinst = false;
function togsglePointCloudMode(){
    point = !point;
    viewer.splatMesh.setPointCloudModeEnabled(point);
}


function updateSsplatScale(scaleValue) {
    console.log(scaleValue)
    const scale = parseFloat(scaleValue);

    viewer.splatMesh.setSplatScale(scaleValue)
}