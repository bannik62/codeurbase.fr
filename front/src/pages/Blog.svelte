<script>
  import { onMount, onDestroy } from "svelte";
  import { initLenis } from "../stores/lenis.js";
  import { gsap } from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import Blog from "../modules/ui/Blog/Blog.svelte";

  // Enregistrer ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Variables pour gérer la boucle RAF de Lenis
  let rafId = null;
  let isRafActive = true;
  let lenisInstance = null;

  onMount(() => {
    // Initialiser Lenis pour le scroll smooth
    lenisInstance = initLenis();
    lenisInstance.on("scroll", ScrollTrigger.update);
    
    if (lenisInstance) {
      // Boucle requestAnimationFrame pour Lenis
      function raf(time) {
        if (isRafActive) {
          lenisInstance.raf(time);
          rafId = requestAnimationFrame(raf);
        }
      }
      rafId = requestAnimationFrame(raf);
    }
  });

  onDestroy(() => {
    // Nettoyer Lenis
    isRafActive = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
    }
    if (lenisInstance) {
      lenisInstance.destroy();
    }
    
    // Nettoyer ScrollTrigger
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    ScrollTrigger.clearMatchMedia();
  });
</script>

<div class="about">
  <Blog />
</div>
<style>
    .about {
        background-color: #322f2ff4;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100vw;
        height: 100svh;
        padding: 20px;
        color: #fff;
        font-family: Arial, sans-serif;
        border: 1px solid #fff;
        
    }
</style>
