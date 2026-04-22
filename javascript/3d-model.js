import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Setup Scene and Camera
const canvas = document.getElementById('tshirt-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
camera.position.set(0, 0, 5); // Afasta a câmera para ver a camisa

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true, // Fundo transparente
    antialias: true
});

// Sync renderer size with container
function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Configuração para "Vitrine" 
// - Bloquear Zoom/Pan
controls.enableZoom = false;
controls.enablePan = false;
// - Bloquear Rotação Vertical (Somente X/Horizontal)
controls.minPolarAngle = Math.PI / 2; // Trava o ângulo vertical no equador
controls.maxPolarAngle = Math.PI / 2; // Trava o ângulo vertical no equador


// Lighting (suave para destacar dobras da blusa)
const ambientLight = new THREE.AmbientLight(0xffffff, 1.75); // -30%
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.4); // -30%
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.05); // -30%
directionalLight2.position.set(-5, -5, -5);
scene.add(directionalLight2);


let shirtModel;

// Load Model
const loader = new GLTFLoader();
loader.load('assets/3d_models/oversized_t-shirt.glb', function (gltf) {
    shirtModel = gltf.scene;

    // Centraliza o modelo usando BoundingBox
    const box = new THREE.Box3().setFromObject(shirtModel);
    const center = box.getCenter(new THREE.Vector3());
    shirtModel.position.x += (shirtModel.position.x - center.x);
    shirtModel.position.y += (shirtModel.position.y - center.y);
    shirtModel.position.z += (shirtModel.position.z - center.z);
    
    // Correção do cálculo de FOV para enquadrar perfeitamente
    // Dimensão máxima
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    
    // Formula exata para enquadramento: MaxDim / (2 * Tan(FOV / 2))
    const fovRad = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs( maxDim / 2 / Math.tan( fovRad / 2 ) );
    
    // Na imagem de referência, a camiseta é visualizada de longe, 
    // com um "respiro" (margin) gigantesco dentro do diamante.
    // Vamos multiplicar por 3.5 para encolher seu tamanho aparente em tela.
    cameraZ *= 2.0; 
    
    // Aumentamos também o plano distante (far) da câmera para não cortar por profundidade
    camera.far = cameraZ * 10;
    camera.updateProjectionMatrix();

    camera.position.set(0, 0, cameraZ);
    camera.lookAt(0, 0, 0); // Foca exato na camisa

    scene.add(shirtModel);
}, undefined, function (error) {
    console.error('An error happened loading the shirt:', error);
});


// Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    // Rotação autônoma super lenta
    if (shirtModel) {
        shirtModel.rotation.y += 0.2 * delta; // Gira sozinho suavemente
    }

    if (resizeRendererToDisplaySize(renderer)) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    controls.update();

    renderer.render(scene, camera);
}

animate();
