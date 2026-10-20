// =========================================================
// 3D DEVELOPER AVATAR (built with three.js, using only your colours)
// Hooded developer with headphones, typing on a laptop, with cubes floating beside him.
// The head follows your mouse. Put this file next to index.html.
// =========================================================
(function () {
  const box = document.getElementById('avatar');
  if (!box || typeof THREE === 'undefined') return;       // do nothing if three.js did not load

  // ---------- Your palette ----------
  const C = { pink: 0xFF8EBA, red: 0xD44B43, green: 0x53B080, orange: 0xED7843,
              purple: 0xC788FF, black: 0x000000, white: 0xFFFFFF };

  // ---------- Scene, camera, renderer ----------
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0.6, 9);
  camera.lookAt(0, 0.2, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });   // alpha = see-through background
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  box.appendChild(renderer.domElement);

  // ---------- Lights ----------
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const sun = new THREE.DirectionalLight(0xffffff, 0.5);
  sun.position.set(3, 5, 6);
  scene.add(sun);

  // ---------- Helper: make one shape and add it to a group ----------
  function part(geometry, color, x, y, z, parent) {
    const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: color, roughness: 0.9, metalness: 0 }));
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  }

  // ---------- The character (everything is added to "avatar") ----------
  const avatar = new THREE.Group();
  scene.add(avatar);

  // Body (hoodie)
  part(new THREE.CylinderGeometry(1.0, 1.4, 3.2, 32), C.green, 0, -1.3, 0, avatar);

  // Head group: hood, face, eyes, headphones. We rotate this group to look at the mouse.
  const head = new THREE.Group();
  head.position.y = 1.25;
  avatar.add(head);

  part(new THREE.SphereGeometry(1, 32, 32), C.green, 0, 0, 0, head);                  // hood
  const face = part(new THREE.SphereGeometry(0.78, 32, 32), C.black, 0, 0, 0.55, head); // dark face plate
  face.scale.z = 0.7;
  part(new THREE.SphereGeometry(0.12, 16, 16), C.white, -0.28, 0.12, 1.04, head);     // left eye
  part(new THREE.SphereGeometry(0.12, 16, 16), C.white, 0.28, 0.12, 1.04, head);      // right eye

  const band = part(new THREE.TorusGeometry(1.08, 0.08, 16, 48, Math.PI), C.pink, 0, 0, 0, head);  // headphone band
  band.rotation.y = 0;
  [-1.08, 1.08].forEach(function (x) {                                                // ear cups
    const cup = part(new THREE.CylinderGeometry(0.3, 0.3, 0.25, 24), C.pink, x, 0, 0, head);
    cup.rotation.z = Math.PI / 2;
  });

  // Arms and hands (hands move up and down to look like typing)
  [-1, 1].forEach(function (side) {
    const arm = part(new THREE.CylinderGeometry(0.22, 0.22, 1.5, 16), C.green, side * 1.15, -0.3, 0.63, avatar);
    arm.rotation.x = -1.0;
  });
  const handL = part(new THREE.SphereGeometry(0.25, 16, 16), C.black, -1.0, -0.71, 1.26, avatar);
  const handR = part(new THREE.SphereGeometry(0.25, 16, 16), C.black, 1.0, -0.71, 1.26, avatar);

  // Laptop: base + lid (we see the back of the lid, with a small round logo)
  part(new THREE.BoxGeometry(2.4, 0.1, 1.5), C.purple, 0, -0.9, 1.7, avatar);
  const lid = part(new THREE.BoxGeometry(2.4, 1.1, 0.1), C.purple, 0, -0.3, 1.0, avatar);
  lid.rotation.x = -0.25;
  const logo = part(new THREE.CylinderGeometry(0.17, 0.17, 0.04, 24), C.white, 0, -0.3, 0.93, avatar);
  logo.rotation.x = Math.PI / 2 - 0.25;

  // ---------- Floating cubes (x, y, z positions beside the avatar) ----------
  const cubeSpots = [[-1.9, 1.7, -0.3], [1.9, 1.9, -0.3], [-1.8, -0.5, 0.3], [1.85, -0.3, 0.3]];
  const cubes = [C.orange, C.purple, C.red, C.white].map(function (color) {
    return part(new THREE.BoxGeometry(0.45, 0.45, 0.45), color, 0, 0, 0, scene);
  });

  // ---------- Follow the mouse ----------
  const mouse = { x: 0, y: 0 };
  window.addEventListener('pointermove', function (e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;    // -1 (left) to 1 (right)
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;   // -1 (top)  to 1 (bottom)
  });

  // ---------- Keep the canvas the same size as its box ----------
  function resize() {
    const w = box.clientWidth, h = box.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(box);
  resize();

  // ---------- Only animate while the avatar is on screen (saves battery) ----------
  let visible = true;
  new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; }).observe(box);

  // ---------- Animation loop ----------
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    if (!visible) return;
    const t = clock.getElapsedTime();

    // Head turns toward the mouse (the 0.08 makes the movement smooth)
    head.rotation.y += (mouse.x * 0.6 - head.rotation.y) * 0.08;
    head.rotation.x += (mouse.y * 0.3 - head.rotation.x) * 0.08;

    // Whole body sways gently and floats up and down
    avatar.rotation.y = Math.sin(t * 0.6) * 0.2 + mouse.x * 0.25;
    avatar.position.y = Math.sin(t * 1.5) * 0.06;

    // Typing hands
    handL.position.y = -0.71 + Math.sin(t * 9) * 0.03;
    handR.position.y = -0.71 + Math.sin(t * 9 + 2) * 0.03;

    // Cubes float at fixed spots beside the avatar: they bob up and down and spin
    cubes.forEach(function (cube, i) {
      cube.position.set(cubeSpots[i][0], cubeSpots[i][1] + Math.sin(t * 1.2 + i * 1.7) * 0.15, cubeSpots[i][2]);
      cube.rotation.x = t * 0.8;
      cube.rotation.y = t * 1.1;
    });

    renderer.render(scene, camera);
  }
  animate();
})();