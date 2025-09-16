<script>
    import { onMount } from "svelte";
    import { gsap } from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import Splitting from "splitting";
    import { initMediaQuery, useMediaQuery } from "../../../stores/mediaQuery.js";
    import { elementsStore } from "../../../stores/elements.js";

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
        let titleAnimation;
        let splittingAnimation;
        let timelineInMyWorld;

        // currentSize est déjà déterminé par useMediaQuery()
        setTimeout(() => {
        switch (currentSize) {
            case "smallMobile":
            // Très petits écrans (iPhone SE, petits Android)
                // Timeline pour l'animation du titre "Welcome"
                titleAnimation = gsap.timeline({
                    scrollTrigger: {
                        trigger: elements.elementOfTitle.container,
                        start: "top 0%",
                        endTrigger: elements.elementOfTitle.container,
                        end: "bottom 20%",
                        scrub: 1.3,
                        toggleActions: "play none none none",
                        markers: true,
                    },
                });

                // Séquence d'animations pour le titre
                titleAnimation
                    .to(".container-global-text-bienvenue h2", {
                        y: 50,
                        x: 800,
                        duration: 5,
                        ease: "power2.out",
                        willChange: "transform",
                        scale: 1,
                    })
                    .to(".container-global-text-bienvenue h2", {
                        y: 100,
                        x: 1420,
                        duration: 10,
                        ease: "back.inOut(1.3)",
                        willChange: "transform",    
                        scale: 0.5,
                    });

                splittingAnimation = gsap.fromTo(
                    selection[0].chars,
                {
                    opacity: 0,
                    y: 200,
                    rotationX: 0,
                },
                {
                    opacity: 1,
                    y: 0,
                    rotationX: -100,
                    duration: 8,
                    stagger: 2,
                    ease: "back.out(1.7)",
                    scrollTrigger: {
                        trigger: ".h2-welcome",    
                        // endTrigger: ".h3-en-cours-de-construction",                   
                        start: "top 0%",
                        end: "bottom 0%",
                        toggleActions: "play none none reverse",
                        scrub: 1,
                        // markers: true,
                        },
                    }
                );

                // Timeline pour small mobile
                timelineInMyWorld = gsap.timeline({
                    scrollTrigger: {
                        trigger: elements.elementOfTitle.bordure,    
                        start: "top ",
                        endTrigger: elements.elementOfTitle.bordure,
                        end: "bottom ",
                        scrub: 0.8,
                        markers: true,
                    },
                });

                // Timeline simple : apparaît puis va à droite
                timelineInMyWorld
                    .fromTo(".h3-in-my-world", 
                        {
                            opacity: 0,
                            y: 650,
                            // scale: 0,
                        },
                        {
                            opacity: 0.5,
                            y: -90,
                            duration: 0.5,
                            ease: "linear.inOut",
                            scale: 1,
                        }
                    )
                    .to(".h3-in-my-world", {
                        opacity: 1,
                        scale: 0.5,
                        // delay: 1.5,
                        // xPercent: -100,
                        duration: 0.8,
                        ease: "power2.out",
                    }
                    )
                    .to(".h3-in-my-world", {
                        opacity: 1,
                        scale: 1,
                        // delay: 1.5,
                        // xPercent: -100,
                        duration: 0.5,
                        ease: "power2.out",
                    }
                );
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
        }, 100);

        // Fonction de nettoyage
        return () => {
            // Nettoyer les abonnements aux stores media query
            cleanupMediaQueryStores();
            
            // Nettoyer le store media query
            cleanupMediaQuery();
            
            // Tuer les animations
            if (titleAnimation) titleAnimation.kill();
            if (splittingAnimation) splittingAnimation.kill();
            if (timelineInMyWorld) timelineInMyWorld.kill();
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
        font-size: clamp(2rem, 25vw, 10rem);
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
        height: clamp(100px, 150dvh, 100%);
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
            left: 2%;
     
        }
        .content-text-bienvenue {
            /* border: 1px solid blue; */
            background-color: rgba(34, 33, 33, 0.128);
            backdrop-filter: blur(5px);
            top: 42%;
            height: 65%;
        }
        .content-text-bienvenue p {
            position: relative;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            line-height: 1.8;
        }
        .h3-en-cours-de-construction {
            background-color: rgba(28, 173, 105, 0.219);
            
            bottom :0px;
            z-index: 1000;
        }
        .span-globe {
        position: absolute;
        top: -300px;
        left: 37%;
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
