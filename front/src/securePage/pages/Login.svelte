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
   
    
  </div>
</main>

<style>
  .login-page {
    min-height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #322f2ff4;
    padding: clamp(1rem, 3vw, 2rem);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }
  
  .login-container {
    background: rgba(51, 51, 51, 0.95);
    border-radius: clamp(1rem, 2vw, 1.5rem);
    box-shadow: 0 0 20px rgba(255, 31, 31, 0.3);
    border: 1px solid #ff1f1f;
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
    color: #fff;
    margin: 0 0 0.5rem 0;
    font-weight: 700;
    font-family: "Orbitron", cursive;
    text-shadow: 0 0 10px #ff1f1f;
  }
  
  .login-header p {
    font-size: clamp(0.9rem, 2vw, 1rem);
    color: #ccc;
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
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    border: 1px solid #666;
  }
  
  .csrf-error {
    background: rgba(255, 31, 31, 0.2);
    color: #ff1f1f;
    border: 1px solid #ff1f1f;
  }
  
  .csrf-success {
    background: rgba(0, 255, 0, 0.1);
    color: #0f0;
    border: 1px solid #0f0;
  }
  
  .btn-refresh {
    margin-left: auto;
    padding: 0.25rem 0.75rem;
    background: #ff1f1f;
    color: white;
    border: 1px solid #ff1f1f;
    border-radius: 0.25rem;
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.3s ease;
  }
  
  .btn-refresh:hover {
    box-shadow: 0 0 10px rgba(255, 31, 31, 0.5);
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
    color: #fff;
    font-size: clamp(0.9rem, 2vw, 1rem);
  }
  
  .form-group input {
    padding: clamp(0.75rem, 2vw, 1rem);
    border: 2px solid #555;
    border-radius: 0.5rem;
    font-size: clamp(0.9rem, 2vw, 1rem);
    transition: all 0.2s;
    background: #1a1a1a;
    color: #fff;
  }
  
  .form-group input:focus {
    outline: none;
    border-color: #ff1f1f;
    box-shadow: 0 0 10px rgba(255, 31, 31, 0.3);
  }
  
  .form-group input:disabled {
    background: #2a2a2a;
    cursor: not-allowed;
    opacity: 0.5;
  }
  
  .form-group input.error {
    border-color: #ff1f1f;
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
    color: #ff1f1f;
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
    border: 1px solid;
  }
  
  .login-error {
    background: rgba(255, 31, 31, 0.2);
    color: #ff1f1f;
    border-color: #ff1f1f;
  }
  
  .login-success {
    background: rgba(0, 255, 0, 0.1);
    color: #0f0;
    border-color: #0f0;
  }
  
  /* Bouton de soumission */
  .btn-submit {
    padding: clamp(0.875rem, 2vw, 1rem);
    background: #ff1f1f;
    color: white;
    border: 1px solid #ff1f1f;
    border-radius: 0.5rem;
    font-size: clamp(0.95rem, 2vw, 1.1rem);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-family: "Orbitron", cursive;
  }
  
  .btn-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 0 20px rgba(255, 31, 31, 0.6);
    text-shadow: 0 0 10px #ff1f1f;
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
    background: rgba(255, 31, 31, 0.1);
    border: 1px solid #ff1f1f;
    border-radius: 0.5rem;
    font-size: 0.85rem;
  }
  
  .debug-info h3 {
    margin: 0 0 0.75rem 0;
    font-size: 1rem;
    color: #fff;
  }
  
  .debug-info p {
    margin: 0.5rem 0;
    color: #ccc;
  }
  
  .debug-info ul {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }
  
  .debug-info li {
    margin: 0.25rem 0;
    color: #ccc;
  }
  
  .debug-info code {
    background: #1a1a1a;
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-family: 'Courier New', monospace;
    color: #ff1f1f;
    font-weight: 600;
  }
</style>

