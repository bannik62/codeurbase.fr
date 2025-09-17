import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Crée l'animation de bordure pour small mobile
 * @returns {Object} - L'animation GSAP
 */
export function createSmallMobileBordureAnimation() {
    return gsap.to(".bordure", {
        yPercent: 300,
        xPercent: 0,
        scale: -0.3,
        z: 0,
        transformStyle: "preserve-3d",
        transformOrigin: "center center",
        rotation: -70,
        opacity: 0,
        duration: 10,
        backgroundColor: "rgba(28, 173, 105)",
        scrollTrigger: {
            trigger: ".container",
            start: "top 0%",
            end: "bottom 0%",
            scrub: 3,
            // markers: true,
        },
        ease: "power2.inOut",
    });
}

/**
 * Crée l'animation de bordure pour medium mobile
 * @returns {Object} - L'animation GSAP
 */
export function createMediumMobileBordureAnimation() {
    return gsap.to(".bordure", {
        yPercent: 0,
        xPercent: 100,
        opacity: 1,
        duration: 2,
        scrollTrigger: {
            trigger: ".container",
            start: "top 10%",
            end: "bottom 10%",
            scrub: 1,
        },
        ease: "power2.inOut",
        onStart: () => console.log("Animation medium mobile bordure démarrée"),
    });
}

/**
 * Crée l'animation de bordure pour mobile
 * @returns {Object} - L'animation GSAP
 */
export function createMobileBordureAnimation() {
    return gsap.to(".bordure", {
        yPercent: -150,
        xPercent: 150,
        scale: 1.2,
        rotation: 55,
        opacity: 1,
        duration: 2.5,
        scrollTrigger: {
            trigger: ".container",
            start: "top 0",
            end: "bottom 90%",
            scrub: 1.5,
        },
        ease: "power2.inOut",
        onStart: () => console.log("Animation mobile bordure démarrée"),
    });
}

/**
 * Crée l'animation de bordure pour tablette
 * @returns {Object} - L'animation GSAP
 */
export function createTabletBordureAnimation() {
    return gsap.to(".bordure", {
        yPercent: -100,
        xPercent: 100,
        opacity: 1,
        duration: 3,
        scrollTrigger: {
            trigger: ".container",
            start: "top 20%",
            end: "bottom 20%",
            scrub: 2,
        },
        ease: "power2.inOut",
        onStart: () => console.log("Animation tablette bordure démarrée"),
    });
}

/**
 * Crée l'animation de bordure pour desktop
 * @returns {Object} - L'animation GSAP
 */
export function createDesktopBordureAnimation() {
    return gsap.to(".bordure", {
        yPercent: -80,
        xPercent: 80,
        opacity: 1,
        duration: 3.5,
        scrollTrigger: {
            trigger: ".container",
            start: "top 25%",
            end: "bottom 25%",
            scrub: 2.5,
        },
        ease: "power2.inOut",
        onStart: () => console.log("Animation desktop bordure démarrée"),
    });
}

/**
 * Crée l'animation de bordure pour large desktop
 * @returns {Object} - L'animation GSAP
 */
export function createLargeDesktopBordureAnimation() {
    return gsap.to(".bordure", {
        yPercent: -60,
        xPercent: 60,
        opacity: 1,
        duration: 4,
        scrollTrigger: {
            trigger: ".container",
            start: "top 30%",
            end: "bottom 30%",
            scrub: 3,
        },
        ease: "power2.inOut",
        onStart: () => console.log("Animation large desktop bordure démarrée"),
    });
}

/**
 * Initialise l'animation de bordure selon la taille d'écran
 * @param {string} currentSize - La taille d'écran actuelle
 * @returns {Object} - L'animation GSAP correspondante
 */
export function initBordureAnimation(currentSize) {
    switch (currentSize) {
        case 'smallMobile':
            return createSmallMobileBordureAnimation();
        case 'mediumMobile':
            return createMediumMobileBordureAnimation();
        case 'mobile':
            return createMobileBordureAnimation();
        case 'tablet':
            return createTabletBordureAnimation();
        case 'desktop':
            return createDesktopBordureAnimation();
        case 'largeDesktop':
            return createLargeDesktopBordureAnimation();
        default:
            return null;
    }
}

/**
 * Nettoie l'animation de bordure
 * @param {Object} animation - L'animation GSAP à nettoyer
 */
export function cleanupBordureAnimation(animation) {
    if (animation) animation.kill();
}
