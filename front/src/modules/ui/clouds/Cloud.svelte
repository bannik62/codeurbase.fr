<script>
    import { onMount } from "svelte";
    // Importez vos composants Svelte ici
    // import MonComposant from './MonComposant.svelte';
    // import AutreComposant from '../AutreComposant.svelte';

    console.log("chargé cloud.svelte");

    // Variables réactives Svelte
    let introContainer;
    let isVisible = false;
    let showChildDiv = false;
    let createTimeout;
    let removeTimeout;

    // Variables pour l'animation des lettres
    let showH2 = false;
    let visibleLetters = [];
    let animationTimeouts = [];
    let isAnimating = false;

    // Variables pour le loader
    let showLoader = false;
    let loaderProgress = 0;
    let succes = false;

    // Fonction pour générer une vitesse aléatoire (minimum 0.6s)
    function getRandomSpeed() {
        return Math.random() * 0.1 + 0.1; // Entre 0.6 et 1.0 secondes
    }

    // Fonction pour animer les lettres une par une
    function animateLetters() {
        // Éviter les animations multiples
        if (isAnimating) return;

        isAnimating = true;
        // Nettoyer l'état précédent
        clearAnimationTimeouts();

        const textElements = [
            "environ 510 millions de km²",
            "environ 148 millions de km²",
            "environ 362 millions de km²",
            "environ 7,9 milliards",
            "environ 1,2 milliards",
        ];

        let totalDelay = 0;

        textElements.forEach((text, textIndex) => {
            const letters = text.split("");
            letters.forEach((letter, letterIndex) => {
                const speed = getRandomSpeed();
                const delay = totalDelay + letterIndex * speed * 100; // Convertir en ms

                const timeout = setTimeout(() => {
                    // Vérifier si la lettre n'existe pas déjà
                    const letterExists = visibleLetters.some(
                        (l) =>
                            l.textIndex === textIndex &&
                            l.letterIndex === letterIndex
                    );

                    if (!letterExists) {
                        visibleLetters = [
                            ...visibleLetters,
                            { textIndex, letterIndex, letter },
                        ];
                    }
                }, delay);

                animationTimeouts.push(timeout);
            });
            totalDelay += letters.length * 10; // Petit délai entre les lignes
        });

        // Marquer l'animation comme terminée après un délai
        setTimeout(() => {
            isAnimating = false;
            // Démarrer le loader après la fin de l'animation
            startLoader();
        }, totalDelay + 1500);
    }

    // Fonction pour démarrer le loader
    function startLoader() {
        showLoader = true;
        loaderProgress = 0;
        succes = false;

        // Animation de la progress bar sur 3 secondes
        const duration = 3000; // 3 secondes
        const interval = 50; // Mise à jour toutes les 50ms
        const increment = 100 / (duration / interval);

        const progressInterval = setInterval(() => {
            loaderProgress += increment;
            if (loaderProgress >= 100) {
                loaderProgress = 100;
                clearInterval(progressInterval);
                // Marquer le succès à la fin
                succes = true;
            }
        }, interval);
    }

    // Fonction pour nettoyer les timeouts d'animation
    function clearAnimationTimeouts() {
        // Nettoyer tous les timeouts
        animationTimeouts.forEach((timeout) => clearTimeout(timeout));
        animationTimeouts = [];
        // Réinitialiser l'état des lettres
        visibleLetters = [];
        // Réinitialiser le flag d'animation
        isAnimating = false;
        // Réinitialiser le loader
        showLoader = false;
        loaderProgress = 0;
        succes = false;
    }

    onMount(() => {
        // Observer pour détecter quand le container est visible
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        isVisible = true;
                        // Annuler le timeout de suppression s'il existe
                        if (removeTimeout) {
                            clearTimeout(removeTimeout);
                            removeTimeout = null;
                        }
                        // Créer la div après 2 secondes
                        createTimeout = setTimeout(() => {
                            showChildDiv = true;
                            // Démarrer l'animation du H2 après 500ms
                            setTimeout(() => {
                                showH2 = true;
                                // Démarrer l'animation des lettres après 1s
                                setTimeout(() => {
                                    animateLetters();
                                }, 1000);
                            }, 500);
                        }, 2000);
                    } else {
                        isVisible = false;
                        // Annuler le timeout de création s'il existe
                        if (createTimeout) {
                            clearTimeout(createTimeout);
                            createTimeout = null;
                        }
                        // Supprimer la div après 2 secondes
                        removeTimeout = setTimeout(() => {
                            showChildDiv = false;
                            showH2 = false;
                            clearAnimationTimeouts();
                        }, 2000);
                    }
                });
            },
            {
                threshold: 0.7, // Se déclenche quand 50% du container est visible
            }
        );

        if (introContainer) {
            observer.observe(introContainer);
        }

        return () => {
            if (introContainer) {
                observer.unobserve(introContainer);
            }
            // Nettoyer les timeouts
            if (createTimeout) clearTimeout(createTimeout);
            if (removeTimeout) clearTimeout(removeTimeout);
            clearAnimationTimeouts();
        };
    });
</script>

<!-- Div container focusable -->
<div class="intro-cloud-container" bind:this={introContainer}>
    <!-- Div enfant réactive -->
    {#if showChildDiv}
        <div class="child-div">
            <!-- Exemple d'enfants -->
            <div class="dashboard-section-one">
                <h2 class:h2-visible={showH2}>Planéte Terre</h2>
                
                <p>
                        <span style="color: green;">Superficie totale:</span>
                        <span style="color: crimson;">
                            {#each visibleLetters
                                .filter((l) => l.textIndex === 0)
                                .sort((a, b) => a.letterIndex - b.letterIndex) as letterObj}
                                {letterObj.letter}
                            {/each}
                        </span>
                </p>
                
                <p>
                        <span style="color: green;">Superficie terrestre:</span>
                        <span style="color: crimson;">
                            {#each visibleLetters
                                .filter((l) => l.textIndex === 1)
                                .sort((a, b) => a.letterIndex - b.letterIndex) as letterObj}
                                {letterObj.letter}
                            {/each}
                        </span>
                </p>
                
                <p>
                        <span style="color: green;">Superficie maritime:</span>
                        <span style="color: crimson;">
                            {#each visibleLetters
                                .filter((l) => l.textIndex === 2)
                                .sort((a, b) => a.letterIndex - b.letterIndex) as letterObj}
                                {letterObj.letter}
                            {/each}
                        </span>
                </p>
                
                <p>
                        <span style="color: green;">Nombre d'habitants:</span>
                    <span style="color: crimson;">
                                {#each visibleLetters
                                .filter((l) => l.textIndex === 3)
                                .sort((a, b) => a.letterIndex - b.letterIndex) as letterObj}
                                {letterObj.letter}
                            {/each}
                    </span>
                </p>
                
                <p>
                    <span style="color: green;">Nombres de développeurs:</span>
                        <span style="color: crimson;">
                            {#each visibleLetters
                                .filter((l) => l.textIndex === 4)
                                .sort((a, b) => a.letterIndex - b.letterIndex) as letterObj}
                                {letterObj.letter}
                            {/each}
                    </span>
                            </p>
                {#if showLoader}
                    <div class="loading-container">
                        <div class="loading-label">
                            Recherche développeur...
                        </div>
                        <div class="loading-bar">
                            <div
                                class="loading-progress"
                                style="width: {loaderProgress}%"
                            />
                        </div>
                        {#if succes}
                            <div class="success-message">
                                <span>✓</span> Recherche terminée avec succès!
                            </div>
                        {/if}
                    </div>
                {/if}
            </div>
            <div class="separator">
                <div class="separator-line" />
            </div>
            <div class="dashboard-section-two">
                <h3>Section 2</h3>
                <p>Contenu de la section 2</p>
            </div>

            <!-- Vous pouvez ajouter autant d'enfants que vous voulez -->
        </div>
        <!-- <button class="action-button">Action</button> -->
    {/if}
</div>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap");
    .intro-cloud-container {
        position: relative;
        top: 0;
        left: 0;
        width: 100%;
        height: 110%;
        transform-origin: left center;
        overflow: hidden;
        animation: cloudAppear 3s forwards;
        animation-delay: 0s;
        border-radius: 8px;
        opacity: 0; /* Ajouter l'opacité initiale */
        /* Perspective 3D */
        perspective: 1000px;
        transform-style: preserve-3d;
    }
    
    .intro-cloud-container::before {
        content: '';
        position: absolute;
        top: 3%;
        left: 0;
        right: 0;
        bottom: 0;
        backdrop-filter: blur(15px);
        border-radius: 8px;
        z-index: -1;
        opacity: 0.7;
        animation: cloudBackgroundAppear 2s forwards;
        animation-delay: 5s;
        /* border: 2px solid #39FF14; 
        box-shadow: 0 0 10px #39FF14, 0 0 20px #39FF14, 0 0 30px #39FF14;  */
        padding: 10px;
    }

    @keyframes cloudAppear {
        0% {
            opacity: 0;
        }
        25% {
            opacity: 0.25;
        }
        50% {
            opacity: 0.50;
        }
        75% {
            opacity: 0.75;
        }
        100% {
            opacity: 1;
        }
    }
    
    @keyframes cloudBackgroundAppear {
        0% {
            background: radial-gradient(circle, rgba(48, 145, 57, 0) 0%, rgba(48, 145, 57, 0.1) 10%);
            backdrop-filter: blur(0px);
            border-radius: 50%;
            opacity: 0;
        }
        25% {
            background: radial-gradient(circle, rgba(48, 145, 57, 0) 0%, rgba(48, 145, 57, 0.2) 20%);
            backdrop-filter: blur(2.5px);
            border-radius: 40%;
            opacity: 0.5;
        }
        50% {
            background: radial-gradient(circle, rgba(76, 175, 80, 0) 0%, rgba(76, 175, 80, 0) 30%);
            backdrop-filter: blur(5px);
            border-radius: 30%;
            opacity: 1;
        }
        75% {
            background: radial-gradient(circle, rgba(48, 145, 57, 0) 0%, rgba(48, 145, 57, 0.6) 40%);
            backdrop-filter: blur(7.5px);
            border-radius: 20%;
        }
        100% {
            background: radial-gradient(circle, rgba(34, 87, 39, 0) 0%, rgba(34, 87, 39, 0.7) 50%);
            backdrop-filter: blur(15px);
            border-radius: 0%;
        }
    }

    .child-div {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        position: absolute;
        top: 1px;
        left: 0;
        width: 100%;
        height: 100%;
        margin: 0 auto;
        /* background-color: rgba(67, 182, 54, 0.391); */
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: -1;
        transform-origin: right center -1000px;
        animation: boardAppear 1s forwards;
        margin: 0 auto;
        /* Perspective 3D pour le container parent */
        perspective: 1000px;
        transform-style: preserve-3d;
        z-index: 9;
        filter: drop-shadow(0 50px 15px rgba(100, 174, 122, 0.515));
    }
  
    
    .child-div:after {
        content: "";
        position: absolute;
        top: 0%;
        left: 0;
        width: 100%;
        height: 15vh;
        clip-path: polygon(50% 100%, 100% 62%, 100% 0, 0 0, 0% 62%);
        background: linear-gradient(
            to right,
            #333,
            #4d4d4d,
            #666,
            #888,
            #999,
            #b3b3b3,
            #b3b3b3,
            #999,
            #888,
            #666,
            #4d4d4d,
            #333
        );
        opacity: 0; /* invisible au départ */
        z-index: 9999;
        border-radius: 6% 0 0 0;
        animation: toInvisible 0.5s ease-in 0.5s forwards;
    }

    @keyframes boardAppear {
        0% {
            opacity: 0;
            transform: scale(0);
            border-radius: 50%;
        }
        25% {
            opacity: 0.5;
            transform: scale(0.3);
            top: 10px;
            border-radius: 40%;
        }
        50% {
            opacity: 0.8;
            transform: scale(0.6);
            top: 20px;
            border-radius: 30%;
        }
        75% {
            opacity: 0.9;
            transform: scale(0.9);
            top: 30px;
            border-radius: 20%;
        }
        100% {
            opacity: 1;
            transform: scale(1);
            top: 40px;
            border-radius: 0;
        }
    }

    .dashboard-section-one {
        position: relative;
        top: -5%;
        width: clamp(110px, 30%, 500px);
        height: clamp(110px, 60%, 500px);
        margin: 20px 0;
        padding: 25px;
        background-color: rgba(42, 40, 40, 0.76);
        border-top: 4px solid green;
        border-bottom: 3px solid green;
        border-left: 8px solid green;
        border-right: 3px solid green;
        border-radius: 5px;
        overflow: scroll;

        /* Effets de perspective 3D */
        transform: rotateY(13deg) translateZ(50px) ;
        transition: transform 0.3s ease;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.828);
        z-index: 9999;
        
        /* Animation d'arrivée fondu */
        opacity: 0;
        animation: fadeIn 1s ease-in-out 3.5s forwards;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: rotateY(13deg) translateZ(50px) translateY(30px) scale(0.9);
            transform-style: preserve-3d;
        }
        to {
            opacity: 1;
            transform: rotateY(13deg) translateZ(50px) translateY(0) scale(1);
            transform-style: preserve-3d;
        }
    }


    .dashboard-section-one h2.h2-visible {
        opacity: 0.8;
    }

    .loading-container {
        transform: rotateY(25deg) translateZ(50px);
        transform-origin: left bottom;
    }

    .separator {
        position: relative;
        width: 1%;
        height: 100%;
        left: -0.6%;
        background-color: rgba(96, 94, 94, 0.166);
        outline: 1px solid rgba(96, 94, 94, 0.497);
        border-radius: 0px;
        overflow: hidden;
    }

    .dashboard-section-two {
        width: 30%;
        height: auto;
        margin: 20px 0;
        padding: 15px;
        background-color: rgba(42, 40, 40, 0.877);
        border-top: 4px solid green;
        border-bottom: 3px solid green;
        border-left: 3px solid green;
        border-right: 8px solid green;
        border-radius: 5px;
        /* Effets de perspective 3D */
        transform: rotateY(-13deg) translateZ(50px);
        transition: transform 0.3s ease;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 9999;
    }
    .dashboard-section-two p {
        font-size: 1.2rem;
        font-weight: bold;
        color: white;
        margin: 0;
        padding: 10px 0;
    }
    .dashboard-section-two h3 {
        font-size: 1.2rem;
        font-weight: bold;
        color: white;
        margin: 0 0 10px 0;
    }

    /* Styles pour le loader */
    .loading-container {
        position: relative;
        top: 0;
        left: 0%;
        margin-top: 20px;
        padding: 15px;
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 8px;
        border: 2px solid #4caf50;
    }

    .loading-label {
        color: crimson;
        font-family: "Orbitron", sans-serif;
        font-size: clamp(0.5rem, 2.4vw, 1rem);
        font-weight: bold;
        display: flex;
        text-align: center;
        margin-bottom: 10px;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .loading-bar {
        width: 100%;
        height: 15px;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        overflow: hidden;
        position: relative;
    }

    .loading-progress {
        height: 100%;
        background: linear-gradient(90deg, orange, crimson, orange);
        background-size: 200% 100%;
        border-radius: 4px;
        transition: width 0.1s ease-out;
        animation: shimmer 2s infinite;
    }

    @keyframes shimmer {
        0% {
            background-position: -200% 0;
        }
        100% {
            background-position: 200% 0;
        }
    }

    .success-message {
        color: crimson;
        font-family: "Orbitron", sans-serif;
        font-size: clamp(0.5rem, 3vw, 1rem);
        font-weight: bold;
        text-align: center;
        /* margin-top: 5px; */
        animation: fadeInText 0.5s ease-in;
    }
    .success-message span {
        color: green;
        font-size: clamp(0.5rem, 3vw, 1rem);
        font-weight: bold;
        margin-right: 10px;
        filter: drop-shadow(0 0 10px rgba(213, 30, 30, 0.5));
    }

    @keyframes fadeInText {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
