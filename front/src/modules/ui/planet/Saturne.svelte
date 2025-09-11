<script>
    import { onMount } from "svelte";
    import { gsap } from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import saturne from "../../../assets/saturne.png";

    gsap.registerPlugin(ScrollTrigger);

    onMount(() => {
        console.log("chargé saturne.svelte");
        gsap.registerPlugin(ScrollTrigger);
    
        gsap.to(".saturne-container-inner img", {
            opacity: 1,
            duration: 1,
            height: "100%",
            width: "clamp(100px, 80%, 100%)",
            transform: "translate3d(-30%, 0, 1000px)",
            scale: 1.5,
            // top: "-50%",
            ease: "power2.inOut",                       
            scrollTrigger: {
                trigger: ".saturne-container",
                start: "top 10%",
                end: "bottom 20%",
                scrub: true,
                markers: true,
            }
        });

    });
</script>

<div class="saturne-container">
    <div class="saturne-container-inner">
    <div class="repere" style="position: absolute; top: 0; left: 0; z-index: 1000; color: blue;">repere saturne top</div>
    <div class="repere" style="position: absolute; bottom: 0; left: 0; z-index: 1000; color: blue;">repere saturne bottom</div>
        <img src={saturne} alt="saturne">
    </div>
</div>

<style>
    .saturne-container {
        position: relative;
        border: 1px solid red;
        width: 100%;
        height: 100%;
        z-index: 0;
        
    }
    .saturne-container-inner {
        position: absolute;
        top: -20%;
        left: 0;
        border: 1px solid blue;
        width: clamp(100px, 100%, 100%);
        height: 100%;
        /* opacity: 0; */
        transition: opacity 1s ease-in-out;
        perspective: 1000px;
        transform-style: preserve-3d;
    }
    .saturne-container-inner img {
        transform: translate3d(0, 0, -1000px); /* X=0, Y=0, Z=100px */
        position: relative;
        top: 90%;
        left: 0;
        border: 1px solid green;
        aspect-ratio: 1/1;
        /* width: ); */
        height: 0;
        /* backdrop-filter: shadow(50px 0px 10px rgba(230, 220, 128, 0.5)); */
        filter: drop-shadow(0px -100px 20px rgba(95, 164, 198, 0.5));
        /* opacity: 0.5; */
        animation: graduateFilter 10s forwards;
        animation-timeline: view();
    }
    @keyframes graduateFilter {
        0% {
            filter: drop-shadow(0px -10px 20px rgba(95, 164, 198, 0));
        }
        100% {
            filter: drop-shadow(-20px -100px 20px rgba(95, 164, 198, 0.5));
        }
    }
</style>