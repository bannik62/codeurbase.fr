import { writable, derived } from 'svelte/store';

export const elementsStore = writable({
    elementOfTitle: {
        container: null,
        bordure: null,
        title: null,
        gyroscope: null,
        containerTitleScreenAndBalayage: null
    },
    elementOfBienvenu: {
        containerGlobalTextBienvenue: null,
        h2Welcome: null,
        h3InMyWorld: null,
        contentTextBienvenue: null,
        pBienvenue: null,
        h3EnCoursDeConstruction: null
    },
    elementOfSaturne: {
        // À définir selon les éléments de Saturne
    }
});

// Store dérivé pour vérifier si tous les modules sont prêts
export const isElementsReady = derived(elementsStore, $elements => {
    return Object.values($elements).every(module => 
        Object.values(module).some(el => el !== null)
    );
});
