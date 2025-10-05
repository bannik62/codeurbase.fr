<script>
  import { onMount, onDestroy } from "svelte";
  import { writable } from "svelte/store";
  import { currentPage } from "../stores/router";
  import ServicesOK from "../modules/services/ServicesOK.svelte";
  import Welcome from "../modules/ui/blog/Welcometo.svelte";
  import { initLenis, stopLenis, destroyLenis } from "../stores/lenis.js";
  
  console.log("Acceuil: component instantiated");

  // Store pour gérer l'état de la page d'accueil
  const welcomeMessage = writable("Bienvenue sur Codeurbase !");
  
  // Variables pour gérer la boucle RAF de Lenis
  let rafId = null;
  let isRafActive = true;
  let lenisInstance = null;

  onMount(() => {
    console.log("Acceuil: onMount - Initializing Lenis");
    
    // Initialiser Lenis pour le scroll smooth
    lenisInstance = initLenis();
    
    if (lenisInstance) {
      console.log("Acceuil: Lenis initialized successfully");
      
      // CORRECTION : Lenis a besoin de sa propre boucle requestAnimationFrame
      function raf(time) {
        if (isRafActive) {
          lenisInstance.raf(time);
          rafId = requestAnimationFrame(raf);
        }
      }
      rafId = requestAnimationFrame(raf);
    }
    
    // window.location.reload();
  });

  onDestroy(() => {
    console.log("Acceuil: onDestroy - Cleaning up Lenis");
    
    // Nettoyer la boucle requestAnimationFrame
    isRafActive = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    
    // Nettoyer Lenis lors de la destruction du composant
    // Note: On utilise stopLenis() plutôt que destroyLenis() 
    // pour permettre la réutilisation dans d'autres pages
    stopLenis();
  });
</script>

<section class="home-container">
  <h1>{$welcomeMessage}</h1>
  <div class="home-container-content">
    <Welcome />
  

    <div class="home-container-content-services">
      <ServicesOK />
    </div>
 
  </div>
</section>

<style>
  h1 {
    font-family: "Orbitron", cursive;
    font-weight: 700;
    font-size: clamp(1rem, 4vw, 1.5rem);
    color:crimson;
    text-align: center;
  }

  .home-container {
    display: flex;
    flex-direction: column;
    /* align-items: center; */
    /* justify-content: center; */
    min-height: calc(100vh - 60px);
    background-color: #322f2ff4;
  }

  .home-container-content {
    margin-top: 1%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    /* align-items: center; */
    justify-content: space-around;
    /* border: 1px solid green; */
    width: 100svw;
  }



  .home-container-content-services {
    display: flex;
    flex-direction: column;
    align-items:  flex-start;
    justify-content: flex-start;
    /* border: 1px solid green; */
    width: 35vw;
  }

  h1 {
    font-size: clamp(2rem, 5vw, 7rem);
  }

  /* Media Queries Responsive */
  @media (max-width: 480px) {
    .home-container {
      min-height: calc(100vh - 60px);
      padding-bottom: 20px;
    }

    .home-container-content {
      flex-direction: column;
      width: 98w;
      padding: 0 10px;
      flex: 1;
    }

    .home-container-content-services {
      width: 100vw;
      max-width: 100vw;
      margin-top: 20px;
      margin-bottom: 40px; /* Plus d'espace pour la navbar */
    }
  }

  @media (min-width: 481px) and (max-width: 768px) {
    .home-container-content {
      flex-direction: column;
      width: 100vw;
      padding: 0 15px;
    }

    .home-container-content-services {
      width: 90vw;
      max-width: 90vw;
      margin-top: 20px;
    }
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    .home-container-content-services {
      width: 45vw;
      min-width: 400px;
    }
  }

</style>
