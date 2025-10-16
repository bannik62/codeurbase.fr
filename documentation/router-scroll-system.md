# Système de Routage et Scroll - CodeurBase

## 📋 Table des matières

1. [Architecture générale](#architecture-générale)
2. [Système de routage](#système-de-routage)
3. [Store de navigation](#store-de-navigation)
4. [Système de scroll Lenis](#système-de-scroll-lenis)
5. [Gestion du localStorage](#gestion-du-localstorage)
6. [Synchronisation URL](#synchronisation-url)
7. [Gestion des transitions](#gestion-des-transitions)
8. [API et méthodes](#api-et-méthodes)
9. [Dépannage](#dépannage)

---

## 🏗️ Architecture générale

### Vue d'ensemble

Le système de navigation de CodeurBase est basé sur une architecture SPA (Single Page Application) avec :

- **Store centralisé** : `currentPage` pour la gestion de l'état
- **Synchronisation URL** : Mise à jour automatique de l'URL du navigateur
- **Persistance** : Sauvegarde dans `localStorage`
- **Scroll smooth** : Gestion centralisée avec Lenis
- **Transitions** : Reset automatique du scroll entre les pages

### Composants principaux

```
App.svelte (Root)
├── currentPage Store (router.js)
├── Lenis Store (lenis.js)
├── Navbar (navigation)
└── Pages
    ├── Acceuil.svelte
    ├── AcceuilPortfolioBis.svelte
    ├── Blog.svelte (about)
    ├── Contact.svelte
    ├── Login.svelte
    └── AdminBoard.svelte (admin)
```

---

## 🧭 Système de routage

### Pages disponibles

```javascript
const validPages = [
  'acceuil',           // Page d'accueil principale
  'acceuilPortfolioBis', // Page portfolio avancée
  'about',             // Blog (alias pour about)
  'contact',           // Page de contact
  'login',             // Page de connexion
  'admin'              // Tableau de bord admin
];
```

### Logique de routage

#### 1. **Priorité de résolution**
```javascript
// Ordre de priorité pour déterminer la page initiale :
1. URL du navigateur (window.location.pathname)
2. localStorage (currentPage)
3. Page par défaut ('acceuil')
```

#### 2. **Validation des pages**
- Toutes les pages doivent être dans `validPages`
- Redirection automatique vers `'acceuil'` si page invalide
- Logs d'erreur pour les tentatives de navigation invalides

#### 3. **Gestion des URLs**
- **Format** : `https://domain.com/pageName`
- **Nettoyage** : Suppression du `/` initial
- **Synchronisation** : URL ↔ Store ↔ localStorage

---

## 📦 Store de navigation

### Structure du store

```javascript
// stores/router.js
export const currentPage = createCurrentPageStore();

// Méthodes disponibles :
currentPage.subscribe(callback)  // S'abonner aux changements
currentPage.set(newPage)         // Changer de page
currentPage.get()                // Obtenir la page actuelle
```

### Fonctionnement interne

#### 1. **Initialisation**
```javascript
function createCurrentPageStore() {
  // 1. Lire l'URL actuelle
  const urlPage = getPageFromURL();
  
  // 2. Lire le localStorage
  const storedPage = localStorage.getItem('currentPage');
  
  // 3. Déterminer la page initiale
  const initialPage = urlPage !== 'acceuil' 
    ? urlPage 
    : (validPages.includes(storedPage) ? storedPage : 'acceuil');
  
  // 4. Créer le store Svelte
  const store = writable(initialPage);
}
```

#### 2. **Changement de page**
```javascript
set: (newValue) => {
  // 1. Validation
  if (!validPages.includes(newValue)) {
    console.error(`Invalid page value: ${newValue}`);
    return;
  }
  
  // 2. Vérification de changement
  if (currentValue !== newValue) {
    // 3. Mise à jour du store
    store.set(newValue);
    currentValue = newValue;
    
    // 4. Persistance
    localStorage.setItem('currentPage', newValue);
    
    // 5. Synchronisation URL
    window.history.pushState({}, '', `/${newValue}`);
  }
}
```

#### 3. **Écoute des changements d'URL**
```javascript
// Gestion du bouton retour/avancer du navigateur
window.addEventListener('popstate', () => {
  const page = getPageFromURL();
  if (page !== currentValue) {
    store.set(page);
    currentValue = page;
    localStorage.setItem('currentPage', page);
  }
});
```

---

## 🎯 Système de scroll Lenis

### Architecture centralisée

#### 1. **Instance unique**
```javascript
// stores/lenis.js
let lenisInstance = null;  // Instance globale unique
let rafId = null;          // ID de la boucle RAF
let isRafActive = false;   // État de la boucle RAF
```

#### 2. **Configuration Lenis**
```javascript
lenisInstance = new Lenis({
  duration: 5,                    // Durée de l'animation (plus lent)
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Courbe d'easing
  direction: 'vertical',          // Direction du scroll
  smooth: true,                   // Activation du smooth scroll
  mouseMultiplier: 60,            // Sensibilité souris (plus lent)
  smoothTouch: true,              // Smooth scroll sur mobile
  touchMultiplier: 0.6,           // Sensibilité tactile (plus lent)
});
```

### Gestion du RAF (RequestAnimationFrame)

#### 1. **Boucle RAF centralisée**
```javascript
function startRaf() {
  if (isRafActive || !lenisInstance) return;
  
  isRafActive = true;
  function raf(time) {
    if (isRafActive && lenisInstance) {
      lenisInstance.raf(time);
      rafId = requestAnimationFrame(raf);
    }
  }
  rafId = requestAnimationFrame(raf);
}
```

#### 2. **Arrêt du RAF**
```javascript
function stopRaf() {
  isRafActive = false;
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}
```

### API Lenis

#### 1. **Initialisation**
```javascript
// Créer ou récupérer l'instance
const lenisInstance = initLenis();

// Récupérer l'instance existante
const lenisInstance = getLenis();
```

#### 2. **Contrôle**
```javascript
stopLenis();    // Arrêter le scroll smooth
startLenis();   // Redémarrer le scroll smooth
destroyLenis(); // Détruire complètement l'instance
```

#### 3. **Navigation programmatique**
```javascript
// Scroll vers une position
lenisInstance.scrollTo(0, { immediate: true }); // En haut, immédiat
lenisInstance.scrollTo(1000);                   // À 1000px, animé

// Scroll vers un élément
lenisInstance.scrollTo('#element', { offset: -100 });
```

---

## 💾 Gestion du localStorage

### Structure des données

```javascript
// Clé utilisée
const STORAGE_KEY = 'currentPage';

// Valeurs possibles
const validPages = ['acceuil', 'acceuilPortfolioBis', 'about', 'contact', 'login', 'admin'];
```

### Opérations

#### 1. **Lecture**
```javascript
const storedPage = localStorage.getItem('currentPage');
```

#### 2. **Écriture**
```javascript
localStorage.setItem('currentPage', newPage);
```

#### 3. **Validation**
```javascript
// Vérifier si la valeur est valide
if (validPages.includes(storedPage)) {
  // Utiliser la valeur
} else {
  // Utiliser la valeur par défaut
}
```

### Synchronisation

#### 1. **Store → localStorage**
```javascript
// À chaque changement de page
currentPage.set('newPage');
// → localStorage.setItem('currentPage', 'newPage');
```

#### 2. **localStorage → Store**
```javascript
// Au chargement initial
const storedPage = localStorage.getItem('currentPage');
const initialPage = validPages.includes(storedPage) ? storedPage : 'acceuil';
```

---

## 🔗 Synchronisation URL

### Mécanisme de synchronisation

#### 1. **Store → URL**
```javascript
// Lors du changement de page
currentPage.set('about');
// → window.history.pushState({}, '', '/about');
```

#### 2. **URL → Store**
```javascript
// Au chargement et navigation navigateur
window.addEventListener('popstate', () => {
  const page = getPageFromURL();
  currentPage.set(page);
});
```

### Gestion des URLs

#### 1. **Format des URLs**
```
https://codeurbase.fr/acceuil
https://codeurbase.fr/about
https://codeurbase.fr/contact
```

#### 2. **Nettoyage des paths**
```javascript
const path = window.location.pathname.replace(/^\//, ''); // Retire le / initial
```

#### 3. **Redirection automatique**
```javascript
// Si l'URL ne correspond pas à la page actuelle
if (currentPath !== initialPage) {
  window.history.replaceState({}, '', `/${initialPage}`);
}
```

---

## 🔄 Gestion des transitions

### Reset automatique du scroll

#### 1. **Détection du changement de page**
```javascript
// Dans App.svelte
let previousPage = null;

$: {
  // Reset scroll en haut lors du changement de page
  if (previousPage && previousPage !== $currentPage) {
    const lenisInstance = getLenis();
    if (lenisInstance) {
      lenisInstance.scrollTo(0, { immediate: true });
    }
  }
  previousPage = $currentPage;
}
```

#### 2. **Comportement intelligent**
- **Changement de page** → Reset en haut
- **Rechargement** → Pas de reset (position conservée)
- **Arrivée directe** → Reset initial

#### 3. **Reset initial**
```javascript
// Au chargement de l'app
if (lenisInstance) {
  lenisInstance.scrollTo(0, { immediate: true });
}
```

### Gestion des composants

#### 1. **Pages principales**
```javascript
// Chaque page récupère l'instance Lenis existante
onMount(() => {
  const lenisInstance = getLenis();
  // Pas de création d'instance, réutilisation
});
```

#### 2. **Nettoyage**
```javascript
onDestroy(() => {
  // Pas de nettoyage Lenis, géré globalement
  // Seulement le nettoyage des animations GSAP
});
```

---

## 🛠️ API et méthodes

### Store de navigation

#### `currentPage.subscribe(callback)`
```javascript
// S'abonner aux changements de page
const unsubscribe = currentPage.subscribe(page => {
  console.log('Page actuelle:', page);
});
```

#### `currentPage.set(newPage)`
```javascript
// Changer de page
currentPage.set('about');
```

#### `currentPage.get()`
```javascript
// Obtenir la page actuelle
const current = currentPage.get();
```

### Store Lenis

#### `initLenis()`
```javascript
// Créer ou récupérer l'instance Lenis
const lenisInstance = initLenis();
```

#### `getLenis()`
```javascript
// Récupérer l'instance existante
const lenisInstance = getLenis();
```

#### `stopLenis()`
```javascript
// Arrêter le scroll smooth
stopLenis();
```

#### `startLenis()`
```javascript
// Redémarrer le scroll smooth
startLenis();
```

#### `destroyLenis()`
```javascript
// Détruire complètement l'instance
destroyLenis();
```

### Navigation programmatique

#### Scroll vers position
```javascript
const lenisInstance = getLenis();
lenisInstance.scrollTo(0);                    // En haut
lenisInstance.scrollTo(1000);                 // À 1000px
lenisInstance.scrollTo(0, { immediate: true }); // Immédiat
```

#### Scroll vers élément
```javascript
lenisInstance.scrollTo('#element');
lenisInstance.scrollTo('#element', { offset: -100 });
```

---

## 🔧 Dépannage

### Problèmes courants

#### 1. **Scroll ne fonctionne pas**
```javascript
// Vérifier que Lenis est initialisé
const lenisInstance = getLenis();
if (!lenisInstance) {
  console.error('Lenis non initialisé');
}

// Vérifier que le RAF est actif
console.log('RAF actif:', isRafActive);
```

#### 2. **Page ne change pas**
```javascript
// Vérifier que la page est valide
const validPages = ['acceuil', 'acceuilPortfolioBis', 'about', 'contact', 'login', 'admin'];
if (!validPages.includes(newPage)) {
  console.error('Page invalide:', newPage);
}
```

#### 3. **URL non synchronisée**
```javascript
// Vérifier l'URL actuelle
console.log('URL actuelle:', window.location.pathname);
console.log('Page store:', currentPage.get());
console.log('localStorage:', localStorage.getItem('currentPage'));
```

#### 4. **Scroll ne se reset pas**
```javascript
// Vérifier la détection de changement de page
console.log('Page précédente:', previousPage);
console.log('Page actuelle:', $currentPage);
```

### Logs de debug

#### 1. **Activer les logs Lenis**
```javascript
// Dans lenis.js
console.log('[Lenis] Création d\'une nouvelle instance');
console.log('[Lenis] Réutilisation de l\'instance existante');
console.log('[Lenis] RAF démarré');
console.log('[Lenis] RAF arrêté');
```

#### 2. **Activer les logs de navigation**
```javascript
// Dans App.svelte
console.log(`[App] Changement de page: ${previousPage} → ${$currentPage}`);
console.log('[App] Reset scroll initial en haut');
```

#### 3. **Activer les logs de store**
```javascript
// Dans router.js
console.log('Page actuelle:', currentValue);
console.log('Nouvelle page:', newValue);
```

### Solutions

#### 1. **Réinitialiser Lenis**
```javascript
destroyLenis();
const lenisInstance = initLenis();
```

#### 2. **Forcer le reset du scroll**
```javascript
const lenisInstance = getLenis();
if (lenisInstance) {
  lenisInstance.scrollTo(0, { immediate: true });
}
```

#### 3. **Vider le localStorage**
```javascript
localStorage.removeItem('currentPage');
// Recharger la page
window.location.reload();
```

---

## 📊 Diagrammes

### Flux de navigation

```mermaid
graph TD
    A[Utilisateur clique] --> B[currentPage.set()]
    B --> C[Validation page]
    C --> D[Store mis à jour]
    D --> E[localStorage mis à jour]
    E --> F[URL mise à jour]
    F --> G[Composant rendu]
    G --> H[Reset scroll]
    
    I[URL directe] --> J[getPageFromURL()]
    J --> K[Validation page]
    K --> L[Store initialisé]
    L --> M[localStorage synchronisé]
    M --> N[Composant rendu]
```

### Architecture Lenis

```mermaid
graph TD
    A[App.svelte] --> B[initLenis()]
    B --> C[Instance unique]
    C --> D[RAF centralisé]
    D --> E[Scroll smooth]
    
    F[Pages] --> G[getLenis()]
    G --> C
    
    H[Changement page] --> I[Reset scroll]
    I --> J[scrollTo(0)]
```

---

## 🎯 Bonnes pratiques

### 1. **Utilisation du store**
```javascript
// ✅ Bon
currentPage.set('about');

// ❌ Éviter
window.location.href = '/about';
```

### 2. **Gestion Lenis**
```javascript
// ✅ Bon - Récupérer l'instance existante
const lenisInstance = getLenis();

// ❌ Éviter - Créer une nouvelle instance
const lenisInstance = initLenis();
```

### 3. **Nettoyage**
```javascript
// ✅ Bon - Pas de nettoyage Lenis dans les pages
onDestroy(() => {
  // Seulement GSAP et autres ressources
});

// ❌ Éviter - Détruire Lenis dans les pages
onDestroy(() => {
  lenisInstance.destroy();
});
```

---

## 📝 Changelog

### Version 1.0.0
- ✅ Système de routage SPA
- ✅ Synchronisation URL ↔ Store ↔ localStorage
- ✅ Scroll smooth centralisé avec Lenis
- ✅ Reset automatique du scroll entre pages
- ✅ Gestion des transitions intelligentes
- ✅ Support des boutons navigateur (retour/avancer)

---

*Documentation générée le 16/10/2025 - CodeurBase.fr*
