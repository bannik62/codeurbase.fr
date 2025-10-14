/**
 * Logique de la page Login avec sécurité CSRF
 * @author CodeurBase.fr
 * @version 1.0.0
 */

import { writable } from 'svelte/store';

/**
 * URL de l'API backend
 * En production, utiliser les variables d'environnement
 */
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL ;

/**
 * Stores Svelte pour la réactivité
 */
export const csrfToken = writable(null);
export const csrfExpiresAt = writable(null);
export const isLoadingCsrf = writable(true);
export const csrfError = writable(null);

export const isLoggingIn = writable(false);
export const loginError = writable(null);
export const loginSuccess = writable(false);
export const currentUser = writable(null);

/**
 * Classe principale pour gérer l'authentification
 */
export class LoginManager {
    constructor() {
        this.csrfToken = null;
        this.csrfExpiresAt = null;
        
        // Initialiser le token CSRF automatiquement
        this.fetchCsrfToken();
    }
    
    /**
     * Récupère un token CSRF depuis l'API
     * @returns {Promise<void>}
     */
    async fetchCsrfToken() {
        try {
            isLoadingCsrf.set(true);
            csrfError.set(null);
            
            console.log('[Login] Récupération du token CSRF...');
            
            const response = await fetch(`${API_BASE_URL}/security/csrf-token`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success && data.csrfToken) {
                this.csrfToken = data.csrfToken;
                this.csrfExpiresAt = data.expiresAt;
                
                csrfToken.set(data.csrfToken);
                csrfExpiresAt.set(data.expiresAt);
                
                console.log('[Login] Token CSRF reçu:', {
                    token: data.csrfToken.substring(0, 10) + '...',
                    expiresIn: data.expiresIn + 's'
                });
                
                // Programmer le rafraîchissement du token avant expiration
                this.scheduleTokenRefresh(data.expiresIn);
                
            } else {
                throw new Error('Token CSRF non reçu');
            }
            
        } catch (error) {
            console.error('[Login] Erreur lors de la récupération du token CSRF:', error);
            csrfError.set(error.message);
        } finally {
            isLoadingCsrf.set(false);
        }
    }
    
    /**
     * Programme le rafraîchissement automatique du token CSRF
     * @param {number} expiresIn - Durée de validité en secondes
     */
    scheduleTokenRefresh(expiresIn) {
        // Rafraîchir 30 secondes avant l'expiration
        const refreshDelay = (expiresIn - 30) * 1000;
        
        if (refreshDelay > 0) {
            setTimeout(() => {
                console.log('[Login] Rafraîchissement automatique du token CSRF');
                this.fetchCsrfToken();
            }, refreshDelay);
        }
    }
    
    /**
     * Connexion avec username et password
     * @param {string} username - Nom d'utilisateur
     * @param {string} password - Mot de passe
     * @returns {Promise<Object>} - Données de l'utilisateur connecté
     */
    async login(username, password) {
        try {
            isLoggingIn.set(true);
            loginError.set(null);
            loginSuccess.set(false);
            
            // Vérifier qu'on a un token CSRF
            if (!this.csrfToken) {
                throw new Error('Token CSRF non disponible. Veuillez rafraîchir la page.');
            }
            
            console.log('[Login] Tentative de connexion pour:', username);
            
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    username,
                    password,
                    csrfToken: this.csrfToken
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || data.error || 'Erreur de connexion');
            }
            
            if (data.success) {
                console.log('[Login] Connexion réussie:', data.user);
                console.log('[Login] Cookie httpOnly créé par le serveur');
                
                currentUser.set(data.user);
                loginSuccess.set(true);
                
                return data.user;
            } else {
                throw new Error(data.message || 'Connexion échouée');
            }
            
        } catch (error) {
            console.error('[Login] Erreur lors de la connexion:', error);
            loginError.set(error.message);
            throw error;
        } finally {
            isLoggingIn.set(false);
        }
    }
    
    /**
     * Déconnexion
     * @returns {Promise<void>}
     */
    async logout() {
        try {
            console.log('[Login] Déconnexion...');
            
            const response = await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            
            const data = await response.json();
            
            if (data.success) {
                console.log('[Login] Déconnexion réussie, cookie supprimé par le serveur');
            }
            
        } catch (error) {
            console.error('[Login] Erreur lors de la déconnexion:', error);
        } finally {
            // Nettoyer les stores
            currentUser.set(null);
            loginSuccess.set(false);
        }
    }
    
    /**
     * Vérifie si un utilisateur est connecté (via le cookie httpOnly)
     * Appelle l'API pour vérifier le JWT dans le cookie
     * @returns {Promise<Object|null>} - Utilisateur connecté ou null
     */
    async checkAuthentication() {
        try {
            console.log('[Login] Vérification de l\'authentification via cookie...');
            
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include' // Important : envoie le cookie
            });
            
            if (!response.ok) {
                console.log('[Login] Pas d\'utilisateur connecté');
                return null;
            }
            
            const data = await response.json();
            
            if (data.success && data.user) {
                currentUser.set(data.user);
                loginSuccess.set(true);
                console.log('[Login] Utilisateur déjà connecté:', data.user);
                return data.user;
            }
            
            return null;
        } catch (error) {
            console.error('[Login] Erreur lors de la vérification de l\'authentification:', error);
            return null;
        }
    }
}

/**
 * Instance singleton du LoginManager
 */
export const loginManager = new LoginManager();

/**
 * Fonctions utilitaires pour les composants Svelte
 */
export const loginUtils = {
    /**
     * Valide le format d'un username
     */
    validateUsername(username) {
        if (!username || username.trim().length < 3) {
            return 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
        }
        return null;
    },
    
    /**
     * Valide le format d'un password
     */
    validatePassword(password) {
        if (!password || password.length < 6) {
            return 'Le mot de passe doit contenir au moins 6 caractères';
        }
        return null;
    },
    
    /**
     * Formate le temps restant avant expiration du token
     */
    formatTimeRemaining(expiresAt) {
        if (!expiresAt) return 'N/A';
        
        const now = Date.now();
        const remaining = Math.max(0, expiresAt - now);
        const seconds = Math.floor(remaining / 1000);
        const minutes = Math.floor(seconds / 60);
        
        if (minutes > 0) {
            return `${minutes}min ${seconds % 60}s`;
        }
        return `${seconds}s`;
    }
};

