// Import necessary modules

import * as THREE from 'three';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/controls/OrbitControls.js';

// 1. Create the scene
const scene = new THREE.Scene();

// 2. Set up the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5; // Initial position of the camera

// 3. Set up the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 4. Load the model (.glb)
const loader = new GLTFLoader();
let model;

loader.load(
  '/static/glaucoma/eye/scene.gltf',  // Your model path
  (gltf) => {
    model = gltf.scene;

    // 5. Ensure model's pivot point is at the center and set the rotation
    model.traverse((child) => {
      if (child.isMesh) {
        // Reset the rotation of individual meshes if necessary
        child.rotation.set(0, 0, 0);
      }
    });

    // Apply the rotation to the whole model
    // Set the initial rotation to face the camera and slightly downward
    model.rotation.x = -Math.PI / 12; // Slight downward tilt on X-axis
    model.rotation.y = -Math.PI /12;      // Face the camera (rotate on Y-axis)
    model.rotation.z = 0;            // No rotation on Z-axis

    scene.add(model);
    console.log('Model loaded!');
  },
  undefined,
  (error) => {
    console.error(error);
  }
);

// 6. Set up basic lighting
const ambientLight = new THREE.AmbientLight(0x404040, 1); // Soft white light
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// 7. Set up OrbitControls for camera interaction
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth rotation
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;

// 8. Handle resizing of the window
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// 9. Set up the background color
scene.background = new THREE.Color(0x000000);  // Black background

// 10. Track the mouse position
let mouseX = 0;
let mouseY = 0;

// Event listener for mouse movement
window.addEventListener('mousemove', (event) => {
  // Normalize mouse position to [-1, 1]
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// 11. Set up rotation limits
const maxXRotation = Math.PI / 4; // Max rotation on X-axis (vertical)
const maxYRotation = Math.PI / 4; // Max rotation on Y-axis (horizontal)
const maxZRotation = Math.PI / 4; // Max rotation on Z-axis (depth)

// 12. Animate the scene with rotation
function animate() {
  requestAnimationFrame(animate);

  if (model) {
    // Apply rotation limits for the X, Y, and Z axes
    model.rotation.y = Math.max(-maxYRotation, Math.min(mouseX * Math.PI, maxYRotation)); // Limit horizontal rotation
    model.rotation.x = Math.max(-maxXRotation, Math.min(-mouseY * Math.PI, maxXRotation)); // Limit vertical rotation
    model.rotation.z = Math.max(-maxZRotation, Math.min(model.rotation.z, maxZRotation)); // Limit depth rotation (Z-axis)
  }

  controls.update();  // Update the controls (required for damping)
  renderer.render(scene, camera);
}

animate();
