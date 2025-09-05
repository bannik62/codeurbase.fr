import { writable, derived, get } from 'svelte/store';

// ===== CONFIGURATION =====
const CONFIG = {
    TRIGGER_THRESHOLD: 92,        // Seuil pour déclencher (92%)
    RESET_THRESHOLD: 10,          // Seuil pour reset (< 10%)
    MESSAGE_DURATION: 2500,       // Durée du message (2s)
    DETECTOR_DURATION: 2500       // Durée du composant (4s)
};

// ===== MESSAGES =====
const MESSAGES = {
    WAITING: '',
    ACTIVATED: 'DETECTOR ACTIVATED NAVIGATION SCROOL BLOCKED',
    FINISHED: 'DETECTOR AS DETECTED LIFE NAVIGATION SCROOL UNBLOCKED'
};

// ===== COULEURS =====
const COLORS = {
    WAITING: 'orange',
    ACTIVATED: 'green',
    FINISHED: 'red'
};

// ===== ÉTAT SIMPLE =====
export const detectionStore = writable({
    phase: 'waiting',              // 'waiting' | 'activated' | 'detector' | 'finished'
    visibilityPercentage: 0,
    showMessage: false,
    showDetector: false,
    hasTriggered: false,           // Simple flag pour éviter les redéclenchements
    lastScrollY: 0,                // Position de scroll précédente
    isScrollingDown: true,         // Direction du scroll
    // === NOUVEAUX ÉTATS POUR LA BARRE DE LOADING ===
    showLoading: false,            // Afficher la barre de loading
    loadingProgress: 0,            // Progression du loading (0-100)
    loadingDuration: 3000,         // Durée totale du loading (3s)
    loadingInterval: null          // Référence à l'intervalle du loading
});

// ===== ACTIONS SIMPLES =====
export const detectionActions = {
    // Mettre à jour la visibilité et détecter la direction
    updateVisibility: (percentage, currentScrollY) => {
        detectionStore.update(state => {
            const isScrollingDown = currentScrollY > state.lastScrollY;
            return {
                ...state,
                visibilityPercentage: percentage,
                lastScrollY: currentScrollY,
                isScrollingDown: isScrollingDown
            };
        });
    },

    // Déclencher l'animation
    startSequence: () => {
        const currentState = get(detectionStore);
        
        if (currentState.hasTriggered) {
            console.log('🚫 Animation already triggered - ignoring');
            return;
        }
        
        console.log('🎬 Starting detection sequence');
        
        // Bloquer le scroll simplement
        document.body.style.overflow = 'hidden';
        
        // Phase 1: Message
        detectionStore.update(state => ({
            ...state,
            phase: 'activated',
            showMessage: true,
            hasTriggered: true
        }));

        // Phase 2: Barre de loading
        setTimeout(() => {
            detectionActions.startLoading();
        }, CONFIG.MESSAGE_DURATION - 1000); // Commencer 1 seconde avant la fin du message
    },

    // Démarrer la barre de loading
    startLoading: () => {
        console.log('⏳ Starting loading bar');
        
        detectionStore.update(state => ({
            ...state,
            showMessage: false,
            phase: 'detector',
            showDetector: true,
            showLoading: true,
            loadingProgress: 0
        }));

        // Démarrer l'animation de la barre de loading
        const startTime = Date.now();
        const duration = 5000; // 3 secondes
        const updateInterval = 16; // ~60fps

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min((elapsed / duration) * 100, 100);
            
            detectionStore.update(state => ({
                ...state,
                loadingProgress: progress
            }));

            // Arrêter quand terminé
            if (progress >= 100) {
                clearInterval(interval);
                detectionActions.finishLoading();
            }
        }, updateInterval);

        // Sauvegarder la référence de l'intervalle
        detectionStore.update(state => ({
            ...state,
            loadingInterval: interval
        }));
    },

    // Terminer la barre de loading
    finishLoading: () => {
        console.log('✅ Loading bar finished');
        
        // Nettoyer l'intervalle
        const currentState = get(detectionStore);
        if (currentState.loadingInterval) {
            clearInterval(currentState.loadingInterval);
        }
        
        detectionStore.update(state => ({
            ...state,
            showLoading: false,
            showDetector: true,
            loadingProgress: 100,
            loadingInterval: null
        }));
    },

    // Terminer l'animation
    finishSequence: () => {
        console.log('🏁 Finishing detection sequence');
        
        // Nettoyer l'intervalle de loading s'il existe
        const currentState = get(detectionStore);
        if (currentState.loadingInterval) {
            clearInterval(currentState.loadingInterval);
        }
        
        // Débloquer le scroll
        document.body.style.overflow = '';
        
        detectionStore.update(state => ({
            ...state,
            phase: 'finished',
            showMessage: true,        // Afficher le message final
            showDetector: false,
            showLoading: false,
            loadingInterval: null
        }));
    },

    // Reset (seulement si l'utilisateur sort de la section)
    reset: () => {
        console.log('🔄 Reset - ready for new animation');
        
        // Nettoyer l'intervalle de loading s'il existe
        const currentState = get(detectionStore);
        if (currentState.loadingInterval) {
            clearInterval(currentState.loadingInterval);
        }
        
        // Débloquer le scroll au cas où
        document.body.style.overflow = '';
        
        detectionStore.update(state => ({
            ...state,
            phase: 'waiting',
            showMessage: false,
            showDetector: false,
            showLoading: false,
            loadingProgress: 0,
            visibilityPercentage: 0,
            hasTriggered: false,
            loadingInterval: null
        }));
    }
};

// ===== STORES DÉRIVÉS =====
export const statusMessage = derived(detectionStore, $store => {
    const { phase } = $store;
    switch (phase) {
        case 'activated': return MESSAGES.ACTIVATED;
        case 'finished': return MESSAGES.FINISHED;
        default: return MESSAGES.WAITING;
    }
});

export const statusColor = derived(detectionStore, $store => {
    const { phase } = $store;
    return COLORS[phase.toUpperCase()] || COLORS.WAITING;
});

export const canTrigger = derived(detectionStore, $store => {
    return $store.phase === 'waiting';
});

// ===== FONCTION DE DÉTECTION SIMPLE =====
export const checkDetection = (percentage) => {
    const currentState = get(detectionStore);
    const { phase, hasTriggered, isScrollingDown } = currentState;
    
    // Reset si l'utilisateur sort de la section
    if (percentage < CONFIG.RESET_THRESHOLD && phase !== 'waiting') {
        console.log('🔄 User left section - resetting');
        detectionActions.reset();
        return;
    }
    
    // Déclencher SEULEMENT si l'utilisateur descend ET arrive dans la section
    if (percentage >= CONFIG.TRIGGER_THRESHOLD && phase === 'waiting' && !hasTriggered && isScrollingDown) {
        console.log('🎬 User scrolling down and entered section - starting sequence');
        detectionActions.startSequence();
    } else if (percentage >= CONFIG.TRIGGER_THRESHOLD && phase === 'waiting' && !hasTriggered && !isScrollingDown) {
        console.log('🚫 User scrolling up - animation blocked');
    }
};