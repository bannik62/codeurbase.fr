<script>
    import { onMount, onDestroy } from "svelte";
    import Cloud from "../modules/ui/portfolio/clouds/Cloud.svelte";
    import planet from "../assets/Planet-No-Background.png";
    import Detector from "../modules/ui/portfolio/detection/Detector.svelte";
    import Title from "../modules/ui/portfolio/title/Title.svelte";
    import Saturne from "../modules/ui/portfolio/planet/Saturne.svelte";
    import Stars from "../modules/ui/portfolio/stars/Stars.svelte";
    import { gsap } from "gsap";
    import Navbar from "../modules/ui/portfolio/navbar/Navbar.svelte";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import Bienvenues from "../modules/ui/portfolio/header/Welcome.svelte";
    import Techno from "../modules/ui/portfolio/techno/Techno.svelte";
    import Cockpit from "../modules/ui/portfolio/cockpit/Cockpit.svelte";
    import { initMediaQuery, useMediaQuery } from "../stores/mediaQuery.js";
    import { getLenis, stopLenis, startLenis } from "../stores/lenis.js";
    import ciruit from "../assets/background/circuit.svg";
    let canvas;
    let ctx;
    let atmoOne;
    let nuagesOne;
  
    let pStatus;

    // Variables pour la détection étape par étape
    let showDetector = false;

    // Fonctions pour bloquer/débloquer le scroll avec Lenis
    function disableScroll() {
        // Bloquer Lenis
        stopLenis();
        // Bloquer aussi le scroll natif du body pour plus de sécurité
        document.body.style.overflow = 'hidden';
    }

    function enableScroll() {
        // Redémarrer Lenis
        startLenis();
        // Restaurer le scroll natif du body
        document.body.style.overflow = 'auto';
    }

    onDestroy(() => {
        // Forcer le nettoyage de tout
        if (typeof window !== 'undefined') {
            document.body.style.overflow = 'auto';
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            ScrollTrigger.clearMatchMedia();
            // Pas besoin de stopLenis(), il est géré globalement
        }
    });

    onMount(() => {
        // Initialiser l'opacité du texte à 0
        if (pStatus) {
            pStatus.style.opacity = 0;
        }

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
            currentIsXlDesktop,
            cleanup: cleanupMediaQueryStores,
        } = useMediaQuery();

        // GSAP ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);

        // Récupérer l'instance Lenis existante
        const lenisInstance = getLenis();
        
        if (lenisInstance) {
            // Lenis est déjà configuré dans App.svelte
        } else {
            console.warn('[AcceuilPortfolioBis] Aucune instance Lenis trouvée');
        }

        // Forcer un refresh de ScrollTrigger après le chargement complet
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 50);

        // Animation Cloud - Initialisation
        gsap.set(".nuages-one", { opacity: 0, scale: 0.1 });
        gsap.set(".intro-cloud-container", { opacity: 0, scale: 0.1 });

        // OPTIMISATION : Fonction pour créer les animations communes
        function createCloudAnimations(triggerStart, triggerEnd, planetY, planetScale, planetWidth, planetHeight) {
            const cloudAnimation = gsap.to(".nuages-one", {
                opacity: 1,
                scale: 1,
                duration: 2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ".atmo-one",
                    start: triggerStart,
                    end: triggerEnd,
                    toggleActions: "play none none reverse",
                },
            });

            const cloudContentAnimation = gsap.to(".intro-cloud-container", {
                opacity: 1,
                scale: 1,
                duration: 2,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: ".atmo-one",
                    start: triggerStart,
                    end: triggerEnd,
                    toggleActions: "play none none reverse",
                },
            });

            const planetAnimation = gsap.timeline({
                scrollTrigger: {
                    trigger: ".atmo-one",
                    start: triggerStart,
                    end: triggerEnd,
                    scrub: 1,
                },
            });

            planetAnimation
                .to(".atmo-one img", {
                    y: planetY,
                    duration: 1.5,
                    ease: "power2.out",
                })
                .to(".atmo-one img", {
                    scale: planetScale,
                    width: planetWidth,
                    height: planetHeight,
                    duration: 2.0,
                    ease: "power2.out",
                });

            return { cloudAnimation, cloudContentAnimation, planetAnimation };
        }

        // Animation Cloud avec switch selon la taille d'écran
        let cloudAnimation;
        let cloudContentAnimation;
        let planetAnimation;

        switch (currentSize) {
            case "smallMobile":
                // Très petits écrans (≤ 475px)
                ({ cloudAnimation, cloudContentAnimation, planetAnimation } = createCloudAnimations(
                    "top 70%", "bottom 30%", -100, 8.0, "300%", "300%"
                ));

                // Animation directe
                gsap.timeline({
                    scrollTrigger: {
                        trigger: ".h3-en-cours-de-construction",
                        start: "top 50%",
                        endTrigger: ".space-three",
                        end: "bottom 80%",
                        scrub: 1,
                        refreshPriority: -1,
                    },
                })
                    .to(".container-detection-one", {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        ease: "power1.in",
                        onStart: () => {
                            showDetector = true;
                        },
                    })
                    .to(".container-detection-one", {
                        opacity: 1,
                        y: 0,
                        duration: 0.9,
                        ease: "power2.out",
                        onComplete: () => {
                            pStatus.style.opacity = 1;

                        },
                    })
                    .to(
                        ".container-detection-one",
                        {
                            opacity: 1,
                            duration: 0.5,
                            ease: "power2.out",
                            onComplete: () => {
                                disableScroll();
                                showDetector = true;
                            },
                        },
                        1.4
                    );
                break;

            case "mediumMobile":
                // Medium mobile (476px - 767px)
                ({ cloudAnimation, cloudContentAnimation, planetAnimation } = createCloudAnimations(
                    "top 70%", "bottom 30%", -80, 7.0, "280%", "280%"
                ));

                // Animation directe
                gsap.timeline({
                    scrollTrigger: {
                        trigger: ".h3-en-cours-de-construction",
                        start: "top 50%",
                        endTrigger: ".space-three",
                        end: "bottom 80%",
                        scrub: 1,
                        refreshPriority: -1,
                    },
                })
                    .to(".container-detection-one", {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        ease: "power1.in",
                        onStart: () => {
                            showDetector = true;
                        },
                    })
                    .to(".container-detection-one", {
                        opacity: 1,
                        y: 0,
                        duration: 0.9,
                        ease: "power2.out",
                    })
                    .to(
                        ".container-detection-one",
                        {
                            opacity: 1,
                            duration: 0.5,
                            ease: "power2.out",
                            onComplete: () => {
                                showDetector = true;
                            },
                        },
                        1.4
                    );
                break;

            case "mobile":
                // Mobile (768px - 1023px)
                ({ cloudAnimation, cloudContentAnimation, planetAnimation } = createCloudAnimations(
                    "top 70%", "bottom 30%", -60, 6.0, "260%", "260%"
                ));

                // Animation directe
                gsap.timeline({
                    scrollTrigger: {
                        trigger: ".h3-en-cours-de-construction",
                        start: "top 50%",
                        endTrigger: ".space-three",
                        end: "bottom 80%",
                        scrub: 1,
                        refreshPriority: -1,
                    },
                })
                    .to(".container-detection-one", {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        ease: "power1.in",
                        onStart: () => {
                            showDetector = true;
                        },
                    })
                    .to(".container-detection-one", {
                        opacity: 1,
                        y: 0,
                        duration: 0.9,
                        ease: "power2.out",
                    })
                    .to(
                        ".container-detection-one",
                        {
                            opacity: 1,
                            duration: 0.5,
                            ease: "power2.out",
                            onComplete: () => {
                                showDetector = true;
                            },
                        },
                        1.4
                    );
                break;

            case "tablet":
            case "desktop":
                // Tablette et Desktop - Utiliser les valeurs par défaut
                ({ cloudAnimation, cloudContentAnimation, planetAnimation } = createCloudAnimations(
                    "top 70%", "bottom 30%", -50, 5.0, "250%", "250%"
                ));
                break;

            case "largeDesktop":
                // Large Desktop (1400px-1799px)
                ({ cloudAnimation, cloudContentAnimation, planetAnimation } = createCloudAnimations(
                    "top 60%", "bottom 40%", -50, 5.0, "60%", "60%"
                ));

                    gsap.timeline({
                        scrollTrigger: {
                            trigger: ".content-space-two",
                            start: "top +=10%",
                            // endTrigger: ".content-space-two",
                            end: "bottom 70%",
                            // scrub: 1.5,
                            toggleActions: "play none none none",

                        }
                    })
                    .fromTo(".container-status", {
                        scale: 0,
                        opacity: 0,
                        duration: 0.1,
                        ease: "power2.in",
                        y: "0%",
                        onStart: () => {
                            if (pStatus) {
                                pStatus.style.display = "none";
                            }
                        },
                    }, {
                        y: "-180%",
                        scale: 2.5,
                        opacity: 0.3,
                        background: "radial-gradient(circle, transparent 150%, rgba(4, 196, 20, 1) 0%, rgba(39, 71, 0, 0.900) 0%)",
                        borderRadius: "50%",
                        duration: 0.5,
                        position: "absolute",
                        ease: "power2.out",
                        onComplete: () => {
                            if (pStatus) {
                                disableScroll(); // Bloquer le scroll avant d'afficher le détecteur
                                pStatus.style.opacity = 0;
                            }
                        },
                 
                    })
                    
                    .to(".container-status", {
                        y: "100%",
                        duration: 2.5,
                        opacity: 0.6,
                        ease: "power2.out",
                        background: "radial-gradient(circle, transparent 50%, rgba(4, 196, 20, 1) 50%, rgba(39, 71, 0, 1) 50%)",
                        borderRadius: "10%",
                        color: "crimson", 
                        onComplete: () => {
                            if (pStatus) {
                                pStatus.style.opacity = 1;
                            }
                        },
                    })
                    .to(".container-status", {
                        y: "100%",
                        duration: 3.5,
                        opacity: 1,
                        ease: "power2.out",
                        background: "radial-gradient(circle, transparent 0%, rgba(4, 196, 20, 1) 0.001%, rgba(39, 71, 0, 1) 100%)",
                        boxShadow: "0px 0px 100px 10px crimson",
                        padding: "10px", 
                        onComplete: () => {
                            if (pStatus) {
                                pStatus.style.opacity = 1;
                            }
                        },
                    })
                    .to(".container-status", {
                        x: "350%",
                        duration: 1.5,
                        delay: 2, // Ajout d'une pause de 2 secondes
                        scale: 0.5,
                        opacity: 0,
                        ease: "power2.out",
                        border: "0px solid crimson",
                        borderRadius: "10%",
                        boxShadow: "0px 0px 100px 10px crimson",
                        onComplete: () => {
                            disableScroll(); // Bloquer le scroll avant d'afficher le détecteur
                            showDetector = true;
                            setTimeout(() => {
                                showDetector = false;
                                enableScroll(); // Débloquer le scroll après 5 secondes
                            }, 8000);
                        },
                    });
                break;

            case "xlDesktop":
                // XL Desktop (≥1800px)
                ({ cloudAnimation, cloudContentAnimation, planetAnimation } = createCloudAnimations(
                    "top 55%", "bottom 45%", -40, 4.5, "50%", "50%"
                ));
                break;
        }

        
        return () => {
            
            // Nettoyer les abonnements aux stores media query
            cleanupMediaQueryStores();
            cleanupMediaQuery();

            // Pas besoin de nettoyer Lenis, il est géré globalement

            // Tuer toutes les animations GSAP
            if (cloudAnimation) cloudAnimation.kill();
            if (cloudContentAnimation) cloudContentAnimation.kill();
            if (planetAnimation) planetAnimation.kill();
            
            // Nettoyer ScrollTrigger
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            ScrollTrigger.clearMatchMedia();
            
            // Réactiver le scroll
            document.body.style.overflow = 'auto';
            
        };
    });
</script>
<svelte:head>
  <title>Portfolio - CodeurBase</title>
</svelte:head>
<section>
    <div class="content_space">
        <div class="video-container">
            <canvas bind:this={canvas}></canvas>
            <Stars {canvas} bind:ctx />
        </div>

        <Saturne />
        <div class="space-one">
           <Title />
           <Techno />
           <Bienvenues />
        </div>
      
        <div class="space-two">

            <div class="content-space-two">
         
            <div class="container-detection-one">
                <div class="container-status">
                    <p  bind:this={pStatus} class="p-status">Status: Détection activée</p>
                </div>
            </div>

            <div class="container-detector">
                {#if showDetector === true}
                    <Detector />
                {/if}
            </div>        
           </div>
        
        </div>
        
        <div class="space-three">
      
            <div class="atmo-one">
                <div class="nuages-one" bind:this={nuagesOne}>
                    <Cloud />
                </div>
            <img bind:this={atmoOne} src={planet} alt="planet" />
        </div>
    
    </div>
</div>
   

    <!-- <Cockpit /> -->
</section>

<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        color: white;
    }
    section {
        position: relative;
        width: 100vw;
        height: 100%;
    }
    .content_space {
        position: relative;
        width: 100%;
        height: auto;
        overflow: hidden;
    }
    .video-container {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    .video-container canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: block;
        background: rgba(0, 0, 50, 0.1); /* DEBUG: Fond bleu très léger pour voir le canvas */
    }

    .space-one,
    .space-two,
    .space-three {
        position: relative;
        width: 100%;
    }
    .space-one {
        height: 100svh;
    }
    .space-two {
        height: 100svh;
    }
    .space-three {
        position: relative;
        height: 100svh;
        width: 100%;
    }
    .content-space-two {
        position: relative;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    .container-detector {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

    }
    .atmo-one {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        top: 0;
        left: 0%;
        width: 100%;
        height: 50svh;
    }

    .atmo-one img {
        position: absolute;
        top: 0%;
        left: 90%;
        width: 100%;
        height: 150%;
        object-fit: contain; /* ou cover selon ce que tu veux */
        transform-origin: right center;
        transition: transform 1s linear;
        z-index: 5;
        filter: drop-shadow(50px 0px 10px rgba(230, 220, 128, 0.5));
    }
    .nuages-one {

        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 20;
        width: 100%;
        height: 100%;
    }

    @keyframes toInvisible {
        0% {
            top: -10svh;
            opacity: 1;
        }
        100% {
            top: 0;
            opacity: 0;
        }
    }

    .container-detection-one {
        display: flex;
        justify-content: center;
        align-items: center;position: absolute;
        top: 0%;
        left: 0;
        position: relative;
        width: 100%;
        height: 10%;
        padding: 20px;
        border-radius: 15px;
        /* filter: drop-shadow(0px 2px 35px rgba(110, 239, 34, 0.5)); */
    }
    .container-detector{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
   
    .container-status {
        opacity: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: auto;
        min-height: 90px;
        height: auto;
        font-family: "Orbitron", sans-serif;
        font-size: clamp(1rem, 4vw, 1.2rem);
        font-weight: bold;
    }

    .p-status {
        color: crimson;
        font-size: clamp(0.9rem, 4vw, 1.9rem);
    }

    /* ===== MEDIA QUERIES RESPONSIVE ===== */

    /* Très petits écrans (jusqu'à 475px) */
    @media (max-width: 475px) {
        section {
           background-color: black;
        }
        .content_space {
            top: 10vh;
            height: auto;
        }

        .space-one {
            height: 150svh;
        }

        .space-two {
            top: 0%;
            height: 100svh;
        }
        .space-three {
            position: relative;
            width: 100%;
            height: 100svh;
        }
        .atmo-one {
            top:17%;
            height: 100%;
        }
        .atmo-one img {
            left: 0%;
            width: 120%;
            height: clamp(120%, 150%, 170%);
        }
        .nuages-one {
            height: 100%;
        }

        .content-space-two {
            top:27%;
            height: 100%;
            backdrop-filter: blur(5px);
        }
        .container-detection-one {
            width: 90%;
            height: 10%;
            margin: 0 auto;
            top: 10%;
        }
        .container-detector {
            top: 20%;
        }

        .container-status {
            font-size: clamp(0.9rem, 4.5vw, 1.1rem);
            min-height: 150px;
        }
    }

    /* Medium Mobile (476px à 767px) */
    @media (min-width: 476px) and (max-width: 767px) {
        .content_space {
            top: 0;
            height: auto;
        }

        .space-one {
            height: 130svh;
        }

        .space-two {
            height: 100svh;
        }
        .space-three {
            position: relative;
            width: 100%;
            height: 100svh;
        }
        .atmo-one img {
            top: 80%;
            left: 90%;
            width: 100%;
            height: clamp(130%, 140%, 150%);
        }

        .container-detection-one {
            width: 90%;
            height: 30%;
            margin: 0 auto;
            top: -20%;
        }
        .container-status {
            font-size: clamp(1rem, 4vw, 1.2rem);
            min-height: 90px;
        }
    }

    /* Mobile (768px à 1023px) - Correspond à tablet dans mediaQuery.js */
    @media (min-width: 768px) and (max-width: 1023px) {
        .content_space {
            height: auto;
        }

        .space-one {
            height: 120svh;
        }

        .space-two {
            height: 90svh;
        }

        .atmo-one img {
            top: 75%;
            left: 85%;
            width: 90%;
            height: clamp(120%, 130%, 140%);
        }

        .container-detection-one {
            width: 90%;
            height: 30%;
            margin: 0 auto;
            top: -20%;
        }
        .container-status {
            font-size: clamp(1.1rem, 3.5vw, 1.4rem);
            min-height: 100px;
        }
    }

    /* Tablette (1024px à 1399px) - Correspond à desktop dans mediaQuery.js */
    @media (min-width: 1024px) and (max-width: 1399px) {
        .content_space {
            height: auto;
        }

        .space-one {
            height: 130svh;
        }

        .space-two {
            height: 90svh;
        }
        .space-three {
            height: 160dvh;
        }

        .atmo-one img {
            top: 70%;
            left: 80%;
            width: 80%;
            height: clamp(110%, 120%, 130%);
        }

        .container-status {
            font-size: clamp(1.2rem, 3vw, 1.6rem);
            min-height: 110px;
        }
    }

    
    /* Large Desktop (1400px à 1799px) */
    @media (min-width: 1400px) and (max-width: 1799px) {
        .content_space {
            height: auto;
        }

        .space-one {
            height: 400dvh;
        }

        .space-two {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 200dvh;
        }
        .content-space-two {
            /* border: 1px solid green; */
            position: relative;
            top: -25%;
            left: 0;
            width: 50%;
            height: 50%;
        }
        .container-detection-one {
            position: relative;
            left: 0%;
        width: 100%;
        height: 100%;
        top: 0%;
        padding: 20px;
        }
        .container-status {
            font-size: clamp(1.3rem, 2.5vw, 1.8rem);
            min-height: 120px;
        }
    
        .space-three {
            height: 110dvh;
        }
        .atmo-one {
            height: 100%;
        }

        .atmo-one img {
            top: 65%;
            left: 75%;
            width: 70%;
            height: clamp(100%, 110%, 120%);
        }

    }
    
    /* XL Desktop (1800px et plus) */
    @media (min-width: 1800px) {
        .content_space {
            height: auto;
        }

        .space-one {
            height: 90svh;
        }

        .space-two {
            height: 75svh;
        }

        .atmo-one img {
            top: 60%;
            left: 70%;
            width: 60%;
            height: clamp(90%, 100%, 110%);
        }

        .container-status {
            font-size: clamp(1.4rem, 2vw, 2rem);
            min-height: 130px;
        }
    }
</style>
