<script>
    import screen from "../../../../assets/sl_021821_40890_09.jpg";
    import { onMount } from "svelte";
    import Bienvenues from "../header/Welcome.svelte";
    import { gsap } from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import { initMediaQuery, useMediaQuery } from "../../../../stores/mediaQuery.js";
    import { circleStore } from "../../../../stores/circleMove.js";
    import { elementsStore } from "../../../../stores/elements.js";
    import { initBordureAnimation, cleanupBordureAnimation } from "./animationsTitle.js";

    // Enregistrer le plugin ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

 

    // Variable pour le z-index du titre
    let titleZIndex = 1004;

    // Variables pour les éléments bindés
    let container;
    let bordure;
    let title;
    let gyroscope;
    let containerTitleScreenAndBalayage;


    // Mettre à jour le store des éléments de façon optimisée
    $: if (bordure && container && title && gyroscope && containerTitleScreenAndBalayage) {
        elementsStore.update(store => ({
            ...store,
            elementOfTitle: {
                bordure,
                container,
                title,
                gyroscope,
                containerTitleScreenAndBalayage
            }
        }));
    }

    onMount(() => {
        // Initialiser le store media query
        const cleanupMediaQuery = initMediaQuery();
        
        // Utiliser la fonction centralisée pour les media queries
        const {
            currentSize,
            currentIsSmallMobile,
            currentIsMobile,
            currentIsTablet,
            currentIsDesktop,
            currentIsLargeDesktop,
            currentIsXlDesktop,
            cleanup: cleanupMediaQueryStores
        } = useMediaQuery();


        // Animation de la bordure selon la taille d'écran
        console.log("🎯 Taille d'écran détectée:", currentSize);
        let bordureAnimation = initBordureAnimation(currentSize);

        let bienvenuElement;
        const unsubscribeBienvenu = elementsStore.subscribe(store => {
            bienvenuElement = store.elementOfBienvenu?.h2Welcome;
        });


        // S'abonner au store des cercles uniquement pour le z-index du titre
        const unsubscribe = circleStore.subscribe(data => {
            titleZIndex = data.titleZIndex;
        });

        return () => {
            // Nettoyer les abonnements aux stores media query
            cleanupMediaQueryStores();
            
            // Nettoyer le store media query
            cleanupMediaQuery();
            
            // Tuer l'animation de bordure
            cleanupBordureAnimation(bordureAnimation);
            
            // CORRECTION FUITE MÉMOIRE : Nettoyer complètement l'animation des cercles
            circleStore.cleanup();
            
            // CORRECTION FUITE MÉMOIRE : Se désabonner des stores
            unsubscribe();
            unsubscribeBienvenu();
        };
    });
    
</script>

<div class="container" bind:this={container}>
    <!-- <div class="repéres" style="position: absolute; top: 0; left: 0; z-index: 1000; color: blue;">title top</div>   
 <div class="repéres" style="position: absolute; bottom: 0; left: 0; z-index: 1000; color: blue;">title bottom</div>    -->

    <div class="bordure" bind:this={bordure}>
     
        <div class="container-title-screen-and-balayage" bind:this={containerTitleScreenAndBalayage}>
     
            <div class="cadre top-left">
       
                <div class="contain-rond-rectangle-top-left">
                    <div class="relative"></div>
                    <div class="rond"></div>
                    <div class="rectangle"></div>
                </div>

                <div class="rectangle bottom-left">
                    <div class="vertical-rectangle">
                        <div class="jauger-rectangle"></div>
                    </div>
                </div>
            </div>

            <div class="cadre top-right">
                <div class="rond-move" style="left: 70%; top: 20%;"></div>
            </div>

            <div class="cadre bottom-left">
                <div class="rond-move" style="left: 20%; top: 70%;"></div>
            </div>

            <div class="cadre bottom-right">
                <div class="rond-move" style="left: 80%; top: 80%;"></div>
            </div>

            <div class="contain-balayage">
                <img src={screen} alt="screen" />
                <div class="balayage">
                    <div class="balayage-content"></div>
                </div>
            </div>

            <h1
                class="title glitch-base"
                data-text="CodeurBase.fr"
                style="z-index: {titleZIndex}"
                bind:this={title}
            >
                <span class="title-part1">CodeurBase.fr</span
                >
            </h1>
        </div>
        <div class="gyroscope" bind:this={gyroscope}>
        </div>
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
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;  
        width:  100%;
        height: 100%;
        perspective: 1000px;
        transform-style: preserve-3d;
        /* overflow: hidden; */
    }
    .bordure {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 0%;
        left: 0%;
        z-index: 1000;
        transform-style: preserve-3d;
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
        padding: 15px 10px 10px 10px;
        
    }

    .bordure::before {
        content: 'DevOps';
        font-family: "Orbitron", cursive;
        font-weight: 900;
        letter-spacing: 0.5em;
        color: crimson;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
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
      
        z-index: 1006;
        
    }
    .bordure::after {
        content: 'RetroVibes';
        font-family: "Orbitron", cursive;
        font-weight: 900;
        letter-spacing: 0.1em;
        color: crimson;
        position: absolute;
        left: 0;
        bottom: 0;
        /* background: rgba(189, 9, 9, 0.389); */
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
        width: 100%;
        filter: drop-shadow(0 20px 50px rgba(69, 115, 66, 0.389));
        z-index: 1005;
    }
     .gyroscope {
         position: absolute;
         margin: 0 auto;
         background: conic-gradient(
             from 0deg,
             transparent 0deg,
             rgba(0, 255, 0, 0.8) 30deg,
             rgba(0, 255, 0, 0.2) 60deg,
             transparent 60deg
         );
         width: 600%;
         height: 500%;
         top: -200%;
         left: -250%;
         clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
         animation: gyroscope 2s linear infinite, pulse 2s ease-in-out infinite;
         z-index: 1001;
         filter: drop-shadow(0 0 20px rgba(0, 255, 0, 0.8));
     }
     @keyframes gyroscope {
         to { transform: rotate(360deg); }
     }
     
     @keyframes pulse {
         0%, 100% { opacity: 0.3; }
         50% { opacity: 0.8; }
     }
     
     @keyframes neonGlow {
         0% { filter: drop-shadow(0 0 20px rgba(0, 255, 0, 0.8)) drop-shadow(0 0 40px rgba(0, 255, 0, 0.6)) drop-shadow(0 0 60px rgba(0, 255, 0, 0.4)); }
         100% { filter: drop-shadow(0 0 30px rgba(0, 255, 0, 1)) drop-shadow(0 0 60px rgba(0, 255, 0, 0.8)) drop-shadow(0 0 90px rgba(0, 255, 0, 0.6)) drop-shadow(0 0 120px rgba(0, 255, 0, 0.4)); }
     }
    .container-title-screen-and-balayage {
        position: relative;
        top: 0%;
        left: 0;
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
        background-color: rgb(0, 0, 0);
        background-image: url({screen});
        border-width: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: clamp(100px, 90dvw, 95dvw);
        height: clamp(100px, 15svh, 31svh);
        /* padding: 5px; */
        /* isolation: isolate; */
        z-index: 1002;
        /* overflow: hidden; */
        perspective: 1000px;
        transform-style: preserve-3d;
        filter: brightness(2);
        box-shadow: 0 20px 10px rgba(141, 109, 109, 0.368) inset;
    }
    @keyframes brightness {
        0%, 10%, 30%, 40%, 80%, 90% { filter: brightness(1.5); }
        20% { filter: brightness(2.87); }
        50%, 60%, 70%, 100% { filter: brightness(2.5); }
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
        z-index: 1004;
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
        top: 10%;
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
        z-index: 100;
        display: flex;
        z-index: 1004;
        
        
    }
    .contain-rond-rectangle-top-left .rond {
        position: absolute;
        top: 30%;
        left: 4.5%;
        width: clamp(10px, 25%, 25%);
        height: clamp(10px, 60%, 60%);
        border: 1px solid red;
        /* box-shadow: 0 0 10px crimson ; */
        filter: drop-shadow(0px 0 1px crimson);
        background: rgba(220, 20, 60, 0.328);
        transition: background 0.5s ease-in;
        border-radius: 50%;
        z-index: 1002;
        animation: blink-slow 3s alternate-reverse infinite;
    }
    @keyframes blink-slow {
        0% { background: rgba(220, 20, 60, 0.105); }
        50% { background: rgba(100, 141, 87, 0.056); }
    }
    .contain-rond-rectangle-top-left .rectangle {
        position: absolute;
        top:-100%;
        left: -50%;
        width: 600%;    
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
        0% { box-shadow: 0px 10px 20px rgba(39, 130, 85, 0.242); filter: drop-shadow(0 0px 10px crimson); }
        100% { box-shadow: 0px 10px 10px rgba(39, 130, 84, 0.242); filter: drop-shadow(0 20px 10px crimson); border-bottom-left-radius: 50%; }
    }
    .rectangle.bottom-left {
        position: relative;
        width: 100%;
        height: 40%;
        z-index: 1004;
    }

    .rond-move {
        position: absolute;
        width: 2%;
        height: 10%;
        background: rgba(28, 173, 105, 0.14);
        border: 1px solid rgba(212, 61, 44, 0.5);
        border-radius: 50%;
    }
        
    

    .rectangle.bottom-left .vertical-rectangle {
        position: absolute;
        top: 30%;
        left: 10%;
        width: 12%;
        height: 205%;
        /* border: 1px solid rgb(28, 173, 105); */
        /* box-shadow: 0 0 20px rgba(28, 173, 105, 0.5) ; */
        filter: drop-shadow(20px 0 20px rgba(49, 166, 107, 0.5));
        /* background: rgba(28, 173, 105, 0.088); */
        backdrop-filter: blur(50px);
        z-index: 100;
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
        z-index: 100;
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
        height: 30%;
        top: 10%;
        left: 0;
    }
    .cadre.bottom-right {
        width: 99%;
        height: 30%;
        bottom: 10px;
        right: 0;
    }
    .cadre.top-right {
        position: absolute;
        top: 10%;
        right: 5%;
        width: 10%;
        height: 60%;
    }
    .title {
        position: absolute;
        font-size: clamp(1.6em, 6vw, 10rem);
        letter-spacing: 0.1em;
        font-weight: bold;
        color: crimson;
        text-align: center;
        text-transform: uppercase;
        font-family: "Bungee Shade", "Orbitron", cursive;
        transform: scaleX(1) translateZ(0); /* Ajout de translateZ pour forcer l'accélération matérielle */
        animation: glitch-p 5s linear 3 forwards;
        background-color: transparent;
        isolation: isolate;
        max-width: 100%;
        display: flex;
        flex-wrap: nowrap;
        justify-content: center;
        align-items: center;
        line-height: 1.2;
        will-change: transform; /* Optimisation des performances */
    }

    .title-part1, .title-part2 {
        white-space: nowrap;

    }

    /* Media queries basées sur le store centralisé */
    
    /* Très petits écrans (jusqu'à 475px) */
    @media (max-width: 475px) {
        .container {
            top: 0%;
            height: 35%;
            width: 100%;
        }
        .bordure {
            top: -15%;
            left: 0%;
            transform-origin: center center;
        }

        .title {
            flex-wrap: wrap;
            gap: 0.5em;
        }
    }
    
    /* Medium Mobile (476px à 767px) */
    @media (min-width: 476px) and (max-width: 767px) {
        .title {
            flex-wrap: wrap;
            gap: 0.2em;
        }
    }
    
    /* Mobile (768px à 1023px) */
    @media (min-width: 768px) and (max-width: 1023px) {
        .title {
            flex-wrap: wrap;
            gap: 0.3em;
        }
    }
    
    /* Tablette (1024px à 1399px) */
    @media (min-width: 1024px) and (max-width: 1399px) {
        .title {
            flex-wrap: nowrap;
            gap: 0.4em;
        }
    }
    
    /* Desktop (1024px à 1399px) */
    @media (min-width: 1024px) and (max-width: 1399px) {
   
        .container-title-screen-and-balayage {
            border: 1px solid green;
            height: clamp(100px, 40svh, 40dvh);
        }
        .bordure {
            top: -30%;
            border: 3px solid green;
        }
        .title {
            flex-wrap: nowrap;
            gap: 0.5em;
        }
    }
    
    /* Large Desktop (1400px à 1799px) */
    @media (min-width: 1400px) and (max-width: 1799px) {
        .container {
            height: 50%;
        }
        .container-title-screen-and-balayage {
            height: clamp(100px, 40svh, 40dvh);
        }
        .bordure {
            top: -30%;
        }
        .title {
            flex-wrap: nowrap;
            gap: 0.5em;
        }
    }
    
    /* XL Desktop (1800px et plus) */
    @media (min-width: 1800px) {
        .title {
            border: 1px solid blue;
            flex-wrap: nowrap;
            gap: 0.6em;
        }
    }

    .title::before,
    .title::after {
        --top: 0;
        --left: 0;
        --v-height: 50%;
        
        --n-tenth: calc(var(--f-size) * .1 * var(--top));
        --t-cut: calc(var(--n-tenth) / var(--f-size) * 100%);
        --b-cut: calc(var(--t-cut) + var(--v-height));
        
        content: attr(data-text);
        position: absolute;
        width: 100%;
        left: 0;
        text-align: center;
        
        transform: translateX(calc(var(--left) * 100%)) translateZ(0);
        
        filter: drop-shadow(0 0 transparent);
        
        text-shadow: calc(var(--left) * -1em) 0 .01em var(--g-b), 
                     calc(var(--left) * -2em) 0 .01em var(--g-a);
        
        background-color: transparent;
        clip-path: polygon(0% var(--t-cut), 100% var(--t-cut), 100% var(--b-cut), 0% var(--b-cut));
        will-change: transform, clip-path;
        backface-visibility: hidden;
    }
    
    .title::before {
        animation: glitch-b 5s 3 forwards;
    }
    
    .title::after {
        animation: glitch-a 5s 3 forwards;
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
        top: -25%;
        left: -5%;
        width: 110%;
        height: 150%;
        object-fit: fill;
        opacity: 0.5;
        filter: brightness(0.3);
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
        animation: balayage 0.6s reverse infinite;
        border-bottom: 1px solid rgba(28, 173, 105, 0.236);
        background: rgba(28, 173, 105, 0.083);
        backdrop-filter: blur(10px);
        filter: drop-shadow(0 10px 20px rgba(28, 173, 105, 0.069));
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 10%;
    }
    @keyframes moveSnow {
        0% {
            transform: translateY(0%) rotate(-2deg);
            transform-origin: bottom;
        }
        100% {
            transform: translateY(2%) rotate(3deg);
        }
    }

    @keyframes balayage {
    0% {
        top: 0;
        transform: translateY(0%) rotate(3deg);
        opacity: 1;
    }
    20% {
        top: 150%;   
        transform: translateY(0%) rotate(3deg);
        opacity: 1;
    }
    90% {
        opacity: 0;
        top: 150%;
    }
    100% {
        opacity: 1;
        top: 0;
    }

    }
    /* *
 
    
    /* Animations de glitch */
    @keyframes glitch-p {
        0% {
            transform: scaleX(1) translateZ(0);
            opacity: 1;
        }
        17% { 
            transform: scaleX(.95) translateZ(0);
            opacity: 0.9;
        }
        31% { 
            transform: scaleX(1.05) translateZ(0);
            opacity: 1;
        }
        37% { 
            transform: scaleX(1.1) translateZ(0);
            opacity: 0.9;
        }
        47% { 
            transform: scaleX(.98) translateZ(0);
            opacity: 0.85;
        }
        87% { 
            transform: scaleX(1) translateZ(0);
            opacity: 1;
        }
        100% {
            transform: scaleX(1) translateZ(0);
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
            --left: 0;
            --v-height: 0%;
            --top: 0;
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
            --left: 0;
            --v-height: 0%;
            --top: 0;
        }
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
