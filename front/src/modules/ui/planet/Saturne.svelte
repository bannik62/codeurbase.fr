<script>
    import { onMount } from "svelte";
    import { gsap } from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import saturne from "../../../assets/saturne.png";
    import { elementsStore } from "../../../stores/elements.js";
    import { initMediaQuery, useMediaQuery } from "../../../stores/mediaQuery.js";
    import { initSaturneAnimation, cleanupSaturneAnimation } from "./animationsSaturne.js";
    
    gsap.registerPlugin(ScrollTrigger);

    let elements;
    const unsubscribeBienvenu = elementsStore.subscribe(store => {
        elements = store;
    });

    onMount(() => {
        console.log("chargé saturne.svelte");
        gsap.registerPlugin(ScrollTrigger);
    
        // Vérification des éléments du store
        console.log("Elements disponibles:", elements);
        console.log("contentTextBienvenue:", elements?.elementOfBienvenu?.contentTextBienvenue);

        // Initialiser le store media query
        const cleanupMediaQuery = initMediaQuery();
        
        // Utiliser la fonction centralisée pour les media queries
        const {
            currentSize,
            currentIsSmallMobile,
            currentIsMediumMobile,
            currentIsMobile,
            currentIsTablet,
            currentIsDesktop,
            currentIsLargeDesktop,
            cleanup: cleanupMediaQueryStores
        } = useMediaQuery();

        // Animation de Saturne selon la taille d'écran
        let saturneAnimation = initSaturneAnimation(currentSize);

        // Fonction de nettoyage
        return () => {
            // Nettoyer les abonnements aux stores media query
            cleanupMediaQueryStores();
            
            // Nettoyer le store media query
            cleanupMediaQuery();
            
            // Tuer l'animation de Saturne
            cleanupSaturneAnimation(saturneAnimation);
            
            // Se désabonner des stores
            unsubscribeBienvenu();
        };
    });
</script>

<div class="saturne-container">
    <div class="saturne-container-inner">
        <img src={saturne} alt="saturne">
    </div>
</div>

<style>
    .saturne-container {    
        position: relative;
        width: 100%;
        height: 100%;
        z-index: 0;
        
    }
    .saturne-container-inner {
        position: absolute;
        top: -0%;
        left: 0;
        width: clamp(100px, 100%, 100%);
        height: 100%;
        transition: opacity 1.3s ease-in-out;
        perspective: 1000px;
        transform-style: preserve-3d;
    }
    .saturne-container-inner img {
        transform: translate3d(0, 0, -2000px); /* Position initiale très loin */
        position: relative;
        top: 90%;
        left: 0;
        aspect-ratio: 1/1;
        width: clamp(100px, 80%, 100%);
        height: 100%;
        opacity: 0; /* Commence invisible */
        scale: 0.01; /* Commence très petit (10px) */
        /* backdrop-filter: shadow(50px 0px 10px rgba(230, 220, 128, 0.5)); */
        filter: drop-shadow(0px -100px 20px rgba(95, 164, 198, 0.5));
        /* opacity: 0.5; */
        animation: graduateFilter 10s forwards;
    }
    @keyframes graduateFilter {
        0% {
            filter: drop-shadow(0px -10px 20px rgba(95, 164, 198, 0));
        }
        100% {
            filter: drop-shadow(-20px -100px 20px rgba(95, 164, 198, 0.5));
        }
    }

    /* ===== MEDIA QUERIES RESPONSIVE ===== */
    
    /* Très petits écrans (jusqu'à 475px) */
    @media (max-width: 475px) {
        .saturne-container {
            height: 100%;
        }
        
        .saturne-container-inner {
            top: 20%;
            width: 100%;
            height: 100%;
        }
        
        .saturne-container-inner img {
            top: 0%;
            filter: drop-shadow(0px -80px 15px rgba(95, 164, 198, 0.4));
        }
    }
    
    /* Medium Mobile (476px à 767px) */
    @media (min-width: 476px) and (max-width: 767px) {
        .saturne-container {
            height: 85%;
        }
        
        .saturne-container-inner {
            top: -15%;
            width: 95%;
        }
        
        .saturne-container-inner img {
            top: 88%;
            filter: drop-shadow(0px -90px 18px rgba(95, 164, 198, 0.45));
        }
    }
    
    /* Mobile (768px à 1023px) */
    @media (min-width: 768px) and (max-width: 1023px) {
        .saturne-container {
            height: 90%;
        }
        
        .saturne-container-inner {
            top: -18%;
            width: 98%;
        }
        
        .saturne-container-inner img {
            top: 90%;
            filter: drop-shadow(0px -95px 20px rgba(95, 164, 198, 0.5));
        }
    }
    
    /* Tablette (1024px à 1399px) */
    @media (min-width: 1024px) and (max-width: 1399px) {
        .saturne-container {
            height: 95%;
        }
        
        .saturne-container-inner {
            top: -20%;
            width: 100%;
        }
        
        .saturne-container-inner img {
            top: 90%;
            filter: drop-shadow(0px -100px 20px rgba(95, 164, 198, 0.5));
        }
    }
    
    /* Desktop (1024px à 1399px) */
    @media (min-width: 1024px) and (max-width: 1399px) {
        .saturne-container {
            height: 95%;
        }
    }
    
    /* Large Desktop (1400px à 1799px) */
    @media (min-width: 1400px) and (max-width: 1799px) {
        .saturne-container {
            height: 100%;
        }
        
        .saturne-container-inner {
            top: -50%;
            width: 100%;
        }
        
        .saturne-container-inner img {
            top: 90%;
            filter: drop-shadow(0px -100px 20px rgba(95, 164, 198, 0.5));
        }
    }
</style>