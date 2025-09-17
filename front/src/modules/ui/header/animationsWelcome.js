import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Crée l'animation du titre "Welcome" pour small mobile
 * @param {Object} elements - Les éléments DOM bindés
 * @returns {Object} - L'animation GSAP
 */
export function createTitleAnimation(elements) {
    return gsap.timeline({
        scrollTrigger: {
            trigger: elements.elementOfTitle.container,
            start: "top 0%",
            endTrigger: elements.elementOfTitle.container,
            end: "bottom 20%",
            scrub: 1.3,
            toggleActions: "play none none none",
            // markers: true,
        },
    })
    .to(".container-global-text-bienvenue h2", {
        y: 50,
        x: 792,
        duration: 5,
        ease: "linear.inOut",
        willChange: "transform",
        scale: 1,
    })
    .to(".container-global-text-bienvenue h2", {
        y: 100,
        x: 1420,
        duration: 10,
        ease: "back.inOut(1.3)",
        willChange: "transform",    
        scale: 0.5,
    });
}

/**
 * Crée l'animation de splitting pour le texte
 * @param {Array} selection - Résultat de Splitting
 * @returns {Object} - L'animation GSAP
 */
export function createSplittingAnimation(selection) {
    return gsap.fromTo(
        selection[0].chars,
        {
            opacity: 0,
            y: 200,
            rotationX: 0,
        },
        {
            opacity: 1,
            y: 0,
            rotationX: -100,
            duration: 2,
            stagger: 2,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: ".h2-welcome",    
                endTrigger: ".content-text-bienvenue",                   
                start: "top 10%",
                end: "bottom 50%",
                toggleActions: "play none none reverse",
                scrub: 1,
                // markers: true,
            },
        }
    );
}

/**
 * Crée l'animation "In my world" pour small mobile
 * @param {Object} elements - Les éléments DOM bindés
 * @returns {Object} - L'animation GSAP
 */
export function createInMyWorldAnimation(elements) {
    return gsap.timeline({
        scrollTrigger: {
            trigger: elements.elementOfTitle.bordure,    
            start: "top ",
            endTrigger: elements.elementOfTitle.bordure,
            end: "bottom ",
            scrub: 0.8,
            // markers: true,
        },
    })
    .fromTo(".h3-in-my-world", 
        {
            opacity: 0,
            y: 650,
            scale: 0,
        },
        {
            opacity: 0.5,
            y: -90,
            duration: 0.5,
            ease: "linear.inOut",
            scale: 1,
        }
    )
    .to(".h3-in-my-world", {
        opacity: 1,
        scale: 0.5,
        duration: 0.8,
        ease: "power2.out",
    })
    .to(".h3-in-my-world", {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "power2.out",
    });
}

/**
 * Initialise toutes les animations pour small mobile
 * @param {Object} elements - Les éléments DOM bindés
 * @param {Array} selection - Résultat de Splitting
 * @returns {Object} - Objet contenant toutes les animations
 */
export function initSmallMobileAnimations(elements, selection) {
    const titleAnimation = createTitleAnimation(elements);
    const splittingAnimation = createSplittingAnimation(selection);
    const timelineInMyWorld = createInMyWorldAnimation(elements);

    return {
        titleAnimation,
        splittingAnimation,
        timelineInMyWorld
    };
}

/**
 * Nettoie toutes les animations
 * @param {Object} animations - Objet contenant les animations
 */
export function cleanupAnimations(animations) {
    if (animations.titleAnimation) animations.titleAnimation.kill();
    if (animations.splittingAnimation) animations.splittingAnimation.kill();
    if (animations.timelineInMyWorld) animations.timelineInMyWorld.kill();
}
