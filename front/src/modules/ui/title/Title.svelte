<script>
    import screen from "../../../assets/sl_021821_40890_09.jpg";
    import { onMount } from 'svelte';
    
    let titleValue = "CodeurBase.fr";
    let titleZIndex = 1004;
    
    // Variables pour les positions et propriétés des cercles
    let topRightPosition = { x: 0, y: 0, z: 0, zIndex: 1002 };
    let bottomLeftPosition = { x: 0, y: 0, z: 0, zIndex: 1002 };
    let bottomRightPosition = { x: 0, y: 0, z: 0, zIndex: 1002 };
    
    // Variables pour les vitesses et directions
    let topRightVelocity = { x: 0.3, y: 0.2, z: 0.1 };
    let bottomLeftVelocity = { x: -0.25, y: 0.35, z: -0.08 };
    let bottomRightVelocity = { x: 0.2, y: -0.3, z: 0.25 };
    
    // Variables pour les accélérations (changements de direction fluides)
    let topRightAcceleration = { x: 0, y: 0 };
    let bottomLeftAcceleration = { x: 0, y: 0 };
    let bottomRightAcceleration = { x: 0, y: 0 };
    
    // Variables pour les cibles (nouvelles directions)
    let topRightTarget = { x: 0, y: 0 };
    let bottomLeftTarget = { x: 0, y: 0 };
    let bottomRightTarget = { x: 0, y: 0 };
    
    // Variables pour les limites
    const maxX = 90; // 100% - 10% (largeur du cercle)
    const maxY = 90; // 100% - 10% (hauteur du cercle)
    const maxZ = 20; // Limite pour l'axe Z
    
    // Zone de détection avant collision (en pourcentage)
    const collisionBuffer = 15; // 15% de marge avant les bords
    
    // Fonction pour générer une position initiale aléatoire
    function getRandomPosition() {
        return {
            x: Math.random() * maxX,
            y: Math.random() * maxY,
            z: (Math.random() - 0.5) * maxZ,
            zIndex: 1005 + Math.floor(Math.random() * 3) // Entre 1005 et 1007
        };
    }
    
    // Fonction pour générer une nouvelle direction aléatoire
    function getRandomDirection() {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.1 + Math.random() * 0.3; // Vitesse entre 0.1 et 0.4
        return {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
        };
    }
    
    // Fonction pour mettre à jour les positions avec changements de direction fluides
    function updatePositions() {
        // Top Right - Mouvement avec courbes
        topRightPosition.x += topRightVelocity.x;
        topRightPosition.y += topRightVelocity.y;
        topRightPosition.z += topRightVelocity.z;
        
        // Bottom Left - Mouvement avec courbes
        bottomLeftPosition.x += bottomLeftVelocity.x;
        bottomLeftPosition.y += bottomLeftVelocity.y;
        bottomLeftPosition.z += bottomLeftVelocity.z;
        
        // Bottom Right - Mouvement avec courbes
        bottomRightPosition.x += bottomRightVelocity.x;
        bottomRightPosition.y += bottomRightVelocity.y;
        bottomRightPosition.z += bottomRightVelocity.z;
        
        // Gestion des rebonds avec changements de direction fluides
        [topRightPosition, bottomLeftPosition, bottomRightPosition].forEach((pos, index) => {
            const velocities = [topRightVelocity, bottomLeftVelocity, bottomRightVelocity][index];
            const accelerations = [topRightAcceleration, bottomLeftAcceleration, bottomRightAcceleration][index];
            
            // Détection précoce des bords X (avant collision)
            if (pos.x <= collisionBuffer || pos.x >= maxX - collisionBuffer) {
                // Nouvelle direction qui évite le bord
                const newDir = getRandomDirection();
                // Forcer la direction vers l'intérieur si trop proche du bord
                if (pos.x <= collisionBuffer) {
                    newDir.x = Math.abs(newDir.x); // Direction positive (vers la droite)
                } else if (pos.x >= maxX - collisionBuffer) {
                    newDir.x = -Math.abs(newDir.x); // Direction négative (vers la gauche)
                }
                accelerations.x = (newDir.x - velocities.x) * 0.05; // Transition plus rapide
                accelerations.y = (newDir.y - velocities.y) * 0.05;
            }
            
            // Détection précoce des bords Y (avant collision)
            if (pos.y <= collisionBuffer || pos.y >= maxY - collisionBuffer) {
                // Nouvelle direction qui évite le bord
                const newDir = getRandomDirection();
                // Forcer la direction vers l'intérieur si trop proche du bord
                if (pos.y <= collisionBuffer) {
                    newDir.y = Math.abs(newDir.y); // Direction positive (vers le bas)
                } else if (pos.y >= maxY - collisionBuffer) {
                    newDir.y = -Math.abs(newDir.y); // Direction négative (vers le haut)
                }
                accelerations.x = (newDir.x - velocities.x) * 0.05; // Transition plus rapide
                accelerations.y = (newDir.y - velocities.y) * 0.05;
            }
            
            // Sécurité : rebond sur les bords X (si malgré tout ils touchent)
            if (pos.x <= 0 || pos.x >= maxX) {
                velocities.x *= -0.8;
                pos.x = Math.max(0, Math.min(maxX, pos.x));
            }
            
            // Sécurité : rebond sur les bords Y (si malgré tout ils touchent)
            if (pos.y <= 0 || pos.y >= maxY) {
                velocities.y *= -0.8;
                pos.y = Math.max(0, Math.min(maxY, pos.y));
            }
            
            // Rebond sur les bords Z
            if (pos.z <= -maxZ || pos.z >= maxZ) {
                velocities.z *= -1;
                pos.z = Math.max(-maxZ, Math.min(maxZ, pos.z));
            }
            
            // Changement aléatoire de z-index
            if (Math.random() < 0.009) { // 0.5% de chance à chaque frame
                pos.zIndex = 1005 + Math.floor(Math.random() * 3);
            }
            
            // Changement aléatoire de direction (plus fréquent pour plus de mouvement)
            if (Math.random() < 0.0001) { // 1% de chance à chaque frame
                const newDir = getRandomDirection();
                accelerations.x = (newDir.x - velocities.x) * 0.09; // Transition plus rapide
                accelerations.y = (newDir.y - velocities.y) * 0.03;
            }
            
            // Application des accélérations pour des changements fluides
            velocities.x += accelerations.x;
            velocities.y += accelerations.y;
            
            // Limitation des vitesses
            const maxSpeed = 0.9;
            const speed = Math.sqrt(velocities.x * velocities.x + velocities.y * velocities.y);
            if (speed > maxSpeed) {
                velocities.x = (velocities.x / speed) * maxSpeed;
                velocities.y = (velocities.y / speed) * maxSpeed;
            }
            
            // Réduction progressive des accélérations
            accelerations.x *= 1;
            accelerations.y *= 1;
        });
    }
    
    onMount(() => {
        // Positions initiales
        topRightPosition = getRandomPosition();
        bottomLeftPosition = getRandomPosition();
        bottomRightPosition = getRandomPosition();
        
        // Directions initiales
        const topRightDir = getRandomDirection();
        const bottomLeftDir = getRandomDirection();
        const bottomRightDir = getRandomDirection();
        
        topRightVelocity.x = topRightDir.x;
        topRightVelocity.y = topRightDir.y;
        bottomLeftVelocity.x = bottomLeftDir.x;
        bottomLeftVelocity.y = bottomLeftDir.y;
        bottomRightVelocity.x = bottomRightDir.x;
        bottomRightVelocity.y = bottomRightDir.y;
        
        // Animation continue avec requestAnimationFrame
        let animationId;
        function animate() {
            updatePositions();
            
            // Changement aléatoire du z-index du titre
            if (Math.random() < 0.1) { // 1% de chance à chaque frame
                titleZIndex = Math.random() < 0.5 ? 1003 : 1004;
            }
            
            animationId = requestAnimationFrame(animate);
        }
        animate();
        
        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    });
</script>

<div class="container">

 
    <div class="container-title-screen-and-balayage">
  
        <div class="cadre top-left">
     
            <div class="contain-rond-rectangle-top-left">
            <div  class="relative"></div>
                <div class="rond">
                </div>
                <div class="rectangle">     
                </div>
            
            </div>

            <div class="rectangle bottom-left">
                <div class="vertical-rectangle">
                    <div class="jauger-rectangle">
                    </div>
                </div>

            </div>
       
        </div>
   
    <div class="cadre top-right">
        <div class="rond-move rond-1" style="left: {topRightPosition.x}%; top: {topRightPosition.y}%; transform: translateZ({topRightPosition.z}px); z-index: {topRightPosition.zIndex};"></div>
    </div>      
   
    <div class="cadre bottom-left">
        <div class="rond-move rond-2" style="left: {bottomLeftPosition.x}%; top: {bottomLeftPosition.y}%; transform: translateZ({bottomLeftPosition.z}px); z-index: {bottomLeftPosition.zIndex};"></div>
    </div>  
   
    <div class="cadre bottom-right">
        <div class="rond-move rond-3" style="left: {bottomRightPosition.x}%; top: {bottomRightPosition.y}%; transform: translateZ({bottomRightPosition.z}px); z-index: {bottomRightPosition.zIndex};"></div>
    </div> 

        <div class="contain-balayage">
            <img src={screen} alt="screen" />
            <div class="balayage">
                <div class="balayage-content"></div>
            </div>
        </div>

        <h1 class="title glitch-base" data-text="{titleValue}" style="z-index: {titleZIndex}">{titleValue}</h1>
    </div>


</div>

<style>
    @import url('https://fonts.googleapis.com/css?family=Bungee+Shade');
    
    :root {
        --f-size: 15;
        --f-unit: 1vmin;
        --f: calc(var(--f-size) * var(--f-unit));
        --bg: #181717;
        --g-a: #ff00e1; /* magenta pour couche A */
        --g-b: #39ff14; /* vert néon pour couche B */
    }

    .container {
        display: flex;
        width: clamp(300px, 100%, 100%);
        height: clamp(100px, 90vh, 90vh);
        justify-content: center;
        align-items: center;
        /* overflow: hidden; */
    }

    .container-title-screen-and-balayage {
        position: relative;
        clip-path: polygon(
            7% 1%,
            89% 0,
            100% 12%,
            100% 92%,
            91% 100%,
            8% 100%,
            0 93%,
            0 16%
        );
        background: radial-gradient(
            circle,
            rgba(0, 0, 0, 1) 0%,
            rgba(52, 117, 79, 0.5) 90%,
            rgba(0, 0, 0, 1) 100%
        );
        background-image: url({screen});
        border-width: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: clamp(250px, 55vw, 100vw);
        height: clamp(180px, 25dvh, 380px);
        /* padding: 5px; */
        /* isolation: isolate; */
        z-index: 1000;
        /* overflow: hidden; */
        perspective: 1000px;
        transform-style: preserve-3d;
    }
    .container-title-screen-and-balayage::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(22, 112, 70, 0.250);
        backdrop-filter: blur(1px);
        z-index: 1003;
    }
    .cadre {
        position: absolute;
        width: clamp(10px, 20%, 30%);
        height: clamp(10px, 40%, 40%);
        /* background: rgb(28, 173, 105); */
        z-index: 1004;
        isolation: isolate;
        z-index: 1004;
    }
    .cadre.top-left {
        position: absolute;
        top: 5%;
        left: 2%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .contain-rond-rectangle-top-left  {
        position: relative;
        display: flex;
        align-items: center;

        top: 0;
        left: 0;
        width: 100%;
        height: 50%;
        z-index: 1004;
        display: flex;
        
        
    }
    .contain-rond-rectangle-top-left .rond {
        position: absolute;
        top: 30%;
        left: 4.5%;
        width: clamp(10px, 25%, 25%);
        height: clamp(10px, 60%, 60%);
        border: 1px solid red;
        box-shadow: 0 0 10px crimson ;
        filter: drop-shadow(0px 0 20px crimson);
        background: rgba(220, 20, 60, 0.328);
        transition: background 0.5s ease-in;
        border-radius: 50%;
        z-index: 1005;
        animation: blink-slow 3s alternate-reverse infinite;
    }
    @keyframes blink-slow {
        0% {
            background: rgba(220, 20, 60, 0.328);           }
        50% {
            background: rgba(220, 20, 60, 0.473);
        }
    }
    .contain-rond-rectangle-top-left .rectangle {
        position: absolute;
        top:280%;
        left: 40%;
        width: 395%;
        height: 49%;
        /* outline:1px solid red; */
        /* border: 1px solid rgb(28, 173, 105); */
        /* box-shadow: 0px -10px 20px rgba(39, 130, 84, 0.5) ;
        filter: drop-shadow(0px 30px 15px  crimson); */
        z-index: 1003;
        animation: alternateboxshadow 1s alternate-reverse infinite;
        animation-delay: 5s;
    }
    @keyframes alternateboxshadow {
        0% {
            border-top-left-radius: 50%;
            border-top-right-radius: 50%;
            box-shadow: 0 -10px 20px rgba(39, 130, 84, 0.5) ;
            filter: drop-shadow(0 20px 10px crimson);
        }
        100% {
            border-bottom-left-radius: 50%;
            border-bottom-right-radius: 50%;
             box-shadow: 0px 10px -20px rgba(39, 130, 84, 0.5) ;
            filter: drop-shadow(0px -30px 5px  crimson); 
        }
    }
    .rectangle.bottom-left {
        position: relative;
        width: 100%;
        height: 40%;
        z-index: 1004;
    }

    .rond-move {
        position: absolute;
        top: 0;
        left: 0;
        width:2%;
        height: 10%;
        background: radial-gradient(circle, rgba(28, 173, 105, 0.5) 90%, rgba(212, 61, 44, 1) 100%);
        filter: drop-shadow(0 0 50px rgba(28, 173, 105, 0.5));
        border-radius: 50%;
        backdrop-filter: blur(10px);
        background-position: top right;
        padding: 2px;
        transform-style: preserve-3d;
        will-change: transform, z-index;
    }
        
    

    .rectangle.bottom-left .vertical-rectangle {
        position: absolute;
        top: 35%;
        left: 10%;
        width: 12%;
        height: 205%;
        border: 1px solid rgb(28, 173, 105);
        box-shadow: 0 0 20px rgba(28, 173, 105, 0.5) ;
        filter: drop-shadow(20px 0 20px rgba(49, 166, 107, 0.5));
        background: rgba(28, 173, 105, 0.088);
        backdrop-filter: blur(50px);
        z-index: 1005;
    }
    .rectangle.bottom-left .vertical-rectangle .jauger-rectangle {
        position: absolute;
        background: rgba(28, 173, 105, 0.236);
        backdrop-filter: blur(50px);
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        animation: jauger-rectangle 13s forwards normal;
        transform: rotateX(180deg);
        z-index: 1005;
    }   

    @keyframes jauger-rectangle {
        0% {
            height: 0%;
        }
        100% {
            height: 100%;
        }
    }

    .cadre.bottom-left {
        width: 99%;
        height: 50%;
        bottom: 20%;
        left: 0;
    }
    .cadre.bottom-right {
        width: 99%;
        height: 50%;
        bottom: 30px0;
        right: 0;
    }
    .cadre.top-right {
        position: absolute;
        top: 0%;
        right: 30%;
        width: 30%;
        height: 60%;
    }
    .title {
        position: absolute;
        font-size: clamp(1rem, 4vw, 4.5rem);
        letter-spacing: 0.1em;
        font-weight: bold;
        color: crimson;
        /* text-shadow: 0 0 10px rgba(0, 0, 0, 0.5); */
        text-align: center;
        text-transform: uppercase;
        font-family: "Bungee Shade", "Orbitron", cursive;
        transform: scaleX(1);
        animation: glitch-p 25s linear;
        background-color: transparent;
        isolation: isolate;
    }
    
    .title::before,
    .title::after {
        --top: 0;
        --left: 0;
        --v-height: 30%;
        
        --n-tenth: calc(var(--f-size) * .1 * var(--top));
        --t-cut: calc(var(--n-tenth) / var(--f-size) * 100%);
        --b-cut: calc(var(--t-cut) + var(--v-height));
        
        content: attr(data-text);
        position: absolute;
        width: 100%;
        left: 0;
        text-align: center;
        
        transform: translateX(calc(var(--left) * 100%));
        
        filter: drop-shadow(0 0 transparent);
        
        text-shadow: calc(var(--left) * -1em) 0 .01em var(--g-b), 
                     calc(var(--left) * -2em) 0 .01em var(--g-a);
        
        background-color: transparent;
        clip-path: polygon(0% var(--t-cut), 100% var(--t-cut), 100% var(--b-cut), 0% var(--b-cut));
    }
    
    .title::before {
        z-index: 1002;
        animation: glitch-b 3s infinite alternate-reverse;
    }
    
    .title::after {
        z-index: 1003;
        animation: glitch-a 4s infinite alternate;
    }
    .contain-balayage {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        top: 0;
        left: 0;
        width: clamp(100px, 100%, 100%);
        height: clamp(100px, 100%, 100%);
        /* background-color: rgba(28, 173, 105, 0.288); */
        /* overflow: hidden; */
        z-index: 1000;
    }

    .contain-balayage img {
        position: absolute;
        top: -20%;
        left: -5%;
        width: 110%;
        height: 150%;
        object-fit: fill;
        opacity: 0.5;
        animation:  moveSnow 0.1s alternate-reverse infinite;
    }
    .balayage {
        position: absolute;
        top:0; 
        left:0;
        width:  clamp(10px, 100%, 100%);
        height: clamp(10px, 100%, 100%);
        margin: 0 auto;
        z-index: 9999;
    }
    .balayage-content {
        animation-delay: 5s;
        animation: balayage 0.3s reverse infinite;
        border-bottom: 1px solid rgba(28, 173, 105, 0.236);
        background: rgba(28, 173, 105, 0.171);
        backdrop-filter: blur(10px);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 10%;
    }
    @keyframes moveSnow {
        0% {
            transform: translateY(5%) rotate(-2deg);
            transform-origin: bottom;
        }
        100% {
            /* top:20%; */
            transform: translateY(10%) rotate(3deg);
        }
    }

    @keyframes balayage {
    0% {
        top: 0;
    }
    20% {
        top: 150%;    }
    90% {
        display: none;
        top: 150;
    }
    100% {
        display: block;
        top: 0;
    }

    }
    /* *
 
    
    /* Animations de glitch */
    @keyframes glitch-p {
        17% { 
            transform: scaleX(.95);
            opacity: 0.9;
        }
        31% { 
            transform: scaleX(1.05);
            opacity: 1;
        }
        37% { 
            transform: scaleX(1.1);
            opacity: 0.9;
        }
        47% { 
            transform: scaleX(.98);
            opacity: 0.85;
        }
        87% { 
            transform: scaleX(1);
            opacity: 1;
        }
    }

    @keyframes glitch-a {
        10%,30%,50%,70%,90% {
            --top: 0;
            --left: 0;
        }
        0% {
            --v-height: 15%; 
            
        }
        20% {
            --left: .003;
        }
        40% {
            --left: .008;
            --v-height: 20%;
            --top: 2;
        }
        60% {
            --left: .015;
            --v-height: 25%;
            --top: 3;
        }
        80% {
            --left: .025;
            --v-height: 5%;
            --top: 3;
        }
        100% {
            --left: .03;
            --v-height: 30%;
            --top: 2;
        }
    }

    @keyframes glitch-b {
        10%,30%,50%,70%,90% {
            --top: 0;
            --left: 0;
        }
        0% {
            --v-height: 15%; 
            --top: 10;
        }
        20% {
            --left: -.003;
        }
        40% {
            --left: -.008;
            --v-height: 17%;
            --top: 2;
        }
        60% {
            --left: -.015;
            --v-height: 35%;
            --top: 3;
        }
        80% {
            --left: -.025;
            --v-height: 5%;
            --top: 3;
        }
        100% {
            --left: -.03;
            --v-height: 30%;
            --top: 2;
        }
    }

    /* Couches de glitch supplémentaires */
    .layer-a {
        color: var(--g-a);
        transform: translateX(-3px);
        filter: saturate(1.2) blur(.2px);
        animation: glitchA 2200ms infinite linear;
    }

    .layer-b {
        color: var(--g-b);
        transform: translateX(3px);
        filter: saturate(1.4);
        animation: glitchB 1800ms infinite linear;
    }

    @keyframes glitchA {
        0%   { clip-path: inset(0 0 0 0); transform: translateX(-3px) translateY(0); opacity: .95;}
        8%   { clip-path: inset(18% 0 62% 0); transform: translateX(-8px) translateY(-2px); opacity:.6;}
        18%  { clip-path: inset(60% 0 8% 0); transform: translateX(4px) translateY(1px); opacity:.8;}
        28%  { clip-path: inset(10% 0 70% 0); transform: translateX(-12px) translateY(-4px); opacity:.45;}
        45%  { clip-path: inset(0 0 0 0); transform: translateX(-3px) translateY(0); opacity:.95;}
        100% { clip-path: inset(0 0 0 0); transform: translateX(-3px) translateY(0); opacity:.95;}
    }

    @keyframes glitchB {
        0%   { clip-path: inset(0 0 0 0); transform: translateX(3px) translateY(0); opacity:.95;}
        10%  { clip-path: inset(15% 0 65% 0); transform: translateX(10px) translateY(2px); opacity:.5;}
        25%  { clip-path: inset(55% 0 10% 0); transform: translateX(-5px) translateY(-3px); opacity:.75;}
        38%  { clip-path: inset(8% 0 82% 0); transform: translateX(6px) translateY(1px); opacity:.45;}
        100% { clip-path: inset(0 0 0 0); transform: translateX(3px) translateY(0); opacity:.95;}
    }

    @keyframes microShake {
        0% { transform: translateY(0); }
        50% { transform: translateY(-0.5px); }
        100% { transform: translateY(0); }
    }
    
    .glitch-base { 
        animation: microShake 8s infinite ease-in-out; 
    }

    /* Accessibilité : arrêt des animations si préféré */
    @media (prefers-reduced-motion: reduce) {
        .title,
        .glitch-base {
            animation: none !important;
            transform: none !important;
        }
    }
</style>
