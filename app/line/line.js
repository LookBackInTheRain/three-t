let renderer,width,height;
function initThree() {
    width = document.getElementById('canvas-frame').clientWidth;
    height = document.getElementById('canvas-frame').clientHeight;
    renderer = new THREE.WebGLRenderer({
        antialias : true
    });
    renderer.setSize(width, height);
    document.getElementById('canvas-frame').appendChild(renderer.domElement);
    renderer.setClearColor(0xFFF0F5, 1.0);
}

let camera;
function initCamera() {
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    camera.position.x = 700;
    camera.position.y = 200;
    camera.position.z = 700;

    /*camera.up.x = 0;
    camera.up.y = 0;
    camera.up.z = 1;*/

    console.log(camera);

    camera.lookAt(0,0,0);
}

let scene;
function initScene() {
    scene = new THREE.Scene();
}

let light;
function initLight() {
    light = new THREE.DirectionalLight(0xFF0000, 1.0, 0);
    light.position.set(100, 100, 200);
    scene.add(light);
}


function initObject() {

    let geometry = new THREE.Geometry();

    // 线的材质可以由2点的颜色决定
    let p1 = new THREE.Vector3( -500, 0, 0 );
    let p2 = new THREE.Vector3(  500, 0, 0 );
    geometry.vertices.push(p1);
    geometry.vertices.push(p2);

    for (let i=0;i<=20;i++){

        if (i===10){
            continue
        }
        let line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 }), THREE.LineSegments );
        line.position.z=(i*50)-500;
        scene.add(line);

        let line1 = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 }), THREE.LineSegments );
        line1.position.x=(i*50)-500;
        line1.rotation.y = Math.PI/2;
        scene.add(line1);


    }


    let geometry_x = new THREE.Geometry();


    let point_1 = new THREE.Vector3(-700,0,0);
    let point_2 = new THREE.Vector3(700,0,0);

    geometry_x.vertices.push(point_1,point_2)




    let x=new THREE.Line(geometry_x,new THREE.LineBasicMaterial({color:0xFD7A3C}),THREE.LineSegments);
    let y=new THREE.Line(geometry_x,new THREE.LineBasicMaterial({color:0xFD7A3C}),THREE.LineSegments)
    y.rotation.y = Math.PI/2
    let z=new THREE.Line(geometry_x,new THREE.LineBasicMaterial({color:0xFD7A3C}),THREE.LineSegments)
    z.rotation.z = Math.PI/2


    scene.add(x);
    scene.add(y);
    scene.add(z);



}

function render() {
    requestAnimationFrame(render)
    scene.rotation.y+=0.002
    renderer.render(scene, camera);
}

function threeStart() {
    initThree();
    initCamera();
    initScene();
    initLight();
    initObject();
    //renderer.clear();

    render()

    console.log(line)
}
