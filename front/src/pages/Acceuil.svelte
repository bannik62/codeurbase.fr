<script>
    import { onMount } from "svelte";
    import Cloud from "../modules/ui/clouds/Cloud.svelte";
    import planet from "../assets/Planet-No-Background.png";
    import Detector from "../modules/ui/detection/Detector.svelte";
    import Title from "../modules/ui/title/Title.svelte";
    import Saturne from "../modules/ui/planet/Saturne.svelte";
    import Stars from "../modules/ui/stars/Stars.svelte";
    import { gsap } from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import Bienvenues from "../modules/ui/header/Welcome.svelte";
    import Techno from "../modules/ui/techno/Techno.svelte";
    import Cockpit from "../modules/ui/cockpit/Cockpit.svelte";
    import { initMediaQuery, useMediaQuery } from "../stores/mediaQuery.js";
    import {
        initLenis,
        stopLenis,
        startLenis,
        lenis,
    } from "../stores/lenis.js";
    let canvas;
    let ctx;
    let atmoOne;
    let nuagesOne;

    // Variables pour la détection étape par étape
    let showDetector = true;

    let hasTriggered = false; // Protection contre les déclenchements multiples

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
        // Animation loop pour Lenis
        function raf(time) {
            lenisInstance.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Forcer un refresh de ScrollTrigger après le chargement complet
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 50);

        // Animation Cloud - Initialisation
        gsap.set(".nuages-one", { opacity: 0, scale: 0.1 });
        gsap.set(".intro-cloud-container", { opacity: 0, scale: 0.1 });


        // Animation Cloud avec switch selon la taille d'écran
        let cloudAnimation;
        let cloudContentAnimation;
        let planetAnimation;

        switch (currentSize) {
            case "smallMobile":
                // Très petits écrans (≤ 475px)
                cloudAnimation = gsap.to(".nuages-one", {
                    opacity: 1,
                    scale: 1,
                    duration: 2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".atmo-one",
                        start: "top 70%",
                        end: "bottom 30%",
                        toggleActions: "play none none reverse",
                    },
                });

                cloudContentAnimation = gsap.to(".intro-cloud-container", {
                    opacity: 1,
                    scale: 1,
                    duration: 2,
                    ease: "back.out(1.7)",
                    scrollTrigger: {
                        trigger: ".atmo-one",
                        start: "top 70%",
                        end: "bottom 30%",
                        toggleActions: "play none none reverse",
                    },
                });

                // Animation parallaxe planète
                planetAnimation = gsap.timeline({
                    scrollTrigger: {
                        trigger: ".atmo-one",
                        start: "top 70%",
                        end: "bottom 30%",
                        scrub: 1,
                    },
                });

                planetAnimation
                    .to(".atmo-one img", {
                        y: -100,
                        duration: 1.5,
                        ease: "power2.out",
                    })
                    .to(".atmo-one img", {
                        scale: 8.0,
                        width: "300%",
                        height: "300%",
                        duration: 2.0,
                        ease: "power2.out",
                    });

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
                            console.log(
                                "Animation de démarrage:",
                                showDetector
                            );
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
                                console.log(
                                    "Animation terminée:",
                                    showDetector
                                );
                            },
                        },
                        1.4
                    );
                break;

            case "mediumMobile":
                // Medium mobile (476px - 767px)
                cloudAnimation = gsap.to(".nuages-one", {
                    opacity: 1,
                    scale: 1,
                    duration: 2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".atmo-one",
                        start: "top 70%",
                        end: "bottom 30%",
                        toggleActions: "play none none reverse",
                    },
                });

                cloudContentAnimation = gsap.to(".intro-cloud-container", {
                    opacity: 1,
                    scale: 1,
                    duration: 2,
                    ease: "back.out(1.7)",
                    scrollTrigger: {
                        trigger: ".atmo-one",
                        start: "top 70%",
                        end: "bottom 30%",
                        toggleActions: "play none none reverse",
                    },
                });

                // Animation parallaxe planète
                planetAnimation = gsap.timeline({
                    scrollTrigger: {
                        trigger: ".atmo-one",
                        start: "top 70%",
                        end: "bottom 30%",
                        scrub: 1,
                    },
                });

                planetAnimation
                    .to(".atmo-one img", {
                        y: -80,
                        duration: 1.5,
                        ease: "power2.out",
                    })
                    .to(".atmo-one img", {
                        scale: 7.0,
                        width: "280%",
                        height: "280%",
                        duration: 2.0,
                        ease: "power2.out",
                    });

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
                cloudAnimation = gsap.to(".nuages-one", {
                    opacity: 1,
                    scale: 1,
                    duration: 2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".atmo-one",
                        start: "top 70%",
                        end: "bottom 30%",
                        toggleActions: "play none none reverse",
                    },
                });

                cloudContentAnimation = gsap.to(".intro-cloud-container", {
                    opacity: 1,
                    scale: 1,
                    duration: 2,
                    ease: "back.out(1.7)",
                    scrollTrigger: {
                        trigger: ".atmo-one",
                        start: "top 70%",
                        end: "bottom 30%",
                        toggleActions: "play none none reverse",
                    },
                });

                // Animation parallaxe planète
                planetAnimation = gsap.timeline({
                    scrollTrigger: {
                        trigger: ".atmo-one",
                        start: "top 70%",
                        end: "bottom 30%",
                        scrub: 1,
                    },
                });

                planetAnimation
                    .to(".atmo-one img", {
                        y: -60,
                        duration: 1.5,
                        ease: "power2.out",
                    })
                    .to(".atmo-one img", {
                        scale: 6.0,
                        width: "260%",
                        height: "260%",
                        duration: 2.0,
                        ease: "power2.out",
                    });

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
                // Tablette (1024px - 1399px) - Vide
                break;

            case "desktop":
                // Desktop (1400px+) - Vide
                break;

            case "largeDesktop":
                // Large Desktop (1400px-1799px)
                cloudAnimation = gsap.to(".nuages-one", {
                    opacity: 1,
                    scale: 1,
                    duration: 2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".atmo-one",
                        start: "top 60%",
                        end: "bottom 40%",
                        toggleActions: "play none none reverse",
                    },
                });

                cloudContentAnimation = gsap.to(".intro-cloud-container", {
                    opacity: 1,
                    scale: 1,
                    duration: 2,
                    ease: "back.out(1.7)",
                    scrollTrigger: {
                        trigger: ".atmo-one",
                        start: "top 60%",
                        end: "bottom 40%",
                        toggleActions: "play none none reverse",
                    },
                });

                // Animation parallaxe planète
                planetAnimation = gsap.timeline({
                    scrollTrigger: {
                        trigger: ".atmo-one",
                        start: "top 60%",
                        end: "bottom 40%",
                        scrub: 1.2,
                    },
                });

                planetAnimation
                    .to(".atmo-one img", {
                        y: -50,
                        duration: 1.5,
                        ease: "power2.out",
                    })
                    .to(".atmo-one img", {
                        scale: 5.0,
                        width: "60%",
                        height: "60%",
                        duration: 2.0,
                        ease: "power2.out",
                    });

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
                        onStart: () => {console.log("animation de la container-detection-one")},
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
                cloudAnimation = gsap.to(".nuages-one", {
                    opacity: 1,
                    scale: 1,
                    duration: 2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".atmo-one",
                        start: "top 55%",
                        end: "bottom 45%",
                        toggleActions: "play none none reverse",
                    },
                });

                cloudContentAnimation = gsap.to(".intro-cloud-container", {
                    opacity: 1,
                    scale: 1,
                    duration: 2,
                    ease: "back.out(1.7)",
                    scrollTrigger: {
                        trigger: ".atmo-one",
                        start: "top 55%",
                        end: "bottom 45%",
                        toggleActions: "play none none reverse",
                    },
                });

                // Animation parallaxe planète
                planetAnimation = gsap.timeline({
                    scrollTrigger: {
                        trigger: ".atmo-one",
                        start: "top 55%",
                        end: "bottom 45%",
                        scrub: 1.5,
                    },
                });

                planetAnimation
                    .to(".atmo-one img", {
                        y: -40,
                        duration: 1.5,
                        ease: "power2.out",
                    })
                    .to(".atmo-one img", {
                        scale: 4.5,
                        width: "50%",
                        height: "50%",
                        duration: 2.0,
                        ease: "power2.out",
                    });
                break;
        }

        return () => {
            // Nettoyer les abonnements aux stores media query
            cleanupMediaQueryStores();

            // Nettoyer le store media query
            cleanupMediaQuery();

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
    }

    .space-one,
    .space-two,
    .space-three {
        position: relative;
        width: 100%;
    }
    .space-one {
        /* border: 1px solid red; */
        height: 100svh;
    }
    .space-two {
        height: 100svh;
    }
    .space-three {
        position: relative;
        height: 100svh;
        width: 100%;
        /* background: rgba(0, 255, 0, 0.05); */
        /* display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;  */
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
        /* z-index: 10; */
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
        /* GSAP gère l'animation, pas de transition CSS */
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
        /* border: 1x solid yellow; */
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
        /* filter: drop-shadow(10px 0 10px rgba(110, 239, 34, 0.5)); */
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
            /* border: solid 1px red; */
            
        }

        .space-two {
            /* border: solid 1px yellow; */
            top: 0%;
            height: 100svh;
        }
        .space-three {
            /* border:solid 1px orange; */
            /* display:flex; */
            position: relative;
            width: 100%;
            height: 100svh;
        }
        .atmo-one {
            top:17%;
            /* border: 1px solid blue; */
            height: 100%;
        }
        .atmo-one img {
            /* top: -50%; */
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

    /* Desktop (1024px à 1399px) */
    @media (min-width: 1024px) and (max-width: 1399px) {
        .content_space {
            height: auto;
        }

        .space-one {
            border: 1px solid yellow;
            height: 200dvh;
        }

        .space-two {
            border: 1px solid orange;
            height:160dvh;
        }
        .space-three {
            border: 1px solid green;
            height: 160dvh;
        }

        .atmo-one img {
            top: 65%;
            left: 75%;
            width: 70%;
            height: clamp(100%, 110%, 120%);
        }

        .container-status {
            font-size: clamp(1.3rem, 2.5vw, 1.8rem);
            min-height: 120px;
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
            /* border: 1px solid red; */
            height: 200dvh;
        }
        .content-space-two {
            /* border: 1px solid blue; */
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
