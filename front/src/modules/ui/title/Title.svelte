<script>
    import { onMount } from "svelte";

    let visibleLetters = [];
    const text = "codeurbase.fr".split("");

    onMount(() => {
        text.forEach((letter, index) => {
            setTimeout(() => {
                visibleLetters = [...visibleLetters, letter];
            }, index * 200); // Delay each letter by 200ms
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
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }

    .codeurbase-text {
        font-family: 'Orbitron', sans-serif;
        font-size: clamp(2.5rem, 9vw, 6.2rem);
        font-weight: bold;
        color: crimson;
        opacity: 0;
        width: 100%;
        animation: fadeIn 1s forwards;
    }

    @keyframes fadeIn {
        to {
            opacity: 1;
        }
    }
</style>
