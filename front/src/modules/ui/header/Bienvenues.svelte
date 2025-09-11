<script>
    import { onMount } from "svelte";
    import { gsap } from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import Splitting from "splitting";
    import { initLenis } from "../../../stores/lenis.js";

    onMount(() => {
        gsap.registerPlugin(ScrollTrigger);
        
        // Initialiser Lenis via le store
        const lenis = initLenis();
        lenis.on('scroll', ScrollTrigger.update);
        
        // Appliquer Splitting et stocker le résultat
        let selection = Splitting();
        
        gsap.to(".container-global-text-bienvenue h2", {
            yPercent: 50,
            xPercent: 275,
            duration: 2,
            opacity: 1,
            onStart: () => {
                console.log("Animation GSAP démarrée GLOBAL");
            },
            ease: "power2.inOut",
            scrollTrigger: {
                trigger: ".container",
                start: "top 0%",
                end: "bottom 0%",
                scrub: true,
            },
        });

        // Animation des caractères en utilisant la sélection Splitting
        gsap.fromTo(selection[0].chars, 
            {
                opacity: 0,
                y: 50,
                rotationX: -90
            },
            {
                opacity: 1,
                y: 0,
                rotationX: 0,
                duration: 3,
                stagger: 0.05,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: ".container-global-text-bienvenue",    
                    endTrigger: ".content-text-bienvenue",                   
                    start: "top 0%",
                    end: "bottom 30%",
                    toggleActions: "play none none reverse",
                    scrub: true,
                }
            }
        );

        // Animation loop pour Lenis
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    });
</script>

<div class="container-global-text-bienvenue">
 <!-- <div class="repéres" style="position: absolute; top: 0; left: 0; z-index: 1000; color: red;">bienvenue top</div>   
 <div class="repéres" style="position: absolute; bottom: 0; left: 0; z-index: 1000; color: red;">bienvenue bottom</div>    -->
    <h2>Welcome</h2>
    <div class="content-text-bienvenue">
        <p class="p-bienvenue" data-splitting>
            👋 Bienvenue sur Codeur Base.<br><br>
            Cet espace est mon laboratoire numérique personnel, où je partage à la fois mes projets, mes expériences et mes découvertes dans le développement web.
        
            Ici, tu trouveras :<br>

            📝 Un blog pour explorer des sujets techniques, des tutos et des réflexions autour du code.<br>

            💼 Un portfolio pour découvrir mes réalisations et mon parcours.<br>

            🚀 Un espace d'expérimentation où j'expérimente de nouvelles technologies et outils.<br>

            Mon objectif est simple : créer, apprendre et partager.
            Bonne visite et bienvenue dans mon univers digital. 🌐
        </p>
        <h3 style="font-size: clamp(1rem, 6.5vw, 4rem);color: crimson;">
            en cours de construction
        </h3>
    </div>
</div>

<style>
    .container-global-text-bienvenue {
        /* border: 1px solid red; */
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        top: 65%;
        left: 0%;
        width: 100%;
        height: 90%;   
    }
    .container-global-text-bienvenue h2 {
        position: absolute;
        top: 0;
        left: -100%;
        font-family: "Orbitron", cursive;
        text-transform: uppercase;
        color: crimson !important;
        font-size: clamp(2rem, 6vw, 10rem);
        font-weight: 800;
        margin: 0;
        opacity: 0;
        
        
    }
    .content-text-bienvenue {
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        height: clamp(100px, 100%, 100%);
    }
    .content-text-bienvenue p {
        font-family: "Orbitron", cursive;
        font-size: clamp(1rem, 4.5vw, 2.9rem);
        font-weight: 800;
        margin: 0;
        opacity: 1;
    }
    .content-text-bienvenue h3 {
        font-size: clamp(1rem, 6.5vw, 4rem);
        font-weight: 800;
        margin: 0;
    }
</style>
