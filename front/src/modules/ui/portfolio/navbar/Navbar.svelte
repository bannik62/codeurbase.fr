<script>
    import { onMount, onDestroy } from 'svelte';
    // import ServicesOK from '../../../services/ServicesOK.svelte';
    import { currentPage } from '../../../../stores/router';

    let activePage;
    let isScrolling = false;
    let scrollTimeout;
    
    // Souscrire aux changements du store
    const unsubscribe = currentPage.subscribe(value => {
        activePage = value;
    });

    function handleNavClick(page) {
        currentPage.set(page);
    }

    function handleScroll() {
        // Activer l'effet pendant le scroll
        isScrolling = true;
        
        // Annuler le timeout précédent
        clearTimeout(scrollTimeout);
        
        // Définir un nouveau timeout pour désactiver l'effet
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, 150); // 150ms après l'arrêt du scroll
    }

    onMount(() => {
        window.addEventListener('scroll', handleScroll);
    });

    onDestroy(() => {
        window.removeEventListener('scroll', handleScroll);
        clearTimeout(scrollTimeout);
        unsubscribe();
    });
</script>

<nav class:scrolled={isScrolling}>
    <div class="nav-buttons">
        <button 
            class:active={activePage === 'acceuil'} 
            on:click={() => handleNavClick('acceuil')}
        >
            Home
        </button>
        <button 
            class:active={activePage === 'about'} 
            on:click={() => handleNavClick('about')}
        >
            Blog
        </button>
        <button 
            class:active={activePage === 'contact'} 
            on:click={() => handleNavClick('contact')}
        >
            ChatWithMe
        </button>
        <button 
            class:active={activePage === 'acceuilPortfolioBis'} 
            on:click={() => handleNavClick('acceuilPortfolioBis')}
        >
            Portfolio
        </button>
    </div>
</nav>

<style>
    nav {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 10svh;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-around;
        align-items: center;
        padding: 10px;
        background-color: #333;
        z-index: 9999;
        border-color: #ff1f1f;
        border-style: solid;
        border-width: 0 0 1px 0;
        transition: filter 0.3s ease;
      }

    nav.scrolled {
        filter: drop-shadow(0 0 20px #ff1f1f);
      }

    .nav-buttons {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        width: 100%;
    }

    button {
        padding: 8px 16px;
        background: transparent;
        color: white;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        font-family: "Orbitron", cursive;
    }

    button:hover {
        text-shadow: 0 0 5px #ff1f1f,
                    0 0 10px #ff1f1f;
    }

    button.active {
        color: #ff1f1f;
        text-shadow: 0 0 5px #ff1f1f,
                    0 0 10px #ff1f1f,
                    0 0 20px #ff1f1f;
    }

    button.active::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: #ff1f1f;
        box-shadow: 0 0 5px #ff1f1f,
                   0 0 10px #ff1f1f;
    }

    @media (max-width: 415px) {
        nav {
            position: absolute;
            top: auto;
            bottom: 0;
            opacity: 1 !important;
            z-index: 9999;
        }
    }
</style>