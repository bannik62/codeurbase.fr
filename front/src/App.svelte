<script>
  import { onMount } from 'svelte';
  import Acceuil from './pages/Acceuil.svelte';
  import About from './pages/About.svelte';
  import { currentPage } from './stores/router';
  import Contact from './pages/Contact.svelte';
  

</script>

<div class="app_wrapper">
{#if $currentPage === 'acceuil'}
  <Acceuil />
{:else if $currentPage === 'about'}
  <About />
{:else if $currentPage === 'contact'}
  <Contact />
{:else}
  <div>Page inconnue</div>
{/if}
</div>



<style>
  .app_wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }
</style>
