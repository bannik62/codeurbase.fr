import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Crée l'animation du titre "Welcome" pour small mobile
 * @param {Object} elements - Les éléments DOM bindés
 * @returns {Object} - L'animation GSAP
 */
export function createSmallMobileTitleAnimation(elements) {
    return gsap.timeline({
        scrollTrigger: {
            trigger: elements.elementOfTitle.container,
            start: "top 0%",
            endTrigger: elements.elementOfTitle.container,
            end: "bottom 20%",
            scrub: 0.3,
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
        ease: "back.inOut(1)",
        willChange: "transform",    
        scale: 0.5,
    });
}

/**
 * Crée l'animation de splitting pour small mobile
 * @param {Array} selection - Résultat de Splitting
 * @returns {Object} - L'animation GSAP
 */
export function createSmallMobileSplittingAnimation(selection) {
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
export function createSmallMobileInMyWorldAnimation(elements) {
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
 * Crée toutes les animations pour medium mobile
 * @param {Object} elements - Les éléments DOM bindés
 * @param {Array} selection - Résultat de Splitting
 * @returns {Object} - Objet contenant toutes les animations
 */
export function createMediumMobileAnimations(elements, selection) {
    // TODO: Implémenter les animations pour medium mobile
    return {};
}

/**
 * Crée toutes les animations pour mobile
 * @param {Object} elements - Les éléments DOM bindés
 * @param {Array} selection - Résultat de Splitting
 * @returns {Object} - Objet contenant toutes les animations
 */
export function createMobileAnimations(elements, selection) {
    // TODO: Implémenter les animations pour mobile
    return {};
}

/**
 * Crée toutes les animations pour tablette
 * @param {Object} elements - Les éléments DOM bindés
 * @param {Array} selection - Résultat de Splitting
 * @returns {Object} - Objet contenant toutes les animations
 */
export function createTabletAnimations(elements, selection) {
    // TODO: Implémenter les animations pour tablette
    return {};
}

/**
 * Crée toutes les animations pour desktop
 * @param {Object} elements - Les éléments DOM bindés
 * @param {Array} selection - Résultat de Splitting
 * @returns {Object} - Objet contenant toutes les animations
 */
export function createDesktopAnimations(elements, selection) {
    return {
        titleAnimation: createDesktopTitleAnimation(elements),
        splittingAnimation: createDesktopSplittingAnimation(selection),
        timelineInMyWorld: createDesktopInMyWorldAnimation(elements)
    };
}

/**
 * Crée l'animation du titre "Welcome" pour desktop
 * @param {Object} elements - Les éléments DOM bindés
 * @returns {Object} - L'animation GSAP
 */
export function createDesktopTitleAnimation(elements) {
    return gsap.timeline({
        scrollTrigger: {
            trigger: elements.elementOfTitle.container,
            start: "top 0%",
            endTrigger: elements.elementOfTitle.container,
            end: "bottom 20%",
            scrub: 0.3,
            toggleActions: "play none none none",
        },
    })
    .to(".container-global-text-bienvenue h2", {
        y: 120,
        x: 1800,
        duration: 5,
        ease: "linear.inOut",
        willChange: "transform",
        scale: 1,
        onStart: () => console.log("Animation desktop titre démarrée"),
    })
    .to(".container-global-text-bienvenue h2", {
        y: 200,
        x: 2800,
        duration: 10,
        ease: "back.inOut(1)",
        willChange: "transform",    
        scale: 0.5,
    });
}

/**
 * Crée l'animation de splitting pour desktop
 * @param {Array} selection - Résultat de Splitting
 * @returns {Object} - L'animation GSAP
 */
export function createDesktopSplittingAnimation(selection) {
    return gsap.fromTo(
        selection[0].chars,
        {
            opacity: 0,
            y: 300,
            rotationX: 0,
        },
        {
            opacity: 1,
            y: 0,
            rotationX: -120,
            duration: 2.5,
            stagger: 2.5,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: ".h2-welcome",    
                endTrigger: ".content-text-bienvenue",                   
                start: "top 10%",
                end: "bottom 50%",
                toggleActions: "play none none reverse",
                scrub: 1.2,
            },
        }
    );
}

/**
 * Crée l'animation "In my world" pour desktop
 * @param {Object} elements - Les éléments DOM bindés
 * @returns {Object} - L'animation GSAP
 */
export function createDesktopInMyWorldAnimation(elements) {
    return gsap.timeline({
        scrollTrigger: {
            trigger: elements.elementOfTitle.bordure,    
            start: "top ",
            endTrigger: elements.elementOfTitle.bordure,
            end: "bottom ",
            scrub: 1.0,
        },
    })
    .fromTo(".h3-in-my-world", 
        {
            opacity: 0,
            y: 800,
            scale: 0,
        },
        {
            opacity: 0.5,
            y: -120,
            duration: 0.6,
            ease: "linear.inOut",
            scale: 1,
        }
    )
    .to(".h3-in-my-world", {
        opacity: 1,
        scale: 0.6,
        duration: 1.0,
        ease: "power2.out",
    })
    .to(".h3-in-my-world", {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
    });
}

/**
 * Crée toutes les animations pour large desktop
 * @param {Object} elements - Les éléments DOM bindés
 * @param {Array} selection - Résultat de Splitting
 * @returns {Object} - Objet contenant toutes les animations
 */
export function createLargeDesktopAnimations(elements, selection) {
    return {
        titleAnimation: createLargeDesktopTitleAnimation(elements),
        splittingAnimation: createLargeDesktopSplittingAnimation(selection),
        timelineInMyWorld: createLargeDesktopInMyWorldAnimation(elements)
    };
}

/**
 * Crée l'animation du titre "Welcome" pour large desktop
 * @param {Object} elements - Les éléments DOM bindés
 * @returns {Object} - L'animation GSAP
 */
export function createLargeDesktopTitleAnimation(elements) {
    return gsap.timeline({
        scrollTrigger: {
            trigger: elements.elementOfTitle.container,
            start: "top 0%",
            endTrigger: elements.elementOfTitle.container,
            end: "bottom 90%",
            scrub: 0.9,
            toggleActions: "play none none none",
        },
    })
    .to(".container-global-text-bienvenue h2", {
        yPercent: -10,
        xPercent: -220,
        duration: 5,
        ease: "linear.inOut",
        willChange: "transform",
        scale: 1,
    })
    .to(".container-global-text-bienvenue h2", {
        yPercent: 10,
        xPercent: -220,
        duration: 10,
        ease: "back.inOut(1)",
        willChange: "transform",    
        scale: 0.5,
    });
}

/**
 * Crée l'animation de splitting pour large desktop
 * @param {Array} selection - Résultat de Splitting
 * @returns {Object} - L'animation GSAP
 */
export function createLargeDesktopSplittingAnimation(selection) {
    return gsap.fromTo(
        selection[0].chars,
        {
            opacity: 0,
            y: 350,
            rotationX: 0,
        },
        {
            opacity: 1,
            y: 0,
            rotationX: -140,
            duration: 3,
            stagger: 3,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: ".h3-in-my-world",    
                endTrigger: ".content-text-bienvenue",                   
                start: "top 90%",
                end: "bottom 50%",
                toggleActions: "play none none reverse",
                scrub: 1.5,
            },
        }
    );
}

/**
 * Crée l'animation "In my world" pour large desktop
 * @param {Object} elements - Les éléments DOM bindés
 * @returns {Object} - L'animation GSAP
 */
export function createLargeDesktopInMyWorldAnimation(elements) {
    return gsap.timeline({
        scrollTrigger: {
            trigger: ".h2-welcome",    
            start: "top 0%",
            endTrigger: ".h3-in-my-world",
            end: "bottom 95%",
            scrub: 3,
            toggleActions: "play none none none",
        },
    })
    .set(".h3-in-my-world", {
        opacity: 0,
        y: 160,
        z: 0,
        scale: 0,
        duration: 2,
    })
    .to(".h3-in-my-world", {
        opacity: 1,
        y: -540,
        z: 0,
        duration: 4,
        ease: "elastic.out(0.1, 0.1)",
        scale: 1,
    })
    .to(".h3-in-my-world", {
         z: -1000,
         y: -200,
         duration:1.5,
         ease: "linear.inOut",
         onComplete: () => console.log("Animation large desktop in my world end"),
    })
    // .to(".h3-in-my-world", {
    //     opacity: 1,
    //     scale: 1,
    //     duration: 1.4,
    //     ease: "linear.Out",
    //     pin: true,
    // });
}

/**
 * Crée toutes les animations pour xl desktop
 * @param {Object} elements - Les éléments DOM bindés
 * @param {Array} selection - Résultat de Splitting
 * @returns {Object} - Objet contenant toutes les animations
 */
export function createXlDesktopAnimations(elements, selection) {
    return {
        titleAnimation: createXlDesktopTitleAnimation(elements),
        splittingAnimation: createXlDesktopSplittingAnimation(selection),
        timelineInMyWorld: createXlDesktopInMyWorldAnimation(elements)
    };
}

/**
 * Crée l'animation du titre "Welcome" pour xl desktop
 * @param {Object} elements - Les éléments DOM bindés
 * @returns {Object} - L'animation GSAP
 */
export function createXlDesktopTitleAnimation(elements) {
    return gsap.timeline({
        scrollTrigger: {
            trigger: elements.elementOfTitle.container,
            start: "top 0%",
            endTrigger: elements.elementOfTitle.container,
            end: "bottom 20%",
            scrub: 0.3,
            toggleActions: "play none none none",
        },
    })
    .to(".container-global-text-bienvenue h2", {
        y: 180,
        x: 2600,
        duration: 5,
        ease: "linear.inOut",
        willChange: "transform",
        scale: 1,
    })
    .to(".container-global-text-bienvenue h2", {
        y: 300,
        x: 4000,
        duration: 10,
        ease: "back.inOut(1)",
        willChange: "transform",    
        scale: 0.5,
    });
}

/**
 * Crée l'animation de splitting pour xl desktop
 * @param {Array} selection - Résultat de Splitting
 * @returns {Object} - L'animation GSAP
 */
export function createXlDesktopSplittingAnimation(selection) {
    return gsap.fromTo(
        selection[0].chars,
        {
            opacity: 0,
            y: 400,
            rotationX: 0,
        },
        {
            opacity: 1,
            y: 0,
            rotationX: -160,
            duration: 3.5,
            stagger: 3.5,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: ".h2-welcome",    
                endTrigger: ".content-text-bienvenue",                   
                start: "top 10%",
                end: "bottom 50%",
                toggleActions: "play none none reverse",
                scrub: 1.8,
            },
        }
    );
}

/**
 * Crée l'animation "In my world" pour xl desktop
 * @param {Object} elements - Les éléments DOM bindés
 * @returns {Object} - L'animation GSAP
 */
export function createXlDesktopInMyWorldAnimation(elements) {
    return gsap.timeline({
        scrollTrigger: {
            trigger: elements.elementOfTitle.bordure,    
            start: "top ",
            endTrigger: elements.elementOfTitle.bordure,
            end: "bottom ",
            scrub: 1.4,
        },
    })
    .fromTo(".h3-in-my-world", 
        {
            opacity: 0,
            y: 1000,
            scale: 0,
        },
        {
            opacity: 0.5,
            y: -180,
            duration: 0.8,
            ease: "linear.inOut",
            scale: 1,
        }
    )
    .to(".h3-in-my-world", {
        opacity: 1,
        scale: 0.8,
        duration: 1.4,
        ease: "power2.out",
    })
    .to(".h3-in-my-world", {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
    });
}

/**
 * Initialise les animations selon la taille d'écran
 * @param {string} currentSize - La taille d'écran actuelle
 * @param {Object} elements - Les éléments DOM bindés
 * @param {Array} selection - Résultat de Splitting
 * @returns {Object} - Objet contenant toutes les animations
 */
export function initWelcomeAnimations(currentSize, elements, selection) {
    switch (currentSize) {
        case 'smallMobile':
            return {
                titleAnimation: createSmallMobileTitleAnimation(elements),
                splittingAnimation: createSmallMobileSplittingAnimation(selection),
                timelineInMyWorld: createSmallMobileInMyWorldAnimation(elements)
            };
        case 'mobile':
            return createMobileAnimations(elements, selection);
        case 'tablet':
            return createTabletAnimations(elements, selection);
        case 'desktop':
            return createDesktopAnimations(elements, selection);
        case 'largeDesktop':
            return createLargeDesktopAnimations(elements, selection);
        case 'xlDesktop':
            return createXlDesktopAnimations(elements, selection);
        default:
            return {};
    }
}

/**
 * Nettoie toutes les animations
 * @param {Object} animations - Objet contenant les animations
 */
export function cleanupWelcomeAnimations(animations) {
    if (animations.titleAnimation) animations.titleAnimation.kill();
    if (animations.splittingAnimation) animations.splittingAnimation.kill();
    if (animations.timelineInMyWorld) animations.timelineInMyWorld.kill();
}
