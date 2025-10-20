import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Crée les animations pour small mobile
 * @param {string} currentSize - La taille d'écran actuelle
 * @returns {Object} - Objet contenant les animations
 */
export function createSmallMobileWelcomeToAnimations(currentSize) {
    // Animation pour h2 "CodeurBase"
    const mainTitleAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: ".main-title",
            start: "top 20%",
            end: "bottom 10%",
            scrub: 0.2,
            toggleActions: "play none none reverse",
            // markers: true,
        },
    })
    .fromTo(".main-title", {
        opacity: 0,
        y: 70,
        x: 0,
        scale: 1,
    }, {
        opacity: 1,
        y:-10,
        x: 0,
        scale: 1,
        duration: 1,
        ease: "back.out(1.7)",
    });

    // Animation pour la description
    const descriptionAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: ".main-description",
            start: "top 40%",
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".main-description", {
        opacity: 0,
        y: 30,
    }, {
        opacity: 1,
        y: 0,
        x: 45,
        duration: 1,
        scale: 1.2,
        ease: "power2.out",
    });

    // Animation pour les feature-items
    const featureItemsAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: ".feature-item",
            start: "top 95%",
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".feature-item", {
        opacity: 0,
        y: 30,
    }, {
        opacity: 1,
        y: 0,
        x: 20,
        duration: 1,
        ease: "power2.out",
        stagger: 0.1,
    });

    // Animation pour h3 "Objectifs" + ses paragraphes
    const objectivesAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: ".objectives",
            start: "top 80%",
            end: "bottom 20%",
            scrub: 0.4,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".objectives-title", {
        opacity: 0,
        y: 150,
        scale: 0,
    }, {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        duration: 1.2,
        ease: "back.out(1.7)",
    })
    .fromTo(".objective-item", {
        opacity: 0,
        x: -30,
    }, {
        opacity: 1,
        x: 25,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.1,
    }, "-=0.4");

    // Animation pour h3 "Technologies utilisées" + ses sections
    const techAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: ".tech-stack",
            start: "top 80%",
            end: "bottom 20%",
            scrub: 0.2,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".h3-after_objectives", {
        opacity: 0,
        y: 40,
        scale: 0.9,
    }, {
        opacity: 1,
        y: 0,
        x: 15,
        scale: 1,
        duration: 1.2,
        ease: "back.out(1.7)",
    })
    .fromTo(".tech-stack", {
        opacity: 0,
        y: 30,
    }, {
        opacity: 1,
        y: 0,
        x: 20,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.15,
    }, "-=0.5");

    return {
        mainTitleAnimation,
        descriptionAnimation,
        featureItemsAnimation,
        objectivesAnimation,
        techAnimation
    };
}

/**
 * Crée les animations pour mobile
 * @param {string} currentSize - La taille d'écran actuelle
 * @returns {Object} - Objet contenant les animations
 */
export function createMobileWelcomeToAnimations(currentSize) {
    // Animation pour h2 "CodeurBase" + son contenu
    const codeurbaseAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: "#codeurbase",
            start: "top 75%",
            end: "bottom 25%",
            scrub: 0.4,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".main-title", {
        opacity: 0,
        y: 60,
        scale: 0.7,
    }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "back.out(1.7)",
    })
    .fromTo(".main-description, .feature-item", {
        opacity: 0,
        y: 40,
    }, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        stagger: 0.1,
    }, "-=0.4");

    // Animation pour h3 "Objectifs" + ses paragraphes
    const objectivesAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: ".objectives",
            start: "top 75%",
            end: "bottom 25%",
            scrub: 0.5,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".objectives-title", {
        opacity: 0,
        y: 50,
        scale: 0.8,
    }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.4,
        ease: "back.out(1.7)",
    })
    .fromTo(".objective-item", {
        opacity: 0,
        x: -40,
    }, {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "power2.out",
        stagger: 0.1,
    }, "-=0.5");

    // Animation pour h3 "Technologies utilisées" + ses sections
    const techAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: ".tech-stack",
            start: "top 75%",
            end: "bottom 25%",
            scrub: 0.6,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".h3-after_objectives", {
        opacity: 0,
        y: 50,
        scale: 0.8,
    }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.4,
        ease: "back.out(1.7)",
    })
    .fromTo(".tech-stack", {
        opacity: 0,
        y: 40,
    }, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        stagger: 0.15,
    }, "-=0.6");

    return {
        codeurbaseAnimation,
        objectivesAnimation,
        techAnimation
    };
}

/**
 * Crée les animations pour tablette
 * @param {string} currentSize - La taille d'écran actuelle
 * @returns {Object} - Objet contenant les animations
 */
export function createTabletWelcomeToAnimations(currentSize) {
    // Animation pour h2 "CodeurBase" + son contenu
    const codeurbaseAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: "#codeurbase",
            start: "top 70%",
            end: "bottom 30%",
            scrub: 0.5,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".main-title", {
        opacity: 0,
        y: 80,
        scale: 0.6,
        rotationX: -90,
    }, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        duration: 1.5,
        ease: "back.out(1.7)",
    })
    .fromTo(".main-description, .feature-item", {
        opacity: 0,
        y: 50,
        rotationX: -45,
    }, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 1.2,
        ease: "power2.out",
        stagger: 0.1,
    }, "-=0.5");

    // Animation pour h3 "Objectifs" + ses paragraphes
    const objectivesAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: ".objectives",
            start: "top 70%",
            end: "bottom 30%",
            scrub: 0.6,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".objectives-title", {
        opacity: 0,
        y: 60,
        scale: 0.7,
        rotationX: -60,
    }, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        duration: 1.6,
        ease: "back.out(1.7)",
    })
    .fromTo(".objective-item", {
        opacity: 0,
        x: -50,
        rotationX: -30,
    }, {
        opacity: 1,
        x: 0,
        rotationX: 0,
        duration: 1.2,
        ease: "power2.out",
        stagger: 0.1,
    }, "-=0.6");

    // Animation pour h3 "Technologies utilisées" + ses sections
    const techAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: ".tech-stack",
            start: "top 70%",
            end: "bottom 30%",
            scrub: 0.7,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".h3-after_objectives", {
        opacity: 0,
        y: 60,
        scale: 0.7,
        rotationX: -60,
    }, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        duration: 1.6,
        ease: "back.out(1.7)",
    })
    .fromTo(".tech-stack", {
        opacity: 0,
        y: 50,
        rotationX: -30,
    }, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 1.2,
        ease: "power2.out",
        stagger: 0.15,
    }, "-=0.7");

    return {
        codeurbaseAnimation,
        objectivesAnimation,
        techAnimation
    };
}

/**
 * Crée les animations pour desktop
 * @param {string} currentSize - La taille d'écran actuelle
 * @returns {Object} - Objet contenant les animations
 */
export function createDesktopWelcomeToAnimations(currentSize) {
    // Animation pour h2 "CodeurBase" + son contenu
    const codeurbaseAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: "#codeurbase",
            start: "top 65%",
            end: "bottom 35%",
            scrub: 0.6,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".main-title", {
        opacity: 0,
        y: 100,
        scale: 0.5,
        rotationX: -120,
        rotationY: 15,
    }, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        rotationY: 0,
        duration: 1.8,
        ease: "back.out(1.7)",
    })
    .fromTo(".main-description, .feature-item", {
        opacity: 0,
        y: 60,
        rotationX: -60,
        rotationY: 10,
    }, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        rotationY: 0,
        duration: 1.5,
        ease: "power2.out",
        stagger: 0.1,
    }, "-=0.6");

    // Animation pour h3 "Objectifs" + ses paragraphes
    const objectivesAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: ".objectives",
            start: "top 65%",
            end: "bottom 35%",
            scrub: 0.7,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".objectives-title", {
        opacity: 0,
        y: 80,
        scale: 0.6,
        rotationX: -90,
        rotationY: 10,
    }, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        rotationY: 0,
        duration: 1.8,
        ease: "back.out(1.7)",
    })
    .fromTo(".objective-item", {
        opacity: 0,
        x: -60,
        rotationX: -45,
        rotationY: 5,
    }, {
        opacity: 1,
        x: 0,
        rotationX: 0,
        rotationY: 0,
        duration: 1.5,
        ease: "power2.out",
        stagger: 0.1,
    }, "-=0.7");

    // Animation pour h3 "Technologies utilisées" + ses sections
    const techAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: ".tech-stack",
            start: "top 65%",
            end: "bottom 35%",
            scrub: 0.8,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".h3-after_objectives", {
        opacity: 0,
        y: 80,
        scale: 0.6,
        rotationX: -90,
        rotationY: 10,
    }, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        rotationY: 0,
        duration: 1.8,
        ease: "back.out(1.7)",
    })
    .fromTo(".tech-stack", {
        opacity: 0,
        y: 60,
        rotationX: -45,
        rotationY: 5,
    }, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        rotationY: 0,
        duration: 1.5,
        ease: "power2.out",
        stagger: 0.15,
    }, "-=0.8");

    return {
        codeurbaseAnimation,
        objectivesAnimation,
        techAnimation
    };
}

/**
 * Crée les animations pour large desktop
 * @param {string} currentSize - La taille d'écran actuelle
 * @returns {Object} - Objet contenant les animations
 */
export function createLargeDesktopWelcomeToAnimations(currentSize) {
    // Animation du titre (structure alignée avec small)
    const mainTitleAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: ".main-title",
            start: "top 50%",
            end: "bottom 0%",
            scrub: 0.1,
            toggleActions: "play none none reverse",
            // markers: true,
        },
    })
    .fromTo(".main-title", {
        opacity: 0,
        y: 70,
        x: 0,
        scale: 1,
    }, {
        opacity: 1,
        y: 20,
        x: 0,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.7)",
    });

    // Animation de la description (séparée pour éviter les chevauchements)
    const descriptionAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: ".main-description",
            start: "top 50%",
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".main-description", {
        opacity: 0,
        y: 30,
    }, {
        opacity: 1,
        y: 0,
        x: 20,
        duration: 1,
        ease: "power2.out",
    });

    // Animation des feature items (séparée comme small)
    const featureItemsAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: ".feature-item",
            start: "top 80%",
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".feature-item", {
        opacity: 0,
        y: 30,
    }, {
        opacity: 1,
        y: 0,
        x: 20,
        duration: 1,
        ease: "power2.out",
        stagger: 0.1,
    });

    // Animation pour h3 "Objectifs" + ses paragraphes
    const objectivesAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: ".last-feature-item",
            start: "top 60%",
            endTrigger: ".last-p_objectives",
            end: "bottom 0% -1300px",
            scrub: 0.8,
            toggleActions: "play none none reverse",
            // markers: true,
        },
    })
    .fromTo(".objectives-title", {
        opacity: 0,
        y: 150,
        scale: 0.5,
        rotationX: -120,
        rotationY: 15,
        z: -150,
    }, {
        opacity: 1,
        y: 50,
        scale: 1,
        rotationX: 0,
        rotationY: 0,
        z: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
    })
    .fromTo(".objective-item", {
        opacity: 0,
        x: -80,
        rotationX: -60,
        rotationY: 10,
        z: -75,
    }, {
        opacity: 1,
        x: 50,
        rotationX: 0,
        rotationY: 0,
        z: 0,
        duration: 1.8,
        ease: "power2.out",
        stagger: 0.1,
    }, "-=1");

    // Animation pour h3 "Technologies utilisées"------------------------------------------------
    const techTitleAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: ".last-p_objectives",
            start: "top 90%",
            end: "bottom 0%",
            scrub: 0.9,
            toggleActions: "play none none reverse",
            // markers: true,
        },
    })
    .fromTo(".h3-after_objectives", {
        opacity: 0,
        y: 100,
        scale: 0.5,
        rotationX: -120,
        rotationY: 15,
        z: -150,
    }, {
        opacity: 1,
        y: 0,
        scale: 1.4,
        rotationX: 0,
        rotationY: 0,
        z: 0,
        duration: 14,
        ease: "back.out(1.7)",
    });

    // Animation Frontend
    const frontendAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: ".frontend-title",
            start: "top 80%",
            end: "bottom 20%",
            scrub: 0.7,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".frontend-title", {
        opacity: 0,
        y: 60,
        scale: 0.8,
    }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "back.out(1.7)",
    })
    .fromTo(".frontend-stack .tech-item", {
        opacity: 0,
        x: -50,
    }, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.1,
    }, "-=0.4");

    // Animation Backend
    const backendAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: ".backend-title",
            start: "top 80%",
            end: "bottom 20%",
            scrub: 0.7,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".backend-title", {
        opacity: 0,
        y: 60,
        scale: 0.8,
    }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "back.out(1.7)",
    })
    .fromTo(".backend-stack .tech-item", {
        opacity: 0,
        x: -50,
    }, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.1,
    }, "-=0.4");

    // Animation Base de données
    const databaseAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: ".database-title",
            start: "top 80%",
            end: "bottom 20%",
            scrub: 0.7,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".database-title", {
        opacity: 0,
        y: 60,
        scale: 0.8,
    }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "back.out(1.7)",
    })
    .fromTo(".database-stack .tech-item", {
        opacity: 0,
        x: -50,
    }, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.1,
    }, "-=0.4");

    // Animation Outils
    const toolsAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: ".tools-title",
            start: "top 80%",
            end: "bottom 20%",
            scrub: 0.7,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".tools-title", {
        opacity: 0,
        y: 60,
        scale: 0.8,
    }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "back.out(1.7)",
    })
    .fromTo(".tools-stack .tech-item", {
        opacity: 0,
        x: -50,
    }, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.1,
    }, "-=0.4");

    return {
        mainTitleAnimation,
        descriptionAnimation,
        featureItemsAnimation,
        objectivesAnimation,
        techTitleAnimation,
        frontendAnimation,
        backendAnimation,
        databaseAnimation,
        toolsAnimation
    };
}

/**
 * Crée les animations pour xl desktop
 * @param {string} currentSize - La taille d'écran actuelle
 * @returns {Object} - Objet contenant les animations
 */
export function createXlDesktopWelcomeToAnimations(currentSize) {
    // Animation pour h2 "CodeurBase" + son contenu
    const codeurbaseAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: "#codeurbase",
            start: "top 55%",
            end: "bottom 45%",
            scrub: 0.8,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".main-title", {
        opacity: 0,
        y: 150,
        scale: 0.3,
        rotationX: -180,
        rotationY: 25,
        z: -300,
    }, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        rotationY: 0,
        z: 0,
        duration: 2.2,
        ease: "back.out(1.7)",
    })
    .fromTo(".main-description, .feature-item", {
        opacity: 0,
        y: 100,
        rotationX: -100,
        rotationY: 20,
        z: -150,
    }, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        rotationY: 0,
        z: 0,
        duration: 2,
        ease: "power2.out",
        stagger: 0.1,
    }, "-=0.8");

    // Animation pour h3 "Objectifs" + ses paragraphes
    const objectivesAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: ".objectives",
            start: "top 55%",
            end: "bottom 45%",
            scrub: 0.9,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".objectives-title", {
        opacity: 0,
        y: 120,
        scale: 0.4,
        rotationX: -150,
        rotationY: 20,
        z: -200,
    }, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        rotationY: 0,
        z: 0,
        duration: 2.2,
        ease: "back.out(1.7)",
    })
    .fromTo(".objective-item", {
        opacity: 0,
        x: -100,
        rotationX: -80,
        rotationY: 15,
        z: -100,
    }, {
        opacity: 1,
        x: 0,
        rotationX: 0,
        rotationY: 0,
        z: 0,
        duration: 2,
        ease: "power2.out",
        stagger: 0.1,
    }, "-=0.9");

    // Animation pour h3 "Technologies utilisées" + ses sections
    const techAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: ".tech-stack",
            start: "top 55%",
            end: "bottom 45%",
            scrub: 1.0,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".h3-after_objectives", {
        opacity: 0,
        y: 120,
        scale: 0.4,
        rotationX: -150,
        rotationY: 20,
        z: -200,
    }, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        rotationY: 0,
        z: 0,
        duration: 2.2,
        ease: "back.out(1.7)",
    })
    .fromTo(".tech-stack", {
        opacity: 0,
        y: 100,
        rotationX: -80,
        rotationY: 15,
        z: -100,
    }, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        rotationY: 0,
        z: 0,
        duration: 2,
        ease: "power2.out",
        stagger: 0.15,
    }, "-=1.0");

    return {
        codeurbaseAnimation,
        objectivesAnimation,
        techAnimation
    };
}

/**
 * Initialise les animations selon la taille d'écran
 * @param {string} currentSize - La taille d'écran actuelle
 * @returns {Object} - Objet contenant toutes les animations
 */
export function initWelcomeToAnimations(currentSize) {
    switch (currentSize) {
        case 'smallMobile':
            return createSmallMobileWelcomeToAnimations(currentSize);
        case 'mobile':
            return createMobileWelcomeToAnimations(currentSize);
        case 'tablet':
            return createTabletWelcomeToAnimations(currentSize);
        case 'desktop':
            return createDesktopWelcomeToAnimations(currentSize);
        case 'largeDesktop':
            return createLargeDesktopWelcomeToAnimations(currentSize);
        case 'xlDesktop':
            return createXlDesktopWelcomeToAnimations(currentSize);
        default:
            return {};
    }
}

/**
 * Nettoie toutes les animations
 * @param {Object} animations - Objet contenant les animations
 */
export function cleanupWelcomeToAnimations(animations) {
    if (animations.mainTitleAnimation) animations.mainTitleAnimation.kill();
    if (animations.descriptionAnimation) animations.descriptionAnimation.kill();
    if (animations.featureItemsAnimation) animations.featureItemsAnimation.kill();
    if (animations.codeurbaseAnimation) animations.codeurbaseAnimation.kill();
    if (animations.objectivesAnimation) animations.objectivesAnimation.kill();
    if (animations.techTitleAnimation) animations.techTitleAnimation.kill();
    if (animations.frontendAnimation) animations.frontendAnimation.kill();
    if (animations.backendAnimation) animations.backendAnimation.kill();
    if (animations.databaseAnimation) animations.databaseAnimation.kill();
    if (animations.toolsAnimation) animations.toolsAnimation.kill();
}
