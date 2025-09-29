<script>
    import { onMount } from "svelte";
    import axios from "axios";

    // ⚡ Variables d'environnement Vite
    console.log("Toutes les variables d'env:", import.meta.env);
    
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const N8N_URL     = import.meta.env.VITE_N8N_URL;

    let backgroundOK = "#05c605";
    let backgroundKO = "#e66841";
    let zero = 0;
    let widthTotal = 100;
    let widthMin = 50;

    let itsOkBackend = false;
    let itsOkN8n = true;
    console.log("BACKEND_URL", BACKEND_URL);
    console.log("N8N_URL", N8N_URL);
    
    console.log("Starting health checks with URL:", BACKEND_URL , N8N_URL);

    console.log("Attempting health check...");
        axios
            .get(BACKEND_URL)
            .then((response) => {
                itsOkBackend = response.data;
                console.log("Health check success:", {
                    timestamp: new Date().toISOString(),
                    status: itsOkBackend
                });
            })
            .catch((error) => {
                console.log("Health check failed:", {
                    timestamp: new Date().toISOString(),
                    error: error.message,
                    config: error.config?.url
                });
                itsOkBackend = false;
            });
            axios
            .get(N8N_URL)
            .then((response) => {
                itsOkN8n = response.data;
            })
            .catch((error) => {
                console.log("Health check failed:", {
                    timestamp: new Date().toISOString(),
                    error: error.message,
                    config: error.config?.url
                });
                itsOkN8n = false;
            });

</script>

<div class="services-ok">

<div class="backend-power">
    <div
        class="backend-power-title"
        style="width: {!itsOkBackend
            ? widthTotal
            : widthMin}%;transition: width 0.5s ease-in-out;"
    >
        Back
    </div>
    <div
        class="backend-power-content"
        style="background-color: {itsOkBackend
            ? backgroundOK
            : backgroundKO};width: {itsOkBackend
            ? widthMin
            : zero}%;transition: width 0.5s ease-in-out;"
    >
        <div
            class="backend-power-content-item"
            style="opacity:{itsOkBackend
                ? '1'
                : '0'};transition: opacity 2s ease-in-out;"
        >
            🗄️
        </div>
    </div>
</div>

<div class="n8n-power">
        <div
            class="n8n-power-title"
            style="width: {!itsOkN8n
                ? widthTotal
                : widthMin}%;transition: width 0.5s ease-in-out;"
        >
            n8n
        </div>
    <div
        class="n8n-power-content"
        style="background-color: {itsOkN8n ? backgroundOK : backgroundKO};width: {itsOkN8n
            ? widthMin
            : zero}%;transition: width 0.5s ease-in-out;"
    >
        <div
            class="n8n-power-content-item"
            style="opacity:{itsOkN8n
                ? '1'
                : '0'};transition: opacity 2s ease-in-out;"
        >
            🤖
        </div>
    </div>
</div>
</div>

<style>
   .services-ok {
    position: relative;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 30%;
    min-width: 400px;
    height: 400px;
    min-height: 100px;
    z-index: 1000;
    padding: 10px;
    gap: 10px;

  }
  .services-ok::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #3d3b647a;
    filter:blur(10px);
    /* backdrop-filter:blur(60px); */
    z-index: -1;
  }
    .backend-power {
        width: 50%;
        height: 20%;
        background-color: #0e0e0e;
        border-radius: 10px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border: 1px solid #fff;
        padding: 10px;
    }
    .backend-power-title {
        display: absolute;
        font-size: 1.5rem;
        font-weight: 600;
        color: #fff;
        background-color: #555;
        /* width: 50%; */
        height: 100%;
        border-radius: 10px 0 0 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid #fff;
        border-left: 1px solid #fff;
        border-top: 1px solid #fff;
        box-shadow: 10px 0 10px rgba(0, 0, 0, 0.5) inset;
    }
    .backend-power-content {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        background-color: #555;
        /* width: 50%; */
        height: 100%;
        border-radius: 0 10px 10px 0;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid #fff;
        border-right: 1px solid #fff;
        border-top: 1px solid #fff;
        box-shadow: -10px 0 10px rgba(0, 0, 0, 0.5) inset;
        /* background-color: #e66841; */
        overflow: hidden;
    }
    .backend-power-content-item {
        width: 0px;
        font-size: 2rem;
        font-weight: 600;
        color: #fff;
        height: 100%;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .n8n-power {
        width: 50%;
        height: 20%;
        background-color: #0e0e0e;
        border-radius: 10px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border: 1px solid #fff;
        padding: 10px;
    }
    .n8n-power-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: #fff;
        background-color: #555;
        width: 50%;
        height: 100%;
        border-radius: 10px 0 0 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid #fff;
        border-left: 1px solid #fff;
        border-top: 1px solid #fff;
        box-shadow: 10px 0 10px rgba(0, 0, 0, 0.5) inset;
    }
    .n8n-power-content {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        background-color: #555;
        height: 100%;
        border-radius: 0 10px 10px 0;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid #fff;
        border-right: 1px solid #fff;
        border-top: 1px solid #fff;
        box-shadow: -10px 0 10px rgba(0, 0, 0, 0.5) inset;
        /* background-color: #e66841; */
    }
    .n8n-power-content-item {
        width: 0px;
        font-size: 2rem;
        font-weight: 600;
        color: #fff;
        height: 100%;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

</style>
