<script>
  import { onMount, onDestroy } from "svelte";
  import { gsap } from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import { initMediaQuery, useMediaQuery } from "../../../stores/mediaQuery.js";
  import { initWelcomeToAnimations, cleanupWelcomeToAnimations } from "./animationsWelcomeTo.js";

  // Enregistrer ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Variables pour les éléments
  let container;
  let animations = {};
  let cleanupFunctions = [];

  onMount(() => {
    // Initialiser le store media query
    const cleanupMediaQuery = initMediaQuery();
    cleanupFunctions.push(cleanupMediaQuery);
    
    // Utiliser la fonction centralisée pour les media queries
    const {
      currentSize,
      cleanup: cleanupMediaQueryStores,
    } = useMediaQuery();
    cleanupFunctions.push(cleanupMediaQueryStores);

    // Initialiser les animations selon la taille d'écran
    animations = initWelcomeToAnimations(currentSize);
  });

  onDestroy(() => {
    // Nettoyer les animations
    cleanupWelcomeToAnimations(animations);
    
    // Nettoyer ScrollTrigger
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    ScrollTrigger.clearMatchMedia();
    
    // Nettoyer les fonctions de nettoyage
    cleanupFunctions.forEach(cleanup => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    });
  });
</script>





<div class="home-container-content-title">
<section id="codeurbase">
  <h2 class="main-title">CodeurBase</h2>
  <p class="main-description">CodeurBase sera mon espace numérique personnel, combinant à la fois :</p>

  <div class="feature">
    <p class="feature-item"><strong>Blog :</strong> partager mes découvertes, astuces et projets autour du développement.</p>
    <p class="last-feature-item feature-item"><strong>Portfolio :</strong> présenter mes réalisations, compétences et expériences.</p>
  </div>

  <h3 class="objectives-title"> Objectifs</h3>
  <div class="objectives">
    <p class="objective-item">Centraliser mes projets et mes expérimentations.</p>
    <p class="objective-item">Partager du contenu technique et pédagogique.</p>
    <p class="objective-item">Mettre en avant mes compétences de développeur web.</p>
    <p class="objective-item">Créer une vitrine claire et professionnelle.</p>
    <p class="objective-item">Créer un portfolio de mes réalisations.</p>
    <p class="objective-item">Créer un blog pour partager mes découvertes, astuces et projets autour du développement.</p>
    <p class="objective-item last-p_objectives">Un point de contact pour me contacter.</p>
  </div>

  <h3 class="h3-after_objectives">Technologies utilisées</h3>
  
  <h4 class="frontend-title">Frontend</h4>
  <div class="tech-stack frontend-stack">
    <p class="tech-item">Svelte → Framework web moderne et réactif.</p>
    <p class="tech-item">JavaScript (ES6) → Pour la logique applicative.</p>
    <p class="tech-item">CSS / SCSS → Pour un design clair et maintenable.</p>
    <p class="tech-item">Axios → Communication sécurisée entre frontend et backend.</p>
  </div>

  <h4 class="backend-title">Backend</h4>
  <div class="tech-stack backend-stack">
    <p class="tech-item">Node.js (Express) → Gestion des API et logique serveur.</p>
    <p class="tech-item">Sequelize (ORM) → Interaction avec la base de données SQL.</p>
  </div>

  <h4 class="database-title">Base de données</h4>
  <div class="tech-stack database-stack">
    <p class="tech-item">PostgreSQL / MySQL (selon configuration).</p>
  </div>

  <h4 class="tools-title">Outils et déploiement</h4>
  <div class="tech-stack tools-stack">
    <p class="tech-item">Docker & Docker Compose → Conteneurisation et orchestration.</p>
    <p class="tech-item">Portainer → Gestion des conteneurs via interface web.</p>
    <p class="tech-item">Apache (reverse proxy) → Accès au site via HTTPS.</p>
    <p class="tech-item">Certbot (Let's Encrypt) → Certificat SSL automatique.</p>
    <p class="tech-item">N8n → Gestion des tâches automatisées.</p>
    <p class="tech-item">Umami → Gestion des statistiques.</p>
    <p class="tech-item">Phpmyadmin → Gestion de la base de données.</p>
  </div>
</section>

</div>

<style>
   h2, h3, h4 {
    font-family: "Orbitron", cursive;
    font-weight: 600;
    font-size: clamp(0.8rem, 3vw, 3rem);
    color:crimson;
    text-align: center;
  }
  p {
    font-family: "Orbitron", cursive;
    font-weight: 500;
    font-size: clamp(0.7rem, 4vw, 2.5rem);
    color: rgb(250, 245, 245)fff;
  }
  .home-container-content-title {
    display: flex;
    flex: 1;
    flex-direction: column;
    /* align-items: center; */
    /* justify-content: center; */
    width: 35vw;
    min-width: 350px;
    padding: 5%;
  }

  /* Media Queries Responsive */
  
  /* Small Mobile */
  @media (max-width: 480px) {
    .home-container-content-title {
      width: 95vw;
      height: 300vh;
      min-width: 300px;
      padding: 1%;
      padding-bottom: 10%;
    }

    #codeurbase {
      height: 250%;
    }
    
    /* clamp() géré dans les styles généraux */
  }

  /* Medium Mobile */
  @media (min-width: 481px) and (max-width: 768px) {
    .home-container-content-title {
      width: 80vw;
      min-width: 320px;
      padding: 4%;
    }
    
    /* clamp() géré dans les styles généraux */
  }

  /* Tablet */
  @media (min-width: 769px) and (max-width: 1024px) {
    .home-container-content-title {
      width: 60vw;
      min-width: 400px;
      padding: 4%;
    }
    
    /* clamp() géré dans les styles généraux */
  }

  /* Desktop */
  @media (min-width: 1025px) and (max-width: 1440px) {
    .home-container-content-title {
      width: 45vw;
      min-width: 450px;
      padding: 5%;
    }
    
    /* clamp() géré dans les styles généraux */
  }

  /* Large Desktop */
  @media (min-width: 1441px) and (max-width: 1920px) {
    .home-container-content-title {
      width: 40vw;
      min-width: 500px;
      padding: 5%;
    }
    
    /* clamp() géré dans les styles généraux */
  }

  /* XL Desktop */
  @media (min-width: 1921px) {
    .home-container-content-title {
      width: 35vw;
      min-width: 550px;
      padding: 5%;
    }
    
    /* clamp() géré dans les styles généraux */
  }

</style>