<script>
  import { onMount } from 'svelte';
  import Acceuil from './pages/Acceuil.svelte';
  import About from './pages/About.svelte';
  import { currentPage } from './stores/router';
  import Contact from './pages/Contact.svelte';


</script>


{#if $currentPage === 'acceuil'}
  <Acceuil />
{:else if $currentPage === 'about'}
  <About />
{:else if $currentPage === 'contact'}
  <Contact />
{:else}
  <div>Page inconnue</div>
{/if}



<style>
 
</style>
