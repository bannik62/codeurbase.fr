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

  // Variables pour la création d'article
  let articlePrompt = "";
  let isCreatingArticle = false;
  let articleCreationError = null;
  let articleCreationSuccess = null;
  let generatedArticle = null;

  /**
   * Créer un article via N8N
   */
  async function handleCreateArticle() {
    if (!articlePrompt.trim()) {
      articleCreationError = "Le prompt ne peut pas être vide";
      return;
    }

    isCreatingArticle = true;
    articleCreationError = null;
    articleCreationSuccess = null;
    generatedArticle = null;

    try {
      const BACKEND_URL = import.meta.env.BACKEND_URL || 'https://backend.codeurbase.fr';
      const response = await fetch(`${BACKEND_URL}/auth/createArticle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          prompt: articlePrompt.trim()
        })
      });

      const data = await response.json();
      
      console.log('[AdminBoard] Réponse backend:', data);

      if (response.ok && data.success && data.data) {
        articleCreationSuccess = data.message || "Article généré avec succès";
        
        // N8N retourne { output: { validated: true, article: {...} } }
        generatedArticle = data.data.output?.article || data.data.article || data.data;
        
        console.log('[AdminBoard] Article généré:', generatedArticle);
        
        articlePrompt = "";
      } else {
        articleCreationError = data.message || "Erreur lors de la création de l'article";
      }
    } catch (error) {
      console.error('[AdminBoard] Erreur création article:', error);
      articleCreationError = "Erreur de connexion au serveur";
    } finally {
      isCreatingArticle = false;
    }
  }

  function closeArticlePreview() {
    generatedArticle = null;
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
      
      <!-- Création d'article -->
      {#if $isAdmin}
        <section class="article-creation-section">
          <h2>🤖 Générer un article avec IA</h2>
          
          <div class="article-form">
            <textarea
              class="article-prompt"
              placeholder="Décrivez l'article que vous souhaitez générer (thème, sujet, mots-clés...)&#10;Exemple : Un article sur les nouveautés de Svelte 5, incluant les runes et la réactivité"
              bind:value={articlePrompt}
              rows="5"
              disabled={isCreatingArticle}
            ></textarea>
            
            <button
              class="btn-create-article"
              on:click={handleCreateArticle}
              disabled={isCreatingArticle || !articlePrompt.trim()}
            >
              {#if isCreatingArticle}
                <span class="spinner"></span> Génération en cours...
              {:else}
                🚀 Générer l'article
              {/if}
            </button>
            
            {#if articleCreationSuccess}
              <div class="alert alert-success">
                ✅ {articleCreationSuccess}
              </div>
            {/if}
            
            {#if articleCreationError}
              <div class="alert alert-error">
                ❌ {articleCreationError}
              </div>
            {/if}
            
            <div class="info-box">
              <p><strong>Comment ça marche ?</strong></p>
              <p>1. Décrivez votre article dans le champ ci-dessus</p>
              <p>2. Cliquez sur "Générer l'article"</p>
              <p>3. L'IA génère l'article et l'affiche ci-dessous</p>
              <p>4. L'article sera automatiquement publié sur le blog</p>
            </div>
          </div>
        </section>
      {/if}
      
      <!-- Prévisualisation de l'article généré -->
      {#if generatedArticle}
        <section class="article-preview-section">
          <div class="preview-header">
            <h2>📄 Article généré</h2>
            <button class="btn-close-preview" on:click={closeArticlePreview}>✕</button>
          </div>
          
          <div class="article-preview-content">
            <div class="preview-meta">
              <span class="meta-badge category-badge">{generatedArticle.category}</span>
              <span class="meta-badge author-badge">Par {generatedArticle.author}</span>
            </div>
            
            <h3 class="preview-title">{generatedArticle.title}</h3>
            
            <p class="preview-excerpt">{generatedArticle.excerpt}</p>
            
            <div class="preview-tags">
              {#each generatedArticle.tags as tag}
                <span class="preview-tag">{tag}</span>
              {/each}
            </div>
            
            <div class="preview-content">
              <h4>Contenu de l'article :</h4>
              <div class="preview-html">
                {@html generatedArticle.content}
              </div>
            </div>
            
            <div class="preview-actions">
              <button class="btn-publish" disabled>
                ✅ Article prêt à être publié
              </button>
              <p class="publish-note">L'article sera visible sur la page Blog dès qu'il sera en BDD</p>
            </div>
          </div>
        </section>
      {/if}
      
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
  .checking-session {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    background: #322f2ff4;
    color: #fff;
  }
  
  /* Reste des styles */
  .admin-board {
    width: 100vw;
    min-height: 100vh;
    background: #322f2ff4;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }
  
  /* Header */
  .board-header {
    margin-top: 10%;
    background: rgba(51, 51, 51, 0.95);
    border-bottom: 1px solid #ff1f1f;
    padding: clamp(1rem, 3vw, 1.5rem);
    box-shadow: 0 0 20px rgba(255, 31, 31, 0.3);
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
    color: #fff;
    font-weight: 700;
    font-family: "Orbitron", cursive;
    text-shadow: 0 0 10px #ff1f1f;
  }
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
    font-size: clamp(0.85rem, 2vw, 0.95rem);
    color: #ccc;
  }
  
  .user-name {
    font-weight: 600;
    color: #fff;
  }
  
  .user-role {
    padding: 0.25rem 0.75rem;
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    border: 1px solid #666;
    border-radius: 1rem;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
  }
  
  .user-role.is-admin {
    background: rgba(255, 31, 31, 0.2);
    color: #ff1f1f;
    border-color: #ff1f1f;
  }
  
  .header-right {
    display: flex;
    gap: 0.75rem;
  }
  
  .btn-refresh,
  .btn-logout {
    padding: clamp(0.5rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem);
    border: 1px solid #ff1f1f;
    border-radius: 0.5rem;
    font-size: clamp(0.85rem, 2vw, 0.95rem);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: "Orbitron", cursive;
  }
  
  .btn-refresh {
    background: transparent;
    color: white;
  }
  
  .btn-refresh:hover:not(:disabled) {
    background: #ff1f1f;
    transform: translateY(-2px);
    box-shadow: 0 0 20px rgba(255, 31, 31, 0.6);
    text-shadow: 0 0 10px #ff1f1f;
  }
  
  .btn-refresh:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .btn-logout {
    background: #ff1f1f;
    color: white;
  }
  
  .btn-logout:hover {
    background: transparent;
    transform: translateY(-2px);
    box-shadow: 0 0 20px rgba(255, 31, 31, 0.6);
    text-shadow: 0 0 10px #ff1f1f;
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
    border: 4px solid rgba(255, 31, 31, 0.2);
    border-top-color: #ff1f1f;
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
    color: #fff;
  }
  
  .error-state p {
    color: #ccc;
    margin: 0.5rem 0 1rem 0;
  }
  
  .btn-retry {
    padding: 0.75rem 1.5rem;
    background: #ff1f1f;
    color: white;
    border: 1px solid #ff1f1f;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: "Orbitron", cursive;
  }
  
  .btn-retry:hover {
    box-shadow: 0 0 20px rgba(255, 31, 31, 0.6);
    text-shadow: 0 0 10px #ff1f1f;
  }
  
  /* Sections */
  section {
    background: rgba(51, 51, 51, 0.95);
    border: 1px solid #ff1f1f;
    border-radius: 0.75rem;
    padding: clamp(1.5rem, 4vw, 2rem);
    margin-bottom: 1.5rem;
    box-shadow: 0 0 20px rgba(255, 31, 31, 0.2);
  }
  
  section h2 {
    margin: 0 0 1.5rem 0;
    font-size: clamp(1.25rem, 3vw, 1.5rem);
    color: #fff;
    font-weight: 700;
    font-family: "Orbitron", cursive;
    text-shadow: 0 0 10px #ff1f1f;
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
    background: rgba(255, 31, 31, 0.1);
    border: 1px solid #ff1f1f;
    border-radius: 0.75rem;
    color: white;
    transition: all 0.3s ease;
  }
  
  .stat-card:hover {
    box-shadow: 0 0 20px rgba(255, 31, 31, 0.4);
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
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid #555;
    border-radius: 0.5rem;
    transition: all 0.3s ease;
  }
  
  .activity-item:hover {
    background: rgba(255, 31, 31, 0.1);
    border-color: #ff1f1f;
    box-shadow: 0 0 10px rgba(255, 31, 31, 0.3);
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
    color: #fff;
    font-weight: 500;
  }
  
  .activity-meta {
    margin: 0;
    font-size: 0.85rem;
    color: #ccc;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .activity-user {
    font-weight: 600;
    color: #ff1f1f;
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
    background: rgba(255, 31, 31, 0.2);
    color: #ff1f1f;
    border: 1px solid #ff1f1f;
    border-radius: 0.5rem;
    font-weight: 600;
    font-size: clamp(0.9rem, 2vw, 1rem);
  }
  
  .status-indicator.ok {
    background: rgba(0, 255, 0, 0.1);
    color: #0f0;
    border-color: #0f0;
  }
  
  /* Warning */
  .warning-section {
    background: transparent;
    box-shadow: none;
    padding: 0;
    border: none;
  }
  
  .warning-box {
    padding: 1rem 1.5rem;
    background: rgba(255, 193, 7, 0.1);
    color: #ffc107;
    border-radius: 0.5rem;
    border: 1px solid #ffc107;
    font-weight: 500;
  }

  /* Article Creation */
  .article-creation-section {
    border: 2px solid #ff1f1f !important;
    box-shadow: 0 0 30px rgba(255, 31, 31, 0.3) !important;
  }

  .article-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .article-prompt {
    width: 100%;
    min-height: 150px;
    padding: 1rem;
    border: 2px solid #555;
    border-radius: 0.5rem;
    font-family: inherit;
    font-size: clamp(0.9rem, 2vw, 1rem);
    resize: vertical;
    transition: all 0.2s;
    background: #1a1a1a;
    color: #fff;
  }

  .article-prompt:focus {
    outline: none;
    border-color: #ff1f1f;
    box-shadow: 0 0 10px rgba(255, 31, 31, 0.3);
  }

  .article-prompt:disabled {
    background: #2a2a2a;
    cursor: not-allowed;
    opacity: 0.5;
  }

  .btn-create-article {
    padding: 1rem 2rem;
    background: #ff1f1f;
    color: white;
    border: 1px solid #ff1f1f;
    border-radius: 0.5rem;
    font-size: clamp(0.9rem, 2vw, 1rem);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-family: "Orbitron", cursive;
  }

  .btn-create-article:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 0 20px rgba(255, 31, 31, 0.6);
    text-shadow: 0 0 10px #ff1f1f;
  }

  .btn-create-article:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .spinner {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  .alert {
    padding: 1rem;
    border-radius: 0.5rem;
    font-weight: 500;
    border: 1px solid;
  }

  .alert-success {
    background: rgba(0, 255, 0, 0.1);
    color: #0f0;
    border-color: #0f0;
  }

  .alert-error {
    background: rgba(255, 31, 31, 0.2);
    color: #ff1f1f;
    border-color: #ff1f1f;
  }

  .info-box {
    padding: 1rem;
    background: rgba(33, 150, 243, 0.1);
    border-radius: 0.5rem;
    border: 1px solid #2196f3;
  }

  .info-box p {
    margin: 0.5rem 0;
    color: #64b5f6;
    font-size: clamp(0.85rem, 2vw, 0.95rem);
  }

  .info-box p:first-child {
    margin-top: 0;
    color: #fff;
    font-weight: 600;
  }

  .info-box p:last-child {
    margin-bottom: 0;
  }

  /* Article Preview */
  .article-preview-section {
    border: 2px solid #28a745;
    background: linear-gradient(135deg, rgba(40, 167, 69, 0.05), rgba(255, 255, 255, 1));
  }

  .preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #e0e0e0;
  }

  .preview-header h2 {
    margin: 0;
  }

  .btn-close-preview {
    background: #dc3545;
    color: white;
    border: none;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    font-size: 1.2rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-close-preview:hover {
    transform: rotate(90deg) scale(1.1);
    background: #c82333;
  }

  .article-preview-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .preview-meta {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .meta-badge {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
  }

  .category-badge {
    background: #667eea;
    color: white;
  }

  .author-badge {
    background: #f0f0f0;
    color: #333;
  }

  .preview-title {
    font-size: clamp(1.5rem, 3vw, 2rem);
    color: #333;
    margin: 0;
    line-height: 1.3;
  }

  .preview-excerpt {
    color: #666;
    font-size: clamp(1rem, 2vw, 1.1rem);
    line-height: 1.6;
    margin: 0;
  }

  .preview-tags {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .preview-tag {
    background: #e7f3ff;
    color: #0d47a1;
    padding: 0.4rem 0.8rem;
    border-radius: 15px;
    font-size: 0.85rem;
    border: 1px solid #2196f3;
  }

  .preview-content {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 0.5rem;
    border: 1px solid #dee2e6;
  }

  .preview-content h4 {
    margin: 0 0 1rem 0;
    color: #333;
  }

  .preview-html {
    color: #333;
    line-height: 1.8;
  }

  .preview-html :global(h2) {
    color: #667eea;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
  }

  .preview-html :global(h3) {
    color: #764ba2;
    margin-top: 1.2rem;
    margin-bottom: 0.8rem;
  }

  .preview-html :global(p) {
    margin-bottom: 1rem;
  }

  .preview-html :global(code) {
    background: #e9ecef;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: monospace;
  }

  .preview-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background: #d4edda;
    border-radius: 0.5rem;
  }

  .btn-publish {
    padding: 1rem 2rem;
    background: #28a745;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: not-allowed;
    opacity: 0.8;
  }

  .publish-note {
    margin: 0;
    color: #155724;
    font-size: 0.9rem;
    text-align: center;
  }
</style>

