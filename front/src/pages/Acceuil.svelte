<script>
    import { onMount } from "svelte";
    import Cloud from "../modules/ui/clouds/Cloud.svelte";
    import planet from "../assets/Planet-No-Background.png";
    import Detector from "../modules/ui/detection/Detector.svelte";
    import Title from "../modules/ui/title/Title.svelte";
    import {
        detectionStore,
        detectionActions,
        statusMessage,
        statusColor,
        checkDetection,
    } from "../stores/detection.js";
    import Cockpit from "../modules/ui/cockpit/Cockpit.svelte";
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
            rect.bottom <=
                (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <=
                (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    function handleScroll() {
        const rect = document.body
            .querySelector(".atmo-one")
            ?.getBoundingClientRect();
        startScroll = rect ? rect.top + window.scrollY : 0;

        // calcul du facteur : quand le haut de atmo-one arrive en haut de l'écran jusqu'à ce qu'elle soit sortie
        let factor =
            0.5 - Math.min(Math.max(rect.top / window.innerHeight, 0), 1);
        let scale = 3 + factor * (maxZoom - 1);
        atmoOne.style.transform = `scale(${scale})`;

        // Vérifier si l'élément atmo-one est visible et mettre à jour showCloud
        showCloud = rect && rect.top < window.innerHeight && rect.bottom > 0;

        // Calculer l'échelle du nuage en fonction de la position de scroll
        if (showCloud && rect) {
            // Calculer le pourcentage de visibilité avec une courbe plus douce
            const rawRatio =
                (window.innerHeight - rect.top) / window.innerHeight;
            // Appliquer une courbe d'easing pour ralentir l'animation
            const visibilityRatio = Math.max(
                0,
                Math.min(1, rawRatio * rawRatio * rawRatio)
            );

            // Échelle de 0.1 (initial) à 1.0 (plein écran) avec progression plus lente
            cloudScale = 0.1 + 0.9 * visibilityRatio;
        } else {
            cloudScale = 0.1; // Retour à la taille initiale
        }

        console.log("showCloud:", showCloud, "cloudScale:", cloudScale);

        // Détection : calculer le pourcentage de visibilité de space-three
        const spaceThreeElement = document.querySelector(".space-three");
        if (spaceThreeElement) {
            const spaceThreeRect = spaceThreeElement.getBoundingClientRect();

            // Calculer la hauteur visible de la section
            const visibleTop = Math.max(0, spaceThreeRect.top);
            const visibleBottom = Math.min(
                window.innerHeight,
                spaceThreeRect.bottom
            );
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);

            // Calculer le pourcentage de visibilité
            const totalHeight = spaceThreeRect.height;
            const visibilityPercentage = (visibleHeight / totalHeight) * 100;

            // Mettre à jour le store et vérifier la détection
            detectionActions.updateVisibility(
                visibilityPercentage,
                window.scrollY
            );
            checkDetection(visibilityPercentage);
        }

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
            <canvas bind:this={canvas} ></canvas>
        </div>

        <div class="space-one">
            <Title />
        </div>
        <div class="space-two"><p>test1</p></div>
        <div class="space-three">
            {#if $detectionStore.showMessage}
                <div class="container-detection ">
                    <div class="container-status">
                        <p style="color: {$statusColor};">
                            Status: {$statusMessage}
                        </p>
                    </div>
                </div>
            {/if}
            {#if $detectionStore.showDetector}
                <Detector
                    on:finished={() => {
                        detectionActions.finishSequence();
                    }}
                />
            {/if}
        </div>
        <div class="atmo-one">
            <div
                class="nuages-one"
                style=" width: {10 + (cloudScale - 0.1) * 100}vw; height: {8 +
                    (cloudScale - 0.1) * 100}vh;"
            >
                {#if showCloud}
                    <Cloud />
                {/if}
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
        height: 100dvh;
        /* background: rgba(0, 255, 0, 0.05); */
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    /* .container-detection {
        width: auto;
        height: auto;
        background: rgba(23, 187, 53, 0.816);
        padding: 10px;
        border-radius: 5px;
        z-index: 1000;
    } */

    .atmo-one {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
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
        filter: drop-shadow(50px 0px 10px rgba(230, 220, 128, 0.5));
    }
    .nuages-one {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        bottom: 0%;
        right: 0%;
        z-index: 6;
        transition: width 0.1s ease-out, height 0.6s ease-out; /* Animation fluide sur les dimensions */
    }

    .container-detection {
        position: relative;
        background: rgba(28, 173, 105, 0.219);
        width: auto;
        height: auto;
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

</style>
