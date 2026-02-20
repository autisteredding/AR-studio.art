let audioContext;
let tracks = {
    idle: document.getElementById('track-idle'),
    motion: document.getElementById('track-motion'),
    chaos: document.getElementById('track-chaos')
};

// Initialisation (Click-to-play)
function initSystem() {
    // Masquer l'overlay
    document.getElementById('start-overlay').style.opacity = '0';
    setTimeout(() => document.getElementById('start-overlay').remove(), 500);
    
    // Lancer les pistes (volume 0 sauf idle)
    tracks.idle.volume = 1.0;
    tracks.motion.volume = 0.0;
    tracks.chaos.volume = 0.0;
    
    Object.values(tracks).forEach(t => t.play());
    
    // Démarrer le tracking souris
    startMouseTracking();
}

function startMouseTracking() {
    let lastX = 0, lastY = 0, lastTime = 0;
    let speed = 0;

    // Écouteur de mouvement
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        const dt = now - lastTime;
        
        if (dt > 50) { // Check toutes les 50ms
            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;
            const distance = Math.sqrt(dx*dx + dy*dy);
            
            // Calcul vitesse (pixels par seconde approx)
            speed = Math.round(distance / dt * 100);
            
            // Mise à jour affichage debug
            document.getElementById('mouse-data').innerText = speed;

            // MIXAGE AUDIO ADAPTATIF
            adjustVolumes(speed);

            lastX = e.clientX;
            lastY = e.clientY;
            lastTime = now;
        }
    });
    
    // Reset vitesse si la souris s'arrête
    setInterval(() => {
        speed = speed * 0.8; // Inertie (ça redescend doucement)
        if(speed < 1) speed = 0;
        adjustVolumes(speed);
    }, 100);
}

function adjustVolumes(speed) {
    // IDLE : Fort quand calme, baisse quand ça bouge
    let volIdle = 1 - (speed / 200); 
    if (volIdle < 0) volIdle = 0;
    
    // MOTION : Monte avec la vitesse moyenne
    let volMotion = (speed / 200);
    if (volMotion > 1) volMotion = 1;
    
    // CHAOS : Monte seulement si très vite (> 300)
    let volChaos = (speed - 300) / 300;
    if (volChaos < 0) volChaos = 0;
    if (volChaos > 1) volChaos = 1;

    // Application
    tracks.idle.volume = volIdle;
    tracks.motion.volume = volMotion;
    tracks.chaos.volume = volChaos;
}