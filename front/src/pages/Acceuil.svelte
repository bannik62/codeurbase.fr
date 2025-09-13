<script>
    import { onMount } from "svelte";
    import Cloud from "../modules/ui/clouds/Cloud.svelte";
    import planet from "../assets/Planet-No-Background.png";
    import Detector from "../modules/ui/detection/Detector.svelte";
    import Title from "../modules/ui/title/Title.svelte";
    import Saturne from "../modules/ui/planet/Saturne.svelte";
    import { gsap } from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import Bienvenues from "../modules/ui/header/Bienvenues.svelte";
    import Cockpit from "../modules/ui/cockpit/Cockpit.svelte";
    import { 
        initMediaQuery, 
        isSmallMobile,
        isMediumMobile, 
        isMobile, 
        isTablet, 
        isDesktop, 
        isLargeDesktop,
        screenWidth,
        screenHeight
    } from "../stores/mediaQuery.js";
    import { initLenis } from "../stores/lenis.js";
    let canvas;
    let ctx;
    let atmoOne;
    let nuagesOne;

    // Variables pour la détection étape par étape
    let showDetector = false;
    let status = "";

    // Variables pour les étoiles
    const stars = [];
    const numStars = 400;
    const baseSpeed = 2;
    let currentSpeed = baseSpeed;
    let curve = 0;
    let showDetctector = false;

    function initStars() {
        stars.length = 0;
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: (Math.random() - 0.5) * window.innerWidth,
                y: (Math.random() - 0.5) * window.innerHeight,
                z: Math.random() * window.innerWidth,
            });
        }
    }

    function drawStars() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let star of stars) {
            star.z -= currentSpeed;
            if (star.z <= 0) {
                star.z = window.innerWidth;
                star.x = (Math.random() - 0.5) * window.innerWidth;
                star.y = (Math.random() - 0.5) * window.innerHeight;
            }

            let sx =
                (star.x / star.z) * canvas.width +
                canvas.width / 2 +
                curve * 100;
            let sy = (star.y / star.z) * canvas.height + canvas.height / 2;

            if (sx < 0 || sx >= canvas.width || sy < 0 || sy >= canvas.height)
                continue;

            let size = Math.max(0, 2 - star.z / 400);
            let shade = 255 - Math.min(255, star.z / 2);
            ctx.fillStyle = `rgb(${shade},${shade},255)`;
            ctx.shadowColor = "white";
            ctx.shadowBlur = 6;

            ctx.beginPath();
            ctx.arc(sx, sy, size, 0, Math.PI * 2);
            ctx.fill();
        }
        requestAnimationFrame(drawStars);
    }
    // Fonction simplifiée pour les étoiles
    function updateStars() {
        const scrollPos = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        currentSpeed = baseSpeed * (1 - (scrollPos / maxScroll) * 0.1);
        curve = scrollPos / maxScroll - 1;
    }

    onMount(() => {
        // Initialiser Lenis
        const lenis = initLenis();
        lenis.on("scroll", ScrollTrigger.update);
        
        // Initialiser le store media query
        const cleanupMediaQuery = initMediaQuery();
        
        // Variables pour stocker les valeurs des stores
        let currentIsSmallMobile, currentIsMediumMobile, currentIsMobile, currentIsTablet, currentIsDesktop, currentIsLargeDesktop;
        
        // S'abonner aux stores pour obtenir les valeurs actuelles
        const unsubscribeSmallMobile = isSmallMobile.subscribe(value => currentIsSmallMobile = value);
        const unsubscribeMediumMobile = isMediumMobile.subscribe(value => currentIsMediumMobile = value);
        const unsubscribeMobile = isMobile.subscribe(value => currentIsMobile = value);
        const unsubscribeTablet = isTablet.subscribe(value => currentIsTablet = value);
        const unsubscribeDesktop = isDesktop.subscribe(value => currentIsDesktop = value);
        const unsubscribeLargeDesktop = isLargeDesktop.subscribe(value => currentIsLargeDesktop = value);

        // Initialiser le canvas
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx = canvas.getContext("2d");

        initStars();
        drawStars();

        // Gestion du resize
        window.addEventListener("resize", () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars();
        });

        // Scroll pour les étoiles
        window.addEventListener("scroll", updateStars);
        
        // GSAP ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);
        
        // Animation Cloud - Initialisation
        gsap.set(".nuages-one", { opacity: 0, scale: 0.1 });
        gsap.set(".intro-cloud-container", { opacity: 0, scale: 0.1 });
        
        // TEST MANUEL - Animation directe
        setTimeout(() => {
            gsap.to(".nuages-one", {
                opacity: 1,
                scale: 1,
                duration: 2,
                ease: "power2.out"
            });
        }, 1000);
        
        // Déterminer la taille d'écran actuelle
        let currentSize;
        if (currentIsSmallMobile) currentSize = 'smallMobile';
        else if (currentIsMediumMobile) currentSize = 'mediumMobile';
        else if (currentIsMobile) currentSize = 'mobile';
        else if (currentIsTablet) currentSize = 'tablet';
        else if (currentIsDesktop) currentSize = 'desktop';
        else if (currentIsLargeDesktop) currentSize = 'largeDesktop';

        // Animation Cloud avec switch selon la taille d'écran
        let cloudAnimation;
        let cloudContentAnimation;
        let planetAnimation;
        
        switch (currentSize) {
            case 'smallMobile':
                // Très petits écrans (≤ 475px)
                cloudAnimation = gsap.to(".nuages-one", {
                    opacity: 1,
                    scale: 1,
                    duration: 2,
                    ease: "power2.out",
                    markers: true,
                    scrollTrigger: {
                        trigger: ".atmo-one",
                        start: "top 90%",
                        end: "bottom 10%",
                        toggleActions: "play none none reverse",
                    }
                });
                
                cloudContentAnimation = gsap.to(".intro-cloud-container", {
                    opacity: 1,
                    scale: 1,
                    duration: 2,
                    ease: "back.out(1.7)",
                    scrollTrigger: {
                        trigger: ".atmo-one",
                        start: "top 90%",
                        end: "bottom 10%",
                        toggleActions: "play none none reverse"
                    }
                });
                
                // Animation parallaxe planète
                planetAnimation = gsap.timeline({
                    scrollTrigger: {
                        trigger: ".atmo-one",
                        start: "top 90%",
                        end: "bottom 10%",
                        scrub: 1
                    }
                });
                
                planetAnimation
                    .to(".atmo-one img", {
                        y: -100,
                        duration: 1.5,
                        ease: "power2.out"
                    })
                    .to(".atmo-one img", {
                        scale: 8.0,
                        width: "300%",
                        height: "300%",
                        duration: 2.0,
                        ease: "power2.out"
                    });

                    gsap.timeline( { 
                          scrollTrigger: {
                            trigger: ".container-detection",
                            start: "top 80%",
                            end: "bottom 0%",
                            scrub: 1,
                            pin: true,
                            toggleActions: "play none none reverse",
                        }
                    })
                    .fromTo(".container-detection", 
                    { 
                        opacity: 0,
                        y: 0,
                    },{ 
                        opacity: 1,
                        y: -0,
                        duration: 2,
                        ease: "power2.out",
                    }).to(".container-detection", {
                        opacity: 0,
                        y: 0,
                        duration: 0.5,
                        ease: "power2.out",
                    }).to(".container-detection", {
                        duration: 0.5,
                        ease: "power2.out",
                        onComplete: () => {
                            setTimeout(() => {
                                showDetctector = true;
                            }, 2000);
                            lenis.stop();
                        }
                    });
        
                break;

            case 'mediumMobile':
                // Medium mobile (476px - 767px) - Vide
                break;

            case 'mobile':
                // Mobile (768px - 1023px) - Vide
                break;

            case 'tablet':
                // Tablette (1024px - 1399px) - Vide
                break;

            case 'desktop':
                // Desktop (1400px+) - Vide
                break;

            case 'largeDesktop':
                // Large Desktop (≥1600px) - Vide
                break;
        }
        

           
        

        return () => {
            // Nettoyer les abonnements aux stores
            unsubscribeSmallMobile();
            unsubscribeMediumMobile();
            unsubscribeMobile();
            unsubscribeTablet();
            unsubscribeDesktop();
            unsubscribeLargeDesktop();
            
            // Nettoyer le store media query
            cleanupMediaQuery();
            
            // Tuer les animations Cloud
            if (cloudAnimation) cloudAnimation.kill();
            if (cloudContentAnimation) cloudContentAnimation.kill();
            if (planetAnimation) planetAnimation.kill();
            
            // Nettoyer les event listeners
            window.removeEventListener("resize", () => {});
            window.removeEventListener("scroll", updateStars);
        };
  });
    ;
</script>

<section>
    <div class="content_space">
        <div class="video-container">
            <canvas bind:this={canvas} ></canvas>
        </div>

        <div class="space-one">
            <!-- <div class="repéres" style="position: absolute; top: -20; left: 0; z-index: 1000; color: red;">space-one top</div>    -->
            <Title />
            <Saturne />
            <Bienvenues />
        </div>
        <div class="space-two">
             <!-- <div class="repéres" style="position: absolute; top: 0; left: 0; z-index: 1000; color: yellow;">space-two top</div>    -->
        </div>
        <div class="space-three">
                <div class="container-detection">
                    <div class="container-status">
                        <p>"Status: Détection activée..."</p>
                    </div>
                </div>
                <!-- {#if showDetctector === true}
                <Detector/>
                {/if} -->
*        </div>
        <div class="atmo-one">
            <div
                class="nuages-one" bind:this={nuagesOne}>
                    <Cloud />
            </div>
            <img bind:this={atmoOne} src={planet} alt="planet" />
        </div>
    </div>


    <Cockpit />
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
        height: auto;
    }
    .content_space {
        position: absolute;
        inset: 0;
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
    }
    .space-one {
        /* border: 1px solid red; */
        height: 150dvh;
    }
    .space-two {
        /* border: 1px solid yellow; */
        height: 110dvh;
    }
    .space-three {
        position: relative;
        height: 100dvh;
        /* background: rgba(0, 255, 0, 0.05); */
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }



    .atmo-one {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        top:0;
        left: 0%;
        width: 100%;
        height: 50vh;
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
        display: flex;
        align-items: center;
        justify-content: center;
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
        top: -10vh;
        opacity: 1;
    }
    100% {
        top: 0;
        opacity: 0;
    }
}

    @keyframes toInvisible {
        0% {
            top: -10vh;
            opacity: 1;
        }
        100% {
            top: 0;
            opacity: 0;
        }
    }

    .container-detection {
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid yellow;
        background: rgba(28, 173, 105, 0.219);
        position: relative;
        width: 100%;
        height: 10%;
        padding: 20px;
        border-radius: 15px;
        filter: drop-shadow(0px -80px 15px rgba(110, 239, 34, 0.5));

    }
    .container-detection:after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 15px;
        z-index: 1000;
        border-left: 1px solid rgb(28, 173, 105);
        border-right: 1px solid rgba(28, 173, 105);
        border-top: 1px solid rgba(28, 173, 105, 0.219);
        border-bottom: 1px solid rgba(28, 173, 105, 0.219);

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
        filter: drop-shadow(10px 0 10px rgba(110, 239, 34, 0.5));
    }

    /* ===== MEDIA QUERIES RESPONSIVE ===== */
    
    /* Très petits écrans (jusqu'à 475px) */
    @media (max-width: 475px) {
        .content_space {
            height: 450dvh;
        }
        
        .space-one {
            height: 120dvh;
        }
        
        .space-two {
            height: 120dvh;
        }
        .space-three {
            bottom: 0;
            height: 50dvh;
        }
        .atmo-one {
            /* border: 1px solid blue; */
            height: 100%;
        }
        .atmo-one img {
            top: 0%;
            left: 0%;
            width: 120%;
            height: 170%;
        }
        .nuages-one {
            height: 60%;
        }
        
        .container-status {
            font-size: clamp(0.9rem, 4.5vw, 1.1rem);
            min-height: 80px;
        }
    }
    
    /* Medium Mobile (476px à 767px) */
    @media (min-width: 476px) and (max-width: 767px) {
        .content_space {
            height: 420dvh;
        }
        
        .space-one {
            height: 150dvh;
        }
        
        .space-two {
            height: 110dvh;
        }
        .space-three {
            bottom: 0;
            height: 100dvh;
        }
        .atmo-one img {
            top: 80%;
            left: 90%;
            width: 100%;
            height: 150%;
        }
   
        
        .container-status {
            font-size: clamp(1rem, 4vw, 1.2rem);
            min-height: 90px;
        }
    }
    
    /* Mobile (768px à 1023px) */
    @media (min-width: 768px) and (max-width: 1023px) {
        .content_space {
            height: 380dvh;
        }
        
        .space-one {
            height: 140dvh;
        }
        
        .space-two {
            height: 100dvh;
        }
        
        .atmo-one img {
            top: 75%;
            left: 85%;
            width: 90%;
            height: 140%;
        }
        
        
        .container-status {
            font-size: clamp(1.1rem, 3.5vw, 1.4rem);
            min-height: 100px;
        }
    }
    
    /* Tablette (1024px à 1399px) */
    @media (min-width: 1024px) and (max-width: 1399px) {
        .content_space {
            height: 350dvh;
        }
        
        .space-one {
            height: 130dvh;
        }
        
        .space-two {
            height: 90dvh;
        }
        
        .atmo-one img {
            top: 70%;
            left: 80%;
            width: 80%;
            height: 130%;
        }
        
        
        .container-status {
            font-size: clamp(1.2rem, 3vw, 1.6rem);
            min-height: 110px;
        }
    }
    
    /* Desktop (1400px et plus) */
    @media (min-width: 1400px) {
        .content_space {
            height: 320dvh;
        }
        
        .space-one {
            height: 100dvh;
        }
        
        .space-two {
            height: 80dvh;
        }
        
        .atmo-one img {
            top: 65%;
            left: 75%;
            width: 70%;
            height: 120%;
        }
        
        
        .container-status {
            font-size: clamp(1.3rem, 2.5vw, 1.8rem);
            min-height: 120px;
        }
    }

</style>
