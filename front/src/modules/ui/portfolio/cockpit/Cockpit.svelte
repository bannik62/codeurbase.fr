<script>
    import Seat from '../../../../assets/seat.png';
    import Keyboard from '../../../../assets/keyboard.png';
    import Attack from '../../../../assets/atm.png';
</script>

<div class="cockpit">
    <div class="cockpit-left">
        <img src={Keyboard} alt="keyboard-left" class="keyboard-left" />
    <img src={Attack} alt="attack" class="attack" />
    </div>
    <div class="cockpit-center">
    <img src={Seat} alt="seat" class="cockpit-seat" />
    </div>
    <div class="cockpit-right">
        <img src={Keyboard} alt="keyboard-right" class="keyboard-right" />
    </div>
</div>

<style>
    .cockpit-seat {
        position: absolute;
        bottom: -20px;
        left: 47% ;
        width: 7% !important;
        height: 90% !important;
        z-index: 6000;
        isolation: isolate;
        filter:  hue-rotate(460deg);
    }
    .cockpit {
        display: flex;
        flex-direction: row;
        align-items: center;
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 13%;
        z-index: 3000;
        overflow: visible;
        border-top: 10px solid black;
    }
    .cockpit::before {
        content: "";
        position: absolute;
        inset: 0;
        background: #bbb;
        clip-path: polygon(50% 0%, 100% 38%, 100% 100%, 0 100%, 0% 38%);
        border: 25px solid #e81212;
        z-index: -1;
    }
    .cockpit-left {
        position: relative;
        width: 50%;
        height: 100%;
        background: linear-gradient(
            to left,
            #333,
            #4d4d4d,
            #666,
            #888, /* Corrected color from #808 to #888 for a more suitable gray */
            #999,
            #b3b3b3
            
        );
    }
    .keyboard-left {
        position: absolute;
        bottom: 20px;
        right: 30%;
        width: 10% !important;
        height: 30% !important;
        z-index: 1000;
    }
    .keyboard-left:hover {
        transform: scale(1.2);
        transition: transform 0.3s ease;
        cursor: pointer;
        filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
  
    }
    .attack {
        position: absolute;
        bottom: -10px;
        right: 65%;
        width: 8% !important;
        height: 30% !important;
        z-index: 1000;
    }
    .attack:hover {
        transform: scale(1.2);
        transition: transform 0.3s ease;
        cursor: pointer;
        filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
  
    }
    .cockpit-center {
        width: 5px;
        height: 100%;
        background: #2d2d2d;
        border-top: 5px solid #2c2b2b;
    }
    .cockpit-right {
        width: 50%;
        height: 100%;
        background: linear-gradient(
            to right,
            #333,
            #4d4d4d,
            #666,
            #888, /* Corrected color from #808 to #888 for a more suitable gray */
            #999,
            #b3b3b3
        );
    }
    .keyboard-right {
        position: absolute;
    bottom: 20px;
    right: 30%;
    width: 5% !important;
    height: 30% !important;
    z-index: 1000;
    transform: scale(-0.5, 1)   
}
    .keyboard-right:hover {
        transform: scale(1.2);
        transition: transform 0.3s ease;
        cursor: pointer;
        filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
  
    }
    
    /* ===== MEDIA QUERIES RESPONSIVE ===== */
    /* Très petits écrans (jusqu'à 475px) */
    @media (max-width: 475px) {
        .cockpit {
            bottom: 70px;
            height: 16%;
            border-top-width: 6px;
        }
        .cockpit::before {
            border-width: 12px;
        }
        .cockpit-seat {
            left: 40%;
        width: 23% !important;
        height: 85% !important;
        bottom: -53px;
        }
        .keyboard-left {
            right: 25%;
            width: 18% !important;
            height: 40% !important;
            bottom: -20px;
        }
        .keyboard-right {
            right: 19%;
        width: 18% !important;
        height: 40% !important;
        bottom: -15px;
        }
        .attack {
            right: 58%;
            width: 20% !important;
            height: 28% !important;
            bottom: -20px;
        }
    }

    /* Medium Mobile (476px à 767px) */
    @media (min-width: 476px) and (max-width: 767px) {
        .cockpit {
            height: 15%;
            border-top-width: 8px;
        }
        .cockpit::before {
            border-width: 16px;
        }
        .cockpit-seat {
            left: 46.5%;
            width: 10% !important;
            height: 88% !important;
            bottom: -12px;
        }
        .keyboard-left {
            right: 28%;
            width: 14% !important;
            height: 28% !important;
            bottom: 12px;
        }
        .keyboard-right {
            right: 28%;
            width: 7% !important;
            height: 28% !important;
            bottom: 12px;
            transform: scale(-0.5, 1);
        }
        .attack {
            right: 60%;
            width: 10% !important;
            height: 28% !important;
            bottom: -6px;
        }
    }

    /* Tablette (768px à 1023px) */
    @media (min-width: 768px) and (max-width: 1023px) {
        .cockpit {
            height: 14%;
            border-top-width: 10px;
        }
        .cockpit::before {
            border-width: 20px;
        }
        .cockpit-seat {
            left: 47%;
            width: 8% !important;
            height: 88% !important;
        }
        .keyboard-left {
            right: 30%;
            width: 12% !important;
            height: 28% !important;
        }
        .keyboard-right {
            right: 30%;
            width: 6% !important;
            height: 28% !important;
            transform: scale(-0.5, 1);
        }
        .attack {
            right: 63%;
            width: 9% !important;
            height: 28% !important;
        }
    }

    /* Desktop (1024px à 1399px) */
    @media (min-width: 1024px) and (max-width: 1399px) {
        .cockpit {
            height: 13%;
        }
        .cockpit-seat {
            width: 7% !important;
            height: 90% !important;
        }
        .keyboard-left {
            width: 10% !important;
        }
        .keyboard-right {
            width: 5% !important;
            transform: scale(-0.5, 1);
        }
        .attack {
            width: 8% !important;
        }
    }

    /* Large Desktop (1400px à 1799px) */
    @media (min-width: 1400px) and (max-width: 1799px) {
        .cockpit {
            height: 12%;
        }
        .cockpit-seat {
            width: 6% !important;
            height: 90% !important;
        }
        .keyboard-left {
            width: 9% !important;
        }
        .keyboard-right {
            width: 4.5% !important;
            transform: scale(-0.5, 1);
        }
        .attack {
            width: 7% !important;
        }
    }

    /* XL Desktop (1800px et plus) */
    @media (min-width: 1800px) {
        .cockpit {
            height: 11%;
            border-top-width: 12px;
        }
        .cockpit::before {
            border-width: 28px;
        }
        .cockpit-seat {
            width: 5% !important;
            height: 88% !important;
        }
        .keyboard-left {
            width: 8% !important;
        }
        .keyboard-right {
            width: 4% !important;
            transform: scale(-0.5, 1);
        }
        .attack {
            width: 6% !important;
        }
    }
</style>