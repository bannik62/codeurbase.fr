<script>
  import { onMount } from 'svelte';
  import { currentPage } from '../../stores/router.js';
  import Navbar from '../../modules/ui/portfolio/navbar/Navbar.svelte';
  import { 
    loginManager, 
    csrfToken, 
    csrfExpiresAt,
    isLoadingCsrf, 
    csrfError,
    isLoggingIn,
    loginError,
    loginSuccess,
    currentUser,
    loginUtils
  } from '../ModuleSecure/scriptLogin.js';
  
  // Variables du formulaire
  let username = '';
  let password = '';
  let showPassword = false;
  let formErrors = {
    username: null,
    password: null
  };
  
  // Informations de débogage
  let showDebugInfo = true;
  
  /**
   * Gère la soumission du formulaire
   */
  async function handleSubmit(event) {
    event.preventDefault();
    
    // Reset des erreurs
    formErrors = {
      username: null,
      password: null
    };
    
    // Validation côté client
    const usernameError = loginUtils.validateUsername(username);
    const passwordError = loginUtils.validatePassword(password);
    
    if (usernameError) {
      formErrors.username = usernameError;
      return;
    }
    
    if (passwordError) {
      formErrors.password = passwordError;
      return;
    }
    
    // Tentative de connexion
    try {
      await loginManager.login(username, password);
      
      // Redirection après connexion réussie
      if ($loginSuccess) {
        console.log('[Login UI] Connexion réussie, redirection vers /admin...');
        setTimeout(() => {
          currentPage.set('admin');
        }, 800);
      }
    } catch (error) {
      console.error('[Login UI] Erreur:', error);
    }
  }
  
  /**
   * Rafraîchit manuellement le token CSRF
   */
  function refreshCsrfToken() {
    loginManager.fetchCsrfToken();
  }
  
  onMount(() => {
    console.log('[Login UI] Composant monté');
  });
</script>

<main class="login-page">
  <Navbar />
  <div class="login-container">
    
    <!-- En-tête -->
    <div class="login-header">
      <h1>Connexion</h1>
      <p>Accédez à votre espace sécurisé</p>
    </div>
    
    <!-- État du token CSRF -->
    <div class="csrf-status">
      {#if $isLoadingCsrf}
        <div class="csrf-loading">
          <span class="spinner"></span>
          <span>Chargement de la sécurité CSRF...</span>
        </div>
      {:else if $csrfError}
        <div class="csrf-error">
          <span>❌</span>
          <span>Erreur CSRF: {$csrfError}</span>
          <button on:click={refreshCsrfToken} class="btn-refresh">
            Réessayer
          </button>
        </div>
      {:else if $csrfToken}
        <div class="csrf-success">
          <span>🔒</span>
          <span>Protection CSRF active</span>
        </div>
      {/if}
    </div>
    
    <!-- Formulaire de connexion -->
    <form on:submit={handleSubmit} class="login-form">
      
      <!-- Champ Username -->
      <div class="form-group">
        <label for="username">
          Nom d'utilisateur
        </label>
        <input
          id="username"
          type="text"
          bind:value={username}
          placeholder="Entrez votre nom d'utilisateur"
          disabled={!$csrfToken || $isLoggingIn}
          class:error={formErrors.username}
        />
        {#if formErrors.username}
          <span class="error-message">{formErrors.username}</span>
        {/if}
      </div>
      
      <!-- Champ Password -->
      <div class="form-group">
        <label for="password">
          Mot de passe
        </label>
        <div class="password-input-wrapper">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            bind:value={password}
            placeholder="Entrez votre mot de passe"
            disabled={!$csrfToken || $isLoggingIn}
            class:error={formErrors.password}
          />
          <button
            type="button"
            class="toggle-password"
            on:click={() => showPassword = !showPassword}
            disabled={!$csrfToken || $isLoggingIn}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
        {#if formErrors.password}
          <span class="error-message">{formErrors.password}</span>
        {/if}
      </div>
      
      <!-- Erreur de connexion -->
      {#if $loginError}
        <div class="login-error">
          ⚠️ {$loginError}
        </div>
      {/if}
      
      <!-- Succès de connexion -->
      {#if $loginSuccess && $currentUser}
        <div class="login-success">
          ✅ Connexion réussie ! Bienvenue {$currentUser.username}
        </div>
      {/if}
      
      <!-- Bouton de soumission -->
      <button 
        type="submit" 
        class="btn-submit"
        disabled={!$csrfToken || $isLoggingIn}
      >
        {#if $isLoggingIn}
          <span class="spinner"></span>
          Connexion en cours...
        {:else}
          Se connecter
        {/if}
      </button>
    </form>
    
    <!-- Informations de debug -->
    {#if showDebugInfo}
      <div class="debug-info">
        <h3>🔧 Informations de test</h3>
        <p><strong>Identifiants fictifs disponibles :</strong></p>
        <ul>
          <li><code>admin</code> / <code>admin123</code> (rôle: admin)</li>
          <li><code>user</code> / <code>user123</code> (rôle: user)</li>
          <li><code>test</code> / <code>test123</code> (rôle: user)</li>
        </ul>
        
        {#if $csrfToken}
          <p>
            <strong>Token CSRF :</strong> 
            <code>{$csrfToken.substring(0, 16)}...</code>
          </p>
          {#if $csrfExpiresAt}
            <p>
              <strong>Expire dans :</strong> 
              {loginUtils.formatTimeRemaining($csrfExpiresAt)}
            </p>
          {/if}
        {/if}
      </div>
    {/if}
    
  </div>
</main>

<style>
  .login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: clamp(1rem, 3vw, 2rem);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }
  
  .login-container {
    background: white;
    border-radius: clamp(1rem, 2vw, 1.5rem);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    padding: clamp(2rem, 5vw, 3rem);
    width: 100%;
    max-width: 450px;
  }
  
  .login-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .login-header h1 {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    color: #333;
    margin: 0 0 0.5rem 0;
    font-weight: 700;
  }
  
  .login-header p {
    font-size: clamp(0.9rem, 2vw, 1rem);
    color: #666;
    margin: 0;
  }
  
  /* État CSRF */
  .csrf-status {
    margin-bottom: 1.5rem;
  }
  
  .csrf-loading,
  .csrf-error,
  .csrf-success {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.9rem;
  }
  
  .csrf-loading {
    background: #e3f2fd;
    color: #1976d2;
  }
  
  .csrf-error {
    background: #ffebee;
    color: #c62828;
  }
  
  .csrf-success {
    background: #e8f5e9;
    color: #2e7d32;
  }
  
  .btn-refresh {
    margin-left: auto;
    padding: 0.25rem 0.75rem;
    background: #c62828;
    color: white;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    font-size: 0.85rem;
  }
  
  .btn-refresh:hover {
    background: #b71c1c;
  }
  
  /* Formulaire */
  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .form-group label {
    font-weight: 600;
    color: #333;
    font-size: clamp(0.9rem, 2vw, 1rem);
  }
  
  .form-group input {
    padding: clamp(0.75rem, 2vw, 1rem);
    border: 2px solid #e0e0e0;
    border-radius: 0.5rem;
    font-size: clamp(0.9rem, 2vw, 1rem);
    transition: border-color 0.2s;
  }
  
  .form-group input:focus {
    outline: none;
    border-color: #667eea;
  }
  
  .form-group input:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
  
  .form-group input.error {
    border-color: #c62828;
  }
  
  .password-input-wrapper {
    position: relative;
    display: flex;
  }
  
  .password-input-wrapper input {
    flex: 1;
    padding-right: 3rem;
  }
  
  .toggle-password {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.25rem;
    padding: 0.5rem;
  }
  
  .toggle-password:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .error-message {
    color: #c62828;
    font-size: 0.85rem;
    margin-top: -0.25rem;
  }
  
  /* Messages */
  .login-error,
  .login-success {
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.9rem;
    text-align: center;
  }
  
  .login-error {
    background: #ffebee;
    color: #c62828;
  }
  
  .login-success {
    background: #e8f5e9;
    color: #2e7d32;
  }
  
  /* Bouton de soumission */
  .btn-submit {
    padding: clamp(0.875rem, 2vw, 1rem);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: clamp(0.95rem, 2vw, 1.1rem);
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
  
  .btn-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  }
  
  .btn-submit:active:not(:disabled) {
    transform: translateY(0);
  }
  
  .btn-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  /* Spinner */
  .spinner {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  /* Debug info */
  .debug-info {
    margin-top: 2rem;
    padding: 1rem;
    background: #f5f5f5;
    border-radius: 0.5rem;
    font-size: 0.85rem;
  }
  
  .debug-info h3 {
    margin: 0 0 0.75rem 0;
    font-size: 1rem;
    color: #333;
  }
  
  .debug-info p {
    margin: 0.5rem 0;
    color: #666;
  }
  
  .debug-info ul {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }
  
  .debug-info li {
    margin: 0.25rem 0;
    color: #666;
  }
  
  .debug-info code {
    background: white;
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-family: 'Courier New', monospace;
    color: #667eea;
    font-weight: 600;
  }
</style>

