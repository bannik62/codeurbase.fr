<script>
  import { onMount } from 'svelte';
  import { currentPage } from '../../stores/router.js';
  import SessionGuard, { sessionValid, sessionUser } from '../ModuleSecure/SessionGuard.svelte';
  import AccessDenied from './AccessDenied.svelte';
  import Navbar from '../../modules/ui/portfolio/navbar/Navbar.svelte';
  import { 
    adminBoardManager,
    isLoading,
    dashboardError,
    dashboardData,
    isAdmin,
    adminUtils
  } from '../ModuleSecure/script.AdminBoard.js';
  import { currentUser } from '../ModuleSecure/scriptLogin.js';
  
  /**
   * Callback quand la session est valide
   */
  function handleValidSession(user) {
    console.log('[AdminBoard] Session valide, initialisation du dashboard...');
    currentUser.set(user);
    adminBoardManager.initialize();
  }
  
  /**
   * Callback quand la session est invalide
   */
  function handleInvalidSession() {
    console.warn('[AdminBoard] Session invalide');
    // On ne redirige PAS, on affiche juste AccessDenied
  }
  
  /**
   * Rafraîchit les données
   */
  function handleRefresh() {
    adminBoardManager.refresh();
  }
  
  /**
   * Déconnexion
   */
  function handleLogout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      adminBoardManager.logout();
      console.log('[AdminBoard UI] Déconnexion, redirection vers /login...');
      setTimeout(() => {
        currentPage.set('login');
      }, 300);
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
  <div class="checking-session">
      <div class="spinner-large"></div>
      <p>Vérification de la session...</p>
    </div>
    {:else if $sessionValid === false}
    <!-- Session invalide - Afficher page d'accès refusé -->
    <AccessDenied />
    {:else if $sessionValid === true}
    <Navbar />
  <!-- Session valide - Afficher le dashboard -->
  <main class="admin-board">
  
  <!-- Header -->
  <header class="board-header">
    <div class="header-content">
      <div class="header-left">
        <h1>Tableau de bord</h1>
        {#if $currentUser}
          <p class="user-info">
            <span class="user-icon">👤</span>
            <span class="user-name">{$currentUser.username}</span>
            <span class="user-role" class:is-admin={$isAdmin}>
              {$currentUser.role}
            </span>
          </p>
        {/if}
      </div>
      <div class="header-right">
        <button 
          class="btn-refresh" 
          on:click={handleRefresh}
          disabled={$isLoading}
        >
          🔄 Rafraîchir
        </button>
        <button 
          class="btn-logout" 
          on:click={handleLogout}
        >
          🚪 Déconnexion
        </button>
      </div>
    </div>
  </header>
  
  <!-- Contenu principal -->
  <div class="board-content">
    
    {#if $isLoading}
      <!-- État de chargement -->
      <div class="loading-state">
        <span class="spinner-large"></span>
        <p>Chargement du tableau de bord...</p>
      </div>
      
    {:else if $dashboardError}
      <!-- État d'erreur -->
      <div class="error-state">
        <span class="error-icon">❌</span>
        <h2>Erreur de chargement</h2>
        <p>{$dashboardError}</p>
        <button class="btn-retry" on:click={handleRefresh}>
          Réessayer
        </button>
      </div>
      
    {:else}
      <!-- Statistiques -->
      <section class="stats-section">
        <h2>Statistiques</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-content">
              <p class="stat-label">Utilisateurs totaux</p>
              <p class="stat-value">
                {adminUtils.formatNumber($dashboardData.stats.totalUsers)}
              </p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">🟢</div>
            <div class="stat-content">
              <p class="stat-label">Utilisateurs actifs</p>
              <p class="stat-value">
                {adminUtils.formatNumber($dashboardData.stats.activeUsers)}
              </p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">🔗</div>
            <div class="stat-content">
              <p class="stat-label">Sessions totales</p>
              <p class="stat-value">
                {adminUtils.formatNumber($dashboardData.stats.totalSessions)}
              </p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <p class="stat-label">Requêtes totales</p>
              <p class="stat-value">
                {adminUtils.formatNumber($dashboardData.stats.totalRequests)}
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Activité récente -->
      <section class="activity-section">
        <h2>Activité récente</h2>
        <div class="activity-list">
          {#each $dashboardData.recentActivity as activity (activity.id)}
            <div class="activity-item">
              <div 
                class="activity-icon"
                style="background-color: {adminUtils.getActivityColor(activity.type)};"
              >
                {adminUtils.getActivityIcon(activity.type)}
              </div>
              <div class="activity-content">
                <p class="activity-message">{activity.message}</p>
                <p class="activity-meta">
                  <span class="activity-user">{activity.user}</span>
                  <span class="activity-separator">•</span>
                  <span class="activity-time">
                    {adminUtils.formatRelativeTime(activity.timestamp)}
                  </span>
                </p>
              </div>
            </div>
          {/each}
        </div>
      </section>
      
      <!-- État du système -->
      <section class="system-section">
        <h2>État du système</h2>
        <div class="system-status">
          <div class="status-indicator" class:ok={$dashboardData.systemStatus === 'ok'}>
            {#if $dashboardData.systemStatus === 'ok'}
              ✅ Tous les systèmes fonctionnent normalement
            {:else}
              ⚠️ Problème détecté
            {/if}
          </div>
        </div>
      </section>
      
      <!-- Message admin only -->
      {#if !$isAdmin}
        <section class="warning-section">
          <div class="warning-box">
            ⚠️ Vous n'avez pas les droits administrateur. Certaines fonctionnalités sont limitées.
          </div>
        </section>
      {/if}
    {/if}
    
  </div>
  
</main>
{/if}

<style>
  /* Styles pour l'état de vérification */

  

  
  /* Reste des styles */
  .admin-board {
    width: 100vw;
    min-height: 100vh;
    background: #404752;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }
  
  /* Header */
  .board-header {
    margin-top: 10%;
    background: white;
    border-bottom: 1px solid #e0e0e0;
    padding: clamp(1rem, 3vw, 1.5rem);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
  
  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .header-left h1 {
    margin: 0;
    font-size: clamp(1.5rem, 4vw, 2rem);
    color: #333;
    font-weight: 700;
  }
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
    font-size: clamp(0.85rem, 2vw, 0.95rem);
    color: #666;
  }
  
  .user-name {
    font-weight: 600;
    color: #333;
  }
  
  .user-role {
    padding: 0.25rem 0.75rem;
    background: #e3f2fd;
    color: #1976d2;
    border-radius: 1rem;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
  }
  
  .user-role.is-admin {
    background: #e8f5e9;
    color: #2e7d32;
  }
  
  .header-right {
    display: flex;
    gap: 0.75rem;
  }
  
  .btn-refresh,
  .btn-logout {
    padding: clamp(0.5rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem);
    border: none;
    border-radius: 0.5rem;
    font-size: clamp(0.85rem, 2vw, 0.95rem);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .btn-refresh {
    background: #667eea;
    color: white;
  }
  
  .btn-refresh:hover:not(:disabled) {
    background: #5568d3;
    transform: translateY(-2px);
  }
  
  .btn-refresh:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .btn-logout {
    background: #ff5252;
    color: white;
  }
  
  .btn-logout:hover {
    background: #e63946;
    transform: translateY(-2px);
  }
  
  /* Contenu */
  .board-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: clamp(1rem, 3vw, 2rem);
  }
  
  /* États */
  .loading-state,
  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    gap: 1rem;
  }
  
  .spinner-large {
    display: inline-block;
    width: 3rem;
    height: 3rem;
    border: 4px solid rgba(102, 126, 234, 0.2);
    border-top-color: #667eea;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .error-icon {
    font-size: 3rem;
  }
  
  .error-state h2 {
    margin: 0;
    color: #333;
  }
  
  .error-state p {
    color: #666;
    margin: 0.5rem 0 1rem 0;
  }
  
  .btn-retry {
    padding: 0.75rem 1.5rem;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
  }
  
  .btn-retry:hover {
    background: #5568d3;
  }
  
  /* Sections */
  section {
    background: white;
    border-radius: 0.75rem;
    padding: clamp(1.5rem, 4vw, 2rem);
    margin-bottom: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
  
  section h2 {
    margin: 0 0 1.5rem 0;
    font-size: clamp(1.25rem, 3vw, 1.5rem);
    color: #333;
    font-weight: 700;
  }
  
  /* Statistiques */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }
  
  .stat-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 0.75rem;
    color: white;
  }
  
  .stat-icon {
    font-size: 2.5rem;
  }
  
  .stat-label {
    margin: 0;
    font-size: clamp(0.8rem, 2vw, 0.9rem);
    opacity: 0.9;
  }
  
  .stat-value {
    margin: 0.25rem 0 0 0;
    font-size: clamp(1.5rem, 4vw, 2rem);
    font-weight: 700;
  }
  
  /* Activité */
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
    background: #f8f9fa;
    border-radius: 0.5rem;
    transition: background 0.2s;
  }
  
  .activity-item:hover {
    background: #e9ecef;
  }
  
  .activity-icon {
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 1.25rem;
    flex-shrink: 0;
  }
  
  .activity-content {
    flex: 1;
  }
  
  .activity-message {
    margin: 0 0 0.25rem 0;
    color: #333;
    font-weight: 500;
  }
  
  .activity-meta {
    margin: 0;
    font-size: 0.85rem;
    color: #666;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .activity-user {
    font-weight: 600;
  }
  
  .activity-separator {
    opacity: 0.5;
  }
  
  /* Système */
  .system-status {
    display: flex;
    justify-content: center;
  }
  
  .status-indicator {
    padding: 1rem 2rem;
    background: #ffebee;
    color: #c62828;
    border-radius: 0.5rem;
    font-weight: 600;
    font-size: clamp(0.9rem, 2vw, 1rem);
  }
  
  .status-indicator.ok {
    background: #e8f5e9;
    color: #2e7d32;
  }
  
  /* Warning */
  .warning-section {
    background: transparent;
    box-shadow: none;
    padding: 0;
  }
  
  .warning-box {
    padding: 1rem 1.5rem;
    background: #fff3cd;
    color: #856404;
    border-radius: 0.5rem;
    border-left: 4px solid #ffc107;
    font-weight: 500;
  }
</style>

