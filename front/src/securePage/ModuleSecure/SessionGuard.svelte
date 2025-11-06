<script context="module">
  import { writable } from 'svelte/store';
  
  /**
   * Store pour l'état de la session (module-level pour être partagé)
   */
  export const sessionValid = writable(null); // null = en cours, true = valide, false = invalide
  export const sessionUser = writable(null);
  export const isCheckingSession = writable(false);
</script>

<script>
  import { onMount } from 'svelte';
  
  /**
   * Props
   */
  export let onValidSession = (user) => {}; // Callback si session valide
  export let onInvalidSession = () => {}; // Callback si session invalide
  export let autoCheck = true; // Vérifier automatiquement au montage
  
  /**
   * URL de l'API
   */
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  
  /**
   * Vérifie la session auprès du backend
   */
  export async function verifySession() {
    try {
      isCheckingSession.set(true);
      
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include' // Important : envoie le cookie
      });
      
      const data = await response.json();
      
      
      if (data.success === true && data.user) {
        // Session valide ✅
        sessionValid.set(true);
        sessionUser.set(data.user);
        if (onValidSession) {
          onValidSession(data.user);
        }
        return true;
      } else {
        // Session invalide ❌
        sessionValid.set(false);
        sessionUser.set(null);
        if (onInvalidSession) {
          onInvalidSession();
        }
        return false;
      }
      
    } catch (error) {
      console.error('[SessionGuard] Erreur lors de la vérification:', error);
      sessionValid.set(false);
      sessionUser.set(null);
      if (onInvalidSession) {
        onInvalidSession();
      }
      return false;
    } finally {
      isCheckingSession.set(false);
    }
  }
  
  /**
   * Au montage du composant
   */
  onMount(() => {
    if (autoCheck) {
      verifySession();
    }
  });
</script>

<!-- Composant invisible - aucun rendu -->
<div style="display: none;"></div>

