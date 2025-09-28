<script>
  import { onMount } from 'svelte';
  import Acceuilbis from './pages/AcceuilPortfolioBis.svelte';
  import Acceuil from './pages/Acceuil.svelte';
  import About from './pages/About.svelte';
  import { currentPage } from './stores/router';
  import Contact from './pages/Contact.svelte';
  import { onDestroy } from 'svelte';
  import { lenis, initLenis } from './stores/lenis.js';

  let buttonVisible = false;
  let scrollTimeout;
  let lenisInstance;
  let isScrolling = false;
  let unsubscribe;

  function handleScroll(e) {
    if (!isScrolling) {
      isScrolling = true;
      buttonVisible = false;
    }

    clearTimeout(scrollTimeout);
    
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
      buttonVisible = true;
    }, 1000);
  }

  function DetectEchap(event) {
    if (event.key === 'Escape') {
      console.log('Escape');
      currentPage.set('acceuil');
    }
  }

  onMount(() => {
    window.addEventListener('keydown', DetectEchap);
    
    // S'abonner au store Lenis
    unsubscribe = lenis.subscribe(instance => {
      if (instance) {
        lenisInstance = instance;
        instance.on('scroll', handleScroll);
      }
    });

    // Initialiser le bouton comme invisible au démarrage
    setTimeout(() => {
      buttonVisible = true;
    }, 1000);
    if ( currentPage.get() === 'acceuil') {
      currentPage.set('acceuilPortfolioBis');
    }

  });

  onDestroy(() => {
    window.removeEventListener('keydown', DetectEchap);
    if (unsubscribe) unsubscribe();
    clearTimeout(scrollTimeout);
    
    if (lenisInstance) {
      lenisInstance.off('scroll', handleScroll);
    }
  });

</script>

<div class="app_wrapper">
  {#if $currentPage === 'acceuilPortfolioBis'}
   <Acceuilbis />
{:else if $currentPage === 'acceuil'}
  <Acceuil />
{:else if $currentPage === 'about'}
  <About />
{:else if $currentPage === 'contact'}
  <Contact />
{:else}
  <div>Page inconnue</div>
{/if}
</div>



<style>
  .app_wrapper {
    position: relative;
    width: 100%;
    height: 100%;
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
</style>
