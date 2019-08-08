
let renderer,
    camera,
    scene,
    grid,
    controller,
    vector2,
    previewCube,
    stats,
    axes,
    rayCaster;


let objects = [];


let plane, brickGeometry, brickMaterial, isClear;


let entrancePole, exitPole1, exitPole2;

let entranceStatus = false,
    exit1Status = false,
    statsStatus = true;
    exit2Status=false;

// 初始化场景
function initScene() {
    scene = new THREE.Scene();
}

// 初始化相机
function initCamera() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    // 相机位置
    camera.position.set(-1400, 800, 100);
    // 相机看向的位置
    camera.lookAt(0, 0, 0);
}

// 初始化渲染器
function initRenderer() {
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xFFFFFF, 1.0);
    document.body.appendChild(renderer.domElement)
}

//绘制网格
function initGridHelper() {
    grid = new THREE.GridHelper(2000, 20);
    scene.add(grid)
}

// 绘制平面
function initPlane() {
    let geometry = new THREE.PlaneBufferGeometry(40, 100);

    //geometry.rotateX(-Math.PI / 2);

    plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0x44000A, visible: true}));
    scene.add(plane);
    objects.push(plane);
}

function initAxesHelper() {

    axes = new THREE.AxesHelper(3000);
    scene.add(axes);

}

// 控制器
function initController() {
    controller = new THREE.OrbitControls(camera, renderer.domElement)

}


// 初始化灯光
function initLight() {
    let light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( 0, 1, 0 ).normalize();
    light.castShadow = true
    scene.add(light);
}


function loadModel() {

    let loader = new THREE.GLTFLoader();
    let loadContainer = document.getElementById("load-container");
    let loadProgress = document.getElementById("load");

    initThree();

    loader.load("../../models/t2.glb",
        (item) => {

            item.scene.traverse(function (child) {
                if (child.isMesh && child.name === "instance_151111") {
                    objects.push(child)
                }
            })

            item.scene.scale.set(18, 18, 18);

            let box = new THREE.Box3();
            box.expandByObject(item.scene);


            let center = new THREE.Vector3();
            box.getCenter(center);


            item.scene.position.x = item.scene.position.x - center.x;
            //item.scene.position.y = item.scene.position.y - center.y;
            item.scene.position.z = item.scene.position.z - center.z;

            scene.add(item.scene);

            loadContainer.style.display = 'none';

            render();

        }, (progress) => {

            let progressValue = Math.floor(progress.loaded/progress.total*100);
            loadProgress.style.width = progressValue + "%";
        }, (error) => {
            console.error(error);
        })

}


function initPole() {
    let geometry = new THREE.CylinderBufferGeometry(2, 2, 150, 1000);
    let material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: new THREE.TextureLoader().load("../../imgs/pole.jpg")
    });

    entrancePole = new THREE.Mesh(geometry, material);
    exitPole1 = new THREE.Mesh(geometry, material);
    exitPole2 = new THREE.Mesh(geometry, material);

    entrancePole.position.set(-570, 30, 650);
    entrancePole.rotateX(Math.PI / 2);
    scene.add(entrancePole);

    exitPole1.position.set(540, 30, 766);
    exitPole1.rotateZ(Math.PI / 2);
    scene.add(exitPole1);

    exitPole2.position.set(-595, 30, -645);
    exitPole2.rotateX(Math.PI / 2);
    scene.add(exitPole2);

}

function initStats() {
    stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.right = '20px';
    //stats.domElement.style.top = '20px';
    stats.domElement.className = 'statsClass';
    document.getElementById("stats-container").appendChild(stats.domElement);

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
    initAxesHelper();
    initPole();
    initStats();
    // window.addEventListener("mousemove", onMove, false);
    window.addEventListener("mousedown", onClick, false);
    // window.addEventListener("keydown", onKeyDown, false);
    // window.addEventListener("keyup", onKeyUp, false);
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

        let material = intersect.object.material;

        //material.color.set(0xFA0000);

        console.log(material)


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


function entrancePoint() {

    new TWEEN.Tween(camera.position)
        .to({x: -1400, y: 400, z: 800}, 4000).start();

}

function exitPoint1() {
    new TWEEN.Tween(camera.position)
        .to({x: 800, y: 500, z: 1400}, 4000).start();
}


 function exitPoint2() {
    new TWEEN.Tween(camera.position)
        .to({x: -1400, y: 500, z: -800}, 4000).start();
}


function entranceChangeStatus() {

    const  doc=document.getElementById("entrance");

    if (!entranceStatus){
        entrancePole.position.set(-570,100,580);
        entrancePole.rotateX(-Math.PI/2);
        doc.textContent = "(关闭)";
    }else {
        entrancePole.position.set(-570,30,650);
        entrancePole.rotateX(Math.PI/2);
        doc.textContent = "(开启)";
    }

    entranceStatus = !entranceStatus;
}

function exit1ChangeStatus() {

    const  doc=document.getElementById("exit1");

    if (!exit1Status){
        exitPole1.position.set(487,100,766);
        exitPole1.rotateZ(-Math.PI/2);
        doc.textContent = "(关闭)";
    }else {
        exitPole1.position.set(540, 30, 766);
        exitPole1.rotateZ(Math.PI / 2);
        doc.textContent = "(开启)";
    }
    exit1Status =!exit1Status;
}

function exit2ChangeStatus() {

    const  doc=document.getElementById("exit2");

    if (!exit2Status){
        exitPole2.position.set(-594,100,-708);
        exitPole2.rotateX(-Math.PI/2);
        doc.textContent = "(关闭)"
    }else {
        exitPole2.position.set(-595, 30, -645);
        exitPole2.rotateX(Math.PI / 2);
        doc.textContent = "(开启)"
    }

    exit2Status = !exit2Status;

}

function gridHelperStatus() {
    grid.visible = !grid.visible;
}

function axesHelperStatus() {
    axes.visible = !axes.visible
}

function statsHelperStatus() {
    const container = document.getElementById('stats-container');
    if (statsStatus){
        container.style.display = 'none';
    }else {
        container.style.display = "block";
    }

    statsStatus = ! statsStatus;
}


 function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    controller.update();
    TWEEN.update();
    stats.update();
}


