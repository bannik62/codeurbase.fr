<script>
  import { onMount, onDestroy } from "svelte";
  import { writable } from "svelte/store";
  import { currentPage } from "../stores/router";
  import ServicesOK from "../modules/services/ServicesOK.svelte";
  console.log("Acceuil: component instantiated");

  // Store pour gérer l'état de la page d'accueil
  const welcomeMessage = writable("Bienvenue sur notre site !");
  onMount(() => {
    // window.location.reload();
  });

  onDestroy(() => {
    console.log("Acceuil: onDestroy");
  });
</script>

<section class="home-container">
  <h1>{$welcomeMessage}</h1>
  <div class="home-container-content">
  
    <div class="home-container-content-title">
      <section id="codeurbase">
        <h2>CodeurBase</h2>
        <p>CodeurBase sera mon espace numérique personnel, combinant à la fois :</p>
      
        <div class="feature">
          <p><strong>Blog :</strong> partager mes découvertes, astuces et projets autour du développement.</p>
          <p><strong>Portfolio :</strong> présenter mes réalisations, compétences et expériences.</p>
        </div>
      
        <h3> Objectifs</h3>
        <div class="objectives">
          <p>Centraliser mes projets et mes expérimentations.</p>
          <p>Partager du contenu technique et pédagogique.</p>
          <p>Mettre en avant mes compétences de développeur web.</p>
          <p>Créer une vitrine claire et professionnelle.</p>
          <p>Créer un portfolio de mes réalisations.</p>
          <p>Créer un blog pour partager mes découvertes, astuces et projets autour du développement.</p>
          <p>Un point de contact pour me contacter.</p>
        </div>
      
        <h3>Technologies utilisées</h3>
        
        <h4>Frontend</h4>
        <div class="tech-stack">
          <p>Svelte → Framework web moderne et réactif.</p>
          <p>JavaScript (ES6) → Pour la logique applicative.</p>
          <p>CSS / SCSS → Pour un design clair et maintenable.</p>
          <p>Axios → Communication sécurisée entre frontend et backend.</p>
        </div>
      
        <h4>Backend</h4>
        <div class="tech-stack">
          <p>Node.js (Express) → Gestion des API et logique serveur.</p>
          <p>Sequelize (ORM) → Interaction avec la base de données SQL.</p>
        </div>
      
        <h4>Base de données</h4>
        <div class="tech-stack">
          <p>PostgreSQL / MySQL (selon configuration).</p>
        </div>
      
        <h4>Outils et déploiement</h4>
        <div class="tech-stack">
          <p>Docker & Docker Compose → Conteneurisation et orchestration.</p>
          <p>Portainer → Gestion des conteneurs via interface web.</p>
          <p>Apache (reverse proxy) → Accès au site via HTTPS.</p>
          <p>Certbot (Let’s Encrypt) → Certificat SSL automatique.</p>
          <p>N8n → Gestion des tâches automatisées.</p>
          <p>Umami → Gestion des statistiques.</p>
          <p>Phpmyadmin → Gestion de la base de données.</p>
        </div>
      </section>
      
    </div>

    <div class="home-container-content-services">
      <ServicesOK />
    </div>
 
  </div>
</section>

<style>
  h1, h2, h3, h4, h5, h6 {
    font-family: "Orbitron", cursive;
    font-weight: 500;
    font-size: clamp(1rem, 4vw, 1.5rem);
    color:crimson;
  }

  .home-container {
    display: flex;
    flex-direction: column;
    /* align-items: center; */
    /* justify-content: center; */
    height: auto;
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

  .home-container-content-title {
    display: flex;
    flex: 1;
    flex-direction: column;
    /* align-items: center; */
    /* justify-content: center; */
    /* border: 1px solid blue; */
    width: 35vw;
    min-width: 350px;
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

  p {
    font-family: "Orbitron", cursive;
    font-weight: 500;
    font-size: clamp(1rem, 4vw, 1.5rem);
    color: rgb(250, 245, 245)fff;
  }

</style>
