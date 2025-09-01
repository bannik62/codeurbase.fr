import { writable } from 'svelte/store';

export const config = writable({});

// Fonction pour charger config.json au runtime
export async function loadConfig() {
  try {
    const res = await fetch('/config.json');
    if (!res.ok) {
      throw new Error(`Impossible de charger config.json : ${res.status}`);
    }
    const data = await res.json();
    config.set(data); // { BACKEND_URL: "https://..." }
    console.log("✅ Config chargée :", data);
  } catch (err) {
    console.error("❌ Erreur lors du chargement de config.json :", err);
  }
}
