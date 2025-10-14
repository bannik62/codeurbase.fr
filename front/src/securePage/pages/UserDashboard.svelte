<script>
  import { onMount } from 'svelte';
  import { currentPage } from '../../stores/router.js';
  import SessionGuard, { sessionValid, sessionUser } from '../ModuleSecure/SessionGuard.svelte';
  import AccessDenied from './AccessDenied.svelte';
  import Navbar from '../../modules/ui/portfolio/navbar/Navbar.svelte';
  
  /**
   * Callback quand la session est valide
   */
  function handleValidSession(user) {
    console.log('[UserDashboard] Session valide pour:', user);
  }
  
  /**
   * Callback quand la session est invalide
   */
  function handleInvalidSession() {
    console.warn('[UserDashboard] Session invalide');
  }
  
  /**
   * Déconnexion
   */
  function logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      // Appeler l'API de déconnexion
      fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      }).then(() => {
        currentPage.set('login');
      });
    }
  }
</script>

<!-- Composant invisible qui vérifie la session -->
<SessionGuard 
  onValidSession={handleValidSession} 
  onInvalidSession={handleInvalidSession}
  autoCheck={true}
/>

{#if $sessionValid === null}
  <!-- En cours de vérification -->
  <div class="checking">
    <div class="spinner"></div>
    <p>Vérification...</p>
  </div>
  
{:else if $sessionValid === false}
  <!-- Session invalide - Afficher page d'accès refusé -->
  <AccessDenied />
  
{:else if $sessionValid === true}
  <!-- Session valide - Afficher le contenu -->
  <Navbar />
  <main class="user-dashboard">
    
    <header class="header">
      <h1>👤 Mon Espace</h1>
      <button class="btn-logout" on:click={logout}>
        🚪 Déconnexion
      </button>
    </header>
    
    <div class="content">
      
      <!-- Carte d'info utilisateur -->
      <section class="user-card">
        <div class="user-avatar">
          {$sessionUser.username.charAt(0).toUpperCase()}
        </div>
        <h2>{$sessionUser.username}</h2>
        <p class="role">{$sessionUser.role}</p>
        <p class="email">{$sessionUser.email}</p>
      </section>
      
      <!-- Statistiques utilisateur -->
      <section class="stats">
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-info">
            <p class="stat-label">Projets</p>
            <p class="stat-value">12</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-info">
            <p class="stat-label">Tâches complétées</p>
            <p class="stat-value">48</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">⏰</div>
          <div class="stat-info">
            <p class="stat-label">Heures travaillées</p>
            <p class="stat-value">127</p>
          </div>
        </div>
      </section>
      
      <!-- Actions rapides -->
      <section class="quick-actions">
        <h3>Actions rapides</h3>
        <div class="actions-grid">
          <button class="action-btn">
            <span class="action-icon">📝</span>
            Nouveau projet
          </button>
          <button class="action-btn">
            <span class="action-icon">📋</span>
            Mes tâches
          </button>
          <button class="action-btn">
            <span class="action-icon">⚙️</span>
            Paramètres
          </button>
          <button class="action-btn">
            <span class="action-icon">📊</span>
            Rapports
          </button>
        </div>
      </section>
      
      <!-- Activité récente -->
      <section class="recent-activity">
        <h3>Activité récente</h3>
        <div class="activity-list">
          <div class="activity-item">
            <span class="activity-icon">✅</span>
            <div class="activity-content">
              <p><strong>Tâche complétée:</strong> Mise à jour du design</p>
              <p class="activity-time">Il y a 2 heures</p>
            </div>
          </div>
          <div class="activity-item">
            <span class="activity-icon">📝</span>
            <div class="activity-content">
              <p><strong>Nouveau commentaire</strong> sur le projet Portfolio</p>
              <p class="activity-time">Il y a 5 heures</p>
            </div>
          </div>
          <div class="activity-item">
            <span class="activity-icon">🔔</span>
            <div class="activity-content">
              <p><strong>Notification:</strong> Réunion dans 1 heure</p>
              <p class="activity-time">Il y a 1 jour</p>
            </div>
          </div>
        </div>
      </section>
      
    </div>
    
  </main>
{/if}

<style>
  .checking {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    background: #322f2ff4;
    color: #fff;
  }
  
  .spinner {
    width: 3rem;
    height: 3rem;
    border: 4px solid rgba(255, 31, 31, 0.2);
    border-top-color: #ff1f1f;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .user-dashboard {
    min-height: 100vh;
    background: #322f2ff4;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }
  
  .header {
    margin-top: 10%;
    background: rgba(51, 51, 51, 0.95);
    color: white;
    padding: clamp(1.5rem, 4vw, 2rem);
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 0 20px rgba(255, 31, 31, 0.3);
    border-bottom: 1px solid #ff1f1f;
  }
  
  .header h1 {
    margin: 0;
    font-size: clamp(1.5rem, 4vw, 2rem);
    font-family: "Orbitron", cursive;
    text-shadow: 0 0 10px #ff1f1f;
  }
  
  .btn-logout {
    padding: 0.5rem 1rem;
    background: #ff1f1f;
    color: white;
    border: 1px solid #ff1f1f;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    font-family: "Orbitron", cursive;
  }
  
  .btn-logout:hover {
    background: transparent;
    box-shadow: 0 0 20px rgba(255, 31, 31, 0.6);
    text-shadow: 0 0 10px #ff1f1f;
  }
  
  .content {
    max-width: 1200px;
    margin: 0 auto;
    padding: clamp(1.5rem, 4vw, 2rem);
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  /* Carte utilisateur */
  .user-card {
    background: rgba(51, 51, 51, 0.95);
    border: 1px solid #ff1f1f;
    border-radius: 1rem;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 0 20px rgba(255, 31, 31, 0.2);
  }
  
  .user-avatar {
    width: 5rem;
    height: 5rem;
    background: rgba(255, 31, 31, 0.2);
    color: #ff1f1f;
    border: 2px solid #ff1f1f;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: 700;
    margin: 0 auto 1rem auto;
  }
  
  .user-card h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
    color: #fff;
  }
  
  .role {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background: rgba(255, 31, 31, 0.2);
    color: #ff1f1f;
    border: 1px solid #ff1f1f;
    border-radius: 1rem;
    font-size: 0.9rem;
    font-weight: 600;
    margin: 0.5rem 0;
  }
  
  .email {
    color: #ccc;
    margin: 0.5rem 0 0 0;
  }
  
  /* Statistiques */
  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }
  
  .stat-card {
    background: rgba(51, 51, 51, 0.95);
    border: 1px solid #ff1f1f;
    border-radius: 1rem;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 0 20px rgba(255, 31, 31, 0.2);
    transition: all 0.3s ease;
  }
  
  .stat-card:hover {
    box-shadow: 0 0 30px rgba(255, 31, 31, 0.4);
  }
  
  .stat-icon {
    font-size: 2.5rem;
  }
  
  .stat-label {
    margin: 0;
    font-size: 0.9rem;
    color: #ccc;
  }
  
  .stat-value {
    margin: 0.25rem 0 0 0;
    font-size: 1.75rem;
    font-weight: 700;
    color: #fff;
  }
  
  /* Actions rapides */
  .quick-actions,
  .recent-activity {
    background: rgba(51, 51, 51, 0.95);
    border: 1px solid #ff1f1f;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 0 20px rgba(255, 31, 31, 0.2);
  }
  
  .quick-actions h3,
  .recent-activity h3 {
    margin: 0 0 1.5rem 0;
    font-size: 1.25rem;
    color: #fff;
    font-family: "Orbitron", cursive;
    text-shadow: 0 0 10px #ff1f1f;
  }
  
  .actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }
  
  .action-btn {
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid #555;
    border-radius: 0.75rem;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    transition: all 0.3s ease;
    color: #fff;
  }
  
  .action-btn:hover {
    background: rgba(255, 31, 31, 0.1);
    border-color: #ff1f1f;
    transform: translateY(-2px);
    box-shadow: 0 0 20px rgba(255, 31, 31, 0.4);
  }
  
  .action-icon {
    font-size: 2rem;
  }
  
  /* Activité récente */
  .activity-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .activity-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid #555;
    border-radius: 0.75rem;
    transition: all 0.3s ease;
  }
  
  .activity-item:hover {
    background: rgba(255, 31, 31, 0.1);
    border-color: #ff1f1f;
    box-shadow: 0 0 10px rgba(255, 31, 31, 0.3);
  }
  
  .activity-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }
  
  .activity-content {
    flex: 1;
  }
  
  .activity-content p {
    margin: 0;
    color: #fff;
  }
  
  .activity-time {
    font-size: 0.85rem;
    color: #999;
    margin-top: 0.25rem !important;
  }
</style>

