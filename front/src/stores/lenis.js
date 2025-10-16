import { writable } from 'svelte/store';
import Lenis from 'lenis';

let lenisInstance = null;
let rafId = null;
let isRafActive = false;

export const lenis = writable(null);

export function initLenis() {
    // Si une instance existe déjà, la retourner
    if (lenisInstance) {
        console.log('[Lenis] Réutilisation de l\'instance existante');
        return lenisInstance;
    }
    
    console.log('[Lenis] Création d\'une nouvelle instance');
    lenisInstance = new Lenis({
        duration: 5, // ✅ PLUS LENT : 3 → 5 (plus la valeur est élevée, plus c'est lent)
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        smooth: true,
        mouseMultiplier: 60, // ✅ PLUS LENT : 250 → 150 (plus la valeur est basse, plus c'est lent)
        smoothTouch: true, // ✅ ACTIVÉ pour mobile
        touchMultiplier: 0.6, // ✅ PLUS LENT : 2 → 1 (plus la valeur est basse, plus c'est lent)
    });
    
    lenis.set(lenisInstance);
    startRaf();
    return lenisInstance;
}

export function getLenis() {
    return lenisInstance;
}

function startRaf() {
    if (isRafActive || !lenisInstance) return;
    
    isRafActive = true;
    function raf(time) {
        if (isRafActive && lenisInstance) {
            lenisInstance.raf(time);
            rafId = requestAnimationFrame(raf);
        }
    }
    rafId = requestAnimationFrame(raf);
    console.log('[Lenis] RAF démarré');
}

function stopRaf() {
    isRafActive = false;
    if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }
    console.log('[Lenis] RAF arrêté');
}

export function stopLenis() {
    if (lenisInstance) {
        lenisInstance.stop();
    }
    stopRaf();
}

export function startLenis() {
    if (lenisInstance) {
        lenisInstance.start();
        startRaf();
    } else {
        // Si pas d'instance, en créer une nouvelle
        console.log('[Lenis] Pas d\'instance, création d\'une nouvelle');
        initLenis();
    }
}

export function destroyLenis() {
    stopRaf();
    if (lenisInstance) {
        lenisInstance.destroy();
        lenisInstance = null;
        lenis.set(null);
    }
    console.log('[Lenis] Instance détruite');
}
