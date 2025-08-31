<script>
    import { onMount } from "svelte";
    import Navbar from "../modules/ui/navbar/Navbar.svelte";
    import ServicesOK from "../modules/services/ServicesOK.svelte";
    let container;
    let isVisible = false;

    onMount(() => {
        // Animation d'apparition
        setTimeout(() => {
            isVisible = true;
        }, 100);
    });
</script>

<Navbar />
<svelte:head>
    <title>CodeurBase - Coming Soon</title>
</svelte:head>
<section>
    <div class="container" bind:this={container}>
        <div class="contain">
            <div class="content {isVisible ? 'visible' : ''}">
               
                <div class="text-container">
                    <h1 class="title">CodeurBase.fr</h1>
                    <div class="separator" ></div>
                    <h2 class="subtitle">A new design is coming soon, stay tuned!</h2>
                </div>
           
            </div>
            <ServicesOK />
        </div>

    </div>
</section>

<style>
    .container {
        width: 100vw;
        height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;
    }
    .contain {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        flex-wrap: wrap;
        width: 100%;
        gap: 0px;
        margin-right: 100px;
    }



    .content {
    width: 60vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    opacity: 0;
    transform: translateY(70px);
    transition: all 1s ease-out;
    }

    .content.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .text-container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 50%;
        padding: 70px;
        border-radius: 30px;
        position: relative;
    }
    .text-container::before {
        content: "";
        position: absolute;
        z-index: -1;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #71aeeb7e;
        filter: blur(10px);
    }

    .title {
        font-size: 4.5rem;
        font-weight: 800;
        color: rgb(248, 248, 248);
        margin: 0;
        text-shadow: 20px -10px 20px rgba(0, 0, 0, 0.674);
        animation: slideInLeft 1.5s ease-out 0.3s both;
        transform: translateX(-100vw);
        text-decoration: underline;
        text-decoration-color: #d9e0e4;
        text-decoration-thickness: 3px;
        text-underline-offset: 30px;
        text-decoration-skip-ink: auto;
    }

    .subtitle {
        font-size: 2.5rem;
        font-weight: 300;
        color: rgba(255, 255, 255, 0.9);
        margin: 0;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        animation: slideInRight 1.5s ease-out 0.6s both;
        transform: translatey(100vw);
    }

    .separator {
        width: 0;
        height: 4px;
        background: linear-gradient(90deg, transparent, #fff, transparent);
        margin: 2rem auto;
        border-radius: 2px;
        animation: expandWidth 1s ease-out 1.2s both;
    }

    @keyframes slideInLeft {
        to {
            transform: translateX(0);
        }
    }

    @keyframes slideInRight {
        to {
            transform: translateX(0);
        }
    }

    @keyframes expandWidth {
        to {
            width: 200px;
        }
    }


    /* Responsive */
    @media (max-width: 768px) {
        .title {
            font-size: 3rem;
        }

        .subtitle {
            font-size: 1.8rem;
        }

        .separator {
            width: 150px;
        }
        .text-container {
            width: 50%;
        }

    }

    @media (max-width: 480px) {
        .title {
            font-size: 2.5rem;
        }

        .subtitle {
            font-size: 1.5rem;
        }

        .separator {
            width: 120px;
        }
        .contain {
           margin-bottom: 100px;
        }
        .contain {
            margin-right: 0px;
        }
    }
    @media (max-width: 1000px){
        .contain {
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 100%;
            gap: 0px;
            margin-right: 0px;
            margin-bottom: 100px;
        }
    }
</style>
