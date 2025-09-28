import { writable } from 'svelte/store';

function createCurrentPageStore() {
  // Valeurs de pages autorisées
  const validPages = ['acceuil', 'acceuilPortfolioBis', 'about', 'contact'];
  
  // Lire la valeur du localStorage au démarrage
  const storedPage = typeof window !== 'undefined' ? localStorage.getItem('currentPage') : null;
  const initialPage = validPages.includes(storedPage) ? storedPage : 'acceuil';
  
  const store = writable(initialPage);
  let currentValue = initialPage;

  // Initialiser le localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('currentPage', initialPage);
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
        }
      }
    },
    get: () => currentValue
  };
}

export const currentPage = createCurrentPageStore();