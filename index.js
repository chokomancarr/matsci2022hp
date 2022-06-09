import { GLTFLoader } from "./GLTFLoader.js"

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0xAABBFF, 1.0);
var phy4 = document.getElementById("phy4");
phy4.appendChild( renderer.domElement );
renderer.domElement.id = "phy4_canvas";

var rocket_root;
var rocket;
const cel_vs = `
varying vec3 v2f_nrm;

void main() {
    v2f_nrm = normalize(projectionMatrix * modelViewMatrix * vec4(normal, 0.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
const cel_fs = `
varying vec3 v2f_nrm;

uniform vec3 col1;
uniform vec3 col2;

void main() {
    float dl = dot(normalize(vec3(-1.0, -2.0, 1.0)), v2f_nrm);
    vec3 col = mix(col1, col2, dl * 0.5 + 0.5);
    gl_FragColor = vec4(col, 1.0);
}
`;
const loader = new GLTFLoader();
loader.load( './assets/rocket.gltf', function ( gltf ) {
	scene.add( gltf.scene );
    rocket_root = gltf.scene;
    rocket_root.children.forEach(obj => {
        if (obj.name == "Circle") {
            rocket = obj;
            obj.material = new THREE.ShaderMaterial({
                uniforms : {
                    col1: { type: "v3", value: [ 0.5, 0.7, 1.0 ] },
                    col2: { type: "v3", value: [ 0.1, 0.4, 0.8 ] }
                },
                vertexShader : cel_vs,
                fragmentShader : cel_fs,
            });
        }
        else if (obj.name == "Icosphere033") {
            obj.material = new THREE.ShaderMaterial({
                uniforms : {
                    col1: { type: "v3", value: [ 1.1, 1.1, 1.1 ] },
                    col2: { type: "v3", value: [ 0.5, 0.5, 0.7 ] }
                },
                vertexShader : cel_vs,
                fragmentShader : cel_fs,
            });
        }
    });
}, undefined, function ( error ) {
	console.error( error );
} );

camera.position.z = 10;

function animate() {
	requestAnimationFrame( animate );

    if (rocket) {
        rocket.rotateY(0.001);
    }

	renderer.render( scene, camera );
}
animate();

document.onmousemove = function(e) {
    var xpos = (e.clientX * 2.0 / window.innerWidth - 1.0) * 0.1;
    var ypos = (e.clientY * 2.0 / window.innerHeight - 1.0) * 0.1;
    if (rocket_root) {
        camera.rotation.y = -xpos;
        camera.rotation.x = -ypos;
    }
}

window.onresize = function(e) {
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}