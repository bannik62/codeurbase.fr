<script>
    import { onMount, onDestroy } from "svelte";
    
    export let canvas;
    export let ctx;
    
    // Variables pour les étoiles
    const stars = [];
    const numStars = 400;
    const baseSpeed = 2;
    let currentSpeed = baseSpeed;
    let curve = 0;
    let animationId;

    function initStars() {
        stars.length = 0;
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: (Math.random() - 0.5) * window.innerWidth,
                y: (Math.random() - 0.5) * window.innerHeight,
                z: Math.random() * window.innerWidth,
            });
        }
    }

    function drawStars() {
        if (!ctx) return;
        
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let star of stars) {
            star.z -= currentSpeed;
            if (star.z <= 0) {
                star.z = window.innerWidth;
                star.x = (Math.random() - 0.5) * window.innerWidth;
                star.y = (Math.random() - 0.5) * window.innerHeight;
            }

            let sx =
                (star.x / star.z) * canvas.width +
                canvas.width / 2 +
                curve * 100;
            let sy = (star.y / star.z) * canvas.height + canvas.height / 2;

            if (sx < 0 || sx >= canvas.width || sy < 0 || sy >= canvas.height)
                continue;

            let size = Math.max(0, 2 - star.z / 400);
            let shade = 255 - Math.min(255, star.z / 2);
            ctx.fillStyle = `rgb(${shade},${shade},255)`;
            ctx.shadowColor = "white";
            ctx.shadowBlur = 6;

            ctx.beginPath();
            ctx.arc(sx, sy, size, 0, Math.PI * 2);
            ctx.fill();
        }
        animationId = requestAnimationFrame(drawStars);
    }

    // Fonction simplifiée pour les étoiles
    function updateStars() {
        const scrollPos = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        currentSpeed = baseSpeed * (1 - (scrollPos / maxScroll) * 0.1);
        curve = scrollPos / maxScroll - 1;
    }

    function handleResize() {
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars();
        }
    }

    onMount(() => {
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            ctx = canvas.getContext("2d");
            
            initStars();
            drawStars();
            
            // Gestion du resize
            window.addEventListener("resize", handleResize);
            
            // Scroll pour les étoiles
            window.addEventListener("scroll", updateStars);
        }
    });

    onDestroy(() => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", updateStars);
    });
</script>
