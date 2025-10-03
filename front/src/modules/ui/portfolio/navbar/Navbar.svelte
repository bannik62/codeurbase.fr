<script>
    import { onDestroy } from 'svelte';
    // import ServicesOK from '../../../services/ServicesOK.svelte';
    import { currentPage } from '../../../../stores/router';

    let activePage;
    
    // Souscrire aux changements du store
    const unsubscribe = currentPage.subscribe(value => {
        console.log('Navbar: page changed to:', value);
        activePage = value;
    });

    function handleNavClick(page) {
        console.log('Navbar: clicking to navigate to:', page);
        currentPage.set(page);
    }

    onDestroy(() => {
        unsubscribe();
    });
</script>

<nav>
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
            About
        </button>
        <button 
            class:active={activePage === 'contact'} 
            on:click={() => handleNavClick('contact')}
        >
            Contact
        </button>
        <button 
            class:active={activePage === 'acceuilPortfolioBis'} 
            on:click={() => handleNavClick('acceuilPortfolioBis')}
        >
            Portfolio
        </button>
        <!-- <ServicesOK /> -->
    </div>
</nav>

<style>
    nav {
        /* position: relative; */
        top: 0;
        left: 0;
        width: clamp(350px, 100%, 99%);
        height: 10svh;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
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

    button {
        padding: 8px 16px;
        background: transparent;
        color: white;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
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
        }
    }
</style>