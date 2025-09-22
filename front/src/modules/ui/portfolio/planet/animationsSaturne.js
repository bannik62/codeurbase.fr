import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Crée l'animation de Saturne pour small mobile
 * @returns {Object} - L'animation GSAP
 */
export function createSmallMobileSaturneAnimation() {
    return gsap.timeline({
        scrollTrigger: {
            trigger: ".saturne-container",
            start: "top 40%",
            end: "bottom 20%",
            scrub: 1,
        }
    })
    .to(".saturne-container-inner img", {
        opacity: 0,
        scale: 0.05,
        transform: "translate3d(-90%, -19%, -2000px)",
        duration: 0.5,
    })
    .to(".saturne-container-inner img", {
        opacity: 1,
        scale: 0.5,
        transform: "translate3d(-90%, -100%, -1000px)",
        duration: 0.3,
        ease: "power2.out"
    })
    .to(".saturne-container-inner img", {
        scale: 2,
        opacity: 0,
        duration: 0.3,
        ease: "power2.out"
    })
    .to(".saturne-container-inner img", {
        transform: "translate3d(150%, 150%, 0px)",
        duration: 2,
        ease: "power2.inOut"
    });
}

/**
 * Crée l'animation de Saturne pour medium mobile
 * @returns {Object} - L'animation GSAP
 */
export function createMediumMobileSaturneAnimation() {
    return gsap.timeline({
        scrollTrigger: {
            trigger: ".saturne-container",
            start: "top 35%",
            end: "bottom 25%",
            scrub: 1.2,
            onUpdate: (self) => {
                if (self.progress < 0.3 && !self.isActive) {
                    console.log("🪐 Étape 1 - Saturne apparaît en haut à gauche");
                } else if (self.progress >= 0.3 && !self.isActive) {
                    console.log("🪐 Étape 2 - Saturne traverse en diagonal vers bas à droite !");
                }
            }
        }
    })
    .to(".saturne-container-inner img", {
        opacity: 0,
        scale: 0.08,
        transform: "translate3d(-120%, -25%, -2000px)",
        duration: 0,
    })
    .to(".saturne-container-inner img", {
        opacity: 1,
        scale: 0.7,
        transform: "translate3d(-45%, -55%, -1000px)",
        duration: 0.4,
        ease: "power2.out"
    })
    .to(".saturne-container-inner img", {
        scale: 2.1,
        opacity: 0,
        duration: 0.3,
        ease: "power2.out"
    })
    .to(".saturne-container-inner img", {
        transform: "translate3d(120%, 160%, 0px)",
        duration: 2.2,
        ease: "power2.inOut"
    });
}

/**
 * Crée l'animation de Saturne pour mobile
 * @returns {Object} - L'animation GSAP
 */
export function createMobileSaturneAnimation() {
    return gsap.timeline({
        scrollTrigger: {
            trigger: ".saturne-container",
            start: "top 30%",
            end: "bottom 30%",
            scrub: 1.5,
            onUpdate: (self) => {
                if (self.progress < 0.3 && !self.isActive) {
                    console.log("🪐 Étape 1 - Saturne apparaît en haut à gauche");
                } else if (self.progress >= 0.3 && !self.isActive) {
                    console.log("🪐 Étape 2 - Saturne traverse en diagonal vers bas à droite !");
                }
            }
        }
    })
    .to(".saturne-container-inner img", {
        opacity: 0,
        scale: 0.1,
        transform: "translate3d(-140%, -30%, -2000px)",
        duration: 0,
    })
    .to(".saturne-container-inner img", {
        opacity: 1,
        scale: 0.8,
        transform: "translate3d(-40%, -50%, -1000px)",
        duration: 0.5,
        ease: "power2.out"
    })
    .to(".saturne-container-inner img", {
        scale: 2.3,
        opacity: 0,
        duration: 0.3,
        ease: "power2.out"
    })
    .to(".saturne-container-inner img", {
        transform: "translate3d(140%, 170%, 0px)",
        duration: 2.5,
        ease: "power2.inOut"
    });
}

/**
 * Crée l'animation de Saturne pour tablette
 * @returns {Object} - L'animation GSAP
 */
export function createTabletSaturneAnimation() {
    return gsap.timeline({
        scrollTrigger: {
            trigger: ".saturne-container",
            start: "top 25%",
            end: "bottom 35%",
            scrub: 1.8,
            onUpdate: (self) => {
                if (self.progress < 0.3 && !self.isActive) {
                    console.log("🪐 Étape 1 - Saturne apparaît en haut à gauche");
                } else if (self.progress >= 0.3 && !self.isActive) {
                    console.log("🪐 Étape 2 - Saturne traverse en diagonal vers bas à droite !");
                }
            }
        }
    })
    .to(".saturne-container-inner img", {
        opacity: 0,
        scale: 0.12,
        transform: "translate3d(-160%, -35%, -2000px)",
        duration: 0,
    })
    .to(".saturne-container-inner img", {
        opacity: 1,
        scale: 0.9,
        transform: "translate3d(-35%, -45%, -1000px)",
        duration: 0.6,
        ease: "power2.out"
    })
    .to(".saturne-container-inner img", {
        scale: 2.5,
        opacity: 0,
        duration: 0.3,
        ease: "power2.out"
    })
    .to(".saturne-container-inner img", {
        transform: "translate3d(160%, 180%, 0px)",
        duration: 2.8,
        ease: "power2.inOut"
    });
}

/**
 * Crée l'animation de Saturne pour desktop
 * @returns {Object} - L'animation GSAP
 */
export function createDesktopSaturneAnimation() {
    return gsap.timeline({
        scrollTrigger: {
            trigger: ".saturne-container",
            start: "top 20%",
            end: "bottom 40%",
            scrub: 2,

        }
    })
    .to(".saturne-container-inner img", {
        opacity: 0,
        scale: 0.15,
        transform: "translate3d(-180%, -40%, -2000px)",
        duration: 0,
    })
    .to(".saturne-container-inner img", {
        opacity: 1,
        scale: 1.0,
        transform: "translate3d(-30%, -40%, -1000px)",
        duration: 0.7,
        ease: "power2.out"
    })
    .to(".saturne-container-inner img", {
        scale: 2.7,
        opacity: 0,
        duration: 0.3,
        ease: "power2.out"
    })
    .to(".saturne-container-inner img", {
        transform: "translate3d(180%, 190%, 0px)",
        duration: 3,
        ease: "power2.inOut"
    });
}

/**
 * Crée l'animation de Saturne pour large desktop
 * @returns {Object} - L'animation GSAP
 */
export function createLargeDesktopSaturneAnimation() {
    return gsap.timeline({
        scrollTrigger: {
            trigger: ".content-text-bienvenue",
            start: "top 60%",
            endTrigger: ".saturne-container-inner",
            end: "bottom 10%",
            scrub: 1,
            // markers: true,
           
        }
    })
    .to(".saturne-container-inner img", {
        opacity: 0.3,
        scale: 0.3,
        // xPercent: -4,
        yPercent: -50,
        z: -1000,
        duration: 2,
    })
    .to(".saturne-container-inner img", {
        opacity: 0.9,
        scale: 2.1,
        xPercent: 700,
        yPercent: 650,
        z: -1000,
        duration: 8,
        ease: "linear.out"
    })
    .to(".saturne-container-inner img", {
        xPercent: 10,
        yPercent: 0,
        // z: 0,
        scale: 6,
        opacity: 1,
        duration: 3,
        // ease: "power2.out"
    })
    // .to(".saturne-container-inner img", {
    //     xPercent: 200,
    //     yPercent: 200,
    //     z: -10,
    //     duration: 3.2,
    //     ease: "power2.inOut"
    // });
}


/**
 * Initialise l'animation de Saturne selon la taille d'écran
 * @param {string} currentSize - La taille d'écran actuelle
 * @returns {Object} - L'animation GSAP correspondante
 */
export function initSaturneAnimation(currentSize) {
    switch (currentSize) {
        case 'smallMobile':
            return createSmallMobileSaturneAnimation();
        case 'mobile':
            return createMobileSaturneAnimation();
        case 'tablet':
            return createTabletSaturneAnimation();
        case 'desktop':
            return createDesktopSaturneAnimation();
        case 'largeDesktop':
            return createLargeDesktopSaturneAnimation();
        default:
            return createSmallMobileSaturneAnimation();
    }
}

/**
 * Nettoie l'animation de Saturne
 * @param {Object} animation - L'animation GSAP à nettoyer
 */
export function cleanupSaturneAnimation(animation) {
    if (animation) animation.kill();
}
