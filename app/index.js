// 场景
let scene;
// 相机
let camera;
// 渲染器
let renderer;
// 立方体
let cube;

function initScene() {
    scene = new THREE.Scene();
}

function initCamera() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
}

function initRenderer() {
    renderer = new THREE.WebGLRenderer();
    // 渲染大小设置、高度，宽度
    renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
// 向容器中添加渲染器标签
    document.body.appendChild(renderer.domElement)
}



function initCube() {
    let geometry = new THREE.CubeGeometry(1, 1, 1);
    let material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    camera.position.z = 8;
}

function render() {
    requestAnimationFrame(render);
    cube.rotation.x += 0.1;
    cube.rotation.y += 0.1;
    renderer.render(scene, camera);
}

function startThree() {

    initScene();
    initCamera();
    initRenderer();
    initCube();
    render();

}

startThree();