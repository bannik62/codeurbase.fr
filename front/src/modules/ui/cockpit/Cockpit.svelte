<script>
</script>

<div class="cockpit">
    <div class="cockpit-left"></div>
    <div class="cockpit-center"></div>
    <div class="cockpit-right"></div>
</div>

<style>
    .cockpit {
        display: flex;
        flex-direction: row;
        align-items: center;
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 15%;
        background: #bbb;
        clip-path: polygon(50% 0%, 100% 38%, 100% 100%, 0 100%, 0% 38%);
        z-index: 3000;
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