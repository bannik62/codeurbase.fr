import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Crée l'animation des boîtes techno pour small mobile
 * @param {Object} elements - Les éléments DOM bindés
 * @returns {Object} - L'animation GSAP
 */
export function createSmallMobileTechnoAnimation(elements) {
    return gsap.timeline({
        scrollTrigger: {
            trigger: ".h2-welcome",
            start: "top 0% -50%",
            end: "bottom 0%",
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".box", 
        {
            opacity: 0,
            y: 100,
            scale: 0.5,
            rotation: 180,
        },
        {
            opacity: 1,
            y: 20,
            scale: 1,
            rotation: 0,
            duration: 1.5,
            stagger: 0.2,
            ease: "back.out(1.7)",
        }
    )
    .to(".box", {
        y: -10,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
    })
    .to(".box", {
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "bounce.out",
    });
}

/**
 * Crée l'animation des boîtes techno pour medium mobile
 * @param {Object} elements - Les éléments DOM bindés
 * @returns {Object} - L'animation GSAP
 */
export function createMediumMobileTechnoAnimation(elements) {
    return gsap.timeline({
        scrollTrigger: {
            trigger: elements.technoContainer,
            start: "top 75%",
            end: "bottom 25%",
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".box", 
        {
            opacity: 0,
            y: 120,
            scale: 0.3,
            rotation: 360,
        },
        {
            opacity: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 2,
            stagger: 0.3,
            ease: "elastic.out(1, 0.3)",
        }
    )
    .to(".box", {
        scale: 1.1,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
    })
    .to(".box", {
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
    });
}

/**
 * Crée l'animation des boîtes techno pour mobile
 * @param {Object} elements - Les éléments DOM bindés
 * @returns {Object} - L'animation GSAP
 */
export function createMobileTechnoAnimation(elements) {
    return gsap.timeline({
        scrollTrigger: {
            trigger: elements.technoContainer,
            start: "top 70%",
            end: "bottom 30%",
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".box", 
        {
            opacity: 0,
            y: 150,
            scale: 0.2,
            rotation: 720,
        },
        {
            opacity: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 2.5,
            stagger: 0.4,
            ease: "elastic.out(1, 0.5)",
        }
    )
    .to(".box", {
        y: -30,
        scale: 1.15,
        duration: 1,
        stagger: 0.15,
        ease: "power2.out",
    })
    .to(".box", {
        y: 0,
        scale: 1,
        duration: 1,
        stagger: 0.15,
        ease: "bounce.out",
    });
}

/**
 * Crée l'animation des boîtes techno pour tablette
 * @param {Object} elements - Les éléments DOM bindés
 * @returns {Object} - L'animation GSAP
 */
export function createTabletTechnoAnimation(elements) {
    return gsap.timeline({
        scrollTrigger: {
            trigger: elements.technoContainer,
            start: "top 65%",
            end: "bottom 35%",
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".box", 
        {
            opacity: 0,
            y: 200,
            scale: 0.1,
            rotation: 1080,
        },
        {
            opacity: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 3,
            stagger: 0.5,
            ease: "elastic.out(1, 0.7)",
        }
    )
    .to(".box", {
        y: -40,
        scale: 1.2,
        duration: 1.2,
        stagger: 0.2,
        ease: "power2.out",
    })
    .to(".box", {
        y: 0,
        scale: 1,
        duration: 1.2,
        stagger: 0.2,
        ease: "bounce.out",
    });
}

/**
 * Crée l'animation des boîtes techno pour desktop
 * @param {Object} elements - Les éléments DOM bindés
 * @returns {Object} - L'animation GSAP
 */
export function createDesktopTechnoAnimation(elements) {
    return gsap.timeline({
        scrollTrigger: {
            trigger: elements.technoContainer,
            start: "top 60%",
            end: "bottom 40%",
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".box", 
        {
            opacity: 0,
            y: 250,
            scale: 0.05,
            rotation: 1440,
        },
        {
            opacity: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 3.5,
            stagger: 0.6,
            ease: "elastic.out(1, 0.9)",
        }
    )
    .to(".box", {
        y: -50,
        scale: 1.25,
        duration: 1.5,
        stagger: 0.25,
        ease: "power2.out",
    })
    .to(".box", {
        y: 0,
        scale: 1,
        duration: 1.5,
        stagger: 0.25,
        ease: "bounce.out",
    });
}

/**
 * Crée l'animation des boîtes techno pour large desktop
 * @param {Object} elements - Les éléments DOM bindés
 * @returns {Object} - L'animation GSAP
 */
export function createLargeDesktopTechnoAnimation(elements) {
    return gsap.timeline({
        scrollTrigger: {
            trigger: elements.elementOfBienvenu.h3InMyWorld,
            start: "top 0% +9050px",
            end: "bottom 99%",
            toggleActions: "play none none none",
        },
    })
    .fromTo(".box", 
        {
            onStart: () => console.log("Animation large desktop techno start"),
            opacity: 0,
            y: 300,
            scale: 0.02,
            rotation: 1800,
        },
        {
            opacity: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.7,
            stagger: 0.35,
            ease: "elastic.out(1, 1.1)",
        }
    )
    .to(".box", {
        y: -40,
        scale: 1.2,
        duration: 0.25,
        stagger: 0.15,
        ease: "power2.out",
    })
    .to(".box", {
        y: 0,
        scale: 0.9,
        duration: 0.25,
        stagger: 0.15,
        ease: "bounce.out",
        onComplete: () => console.log("Animation large desktop techno end"),
    });
}

/**
 * Crée l'animation des boîtes techno pour xl desktop
 * @param {Object} elements - Les éléments DOM bindés
 * @returns {Object} - L'animation GSAP
 */
export function createXlDesktopTechnoAnimation(elements) {
    return gsap.timeline({
        scrollTrigger: {
            trigger: elements.technoContainer,
            start: "top 50%",
            end: "bottom 50%",
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".box", 
        {
            opacity: 0,
            y: 350,
            scale: 0.01,
            rotation: 2160,
        },
        {
            opacity: 1,
            y: 0,
            scale: 0.11,
            rotation: 0,
            duration: 2,
            stagger: 0.1,
            ease: "elastic.out(1, 1.3)",
        }
    )
    .to(".box", {
        y: -50,
        scale: 1.2,
        duration: 2,
        stagger: 0.1,
        ease: "power2.out",
    })
    .to(".box", {
        y: 0,
        scale: 1,
        duration: 2,
        stagger: 0.1,
        ease: "bounce.out",
    });
}

/**
 * Initialise les animations selon la taille d'écran
 * @param {string} currentSize - La taille d'écran actuelle
 * @param {Object} elements - Les éléments DOM bindés
 * @returns {Object} - Objet contenant toutes les animations
 */
export function initTechnoAnimations(currentSize, elements) {
    switch (currentSize) {
        case 'smallMobile':
            return {
                technoAnimation: createSmallMobileTechnoAnimation(elements)
            };
        case 'mediumMobile':
            return {
                technoAnimation: createMediumMobileTechnoAnimation(elements)
            };
        case 'mobile':
            return {
                technoAnimation: createMobileTechnoAnimation(elements)
            };
        case 'tablet':
            return {
                technoAnimation: createTabletTechnoAnimation(elements)
            };
        case 'desktop':
            return {
                technoAnimation: createDesktopTechnoAnimation(elements)
            };
        case 'largeDesktop':
            return {
                technoAnimation: createLargeDesktopTechnoAnimation(elements)
            };
        case 'xlDesktop':
            return {
                technoAnimation: createXlDesktopTechnoAnimation(elements)
            };
        default:
            return {};
    }
}

/**
 * Nettoie toutes les animations
 * @param {Object} animations - Objet contenant les animations
 */
export function cleanupTechnoAnimations(animations) {
    if (animations.technoAnimation) animations.technoAnimation.kill();
}
