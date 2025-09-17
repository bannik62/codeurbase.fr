<script>
    import { onMount } from "svelte";
    import { gsap } from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import Splitting from "splitting";
    import { initMediaQuery, useMediaQuery } from "../../../stores/mediaQuery.js";
    import { elementsStore } from "../../../stores/elements.js";
    import { initWelcomeAnimations, cleanupWelcomeAnimations } from "./animationsWelcome.js";

    // Variables pour les éléments bindés
    let containerGlobalTextBienvenue;
    let h2Welcome;
    let h3InMyWorld;
    let contentTextBienvenue;
    let pBienvenue;
    let h3EnCoursDeConstruction;


    // Mettre à jour le store des éléments de façon réactive
    $: elementsStore.update(store => ({
        ...store,
        elementOfBienvenu: {
            containerGlobalTextBienvenue,
            h2Welcome,
            h3InMyWorld,
            contentTextBienvenue,
            pBienvenue,
            h3EnCoursDeConstruction
        }
    }));
    let elements;

         elementsStore.subscribe(store => {
            elements = store;
        });

    onMount(() => {
        gsap.registerPlugin(ScrollTrigger);
        
        const cleanupMediaQuery = initMediaQuery();
        
        // Appliquer Splitting et stocker le résultat
        let selection = Splitting();
        
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



        // Animations selon la taille d'écran
        let animations = {};

        // currentSize est déjà déterminé par useMediaQuery()
        setTimeout(() => {
            animations = initWelcomeAnimations(currentSize, elements, selection);

        }, 100);

        // Fonction de nettoyage
        return () => {
            // Nettoyer les abonnements aux stores media query
            cleanupMediaQueryStores();
            
            // Nettoyer le store media query
            cleanupMediaQuery();
            
            // Tuer les animations
            cleanupWelcomeAnimations(animations);
        };
    });
</script>

<div class="container-global-text-bienvenue" bind:this={containerGlobalTextBienvenue}>

    <h2 class="h2-welcome" bind:this={h2Welcome}>Welcome</h2>
    <h3 class="h3-in-my-world" bind:this={h3InMyWorld}>In my world</h3>
    <div class="content-text-bienvenue" bind:this={contentTextBienvenue}>
        <p class="p-bienvenue" data-splitting bind:this={pBienvenue}>
            Bienvenue sur <span class="red">CodeurBase</span>.<br /><br />
            Cet espace est mon laboratoire numérique personnel, où je partage à la
            fois mes projets, mes expériences et mes découvertes dans le développement
            web. Ici, tu trouveras :<br /><br />

            📝 <span class="red">Un blog</span> pour explorer des sujets techniques, des tutos et des
            réflexions autour du code.<br /><br />

            💼 <span class="red">Un portfolio</span> pour découvrir mes réalisations et mon parcours.<br
            />

            🚀 Un espace d'expérimentation où j'expérimente de nouvelles
            technologies et outils.<br /><br />

            Mon objectif est simple : créer, apprendre et partager. Bonne visite
            et bienvenue dans mon univers digital. <br /><span class="span-globe">🌐</span><br />
        </p>
        <h3 class="h3-en-cours-de-construction" style="font-size: clamp(1rem, 6.5vw, 4rem);color: crimson;" bind:this={h3EnCoursDeConstruction}>
            en cours de construction
        </h3>
    </div>
</div>

<style>

    .container-global-text-bienvenue {
        position: relative;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        top: 20%;
        left: 0%;
        width: 99%;
        height: 100%;   
        /* overflow: hidden; */
    }
    .h2-welcome {
        position: absolute;
        top: 0%;
        left: 0%;
        font-family: "Orbitron", cursive;
        text-transform: uppercase;
        color: crimson !important;
        font-size: clamp(2rem, 16.3vw, 10rem);
        font-weight: 800;
        margin: 0;
        /* opacity: 0.5; */
        /* will-change: transform; */
        transform-origin: bottom bottom;
    }
    .h3-in-my-world {
        font-family: "Orbitron", "Bungee Shade", cursive;
        font-size: clamp(1rem, 15vw, 4rem);
        font-weight: 800;
        color: crimson;
        margin: 0;

      
    }
    .content-text-bienvenue {
        position: absolute;
        top: 45%;
        left: 0;
        width: 100%;
        height: 50svh;
        max-height: 90svh;
    }
    .content-text-bienvenue p {
        font-family: "Orbitron", cursive;
        font-size: clamp(0.9rem, 4.2vw, 2.5rem);
        font-weight: 800;
        margin: 0;
        opacity: 1;
        /* Perspective 3D pour voir les rotations */
        perspective: 1000px;
        transform-style: preserve-3d;
    }

    .h3-en-cours-de-construction {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;

        width: 100%;
        height: 10%;
    }
    .red {
        color: crimson;
    }
    .span-globe {
        position: relative;
        bottom: -2%;
        left: 0;
        font-size: clamp(1rem, 10vw, 4rem);
        height: 100%;
    }

    /* ===== MEDIA QUERIES RESPONSIVE ===== */
    /* Mobile First - Base styles (jusqu'à 767px) */
    /* Les styles de base sont déjà définis ci-dessus */
    
    /* Très petits écrans (jusqu'à 475px) */
    @media (max-width: 475px) {      
     
        .container-global-text-bienvenue {
            top: 0;
            height: 100%;
        }
        .container-global-text-bienvenue h2 {
            top: 20%;
            left: -200%;
            z-index: 5000;
        }
        .h3-in-my-world {
            position: relative;
            top: -8%;
            left: 0;
     
        }
        .content-text-bienvenue {
            /* border: 1px solid blue; */
            background-color: rgba(34, 33, 33, 0.128);
            backdrop-filter: blur(3px);
            top: 42%;
            height: 100svh;
        }
        .content-text-bienvenue p {
            position: relative;
            top: 0;
            left: 0;
            width: 100%;
            height: auto;
            min-height: 100%;
            line-height: 1.8;
        }
        .h3-en-cours-de-construction {
            background-color: rgba(28, 173, 105, 0.219);  
            bottom :0px;
            z-index: 1000;
        }
        .span-globe {
        position: absolute;
        bottom: 90px;
        left: 40%;
        height: clamp(60px, 8vw, 100px);
        width: clamp(60px, 8vw, 100px);
    }
  
    }
    
    /* Medium Mobile (476px à 767px) */
    @media (min-width: 476px) and (max-width: 767px) {
    }
    
    /* Tablette (768px à 1023px) */
    @media (min-width: 768px) and (max-width: 1023px) {
        .container-global-text-bienvenue {
            top: 25%; /* Ajustement pour tablette */
        }
        
        .container-global-text-bienvenue h2 {
            top: 20%; /* Ajustement pour tablette */
        }
        
        .content-text-bienvenue {
            top: 52%; /* Ajustement pour tablette */
        }
    }
    
    /* Desktop (1024px à 1399px) */
    @media (min-width: 1024px) and (max-width: 1399px) {
        .container-global-text-bienvenue {
            top: 30%; /* Ajustement pour desktop */
        }
        
        .container-global-text-bienvenue h2 {
            top: 25%; /* Ajustement pour desktop */
        }
        
        .content-text-bienvenue {
            top: 55%; /* Ajustement pour desktop */
        }
    }
    
    /* Large Desktop (1400px et plus) */
    @media (min-width: 1400px) {
        .container-global-text-bienvenue {
            top: 35%; /* Ajustement pour large desktop */
        }
        
        .container-global-text-bienvenue h2 {
            top: 30%; /* Ajustement pour large desktop */
        }
        
        .content-text-bienvenue {
            top: 60%; /* Ajustement pour large desktop */
        }
    }
</style>
