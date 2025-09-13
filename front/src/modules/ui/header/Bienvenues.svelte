<script>
    import { onMount } from "svelte";
    import { gsap } from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import Splitting from "splitting";
    import { initLenis } from "../../../stores/lenis.js";
    import { 
        initMediaQuery, 
        isSmallMobile,
        isMediumMobile, 
        isMobile, 
        isTablet, 
        isDesktop, 
        isLargeDesktop,
        screenWidth,
        screenHeight,
    } from "../../../stores/mediaQuery.js";

    onMount(() => {
        gsap.registerPlugin(ScrollTrigger);
        
        // Initialiser Lenis via le store
        const lenis = initLenis();
        lenis.on("scroll", ScrollTrigger.update);
        
        // Initialiser le store media query
        const cleanupMediaQuery = initMediaQuery();
        
        // Appliquer Splitting et stocker le résultat
        let selection = Splitting();
        
        // Variables pour stocker les valeurs des stores
        let currentIsSmallMobile,
            currentIsMediumMobile,
            currentIsMobile,
            currentIsTablet,
            currentIsDesktop,
            currentIsLargeDesktop;
        
        // S'abonner aux stores pour obtenir les valeurs actuelles
        const unsubscribeSmallMobile = isSmallMobile.subscribe(
            (value) => (currentIsSmallMobile = value)
        );
        const unsubscribeMediumMobile = isMediumMobile.subscribe(
            (value) => (currentIsMediumMobile = value)
        );
        const unsubscribeMobile = isMobile.subscribe(
            (value) => (currentIsMobile = value)
        );
        const unsubscribeTablet = isTablet.subscribe(
            (value) => (currentIsTablet = value)
        );
        const unsubscribeDesktop = isDesktop.subscribe(
            (value) => (currentIsDesktop = value)
        );
        const unsubscribeLargeDesktop = isLargeDesktop.subscribe(
            (value) => (currentIsLargeDesktop = value)
        );

        console.log("Taille d'écran détectée:", {
            isSmallMobile: currentIsSmallMobile,
            isMediumMobile: currentIsMediumMobile,
            isMobile: currentIsMobile,
            isTablet: currentIsTablet,
            isDesktop: currentIsDesktop,
            isLargeDesktop: currentIsLargeDesktop,
            width: window.innerWidth,
            height: window.innerHeight,
        });

        // Animations selon la taille d'écran
        let titleAnimation;
        let splittingAnimation;
        let timelineInMyWorld;

        // Déterminer la taille d'écran actuelle
        let currentSize;
        if (currentIsSmallMobile) currentSize = "smallMobile";
        else if (currentIsMediumMobile) currentSize = "mediumMobile";
        else if (currentIsMobile) currentSize = "mobile";
        else if (currentIsTablet) currentSize = "tablet";
        else if (currentIsDesktop) currentSize = "desktop";
        else if (currentIsLargeDesktop) currentSize = "largeDesktop";

        switch (currentSize) {
            case "smallMobile":
            // Très petits écrans (iPhone SE, petits Android)
                titleAnimation = gsap.to(
                    ".container-global-text-bienvenue h2",
                    {
                     yPercent: 50,
                     xPercent: 950,
                     duration: 0.3,
                     ease: "power2.inOut",
                scrollTrigger: {
                    trigger: ".container",
                    start: "top 0%",
                    end: "bottom 0%",
                    scrub: 0.8,
                },
                    }
                );

                splittingAnimation = gsap.fromTo(
                    selection[0].chars,
                {
                    opacity: 0,
                    yPercent: 50,
                    rotationX: 0,
                },
                {
                    opacity: 1,
                    yPercent: 0,
                    rotationX: -100,
                    duration: 5,
                    stagger: 0.05,
                    ease: "back.out(1.7)",
                    scrollTrigger: {
                        trigger: ".container-global-text-bienvenue",    
                        // endTrigger: ".h3-en-cours-de-construction",                   
                        start: "top 0%",
                        end: "bottom 0%",
                        toggleActions: "play none none reverse",
                        scrub: 1.5,
                        // markers: true,
                        },
                    }
                );

                // Timeline pour small mobile
                timelineInMyWorld = gsap.timeline({
                    scrollTrigger: {
                        trigger: ".container-global-text-bienvenue",    
                        start: "top 0%",
                        end: "bottom 90%",
                        scrub: 0.8,
                        // markers: true,
                    },
                });

                // Timeline simple : apparaît puis va à droite
                timelineInMyWorld
                    .fromTo(".h3-in-my-world", 
                        {
                            opacity: 0,
                            y: 80,
                        },
                        {
                            opacity: 1,
                            y: -40,
                            duration: 0.5,
                            ease: "bounce.out",
                        }
                    )
                    .to(".h3-in-my-world", {
                        xPercent: -100,
                        duration: 0.5,
                        ease: "power2.out",
                    });
                break;

            case "mediumMobile":
                // Medium mobile (476px - 767px) - Vide
                break;

            case "mobile":
                // Mobile (768px - 1023px) - Vide
                break;

            case "tablet":
                // Tablette (1024px - 1399px) - Vide
                break;

            case "desktop":
                // Desktop (1400px+) - Vide
                break;

            case "largeDesktop":
                // Large Desktop (≥1600px) - Vide
                break;
        }

        // Animation loop pour Lenis
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Fonction de nettoyage
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
            
            // Tuer les animations
            if (titleAnimation) titleAnimation.kill();
            if (splittingAnimation) splittingAnimation.kill();
            if (timelineInMyWorld) timelineInMyWorld.kill();
        };
    });
</script>

<div class="container-global-text-bienvenue">
    <!-- <div
        class="repéres"
        style="position: absolute; top: 0; left: 0; z-index: 1000; color: red;"
    >
        bienvenue top global
    </div>
    <div
        class="repéres"
        style="position: absolute; bottom: 0; left: 0; z-index: 1000; color: red;"
    >
        bienvenue bottom global
    </div> -->
    <h2 class="h2-welcome">Welcome</h2>
    <h3 class="h3-in-my-world">In my world</h3>
    <div class="content-text-bienvenue">
        <p class="p-bienvenue" data-splitting>
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
            et bienvenue dans mon univers digital. 🌐<br /><br />
        </p>
        <h3 class="h3-en-cours-de-construction" style="font-size: clamp(1rem, 6.5vw, 4rem);color: crimson;">
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
        font-size: clamp(2rem, 25vw, 10rem);
        font-weight: 800;
        margin: 0;
        /* opacity: 0.5; */
        will-change: transform;
        transform-origin: center center;
    }
    .h3-in-my-world {
        font-family: "Orbitron", "Bungee Shade", cursive;
        font-size: clamp(1rem, 15vw, 4rem);
        font-weight: 800;
        color: crimson;
        margin: 0;
        opacity: 0;
        position: absolute;
        top: 0%;
        left: 0;
      
    }
    .content-text-bienvenue {
        position: absolute;
        top: 45%;
        left: 0;
        width: 100%;
        height: clamp(100px, 150dvh, 100%);
    }
    .content-text-bienvenue p {
        font-family: "Orbitron", cursive;
        font-size: clamp(1rem, 4.9vw, 2.9rem);
        font-weight: 800;
        margin: 0;
        opacity: 1;
        /* Perspective 3D pour voir les rotations */
        perspective: 1000px;
        transform-style: preserve-3d;
    }

    .h3-en-cours-de-construction {
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        height: clamp(100px, 150dvh, 100%);
    }
    .red{
        color: red;
    }

    /* ===== MEDIA QUERIES RESPONSIVE ===== */
    /* Mobile First - Base styles (jusqu'à 767px) */
    /* Les styles de base sont déjà définis ci-dessus */
    
    /* Très petits écrans (jusqu'à 475px) */
    @media (max-width: 475px) {      
        .container-global-text-bienvenue h2 {
            top: 15%;
            left: -200%;
            z-index: 5000;
        }
        .h3-in-my-world {
            opacity: 0;
            top: 40%;
        }
        .content-text-bienvenue {
            /* border: 1px solid blue; */
            background-color: rgba(34, 33, 33, 0.128);
            backdrop-filter: blur(5px);
            top: 48%;
        }
        .content-text-bienvenue p {
            line-height: 2.5;
        }
        .h3-en-cours-de-construction {
            top: 90%;
            z-index: 1000;
        }
  
    }
    
    /* Medium Mobile (476px à 767px) */
    @media (min-width: 476px) and (max-width: 767px) {
        /* Les clamp() sont déjà définis dans les styles de base */
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
            top: 50%; /* Ajustement pour tablette */
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
