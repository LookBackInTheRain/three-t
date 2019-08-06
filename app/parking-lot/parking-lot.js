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

function initAxesHelper() {

    let axes = new THREE.AxesHelper(3000);
    scene.add(axes);
    
}

// 控制器
function initController() {
    controller = new THREE.OrbitControls(camera, renderer.domElement)

}


// 初始化灯光
function initLight() {
    let light = new THREE.AmbientLight(0xFFFFFF);
    //directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
    scene.add(light);
}


function loadModel() {

    let loader = new THREE.GLTFLoader();
    loader.load("../../models/parking-lot.glb",
        (item) => {

            item.scene.traverse(function (child) {
                if (child.isMesh&&child.name==="instance_151111"){
                    objects.push(child)
                }
            })
            item.scene.scale.set(20, 20, 20);


            let box = new THREE.Box3();
            box.expandByObject(item.scene);

            let center = new THREE.Vector3();
            box.getCenter(center);


            item.scene.position.x = item.scene.position.x - center.x;
            //item.scene.position.y = item.scene.position.y - center.y;
            item.scene.position.z = item.scene.position.z - center.z;

            scene.add(item.scene);

        }, (progress) => {
                console.log(progress);
        }, (error) => {
                console.error(error);
        })

}


function initThree() {
    rayCaster = new THREE.Raycaster();
    vector2 = new THREE.Vector2();
    isClear = false;
    initScene();
    initCamera();
    initGridHelper();
    //initPlane();
    initRenderer();
    initController();
    initLight();
    loadModel();
    initAxesHelper();
   // window.addEventListener("mousemove", onMove, false);
    window.addEventListener("mousedown", onClick, false);
   // window.addEventListener("keydown", onKeyDown, false);
   // window.addEventListener("keyup", onKeyUp, false);
   // window.addEventListener("resize", onWindowResize, false);
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

        let geometry=intersect.object.geometry;
        console.log(geometry)


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
    renderer.setSize(window.innerWidth, window.innerHeight);
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
