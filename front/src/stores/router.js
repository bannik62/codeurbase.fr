import { writable } from 'svelte/store';

// On lit la valeur du localStorage au démarrage
const initialPage =  'acceuilPortfolioBis';

// Création d'un store personnalisé
function createCurrentPageStore() {
  const { subscribe, set: originalSet } = writable(initialPage);

  return {
    subscribe,
    set: (value) => {
      // Mise à jour du localStorage
      localStorage.setItem('currentPage', value);
      // Mise à jour du store
      originalSet(value);
    },
    // Méthode pour forcer une mise à jour depuis le localStorage
    refresh: () => {
      const currentValue = localStorage.getItem('currentPage');
      if (currentValue) {
        originalSet(currentValue);
      }
    }
  };
}

export const currentPage = createCurrentPageStore();
