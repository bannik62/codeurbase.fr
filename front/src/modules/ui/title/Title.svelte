<script>
    import screen from "../../../assets/sl_021821_40890_09.jpg";
    let titleValue = "CodeurBase.fr";
</script>

<div class="container">

 
    <div class="container-title-screen-and-balayage">
  
        <div class="cadre top-left">
     
            <div class="contain-rond-rectangle-top-left">
            <div  class="relative"></div>
                <div class="rond">
                </div>
                <div class="rectangle">     
                </div>
            
            </div>

            <div class="rectangle bottom-left">
                <div class="vertical-rectangle"></div>

            </div>
       
        </div>
   
    <div class="cadre top-right">
        test
    </div>      
   
    <div class="cadre bottom-left">
        test
    </div>  
   
    <div class="cadre bottom-right">
        test
    </div> 

        <div class="contain-balayage">
            <img src={screen} alt="screen" />
            <div class="balayage">
                <div class="balayage-content"></div>
            </div>
        </div>

        <h1 class="title">{titleValue}</h1>
    </div>


</div>

<style>
    .container {
        display: flex;
        width: clamp(200px, 100%, 100vw);
        height: clamp(100px, 100%, 100vh);
        justify-content: center;
        align-items: center;
        overflow: hidden;
    }

    .container-title-screen-and-balayage {
        position: relative;
        clip-path: polygon(
            7% 1%,
            89% 0,
            100% 12%,
            100% 92%,
            91% 100%,
            8% 100%,
            0 93%,
            0 16%
        );
        background: radial-gradient(
            circle,
            rgba(0, 0, 0, 1) 0%,
            rgba(52, 117, 79, 0.5 216) 90%,
            rgba(0, 0, 0, 1) 100%
        );
        background-image: url({screen});
        border-width: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: clamp(200px, 55vw, 100vw);
        height: clamp(100px, 30vh, 45vh);
        /* isolation: isolate; */
        z-index: 1000;
        /* overflow: hidden; */
    }
    .container-title-screen-and-balayage::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        background-color: rgba(22, 112, 70, 0.250);
        backdrop-filter: blur(1px);
        z-index: 1003;
    }
    .cadre {
        position: absolute;
        width: clamp(10px, 20%, 30%);
        height: clamp(10px, 40%, 40%);
        /* background: rgb(28, 173, 105); */
        z-index: 1004;
        isolation: isolate;
        z-index: 1004;
    }
    .cadre.top-left {
        position: absolute;
        top: 5%;
        left: 2%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .contain-rond-rectangle-top-left  {
        position: relative;
        display: flex;
        align-items: center;

        top: 0;
        left: 0;
        width: 100%;
        height: 50%;
        z-index: 1004;
        display: flex;
        
        
    }
    .contain-rond-rectangle-top-left .rond {
        position: absolute;
        top: 0;
        left: -5%;
        width: 25%;
        height: 60%;
        /* border: 1px solid rgb(103, 152, 19); */
        box-shadow: 0 0 10px crimson ;
        filter: drop-shadow(20px 0 20px rgba(242,255,219));
        border-radius: 50%;

        z-index: 1004;
    }
    .contain-rond-rectangle-top-left .rectangle {
        position: absolute;
        top:200%;
        left: 40%;
        width: 395%;
        height: 49%;
        /* outline:1px solid red; */
        /* border: 1px solid rgb(28, 173, 105); */
        /* box-shadow: 0px -10px 20px rgba(39, 130, 84, 0.5) ;
        filter: drop-shadow(0px 30px 15px  crimson); */
        z-index: 1003;
        animation: alternateboxshadow 3s alternate-reverse infinite;
        animation-delay: 5s;
    }
    @keyframes alternateboxshadow {
        0% {
            border-top-left-radius: 50%;
            border-top-right-radius: 50%;
            box-shadow: 0 -10px 20px rgba(39, 130, 84, 0.5) ;
            filter: drop-shadow(0 20px 10px crimson);
        }
        100% {
            border-bottom-left-radius: 50%;
            border-bottom-right-radius: 50%;
             box-shadow: 0px 10px 20px rgba(39, 130, 84, 0.5) ;
            filter: drop-shadow(0px -30px 5px  crimson); 
        }
    }
    .rectangle.bottom-left {
        position: relative;
        width: 100%;
        height: 40%;
        z-index: 1004;
    }
    .rectangle.bottom-left .vertical-rectangle {
        position: absolute;
        top: 20%;
        left: 10%;
        width: 12%;
        height: 205%;
        border: 1px solid rgb(28, 173, 105);
        box-shadow: 0 0 20px rgba(28, 173, 105, 0.5) ;
        filter: drop-shadow(20px 0 20px rgba(4, 10, 7, 0.5));
        background: rgba(28, 173, 105, 0.088);
        backdrop-filter: blur(50px);
    }

    .cadre.bottom-left {
        bottom: 0;
        left: 0;
    }
    .cadre.bottom-right {
        bottom: 0;
        right: 0;
    }
    .title {
        position: absolute;
        font-size: clamp(1rem, 4vw, 4.5rem);
        letter-spacing: 0.1em;
        font-weight: bold;
        color: crimson;
        text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        text-align: center;
        text-transform: uppercase;
        font-family: "Orbitron";
        z-index: 1004;
    }
    .contain-balayage {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        /* background-color: rgba(28, 173, 105, 0.288); */
        /* overflow: hidden; */
        z-index: 1000;
    }

    .contain-balayage img {
        position: absolute;
        top: -20%;
        left: -5%;
        width: 110%;
        height: 150%;
        object-fit: fill;
        opacity: 0.5;
        animation:  moveSnow 0.6s alternate-reverse infinite;
    }
    .balayage {
        position: absolute;
        top:0; 
        left:0;
        width:  clamp(10px, 100%, 100%);
        height: clamp(10px, 20%, 10%);
        margin: 0 auto;
        border-bottom: 1px solid rgba(28, 173, 105, 0.236);
        background: rgba(28, 173, 105, 0.171);
        backdrop-filter: blur(10px);
        animation: balayage 1s alternate infinite;
        animation-delay: 5s;
        z-index: 9999;
    }
    @keyframes moveSnow {
        0% {
            transform: translateY(5%) rotate(-2deg);
            transform-origin: bottom;
        }
        100% {
            /* top:20%; */
            transform: translateY(10%) rotate(3deg);
        }
    }

    @keyframes balayage {
    0% {
        top: 0;
    }
    20% {
        top: 100%;    }
    100% {
        top: 0;
    }

    }
    /* *
    {
       outline: 1px solid red;
    } */
</style>
