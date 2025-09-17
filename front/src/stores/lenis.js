import { writable } from 'svelte/store';
import Lenis from 'lenis';

let lenisInstance = null;

export const lenis = writable(null);

export function initLenis() {
    lenisInstance = new Lenis({
        duration: 3,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        smooth: true,
        mouseMultiplier: 250,
        smoothTouch: true, // ✅ ACTIVÉ pour mobile
        touchMultiplier: 2, // Réduit pour mobile (plus fluide)
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
