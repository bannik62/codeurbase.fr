<script>
    import { onMount, onDestroy, createEventDispatcher } from "svelte";
    import { fade, scale } from "svelte/transition";
    import Radar from "./Radar.svelte";
    const dispatch = createEventDispatcher();
    let isVisible = true;
    let showContent = false;
    let showLoader = false;
    let showCustomContent = false;
    let cleanupFunction;

    onMount(() => {
        console.log("Detector component mounted - blocking scroll");
        
        // Attendre un petit délai pour s'assurer que le composant est bien rendu
        setTimeout(() => {
            // Afficher le contenu après un court délai
            setTimeout(() => {
                showContent = true;
                showLoader = true;
            }, 400);

            const timer = setTimeout(() => {
                showLoader = false;
                showCustomContent = true;
                
                // Émettre un événement pour dire au parent que le loader est fini
                setTimeout(() => {
                    dispatch('finished');
                    console.log("Detector component - loader finished, custom content shown");
                }, 4000); // Augmenté de 500ms à 3000ms (3 secondes)
            }, 5000);

            // Fonction de nettoyage
            cleanupFunction = () => {
                clearTimeout(timer);
            };
        }, 100);
    });

    onDestroy(() => {
        console.log("Detector component destroyed");
        if (cleanupFunction) {
            cleanupFunction();
        }
    });
</script>

{#if isVisible}
<div class="detection" transition:fade={{ duration: 100 }}>
    {#if showContent}
    <div class="detection-content" transition:scale={{ duration: 500, start: 0.2 }}>
        <h1>Detection Rapport </h1>
        
        {#if showLoader}
        <Radar />
        <div class="loading-bar-radar-container">
            <div class="loading-bar">
                <div class="loading-progress">

                </div>
            </div>
        </div>
        {/if}
        
        {#if showCustomContent}
        <div class="custom-content">
            <!-- Ici vous pouvez ajouter votre HTML personnalisé -->
            <p class="blink-slow p-life" >Life Detected</p>
           <div class="blink-normal">
               <svg width="150" height="150" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M12 16L6 10H18L12 16Z" fill="crimson"/>
               </svg>
           </div>
           <style>
    

           </style>
        </div>
        {/if}
    </div>
    {/if}
</div>
{/if}  

<style>
    .detection {
        position: absolute;
        top: 20%;
        left: 50%;
        transform: translateX(-50%);
        width: 50%;
        height: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    
    }
    
    .detection-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: white;
    }
    
    .detection h1 {
        font-size: 2.5rem;
        font-weight: bold;
        font-family: 'Orbitron', sans-serif;
        color: crimson;
        margin: 0 0 2rem 0;
        text-align: center;
        text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
        filter: drop-shadow(0 10px 20px rgba(220, 20, 60, 0.3));
    }

    .loading-bar-radar-container {
        display: flex;
        flex-direction: column;       
        height: auto;
        gap: 20px;
    }


    
    .loading-bar {
        width: 300px;
        height: 8px;
        border-radius: 2px;
        overflow: hidden;
        margin: 0 auto;
    }
    
    .loading-progress {
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, #ffaa00, crimson);
        border-radius: 2px;
        animation: loading 3s linear forwards;
        transform-origin: left;
    }
    
    .custom-content {
        margin-top: 2rem;
        text-align: center;
    }
    
    .p-life {
        font-size:clamp(1rem, 3vw, 3.2rem);
        margin-bottom: 1rem;
        color: orange;   
     }
    

    @keyframes loading {
        0%{
            transform: scaleX(0);

        }
        10%{
            transform: scaleX(0.1);
        
        }
        20%{
            transform: scaleX(0.2);
        }
        30%{
            transform: scaleX(0.3);
        }
        40%{
            transform: scaleX(0.4);
        }
        50%{
            transform: scaleX(0.5);
        }
        60%{
            transform: scaleX(0.6);
        }
        70%{
            transform: scaleX(0.7);
        }
        80%{
            transform: scaleX(0.8);
        }
        90%{
            transform: scaleX(0.9);
        }
        100%{
            transform: scaleX(1);
        }
    }


</style>