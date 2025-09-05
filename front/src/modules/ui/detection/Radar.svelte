<script>
    import { onMount } from "svelte";

    let canvas;
    let ctx;
    let points = [];

    // Initialize random points within the radar circle
    function initPoints() {
        points = Array.from({ length: 10 }, () => ({
            x: Math.random() * 200 - 100,
            y: Math.random() * 200 - 100,
            angle: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.5 + 0.5
        }));
    }

    // Update the position of each point
    function updatePoints() {
        points.forEach(point => {
            point.x += Math.cos(point.angle) * point.speed;
            point.y += Math.sin(point.angle) * point.speed;

            // Keep points within the radar circle
            if (Math.sqrt(point.x ** 2 + point.y ** 2) > 100) {
                point.angle += Math.PI;
            }
        });
    }

    // Draw the radar
    function drawRadar() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw radar background
        ctx.fillStyle = "#003300";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw radar grid
        ctx.strokeStyle = "#00FF00";
        ctx.lineWidth = 0.5;
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.arc(150, 150, (i + 1) * 20, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Draw radar lines
        for (let i = 0; i < 12; i++) {
            ctx.beginPath();
            ctx.moveTo(150, 150);
            ctx.lineTo(150 + 100 * Math.cos((i * Math.PI) / 6), 150 + 100 * Math.sin((i * Math.PI) / 6));
            ctx.stroke();
        }

        // Draw points
        ctx.fillStyle = "red";
        points.forEach(point => {
            ctx.beginPath();
            ctx.arc(150 + point.x, 150 + point.y, 3, 0, Math.PI * 2);
            ctx.fill();
        });

        updatePoints();
        requestAnimationFrame(drawRadar);
    }

    onMount(() => {
        canvas.width = 300;
        canvas.height = 300;
        ctx = canvas.getContext("2d");
        initPoints();
        drawRadar();
    });
</script>

<canvas bind:this={canvas}></canvas>

<style>
        canvas {
            display: absolute;
        margin: 0 auto;
        width: 300px;
        height: 300px;
        background-color: #003300;
        border-radius: 50%;
        margin-top: 20px;
        margin-bottom: 20px;
    }
</style>
