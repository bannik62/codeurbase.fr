const express = require('express');
const { authMiddleware, adminMiddleware } = require('../../moduleOfSecurity/jwtManagerSession');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Store pour les sessions actives (en production, utiliser Redis ou une DB)
const activeSessions = new Map();

/**
 * Fonction pour nettoyer les sessions expirées
 */
function cleanExpiredSessions() {
  const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000);
  for (const [token, timestamp] of activeSessions.entries()) {
    if (timestamp < thirtyMinutesAgo) {
      activeSessions.delete(token);
    }
  }
}

/**
 * Fonction pour ajouter une session active
 */
function addActiveSession(token) {
  activeSessions.set(token, Date.now());
  // Nettoyer les sessions expirées
  cleanExpiredSessions();
}

/**
 * Fonction pour compter les sessions actives
 */
function getActiveSessionsCount() {
  cleanExpiredSessions();
  return activeSessions.size;
}

/**
 * GET /auth/admin/stats/articles
 * Route sécurisée pour récupérer les statistiques des articles
 * Nécessite d'être authentifié et admin
 */
router.get('/articles', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    console.log(`[AdminStats] Demande de stats articles par ${req.user.username}`);
    
    // Ajouter la session actuelle
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      addActiveSession(token);
    }
    
    // Import du modèle ArticleValidate
    const ArticleValidate = require('../../models/ArticleValidate');
    
    // Compter tous les articles
    const totalArticles = await ArticleValidate.count();
    
    // Compter les articles publiés
    const publishedArticles = await ArticleValidate.count({
      where: { is_published: true }
    });
    
    // Compter les articles non publiés
    const draftArticles = await ArticleValidate.count({
      where: { is_published: false }
    });
    
    // Articles créés aujourd'hui
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const articlesToday = await ArticleValidate.count({
      where: {
        created_at: {
          [require('sequelize').Op.gte]: today
        }
      }
    });
    
    // Articles créés cette semaine
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const articlesThisWeek = await ArticleValidate.count({
      where: {
        created_at: {
          [require('sequelize').Op.gte]: weekAgo
        }
      }
    });
    
    // Articles par catégorie
    const articlesByCategory = await ArticleValidate.findAll({
      attributes: [
        'category',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      where: { is_published: true },
      group: ['category'],
      raw: true
    });
    
    // Articles récents (5 derniers)
    const recentArticles = await ArticleValidate.findAll({
      where: { is_published: true },
      order: [['created_at', 'DESC']],
      limit: 5,
      attributes: ['id', 'title', 'category', 'author', 'created_at']
    });
    
    const stats = {
      total: totalArticles,
      published: publishedArticles,
      drafts: draftArticles,
      today: articlesToday,
      thisWeek: articlesThisWeek,
      byCategory: articlesByCategory,
      recent: recentArticles
    };
    
    console.log(`[AdminStats] Stats articles récupérées:`, stats);
    
    res.json({
      success: true,
      message: 'Statistiques des articles récupérées avec succès',
      data: stats,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('[AdminStats] Erreur stats articles:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques des articles',
      error: error.message
    });
  }
});

/**
 * GET /auth/admin/stats/users
 * Route sécurisée pour récupérer les statistiques des utilisateurs
 * Nécessite d'être authentifié et admin
 */
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    console.log(`[AdminStats] Demande de stats utilisateurs par ${req.user.username}`);
    
    // Ajouter la session actuelle
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      addActiveSession(token);
    }
    
    // Import du modèle Users
    const User = require('../../models/Users');
    
    // Compter tous les utilisateurs
    const totalUsers = await User.count();
    
    // Compter les utilisateurs actifs
    const activeUsers = await User.count({
      where: { isActive: true }
    });
    
    // Compter par rôle
    const usersByRole = await User.findAll({
      attributes: [
        'role',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['role'],
      raw: true
    });
    
    const stats = {
      total: totalUsers,
      active: activeUsers,
      inactive: totalUsers - activeUsers,
      byRole: usersByRole
    };
    
    console.log(`[AdminStats] Stats utilisateurs récupérées:`, stats);
    
    res.json({
      success: true,
      message: 'Statistiques des utilisateurs récupérées avec succès',
      data: stats,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('[AdminStats] Erreur stats utilisateurs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques des utilisateurs',
      error: error.message
    });
  }
});

/**
 * GET /auth/admin/stats/general
 * Route sécurisée pour récupérer les statistiques générales
 * Nécessite d'être authentifié et admin
 */
router.get('/general', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    console.log(`[AdminStats] Demande de stats générales par ${req.user.username}`);
    
    const ArticleValidate = require('../../models/ArticleValidate');
    const User = require('../../models/Users');
    
    // Ajouter la session actuelle
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      addActiveSession(token);
    }
    
    // Stats générales
    const totalArticles = await ArticleValidate.count();
    const publishedArticles = await ArticleValidate.count({ where: { is_published: true } });
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { isActive: true } });
    
    // Articles créés ce mois
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    const articlesThisMonth = await ArticleValidate.count({
      where: {
        created_at: {
          [require('sequelize').Op.gte]: thisMonth
        }
      }
    });
    
    // Sessions actives (connexions < 30 minutes)
    const activeSessionsCount = getActiveSessionsCount();
    
    // Requêtes articles (via compteur)
    const publicRouter = require('../publicRouter');
    const articlesRequests = publicRouter.getArticlesRequestCount ? publicRouter.getArticlesRequestCount() : 0;
    
    const stats = {
      articles: {
        total: totalArticles,
        published: publishedArticles,
        thisMonth: articlesThisMonth
      },
      users: {
        total: totalUsers,
        active: activeUsers
      },
      sessions: {
        active: activeSessionsCount
      },
      requests: {
        articles: articlesRequests
      },
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        nodeVersion: process.version
      }
    };
    
    console.log(`[AdminStats] Stats générales récupérées:`, stats);
    
    res.json({
      success: true,
      message: 'Statistiques générales récupérées avec succès',
      data: stats,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('[AdminStats] Erreur stats générales:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques générales',
      error: error.message
    });
  }
});

module.exports = router;
