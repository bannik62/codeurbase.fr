<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { currentPage } from '../stores/router';
  import Navbar from '../modules/ui/portfolio/navbar/Navbar.svelte';

  // Store pour gérer l'état de la page d'accueil
  const welcomeMessage = writable('Bienvenue sur notre site !');

  onMount(() => {
    // Logique d'initialisation si nécessaire
  });
</script>

<style>
  .home-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f0f0f0;
    text-align: center;
  }

  h1 {
    font-size: clamp(2rem, 5vw, 3rem);
    color: #333;
  }

  p {
    font-size: clamp(1rem, 3vw, 1.5rem);
    color: #666;
  }
</style>

<section class="home-container">
  <Navbar />
  <h1>{$welcomeMessage}</h1>
  <p>Découvrez nos services et produits innovants.</p>
</section>
