let renderer,
    width,
    height,
    container;

function initThree() {
    container = document.getElementById('canvas-frame');
    width = container.clientWidth;
    height = container.clientHeight;
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);
    renderer.setClearColor(0xFFF0F5, 1.0);
}

let camera;

function initCamera() {
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
    camera.position.set(700,200,700)

    /*camera.up.x = 0;
    camera.up.y = 0;
    camera.up.z = 1;*/

    console.log(camera);

    camera.lookAt(0, 0, 0);
}

let scene;

function initScene() {
    scene = new THREE.Scene();
}

let light;

function initLight() {
    light = new THREE.AmbientLight(0x404040);
    // light.position.set(100, 100, 200);
    scene.add(light);
}

// 初始化坐标系以及 网格
function initLine() {

    let geometry = new THREE.Geometry();

    // 线的材质可以由2点的颜色决定
    let p1 = new THREE.Vector3(-500, 0, 0);
    let p2 = new THREE.Vector3(500, 0, 0);
    geometry.vertices.push(p1);
    geometry.vertices.push(p2);

    for (let i = 0; i <= 20; i++) {

        if (i === 10) {
            continue
        }
        let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
            color: 0x000000,
            opacity: 0.2
        }), THREE.LineSegments);
        line.position.z = (i * 50) - 500;
        scene.add(line);

        let line1 = new THREE.Line(geometry, new THREE.LineBasicMaterial({
            color: 0x000000,
            opacity: 0.2
        }), THREE.LineSegments);
        line1.position.x = (i * 50) - 500;
        line1.rotation.y = Math.PI / 2;
        scene.add(line1);


    }


    let geometry_x = new THREE.Geometry();


    let point_1 = new THREE.Vector3(-700, 0, 0);
    let point_2 = new THREE.Vector3(700, 0, 0);

    geometry_x.vertices.push(point_1, point_2)


    let x = new THREE.Line(geometry_x, new THREE.LineBasicMaterial({color: 0xFD7A3C}), THREE.LineSegments);
    let y = new THREE.Line(geometry_x, new THREE.LineBasicMaterial({color: 0x0079D7}), THREE.LineSegments)
    y.rotation.y = Math.PI / 2
    let z = new THREE.Line(geometry_x, new THREE.LineBasicMaterial({color: 0x7A297B}), THREE.LineSegments)
    z.rotation.z = Math.PI / 2


    scene.add(x);
    scene.add(y);
    scene.add(z);


}

// 初始化立体几何
function initCube() {
    let geometry = new THREE.BoxBufferGeometry(60, 60, 60);
    let material = new THREE.MeshNormalMaterial()
    let cube = new THREE.Mesh(geometry, material);

    cube.position.x = 200;
    cube.position.y = 200;
    cube.position.z = 200;

    scene.add(cube);


}

// 性能监视
let stats;

function initStats() {
    stats = new Stats();

    stats.setMode(0);

    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '20px';
    stats.domElement.style.top = '20px';


    //stats.domElement.className = 'statsClass';

    container.appendChild(stats.domElement);

}

function loadGLB() {

    let loader = new THREE.GLTFLoader();
    loader.load('../../models/cs_1.glb',
        function (data) {

            data.scene.traverse(function (child) {
                if (child instanceof THREE.Mesh){
                        child.addEventListener("on")
                } 
            })

            data.scene.scale.set(100,100,100)
            data.scene.position.set(100,50,100)
            scene.add(data.scene)
        }, function (pre) {

        }, function (error) {
            console.error(error)
        });
}

function onMove() {
    
}


function initController() {
    let controller = new THREE.OrbitControls(camera,renderer.document)

}

function render() {
    stats.update()
    requestAnimationFrame(render)
    scene.rotation.y += 0.002
    renderer.render(scene, camera);

}

function threeStart() {

    initThree();
    initStats();
    initCamera();
    initScene();
    initLight();
    initLine();
    initCube();
    loadGLB();
    initController();

    render();

}
