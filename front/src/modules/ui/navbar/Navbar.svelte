<script>
    import { onMount } from 'svelte';
    import ServicesOK from '../../services/ServicesOK.svelte';
    import { currentPage } from '../../../stores/router';
    onMount(() => {
       
    });
</script>




<nav>
      
      <div class="nav-buttons">
        <button on:click={() => currentPage.set('acceuil')}>Home</button>
        <button on:click={() => currentPage.set('about')}>About</button>
        <button on:click={() => currentPage.set('contact')}>Contact</button>
      </div>

    </nav>
 

<style>

nav {
    left: 0;
    width: 99vw;
    height: 100px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding: 10px;
    background-color: #333;
    z-index: 1002;
  }
  .nav-buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    width: 100%;
  }

  @media (max-width: 415px) {
  nav {
    position: fixed;
    top: auto;   /* annule la position top */
    bottom: 0;   /* fixe en bas */
  }
}


</style>