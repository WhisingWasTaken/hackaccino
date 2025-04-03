import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.module.js";

let scene, camera, renderer, cube, raycaster, mouse;
let artistSprite = null;
let currentArtistIndex = 0;
let artistCycleInterval = null;

const globalTopArtists = [
  { name: "Taylor Swift", imageUrl: "Taylor.jpg" },
  { name: "Drake", imageUrl: "Drake.jpg" },
  { name: "Bad Bunny", imageUrl: "BadBunny.jpg" },
  { name: "The Weeknd", imageUrl: "TheWeeknd.jpg" },
  { name: "Ed Sheeran", imageUrl: "Ed-Sheeran.jpg" },
  { name: "Billie Eilish", imageUrl: "BillieEilish.jpg" },
  { name: "Post Malone", imageUrl: "PM.jpg" },
  { name: "Ariana Grande", imageUrl: "AG.jpg" },
  { name: "BTS", imageUrl: "BTS.jpg" },
  { name: "Justin Bieber", imageUrl: "JustinB.jpg" },
  { name: "Eminem", imageUrl: "slimshady.webp" },
  { name: "Dua Lipa", imageUrl: "DuaL.jpg" },
  { name: "Cardi B", imageUrl: "CardiB.webp" },
  { name: "J Balvin", imageUrl: "JBAL.jpg" },
  { name: "Travis Scott", imageUrl: "TSctt.jpg" }
];

function initThree() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  window.addEventListener("click", onCubeClick, false);
  window.addEventListener("resize", onResize, false);

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.005;
  cube.rotation.y += 0.005;
  renderer.render(scene, camera);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function updateCubeWithArtist(artist) {
  cube.material.color.set(0xffffff);

  if (artist.imageUrl) {
    const loader = new THREE.TextureLoader();
    loader.load(
      artist.imageUrl,
      (texture) => {
        cube.material.map = texture;
        cube.material.needsUpdate = true;
      },
      undefined,
      (err) => {
        console.error("Error loading local artist image:", err);
      }
    );
  } else {
    cube.material.map = null;
    cube.material.needsUpdate = true;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = "bold 50px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "left";
  ctx.fillText(artist.name, 10, 70);

  const textTexture = new THREE.CanvasTexture(canvas);
  if (!artistSprite) {
    const spriteMaterial = new THREE.SpriteMaterial({ map: textTexture, transparent: true });
    artistSprite = new THREE.Sprite(spriteMaterial);
    // Position the sprite to the left of the cube.
    artistSprite.position.set(-2.5, 0, 0);
    artistSprite.scale.set(3, 0.75, 1);
    scene.add(artistSprite);
  } else {
    artistSprite.material.map = textTexture;
    artistSprite.material.needsUpdate = true;
  }
}

function startGlobalArtistCycle() {
  if (!globalTopArtists || globalTopArtists.length === 0) return;

  updateCubeWithArtist(globalTopArtists[currentArtistIndex]);

  if (artistCycleInterval) {
    clearInterval(artistCycleInterval);
  }

  artistCycleInterval = setInterval(() => {
    currentArtistIndex = (currentArtistIndex + 1) % globalTopArtists.length;
    updateCubeWithArtist(globalTopArtists[currentArtistIndex]);
  }, 5000);
}

function onCubeClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(cube);
  if (intersects.length > 0) {
    startGlobalArtistCycle();
  }
}

initThree();