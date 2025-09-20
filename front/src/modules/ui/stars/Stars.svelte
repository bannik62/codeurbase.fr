<script>
    import { onMount, onDestroy } from "svelte";
    
    export let canvas;
    export let ctx;
    
    // Variables pour les étoiles
    const stars = [];
    const numStars = 200;
    const baseSpeed = 2;
    let currentSpeed = baseSpeed;
    let curve = 0;
    let animationId;
    
    // Variables pré-calculées pour optimiser les performances
    let canvasWidth, canvasHeight;
    let halfWidth, halfHeight;

    function initStars() {
        stars.length = 0;
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: (Math.random() - 0.5) * canvasWidth,
                y: (Math.random() - 0.5) * canvasHeight,
                z: Math.random() * canvasWidth,
            });
        }
    }

    function drawStars() {
        if (!ctx) {
            console.log("🌟 Stars - Pas de contexte canvas, arrêt de l'animation");
            return;
        }
        
        // Effacer le canvas une seule fois
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Variables pré-calculées pour éviter les recalculs
        const curveOffset = curve * 100;
        const speed = currentSpeed;

        for (let i = 0; i < stars.length; i++) {
            const star = stars[i];
            star.z -= speed;
            
            if (star.z <= 0) {
                star.z = canvasWidth;
                star.x = (Math.random() - 0.5) * canvasWidth;
                star.y = (Math.random() - 0.5) * canvasHeight;
            }

            // Calculs optimisés
            const invZ = 1 / star.z;
            const sx = star.x * invZ * canvasWidth + halfWidth + curveOffset;
            const sy = star.y * invZ * canvasHeight + halfHeight;

            // Vérification des limites optimisée
            if (sx < 0 || sx >= canvasWidth || sy < 0 || sy >= canvasHeight)
                continue;

            // Calculs simplifiés
            const size = Math.max(0, 2 - star.z * 0.0025); // 1/400 = 0.0025
            const shade = Math.floor(255 - Math.min(255, star.z * 0.5)); // 1/2 = 0.5
            
            // Rendu simplifié sans shadow pour de meilleures performances
            ctx.fillStyle = `rgb(${shade},${shade},255)`;
            ctx.beginPath();
            ctx.arc(sx, sy, size, 0, 6.28); // 2*PI = 6.28
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
            canvasWidth = window.innerWidth;
            canvasHeight = window.innerHeight;
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            halfWidth = canvasWidth * 0.5;
            halfHeight = canvasHeight * 0.5;
            initStars();
        }
    }

    onMount(() => {
        console.log("🌟 Stars - onMount démarré");
        console.log("🌟 Stars - Canvas reçu:", canvas);
        
        if (canvas) {
            console.log("🌟 Stars - Canvas trouvé:", canvas);
            canvasWidth = window.innerWidth;
            canvasHeight = window.innerHeight;
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            halfWidth = canvasWidth * 0.5;
            halfHeight = canvasHeight * 0.5;
            ctx = canvas.getContext("2d");
            
            console.log("🌟 Stars - Contexte canvas:", ctx);
            initStars();
            console.log("🌟 Stars - Étoiles initialisées:", stars.length);
            drawStars();
            console.log("🌟 Stars - Animation démarrée");
        } else {
            console.log("🌟 Stars - Canvas non trouvé, attente...");
            // Attendre que le canvas soit disponible
            const checkCanvas = () => {
                if (canvas) {
                    console.log("🌟 Stars - Canvas trouvé après attente:", canvas);
                    canvasWidth = window.innerWidth;
                    canvasHeight = window.innerHeight;
                    canvas.width = canvasWidth;
                    canvas.height = canvasHeight;
                    halfWidth = canvasWidth * 0.5;
                    halfHeight = canvasHeight * 0.5;
                    ctx = canvas.getContext("2d");
                    
                    initStars();
                    drawStars();
                } else {
                    setTimeout(checkCanvas, 100);
                }
            };
            checkCanvas();
        }
        
        // Gestion du resize avec throttling - CORRECTION FUITE MÉMOIRE
        let resizeTimeout;
        const handleResizeThrottled = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(handleResize, 100);
        };
        window.addEventListener("resize", handleResizeThrottled);
        
        // Scroll pour les étoiles avec throttling - CORRECTION FUITE MÉMOIRE
        let scrollTimeout;
        const updateStarsThrottled = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(updateStars, 16); // ~60fps
        };
        window.addEventListener("scroll", updateStarsThrottled);
        
        // Fonction de nettoyage retournée par onMount
        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            // Nettoyer les timeouts
            if (resizeTimeout) clearTimeout(resizeTimeout);
            if (scrollTimeout) clearTimeout(scrollTimeout);
            // Supprimer les event listeners avec les bonnes références
            window.removeEventListener("resize", handleResizeThrottled);
            window.removeEventListener("scroll", updateStarsThrottled);
        };
    });

    onDestroy(() => {
        // CORRECTION : Nettoyage de sécurité pour onDestroy
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    });
</script>
