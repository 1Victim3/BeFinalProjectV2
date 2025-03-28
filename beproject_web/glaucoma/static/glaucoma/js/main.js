// Import necessary modules
import * as THREE from 'three';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/controls/OrbitControls.js';

// 1. Create the scene
const scene = new THREE.Scene();

// 2. Set up the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000); // Adjust far plane
camera.position.z = 5;

// 3. Set up the WebGL renderer
const renderer = new THREE.WebGLRenderer({ alpha: true }); // Enable transparency
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.top = '0';
renderer.domElement.style.left = '0';
renderer.domElement.style.zIndex = '1'; // Ensure renderer is on top
document.body.appendChild(renderer.domElement);

// 4. Create the red vignette background canvas
const backgroundCanvas = document.createElement('canvas');
const ctx = backgroundCanvas.getContext('2d');
backgroundCanvas.width = window.innerWidth;
backgroundCanvas.height = window.innerHeight;
backgroundCanvas.style.position = 'absolute';
backgroundCanvas.style.top = '0';
backgroundCanvas.style.left = '0';
backgroundCanvas.style.zIndex = '0'; // Ensure background is behind the renderer
document.body.appendChild(backgroundCanvas);

// Function to draw the background with dynamic red area based on mouse position
function drawBackground(mouseX, mouseY) {
    // Create a gradient that changes based on mouse position
    const gradient = ctx.createRadialGradient(
      backgroundCanvas.width / 2 + mouseX * backgroundCanvas.width / 2,  // Shift the center horizontally based on mouseX
      backgroundCanvas.height / 2 + mouseY * backgroundCanvas.height / 2, // Shift the center vertically based on mouseY
      50,  // Inner radius
      backgroundCanvas.width / 2 + mouseX * backgroundCanvas.width / 2,  // Outer radius starts from the shifted center
      backgroundCanvas.height / 2 + mouseY * backgroundCanvas.height / 2, // Outer radius starts from the shifted center
      Math.max(backgroundCanvas.width, backgroundCanvas.height) / 2 // Outer radius size
    );
    
    // Adjust color stops
    const redShift = 255;  // Full red intensity in the mouse direction
    const blackShift = 0;  // Black elsewhere
    
    gradient.addColorStop(0, `rgba(${redShift}, 0, 0, 1)`);  // Red at the center (mouse position)
    gradient.addColorStop(1, `rgba(${blackShift}, ${blackShift}, ${blackShift}, 1)`);  // Black on the outside
  
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
  }
  
  // 5. Load the 3D model
  const loader = new GLTFLoader();
  let model;
  
  loader.load(
    '/static/glaucoma/eye/scene.gltf', // Replace with your model path
    (gltf) => {
      model = gltf.scene;
      model.position.set(0, 0, 0); // Center the model
      model.rotation.x = -Math.PI / 12; // Slight downward tilt
      model.rotation.y = -Math.PI / 12; // Face the camera
      model.scale.set(0.5, 0.5, 0.5); // Adjust the scale
      scene.add(model);
      console.log('Model loaded!');
    },
    undefined,
    (error) => {
      console.error(error);
    }
  );
  
  // 6. Add lighting
  const ambientLight = new THREE.AmbientLight(0x404040, 1); // Soft white light
  scene.add(ambientLight);
  
  const pointLight = new THREE.PointLight(0xffffff, 1, 100);
  pointLight.position.set(10, 10, 10);
  scene.add(pointLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5).normalize();
  scene.add(directionalLight);
  
  // 7. Set up OrbitControls for camera interaction
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.screenSpacePanning = false;
  
  // 8. Handle window resizing
  window.addEventListener('resize', () => {
    // Update canvas sizes
    backgroundCanvas.width = window.innerWidth;
    backgroundCanvas.height = window.innerHeight;
    renderer.setSize(window.innerWidth, window.innerHeight);
  
    // Update camera aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  
    // Redraw background
    drawBackground(0, 0);
  });
  
  // 9. Track mouse movement for model rotation
  let mouseX = 0;
  let mouseY = 0;
  
  window.addEventListener('mousemove', (event) => {
    // Convert mouse position to [-1, 1] range for rotation
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Apply mouse position to model rotation
    if (model) {
      model.rotation.y = mouseX * Math.PI / 6; // Rotate model with mouse X
      model.rotation.x = -mouseY * Math.PI / 6; // Rotate model with mouse Y
    }
  });
  
  // 10. Animate the scene
  function animate() {
    requestAnimationFrame(animate);
  
    // Update background based on mouse position
    drawBackground(mouseX, -mouseY);
  
    renderer.render(scene, camera);
  }
  
  animate();
  