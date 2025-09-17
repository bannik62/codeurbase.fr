import { writable, derived } from 'svelte/store';

// Store centralisé pour les tailles de media queries
export const mediaQueryBreakpoints = {
    smallMobile: 480,
    mobile: 768,
    tablet: 1024,
    desktop: 1400,
    largeDesktop: 1800
};

// Store réactif pour la largeur de l'écran
export const screenWidth = writable(0);

// Store réactif pour la hauteur de l'écran
export const screenHeight = writable(0);

// Stores dérivés pour les détections de taille d'écran
export const isSmallMobile = derived(
    screenWidth,
    $width => $width < mediaQueryBreakpoints.smallMobile
);

export const isMobile = derived(
    screenWidth,
    $width => $width >= mediaQueryBreakpoints.smallMobile && $width < mediaQueryBreakpoints.mobile
);

export const isTablet = derived(
    screenWidth,
    $width => $width >= mediaQueryBreakpoints.mobile && $width < mediaQueryBreakpoints.tablet
);

export const isDesktop = derived(
    screenWidth,
    $width => $width >= mediaQueryBreakpoints.tablet && $width < mediaQueryBreakpoints.desktop
);

export const isLargeDesktop = derived(
    screenWidth,
    $width => $width >= mediaQueryBreakpoints.desktop && $width < mediaQueryBreakpoints.largeDesktop
);

export const isXlDesktop = derived(
    screenWidth,
    $width => $width >= mediaQueryBreakpoints.largeDesktop
);

// Store dérivé pour l'orientation
export const isLandscape = derived(
    [screenWidth, screenHeight],
    ([$width, $height]) => $width > $height
);

// Store dérivé pour l'orientation mobile
export const isMobileLandscape = derived(
    [isMobile, isLandscape],
    ([$isMobile, $isLandscape]) => $isMobile && $isLandscape
);

// Fonction utilitaire pour initialiser le store
export function initMediaQuery() {
    if (typeof window !== 'undefined') {
        // Initialiser avec les valeurs actuelles
        screenWidth.set(window.innerWidth);
        screenHeight.set(window.innerHeight);

        // Listener pour le redimensionnement
        const handleResize = () => {
            screenWidth.set(window.innerWidth);
            screenHeight.set(window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        // Retourner une fonction de nettoyage
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }
    return () => {};
}

// Fonction utilitaire pour obtenir la taille d'écran actuelle
export function getCurrentBreakpoint() {
    if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        if (width < mediaQueryBreakpoints.smallMobile) return 'smallMobile';
        if (width < mediaQueryBreakpoints.mobile) return 'mobile';
        if (width < mediaQueryBreakpoints.tablet) return 'tablet';
        if (width < mediaQueryBreakpoints.desktop) return 'desktop';
        if (width < mediaQueryBreakpoints.largeDesktop) return 'largeDesktop';
        return 'xlDesktop';
    }
    return 'desktop'; // Valeur par défaut pour SSR
}

// Fonction utilitaire pour vérifier si une taille correspond à un breakpoint
export function matchesBreakpoint(breakpoint) {
    if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        switch (breakpoint) {
            case 'smallMobile':
                return width < mediaQueryBreakpoints.smallMobile;
            case 'mobile':
                return width >= mediaQueryBreakpoints.smallMobile && width < mediaQueryBreakpoints.mobile;
            case 'tablet':
                return width >= mediaQueryBreakpoints.mobile && width < mediaQueryBreakpoints.tablet;
            case 'desktop':
                return width >= mediaQueryBreakpoints.tablet && width < mediaQueryBreakpoints.desktop;
            case 'largeDesktop':
                return width >= mediaQueryBreakpoints.desktop && width < mediaQueryBreakpoints.largeDesktop;
            case 'xlDesktop':
                return width >= mediaQueryBreakpoints.largeDesktop;
            default:
                return false;
        }
    }
    return false;
}

// Fonction centralisée pour gérer les media queries dans les composants
export function useMediaQuery() {
    let currentIsSmallMobile, currentIsMobile, currentIsTablet, currentIsDesktop, currentIsLargeDesktop, currentIsXlDesktop;
    
    // S'abonner aux stores pour obtenir les valeurs actuelles
    const unsubscribeSmallMobile = isSmallMobile.subscribe(value => currentIsSmallMobile = value);
    const unsubscribeMobile = isMobile.subscribe(value => currentIsMobile = value);
    const unsubscribeTablet = isTablet.subscribe(value => currentIsTablet = value);
    const unsubscribeDesktop = isDesktop.subscribe(value => currentIsDesktop = value);
    const unsubscribeLargeDesktop = isLargeDesktop.subscribe(value => currentIsLargeDesktop = value);
    const unsubscribeXlDesktop = isXlDesktop.subscribe(value => currentIsXlDesktop = value);

    // Déterminer la taille d'écran actuelle
    let currentSize;
    if (currentIsSmallMobile) currentSize = 'smallMobile';
    else if (currentIsMobile) currentSize = 'mobile';
    else if (currentIsTablet) currentSize = 'tablet';
    else if (currentIsDesktop) currentSize = 'desktop';
    else if (currentIsLargeDesktop) currentSize = 'largeDesktop';
    else if (currentIsXlDesktop) currentSize = 'xlDesktop';

    // Fonction de nettoyage
    const cleanup = () => {
        unsubscribeSmallMobile();
        unsubscribeMobile();
        unsubscribeTablet();
        unsubscribeDesktop();
        unsubscribeLargeDesktop();
        unsubscribeXlDesktop();
    };

    return {
        currentSize,
        currentIsSmallMobile,
        currentIsMobile,
        currentIsTablet,
        currentIsDesktop,
        currentIsLargeDesktop,
        currentIsXlDesktop,
        cleanup
    };
}
