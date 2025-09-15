import { writable } from 'svelte/store';

// Structure optimisée pour les cercles
const createCircleStore = () => {
    const { subscribe, set, update } = writable({
        circles: [
            { x: 0, y: 0, z: 0, zIndex: 1002, vx: 0.3, vy: 0.2, vz: 0.1, ax: 0, ay: 0 },
            { x: 0, y: 0, z: 0, zIndex: 1002, vx: -0.25, vy: 0.35, vz: -0.08, ax: 0, ay: 0 },
            { x: 0, y: 0, z: 0, zIndex: 1002, vx: 0.2, vy: -0.3, vz: 0.25, ax: 0, ay: 0 }
        ],
        titleZIndex: 1004
    });

    // Constantes optimisées
    const MAX_X = 90;
    const MAX_Y = 90;
    const MAX_Z = 20;
    const COLLISION_BUFFER = 15;
    const MAX_SPEED = 0.9;
    const ACCELERATION_FACTOR = 0.05;
    const RANDOM_DIRECTION_CHANCE = 0.0001;
    const Z_INDEX_CHANGE_CHANCE = 0.009;

    // Fonctions optimisées
    function getRandomPosition() {
        return {
            x: Math.random() * MAX_X,
            y: Math.random() * MAX_Y,
            z: (Math.random() - 0.5) * MAX_Z,
            zIndex: 1005 + Math.floor(Math.random() * 3),
            vx: 0, vy: 0, vz: 0, ax: 0, ay: 0
        };
    }

    function getRandomDirection() {
        const angle = Math.random() * 6.28; // 2*PI pré-calculé
        const speed = 0.1 + Math.random() * 0.3;
        return {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed,
        };
    }

    // Fonction optimisée pour mettre à jour les positions
    function updatePositions() {
        update(current => {
            const circles = current.circles;
            
            for (let i = 0; i < circles.length; i++) {
                const circle = circles[i];
                
                // Mise à jour des positions
                circle.x += circle.vx;
                circle.y += circle.vy;
                circle.z += circle.vz;

                // Gestion des collisions X
                if (circle.x <= COLLISION_BUFFER || circle.x >= MAX_X - COLLISION_BUFFER) {
                    const newDir = getRandomDirection();
                    if (circle.x <= COLLISION_BUFFER) {
                        newDir.x = Math.abs(newDir.x);
                    } else {
                        newDir.x = -Math.abs(newDir.x);
                    }
                    circle.ax = (newDir.x - circle.vx) * ACCELERATION_FACTOR;
                    circle.ay = (newDir.y - circle.vy) * ACCELERATION_FACTOR;
                }

                // Gestion des collisions Y
                if (circle.y <= COLLISION_BUFFER || circle.y >= MAX_Y - COLLISION_BUFFER) {
                    const newDir = getRandomDirection();
                    if (circle.y <= COLLISION_BUFFER) {
                        newDir.y = Math.abs(newDir.y);
                    } else {
                        newDir.y = -Math.abs(newDir.y);
                    }
                    circle.ax = (newDir.x - circle.vx) * ACCELERATION_FACTOR;
                    circle.ay = (newDir.y - circle.vy) * ACCELERATION_FACTOR;
                }

                // Sécurité rebonds
                if (circle.x <= 0 || circle.x >= MAX_X) {
                    circle.vx *= -0.8;
                    circle.x = Math.max(0, Math.min(MAX_X, circle.x));
                }
                if (circle.y <= 0 || circle.y >= MAX_Y) {
                    circle.vy *= -0.8;
                    circle.y = Math.max(0, Math.min(MAX_Y, circle.y));
                }
                if (circle.z <= -MAX_Z || circle.z >= MAX_Z) {
                    circle.vz *= -1;
                    circle.z = Math.max(-MAX_Z, Math.min(MAX_Z, circle.z));
                }

                // Changements aléatoires optimisés
                if (Math.random() < Z_INDEX_CHANGE_CHANCE) {
                    circle.zIndex = 1005 + Math.floor(Math.random() * 3);
                }
                if (Math.random() < RANDOM_DIRECTION_CHANCE) {
                    const newDir = getRandomDirection();
                    circle.ax = (newDir.x - circle.vx) * 0.09;
                    circle.ay = (newDir.y - circle.vy) * 0.03;
                }

                // Application des accélérations
                circle.vx += circle.ax;
                circle.vy += circle.ay;

                // Limitation des vitesses
                const speed = Math.sqrt(circle.vx * circle.vx + circle.vy * circle.vy);
                if (speed > MAX_SPEED) {
                    const factor = MAX_SPEED / speed;
                    circle.vx *= factor;
                    circle.vy *= factor;
                }
            }

            // Changement z-index titre (optimisé)
            if (Math.random() < 0.5) {
                current.titleZIndex = Math.random() < 0.5 ? 1003 : 1004;
            }

            return current;
        });
    }

    let animationId = null;
    let isAnimating = false;

    // Fonction optimisée pour démarrer l'animation
    function startAnimation() {
        if (isAnimating) return;
        
        isAnimating = true;
        
        // Initialiser les cercles avec positions et vitesses
        update(current => {
            current.circles = [
                getRandomPosition(),
                getRandomPosition(),
                getRandomPosition()
            ];
            
            // Initialiser les vitesses
            const dirs = [getRandomDirection(), getRandomDirection(), getRandomDirection()];
            current.circles.forEach((circle, i) => {
                circle.vx = dirs[i].x;
                circle.vy = dirs[i].y;
            });
            
            return current;
        });

        // Boucle d'animation optimisée
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
        // Méthodes utilitaires optimisées
        getCirclePosition: (index) => {
            let pos;
            subscribe(current => pos = current.circles[index])();
            return pos;
        },
        getTopRightPosition: () => {
            let pos;
            subscribe(current => pos = current.circles[0])();
            return pos;
        },
        getBottomLeftPosition: () => {
            let pos;
            subscribe(current => pos = current.circles[1])();
            return pos;
        },
        getBottomRightPosition: () => {
            let pos;
            subscribe(current => pos = current.circles[2])();
            return pos;
        }
    };
};

export const circleStore = createCircleStore();
