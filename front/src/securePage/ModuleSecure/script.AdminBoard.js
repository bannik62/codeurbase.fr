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
      
      // Charger les vraies données depuis l'API
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
   * Charge les données du tableau de bord depuis l'API
   */
  async loadDashboardData() {
    try {
      const BACKEND_URL = import.meta.env.BACKEND_URL || 'https://backend.codeurbase.fr';
      
      // Récupérer les statistiques générales
      const generalResponse = await fetch(`${BACKEND_URL}/auth/admin/stats/general`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      
      if (!generalResponse.ok) {
        throw new Error(`Erreur API: ${generalResponse.status}`);
      }
      
      const generalData = await generalResponse.json();
      
      if (!generalData.success) {
        throw new Error(generalData.message || 'Erreur lors de la récupération des données');
      }
      
      // Récupérer les statistiques des utilisateurs
      const usersResponse = await fetch(`${BACKEND_URL}/auth/admin/stats/users`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      
      let usersData = { data: { total: 0, active: 0, inactive: 0, byRole: [] } };
      if (usersResponse.ok) {
        const usersResult = await usersResponse.json();
        if (usersResult.success) {
          usersData = usersResult;
        }
      }
      
      // Construire les données du dashboard
      const dashboardStats = {
        totalUsers: generalData.data.users.total,
        activeUsers: generalData.data.users.active,
        totalSessions: generalData.data.sessions.active,
        totalRequests: generalData.data.requests.articles
      };
      
      // Données d'activité récente (simulées pour l'instant)
      const recentActivity = [
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
          user: 'system',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          message: `Appel API: /api/articles (${generalData.data.requests.articles} total)`
        },
        {
          id: 3,
          type: 'stats',
          user: 'system',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          message: `Sessions actives: ${generalData.data.sessions.active}`
        }
      ];
      
      const realData = {
        stats: dashboardStats,
        recentActivity: recentActivity,
        systemStatus: 'ok'
      };
      
      dashboardData.set(realData);
      console.log('[AdminBoard] Données réelles du tableau de bord chargées:', realData);
      
    } catch (error) {
      console.error('[AdminBoard] Erreur lors du chargement des données:', error);
      throw error;
    }
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

