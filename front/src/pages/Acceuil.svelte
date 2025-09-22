<script>
    import { onMount } from "svelte";
    import Cloud from "../modules/ui/portfolio/clouds/Cloud.svelte";
    import planet from "../assets/Planet-No-Background.png";
    import Detector from "../modules/ui/portfolio/detection/Detector.svelte";
    import Title from "../modules/ui/portfolio/title/Title.svelte";
    import Saturne from "../modules/ui/portfolio/planet/Saturne.svelte";
    import Stars from "../modules/ui/portfolio/stars/Stars.svelte";
    import { gsap } from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import Bienvenues from "../modules/ui/portfolio/header/Welcome.svelte";
    import Techno from "../modules/ui/portfolio/techno/Techno.svelte";
    import Cockpit from "../modules/ui/portfolio/cockpit/Cockpit.svelte";
    import { initMediaQuery, useMediaQuery } from "../stores/mediaQuery.js";
    import { initLenis } from "../stores/lenis.js";
    let canvas;
    let ctx;
    let atmoOne;
    let nuagesOne;

    // Variables pour la détection étape par étape
    let showDetector = true;

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
            currentIsXlDesktop,
            cleanup: cleanupMediaQueryStores,
        } = useMediaQuery();

        // GSAP ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);

        // Initialiser Lenis dans la page principale
        const lenisInstance = initLenis();
        lenisInstance.on("scroll", ScrollTrigger.update);
        
        // CORRECTION : Lenis a besoin de sa propre boucle requestAnimationFrame
        let rafId = null;
        let isRafActive = true;
        
        function raf(time) {
            if (isRafActive) {
                lenisInstance.raf(time);
                rafId = requestAnimationFrame(raf);
            }
        }
        rafId = requestAnimationFrame(raf);

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
                            trigger: ".h3-en-cours-de-construction",
                            start: "top 0%",
                            end: "bottom 0%",
                            scrub: 1,
                            // markers: true,
                        }
                    })
                    .to(".container-status", {
                        scale: 1.7,
                        border: "1px solid crimson",
                        borderRadius: "15px",
                        boxShadow: "0px 0px 120px 10px crimson",
                        backgroundColor: "transparent",
                        duration: 2,
                        ease: "power2.out",
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

            // Nettoyer le store media query
            cleanupMediaQuery();

            // CORRECTION : Arrêter la boucle requestAnimationFrame de Lenis
            isRafActive = false;
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }

            // Tuer les animations Cloud
            if (cloudAnimation) cloudAnimation.kill();
            if (cloudContentAnimation) cloudContentAnimation.kill();
            if (planetAnimation) planetAnimation.kill();

            // Le composant Stars gère maintenant le nettoyage des event listeners
        };
    });
</script>

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
                    <p>"Status: Détection activée..."</p>
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
        background: rgba(28, 173, 105, 0.219);
        position: relative;
        width: 100%;
        height: 10%;
        padding: 20px;
        border-radius: 15px;
        filter: drop-shadow(0px 2px 35px rgba(110, 239, 34, 0.5));
    }
    .container-detector{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
   
    .container-status {
        position: relative;
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
            position: relative;
            top: -20%;
            left: 0;
            width: 50%;
            height: 50%;
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
        .container-detection-one {
            height: 20%;
            bottom: 0;
        }
        .container-status {
            font-size: clamp(1.3rem, 2.5vw, 1.8rem);
            min-height: 120px;
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
