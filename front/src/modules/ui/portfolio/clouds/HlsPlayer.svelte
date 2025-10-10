<script>
  import { onMount, onDestroy } from 'svelte';
  
  export let src = '';
  export let autoplay = false;
  export let muted = true;
  export let controls = true;
  
  let videoElement;
  let hls;
  let isLoading = true;
  let error = null;
  
  onMount(async () => {
    // Charger HLS.js dynamiquement
    const Hls = await import('hls.js').then(module => module.default);
    
    if (!src) {
      error = "Aucune source vidéo fournie";
      isLoading = false;
      return;
    }
    
    // Vérifier si HLS.js est supporté
    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      
      hls.loadSource(src);
      hls.attachMedia(videoElement);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('HLS: Manifest chargé avec succès');
        isLoading = false;
        if (autoplay) {
          videoElement.play().catch(e => {
            console.warn('Autoplay bloqué:', e);
          });
        }
      });
      
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('Erreur HLS:', data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              error = "Erreur réseau - Tentative de récupération...";
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              error = "Erreur média - Tentative de récupération...";
              hls.recoverMediaError();
              break;
            default:
              error = "Erreur fatale - Impossible de charger le stream";
              hls.destroy();
              break;
          }
          isLoading = false;
        }
      });
      
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      // Support natif pour Safari
      videoElement.src = src;
      videoElement.addEventListener('loadedmetadata', () => {
        console.log('HLS: Support natif détecté (Safari)');
        isLoading = false;
        if (autoplay) {
          videoElement.play().catch(e => {
            console.warn('Autoplay bloqué:', e);
          });
        }
      });
    } else {
      error = "HLS non supporté par ce navigateur";
      isLoading = false;
    }
  });
  
  onDestroy(() => {
    if (hls) {
      hls.destroy();
    }
  });
</script>

<div class="hls-player-container">
  {#if isLoading}
    <div class="loading-overlay">
      <div class="spinner"></div>
      <p>Chargement du stream...</p>
    </div>
  {/if}
  
  {#if error}
    <div class="error-overlay">
      <span class="error-icon">⚠️</span>
      <p>{error}</p>
    </div>
  {/if}
  
  <video
    bind:this={videoElement}
    {controls}
    {muted}
    playsinline
    class="hls-video"
    class:hidden={isLoading || error}
  >
    Votre navigateur ne supporte pas la lecture vidéo.
  </video>
</div>

<style>
  .hls-player-container {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    border-radius: 5px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .hls-video {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 5px;
  }
  
  .hls-video.hidden {
    display: none;
  }
  
  .loading-overlay,
  .error-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.9);
    color: white;
    font-family: "Orbitron", sans-serif;
    z-index: 10;
  }
  
  .loading-overlay p,
  .error-overlay p {
    color: #4caf50;
    font-size: clamp(0.7rem, 2vw, 1rem);
    margin-top: 15px;
    text-align: center;
    padding: 0 10px;
  }
  
  .error-overlay p {
    color: crimson;
  }
  
  .error-icon {
    font-size: 3rem;
  }
  
  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(76, 175, 80, 0.3);
    border-top: 4px solid #4caf50;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* Styles des contrôles vidéo personnalisés */
  .hls-video::-webkit-media-controls-panel {
    background-color: rgba(0, 0, 0, 0.8);
  }
  
  .hls-video::-webkit-media-controls-play-button {
    background-color: #4caf50;
    border-radius: 50%;
  }
</style>

