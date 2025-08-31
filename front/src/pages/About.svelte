<script>
    import Navbar from '../modules/ui/navbar/Navbar.svelte';
</script>

<Navbar />
<div class="about">

<div class="about-content">
    <h2>CodeurBase.fr</h2>
    <p>CodeurBase sera mon espace numérique personnel, combinant à la fois :</p>
    <ul>
        <li>📝 Un blog pour partager mes découvertes, astuces et projets autour du développement.</li>
        <li>💼 Un portfolio pour présenter mes réalisations, compétences et expériences.</li>
    </ul>
    <h3>🚀 Objectifs</h3>
    <ul>
        <li>Centraliser mes projets et mes expérimentations.</li>
        <li>Partager du contenu technique et pédagogique.</li>
        <li>Mettre en avant mes compétences de développeur web.</li>
        <li>Créer une vitrine claire et professionnelle.</li>
        <li>Créer portfolio de mes réalisations.</li>
        <li>Créer un blog pour partager mes découvertes, astuces et projets autour du développement.</li>
        <li>Un point de contact pour me contacter.</li>
    </ul>
    <h3>🛠️ Technologies utilisées</h3>
    <h4>Frontend</h4>
    <ul>
        <li>Svelte → Framework web moderne et réactif.</li>
        <li>JavaScript (ES6) → Pour la logique applicative.</li>
        <li>CSS / SCSS → Pour un design clair et maintenable.</li>
        <li>Axios → Communication sécurisée entre frontend et backend.</li>
    </ul>
    <h4>Backend</h4>
    <ul>
        <li>Node.js (Express) → Gestion des API et logique serveur.</li>
        <li>Sequelize (ORM) → Interaction avec la base de données SQL.</li>
    </ul>
    <h4>Base de données</h4>
    <ul>
        <li>PostgreSQL / MySQL (selon configuration).</li>
    </ul>
    <h4>Outils et déploiement</h4>
    <ul>
        <li>Docker & Docker Compose → Conteneurisation et orchestration.</li>
        <li>Portainer → Gestion des conteneurs via interface web.</li>
        <li>Apache (reverse proxy) → Accès au site via HTTPS.</li>
        <li>Certbot (Let’s Encrypt) → Certificat SSL automatique.</li>
        <li>N8n → Gestion des tâches automatisées.</li>
        <li>Umami → Gestion des statistiques.</li>
        <li>Phpmyadmin → Gestion de la base de données.</li>
    </ul>
</div>
</div>

<style>
    .about {
        background-color: #71aeeb;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100vw;
        height: auto;
        padding: 20px;
        color: #fff;
        font-family: Arial, sans-serif;
        border: 1px solid #fff;
        
    }
    .about-content {
        position: relative;
        width: 50%;
        padding: 20px;
        color: #fff;
        font-family: Arial, sans-serif;
        border: 1px solid #fff;
        border-radius: 10px;
        z-index: 1;
    }
    .about-content::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea67 0%, #764ba2 100%);
        filter: blur(10px);
        z-index: -1;
    }
    .about-content h2, .about-content h3, .about-content h4 {
        margin-top: 20px;
    }
    .about-content ul {
        list-style-type: none;
        padding: 0;
    }
    .about-content li {
        margin-bottom: 10px;
    }
</style>
