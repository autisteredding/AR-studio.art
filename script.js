import * as THREE from 'three';

// --- CONFIGURATION ---
const projects = [
    { 
        title: "SEXY TEACHER", 
        artist: "the LANSKIES",
        img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80", 
        color: "#821887", 
        videoId: "eK8qzE8jpso",
        ratio: "16/9",
        type: "FX"
    },
    { 
        title: "HOLDING TIME", 
        artist: "Mô'Ti Tëi",
        img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80", 
        color: "#f46c31", 
        videoId: "RDCJizKNLJL1Q",
        ratio: "16/9",
        type: "Réalisation"
    },
    { 
        title: "UN FLIM DE FAMILLE", 
        artist: "AUTISTE REDDING",
        img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80", 
        color: "#00f3ff", 
        videoId: "o8-x5UAkzdg",
        ratio: "12/15",
        type: "Acte 2 censuré"
    },
    { 
        title: "PUNK ATTITUBE", 
        artist: "FEU ROUGE",
        img: "https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=600&q=80", 
        color: "#ff0055", 
        videoId: "NUNO_bgUTkc",
        ratio: "12/15",
        type: "Clip"
    }
];

// --- MOTEUR 3D ---
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050505, 0.03);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Sécurité Container
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

// --- ANIMATION ---
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

// --- NAVIGATION ---
const btnDanger = document.getElementById('btn-danger');
const btnZen = document.getElementById('btn-zen');
const btnAccess = document.getElementById('btn-access');

if(btnDanger) btnDanger.onclick = () => enterSite('chaos');
if(btnZen) btnZen.onclick = () => enterSite('zen');
if(btnAccess) btnAccess.onclick = () => enterSite('access');

function enterSite(mode) {
    if(mode === 'access') document.body.classList.add('mode-access');
    if(mode === 'chaos') material.color.setHex(0xff0055); else material.color.setHex(0x00f3ff);
    
    const intro = document.getElementById('intro-overlay');
    intro.style.opacity = 0;
    setTimeout(() => {
        intro.style.display = 'none';
        document.getElementById('main-interface').style.display = 'block';
        loadGallery();
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

function openLynchRoom(proj) {
    const room = document.getElementById('lynch-room');
    const injector = document.getElementById('video-injector');
    
    injector.innerHTML = '';
    injector.className = 'video-frame-container glitch-border-white';
    injector.style.borderColor = proj.color;
    if (proj.ratio === '16/9') injector.classList.add('ratio-16-9');
    if (proj.ratio === '12/15') injector.classList.add('ratio-12-15');

    injector.innerHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${proj.videoId}?autoplay=1&mute=1&rel=0&controls=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    room.classList.add('active');
}

document.getElementById('exit-lynch').onclick = () => {
    document.getElementById('lynch-room').classList.remove('active');
    setTimeout(() => { document.getElementById('video-injector').innerHTML = ''; }, 500);
};

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix(); 
    renderer.setSize(window.innerWidth, window.innerHeight);
});
