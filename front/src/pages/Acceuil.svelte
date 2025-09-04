<script>
    import { onMount } from "svelte";
    import Cloud from "../modules/ui/clouds/Cloud.svelte";
    let canvas;
    let ctx;
    let atmoOne;
    let showCloud = false;
    let cloudScale = 0.1; // Échelle initiale du nuage

    const stars = [];
    const numStars = 2400;
    const baseSpeed = 2;
    let currentSpeed = baseSpeed;
    let curve = 0;


    // Scroll‑zoom
    let startScroll = 0;
    let endScroll = 0;
    let zoomFactor = 0;
    const maxZoom = 2; // zoom max x2

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
    function isInViewport(selector) {
        const element = document.querySelector(selector);
        if (!element) return false;
        
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    function handleScroll() {
        const rect = document.body
            .querySelector(".atmo-one")
            ?.getBoundingClientRect();
        startScroll = rect ? rect.top + window.scrollY : 0;

        // calcul du facteur : quand le haut de atmo-one arrive en haut de l'écran jusqu'à ce qu'elle soit sortie
        let factor = 0.5 - Math.min(Math.max(rect.top / window.innerHeight, 0), 1);
        let scale = 3 + factor * (maxZoom - 1);
        atmoOne.style.transform = `scale(${scale})`;

        // Vérifier si l'élément atmo-one est visible et mettre à jour showCloud
        showCloud = rect && rect.top < window.innerHeight && rect.bottom > 0;
        
        // Calculer l'échelle du nuage en fonction de la position de scroll
        if (showCloud && rect) {
            // Calculer le pourcentage de visibilité avec une courbe plus douce
            const rawRatio = (window.innerHeight - rect.top) / window.innerHeight;
            // Appliquer une courbe d'easing pour ralentir l'animation
            const visibilityRatio = Math.max(0, Math.min(1, rawRatio * rawRatio * rawRatio));
            
            // Échelle de 0.1 (initial) à 1.0 (plein écran) avec progression plus lente
            cloudScale = 0.1 + (0.9 * visibilityRatio);
        } else {
            cloudScale = 0.1; // Retour à la taille initiale
        }
        
        console.log('showCloud:', showCloud, 'cloudScale:', cloudScale);

        // continuer le calcul des étoiles
        const scrollPos = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        currentSpeed = baseSpeed * (1 - (scrollPos / maxScroll) * 0.1);
        curve = scrollPos / maxScroll - 1;
    }

    onMount(() => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx = canvas.getContext("2d");

        initStars();
        drawStars();

        const atmoElement = document.body.querySelector(".atmo-one");
        if (atmoElement) {
            const rect = atmoElement.getBoundingClientRect();
            startScroll = rect.top + window.scrollY;
        } else {
            startScroll = 0;
        }
        endScroll = startScroll + window.innerHeight;

        window.addEventListener("resize", () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars();
        });

        window.addEventListener("scroll", handleScroll);
    });
</script>

<section>
    <div class="content_space">
        <div class="video-container">
            <canvas bind:this={canvas}></canvas>
        </div>

        <div class="space-one"><p>test0</p></div>
        <div class="space-two"><p>test1</p></div>
        <div class="space-three"><p>test3</p></div>
        <div class="atmo-one">
            <p>atmo</p>
            <div class="nuages-one" style=" width: {10 + (cloudScale - 0.1) * 100}vw; height: {8 + (cloudScale - 0.1) * 100}vh;">
                {#if showCloud}
                    <Cloud />
                {/if}
            </div>  
            <img
                bind:this={atmoOne}
                src="../../public/Planet-No-Background.png"
                alt="planet"
            />
        </div>
    </div>

    <div class="cockpit">
        <div class="cockpit-left"></div>
        <div class="cockpit-center"></div>
        <div class="cockpit-right"></div>
    </div>
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
    }
    .content_space {
        position: absolute;
        inset: 0;
        height: 410dvh;
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
        width: 100vw;
        height: 100dvh;
    }
    .space-one {
        /* border: 1px solid red; */
        height: 100dvh;
    }
    .space-two {
        /* border: 1px solid yellow; */
        height: 110dvh;
    }
    .space-three {
        border: 1px solid green;
        height: 100vh;
    }

    .atmo-one {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        border: 1px solid blue;
        background-size: cover;
        background-repeat: no-repeat;
        width: 100vw;
        height: 100vh;
        z-index: 1;
   
    }

    .atmo-one img {
        position: absolute;
        top: 80%;
        left: 90%;
        width: 100%;
        height: 150%;
        object-fit: contain; /* ou cover selon ce que tu veux */
        transform-origin: right center;
        transition: transform 1s linear;
        z-index: 5;
        filter: drop-shadow(50px 0px 10px rgba(240, 239, 239, 0.5));
    }
    .nuages-one {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        bottom: 0%;
        right: 0%;
        z-index: 6;
        transition: width 0.3s ease-out, height 0.3s ease-out; /* Animation fluide sur les dimensions */
    }

    .cockpit {
        display: flex;
        flex-direction: row;
        align-items: center;
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 15%;
        border: 1px solid blue;
        background: #bbb;
        clip-path: polygon(50% 0%, 100% 38%, 100% 100%, 0 100%, 0% 38%);
        z-index: 1;
    }
    .cockpit-left {
        width: 50%;
        height: 100%;
        background: linear-gradient(
            to left,
            #333,
            #4d4d4d,
            #666,
            #888, /* Corrected color from #808 to #888 for a more suitable gray */
            #999,
            #b3b3b3
        );
    }
    .cockpit-center {
        width: 5px;
        height: 100%;
        background: #2d2d2d;
        border-top: 5px solid #2c2b2b;
    }
    .cockpit-right {
        width: 50%;
        height: 100%;
        background: linear-gradient(
            to right,
            #333,
            #4d4d4d,
            #666,
            #888, /* Corrected color from #808 to #888 for a more suitable gray */
            #999,
            #b3b3b3
        );
    }
</style>
