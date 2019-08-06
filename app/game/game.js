let renderer,
    camera,
    scene,
    grid,
    controller,
    vector2,
    previewCube,
    rayCaster;


let objects = [];


let plane, brickGeometry, brickMaterial, isClear;


// 初始化场景
function initScene() {
    scene = new THREE.Scene();
}

// 初始化相机
function initCamera() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    // 相机位置
    camera.position.set(500, 800, 1300);
    // 相机看向的位置
    camera.lookAt(0, 0, 0);
}

// 初始化渲染器
function initRenderer() {
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xFFF0F5, 1.0);
    document.body.appendChild(renderer.domElement)
}

//绘制网格
function initGridHelper() {
    grid = new THREE.GridHelper(2000, 20);
    scene.add(grid)
}

// 绘制平面
function initPlane() {
    let geometry = new THREE.PlaneBufferGeometry(2000, 2000);

    geometry.rotateX(-Math.PI / 2);

    plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({visible: false}));
    scene.add(plane);
    objects.push(plane);
}

// 控制器
function initController() {
    controller = new THREE.OrbitControls(camera, renderer.domElement)

}

// 初始化可移动的立方体
function initPreviewCube() {
    let geometry = new THREE.BoxBufferGeometry(100, 100, 100);
    let material = new THREE.MeshBasicMaterial({color: 0x085820, opacity: 0.5, transparent: true});
    previewCube = new THREE.Mesh(geometry, material);
    scene.add(previewCube);
    console.log(previewCube);
}

// 初始化砖块
function initBrick() {
    brickGeometry = new THREE.BoxBufferGeometry(100, 100, 100);
    brickMaterial = new THREE.MeshLambertMaterial({
        color: 0xfeb74c,
        map: new THREE.TextureLoader().load("../../imgs/brick_bump-1.jpg")
    });
}

// 初始化灯光
function initLight() {
    let light = new THREE.AmbientLight(0xFFFFFF);
    //directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
    scene.add(light);
}


function initThree() {
    rayCaster = new THREE.Raycaster();
    vector2 = new THREE.Vector2();
    isClear = false;
    initScene();
    initCamera();
    initGridHelper();
    initPreviewCube();
    initPlane();
    initRenderer();
    initController();
    initBrick();
    initLight();
    window.addEventListener("mousemove", onMove, false);
    window.addEventListener("mousedown", onClick, false);
    window.addEventListener("keydown", onKeyDown, false);
    window.addEventListener("keyup", onKeyUp, false);
    window.addEventListener("resize", onWindowResize, false);
}


// 鼠标在场景上移动时
function onMove(event) {
    event.preventDefault();
    vector2.x = (event.clientX / window.innerWidth) * 2 - 1;
    vector2.y = -(event.clientY / window.innerHeight) * 2 + 1;
    rayCaster.setFromCamera(vector2, camera);
    let intersects = rayCaster.intersectObjects(objects);

    if (intersects.length > 0) {
        let intersect = intersects[0];
        previewCube.position.copy(intersect.point).add(intersect.face.normal);
        previewCube.position
            .divideScalar(100)
            .floor()
            .multiplyScalar(100)
            .addScalar(50);
    }

    //render();

}

// 点击事件
function onClick(event) {

    event.preventDefault();

    vector2.x = (event.clientX / window.innerWidth) * 2 - 1;
    vector2.y = -(event.clientY / window.innerHeight) * 2 + 1;

    rayCaster.setFromCamera(vector2, camera);

    let intersects = rayCaster.intersectObjects(objects);

    if (intersects.length > 0) {
        // 第一个与射线相交的几何体
        let intersect = intersects[0];

        if (isClear && intersect.object !== plane) {
            scene.remove(intersect.object);
            objects.splice(objects.indexOf(intersect.object), 1)
        } else {
            let brick = new THREE.Mesh(brickGeometry, brickMaterial);

            brick.position.copy(intersect.point).add(intersect.face.normal);
            brick.position.divideScalar(100)
                .floor()
                .multiplyScalar(100)
                .addScalar(50);

            scene.add(brick);
            objects.push(brick);
        }
    }

    //render();


}

function onKeyDown(event) {
    switch (event.keyCode) {
        case 16 :
            isClear = true;
            break;
    }
}

function onKeyUp(event) {
    switch (event.keyCode) {
        case 16 :
            isClear = false;
            break;
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}


function render() {
    requestAnimationFrame(render)
    renderer.render(scene, camera);
    controller.update()
}

function start() {
    initThree();
    render();
}
