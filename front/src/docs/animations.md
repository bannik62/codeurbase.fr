# Documentation des Animations - Acceuil.svelte

## Table des matières
1. [Animations des Nuages et Planète](#animations-des-nuages-et-planète)
2. [Animation de Détection](#animation-de-détection)
3. [Animation de Status](#animation-de-status)
4. [Gestion du Scroll](#gestion-du-scroll)

## Animations des Nuages et Planète

### Fonction `createCloudAnimations`
Cette fonction crée un ensemble d'animations pour les nuages et la planète, adaptées selon la taille de l'écran.

```javascript
function createCloudAnimations(triggerStart, triggerEnd, planetY, planetScale, planetWidth, planetHeight)
```

**Paramètres:**
- `triggerStart`: Point de déclenchement de l'animation (ex: "top 70%")
- `triggerEnd`: Point de fin de l'animation (ex: "bottom 30%")
- `planetY`: Position Y finale de la planète
- `planetScale`: Échelle finale de la planète
- `planetWidth`: Largeur finale de la planète
- `planetHeight`: Hauteur finale de la planète

**Animations créées:**
1. **Animation des nuages** (.nuages-one)
   - Opacité: 0 → 1
   - Échelle: 0.1 → 1
   - Durée: 2 secondes
   - Ease: power2.out

2. **Animation du contenu des nuages** (.intro-cloud-container)
   - Opacité: 0 → 1
   - Échelle: 0.1 → 1
   - Durée: 2 secondes
   - Ease: back.out(1.7)

3. **Animation de la planète** (.atmo-one img)
   - Déplacement vertical (Y)
   - Changement d'échelle
   - Ajustement de la taille

## Animation de Status

### Timeline de Status (Large Desktop)
Animation complexe qui gère l'apparition et le déplacement d'un indicateur de status.

```javascript
gsap.timeline({
    scrollTrigger: {
        trigger: ".content-space-two",
        start: "top +=10%",
        end: "bottom 40%",
        scrub: 1.5,
        markers: true,
        toggleActions: "play none none none"
    }
})
```

**Séquence d'animation:**

1. **Apparition initiale** (.container-status)
   ```javascript
   .fromTo({
       scale: 0, opacity: 0, y: "-50%"
   }, {
       y: "-180%", scale: 2.5, opacity: 0.3
   })
   ```
   - Durée: 0.5s
   - Ease: power2.in → power2.out

2. **Premier déplacement vertical**
   ```javascript
   .to({
       y: "100%", opacity: 0.6
   })
   ```
   - Durée: 2.5s
   - Changement de dégradé
   - Couleur: crimson

3. **Deuxième déplacement vertical**
   ```javascript
   .to({
       y: "100%", opacity: 1
   })
   ```
   - Durée: 3.5s
   - Ajout d'ombre portée

4. **Déplacement horizontal final**
   ```javascript
   .to({
       x: "350%", opacity: 0
   })
   ```
   - Durée: 1.5s
   - Délai: 2s
   - Scale: 0.5
   - Déclenchement du détecteur à la fin

## Gestion du Scroll

### Fonctions de contrôle
- `disableScroll()`: Bloque le défilement
  - Arrête Lenis
  - Bloque le scroll natif

- `enableScroll()`: Réactive le défilement
  - Redémarre Lenis
  - Restaure le scroll natif

### Responsive Design
Les animations sont adaptées selon différentes breakpoints :
- Très petits écrans (≤ 475px)
- Medium Mobile (476px - 767px)
- Mobile (768px - 1023px)
- Tablette (1024px - 1399px)
- Large Desktop (1400px - 1799px)
- XL Desktop (≥1800px)

Chaque breakpoint ajuste :
- Les dimensions de la planète
- Les positions des éléments
- Les échelles d'animation
- Les points de déclenchement ScrollTrigger
