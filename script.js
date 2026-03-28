import * as THREE from 'three';

// --- CONFIGURATION PHOTOS (SECTEUR 02) ---
// Je te crée 9 entrées génériques pour le N&B et 9 pour la couleur. 
// Tu n'auras qu'à changer les URL "img" par tes vraies photos.

// --- TES ARCHIVES NOIR & BLANC ---
const photosBW = [
    { title: "TITRE DE TA PHOTO 1", img: "image-mono-1.jpg" },
    { title: "TITRE DE TA PHOTO 2", img: "image-mono-2.jpg" },
    { title: "TITRE DE TA PHOTO 3", img: "image-mono-3.jpg" },
    { title: "TITRE DE TA PHOTO 4", img: "image-mono-4.jpg" },
    { title: "TITRE DE TA PHOTO 5", img: "image-mono-5.jpg" },
    { title: "TITRE DE TA PHOTO 6", img: "image-mono-6.jpg" },
        // Tu peux en rajouter autant que tu veux en copiant une ligne !
];

// --- TES ARCHIVES COULEUR ---
const photosColor = [
    { title: "TITRE DE TA PHOTO A", img: "image-color-1.jpg" },
    { title: "TITRE DE TA PHOTO B", img: "image-color-2.jpg" },
    { title: "TITRE DE TA PHOTO C", img: "image-color-3.jpg" },
    { title: "TITRE DE TA PHOTO D", img: "image-color-4.jpg" },
    { title: "TITRE DE TA PHOTO E", img: "image-color-5.jpg" },
    { title: "TITRE DE TA PHOTO F", img: "image-color-6.jpg" },
    { title: "TITRE DE TA PHOTO G", img: "image-color-7.jpg" },
    { title: "TITRE DE TA PHOTO H", img: "image-color-8.jpg" },
    { title: "TITRE DE TA PHOTO F", img: "image-color-10.jpg" },
    { title: "TITRE DE TA PHOTO G", img: "image-color-11.jpg" },
    { title: "TITRE DE TA PHOTO H", img: "image-color-12.jpg" },
    { title: "TITRE DE TA PHOTO I", img: "image-color-13.jpg" },
    { title: "TITRE DE TA PHOTO I", img: "image-color-14.jpg" }
];


// --- CONFIGURATION ---
const projects = [
    { title: "SEXY TEACHER", artist: "the LANSKIES", img: "https://i.ibb.co/G1cDH4p/8CNoqbsg.jpg?w=600&q=80", color: "#821887", videoId: "eK8qzE8jpso", ratio: "16/9", type: "FX" },
    { title: "HOLDING TIME", artist: "Mô'Ti Tëi", img: "https://i.ibb.co/m5C01vdG/holding-time-image-site-vitrine.jpg?w=600&q=80", color: "#f46c31", videoId: "urUT_YoDZDo", ratio: "16/9", type: "Réalisation" },
    { title: "TROUS DE BALKANY", artist: "FEU ROUGE", img: "https://i.ibb.co/mF4m3Z2Z/Screenshot-528.jpg?w=600&q=80", color: "#ff0055", videoId: "NUNO_bgUTkc", ratio: "16/9", type: "Réalisation" }
];

// --- MOTEUR 3D ---
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050505, 0.03);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const container = document.getElementById('canvas-container');
if (container) container.appendChild(renderer.domElement);
camera.position.z = 10;

// --- DRONE ---
const droneGroup = new THREE.Group();
const geometry = new THREE.IcosahedronGeometry(0.7, 1); 
const material = new THREE.MeshBasicMaterial({ color: 0x00f3ff, wireframe: true, transparent: true, opacity: 0.3 });
const droneBody = new THREE.Mesh(geometry, material);
droneGroup.add(droneBody);
const core = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffffff }));
droneGroup.add(core);
scene.add(droneGroup);

let mouse = new THREE.Vector2();
let isHiding = false; 
document.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

function animate() {
    requestAnimationFrame(animate);
    const time = Date.now() * 0.001;
    const wanderRadius = 3.5; 
    const targetX = (mouse.x * 7) + Math.sin(time) * wanderRadius;
    const targetY = (mouse.y * 4) + Math.cos(time * 0.7) * wanderRadius;

    const dist = droneGroup.position.distanceTo(new THREE.Vector3(mouse.x*9, mouse.y*5, 0));
    if (dist < 2.5 && !isHiding) { isHiding = true; setTimeout(() => isHiding = false, 2000); }

    const speed = isHiding ? 0.01 : 0.04;
    droneGroup.position.x += (targetX - droneGroup.position.x) * speed;
    droneGroup.position.y += (targetY - droneGroup.position.y) * speed;
    droneBody.rotation.x += 0.01; droneBody.rotation.y += 0.01;
    material.opacity += ((isHiding ? 0.05 : 0.4) - material.opacity) * 0.1;
    renderer.render(scene, camera);
}
animate();

// --- NAVIGATION & AUDIO TRIGGER ---
const btnDanger = document.getElementById('btn-danger');
const btnZen = document.getElementById('btn-zen');
const btnAccess = document.getElementById('btn-access');

if(btnDanger) btnDanger.onclick = () => enterSite('chaos');
if(btnZen) btnZen.onclick = () => enterSite('zen');
if(btnAccess) btnAccess.onclick = () => enterSite('access');

function enterSite(mode) {
    if(mode === 'access') document.body.classList.add('mode-access');
    if(mode === 'chaos') material.color.setHex(0xff0055); else material.color.setHex(0x00f3ff);
    
    // 🔥 Lancement de l'audio
    if (typeof window.initAudioEngine === 'function') window.initAudioEngine();
    
    const intro = document.getElementById('intro-overlay');
    intro.style.opacity = 0;
    setTimeout(() => {
        intro.style.display = 'none';
        document.getElementById('main-interface').style.display = 'block';
        loadGallery();
        loadPhotoCarousels(); // <--- AJOUTE CETTE LIGNE ICI
    }, 1000);
}

function loadGallery() {
    const grid = document.getElementById('project-grid');
    grid.innerHTML = '';
    projects.forEach(proj => {
        const div = document.createElement('div');
        div.className = 'project-card';
        div.style.borderColor = proj.color;
        div.innerHTML = `
            <img src="${proj.img}" class="card-img" alt="${proj.title}">
            <div class="card-info">
                <h3>${proj.title}</h3>
                <p class="card-artist">${proj.artist}</p>
                <p class="card-type">${proj.type}</p>
            </div>
        `;
        if(!document.body.classList.contains('mode-access')) div.onclick = () => openLynchRoom(proj);
        grid.appendChild(div);
    });
}

function loadPhotoCarousels() {
    const carouselBW = document.getElementById('carousel-bw');
    const carouselColor = document.getElementById('carousel-color');
    
    if(!carouselBW || !carouselColor) return;

    // Remplissage du Noir & Blanc (Méthode propre pour rendre cliquable)
    carouselBW.innerHTML = '';
    photosBW.forEach(photo => {
        const div = document.createElement('div');
        div.className = 'carousel-item bw';
        div.onclick = () => openPhotoRoom(photo.img); // LE CLIC MAGIQUE
        div.innerHTML = `
            <img src="${photo.img}" alt="${photo.title}">
            <div class="card-info">
                <h3>${photo.title}</h3>
            </div>
        `;
        carouselBW.appendChild(div);
    });

    // Remplissage de la Couleur
    carouselColor.innerHTML = '';
    photosColor.forEach(photo => {
        const div = document.createElement('div');
        div.className = 'carousel-item color';
        div.onclick = () => openPhotoRoom(photo.img); // LE CLIC MAGIQUE
        div.innerHTML = `
            <img src="${photo.img}" alt="${photo.title}">
            <div class="card-info">
                <h3 style="color: var(--red);">${photo.title}</h3>
            </div>
        `;
        carouselColor.appendChild(div);
    });
}

// --- GESTION DE LA PHOTO ROOM ---
function openPhotoRoom(imgSrc) {
    const room = document.getElementById('photo-room');
    const display = document.getElementById('hd-photo-display');
    
    display.src = imgSrc; // On injecte l'image cliquée
    room.classList.add('active'); // On affiche la pièce
}

document.getElementById('exit-photo').onclick = () => {
    document.getElementById('photo-room').classList.remove('active');
    // On attend la fin de l'animation pour vider l'image
    setTimeout(() => { document.getElementById('hd-photo-display').src = ''; }, 500);
};

// --- LYNCH ROOM ---
function openLynchRoom(proj) {
    const room = document.getElementById('lynch-room');
    const injector = document.getElementById('video-injector');
    
    // 🔇 Pause de la musique ambiante
    if(window.tracks) Object.values(window.tracks).forEach(t => { if(t) t.pause(); });

    injector.innerHTML = '';
    injector.className = 'video-frame-container glitch-border-white';
    injector.style.borderColor = proj.color;
    if (proj.ratio === '16/9') injector.classList.add('ratio-16-9');
    if (proj.ratio === '12/15') injector.classList.add('ratio-12-15');

    injector.innerHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${proj.videoId}?autoplay=1&rel=0&controls=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    room.classList.add('active');
}

document.getElementById('exit-lynch').onclick = () => {
    document.getElementById('lynch-room').classList.remove('active');
    
    // 🔊 Reprise de la musique ambiante
    if(window.tracks) Object.values(window.tracks).forEach(t => { if(t) t.play(); });

    setTimeout(() => { document.getElementById('video-injector').innerHTML = ''; }, 500);
};

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix(); 
    renderer.setSize(window.innerWidth, window.innerHeight);
});


// ==========================================
// --- MOTEUR AUDIO DYNAMIQUE (LA CORRECTION) ---
// ==========================================

window.globalVolume = 0.3; // Volume par défaut (30%)
window.lastSpeed = 0;

// Liaison du slider HTML (Sans sécurité inutile pour un module)
const volSlider = document.getElementById('global-volume-slider');
const volIcon = document.getElementById('volume-icon');

if (volSlider) {
    volSlider.value = window.globalVolume;
    volSlider.addEventListener('input', (e) => {
        window.globalVolume = parseFloat(e.target.value);
        if (volIcon) {
            volIcon.innerText = window.globalVolume === 0 ? "🔇" : "🔊";
        }
        adjustVolumes(window.lastSpeed); // Mise à jour instantanée
    });
} else {
    console.error("⚠️ ERREUR : Le slider audio n'a pas été trouvé dans le HTML !");
}

window.initAudioEngine = function() {
    window.tracks = {
        idle: document.getElementById('track-idle'),
        motion: document.getElementById('track-motion'),
        chaos: document.getElementById('track-chaos')
    };

    // Appliquer le volume master au lancement
    if(window.tracks.idle) window.tracks.idle.volume = 1.0 * window.globalVolume;
    if(window.tracks.motion) window.tracks.motion.volume = 0.0;
    if(window.tracks.chaos) window.tracks.chaos.volume = 0.0;
    
    Object.values(window.tracks).forEach(t => {
        if(t) t.play().catch(e => console.log("Audio bloqué :", e));
    });
    
    startMouseTracking();
};

function startMouseTracking() {
    let lastX = 0, lastY = 0, lastTime = Date.now();
    let speed = 0;

    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        const dt = now - lastTime;
        
        if (dt > 50) { 
            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;
            const distance = Math.sqrt(dx*dx + dy*dy);
            
            speed = Math.round(distance / dt * 100);
            adjustVolumes(speed);

            lastX = e.clientX;
            lastY = e.clientY;
            lastTime = now;
        }
    });
    
    setInterval(() => {
        speed = speed * 0.8; 
        if(speed < 1) speed = 0;
        adjustVolumes(speed);
    }, 100);
}

function adjustVolumes(speed) {
    window.lastSpeed = speed;
    if(!window.tracks || !window.tracks.idle) return;

    let volIdle = 1 - (speed / 200); 
    if (volIdle < 0) volIdle = 0;
    
    let volMotion = (speed / 200);
    if (volMotion > 1) volMotion = 1;
    
    let volChaos = (speed - 300) / 300;
    if (volChaos < 0) volChaos = 0;
    if (volChaos > 1) volChaos = 1;

    // Magie : on multiplie par window.globalVolume
    window.tracks.idle.volume = volIdle * window.globalVolume;
    window.tracks.motion.volume = volMotion * window.globalVolume;
    window.tracks.chaos.volume = volChaos * window.globalVolume;
}