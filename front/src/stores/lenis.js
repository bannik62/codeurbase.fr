import { writable } from 'svelte/store';
import Lenis from 'lenis';

let lenisInstance = null;

export const lenis = writable(null);

export function initLenis() {
    lenisInstance = new Lenis({
        duration: 5, // ✅ PLUS LENT : 3 → 5 (plus la valeur est élevée, plus c'est lent)
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        smooth: true,
        mouseMultiplier: 90, // ✅ PLUS LENT : 250 → 150 (plus la valeur est basse, plus c'est lent)
        smoothTouch: true, // ✅ ACTIVÉ pour mobile
        touchMultiplier: 0.8, // ✅ PLUS LENT : 2 → 1 (plus la valeur est basse, plus c'est lent)
    });
    
    lenis.set(lenisInstance);
    return lenisInstance;
}

export function stopLenis() {
    if (lenisInstance) {
        lenisInstance.stop();
    }
}

export function startLenis() {
    if (lenisInstance) {
        lenisInstance.start();
    }
}

export function destroyLenis() {
    if (lenisInstance) {
        lenisInstance.destroy();
        lenisInstance = null;
        lenis.set(null);
    }
}
