/**
 * Logique du tableau de bord administrateur
 * @author CodeurBase.fr
 * @version 1.0.0
 */

import { writable, derived } from 'svelte/store';
import { currentUser, loginManager } from './scriptLogin.js';

/**
 * Stores Svelte pour le tableau de bord
 */
export const isLoading = writable(false);
export const dashboardError = writable(null);
export const dashboardData = writable({
  stats: {
    totalUsers: 0,
    activeUsers: 0,
    totalSessions: 0,
    totalRequests: 0
  },
  recentActivity: [],
  systemStatus: 'ok'
});

/**
 * Store dérivé pour vérifier si l'utilisateur est admin
 */
export const isAdmin = derived(currentUser, $currentUser => {
  return $currentUser && $currentUser.role === 'admin';
});

/**
 * Classe principale pour gérer le tableau de bord
 */
export class AdminBoardManager {
  constructor() {
    this.initialized = false;
  }
  
  /**
   * Vérifie l'authentification de l'utilisateur
   * @returns {Promise<Object|null>} Utilisateur connecté ou null
   */
  async checkAuth() {
    return await loginManager.checkAuthentication();
  }
  
  /**
   * Initialise le tableau de bord
   * Charge les données initiales
   */
  async initialize() {
    if (this.initialized) return;
    
    try {
      isLoading.set(true);
      dashboardError.set(null);
      
      console.log('[AdminBoard] Initialisation du tableau de bord...');
      
      // Charger les données simulées
      await this.loadDashboardData();
      
      this.initialized = true;
      console.log('[AdminBoard] Tableau de bord initialisé');
      
    } catch (error) {
      console.error('[AdminBoard] Erreur lors de l\'initialisation:', error);
      dashboardError.set(error.message);
    } finally {
      isLoading.set(false);
    }
  }
  
  /**
   * Charge les données du tableau de bord
   * Pour l'instant, utilise des données fictives
   * TODO: Remplacer par de vraies requêtes API
   */
  async loadDashboardData() {
    // Simuler un délai de chargement
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Données fictives
    const mockData = {
      stats: {
        totalUsers: 42,
        activeUsers: 12,
        totalSessions: 156,
        totalRequests: 2847
      },
      recentActivity: [
        {
          id: 1,
          type: 'login',
          user: 'admin',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          message: 'Connexion réussie'
        },
        {
          id: 2,
          type: 'api_call',
          user: 'user',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          message: 'Appel API: /api/n8n/chatWithMe'
        },
        {
          id: 3,
          type: 'csrf_generated',
          user: 'system',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          message: 'Token CSRF généré'
        },
        {
          id: 4,
          type: 'login',
          user: 'test',
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          message: 'Connexion réussie'
        },
        {
          id: 5,
          type: 'logout',
          user: 'user',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          message: 'Déconnexion'
        }
      ],
      systemStatus: 'ok'
    };
    
    dashboardData.set(mockData);
    console.log('[AdminBoard] Données chargées:', mockData);
  }
  
  /**
   * Rafraîchit les données du tableau de bord
   */
  async refresh() {
    console.log('[AdminBoard] Rafraîchissement des données...');
    await this.loadDashboardData();
  }
  
  /**
   * Déconnecte l'utilisateur
   */
  async logout() {
    console.log('[AdminBoard] Déconnexion depuis le dashboard...');
    await loginManager.logout();
  }
  
  /**
   * Formate une date relative (ex: "il y a 5 minutes")
   */
  formatRelativeTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) {
      return `il y a ${diffSec}s`;
    } else if (diffMin < 60) {
      return `il y a ${diffMin}min`;
    } else if (diffHour < 24) {
      return `il y a ${diffHour}h`;
    } else {
      return `il y a ${diffDay}j`;
    }
  }
  
  /**
   * Formate un nombre avec des espaces (ex: 1000 -> "1 000")
   */
  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
  
  /**
   * Obtient l'icône appropriée pour un type d'activité
   */
  getActivityIcon(type) {
    const icons = {
      login: '🔐',
      logout: '🚪',
      api_call: '🔌',
      csrf_generated: '🛡️',
      error: '❌',
      warning: '⚠️',
      success: '✅'
    };
    return icons[type] || '📝';
  }
  
  /**
   * Obtient la couleur appropriée pour un type d'activité
   */
  getActivityColor(type) {
    const colors = {
      login: '#4caf50',
      logout: '#ff9800',
      api_call: '#2196f3',
      csrf_generated: '#9c27b0',
      error: '#f44336',
      warning: '#ff9800',
      success: '#4caf50'
    };
    return colors[type] || '#757575';
  }
}

/**
 * Instance singleton du AdminBoardManager
 */
export const adminBoardManager = new AdminBoardManager();

/**
 * Fonctions utilitaires pour les composants
 */
export const adminUtils = {
  formatRelativeTime: (timestamp) => adminBoardManager.formatRelativeTime(timestamp),
  formatNumber: (num) => adminBoardManager.formatNumber(num),
  getActivityIcon: (type) => adminBoardManager.getActivityIcon(type),
  getActivityColor: (type) => adminBoardManager.getActivityColor(type)
};

