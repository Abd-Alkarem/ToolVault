/* ============================================
   TOOLVAULT – THREE.JS 3D BACKGROUND
   ============================================ */
function initThreeBackground() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const isLight = () => document.documentElement.getAttribute('data-theme') === 'light';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Floating geometric shapes — 2.5x bigger in light mode
    const lt = isLight();
    const s = lt ? 2.5 : 1;
    const geometries = [
        new THREE.IcosahedronGeometry(0.5 * s, 0),
        new THREE.OctahedronGeometry(0.4 * s, 0),
        new THREE.TetrahedronGeometry(0.4 * s, 0),
        new THREE.TorusGeometry(0.3 * s, 0.1 * s, 8, 16),
        new THREE.BoxGeometry(0.4 * s, 0.4 * s, 0.4 * s),
        new THREE.ConeGeometry(0.3 * s, 0.5 * s, 6),
    ];

    const material = new THREE.MeshBasicMaterial({
        color: lt ? 0x1e293b : 0x00f0ff,
        wireframe: true,
        transparent: true,
        opacity: lt ? 0.9 : 0.08
    });

    const material2 = new THREE.MeshBasicMaterial({
        color: lt ? 0x312e81 : 0x8b5cf6,
        wireframe: true,
        transparent: true,
        opacity: lt ? 0.7 : 0.06
    });

    const meshes = [];
    for (let i = 0; i < 18; i++) {
        const geo = geometries[i % geometries.length];
        const mat = i % 2 === 0 ? material : material2;
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(
            (Math.random() - 0.5) * 16,
            (Math.random() - 0.5) * 12,
            (Math.random() - 0.5) * 6 - 3
        );
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        mesh.userData = {
            rotSpeed: { x: (Math.random() - 0.5) * 0.005, y: (Math.random() - 0.5) * 0.005 },
            floatSpeed: Math.random() * 0.002 + 0.001,
            floatOffset: Math.random() * Math.PI * 2,
            baseY: mesh.position.y
        };
        scene.add(mesh);
        meshes.push(mesh);
    }

    // Particle system — more and bigger in light mode
    const particleCount = lt ? 400 : 200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 25;
        positions[i + 1] = (Math.random() - 0.5) * 18;
        positions[i + 2] = (Math.random() - 0.5) * 10 - 3;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
        color: lt ? 0x1e293b : 0x00f0ff,
        size: lt ? 0.15 : 0.02,
        transparent: true,
        opacity: lt ? 1.0 : 0.4
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    camera.position.z = 5;

    // Mouse interaction
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Animation loop
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        meshes.forEach(mesh => {
            mesh.rotation.x += mesh.userData.rotSpeed.x;
            mesh.rotation.y += mesh.userData.rotSpeed.y;
            mesh.position.y = mesh.userData.baseY + Math.sin(time + mesh.userData.floatOffset) * 0.3;
        });

        particles.rotation.y += 0.0003;
        particles.rotation.x += 0.0001;

        camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
    animate();

    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Theme change observer — update colors/opacity live when toggling
    const observer = new MutationObserver(() => {
        const l = isLight();
        material.color.setHex(l ? 0x1e293b : 0x00f0ff);
        material.opacity = l ? 0.9 : 0.08;
        material.needsUpdate = true;
        material2.color.setHex(l ? 0x312e81 : 0x8b5cf6);
        material2.opacity = l ? 0.7 : 0.06;
        material2.needsUpdate = true;
        particleMat.color.setHex(l ? 0x1e293b : 0x00f0ff);
        particleMat.size = l ? 0.15 : 0.02;
        particleMat.opacity = l ? 1.0 : 0.4;
        particleMat.needsUpdate = true;
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}
