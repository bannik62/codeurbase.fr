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
    },
    elementOfTechno: {
        technoContainer: null
    }
});

// Store dérivé pour vérifier si tous les modules sont prêts
export const isElementsReady = derived(elementsStore, $elements => {
    return Object.values($elements).every(module => 
        Object.values(module).some(el => el !== null && el !== undefined)
    );
});

// Store dérivé pour vérifier si un module spécifique est prêt
export const isModuleReady = (moduleName) => {
    return derived(elementsStore, $elements => {
        const module = $elements[moduleName];
        if (!module) return false;
        return Object.values(module).some(el => el !== null && el !== undefined);
    });
};
