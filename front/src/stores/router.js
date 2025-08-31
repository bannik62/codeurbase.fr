import { writable } from 'svelte/store';

// On lit la valeur du localStorage au démarrage
const initialPage = localStorage.getItem('currentPage') || 'acceuil';

// On crée le store avec la valeur initiale
export const currentPage = writable(initialPage);

// À chaque changement du store, on sauvegarde dans localStorage
currentPage.subscribe((value) => {
  localStorage.setItem('currentPage', value);
});
