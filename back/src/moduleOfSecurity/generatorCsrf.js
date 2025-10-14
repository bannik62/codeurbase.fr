const crypto = require('crypto');

/**
 * Store temporaire des tokens CSRF en mémoire
 * En production, utiliser Redis ou une base de données
 * Format: Map<token, { createdAt, expiresAt }>
 */
const csrfTokenStore = new Map();

/**
 * Durée de validité d'un token CSRF (15 minutes)
 */
const CSRF_TOKEN_EXPIRATION = 15 * 60 * 1000; // 15 minutes en millisecondes

/**
 * Nettoyage automatique des tokens expirés toutes les 5 minutes
 */
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of csrfTokenStore.entries()) {
    if (data.expiresAt < now) {
      csrfTokenStore.delete(token);
      console.log(`[CSRF] Token expiré supprimé: ${token.substring(0, 10)}...`);
    }
  }
}, 5 * 60 * 1000);

/**
 * Génère un token CSRF unique et sécurisé
 * @returns {Object} { token: string, expiresAt: number }
 */
function generateCsrfToken() {
  // Générer un token aléatoire de 32 bytes (64 caractères en hex)
  const token = crypto.randomBytes(32).toString('hex');
  
  const now = Date.now();
  const expiresAt = now + CSRF_TOKEN_EXPIRATION;
  
  // Stocker le token avec sa date d'expiration
  csrfTokenStore.set(token, {
    createdAt: now,
    expiresAt: expiresAt
  });
  
  console.log(`[CSRF] Nouveau token généré: ${token.substring(0, 10)}... (expire dans ${CSRF_TOKEN_EXPIRATION / 1000}s)`);
  
  return {
    token,
    expiresAt,
    expiresIn: CSRF_TOKEN_EXPIRATION / 1000 // en secondes
  };
}

/**
 * Valide un token CSRF
 * @param {string} token - Le token à valider
 * @returns {boolean} true si le token est valide, false sinon
 */
function validateCsrfToken(token) {
  if (!token || typeof token !== 'string') {
    console.log('[CSRF] Token invalide: format incorrect');
    return false;
  }
  
  const tokenData = csrfTokenStore.get(token);
  
  if (!tokenData) {
    console.log(`[CSRF] Token invalide: non trouvé dans le store`);
    return false;
  }
  
  const now = Date.now();
  
  if (tokenData.expiresAt < now) {
    console.log(`[CSRF] Token expiré`);
    csrfTokenStore.delete(token);
    return false;
  }
  
  console.log(`[CSRF] Token validé avec succès: ${token.substring(0, 10)}...`);
  return true;
}

/**
 * Invalide un token CSRF (le supprime du store)
 * Utile après utilisation pour éviter la réutilisation
 * @param {string} token - Le token à invalider
 */
function invalidateCsrfToken(token) {
  if (csrfTokenStore.has(token)) {
    csrfTokenStore.delete(token);
    console.log(`[CSRF] Token invalidé: ${token.substring(0, 10)}...`);
    return true;
  }
  return false;
}

/**
 * Middleware Express pour valider le token CSRF dans les requêtes
 * Cherche le token dans le body, les headers ou la query
 */
function csrfMiddleware(req, res, next) {
  // Récupérer le token depuis différentes sources possibles
  const token = req.body?.csrfToken || 
                req.headers['x-csrf-token'] || 
                req.query?.csrfToken;
  
  if (!validateCsrfToken(token)) {
    return res.status(403).json({
      success: false,
      error: 'Token CSRF invalide ou expiré',
      message: 'Veuillez rafraîchir la page et réessayer'
    });
  }
  
  // Optionnel: invalider le token après utilisation (one-time use)
  // invalidateCsrfToken(token);
  
  next();
}

/**
 * Obtenir les statistiques du store CSRF (pour debug)
 */
function getCsrfStats() {
  return {
    totalTokens: csrfTokenStore.size,
    tokens: Array.from(csrfTokenStore.entries()).map(([token, data]) => ({
      token: token.substring(0, 10) + '...',
      createdAt: new Date(data.createdAt).toISOString(),
      expiresAt: new Date(data.expiresAt).toISOString(),
      isExpired: data.expiresAt < Date.now()
    }))
  };
}

module.exports = {
  generateCsrfToken,
  validateCsrfToken,
  invalidateCsrfToken,
  csrfMiddleware,
  getCsrfStats
};

