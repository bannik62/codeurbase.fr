import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Crée les animations pour small mobile
 * @param {string} currentSize - La taille d'écran actuelle
 * @returns {Object} - Objet contenant les animations
 */
export function createSmallMobileBlogAnimations(currentSize) {
    // Animation pour le titre du blog
    const blogTitleAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: "#blog-section",
            start: "top 80%",
            end: "bottom 20%",
            scrub: 0.3,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".blog-title", {
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
    .fromTo(".blog-description", {
        opacity: 0,
        y: 30,
    }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
    }, "-=0.3");

    // Animation pour les articles
    const blogArticlesAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: ".blog-articles",
            start: "top 80%",
            end: "bottom 20%",
            scrub: 0.4,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".blog-card", {
        opacity: 0,
        y: 40,
        scale: 0.9,
    }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
    });

    return {
        blogTitleAnimation,
        blogArticlesAnimation
    };
}

/**
 * Crée les animations pour mobile
 * @param {string} currentSize - La taille d'écran actuelle
 * @returns {Object} - Objet contenant les animations
 */
export function createMobileBlogAnimations(currentSize) {
    // Animation pour le titre du blog
    const blogTitleAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: "#blog-section",
            start: "top 75%",
            end: "bottom 25%",
            scrub: 0.4,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".blog-title", {
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
    .fromTo(".blog-description", {
        opacity: 0,
        y: 40,
    }, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
    }, "-=0.4");

    // Animation pour les articles
    const blogArticlesAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: ".blog-articles",
            start: "top 75%",
            end: "bottom 25%",
            scrub: 0.5,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".blog-card", {
        opacity: 0,
        y: 50,
        scale: 0.85,
    }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        stagger: 0.25,
        ease: "power2.out",
    });

    return {
        blogTitleAnimation,
        blogArticlesAnimation
    };
}

/**
 * Crée les animations pour tablette
 * @param {string} currentSize - La taille d'écran actuelle
 * @returns {Object} - Objet contenant les animations
 */
export function createTabletBlogAnimations(currentSize) {
    // Animation pour le titre du blog
    const blogTitleAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: "#blog-section",
            start: "top 70%",
            end: "bottom 30%",
            scrub: 0.5,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".blog-title", {
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
    .fromTo(".blog-description", {
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

    // Animation pour les articles
    const blogArticlesAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: ".blog-articles",
            start: "top 70%",
            end: "bottom 30%",
            scrub: 0.6,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".blog-card", {
        opacity: 0,
        y: 60,
        scale: 0.8,
        rotationY: -15,
    }, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationY: 0,
        duration: 1.2,
        stagger: 0.3,
        ease: "power2.out",
    });

    return {
        blogTitleAnimation,
        blogArticlesAnimation
    };
}

/**
 * Crée les animations pour desktop
 * @param {string} currentSize - La taille d'écran actuelle
 * @returns {Object} - Objet contenant les animations
 */
export function createDesktopBlogAnimations(currentSize) {
    // Animation pour le titre du blog
    const blogTitleAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: "#blog-section",
            start: "top 65%",
            end: "bottom 35%",
            scrub: 0.6,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".blog-title", {
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
    .fromTo(".blog-description", {
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

    // Animation pour les articles
    const blogArticlesAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: ".blog-articles",
            start: "top 65%",
            end: "bottom 35%",
            scrub: 0.7,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".blog-card", {
        opacity: 0,
        y: 80,
        scale: 0.7,
        rotationY: -20,
        rotationX: -30,
    }, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationY: 0,
        rotationX: 0,
        duration: 1.5,
        stagger: 0.35,
        ease: "power2.out",
    });

    return {
        blogTitleAnimation,
        blogArticlesAnimation
    };
}

/**
 * Crée les animations pour large desktop
 * @param {string} currentSize - La taille d'écran actuelle
 * @returns {Object} - Objet contenant les animations
 */
export function createLargeDesktopBlogAnimations(currentSize) {
    // Animation pour le titre du blog
    const blogTitleAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: "#blog-section",
            start: "top 60%",
            end: "bottom 40%",
            scrub: 0.7,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".blog-title", {  
        opacity: 0,
        y: 150,
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
        duration: 2,
        ease: "back.out(1.7)",
    })
    .fromTo(".blog-description", {
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
        duration: 1.8,
        ease: "power2.out",
    }, "-=0.7");

    // Animation pour les articles
    const blogArticlesAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: ".blog-articles",
            start: "top 60%",
            end: "bottom 40%",
            scrub: 0.8,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".blog-card", {
        opacity: 0,
        y: 100,
        scale: 0.6,
        rotationY: -25,
        rotationX: -45,
        z: -75,
    }, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationY: 0,
        rotationX: 0,
        z: 0,
        duration: 1.8,
        stagger: 0.3,
        ease: "power2.out",
    });

    return {
        blogTitleAnimation,
        blogArticlesAnimation
    };
}

/**
 * Crée les animations pour xl desktop
 * @param {string} currentSize - La taille d'écran actuelle
 * @returns {Object} - Objet contenant les animations
 */
export function createXlDesktopBlogAnimations(currentSize) {
    // Animation pour le titre du blog
    const blogTitleAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: "#blog-section",
            start: "top 55%",
            end: "bottom 45%",
            scrub: 0.8,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".blog-title", {
        opacity: 0,
        y: 200,
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
    .fromTo(".blog-description", {
        opacity: 0,
        y: 120,
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

    // Animation pour les articles
    const blogArticlesAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: ".blog-articles",
            start: "top 55%",
            end: "bottom 45%",
            scrub: 0.9,
            toggleActions: "play none none reverse",
        },
    })
    .fromTo(".blog-card", {
        opacity: 0,
        y: 120,
        scale: 0.5,
        rotationY: -30,
        rotationX: -60,
        z: -100,
    }, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationY: 0,
        rotationX: 0,
        z: 0,
        duration: 2,
        stagger: 0.45,
        ease: "power2.out",
    });

    return {
        blogTitleAnimation,
        blogArticlesAnimation
    };
}

/**
 * Initialise les animations selon la taille d'écran
 * @param {string} currentSize - La taille d'écran actuelle
 * @returns {Object} - Objet contenant toutes les animations
 */
export function initBlogAnimations(currentSize) {
    switch (currentSize) {
        case 'smallMobile':
            return createSmallMobileBlogAnimations(currentSize);
        case 'mobile':
            return createMobileBlogAnimations(currentSize);
        case 'tablet':
            return createTabletBlogAnimations(currentSize);
        case 'desktop':
            return createDesktopBlogAnimations(currentSize);
        case 'largeDesktop':
            return createLargeDesktopBlogAnimations(currentSize);
        case 'xlDesktop':
            return createXlDesktopBlogAnimations(currentSize);
        default:
            return {};
    }
}

/**
 * Nettoie toutes les animations
 * @param {Object} animations - Objet contenant les animations
 */
export function cleanupBlogAnimations(animations) {
    if (animations.blogTitleAnimation) animations.blogTitleAnimation.kill();
    if (animations.blogArticlesAnimation) animations.blogArticlesAnimation.kill();
}

