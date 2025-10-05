<script>
  import { onMount, onDestroy } from "svelte";
  import { gsap } from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import { initMediaQuery, useMediaQuery } from "../../../stores/mediaQuery.js";
  import { initChatAnimations, cleanupChatAnimations } from "./chatAnimation.js";

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
    animations = initChatAnimations(currentSize);
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
              <span class="tech-tag">OpenAI GPT</span>
              <span class="tech-tag">Natural Language Processing</span>
              <span class="tech-tag">Machine Learning</span>
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
        
        <div class="chat-messages">
          <div class="message ai-message">
            <div class="message-avatar">🤖</div>
            <div class="message-content">
              <div class="message-bubble">
                <p>Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider aujourd'hui ?</p>
              </div>
              <span class="message-time">14:32</span>
            </div>
          </div>
          
          <div class="message user-message">
            <div class="message-content">
              <div class="message-bubble">
                <p>Salut ! Peux-tu m'expliquer ce qu'est l'intelligence artificielle ?</p>
              </div>
              <span class="message-time">14:35</span>
            </div>
          </div>
          
          <div class="message ai-message">
            <div class="message-avatar">🤖</div>
            <div class="message-content">
              <div class="message-bubble">
                <p>L'intelligence artificielle (IA) est un domaine de l'informatique qui vise à créer des systèmes capables d'effectuer des tâches qui nécessitent normalement l'intelligence humaine. Cela inclut l'apprentissage, le raisonnement, la perception et la compréhension du langage naturel.</p>
              </div>
              <span class="message-time">14:35</span>
            </div>
          </div>
        </div>
        
        <div class="chat-input">
          <div class="input-container">
            <button class="attach-btn">📎</button>
            <input type="text" placeholder="Tapez votre message..." class="message-input" />
            <button class="send-btn">➤</button>
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
    min-height: 80svh;
    height: 100%;
  }

  .info-content {
    height: 100%;
    min-height: 80svh;
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
    min-height: 80svh;
    height: 100%;
    backdrop-filter: blur(10px);
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
  }

  .message-bubble {
    padding: 12px 16px;
    border-radius: 18px;
    font-family: "Orbitron", cursive;
    font-size: clamp(0.7rem, 1.2vw, 0.9rem);
    line-height: 1.4;
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

  /* Media Queries Responsive */
  
  /* Small Mobile */
  @media (max-width: 480px) {
    .chat-container {
      width: 103vw;
      min-width: 300px;
      padding: 1% 1% 12svh 1%;
      min-height: 190svh;
      height: auto;
    }

    .chat-layout {
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr;
      gap: 10px;
      min-height: 80svh;
      height: auto;
    }

    .chat-info-section {
      padding: 10px;
      min-height: 30svh;
      max-height: 80svh;
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
      min-height: 50svh;
      height: 100%;
      border-radius: 10px;
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
      width: 85vw;
      min-width: 500px;
      padding: 2% 2% 8svh 2%;
      min-height: 100svh;
      height: auto;
    }

    .chat-layout {
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      min-height: 85svh;
      height: auto;
    }

    .chat-info-section {
      padding: 20px;
      min-height: 85svh;
      overflow-y: auto;
    }

    .info-cards {
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }

    .chat-messenger {
      min-height: 85svh;
      height: 100%;
    }
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
      min-height: 85svh;
      height: 100%;
    }
  }
</style>
