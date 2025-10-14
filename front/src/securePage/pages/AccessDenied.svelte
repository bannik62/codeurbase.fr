<script>
  import { currentPage } from '../../stores/router.js';
  
  /**
   * Redirection vers la page de login
   */
  function goToLogin() {
    currentPage.set('login');
  }
  
  /**
   * Retour à l'accueil
   */
  function goToHome() {
    currentPage.set('acceuil');
  }
</script>

<main class="access-denied">
  <div class="content">
    <div class="icon">🔒</div>
    <h1>Accès refusé</h1>
    <p class="message">
      Vous n'avez pas les permissions nécessaires pour accéder à cette page.
    </p>
    <p class="submessage">
      Cette section est réservée aux utilisateurs authentifiés.
    </p>
    
    <div class="actions">
      <button class="btn-login" on:click={goToLogin}>
        🔐 Se connecter
      </button>
      <button class="btn-home" on:click={goToHome}>
        🏠 Retour à l'accueil
      </button>
    </div>
  </div>
</main>

<style>
  .access-denied {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #322f2ff4;
    padding: clamp(1rem, 3vw, 2rem);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }
  
  .content {
    background: rgba(51, 51, 51, 0.95);
    border: 1px solid #ff1f1f;
    border-radius: clamp(1rem, 2vw, 1.5rem);
    box-shadow: 0 0 20px rgba(255, 31, 31, 0.3);
    padding: clamp(3rem, 6vw, 4rem);
    text-align: center;
    max-width: 500px;
    width: 100%;
  }
  
  .icon {
    font-size: clamp(4rem, 10vw, 6rem);
    margin-bottom: 1.5rem;
    animation: pulse 2s ease-in-out infinite;
    filter: drop-shadow(0 0 10px #ff1f1f);
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }
  
  h1 {
    font-size: clamp(2rem, 5vw, 3rem);
    color: #fff;
    margin: 0 0 1rem 0;
    font-weight: 700;
    font-family: "Orbitron", cursive;
    text-shadow: 0 0 10px #ff1f1f;
  }
  
  .message {
    font-size: clamp(1rem, 3vw, 1.25rem);
    color: #ccc;
    margin: 0 0 0.5rem 0;
    line-height: 1.6;
  }
  
  .submessage {
    font-size: clamp(0.9rem, 2vw, 1rem);
    color: #999;
    margin: 0 0 2.5rem 0;
  }
  
  .actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  button {
    padding: clamp(0.875rem, 2vw, 1rem) clamp(1.5rem, 4vw, 2rem);
    border: 1px solid #ff1f1f;
    border-radius: 0.5rem;
    font-size: clamp(0.95rem, 2vw, 1.1rem);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: "Orbitron", cursive;
  }
  
  .btn-login {
    background: #ff1f1f;
    color: white;
  }
  
  .btn-login:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 20px rgba(255, 31, 31, 0.6);
    text-shadow: 0 0 10px #ff1f1f;
  }
  
  .btn-home {
    background: transparent;
    color: #fff;
  }
  
  .btn-home:hover {
    background: rgba(255, 31, 31, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 0 20px rgba(255, 31, 31, 0.4);
  }
  
  button:active {
    transform: translateY(0);
  }
  
  @media (min-width: 600px) {
    .actions {
      flex-direction: row;
      justify-content: center;
    }
  }
</style>

