const express = require('express');
const { generateCsrfToken, getCsrfStats } = require('../moduleOfSecurity/generatorCsrf');

const router = express.Router();

/**
 * GET /api/security/csrf-token
 * Route générale pour obtenir un token CSRF
 * Utilisable pour le login, les appels n8n, et toute autre fonctionnalité nécessitant une protection CSRF
 */
router.get('/csrf-token', (req, res) => {
  try {
    const csrfData = generateCsrfToken();
    
    res.json({
      success: true,
      csrfToken: csrfData.token,
      expiresAt: csrfData.expiresAt,
      expiresIn: csrfData.expiresIn,
      message: 'Token CSRF généré avec succès'
    });
    
  } catch (error) {
    console.error('[Security Router] Erreur génération token CSRF:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la génération du token CSRF',
      details: error.message
    });
  }
});

/**
 * GET /api/security/csrf-stats
 * Route de debug pour voir les statistiques des tokens CSRF
 * À désactiver en production !
 */
router.get('/csrf-stats', (req, res) => {
  try {
    // Vérifier l'environnement de développement
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        error: 'Route désactivée en production'
      });
    }
    
    const stats = getCsrfStats();
    res.json({
      success: true,
      ...stats
    });
    
  } catch (error) {
    console.error('[Security Router] Erreur récupération stats CSRF:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des statistiques',
      details: error.message
    });
  }
});

module.exports = router;

