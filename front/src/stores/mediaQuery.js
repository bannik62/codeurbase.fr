import { writable, derived } from 'svelte/store';

// Store centralisé pour les tailles de media queries
export const mediaQueryBreakpoints = {
    smallMobile: 475,
    mediumMobile: 476,
    mobile: 767,
    tablet: 1023,
    desktop: 1399,
    largeDesktop: 1400
};

// Store réactif pour la largeur de l'écran
export const screenWidth = writable(0);

// Store réactif pour la hauteur de l'écran
export const screenHeight = writable(0);

// Stores dérivés pour les détections de taille d'écran
export const isSmallMobile = derived(
    screenWidth,
    $width => $width <= mediaQueryBreakpoints.smallMobile
);

export const isMediumMobile = derived(
    screenWidth,
    $width => $width > mediaQueryBreakpoints.smallMobile && $width <= mediaQueryBreakpoints.mediumMobile
);

export const isMobile = derived(
    screenWidth,
    $width => $width > mediaQueryBreakpoints.mediumMobile && $width <= mediaQueryBreakpoints.mobile
);

export const isTablet = derived(
    screenWidth,
    $width => $width >= mediaQueryBreakpoints.mobile + 1 && $width <= mediaQueryBreakpoints.tablet
);

export const isDesktop = derived(
    screenWidth,
    $width => $width >= mediaQueryBreakpoints.tablet + 1 && $width <= mediaQueryBreakpoints.desktop
);

export const isLargeDesktop = derived(
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
        if (width <= mediaQueryBreakpoints.smallMobile) return 'smallMobile';
        if (width <= mediaQueryBreakpoints.mediumMobile) return 'mediumMobile';
        if (width <= mediaQueryBreakpoints.mobile) return 'mobile';
        if (width <= mediaQueryBreakpoints.tablet) return 'tablet';
        if (width <= mediaQueryBreakpoints.desktop) return 'desktop';
        return 'largeDesktop';
    }
    return 'desktop'; // Valeur par défaut pour SSR
}

// Fonction utilitaire pour vérifier si une taille correspond à un breakpoint
export function matchesBreakpoint(breakpoint) {
    if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        switch (breakpoint) {
            case 'smallMobile':
                return width <= mediaQueryBreakpoints.smallMobile;
            case 'mediumMobile':
                return width > mediaQueryBreakpoints.smallMobile && width <= mediaQueryBreakpoints.mediumMobile;
            case 'mobile':
                return width > mediaQueryBreakpoints.mediumMobile && width <= mediaQueryBreakpoints.mobile;
            case 'tablet':
                return width >= mediaQueryBreakpoints.mobile + 1 && width <= mediaQueryBreakpoints.tablet;
            case 'desktop':
                return width >= mediaQueryBreakpoints.tablet + 1 && width <= mediaQueryBreakpoints.desktop;
            case 'largeDesktop':
                return width >= mediaQueryBreakpoints.largeDesktop;
            default:
                return false;
        }
    }
    return false;
}

// Fonction centralisée pour gérer les media queries dans les composants
export function useMediaQuery() {
    let currentIsSmallMobile, currentIsMediumMobile, currentIsMobile, currentIsTablet, currentIsDesktop, currentIsLargeDesktop;
    
    // S'abonner aux stores pour obtenir les valeurs actuelles
    const unsubscribeSmallMobile = isSmallMobile.subscribe(value => currentIsSmallMobile = value);
    const unsubscribeMediumMobile = isMediumMobile.subscribe(value => currentIsMediumMobile = value);
    const unsubscribeMobile = isMobile.subscribe(value => currentIsMobile = value);
    const unsubscribeTablet = isTablet.subscribe(value => currentIsTablet = value);
    const unsubscribeDesktop = isDesktop.subscribe(value => currentIsDesktop = value);
    const unsubscribeLargeDesktop = isLargeDesktop.subscribe(value => currentIsLargeDesktop = value);

    // Déterminer la taille d'écran actuelle
    let currentSize;
    if (currentIsSmallMobile) currentSize = 'smallMobile';
    else if (currentIsMediumMobile) currentSize = 'mediumMobile';
    else if (currentIsMobile) currentSize = 'mobile';
    else if (currentIsTablet) currentSize = 'tablet';
    else if (currentIsDesktop) currentSize = 'desktop';
    else if (currentIsLargeDesktop) currentSize = 'largeDesktop';

    // Fonction de nettoyage
    const cleanup = () => {
        unsubscribeSmallMobile();
        unsubscribeMediumMobile();
        unsubscribeMobile();
        unsubscribeTablet();
        unsubscribeDesktop();
        unsubscribeLargeDesktop();
    };

    return {
        currentSize,
        currentIsSmallMobile,
        currentIsMediumMobile,
        currentIsMobile,
        currentIsTablet,
        currentIsDesktop,
        currentIsLargeDesktop,
        cleanup
    };
}
