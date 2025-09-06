<script>
    import { onMount } from "svelte";

    let visibleLetters = [];
    const text = "Codeurbase.fr".split("");

    onMount(() => {
        text.forEach((letter, index) => {
            setTimeout(() => {
                visibleLetters = [...visibleLetters, letter];
            }, index * 100); // Delay each letter by 100ms
        });
    });
</script>

<div class="codeurbase-container">
    {#each visibleLetters as letter, i}
        <span class="codeurbase-text" style="animation-delay: {i * 0.2}s;">{letter}</span>
    {/each}
</div>

<style>
    .codeurbase-container {
        position: sticky;
        top: 0;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        overflow: hidden;
        perspective: 1000px;
    }

    .codeurbase-text {
        font-family: 'Orbitron', sans-serif;
        font-size: clamp(2.5rem, 9vw, 6.2rem);
        font-weight: bold;
        color: transparent;
        animation: starWarsEffect 3s forwards;
    }

    @keyframes starWarsEffect {
        0% {
            transform: translateZ(-1000px) translateY(-100vh) scale(0.5);
            opacity: 0;
        }
        70% {
            transform: translateZ(0) translateY(0) scale(1);
            opacity: 1;
        }
        100% {
            color: crimson;
            opacity: 1;
            letter-spacing: 5px;
        }
    }
    
</style>
