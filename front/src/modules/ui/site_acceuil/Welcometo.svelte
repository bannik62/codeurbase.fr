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




<!-- triggers pour main title -->
<div class="home-container-content-text">
  <!-- #codeurbase triggers pour main-description -->
<section id="codeurbase"> 
  <!-- .main-title triggers pour  main-description -->
  <h2 class="main-title">CodeurBase</h2>

  <p class="main-description">CodeurBase sera mon espace numérique personnel,<br> combinant à la fois :</p>
  <!-- .feature triggers pour feature-item 1 et 2, 0.8 d intervale -->
  <div class="feature">
    <p class="feature-item"><strong>Blog :</strong> partager mes découvertes, astuces et projets autour du développement.</p>
  <!-- .last-feature-item triggers pour objectives-title -->
    <p class="last-feature-item feature-item"><strong>Portfolio :</strong> présenter mes réalisations, compétences et expériences.</p>
  </div>
  <!-- .objectives-title triggers pour objective-item 1 et 2, 0.8 d intervale -->
  <h3 class="objectives-title"> Objectifs</h3>
  <div class="objectives">
    <p class="objective-item">Centraliser mes projets et mes expérimentations.</p>
    <p class="objective-item">Partager du contenu technique et pédagogique.</p>
    <p class="objective-item">Mettre en avant mes compétences de développeur web.</p>
    <p class="objective-item">Créer une vitrine claire et professionnelle.</p>
    <p class="objective-item">Créer un portfolio de mes réalisations.</p>
    <p class="objective-item">Créer un blog pour partager mes découvertes, astuces et projets <br> autour du développement.</p>
    <!-- .last-p_objectives triggers pour h3-after_objectives -->
    <p class="objective-item last-p_objectives">Un point de contact pour me contacter.</p>
  </div>

  <!-- h3-after_objectives triggers pour frontend-title -->
  <h3 class="h3-after_objectives">Technologies utilisées</h3>
  <!-- frontend-title triggers pour frontend-stack -->
  <h4 class="frontend-title">Frontend</h4>
 <!-- .tech-stack triggers pour tech-item 1 et 2, 0.8 d intervale -->
  <div class="tech-stack frontend-stack">
    <p class="tech-item">Svelte → Framework web moderne et réactif.</p>
    <p class="tech-item">JavaScript (ES6) → Pour la logique applicative.</p>
    <p class="tech-item">CSS / SCSS → Pour un design clair et maintenable.</p>
    <!-- .tech-item triggers pour backend-title -->
    <p class="tech-item">Axios → Communication sécurisée entre <br> frontend et backend.</p>
  </div>

  <!-- backend-title triggers pour backend-stack et tech-item 1 et 2, 0.8 d intervale -->
  <h4 class="backend-title">Backend</h4>
  <!-- .tech-stack triggers pour tech-item 1 et 2, 0.8 d intervale -->
  <div class="tech-stack backend-stack">
    <p class="tech-item">Node.js (Express) → Gestion des API et logique serveur.</p>
    <!-- .tech-item triggers pour database-title -->
    <p class="tech-item">Sequelize (ORM) → Interaction avec la base de données SQL.</p>
  </div>

  <!-- database-title triggers pour database-stack -->
  <h4 class="database-title">Base de données</h4>
  <!-- .tech-stack triggers pour tech-item 1 et 2, 0.8 d intervale -->
  <div class="tech-stack database-stack">
    <p class="tech-item">PostgreSQL / MySQL (selon configuration).</p>
  </div>

  <!-- tools-title triggers pour tools-stack -->
  <h4 class="tools-title">Outils et déploiement</h4>
  <!-- .tech-stack triggers pour tech-item 1 et 2, 0.8 d intervale -->
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
  strong {
    font-weight: 800;
    color:crimson;
  }
   h2, h3, h4 {
    font-family: "Orbitron", cursive;
    font-weight: 600;
    font-size: clamp(2rem, 2.3vw, 3rem);
    color:crimson;
    text-align: center;
  }
  p {
    font-family: "Orbitron", cursive;
    font-weight: 500;
    font-size: clamp(0.7rem, 2.6vw, 1.3rem);
    color: rgb(250, 245, 245)fff;
    white-space: normal; 
    width: 100vw;
    margin-bottom:50px
  }
  /* Espacements verticaux globaux (base, via clamp) */
  .main-title { margin: 0 0 clamp(12px, 2vw, 32px); }
  .main-description { margin: 0 0 clamp(12px, 2vw, 28px); }
  .feature { margin-block: clamp(12px, 2.5vw, 40px); }
  .objectives { margin-block: clamp(24px, 3vw, 64px); }
  .h3-after_objectives { margin-block-start: clamp(32px, 4vw, 80px); }
  h4 { margin: clamp(16px, 3vw, 48px) 0 clamp(8px, 2vw, 24px); }
  .tech-stack { margin-bottom: clamp(16px, 3vw, 48px); }
  /* Espacement spécifique Objectifs */
  .objectives-title { margin-bottom: clamp(16px, 4vw, 56px); }
  .objective-item { margin-top: clamp(10px, 2.8vw, 28px); }
  .home-container-content-text{
    display: flex;
    flex: 1;
    flex-direction: column;
    /* align-items: center; */
    /* justify-content: center; */
    width: 35vw;
    min-width: 350px;
    padding: 5%;
    overflow: hidden;
  }

  /* Media Queries Responsive */
  
  /* Small Mobile */
  @media (max-width: 480px) {

    .home-container-content-text{
      width: 100%;
      /* height: 300vh; */
      min-width: 300px;
      padding: 0%;
      padding-bottom: 10%;
      border:solid 1px red;
      overflow: hidden

    }

    #codeurbase {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      height: auto;
      width: 100%vw;
      margin-top: 10%;
    }
    
  }

  /* Medium Mobile */
  @media (min-width: 481px) and (max-width: 768px) {
    .home-container-content-text {
      width: 80vw;
      min-width: 320px;
      padding: 4%;
    }
    
    /* clamp() géré dans les styles généraux */
  }

  /* Tablet */
  @media (min-width: 769px) and (max-width: 1024px) {
    .home-container-content-text {
      width: 60vw;
      min-width: 400px;
      padding: 4%;
    }
    
  }

  /* Desktop */
  @media (min-width: 1025px) and (max-width: 1440px) {
    .home-container-content-text {
      width: 45vw;
      min-width: 450px;
      padding: 5%;
    }
    
    /* clamp() géré dans les styles généraux */
  }

  /* Large Desktop */
  @media (min-width: 1441px) and (max-width: 1920px) {
    .home-container-content-text {
      margin-top: 25%;
      width: 40vw;
      min-width: 500px;
      padding: 5%;
      gap: 10px;
    }
    
    /* clamp() géré dans les styles généraux */
  }

  /* XL Desktop */
  @media (min-width: 1921px) {
    .home-container-content-text   {
      width: 35vw;
      min-width: 550px;
      padding: 5%;
    }
    .objectives {
      margin-top: 100px;
    }
    .objective-item {
      margin-top: 100px;
    }
    
    /* clamp() géré dans les styles généraux */
  }

</style>