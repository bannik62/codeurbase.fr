import { writable } from 'svelte/store';

// Variables pour les positions et propriétés des cercles
const createCircleStore = () => {
    const { subscribe, set, update } = writable({
        topRightPosition: { x: 0, y: 0, z: 0, zIndex: 1002 },
        bottomLeftPosition: { x: 0, y: 0, z: 0, zIndex: 1002 },
        bottomRightPosition: { x: 0, y: 0, z: 0, zIndex: 1002 },
        titleZIndex: 1004
    });

    // Variables pour les vitesses et directions
    let topRightVelocity = { x: 0.3, y: 0.2, z: 0.1 };
    let bottomLeftVelocity = { x: -0.25, y: 0.35, z: -0.08 };
    let bottomRightVelocity = { x: 0.2, y: -0.3, z: 0.25 };

    // Variables pour les accélérations (changements de direction fluides)
    let topRightAcceleration = { x: 0, y: 0 };
    let bottomLeftAcceleration = { x: 0, y: 0 };
    let bottomRightAcceleration = { x: 0, y: 0 };

    // Variables pour les limites
    const maxX = 90; // 100% - 10% (largeur du cercle)
    const maxY = 90; // 100% - 10% (hauteur du cercle)
    const maxZ = 20; // Limite pour l'axe Z

    // Zone de détection avant collision (en pourcentage)
    const collisionBuffer = 15; // 15% de marge avant les bords

    // Fonction pour générer une position initiale aléatoire
    function getRandomPosition() {
        return {
            x: Math.random() * maxX,
            y: Math.random() * maxY,
            z: (Math.random() - 0.5) * maxZ,
            zIndex: 1005 + Math.floor(Math.random() * 3), // Entre 1005 et 1007
        };
    }

    // Fonction pour générer une nouvelle direction aléatoire
    function getRandomDirection() {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.1 + Math.random() * 0.3; // Vitesse entre 0.1 et 0.4
        return {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed,
        };
    }

    // Fonction pour mettre à jour les positions avec changements de direction fluides
    function updatePositions() {
        update(current => {
            // Top Right - Mouvement avec courbes
            current.topRightPosition.x += topRightVelocity.x;
            current.topRightPosition.y += topRightVelocity.y;
            current.topRightPosition.z += topRightVelocity.z;

            // Bottom Left - Mouvement avec courbes
            current.bottomLeftPosition.x += bottomLeftVelocity.x;
            current.bottomLeftPosition.y += bottomLeftVelocity.y;
            current.bottomLeftPosition.z += bottomLeftVelocity.z;

            // Bottom Right - Mouvement avec courbes
            current.bottomRightPosition.x += bottomRightVelocity.x;
            current.bottomRightPosition.y += bottomRightVelocity.y;
            current.bottomRightPosition.z += bottomRightVelocity.z;

            // Gestion des rebonds avec changements de direction fluides
            const positions = [current.topRightPosition, current.bottomLeftPosition, current.bottomRightPosition];
            const velocities = [topRightVelocity, bottomLeftVelocity, bottomRightVelocity];
            const accelerations = [topRightAcceleration, bottomLeftAcceleration, bottomRightAcceleration];

            positions.forEach((pos, index) => {
                const velocity = velocities[index];
                const acceleration = accelerations[index];

                // Détection précoce des bords X (avant collision)
                if (pos.x <= collisionBuffer || pos.x >= maxX - collisionBuffer) {
                    // Nouvelle direction qui évite le bord
                    const newDir = getRandomDirection();
                    // Forcer la direction vers l'intérieur si trop proche du bord
                    if (pos.x <= collisionBuffer) {
                        newDir.x = Math.abs(newDir.x); // Direction positive (vers la droite)
                    } else if (pos.x >= maxX - collisionBuffer) {
                        newDir.x = -Math.abs(newDir.x); // Direction négative (vers la gauche)
                    }
                    acceleration.x = (newDir.x - velocity.x) * 0.05; // Transition plus rapide
                    acceleration.y = (newDir.y - velocity.y) * 0.05;
                }

                // Détection précoce des bords Y (avant collision)
                if (pos.y <= collisionBuffer || pos.y >= maxY - collisionBuffer) {
                    // Nouvelle direction qui évite le bord
                    const newDir = getRandomDirection();
                    // Forcer la direction vers l'intérieur si trop proche du bord
                    if (pos.y <= collisionBuffer) {
                        newDir.y = Math.abs(newDir.y); // Direction positive (vers le bas)
                    } else if (pos.y >= maxY - collisionBuffer) {
                        newDir.y = -Math.abs(newDir.y); // Direction négative (vers le haut)
                    }
                    acceleration.x = (newDir.x - velocity.x) * 0.05; // Transition plus rapide
                    acceleration.y = (newDir.y - velocity.y) * 0.05;
                }

                // Sécurité : rebond sur les bords X (si malgré tout ils touchent)
                if (pos.x <= 0 || pos.x >= maxX) {
                    velocity.x *= -0.8;
                    pos.x = Math.max(0, Math.min(maxX, pos.x));
                }

                // Sécurité : rebond sur les bords Y (si malgré tout ils touchent)
                if (pos.y <= 0 || pos.y >= maxY) {
                    velocity.y *= -0.8;
                    pos.y = Math.max(0, Math.min(maxY, pos.y));
                }

                // Rebond sur les bords Z
                if (pos.z <= -maxZ || pos.z >= maxZ) {
                    velocity.z *= -1;
                    pos.z = Math.max(-maxZ, Math.min(maxZ, pos.z));
                }

                // Changement aléatoire de z-index
                if (Math.random() < 0.009) {
                    // 0.5% de chance à chaque frame
                    pos.zIndex = 1005 + Math.floor(Math.random() * 3);
                }

                // Changement aléatoire de direction (plus fréquent pour plus de mouvement)
                if (Math.random() < 0.0001) {
                    // 1% de chance à chaque frame
                    const newDir = getRandomDirection();
                    acceleration.x = (newDir.x - velocity.x) * 0.09; // Transition plus rapide
                    acceleration.y = (newDir.y - velocity.y) * 0.03;
                }

                // Application des accélérations pour des changements fluides
                velocity.x += acceleration.x;
                velocity.y += acceleration.y;

                // Limitation des vitesses
                const maxSpeed = 0.9;
                const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
                if (speed > maxSpeed) {
                    velocity.x = (velocity.x / speed) * maxSpeed;
                    velocity.y = (velocity.y / speed) * maxSpeed;
                }

                // Réduction progressive des accélérations
                acceleration.x *= 1;
                acceleration.y *= 1;
            });

            // Changement aléatoire du z-index du titre
            if (Math.random() < 0.5) {
                // 1% de chance à chaque frame
                current.titleZIndex = Math.random() < 0.5 ? 1003 : 1004;
            }

            return current;
        });
    }

    let animationId = null;
    let isAnimating = false;

    // Fonction pour démarrer l'animation
    function startAnimation() {
        if (isAnimating) return;
        
        isAnimating = true;
        
        // Initialiser les positions
        update(current => {
            current.topRightPosition = getRandomPosition();
            current.bottomLeftPosition = getRandomPosition();
            current.bottomRightPosition = getRandomPosition();
            return current;
        });

        // Initialiser les directions
        const topRightDir = getRandomDirection();
        const bottomLeftDir = getRandomDirection();
        const bottomRightDir = getRandomDirection();

        topRightVelocity.x = topRightDir.x;
        topRightVelocity.y = topRightDir.y;
        bottomLeftVelocity.x = bottomLeftDir.x;
        bottomLeftVelocity.y = bottomLeftDir.y;
        bottomRightVelocity.x = bottomRightDir.x;
        bottomRightVelocity.y = bottomRightDir.y;

        // Démarrer la boucle d'animation
        function animate() {
            updatePositions();
            animationId = requestAnimationFrame(animate);
        }
        
        animate();
    }

    // Fonction pour arrêter l'animation
    function stopAnimation() {
        isAnimating = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }

    return {
        subscribe,
        startAnimation,
        stopAnimation,
        // Méthodes utilitaires pour accéder aux positions
        getTopRightPosition: () => {
            let pos;
            subscribe(current => pos = current.topRightPosition)();
            return pos;
        },
        getBottomLeftPosition: () => {
            let pos;
            subscribe(current => pos = current.bottomLeftPosition)();
            return pos;
        },
        getBottomRightPosition: () => {
            let pos;
            subscribe(current => pos = current.bottomRightPosition)();
            return pos;
        }
    };
};

export const circleStore = createCircleStore();
