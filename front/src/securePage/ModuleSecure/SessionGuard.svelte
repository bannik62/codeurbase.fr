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
      console.log('[SessionGuard] Vérification de la session...');
      
      const response = await fetch(`${API_BASE_URL}/api/auth/verifySession`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include' // Important : envoie le cookie
      });
      
      const data = await response.json();
      
      console.log('[SessionGuard] Réponse:', data);
      
      if (data.valid === true) {
        // Session valide ✅
        sessionValid.set(true);
        sessionUser.set(data.user || null);
        console.log('[SessionGuard] Session valide ✅', data.user);
        if (onValidSession) {
          onValidSession(data.user);
        }
      } else {
        // Session invalide ❌
        sessionValid.set(false);
        sessionUser.set(null);
        console.log('[SessionGuard] Session invalide ❌');
        if (onInvalidSession) {
          onInvalidSession();
        }
      }
      
      return data.valid;
      
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

