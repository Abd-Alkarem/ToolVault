/* ============================================
   TOOLVAULT – THREE.JS GALAXY BACKGROUND
   ============================================ */
function initThreeBackground() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const isLight = () => document.documentElement.getAttribute('data-theme') === 'light';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const lt = isLight();

    /* ---- STARFIELD ---- */
    const starCount = 1500;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    for (let i = 0; i < starCount; i++) {
        starPos[i * 3] = (Math.random() - 0.5) * 80;
        starPos[i * 3 + 1] = (Math.random() - 0.5) * 60;
        starPos[i * 3 + 2] = (Math.random() - 0.5) * 50 - 10;
        starSizes[i] = Math.random() * 0.08 + 0.01;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
        color: lt ? 0x1e293b : 0xffffff,
        size: lt ? 0.06 : 0.04,
        transparent: true,
        opacity: lt ? 0.85 : 0.7,
        sizeAttenuation: true
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    /* ---- DISTANT STAR LAYER (twinkling) ---- */
    const twinkleCount = 600;
    const twinkleGeo = new THREE.BufferGeometry();
    const twinklePos = new Float32Array(twinkleCount * 3);
    for (let i = 0; i < twinkleCount; i++) {
        twinklePos[i * 3] = (Math.random() - 0.5) * 100;
        twinklePos[i * 3 + 1] = (Math.random() - 0.5) * 70;
        twinklePos[i * 3 + 2] = -20 - Math.random() * 30;
    }
    twinkleGeo.setAttribute('position', new THREE.BufferAttribute(twinklePos, 3));
    const twinkleMat = new THREE.PointsMaterial({
        color: lt ? 0x0e7490 : 0x00f0ff,
        size: lt ? 0.08 : 0.06,
        transparent: true,
        opacity: lt ? 0.6 : 0.4,
        sizeAttenuation: true
    });
    const twinkleStars = new THREE.Points(twinkleGeo, twinkleMat);
    scene.add(twinkleStars);

    /* ---- PLANETS ---- */
    const planetColors = {
        dark: [0x00f0ff, 0x8b5cf6, 0xec4899, 0x10b981, 0xf59e0b],
        light: [0x0e7490, 0x7c3aed, 0xdb2777, 0x059669, 0xd97706]
    };
    const planets = [];

    function createPlanet(radius, color, x, y, z, hasRing) {
        const group = new THREE.Group();

        // Planet sphere
        const geo = new THREE.SphereGeometry(radius, 24, 24);
        const mat = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: lt ? 0.15 : 0.12,
            wireframe: false
        });
        const sphere = new THREE.Mesh(geo, mat);
        group.add(sphere);

        // Wireframe overlay
        const wireGeo = new THREE.SphereGeometry(radius * 1.01, 12, 12);
        const wireMat = new THREE.MeshBasicMaterial({
            color: color,
            wireframe: true,
            transparent: true,
            opacity: lt ? 0.2 : 0.15
        });
        const wire = new THREE.Mesh(wireGeo, wireMat);
        group.add(wire);

        // Glow ring
        const glowGeo = new THREE.RingGeometry(radius * 1.2, radius * 1.6, 32);
        const glowMat = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: lt ? 0.06 : 0.04,
            side: THREE.DoubleSide
        });
        const glow = new THREE.Mesh(glowGeo, glowMat);
        glow.rotation.x = Math.PI / 2;
        group.add(glow);

        // Saturn-like ring
        if (hasRing) {
            const ringGeo = new THREE.RingGeometry(radius * 1.4, radius * 2.2, 48);
            const ringMat = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: lt ? 0.1 : 0.08,
                side: THREE.DoubleSide
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = Math.PI * 0.35;
            ring.rotation.y = Math.PI * 0.1;
            group.add(ring);
        }

        group.position.set(x, y, z);
        group.userData = {
            orbitRadius: Math.sqrt(x * x + y * y),
            orbitSpeed: (0.0001 + Math.random() * 0.00015) * (Math.random() > 0.5 ? 1 : -1),
            orbitAngle: Math.atan2(y, x),
            rotSpeed: 0.0008 + Math.random() * 0.0012,
            bobOffset: Math.random() * Math.PI * 2,
            baseZ: z,
            mat: mat,
            wireMat: wireMat,
            glowMat: glowMat
        };

        scene.add(group);
        planets.push(group);
    }

    const pColors = lt ? planetColors.light : planetColors.dark;
    createPlanet(0.8, pColors[0], -7, 3, -8, true);
    createPlanet(0.5, pColors[1], 8, -2, -6, false);
    createPlanet(1.0, pColors[2], 5, 4, -12, true);
    createPlanet(0.4, pColors[3], -5, -4, -5, false);
    createPlanet(0.6, pColors[4], -9, -1, -10, true);
    createPlanet(0.3, pColors[0], 3, -5, -7, false);
    createPlanet(0.7, pColors[1], 10, 2, -14, true);

    /* ---- NEBULA DUST CLOUDS ---- */
    const nebulaColors = lt ? [0x0e7490, 0x7c3aed, 0xdb2777] : [0x00f0ff, 0x8b5cf6, 0xec4899];
    const nebulae = [];
    for (let n = 0; n < 3; n++) {
        const nCount = 300;
        const nGeo = new THREE.BufferGeometry();
        const nPos = new Float32Array(nCount * 3);
        const cx = (Math.random() - 0.5) * 20;
        const cy = (Math.random() - 0.5) * 15;
        for (let i = 0; i < nCount; i++) {
            nPos[i * 3] = cx + (Math.random() - 0.5) * 8;
            nPos[i * 3 + 1] = cy + (Math.random() - 0.5) * 6;
            nPos[i * 3 + 2] = -15 - Math.random() * 10;
        }
        nGeo.setAttribute('position', new THREE.BufferAttribute(nPos, 3));
        const nMat = new THREE.PointsMaterial({
            color: nebulaColors[n],
            size: lt ? 0.25 : 0.15,
            transparent: true,
            opacity: lt ? 0.12 : 0.03,
            sizeAttenuation: true
        });
        const nebula = new THREE.Points(nGeo, nMat);
        nebulae.push({ mesh: nebula, mat: nMat });
        scene.add(nebula);
    }

    /* ---- SHOOTING STARS ---- */
    const shootingStars = [];
    function createShootingStar() {
        const geo = new THREE.BufferGeometry();
        const len = 0.8 + Math.random() * 1.2;
        const verts = new Float32Array([0, 0, 0, -len, -len * 0.3, 0]);
        geo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
        const mat = new THREE.LineBasicMaterial({
            color: lt ? 0x0e7490 : 0x00f0ff,
            transparent: true,
            opacity: 0
        });
        const line = new THREE.Line(geo, mat);
        line.position.set(
            (Math.random() - 0.3) * 30,
            10 + Math.random() * 10,
            -5 - Math.random() * 10
        );
        line.userData = {
            speed: 0.15 + Math.random() * 0.2,
            life: 0,
            maxLife: 60 + Math.random() * 60,
            active: false,
            mat: mat
        };
        scene.add(line);
        shootingStars.push(line);
    }
    for (let i = 0; i < 5; i++) createShootingStar();

    camera.position.z = 8;

    /* ---- MOUSE INTERACTION ---- */
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    /* ---- ANIMATION LOOP ---- */
    let time = 0;
    let shootTimer = 0;

    function animate() {
        requestAnimationFrame(animate);
        time += 0.008;
        shootTimer++;

        // Stars gentle drift
        stars.rotation.y += 0.00003;
        stars.rotation.x += 0.00001;
        twinkleStars.rotation.y -= 0.00002;

        // Twinkle effect
        twinkleMat.opacity = 0.3 + Math.sin(time * 0.8) * 0.1;

        // Planets orbit and bob
        planets.forEach(p => {
            const d = p.userData;
            d.orbitAngle += d.orbitSpeed;
            p.position.x = Math.cos(d.orbitAngle) * d.orbitRadius;
            p.position.y = Math.sin(d.orbitAngle) * d.orbitRadius;
            p.position.z = d.baseZ + Math.sin(time + d.bobOffset) * 0.3;
            p.children[0].rotation.y += d.rotSpeed;
            p.children[1].rotation.y -= d.rotSpeed * 0.5;
        });

        // Nebula pulse
        nebulae.forEach((n, i) => {
            n.mat.opacity = (lt ? 0.12 : 0.03) + Math.sin(time * 0.2 + i * 2) * 0.008;
            n.mesh.rotation.z += 0.00003;
        });

        // Shooting stars
        if (shootTimer % 300 === 0) {
            const inactive = shootingStars.find(s => !s.userData.active);
            if (inactive) {
                inactive.userData.active = true;
                inactive.userData.life = 0;
                inactive.position.set(
                    (Math.random() - 0.3) * 30,
                    8 + Math.random() * 10,
                    -5 - Math.random() * 10
                );
            }
        }
        shootingStars.forEach(s => {
            if (!s.userData.active) return;
            s.userData.life++;
            const progress = s.userData.life / s.userData.maxLife;
            s.position.x += s.userData.speed;
            s.position.y -= s.userData.speed * 0.4;
            // Fade in then out
            if (progress < 0.2) {
                s.userData.mat.opacity = progress * 5 * (lt ? 0.7 : 0.6);
            } else {
                s.userData.mat.opacity = (1 - progress) * (lt ? 0.7 : 0.6);
            }
            if (progress >= 1) {
                s.userData.active = false;
                s.userData.mat.opacity = 0;
            }
        });

        // Mouse parallax — smooth gentle movement
        camera.position.x += (mouseX * 1.0 - camera.position.x) * 0.015;
        camera.position.y += (-mouseY * 0.6 - camera.position.y) * 0.015;
        camera.lookAt(0, 0, -5);

        renderer.render(scene, camera);
    }
    animate();

    /* ---- RESIZE ---- */
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    /* ---- THEME OBSERVER ---- */
    const observer = new MutationObserver(() => {
        const l = isLight();
        const pc = l ? planetColors.light : planetColors.dark;
        const nc = l ? [0x0e7490, 0x7c3aed, 0xdb2777] : [0x00f0ff, 0x8b5cf6, 0xec4899];

        starMat.color.setHex(l ? 0x1e293b : 0xffffff);
        starMat.size = l ? 0.06 : 0.04;
        starMat.opacity = l ? 0.85 : 0.7;
        starMat.needsUpdate = true;

        twinkleMat.color.setHex(l ? 0x0e7490 : 0x00f0ff);
        twinkleMat.size = l ? 0.08 : 0.06;
        twinkleMat.opacity = l ? 0.6 : 0.4;
        twinkleMat.needsUpdate = true;

        planets.forEach((p, i) => {
            const c = pc[i % pc.length];
            const d = p.userData;
            d.mat.color.setHex(c);
            d.mat.opacity = l ? 0.15 : 0.12;
            d.mat.needsUpdate = true;
            d.wireMat.color.setHex(c);
            d.wireMat.opacity = l ? 0.2 : 0.15;
            d.wireMat.needsUpdate = true;
            d.glowMat.color.setHex(c);
            d.glowMat.opacity = l ? 0.06 : 0.04;
            d.glowMat.needsUpdate = true;
        });

        nebulae.forEach((n, i) => {
            n.mat.color.setHex(nc[i % nc.length]);
            n.mat.size = l ? 0.25 : 0.15;
            n.mat.opacity = l ? 0.12 : 0.03;
            n.mat.needsUpdate = true;
        });

        shootingStars.forEach(s => {
            s.userData.mat.color.setHex(l ? 0x0e7490 : 0x00f0ff);
            s.userData.mat.needsUpdate = true;
        });
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}
