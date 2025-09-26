<script>
    import { onMount } from 'svelte';   
    import { gsap } from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    import { initMediaQuery, useMediaQuery } from '../../../../stores/mediaQuery.js';
    import { elementsStore, isModuleReady } from '../../../../stores/elements.js';
    import { initTechnoAnimations, cleanupTechnoAnimations } from './animationTechno.js';

    gsap.registerPlugin(ScrollTrigger);

    // Variables pour les éléments bindés
    let technoContainer;
    
    // CORRECTION : Mettre à jour le store des éléments
    $: elementsStore.update(store => ({
        ...store,
        elementOfTechno: {
            technoContainer
        }
    }));
    
    // CORRECTION : S'abonner au store pour accéder aux autres éléments
    let elements;
    const unsubscribeElements = elementsStore.subscribe(store => {
        elements = store;
    });

    // Vérifier si les modules nécessaires sont prêts
    const isBienvenuReady = isModuleReady('elementOfBienvenu');
    const isTechnoReady = isModuleReady('elementOfTechno');

    onMount(() => {
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

        // Initialiser les animations
        let animations = {};
        
        // Fonction pour initialiser les animations quand les éléments sont prêts
        const initAnimations = () => {
            console.log("🔧 Techno - Éléments disponibles:", elements);
            console.log("🔧 Techno - H2Welcome:", elements?.elementOfBienvenu?.h3EnCoursDeConstruction);
            console.log("🔧 Techno - TechnoContainer:", elements?.elementOfTechno?.technoContainer);
            
            if (elements?.elementOfBienvenu?.h2Welcome && elements?.elementOfTechno?.technoContainer && (!animations || Object.keys(animations).length === 0)) {
                animations = initTechnoAnimations(currentSize, elements);
            }
        };

        // Initialiser immédiatement si les éléments sont déjà disponibles
        initAnimations();
        
        // S'abonner aux changements des modules
        const unsubscribeBienvenuReady = isBienvenuReady.subscribe(isReady => {
            if (isReady) {
                initAnimations();
            }
        });
        
        const unsubscribeTechnoReady = isTechnoReady.subscribe(isReady => {
            if (isReady) {
                initAnimations();
            }
        });

        // Fonction de nettoyage
        return () => {
            // Nettoyer les abonnements aux stores media query
            cleanupMediaQueryStores();
            
            // Nettoyer le store media query
            cleanupMediaQuery();
            
            // CORRECTION : Se désabonner du store des éléments
            unsubscribeElements();
            unsubscribeBienvenuReady();
            unsubscribeTechnoReady();
            
            // Tuer les animations
            cleanupTechnoAnimations(animations);
        };
    });
</script>
<section class="sec2">
  <div class="techno-container" bind:this={technoContainer}>
    <div class="box box1 svelte"></div>
    <div class="box box2 js"></div>
    <div class="box box3 css"></div>
    <div class="box box4 docker"></div>
    <div class="box box5 mcp"></div>
  </div>
</section>
<style>
    .sec2 {
        position: relative;
        width: 100%;
        height: 50%;
    }
    .techno-container {
        position: absolute;
        top: 8%;
        left: 7%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
        background-color: #3a3a3c32;
        backdrop-filter: blur(10px);
        width: clamp(70%, 80%, 90%);
        margin: auto;
        margin-top: clamp(2rem, 3rem, 4rem);
        padding: clamp(1rem, 1.5rem, 2rem);
        border-radius: 10px;
    }
    
    .box {
        width: clamp(60px, 80px, 100px);
        height: clamp(60px, 80px, 100px);
        aspect-ratio: 1/1;
        border-radius: 50%;
        margin: 0 clamp(0.5rem, 1rem, 1.5rem);
        padding: 10px;
    }
    
    .svelte {
        background-color: transparent;
        background-image: url('https://logo.svgcdn.com/d/svelte-original-wordmark.svg');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        border: 4px solid crimson;
        background-color: white
    }
    .js {
        background-color: transparent;
        background-image: url('https://images.seeklogo.com/logo-png/26/2/node-js-logo-png_seeklogo-269242.png');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        border: 4px solid crimson;
        background-color: white
    }

    .css {
        background-color: transparent;
        background-image: url('https://t4.ftcdn.net/jpg/00/75/92/23/360_F_75922336_Jz2QgNOx7dnRea9ZI6yQTDtn1vHq5ejF.jpg');
        background-size: auto 90%;
        background-position: center;
        background-repeat: no-repeat;
        border: 4px solid crimson;
        background-color: white
    }


    .docker {
        border: 4px solid crimson;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url('https://static.cdnlogo.com/logos/d/56/docker.svg');
        background-color: white
    }

    .mcp {
        background-color: transparent;
        background-image: url('../../../../assets/mcp.png');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        border: 4px solid crimson;
    }

    /* ===== MEDIA QUERIES RESPONSIVE ===== */
    /* Mobile First - Base styles (jusqu'à 767px) */
    /* Les styles de base sont déjà définis ci-dessus */
    
    /* Très petits écrans (jusqu'à 475px) */
    @media (max-width: 475px) {
        .sec2 {
            top: -3%;
            left: 0%;
            height: 10%;
            width: 100dvw;
        }
        .techno-container {
            flex-direction: row;
            align-items: center;
            margin-top: 2rem;
            padding: 1rem;
        }
        
        .box {
            width: 20px;
            height: 20px;
            margin: 0.5rem 0;
            border: 2px solid crimson;
        }
    }
    
    /* Medium Mobile (476px à 767px) */
    @media (min-width: 476px) and (max-width: 767px) {
        .techno-container {
            width: 85%;
            padding: 1.2rem;
        }
        
        .box {
            width: 65px;
            height: 65px;
            margin: 0 0.8rem;
        }
    }
    
    /* Tablette (768px à 1023px) */
    @media (min-width: 768px) and (max-width: 1023px) {
        .techno-container {
            width: 80%;
            padding: 1.5rem;
        }
        
        .box {
            width: 75px;
            height: 75px;
            margin: 0 1rem;
        }
    }
    
    /* Desktop (1024px à 1399px) */
    @media (min-width: 1024px) and (max-width: 1399px) {
        .sec2 {
            top: 7%;
            height: 10%;
        }
        .techno-container {
            width: 75%;
            padding: 1.8rem;
        }
        
        .box {
            width: 85px;
            height: 85px;
            margin: 0 1.2rem;
        }
    }
    
    /* Large Desktop (1400px à 1799px) */
    @media (min-width: 1400px) and (max-width: 1799px) {
        .sec2 {
            top: 4%;
            left: 0%;
            height: 10%;
            width: 100dvw;
            
        }
        .techno-container {
            position: absolute;
            top: 20%;
            left: 12%;
            margin: 0 auto;
            width: 70%;
            padding: 2rem;
        }
        
        .box {
            width: 95px;
            height: 95px;
            margin: 0 1.5rem;
        }
    }
    
    /* XL Desktop (1800px et plus) */
    @media (min-width: 1800px) {
        .techno-container {
            width: 65%;
            padding: 2.5rem;
        }
        
        .box {
            width: 110px;
            height: 110px;
            margin: 0 2rem;
        }
    }
</style>