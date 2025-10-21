import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Crée les animations pour small mobile
 * @param {string} currentSize - La taille d'écran actuelle
 * @returns {Object} - Objet contenant les animations
 */
export function createSmallMobileChatAnimations(currentSize) {
    // Animation pour le titre du chat
    const chatTitleAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: "#chat-mvp",
            start: "top 80%",
            end: "bottom 20%",
            scrub: 0.3,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".chat-title", {
        opacity: 0,
        y: 50,
        scale: 0.8,
    }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "back.out(1.7)",
    })
    .fromTo(".chat-description", {
        opacity: 0,
        y: 30,
    }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
    }, "-=0.3");

    // Animation pour le contenu du chat
    const chatContentAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: ".chat-messenger",
            start: "top 80%",
            end: "bottom 20%",
            scrub: 0.4,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".chat-messages", {
        opacity: 0,
        x: -30,
    }, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out",
    })
    .fromTo(".chat-input", {
        opacity: 0,
        x: -30,
    }, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out",
    }, "-=0.4");

    return {
        chatTitleAnimation,
        chatContentAnimation
    };
}

/**
 * Crée les animations pour mobile
 * @param {string} currentSize - La taille d'écran actuelle
 * @returns {Object} - Objet contenant les animations
 */
export function createMobileChatAnimations(currentSize) {
    // Animation pour le titre du chat
    const chatTitleAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: "#chat-mvp",
            start: "top 75%",
            end: "bottom 25%",
            scrub: 0.4,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".chat-title", {
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
    .fromTo(".chat-description", {
        opacity: 0,
        y: 40,
    }, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
    }, "-=0.4");

    // Animation pour le contenu du chat
    const chatContentAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: ".chat-messenger",
            start: "top 75%",
            end: "bottom 25%",
            scrub: 0.5,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".chat-messages", {
        opacity: 0,
        x: -40,
    }, {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "power2.out",
    })
    .fromTo(".chat-input", {
        opacity: 0,
        x: -40,
    }, {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "power2.out",
    }, "-=0.5");

    return {
        chatTitleAnimation,
        chatContentAnimation
    };
}

/**
 * Crée les animations pour tablette
 * @param {string} currentSize - La taille d'écran actuelle
 * @returns {Object} - Objet contenant les animations
 */
export function createTabletChatAnimations(currentSize) {
    // Animation pour le titre du chat
    const chatTitleAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: "#chat-mvp",
            start: "top 70%",
            end: "bottom 30%",
            scrub: 0.5,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".chat-title", {
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
    .fromTo(".chat-description", {
        opacity: 0,
        y: 50,
        rotationX: -45,
    }, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 1.2,
        ease: "power2.out",
    }, "-=0.5");

    // Animation pour le contenu du chat
    const chatContentAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: ".chat-messenger",
            start: "top 70%",
            end: "bottom 30%",
            scrub: 0.6,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".chat-messages", {
        opacity: 0,
        x: -50,
        rotationX: -30,
    }, {
        opacity: 1,
        x: 0,
        rotationX: 0,
        duration: 1.2,
        ease: "power2.out",
    })
    .fromTo(".chat-input", {
        opacity: 0,
        x: -50,
        rotationX: -30,
    }, {
        opacity: 1,
        x: 0,
        rotationX: 0,
        duration: 1.2,
        ease: "power2.out",
    }, "-=0.6");

    return {
        chatTitleAnimation,
        chatContentAnimation
    };
}

/**
 * Crée les animations pour desktop
 * @param {string} currentSize - La taille d'écran actuelle
 * @returns {Object} - Objet contenant les animations
 */
export function createDesktopChatAnimations(currentSize) {
    // Animation pour le titre du chat
    const chatTitleAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: "#chat-mvp",
            start: "top 65%",
            end: "bottom 35%",
            scrub: 0.6,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".chat-title", {
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
    .fromTo(".chat-description", {
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
    }, "-=0.6");

    // Animation pour le contenu du chat
    const chatContentAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: ".chat-messenger",
            start: "top 65%",
            end: "bottom 35%",
            scrub: 0.7,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".chat-messages", {
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
    })
    .fromTo(".chat-input", {
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
    }, "-=0.7");

    return {
        chatTitleAnimation,
        chatContentAnimation
    };
}

/**
 * Crée les animations pour large desktop
 * @param {string} currentSize - La taille d'écran actuelle
 * @returns {Object} - Objet contenant les animations
 */
export function createLargeDesktopChatAnimations(currentSize) {
    // Animation pour le titre du chat
    const chatTitleAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: "#chat-mvp",
            start: "top 10%",
            end: "bottom 80%",
            scrub: 0.7,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".chat-title", {
        opacity: 0,
        y: 250,
        scale: 0.4,
        rotationX: -150,
        rotationY: 20,
        z: -200,
    }, {
        opacity: 1,
        y: 150,
        scale: 1.2,
        rotationX: 0,
        rotationY: 0,
        z: 0,
        duration: 1,
        ease: "back.out(1.7)",
    })
    .fromTo(".chat-description", {
        opacity: 0,
        y: 150,
        rotationX: -80,
        rotationY: 15,
        z: -100,
    }, {
        opacity: 1,
        y: -50,
        rotationX: 0,
        rotationY: 0,
        z: 0,
        duration: 1,
        ease: "power2.out",
    }, "-=0.7");

    // Animation pour le contenu du chat
    const chatContentAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: "h2",
            start: "top 90%",
            end: "bottom 10%",
            scrub: 0.8,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".chat-messages", {
        opacity: 0,
        x: -80,
        rotationX: -60,
        rotationY: 10,
        z: -75,
    }, {
        opacity: 1,
        x: 0,
        rotationX: 0,
        rotationY: 0,
        z: 0,
        duration: 1.8,
        ease: "power2.out",
    })
    .fromTo(".chat-input", {
        opacity: 0,
        x: -80,
        rotationX: -60,
        rotationY: 10,
        z: -75,
    }, {
        opacity: 1,
        x: 0,
        rotationX: 0,
        rotationY: 0,
        z: 0,
        duration: 1.8,
        ease: "power2.out",
    }, "-=0.8");

    return {
        chatTitleAnimation,
        chatContentAnimation
    };
}

/**
 * Crée les animations pour xl desktop
 * @param {string} currentSize - La taille d'écran actuelle
 * @returns {Object} - Objet contenant les animations
 */
export function createXlDesktopChatAnimations(currentSize) {
    // Animation pour le titre du chat
    const chatTitleAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: "#chat-mvp",
            start: "top 55%",
            end: "bottom 45%",
            scrub: 0.8,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".chat-title", {
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
    .fromTo(".chat-description", {
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
    }, "-=0.8");

    // Animation pour le contenu du chat
    const chatContentAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: ".chat-messenger",
            start: "top 55%",
            end: "bottom 45%",
            scrub: 0.9,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".chat-messages", {
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
    })
    .fromTo(".chat-input", {
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
    }, "-=0.9");

    return {
        chatTitleAnimation,
        chatContentAnimation
    };
}

/**
 * Initialise les animations selon la taille d'écran
 * @param {string} currentSize - La taille d'écran actuelle
 * @returns {Object} - Objet contenant toutes les animations
 */
export function initChatAnimations(currentSize) {
    switch (currentSize) {
        case 'smallMobile':
            return createSmallMobileChatAnimations(currentSize);
        case 'mobile':
            return createMobileChatAnimations(currentSize);
        case 'tablet':
            return createTabletChatAnimations(currentSize);
        case 'desktop':
            return createDesktopChatAnimations(currentSize);
        case 'largeDesktop':
            return createLargeDesktopChatAnimations(currentSize);
        case 'xlDesktop':
            return createXlDesktopChatAnimations(currentSize);
        default:
            return {};
    }
}

/**
 * Nettoie toutes les animations
 * @param {Object} animations - Objet contenant les animations
 */
export function cleanupChatAnimations(animations) {
    if (animations.chatTitleAnimation) animations.chatTitleAnimation.kill();
    if (animations.chatContentAnimation) animations.chatContentAnimation.kill();
}
