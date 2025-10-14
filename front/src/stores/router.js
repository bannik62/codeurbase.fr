import { writable } from 'svelte/store';

function createCurrentPageStore() {
  // Valeurs de pages autorisées
  const validPages = ['acceuil', 'acceuilPortfolioBis', 'about', 'contact', 'login', 'admin'];
  
  // Fonction pour obtenir la page depuis l'URL
  function getPageFromURL() {
    if (typeof window === 'undefined') return 'acceuil';
    
    const path = window.location.pathname.replace(/^\//, ''); // Retire le / initial
    
    // Si le path est vide, retourner acceuil
    if (!path) return 'acceuil';
    
    // Si le path est valide, le retourner
    if (validPages.includes(path)) {
      return path;
    }
    
    // Sinon, retourner acceuil
    return 'acceuil';
  }
  
  // Lire la valeur depuis l'URL en priorité, sinon localStorage
  const urlPage = getPageFromURL();
  const storedPage = typeof window !== 'undefined' ? localStorage.getItem('currentPage') : null;
  const initialPage = urlPage !== 'acceuil' ? urlPage : (validPages.includes(storedPage) ? storedPage : 'acceuil');
  
  const store = writable(initialPage);
  let currentValue = initialPage;

  // Initialiser le localStorage et l'URL
  if (typeof window !== 'undefined') {
    localStorage.setItem('currentPage', initialPage);
    
    // Synchroniser l'URL avec la page initiale
    const currentPath = window.location.pathname.replace(/^\//, '');
    if (currentPath !== initialPage) {
      window.history.replaceState({}, '', `/${initialPage}`);
    }
  }

  // Écouter les changements d'URL (bouton précédent/suivant du navigateur)
  if (typeof window !== 'undefined') {
    window.addEventListener('popstate', () => {
      const page = getPageFromURL();
      if (page !== currentValue) {
        store.set(page);
        currentValue = page;
        localStorage.setItem('currentPage', page);
      }
    });
  }

  return {
    subscribe: store.subscribe,
    set: (newValue) => {
      // Vérifier si la nouvelle valeur est valide
      if (!validPages.includes(newValue)) {
        console.error(`Invalid page value: ${newValue}`);
        return;
      }

      // Ne mettre à jour que si la valeur change réellement
      if (currentValue !== newValue) {
        store.set(newValue);
        currentValue = newValue;
        if (typeof window !== 'undefined') {
          localStorage.setItem('currentPage', newValue);
          
          // Mettre à jour l'URL du navigateur
          window.history.pushState({}, '', `/${newValue}`);
        }
      }
    },
    get: () => currentValue
  };
}

export const currentPage = createCurrentPageStore();