<script>
    import { onMount } from "svelte";
    import axios from "axios";

    // ⚡ Variables d'environnement Vite

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    let backgroundOK = "#05c605";
    let backgroundKO = "#e66841";
    let zero = 0;
    let widthTotal = 100;
    let widthMin = 50;

    let itsOkBackend = false;
    let itsOkN8n = false;
    let itsOkPhpMyAdmin = false;
    let itsOkUmami = false;

    // Fonction pour vérifier le backend
    async function checkBackend() {
        try {
            const response = await axios.get(BACKEND_URL);
            itsOkBackend = response.data;
        } catch (error) {
            itsOkBackend = false;
        }
    }

    // Fonction pour vérifier n8n via le backend
    async function checkN8n() {
        try {
            const response = await axios.get(
                `${BACKEND_URL}/codeurbaseApi/n8n/helloWorld`
            );

            // n8nResponse est un objet JSON
            if (response.data && response.data.n8nResponse) {
                const n8nResponse = response.data.n8nResponse;
                const message = n8nResponse.message;
                itsOkN8n = message === "true";

            } else {
                itsOkN8n = false;
            }
        } catch (error) {
            itsOkN8n = false;
        }
    }

    // Fonction pour vérifier phpMyAdmin via le backend
    async function checkPhpMyAdmin() {
        try {
            // Vérification via le backend pour éviter les problèmes CORS
            const response = await axios.get(
                `${BACKEND_URL}/health/phpmyadmin`
            );
            itsOkPhpMyAdmin = response.data.phpmyadmin === true;
        } catch (error) {
            itsOkPhpMyAdmin = false;
        }
    }

    // Fonction pour vérifier Umami via le backend
    async function checkUmami() {
        try {
            const response = await axios.get(`${BACKEND_URL}/health/umami`);
            // "true" ou "false" textuel
            itsOkUmami = response.data.umami === "true";

        } catch (error) {
            itsOkUmami = false;
        }
    }

    // Appeler les fonctions de vérification
    checkBackend();
    setTimeout(() => {
        checkN8n();
    }, 1000);
    setTimeout(() => {
        checkPhpMyAdmin();
    }, 1000);
    setTimeout(() => {
        checkUmami();
    }, 1000); // Augmenté à 10 secondes
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
                    : '0'};transition: opacity 1s ease-in-out;"
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
            style="background-color: {itsOkN8n ? backgroundOK : backgroundKO};
        width: {itsOkN8n
                ? widthMin
                : zero}%;transition: width 0.5s ease-in-out;"
        >
            <div
                class="n8n-power-content-item"
                style="opacity:{itsOkN8n
                    ? '1'
                    : '0'};transition: opacity 0.5s ease-in-out;"
            >
                🤖
            </div>
        </div>
    </div>

    <div class="phpmyadmin-power">
        <div
            class="phpmyadmin-power-title"
            style="width: {!itsOkPhpMyAdmin
                ? widthTotal
                : widthMin}%;transition: width 0.5s ease-in-out;"
        >
            SQL
        </div>
        <div
            class="phpmyadmin-power-content"
            style="background-color: {itsOkPhpMyAdmin
                ? backgroundOK
                : backgroundKO};
        width: {itsOkPhpMyAdmin
                ? widthMin
                : zero}%;transition: width 0.5s ease-in-out;"
        >
            <div
                class="phpmyadmin-power-content-item"
                style="opacity:{itsOkPhpMyAdmin
                    ? '1'
                    : '0'};transition: opacity 0.5s ease-in-out;"
            >
                🗃️
            </div>
        </div>
    </div>

    <div class="umami-power">
        <div
            class="umami-power-title"
            style="width: {!itsOkUmami
                ? widthTotal
                : widthMin}%;transition: width 0.5s ease-in-out;"
        >
            Umami
        </div>
        <div
            class="umami-power-content"
            style="background-color: {itsOkUmami ? backgroundOK : backgroundKO};
        width: {itsOkUmami
                ? widthMin
                : zero}%;transition: width 0.5s ease-in-out;"
        >
            <div
                class="umami-power-content-item"
                style="opacity:{itsOkUmami
                    ? '1'
                    : '0'};transition: opacity 0.5s ease-in-out;"
            >
                📊
            </div>
        </div>
    </div>
</div>

<style>
    .services-ok {
        margin-top: 60%;
        position: relative;
        top: 0%;
        right: 5%;
        display: flex;
        flex-direction: column;
        /* justify-content: center; */
        align-items: center;
        width: 100%;
        min-width: 250px;
        height: 90%;
        min-height: 100px;
        z-index: 1000;
        padding: 10px;
        gap: 25%;
    }

    .backend-power {
        position: sticky;
        top: 17%;
        width: 50%;
        height: 3%;
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
        font-size: 2rem;
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
        position: sticky;
        top: 35%;
        width: 50%;
        height: 3%;
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
        font-size: 2rem;
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

    .phpmyadmin-power {
        position: sticky;
        top: 53%;
        width: 50%;
        height: 3%;
        background-color: #0e0e0e;
        border-radius: 10px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border: 1px solid #fff;
        padding: 10px;
    }
    .phpmyadmin-power-title {
        font-size: 2rem;
        font-weight: 500;
        color: #fff;
        background-color: #555;
        width: 50%;
        height: 100%;
        border-radius: 10px 0 0 10px;
        display: flex;
        padding: 0 px;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid #fff;
        border-left: 1px solid #fff;
        border-top: 1px solid #fff;
        box-shadow: 10px 0 10px rgba(0, 0, 0, 0.5) inset;
    }
    .phpmyadmin-power-content {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        background-color: #555;
        height: 99%;
        border-radius: 0 10px 10px 0;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid #fff;
        border-right: 1px solid #fff;
        border-top: 1px solid #fff;
        box-shadow: -10px 0 10px rgba(0, 0, 0, 0.5) inset;
        overflow: hidden;
    }
    .phpmyadmin-power-content-item {
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

    .umami-power {
        position: sticky;
        top: 72%;
        width: 50%;
        height: 3%;
        background-color: #0e0e0e;
        border-radius: 10px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border: 1px solid #fff;
        padding: 10px;
    }
    .umami-power-title {
        font-size: 1.4rem;
        font-weight: 700;
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
    .umami-power-content {
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
        overflow: hidden;
    }
    .umami-power-content-item {
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

    /* Media Queries Responsive - Small Mobile */
    @media (max-width: 480px) {
        .services-ok {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin-top: 10%;
            margin-bottom: 10%;
            width: 95vw;
            right: 0%;
            
        }
        .backend-power,
        .n8n-power,
        .phpmyadmin-power,
        .umami-power {
            height: 22%;
            margin-top: 10px;
            margin-bottom: 10Px;
        }
     }

    /* Medium Mobile */
    @media (min-width: 481px) and (max-width: 768px) {


        .backend-power,
        .n8n-power,
        .umami-power {
            width: 100%;
            height: 22%;
            margin-top: 100px;
            margin-bottom: 10Px;
        }

  

        .backend-power-title,
        .n8n-power-title,
        .phpmyadmin-power-title,
        .umami-power-title {
            font-size: 1rem;
        }

        .backend-power-content-item,
        .n8n-power-content-item,
        .phpmyadmin-power-content-item,
        .umami-power-content-item {
            font-size: 1.5rem;
        }
    }
</style>
