<script>
    import { onMount, onDestroy } from "svelte";
    import { fade, scale } from "svelte/transition";
    import Radar from "./Radar.svelte";
    import { initMediaQuery, useMediaQuery } from "../../../../stores/mediaQuery.js";
    let isVisible = true;
    let showContent = false;
    let showLoader = false;
    let showCustomContent = false;
    let cleanupFunction;

    onMount(() => {
        console.log("Detector component mounted - blocking scroll");
        
        // Initialiser les media queries
        const cleanupMediaQuery = initMediaQuery();
        const {
            currentSize,
            currentIsSmallMobile,
            currentIsMobile,
            currentIsTablet,
            currentIsDesktop,
            currentIsLargeDesktop,
            currentIsXlDesktop,
            cleanup: cleanupMediaQueryStores,
        } = useMediaQuery();
        
        // Attendre un petit délai pour s'assurer que le composant est bien rendu
        setTimeout(() => {
            // Afficher le contenu après un court délai
            setTimeout(() => {
                showContent = true;
                showLoader = true;
            }, 400);

            const timer = setTimeout(() => {
                showLoader = false;
                showCustomContent = true;
                console.log("Detector component - loader finished, custom content shown");
                
                // Scroll smooth vers le bas après 3 secondes d'affichage du custom content
                setTimeout(() => {
                    // Animation de scroll personnalisée pour plus de douceur
                    const startPosition = window.pageYOffset;
                    const targetPosition = document.documentElement.scrollHeight;
                    const distance = targetPosition - startPosition;
                    const duration = 4000; // 4 secondes pour un scroll plus long et doux
                    let startTime = null;

                    function smoothScroll(currentTime) {
                        if (startTime === null) startTime = currentTime;
                        const timeElapsed = currentTime - startTime;
                        const progress = Math.min(timeElapsed / duration, 1);
                        
                        // Easing function pour un mouvement plus doux (ease-in-out)
                        const easeInOutCubic = progress < 0.5 
                            ? 4 * progress * progress * progress 
                            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                        
                        window.scrollTo(0, startPosition + distance * easeInOutCubic);
                        
                        if (progress < 1) {
                            requestAnimationFrame(smoothScroll);
                        }
                    }
                    
                    requestAnimationFrame(smoothScroll);
                }, 3000);
            }, 5000);

            // Fonction de nettoyage
            cleanupFunction = () => {
                clearTimeout(timer);
                cleanupMediaQueryStores();
                cleanupMediaQuery();
            };
        }, 100);
    });

    onDestroy(() => {
        console.log("Detector component destroyed");
        if (cleanupFunction) {
            cleanupFunction();
        }
    });
</script>

{#if isVisible}
<div class="detection" transition:fade={{ duration: 100 }}>
    {#if showContent}
    <div class="detection-content" transition:scale={{ duration: 500, start: 0.2 }}>
        <h1>Detection Rapport </h1>
        
        {#if showLoader}
        <Radar />
        <div class="loading-bar-radar-container">
            <div class="loading-bar">
                <div class="loading-progress">

                </div>
            </div>
        </div>
        {/if}
        
        {#if showCustomContent}
        <div class="custom-content">
            <!-- Ici vous pouvez ajouter votre HTML personnalisé -->
            <p class="blink-slow p-life" >Life Detected <br> Navigation automatique</p>
           <div class="blink-normal">
               <svg width="150" height="150" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M12 16L6 10H18L12 16Z" fill="crimson"/>
               </svg>
           </div>
           <style>
    

           </style>
        </div>
        {/if}
    </div>
    {/if}
</div>
{/if}  

<style>
    .detection {
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translateX(-50%);
        width: 50%;
        height: 30%;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1010;
    
    }
    
    .detection-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: white;
    }
    
    .detection h1 {
        font-size: 2.5rem;
        font-weight: bold;
        font-family: 'Orbitron', sans-serif;
        color: crimson;
        margin: 0 0 2rem 0;
        text-align: center;
        text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
        filter: drop-shadow(0 10px 20px rgba(220, 20, 60, 0.3));
    }

    .loading-bar-radar-container {
        display: flex;
        flex-direction: column;       
        height: auto;
        gap: 20px;
    }


    
    .loading-bar {
        width: 300px;
        height: 8px;
        border-radius: 2px;
        overflow: hidden;
        margin: 0 auto;
    }
    
    .loading-progress {
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, #ffaa00, crimson);
        border-radius: 2px;
        animation: loading 3s linear forwards;
        transform-origin: left;
    }
    
    .custom-content {
        margin-top: 2rem;
        text-align: center;
    }
    
    .p-life {
        font-size:clamp(1rem, 3vw, 3.2rem);
        margin-bottom: 1rem;
        color: orange;   
     }
    

    @keyframes loading {
        0%{
            transform: scaleX(0);

        }
        10%{
            transform: scaleX(0.1);
        
        }
        20%{
            transform: scaleX(0.2);
        }
        30%{
            transform: scaleX(0.3);
        }
        40%{
            transform: scaleX(0.4);
        }
        50%{
            transform: scaleX(0.5);
        }
        60%{
            transform: scaleX(0.6);
        }
        70%{
            transform: scaleX(0.7);
        }
        80%{
            transform: scaleX(0.8);
        }
        90%{
            transform: scaleX(0.9);
        }
        100%{
            transform: scaleX(1);
        }
    }

    /* ===== MEDIA QUERIES RESPONSIVE ===== */

    /* Très petits écrans (jusqu'à 475px) */
    @media (max-width: 475px) {
        .detection {
            width: 90%;
            top: 35%;
        }
        
        .detection h1 {
            font-size: 1.8rem;
            margin: 0 0 1.5rem 0;
        }
        
        .loading-bar {
            width: 250px;
            height: 6px;
        }
        
        .p-life {
            font-size: clamp(0.9rem, 4vw, 2.5rem);
        }
    }

    /* Medium Mobile (476px à 767px) */
    @media (min-width: 476px) and (max-width: 767px) {
        .detection {
            width: 70%;
            top: 38%;
        }
        
        .detection h1 {
            font-size: 2rem;
            margin: 0 0 1.8rem 0;
        }
        
        .loading-bar {
            width: 280px;
            height: 7px;
        }
        
        .p-life {
            font-size: clamp(1rem, 3.5vw, 3rem);
        }
    }

    /* Mobile (768px à 1023px) */
    @media (min-width: 768px) and (max-width: 1023px) {
        .detection {
            width: 60%;
            top: 40%;
        }
        
        .detection h1 {
            font-size: 2.2rem;
        }
        
        .loading-bar {
            width: 290px;
        }
    }

    /* Tablette (1024px à 1399px) */
    @media (min-width: 1024px) and (max-width: 1399px) {
        .detection {
            width: 55%;
            top: 40%;
        }
        
        .detection h1 {
            font-size: 2.3rem;
        }
        
        .loading-bar {
            width: 300px;
        }
    }

    /* Large Desktop (1400px à 1799px) */
    @media (min-width: 1400px) and (max-width: 1799px) {

        .detection {
            width: 45%;
            top: 70%;
        }
        
        .detection h1 {
            font-size: 2.4rem;
        }
        
        .loading-bar {
            width: 320px;
            height: 9px;
        }
    }
    
    /* XL Desktop (1800px et plus) */
    @media (min-width: 1800px) {
        .detection {
            width: 40%;
            top: 40%;
        }
        
        .detection h1 {
            font-size: 2.6rem;
        }
        
        .loading-bar {
            width: 350px;
            height: 10px;
        }
    }


</style>