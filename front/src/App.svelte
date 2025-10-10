<script>
  import { onMount } from 'svelte';
  import Acceuilbis from './pages/AcceuilPortfolioBis.svelte';
  import Acceuil from './pages/Acceuil.svelte';
  import About from './pages/Blog.svelte';
  import { currentPage } from './stores/router';
  import Contact from './pages/Contact.svelte';
  import { onDestroy } from 'svelte';
  import Navbar from './modules/ui/portfolio/navbar/Navbar.svelte';
  import { lenis, stopLenis } from './stores/lenis.js';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  gsap.registerPlugin(ScrollTrigger);
  let buttonVisible = false;
  let showPortfolio = true;
  
  // Log quand la page change
  $: {
    // console.log('App: currentPage changed to:', $currentPage);
    // console.log('App: will try to render:', $currentPage === 'acceuilPortfolioBis' ? 'AcceuilPortfolioBis' : $currentPage === 'acceuil' ? 'Acceuil' : 'other');
    
    // Mise à jour explicite selon la page
    if ($currentPage === 'acceuilPortfolioBis') {
      showPortfolio = true;
    } else {
      showPortfolio = false;
    }
  }

  let scrollTimeout;
  let isScrolling = false;

  function handleScroll() {
    // Cache le bouton pendant le scroll
    buttonVisible = false;
    isScrolling = true;
    
    // Annule le timeout précédent
    clearTimeout(scrollTimeout);
    
    // Définit un nouveau timeout
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
      buttonVisible = true;
    }, 1000); // Montre le bouton 1 seconde après l'arrêt du scroll
  }

  function navigateToAcceuil() {
    // Nettoyage des animations GSAP
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    ScrollTrigger.clearMatchMedia();
    gsap.killTweensOf("*"); // Arrête toutes les animations GSAP

    // Nettoyage de Lenis
    stopLenis();
    document.body.style.overflow = 'auto';
    
    currentPage.set('acceuil');
    window.scrollTo(0, 0);
    window.location.reload();
  }

  function DetectEchap(event) {
    if (event.key === 'Escape') {
      navigateToAcceuil();
    }
  }

  function handleButtonClick() {
    navigateToAcceuil();
  }

  onMount(() => {
    window.addEventListener('keydown', DetectEchap);
    
    // S'abonne aux événements de scroll via Lenis
    const unsubscribe = lenis.subscribe(instance => {
      if (instance) {
        instance.on('scroll', handleScroll);
      }
    });

    // Initialise le bouton comme visible
    setTimeout(() => {
      buttonVisible = true;
    }, 1000);

    return () => {
      if (unsubscribe) unsubscribe();
    };
  });

  onDestroy(() => {
    window.removeEventListener('keydown', DetectEchap);
  });

</script>

<div class="app_wrapper">
  {#if $currentPage === 'acceuilPortfolioBis'}
    <button class:visible={buttonVisible} on:click={handleButtonClick}>
      Press this or Echap
    </button>
    <Acceuilbis />
  {:else}
  <div class="app_wrapper_content">
    <Navbar />
    </div>
    {#if $currentPage === 'acceuil'}
      <Acceuil />
    {:else if $currentPage === 'about'}
      <About />
    {:else if $currentPage === 'contact'}
      <Contact />
    {:else}
      <div>Page inconnue</div>
    {/if}
  {/if}
</div>

<style>
  .app_wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  .app_wrapper_content {
    position: relative;
    width: 100%;
    height: 12svh;
    
  }
     button {
      position: fixed;
      top: 5px;
      right: 5px;
      padding: 10px 20px;
      background-color: transparent;
      color: #fff;
      cursor: pointer;
      font-size: clamp(0.5rem, 3vw, 1.3rem);
      font-weight: bold;
      z-index: 1000;
      text-shadow: 0 0 5px #ff1f1f,
                    0 0 10px #ff1f1f,
                    0 0 20px #ff1f1f;
      opacity: 0;
      transform: translateY(-20px);
      transition: all 1s ease;
     }

     button.visible {
       opacity: 1;
       transform: translateY(0);
     }

   button:hover {
     background-color: rgba(255, 31, 31, 0.1);
     text-shadow: 0 0 5px #ff1f1f,
                  0 0 10px #ff1f1f,
                  0 0 20px #ff1f1f,
                  0 0 40px #ff1f1f;
     box-shadow: 0 0 10px #ff1f1f,
                 0 0 20px #ff1f1f,
                 inset 0 0 10px #ff1f1f;
   }
  @media (max-width: 475px) {
    .app_wrapper {
      width: 100%;

    }
    .app_wrapper_content {
      position: fixed;
      bottom: 0;
      height: 10svh;
      width: 95%;
      z-index: 9999;
    }
  }
</style>