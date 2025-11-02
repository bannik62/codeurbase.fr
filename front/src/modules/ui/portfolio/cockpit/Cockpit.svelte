<script>
    import Seat from '../../../../assets/seat.png';

</script>

<div class="cockpit">
    <div class="cockpit-left"></div>
    <div class="cockpit-center">
    <img src={Seat} alt="seat" class="cockpit-seat" />
    </div>
    <div class="cockpit-right"></div>
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
</style>