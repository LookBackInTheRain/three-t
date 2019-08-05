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
    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement);
    renderer.setClearColor(0xFFF0F5, 1.0);
}

let camera;

function initCamera() {
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
    camera.position.set(700, 200, 700)
    camera.lookAt(scene.position);
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
            opacity: 0.2,
            linewidth: 0.1
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

    cube.addEventListener("mousedown", (event) => {
        console.log(event)
    })


}

function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( container.clientWidth,container.clientHeight );
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
                if (child instanceof THREE.Mesh) {
                    child.addEventListener("on")
                }
            })

            data.scene.scale.set(100, 100, 100)
            data.scene.position.set(100, 50, 100)
            scene.add(data.scene)
        }, function (pre) {

        }, function (error) {
            console.error(error)
        });
}

let rayCaster;
let vector2 ;

function onClick() {

    rayCaster = new THREE.Raycaster();
    vector2 = new THREE.Vector2();

    rayCaster.linePrecision = 3;

    container.addEventListener("click", (event) => {

        event.preventDefault();

        console.log(camera.position)


        vector2.x = (event.clientX / container.clientWidth) * 2 - 1;
        vector2.y = -(event.clientY / container.clientHeight) * 2 + 1;

        rayCaster.setFromCamera(vector2, camera);

        let intersects = rayCaster.intersectObjects(scene.children);

        console.log(intersects);

        for (let i = 0; i < intersects.length; i++) {
            let obj = intersects[i].object;
            if (obj instanceof THREE.Line) {
                console.log("line:", obj)
                obj.material.color.set(0xF50D2A);
                break
            }

            if (obj instanceof THREE.Mesh) {
                console.log("mesh", obj)
                break
            }

            console.log("other",obj)



        }

        console.log(vector2)


    }, false)


}


function onMove() {

    container.addEventListener("click",(event=>{


        let vector2 = new THREE.Vector2();
        let rayCaster = new THREE.Raycaster();

        vector2.x = (event.clientX/container.innerWidth) * 2 - 1;
        vector2.y  = - (event.clientY/container.innerHeight) * +1;

        rayCaster.setFromCamera(vector2,camera);

        let geometry  = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3());
        let pointMaterial = new THREE.PointsMaterial({color:0xF5425E,size:2});
        let point  = new THREE.Points(geometry)



    }))

}



function initController() {
    let controller = new THREE.OrbitControls(camera,container)
}

function render() {
    stats.update()

    requestAnimationFrame(render)
    //scene.rotation.y += 0.002
    renderer.render(scene, camera);

    rayCaster.setFromCamera(vector2, camera);

    camera.updateProjectionMatrix();

}


function threeStart() {

    initThree();
    initStats();
    initScene();
    initCamera();
    initLight();
    initLine();
    initCube();
    loadGLB();
    initController();
    onClick();
    window.addEventListener( 'resize', onWindowResize, false );
    render();


}
