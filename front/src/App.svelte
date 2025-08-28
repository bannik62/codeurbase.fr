<script>
  import { onMount } from 'svelte';
  
  let container;
  let isVisible = false;
  
  onMount(() => {
    // Animation d'apparition
    setTimeout(() => {
      isVisible = true;
    }, 100);
  });
</script>

<svelte:head>
  <title>CodeurBase - Coming Soon</title>
</svelte:head>
<section>
<div class="container" bind:this={container}>
  <div class="content {isVisible ? 'visible' : ''}">
    <div class="text-container">
      <h1 class="title">CodeurBase.fr</h1>
      <div class="separator"></div>
      <h2 class="subtitle">Coming Soon</h2>
    </div>
    
    <div class="floating-elements">
      <div class="element" style="--delay: 0s">🚀</div>
      <div class="element" style="--delay: 0.5s">💻</div>
      <div class="element" style="--delay: 1s">⚡</div>
      <div class="element" style="--delay: 1.5s">🎯</div>
      <div class="element" style="--delay: 2s">🔥</div>
    </div>
  </div>
</div>
</section>
<section>
  <div class="container">
    <div class="content">
      <h1>CodeurBase</h1>
    </div>
  </div>
</section>
<style>
  .container {
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
  }

  .content {
    text-align: center;
    opacity: 0;
    transform: translateY(70px);
    transition: all 1s ease-out;
  }

  .content.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .text-container {
    margin-bottom: 2rem;
  }

  .title {
    font-size: 4.5rem;
    font-weight: 800;
    color: rgb(207, 18, 18);
    margin: 0;
    text-shadow: 20px -10px 20px rgba(0, 0, 0, 0.674);
    animation: slideInLeft 1.5s ease-out 0.3s both;
    transform: translateX(-100vw);
    text-decoration: underline;
    text-decoration-color: #d9e0e4;
    text-decoration-thickness: 3px;
    text-underline-offset: 30px;
    text-decoration-skip-ink: auto;
  }

  .subtitle {
    font-size: 2.5rem;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    animation: slideInRight 1.5s ease-out 0.6s both;
    transform: translateX(100vw);
  }

  .separator {
    width: 0;
    height: 4px;
    background: linear-gradient(90deg, transparent, #fff, transparent);
    margin: 2rem auto;
    border-radius: 2px;
    animation: expandWidth 1s ease-out 1.2s both;
  }

  .floating-elements {
    position: absolute;
    top: 80%;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .element {
    position: absolute;
    font-size: 2rem;
    opacity: 0.6;
    animation: float 6s ease-in-out infinite;
    animation-delay: var(--delay);
  }

  .element:nth-child(1) { top: 20%; left: 10%; }
  .element:nth-child(2) { top: 30%; right: 15%; }
  .element:nth-child(3) { top: 60%; left: 20%; }
  .element:nth-child(4) { top: 70%; right: 25%; }
  .element:nth-child(5) { top: 40%; left: 50%; }

  @keyframes slideInLeft {
    to {
      transform: translateX(0);
    }
  }

  @keyframes slideInRight {
    to {
      transform: translateX(0);
    }
  }

  @keyframes expandWidth {
    to {
      width: 200px;
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
      opacity: 0.6;
    }
    25% {
      transform: translateY(-20px) rotate(5deg);
      opacity: 0.8;
    }
    50% {
      transform: translateY(-10px) rotate(-5deg);
      opacity: 0.7;
    }
    75% {
      transform: translateY(-15px) rotate(3deg);
      opacity: 0.9;
    }
  }

  /* Responsive */
  @media (max-width: 768px) {
    .title {
      font-size: 3rem;
    }
    
    .subtitle {
      font-size: 1.8rem;
    }
    
    .separator {
      width: 150px;
    }
  }

  @media (max-width: 480px) {
    .title {
      font-size: 2.5rem;
    }
    
    .subtitle {
      font-size: 1.5rem;
    }
    
    .separator {
      width: 120px;
    }
  }
</style>
