<template>
  <div class="wheel-container">
    <div ref="sceneContainer" class="scene-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import * as THREE from "three";
import { gsap } from "gsap";

const props = defineProps({
  value: {
    type: Number,
    required: true,
    validator: (value) => value >= 0,
  },
  digits: {
    type: Number,
    required: true,
    validator: (value) => value > 0,
  },
});

const sceneContainer = ref(null);
let scene, camera, renderer;
const wheels = ref([]);
const isAnimating = ref(false);
let currentAnimations = [];

const initThree = () => {
  // Scene setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  // Add fog with distances adjusted for camera at z=3
  scene.fog = new THREE.Fog(0xffffff, 1.3, 1.6);

  // Camera setup
  camera = new THREE.PerspectiveCamera(
    75,
    sceneContainer.value.clientWidth / sceneContainer.value.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 3;
  camera.position.y = 1.125;
  camera.lookAt(0, 0, 0);

  // Renderer setup
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setSize(
    sceneContainer.value.clientWidth,
    sceneContainer.value.clientHeight
  );
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  sceneContainer.value.appendChild(renderer.domElement);

  createWheels();
  onWindowResize();
  animate();
};

const createWheel = (index) => {
  const wheelGeometry = new THREE.CylinderGeometry(2, 2, 0.5, 128, 1, true);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { alpha: false });

  // Increase resolution while maintaining aspect ratio
  const baseWidth = 8192; // Doubled from 4096
  const baseHeight = 2048 / 1.4; // Doubled from 1024
  canvas.width = baseWidth;
  canvas.height = baseHeight / 4;

  // Enable high-quality text rendering
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Clear with white background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw numbers with improved quality
  for (let i = 0; i < 10; i++) {
    ctx.save();
    ctx.translate(i * (baseWidth / 10) + baseWidth / 20, canvas.height / 2);
    ctx.rotate(Math.PI / 2);
    ctx.fillStyle = "#000000";
    ctx.font = "bold 720px Arial"; // Doubled from 360px
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(i.toString(), 0, 0);
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  texture.generateMipmaps = true;

  const wheelMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    // side: THREE.DoubleSide,
    // transparent: true,
  });

  const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
  wheel.rotation.z = Math.PI / 2;

  const spacing = 0.5;
  const totalWidth = (props.digits - 1) * spacing;
  wheel.position.x = index * spacing - totalWidth / 2;

  scene.add(wheel);
  return wheel;
};

const createWheels = () => {
  // Remove all existing objects from the scene
  while (scene.children.length > 0) {
    const object = scene.children[0];
    if (object.isMesh) {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (object.material.map) object.material.map.dispose();
        object.material.dispose();
      }
    }
    scene.remove(object);
  }

  // Clear the wheels array
  wheels.value = [];

  // Create new wheels
  for (let i = 0; i < props.digits; i++) {
    const wheel = createWheel(i);
    wheels.value.push(wheel);
  }

  // Set initial rotation based on current value
  const digits = props.value
    .toString()
    .padStart(props.digits, "0")
    .split("")
    .map(Number);

  const numberToAngle = {
    0: 0,
    1: Math.PI / 5,
    2: (Math.PI * 2) / 5,
    3: (Math.PI * 3) / 5,
    4: (Math.PI * 4) / 5,
    5: Math.PI,
    6: (Math.PI * 6) / 5,
    7: (Math.PI * 7) / 5,
    8: (Math.PI * 8) / 5,
    9: (Math.PI * 9) / 5,
  };

  wheels.value.forEach((wheel, index) => {
    const digit = digits[index];
    wheel.rotation.x = numberToAngle[digit];
  });
};

const rotateToValue = (value) => {
  currentAnimations.forEach((anim) => anim.kill());
  currentAnimations = [];

  if (isAnimating.value) {
    isAnimating.value = false;
  }

  const digits = value
    .toString()
    .padStart(props.digits, "0")
    .split("")
    .map(Number);

  const numberToAngle = {
    0: 0,
    1: Math.PI / 5,
    2: (Math.PI * 2) / 5,
    3: (Math.PI * 3) / 5,
    4: (Math.PI * 4) / 5,
    5: Math.PI,
    6: (Math.PI * 6) / 5,
    7: (Math.PI * 7) / 5,
    8: (Math.PI * 8) / 5,
    9: (Math.PI * 9) / 5,
  };

  isAnimating.value = true;

  wheels.value.forEach((wheel, index) => {
    const targetDigit = digits[index];
    const targetAngle = numberToAngle[targetDigit];

    // Get current angle normalized to 0-2π range
    let currentAngle = wheel.rotation.x % (Math.PI * 2);
    if (currentAngle < 0) currentAngle += Math.PI * 2;

    // Calculate both clockwise and counterclockwise distances
    let clockwiseDistance =
      (targetAngle - currentAngle + Math.PI * 2) % (Math.PI * 2);
    let counterClockwiseDistance =
      (currentAngle - targetAngle + Math.PI * 2) % (Math.PI * 2);

    // Choose the shorter path
    const rotationNeeded =
      clockwiseDistance <= counterClockwiseDistance
        ? clockwiseDistance
        : -counterClockwiseDistance;

    const animation = gsap.to(wheel.rotation, {
      x: wheel.rotation.x + rotationNeeded,
      duration: 1.5,
      ease: "expo.out",
      onComplete: () => {
        if (index === wheels.value.length - 1) {
          isAnimating.value = false;
        }
      },
    });

    currentAnimations.push(animation);
  });
};

watch(
  () => props.value,
  (newValue) => {
    if (wheels.value.length) {
      rotateToValue(newValue);
    }
  }
);

watch(
  () => props.digits,
  () => {
    createWheels();
    if (wheels.value.length) {
      rotateToValue(props.value);
    }
  }
);

const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

onMounted(() => {
  if (sceneContainer.value) {
    initThree();
    window.addEventListener("resize", onWindowResize);
  }
});

onUnmounted(() => {
  window.removeEventListener("resize", onWindowResize);
  if (renderer) {
    renderer.dispose();
  }
  if (scene) {
    scene.traverse((object) => {
      if (object.isMesh) {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      }
    });
    scene.clear();
  }
});

const getAspectRatio = (digits) => {
  if (digits <= 3) return 1;
  if (digits <= 4) return 1.25;
  if (digits <= 5) return 1.5;
  if (digits <= 6) return 1.85;
  if (digits <= 7) return 2.25;
  if (digits <= 8) return 2.5;
  if (digits <= 9) return 2.75;
  if (digits <= 10) return 3;
  if (digits <= 11) return 3.25;
  return 3.4;
};

const onWindowResize = () => {
  if (sceneContainer.value) {
    const containerWidth = sceneContainer.value.clientWidth;
    const containerHeight = sceneContainer.value.clientHeight;

    // Calculate the size that maintains aspect ratio
    const aspectRatio = getAspectRatio(props.digits);
    let width, height;

    // Calculate dimensions that fit within the container
    if (containerWidth / containerHeight > aspectRatio) {
      // Container is wider than needed
      height = containerHeight;
      width = height * aspectRatio;
    } else {
      // Container is taller than needed
      width = containerWidth;
      height = width / aspectRatio;
    }

    // Update camera aspect
    camera.aspect = aspectRatio;
    camera.updateProjectionMatrix();

    // Update renderer size
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
};

// Watch for digits changes to update aspect ratio
watch(
  () => props.digits,
  () => {
    onWindowResize();
  }
);
</script>

<style scoped>
.wheel-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  flex: 1;
  min-width: 0;
  min-height: 0;
}

.scene-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-width: 0;
  min-height: 0;
  aspect-ratio: v-bind("getAspectRatio(digits) / 1");
  max-width: 100%;
  max-height: 100%;
}

.scene-container canvas {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  min-width: 0;
  min-height: 0;
}
</style>
