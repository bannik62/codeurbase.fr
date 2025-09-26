import { writable } from 'svelte/store';

const createCircleStore = () => {
    const { subscribe } = writable({
        circles: [
            { x: 70, y: 20, zIndex: 1002 },
            { x: 20, y: 70, zIndex: 1002 },
            { x: 80, y: 80, zIndex: 1002 }
        ],
        titleZIndex: 1004
    });

    return {
        subscribe
    };
};

export const circleStore = createCircleStore();