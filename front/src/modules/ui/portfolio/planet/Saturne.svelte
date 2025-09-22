<script>
    import { onMount } from "svelte";
    import { gsap } from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import saturne from "../../../../assets/saturne.png";
    import { elementsStore, isModuleReady } from "../../../../stores/elements.js";
    import { initMediaQuery, useMediaQuery } from "../../../../stores/mediaQuery.js";
    import { initSaturneAnimation, cleanupSaturneAnimation } from "./animationsSaturne.js";
    
    gsap.registerPlugin(ScrollTrigger);

    let elements;
    const unsubscribeBienvenu = elementsStore.subscribe(store => {
        elements = store;
    });

    // Vérifier si le module Bienvenu est prêt
    const isBienvenuReady = isModuleReady('elementOfBienvenu');

    onMount(() => {
        console.log("chargé saturne.svelte");
        gsap.registerPlugin(ScrollTrigger);

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

        // Initialiser l'animation de Saturne
        let saturneAnimation = null;
        
        // Fonction pour initialiser l'animation quand les éléments sont prêts
        const initAnimation = () => {
            console.log("Elements disponibles:", elements);
            console.log("contentTextBienvenue:", elements?.elementOfBienvenu?.contentTextBienvenue);
            
            if (elements?.elementOfBienvenu?.contentTextBienvenue && !saturneAnimation) {
                saturneAnimation = initSaturneAnimation(currentSize);
            }
        };

        // Initialiser immédiatement si les éléments sont déjà disponibles
        initAnimation();
        
        // S'abonner aux changements du module Bienvenu
        const unsubscribeBienvenuReady = isBienvenuReady.subscribe(isReady => {
            if (isReady) {
                initAnimation();
            }
        });

        // Fonction de nettoyage
        return () => {
            // Nettoyer les abonnements aux stores media query
            cleanupMediaQueryStores();
            
            // Nettoyer le store media query
            cleanupMediaQuery();
            
            // Tuer l'animation de Saturne si elle existe
            if (saturneAnimation) {
                cleanupSaturneAnimation(saturneAnimation);
            }
            
            // Se désabonner des stores
            unsubscribeBienvenu();
            unsubscribeBienvenuReady();
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
        transform: translate3d(0, 0, -200px); /* Position initiale moins loin */
        position: relative;
        top: 10%; /* Commence plus haut */
        left: 0;
        aspect-ratio: 1/1;
        width: clamp(100px, 80%, 100%);
        height: 100%;
        opacity: 0; /* Commence invisible */
        scale: 0.01; /* Commence très petit (10px) */
        /* backdrop-filter: shadow(50px 0px 10px rgba(230, 220, 128, 0.5)); */
        /* filter: drop-shadow(0px -100px 20px rgba(95, 164, 198, 0.5)); */
        /* opacity: 0.5; */
        animation: graduateFilter 0.1s forwards;
    }
    @keyframes graduateFilter {
        0% {
            filter: 
                drop-shadow(0px 0px 6px rgba(176, 196, 222, 0)) /* Bleu acier pâle */
                drop-shadow(0px 1px 8px rgba(244, 164, 96, 0))   /* Beige sable */
                drop-shadow(0px 2px 10px rgba(230, 230, 250, 0));  /* Lavande pâle */
        }
        25% {
            filter: 
                drop-shadow(-1px -2px 8px rgba(176, 196, 222, 0.15))
                drop-shadow(0px -1px 10px rgba(244, 164, 96, 0.12))
                drop-shadow(1px 0px 12px rgba(230, 230, 250, 0.1))
                drop-shadow(2px 1px 14px rgba(245, 222, 179, 0.08))
                drop-shadow(3px 2px 16px rgba(245, 245, 220, 0.05));
        }
        50% {
            filter: 
                drop-shadow(-2px -3px 10px rgba(176, 196, 222, 0.25))
                drop-shadow(-1px -2px 12px rgba(244, 164, 96, 0.2))
                drop-shadow(0px -1px 14px rgba(230, 230, 250, 0.18))
                drop-shadow(1px 0px 16px rgba(245, 222, 179, 0.15))
                drop-shadow(2px 1px 18px rgba(245, 245, 220, 0.12));
        }
        75% {
            filter: 
                drop-shadow(-3px -4px 12px rgba(176, 196, 222, 0.35))
                drop-shadow(-2px -3px 14px rgba(244, 164, 96, 0.3))
                drop-shadow(-1px -2px 16px rgba(230, 230, 250, 0.25))
                drop-shadow(0px -1px 18px rgba(245, 222, 179, 0.2))
                drop-shadow(1px 0px 20px rgba(245, 245, 220, 0.18));
        }
        100% {
            filter: 
                drop-shadow(-3px -4px 14px rgba(176, 196, 222, 0.4)) /* Bleu acier pâle */
                drop-shadow(-2px -3px 16px rgba(185, 139, 131, 0.35))   /* Brun rosé */
                drop-shadow(-1px -2px 18px rgba(230, 230, 250, 0.3))  /* Lavande pâle */
                drop-shadow(0px -1px 20px rgba(245, 222, 179, 0.25))  /* Blé pâle */
                drop-shadow(1px 0px 22px rgba(245, 245, 220, 0.2));   /* Beige naturel */
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
            /* filter: drop-shadow(0px -80px 15px rgba(95, 164, 198, 0.4)); */
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
            /* filter: drop-shadow(0px -95px 20px rgba(95, 164, 198, 0.5)); */
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
            /* filter: drop-shadow(0px -100px 20px rgba(95, 164, 198, 0.5)); */
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
            position: absolute;
            height: 60dvh;
            top: 30%;
        }
        
        .saturne-container-inner {
            position: absolute;
            top: 50%;
            left: 0%;
            width: 100%;
            height: 100%;
            z-index: -5000;
        }
        
        .saturne-container-inner img {  
            position: absolute;
            left: 0%;
            top: 0%;
            height: 300px;
            width: 300px;
            z-index: -5000;

        }
    }
</style>