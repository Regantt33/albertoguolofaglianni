const video = document.getElementById("intro-video");
const intro = document.getElementById("intro");
const mainContent = document.getElementById("main-content");

video.addEventListener("ended", () => {
  gsap.to("#intro", {
    duration: 1,
    opacity: 0,
    onComplete: () => {
      intro.style.display = "none";
      mainContent.style.display = "block";
      startScene();
    }
  });
});

function startScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 10;

  const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("scene"), antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const light = new THREE.PointLight(0xffffff, 2, 100);
  light.position.set(10, 10, 10);
  scene.add(light);

  const loader = new THREE.FontLoader();
  loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', function (font) {
    const geometry = new THREE.TextGeometry('HAPPY BIRTHDAY', {
      font: font,
      size: 1,
      height: 0.5,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 5
    });

    const material = new THREE.MeshStandardMaterial({ color: 0xff00ff });
    const textMesh = new THREE.Mesh(geometry, material);
    textMesh.position.x = -6;
    scene.add(textMesh);

    gsap.from(textMesh.scale, { x: 0, y: 0, z: 0, duration: 2, ease: "elastic.out(1, 0.5)" });

    animate();

    // Fuochi d'artificio simulati con particelle
    const particles = new THREE.Geometry();
    for (let i = 0; i < 100; i++) {
      const p = new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      particles.vertices.push(p);
    }

    const particleMaterial = new THREE.PointsMaterial({ color: 0xffff00, size: 0.2 });
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    function animateParticles() {
      particles.vertices.forEach(v => {
        v.y += Math.random() * 0.05;
        v.x += (Math.random() - 0.5) * 0.05;
        v.z += (Math.random() - 0.5) * 0.05;
      });
      particles.verticesNeedUpdate = true;
    }

    function animate() {
      requestAnimationFrame(animate);
      textMesh.rotation.y += 0.005;
      animateParticles();
      renderer.render(scene, camera);
    }
  });
}

window.addEventListener('resize', () => {
  location.reload(); // semplice reload per adattare la canvas se ridimensioni la finestra
});

