<script>
  import { onMount, onDestroy } from "svelte";
  import { gsap } from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import { initMediaQuery, useMediaQuery } from "../../../stores/mediaQuery.js";
  import { initChatAnimations, cleanupChatAnimations } from "./chatAnimation.js";
  import { useChat, ChatUtils } from "./SpeackMe.js";
  import { getLenis, lenis } from "../../../stores/lenis.js";

  // Enregistrer ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Variables pour les éléments
  let container;
  let animations = {};
  let cleanupFunctions = [];
  
  // Variables pour le chat
  let messageInput;
  let messagesContainer;
  let currentMessage = "";
  let suggestions = ChatUtils.getMessageSuggestions();
  let messages = []; // Variable réactive pour les messages
  let isAutoScrolling = false; // Variable pour détecter le scroll automatique
  
  // Initialiser le hook du chat
  const chat = useChat();
  
  // Fonction pour mettre à jour les messages
  function updateMessages() {
    // Les messages sont maintenant réactifs via les stores
    chat.messages.subscribe(msgs => {
      messages = [...msgs];
      // Scroll automatique après mise à jour
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    })();
  }
  
  // Watcher réactif pour le scroll automatique
  $: if (messages.length > 0) {
    // Utiliser requestAnimationFrame pour un scroll fluide
    requestAnimationFrame(() => {
      scrollToBottom();
    });
  }

  onMount(() => {
    // Récupérer l'instance Lenis existante
    const lenisInstance = getLenis();
    
    if (lenisInstance) {
      console.log('[ChatMvp] Utilisation de l\'instance Lenis existante');
      // Lenis est déjà configuré dans App.svelte
    } else {
      console.warn('[ChatMvp] Aucune instance Lenis trouvée');
    }
    
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
    animations = initChatAnimations(currentSize);
    
    // Initialiser les messages
    updateMessages();
  });

  onDestroy(() => {
    // Nettoyer les animations
    cleanupChatAnimations(animations);
    
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

  // Fonctions pour le chat
  async function handleSendMessage() {
    if (!currentMessage.trim()) return;
    
    try {
      await chat.sendMessage(currentMessage);
      currentMessage = "";
      
      // Mettre à jour l'affichage
      updateMessages();
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      updateMessages();
    }
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  }

  function handleSuggestionClick(suggestion) {
    currentMessage = suggestion;
    handleSendMessage();
  }

  function scrollToBottom() {
    if (messagesContainer) {
      isAutoScrolling = true;
      
      // Utiliser scrollTo pour un scroll fluide
      messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: 'smooth'
      });
      
      // Redonner le contrôle après l'animation
      setTimeout(() => {
        isAutoScrolling = false;
      }, 300);
    }
  }

  // Fonction pour bloquer le scroll pendant l'auto-scroll
  function handleScroll(event) {
    if (isAutoScrolling && messagesContainer) {
      // Pendant l'auto-scroll, forcer le conteneur à rester en bas
      const maxScroll = messagesContainer.scrollHeight - messagesContainer.clientHeight;
      messagesContainer.scrollTop = maxScroll;
    }
  }

  function clearChat() {
    chat.resetSession(); // Réinitialise la session ET efface la conversation
    isAutoScrolling = false; // Réinitialiser l'état du scroll
    updateMessages(); // Mettre à jour l'affichage
  }

  // Fonction pour formater le contenu des messages
  function formatMessageContent(content) {
    return ChatUtils.sanitizeContent(content);
  }
</script>

<div class="chat-container" bind:this={container}>
  <section id="chat-mvp">
    <h2 class="chat-title">Chat MVP IA</h2>
    <p class="chat-description">Interface de chat intelligente basée sur l'intelligence artificielle</p>

    <div class="chat-layout">
      <!-- Section informations IA (gauche) -->
      <div class="chat-info-section">
        <div class="info-content">
          <h3 class="info-title">🤖 Intelligence Artificielle</h3>
          <div class="info-cards">
            <div class="info-card">
              <div class="card-icon">🧠</div>
              <h4>IA Avancée</h4>
              <p>Notre chat utilise une intelligence artificielle de pointe pour comprendre et répondre à vos questions avec précision.</p>
            </div>
            
            <div class="info-card">
              <div class="card-icon">⚡</div>
              <h4>Réponses Instantanées</h4>
              <p>Obtenez des réponses rapides et pertinentes en temps réel grâce à notre système d'IA optimisé.</p>
            </div>
            
            <div class="info-card">
              <div class="card-icon">🎯</div>
              <h4>Compréhension Contextuelle</h4>
              <p>L'IA analyse le contexte de votre conversation pour fournir des réponses toujours adaptées.</p>
            </div>
            
            <div class="info-card">
              <div class="card-icon">🔒</div>
              <h4>Sécurisé & Privé</h4>
              <p>Vos conversations sont protégées et votre confidentialité est garantie.</p>
            </div>
          </div>
          
          <div class="tech-stack">
            <h4>Technologies utilisées :</h4>
            <div class="tech-tags">
              <span class="tech-tag">Powered by OpenAI GPT</span>
              <span class="tech-tag">Natural Language Processing</span>
              <span class="tech-tag">Real-time Processing</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Section chat Messenger (droite) -->
      <div class="chat-messenger">
        <div class="chat-header">
          <div class="chat-avatar">
            <div class="avatar-icon">🤖</div>
          </div>
          <div class="chat-user-info">
            <h4>Assistant IA</h4>
            <span class="status">En ligne</span>
          </div>
          <div class="chat-actions">
            <button class="action-btn">⋯</button>
          </div>
        </div>
        
        <div class="chat-messages" bind:this={messagesContainer} on:scroll={handleScroll}>
            {#if !chat.hasMessages || messages.length <= 1}
            <div class="message-suggestions">
              <p class="suggestions-title">Suggestions de questions :</p>
              <div class="suggestion-buttons">
                {#each suggestions.slice(0, 3) as suggestion}
                  <button class="suggestion-btn" on:click={() => handleSuggestionClick(suggestion)}>
                    {suggestion}
                  </button>
                {/each}
              </div>
            </div>
          {/if}
       
            {#each messages as message (message.id)}
            <div class="message {message.type}-message" class:loading={message.isLoading} class:error={message.error}>
              {#if message.type === 'ai'}
                <div class="message-avatar">{message.avatar}</div>
              {/if}
              <div class="message-content">
                <div class="message-bubble">
                  {#if message.isLoading}
                    <div class="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  {:else if message.error}
                    <p class="error-message">{@html formatMessageContent(message.content)}</p>
                  {:else}
                    <p>{@html formatMessageContent(message.content)}</p>
                  {/if}
                </div>
                <span class="message-time">{chat.formatMessageTime(message.timestamp)}</span>
              </div>
            </div>
          {/each}
          
          <!-- Suggestions de messages -->

        </div>
        
        <div class="chat-input">
          <div class="input-container">
            <button class="attach-btn" title="Joindre un fichier">📎</button>
            <input 
              type="text" 
              placeholder="Tapez votre message..." 
              class="message-input"
              bind:value={currentMessage}
              on:keypress={handleKeyPress}
              bind:this={messageInput}
              disabled={chat.isLoading}
            />
            <button 
              class="send-btn" 
              on:click={handleSendMessage}
              disabled={chat.isLoading || !currentMessage.trim()}
              title="Envoyer le message"
            >
              {chat.isLoading ? '⏳' : '➤'}
            </button>
          </div>
          
          <!-- Indicateur de connexion -->
          <div class="connection-status">
            <span class="status-indicator" class:connected={chat.isConnected} class:disconnected={!chat.isConnected}>
              {chat.isConnected ? '🟢 Connecté' : '🔴 Déconnecté'}
            </span>
            {#if chat.hasMessages}
              <button class="clear-btn" on:click={clearChat} title="Effacer la conversation">
                🗑️ Effacer
              </button>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </section>
</div>

<style>
  h2 {
    font-family: "Orbitron", cursive;
    font-weight: 600;
    font-size: clamp(0.8rem, 3vw, 3rem);
    color: crimson;
    text-align: center;
    margin-bottom: 10px;
  }

  p {
    font-family: "Orbitron", cursive;
    font-weight: 500;
    font-size: clamp(0.7rem, 4vw, 2.5rem);
    color: rgb(250, 245, 245);
    text-align: center;
    margin-bottom: 30px;
  }

  .chat-container {
    display: flex;
    flex: 1;
    flex-direction: column;
    width: 95vw;
    min-width: 350px;
    padding: 2% 2% 15svh 2%;
    min-height: 90svh;
    height: auto;
  }

  #chat-mvp {
    width: 100%;
    min-height: 90svh;
    height: auto;
    display: flex;
    flex-direction: column;
  }

  /* Layout deux colonnes */
  .chat-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    min-height: 80svh;
    height: auto;
    flex: 1;
  }

  /* Section informations IA (gauche) */
  .chat-info-section {
    background: linear-gradient(135deg, rgba(220, 20, 60, 0.1), rgba(0, 0, 0, 0.3));
    border: 2px solid rgba(220, 20, 60, 0.3);
    border-radius: 15px;
    padding: 20px;
    overflow-y: auto;
    backdrop-filter: blur(10px);
    height: 70svh;
    max-height: 70svh;
  }

  .info-content {
    height: 70svh;
    min-height: 70svh;
    max-height: 70svh;
  }

  .info-title {
    font-family: "Orbitron", cursive;
    font-size: clamp(1rem, 2.5vw, 1.8rem);
    color: crimson;
    text-align: center;
    margin-bottom: 25px;
    text-shadow: 0 0 10px rgba(220, 20, 60, 0.5);
  }

  .info-cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 25px;
  }

  .info-card {
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(220, 20, 60, 0.2);
    border-radius: 10px;
    padding: 15px;
    text-align: center;
    transition: all 0.3s ease;
  }

  .info-card:hover {
    border-color: rgba(220, 20, 60, 0.6);
    box-shadow: 0 0 15px rgba(220, 20, 60, 0.3);
    transform: translateY(-2px);
  }

  .card-icon {
    font-size: 2rem;
    margin-bottom: 10px;
  }

  .info-card h4 {
    font-family: "Orbitron", cursive;
    color: crimson;
    font-size: clamp(0.8rem, 1.5vw, 1.1rem);
    margin-bottom: 8px;
  }

  .info-card p {
    font-family: "Orbitron", cursive;
    color: rgb(220, 220, 220);
    font-size: clamp(0.6rem, 1.2vw, 0.9rem);
    line-height: 1.4;
    text-align: center;
    margin-bottom: 0;
  }

  .tech-stack {
    margin-top: 20px;
  }

  .tech-stack h4 {
    font-family: "Orbitron", cursive;
    color: crimson;
    font-size: clamp(0.8rem, 1.5vw, 1.1rem);
    margin-bottom: 10px;
  }

  .tech-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .tech-tag {
    background: rgba(220, 20, 60, 0.2);
    color: rgb(250, 245, 245);
    padding: 5px 10px;
    border-radius: 15px;
    font-size: clamp(0.6rem, 1vw, 0.8rem);
    border: 1px solid rgba(220, 20, 60, 0.3);
  }

  /* Section chat Messenger (droite) */
  .chat-messenger {
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(220, 20, 60, 0.1));
    border: 2px solid rgba(220, 20, 60, 0.3);
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    height: 80svh;
    max-height: 80svh;
    backdrop-filter: blur(10px);
    overflow: hidden;
  }

  /* Header du chat */
  .chat-header {
    background: rgba(220, 20, 60, 0.2);
    border-bottom: 1px solid rgba(220, 20, 60, 0.3);
    padding: 15px 20px;
    display: flex;
    align-items: center;
    gap: 15px;
    border-radius: 15px 15px 0 0;
  }

  .chat-avatar {
    width: 40px;
    height: 40px;
    background: linear-gradient(45deg, crimson, #ff4444);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 10px rgba(220, 20, 60, 0.5);
  }

  .avatar-icon {
    font-size: 1.5rem;
  }

  .chat-user-info {
    flex: 1;
  }

  .chat-user-info h4 {
    font-family: "Orbitron", cursive;
    color: crimson;
    font-size: clamp(0.9rem, 1.5vw, 1.2rem);
    margin: 0;
  }

  .status {
    color: #4CAF50;
    font-size: clamp(0.7rem, 1vw, 0.8rem);
  }

  .action-btn {
    background: transparent;
    border: none;
    color: rgb(220, 220, 220);
    font-size: 1.2rem;
    cursor: pointer;
    padding: 5px;
    border-radius: 5px;
  }

  .action-btn:hover {
    background: rgba(220, 20, 60, 0.2);
    color: crimson;
  }

  /* Messages */
  .chat-messages {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 15px;
    max-height: calc(80svh - 140px); /* Hauteur totale moins header et input */
    min-height: 0; /* Important pour le flex */
  }

  .message {
    display: flex;
    align-items: flex-end;
    gap: 10px;
  }

  .user-message {
    justify-content: flex-end;
  }

  .message-avatar {
    width: 30px;
    height: 30px;
    background: linear-gradient(45deg, crimson, #ff4444);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
  }

  .message-content {
    display: flex;
    flex-direction: column;
    gap: 5px;
    max-width: 70%;
    min-width: 100px;
  }

  .message-bubble {
    padding: 12px 16px;
    border-radius: 18px;
    font-family: "Orbitron", cursive;
    font-size: clamp(0.7rem, 1.2vw, 0.9rem);
    line-height: 1.4;
    max-width: 100%;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  .ai-message .message-bubble {
    background: linear-gradient(135deg, rgba(220, 20, 60, 0.2), rgba(0, 0, 0, 0.3));
    border: 1px solid rgba(220, 20, 60, 0.3);
    color: rgb(250, 245, 245);
    border-radius: 18px 18px 18px 4px;
  }

  .user-message .message-bubble {
    background: linear-gradient(135deg, crimson, #ff4444);
    color: white;
    border-radius: 18px 18px 4px 18px;
    box-shadow: 0 2px 8px rgba(220, 20, 60, 0.3);
  }

  .message-time {
    font-size: clamp(0.6rem, 1vw, 0.7rem);
    color: rgba(220, 220, 220, 0.7);
    align-self: flex-end;
    margin-top: 5px;
  }

  .user-message .message-time {
    align-self: flex-end;
  }

  .ai-message .message-time {
    align-self: flex-start;
  }

  /* Input du chat */
  .chat-input {
    background: rgba(220, 20, 60, 0.1);
    border-top: 1px solid rgba(220, 20, 60, 0.3);
    padding: 15px 20px;
    border-radius: 0 0 15px 15px;
  }

  .input-container {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(220, 20, 60, 0.3);
    border-radius: 25px;
    padding: 8px 15px;
  }

  .attach-btn {
    background: transparent;
    border: none;
    color: rgb(220, 220, 220);
    font-size: 1.2rem;
    cursor: pointer;
    padding: 5px;
    border-radius: 5px;
    transition: all 0.3s ease;
  }

  .attach-btn:hover {
    color: crimson;
    background: rgba(220, 20, 60, 0.2);
  }

  .message-input {
    flex: 1;
    background: transparent;
    border: none;
    color: rgb(250, 245, 245);
    font-family: "Orbitron", cursive;
    font-size: clamp(0.8rem, 1.2vw, 1rem);
    outline: none;
    padding: 8px 0;
  }

  .message-input::placeholder {
    color: rgba(220, 220, 220, 0.6);
  }

  .send-btn {
    background: linear-gradient(45deg, crimson, #ff4444);
    border: none;
    color: white;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(220, 20, 60, 0.3);
  }

  .send-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 15px rgba(220, 20, 60, 0.5);
  }

  .send-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .message-input:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  /* Styles pour les nouveaux éléments */
  .loading-dots {
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .loading-dots span {
    width: 8px;
    height: 8px;
    background: crimson;
    border-radius: 50%;
    animation: loading-dots 1.4s infinite ease-in-out both;
  }

  .loading-dots span:nth-child(1) { animation-delay: -0.32s; }
  .loading-dots span:nth-child(2) { animation-delay: -0.16s; }

  @keyframes loading-dots {
    0%, 80%, 100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }

  .error-message {
    color: #ff6b6b !important;
    font-style: italic;
  }

  .message.loading .message-bubble {
    background: rgba(220, 20, 60, 0.1);
    border-color: rgba(220, 20, 60, 0.2);
  }

  .message.error .message-bubble {
    background: rgba(255, 107, 107, 0.1);
    border-color: rgba(255, 107, 107, 0.3);
  }

  /* Suggestions de messages */
  .message-suggestions {
    margin-top: 20px;
    padding: 15px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    border: 1px solid rgba(220, 20, 60, 0.2);
  }

  .suggestions-title {
    font-family: "Orbitron", cursive;
    color: crimson;
    font-size: clamp(0.7rem, 1.2vw, 0.9rem);
    margin-bottom: 10px;
    text-align: center;
  }

  .suggestion-buttons {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .suggestion-btn {
    background: rgba(220, 20, 60, 0.1);
    border: 1px solid rgba(220, 20, 60, 0.3);
    color: rgb(250, 245, 245);
    padding: 8px 12px;
    border-radius: 15px;
    font-family: "Orbitron", cursive;
    font-size: clamp(0.6rem, 1vw, 0.8rem);
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: left;
  }

  .suggestion-btn:hover {
    background: rgba(220, 20, 60, 0.2);
    border-color: rgba(220, 20, 60, 0.5);
    transform: translateX(5px);
  }

  /* Indicateur de connexion */
  .connection-status {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    padding: 8px 0;
  }

  .status-indicator {
    font-family: "Orbitron", cursive;
    font-size: clamp(0.6rem, 1vw, 0.7rem);
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .status-indicator.connected {
    color: #4CAF50;
  }

  .status-indicator.disconnected {
    color: #ff6b6b;
  }

  .clear-btn {
    background: rgba(255, 107, 107, 0.1);
    border: 1px solid rgba(255, 107, 107, 0.3);
    color: #ff6b6b;
    padding: 4px 8px;
    border-radius: 10px;
    font-family: "Orbitron", cursive;
    font-size: clamp(0.6rem, 1vw, 0.7rem);
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .clear-btn:hover {
    background: rgba(255, 107, 107, 0.2);
    border-color: rgba(255, 107, 107, 0.5);
  }

  /* Media Queries Responsive */
  
  /* Small Mobile */
  @media (max-width: 480px) {
    .chat-container {
      width: 100vw;
      min-width: 300px;
      padding: 1% 1% 12svh 1%;
      height: auto;
    }

    h2, .chat_title {
      font-size: clamp(1.8rem, 4vw, 1.2rem);
    }
    .chat_description {
      font-size: clamp(0.8rem, 4vw, 1rem);
    }

    .chat-layout {
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr;
      gap: 10px;
      min-height: 80svh;
      height: auto;
    }

    .chat-info-section {
      padding: 3px;
      min-height: 30svh;
      height: 80svh;
      max-height: 90svh;
      overflow-y: auto;
      border-radius: 10px;
    }

    .info-title {
      font-size: clamp(0.9rem, 4vw, 1.2rem);
      margin-bottom: 15px;
    }

    .info-cards {
      grid-template-columns: 1fr;
      gap: 8px;
      margin-bottom: 15px;
    }

    .info-card {
      padding: 8px;
      border-radius: 8px;
    }

    .card-icon {
      font-size: 1.5rem;
      margin-bottom: 5px;
    }

    .info-card h4 {
      font-size: clamp(0.7rem, 3vw, 0.9rem);
      margin-bottom: 5px;
    }

    .info-card p {
      font-size: clamp(0.6rem, 2.5vw, 0.8rem);
      line-height: 1.3;
    }

    .tech-stack {
      margin-top: 10px;
    }

    .tech-stack h4 {
      font-size: clamp(0.7rem, 3vw, 0.9rem);
      margin-bottom: 8px;
    }

    .tech-tags {
      gap: 6px;
    }

    .tech-tag {
      padding: 3px 8px;
      font-size: clamp(0.5rem, 2vw, 0.7rem);
      border-radius: 12px;
    }

    .chat-messenger {
      height: 50svh;
      max-height: 50svh;
      border-radius: 10px;
      overflow: hidden;
    }

    .chat-header {
      padding: 8px 12px;
      border-radius: 10px 10px 0 0;
    }

    .chat-avatar {
      width: 30px;
      height: 30px;
    }

    .avatar-icon {
      font-size: 1.2rem;
    }

    .chat-user-info h4 {
      font-size: clamp(0.8rem, 3vw, 1rem);
    }

    .status {
      font-size: clamp(0.6rem, 2vw, 0.7rem);
    }

    .chat-messages {
      padding: 12px;
      max-height: calc(50svh - 100px);
      min-height: 0;
    }

    .message-bubble {
      padding: 8px 12px;
      font-size: clamp(0.7rem, 2.5vw, 0.8rem);
    }

    .message-avatar {
      width: 25px;
      height: 25px;
      font-size: 0.9rem;
    }

    .chat-input {
      padding: 8px 12px;
      border-radius: 0 0 10px 10px;
    }

    .input-container {
      padding: 5px 10px;
      border-radius: 20px;
    }

    .message-input {
      font-size: clamp(0.7rem, 2.5vw, 0.8rem);
    }

    .send-btn {
      width: 30px;
      height: 30px;
      font-size: 1rem;
    }

    .suggestion-buttons {
      gap: 6px;
    }

    .suggestion-btn {
      padding: 6px 10px;
      font-size: clamp(0.5rem, 2vw, 0.7rem);
    }

    .connection-status {
      margin-top: 8px;
      padding: 6px 0;
    }

    .status-indicator {
      font-size: clamp(0.5rem, 1.5vw, 0.6rem);
    }

    .clear-btn {
      padding: 3px 6px;
      font-size: clamp(0.5rem, 1.5vw, 0.6rem);
    }
  }

  /* Medium Mobile */
  @media (min-width: 481px) and (max-width: 768px) {
    .chat-container {
      width: 100vw;
      min-width: 320px;
      padding: 2% 2% 12svh 2%;
      min-height: 90svh;
      height: auto;
    }

    .chat-layout {
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr;
      gap: 15px;
      min-height: 80svh;
      height: auto;
    }

    .chat-info-section {
      padding: 15px;
      min-height: 35svh;
      max-height: 45svh;
      overflow-y: auto;
    }

    .info-title {
      font-size: clamp(1rem, 3vw, 1.4rem);
      margin-bottom: 20px;
    }

    .info-cards {
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 20px;
    }

    .info-card {
      padding: 12px;
    }

    .card-icon {
      font-size: 1.8rem;
      margin-bottom: 8px;
    }

    .info-card h4 {
      font-size: clamp(0.8rem, 2.5vw, 1rem);
      margin-bottom: 6px;
    }

    .info-card p {
      font-size: clamp(0.7rem, 2vw, 0.85rem);
      line-height: 1.3;
    }

    .tech-stack h4 {
      font-size: clamp(0.8rem, 2.5vw, 1rem);
      margin-bottom: 10px;
    }

    .tech-tag {
      padding: 4px 8px;
      font-size: clamp(0.6rem, 2vw, 0.75rem);
    }

    .chat-header {
      padding: 12px 15px;
    }

    .chat-messages {
      padding: 15px;
    }

    .chat-input {
      padding: 12px 15px;
    }
  }

  /* Tablet */
  @media (min-width: 769px) and (max-width: 1024px) {
    .chat-container {
      width: 95vw;
      min-width: 400px;
      padding: 2% 2% 12svh 2%;
      min-height: 90svh;
      height: auto;
    }

    .chat-layout {
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      min-height: 80svh;
      height: auto;
    }

    .chat-info-section {
      padding: 18px;
      min-height: 80svh;
      overflow-y: auto;
    }

    .info-title {
      font-size: clamp(1.1rem, 2.5vw, 1.6rem);
      margin-bottom: 25px;
    }

    .info-cards {
      grid-template-columns: 1fr;
      gap: 12px;
      margin-bottom: 25px;
    }

    .info-card {
      padding: 15px;
    }

    .card-icon {
      font-size: 2rem;
      margin-bottom: 10px;
    }

    .info-card h4 {
      font-size: clamp(0.9rem, 2vw, 1.1rem);
      margin-bottom: 8px;
    }

    .info-card p {
      font-size: clamp(0.8rem, 1.8vw, 0.9rem);
      line-height: 1.4;
    }

    .tech-stack h4 {
      font-size: clamp(0.9rem, 2vw, 1.1rem);
      margin-bottom: 12px;
    }

    .tech-tag {
      padding: 5px 10px;
      font-size: clamp(0.7rem, 1.5vw, 0.8rem);
    }

    .chat-header {
      padding: 12px 18px;
    }

    .chat-messages {
      padding: 18px;
    }

    .chat-input {
      padding: 15px 18px;
    }
  }

  /* Desktop */
  @media (min-width: 1025px) and (max-width: 1440px) {
    .chat-container {
      width: 90vw;
      min-width: 450px;
      padding: 2% 2% 12svh 2%;
      min-height: 90svh;
      height: auto;
    }

    .chat-layout {
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      min-height: 80svh;
      height: auto;
    }

    .chat-info-section {
      padding: 20px;
      min-height: 80svh;
      overflow-y: auto;
    }

    .info-title {
      font-size: clamp(1.2rem, 2vw, 1.8rem);
      margin-bottom: 25px;
    }

    .info-cards {
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 25px;
    }

    .info-card {
      padding: 15px;
    }

    .card-icon {
      font-size: 2rem;
      margin-bottom: 10px;
    }

    .info-card h4 {
      font-size: clamp(0.9rem, 1.8vw, 1.1rem);
      margin-bottom: 8px;
    }

    .info-card p {
      font-size: clamp(0.8rem, 1.5vw, 0.9rem);
      line-height: 1.4;
    }

    .tech-stack h4 {
      font-size: clamp(0.9rem, 1.8vw, 1.1rem);
      margin-bottom: 12px;
    }

    .tech-tag {
      padding: 5px 10px;
      font-size: clamp(0.7rem, 1.3vw, 0.8rem);
    }
  }

  /* Large Desktop */
  @media (min-width: 1441px) and (max-width: 1920px) {
    .chat-container {
      width: 99%;
      min-width: 500px;
      padding: 2% 2% 8svh 2%;
      /* height: auto; */
    }
    .chat_mvp {
      width: 100%;
      min-height: 100%;
      height: auto;
    }
    h2, .chat_title {
      font-size: clamp(1.2rem, 9vw, 12rem);
      margin-bottom: 5%;
      margin-top: 10%;
      top: 5%;
    }
    .info-title {
    }
    .chat_description{
      font-size: clamp(0.8rem, 1.5vw, 0.9rem);
    }
    .chat_title {
      font-size: clamp(1.2rem, 5vw, 12rem);
      margin-bottom: 25px;
    }
    .chat_description {
      font-size: clamp(0.8rem, 1.5vw, 0.9rem);
    }

    .chat-layout {
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      min-height: 85svh;
      height: auto;
    }

    .chat-info-section {
      padding: 20px;
      min-height: 77svh;
      max-height: 80svh;
      overflow-y: hidden;
    }

    .info-cards {
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }

    .chat-messenger {
      height: 75svh;
      max-height: 85svh;
      overflow: hidden;
    }
    .info-title {
      font-size: clamp(1.2rem, 2vw, 0.8rem);
      margin-bottom: 25px;
    }
  }
  .chat_description {
    font-size: clamp(0.8rem, 1.5vw, 0.9rem);
  }
  .message-bubble p {
    font-size: clamp(0.8rem, 1.5vw, 0.9rem);
  }

  /* XL Desktop */
  @media (min-width: 1921px) {
    .chat-container {
      width: 80vw;
      min-width: 550px;
      padding: 2% 2% 8svh 2%;
      min-height: 100svh;
      height: auto;
    }

    .chat-layout {
      grid-template-columns: 1fr 1fr;
      gap: 25px;
      min-height: 85svh;
      height: auto;
    }

    .chat-info-section {
      padding: 25px;
      min-height: 85svh;
      overflow-y: auto;
    }

    .info-cards {
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .chat-messenger {
      height: 85svh;
      max-height: 85svh;
      overflow: hidden;
    }

    /* Fixer la taille des messages sur les très grands écrans */
    .message-content {
      max-width: 60%;
      min-width: 150px;
    }

    .message-bubble {
      max-height: 200px;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
</style>
