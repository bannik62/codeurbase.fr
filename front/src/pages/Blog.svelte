<script>
  import { onMount, onDestroy } from "svelte";
  import { getLenis } from "../stores/lenis.js";
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
    // Récupérer l'instance Lenis existante
    lenisInstance = getLenis();
    
    if (lenisInstance) {
      console.log('[Blog] Utilisation de l\'instance Lenis existante');
      // Lenis est déjà configuré dans App.svelte
    } else {
      console.warn('[Blog] Aucune instance Lenis trouvée');
    }
  });

  onDestroy(() => {
    // Pas besoin de nettoyer Lenis, il est géré globalement
    console.log('[Blog] onDestroy - Lenis géré globalement');
    
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
        background-image: url("https://media.gettyimages.com/id/971238530/fr/vectoriel/abstrait-circuit-futuriste-%C3%A0-repasser.jpg?s=612x612&w=0&k=20&c=a-vrXGSkY_ctr8ZogUFF-Sm0899OC1UjwRJAe58L0hc=");
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        background-attachment: fixed;
        background-blend-mode: overlay;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100vw;
        padding: 20px;
        color: #fff;
        font-family: Arial, sans-serif;
        border: 1px solid #fff;
        
    }

    @media (max-width: 480px) {
        .about {
            padding: 0;
        }
    }
</style>
