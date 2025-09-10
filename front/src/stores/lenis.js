import { writable } from 'svelte/store';
import Lenis from 'lenis';

let lenisInstance = null;

export const lenis = writable(null);

export function initLenis() {
    lenisInstance = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
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
