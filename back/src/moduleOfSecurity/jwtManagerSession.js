const jwt = require('jsonwebtoken');

/**
 * Clé secrète pour signer les JWT
 * ⚠️ EN PRODUCTION : Utiliser une vraie clé secrète longue et complexe stockée dans les variables d'environnement
 */
const JWT_SECRET = process.env.JWT_SECRET ;

/**
 * Durée de validité du token (24 heures)
 */
const JWT_EXPIRATION = '24h';

/**
 * Options pour le cookie
 */
const COOKIE_OPTIONS = {
  httpOnly: true,        // Pas accessible via JavaScript (protection XSS)
  secure: process.env.NODE_ENV === 'production', // HTTPS uniquement en production
  sameSite: 'strict',    // Protection CSRF supplémentaire
  maxAge: 24 * 60 * 60 * 1000, // 24 heures en millisecondes
  path: '/'
};

/**
 * Génère un token JWT pour un utilisateur
 * @param {Object} user - Données de l'utilisateur (sans le mot de passe !)
 * @returns {string} Token JWT signé
 */
function generateToken(user) {
  // Payload du token (données publiques, pas de mot de passe !)
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
    email: user.email
  };
  
  // Options du token
  const options = {
    expiresIn: JWT_EXPIRATION,
    issuer: 'codeurbase.fr',
    subject: user.id.toString()
  };
  
  // Signer le token
  const token = jwt.sign(payload, JWT_SECRET, options);
  
  console.log(`[JWT] Token généré pour l'utilisateur: ${user.username}`);
  
  return token;
}

/**
 * Vérifie et décode un token JWT
 * @param {string} token - Token JWT à vérifier
 * @returns {Object|null} Données décodées du token ou null si invalide
 */
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(`[JWT] Token valide pour l'utilisateur: ${decoded.username}`);
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.log('[JWT] Token expiré');
    } else if (error.name === 'JsonWebTokenError') {
      console.log('[JWT] Token invalide:', error.message);
    } else {
      console.log('[JWT] Erreur de vérification:', error.message);
    }
    return null;
  }
}

/**
 * Middleware Express pour vérifier l'authentification via JWT
 * Ajoute req.user si le token est valide
 */
function authMiddleware(req, res, next) {
  try {
    // Récupérer le token depuis le cookie
    const token = req.cookies?.authToken;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Non authentifié',
        message: 'Vous devez être connecté pour accéder à cette ressource'
      });
    }
    
    // Vérifier le token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({
        success: false,
        error: 'Token invalide ou expiré',
        message: 'Veuillez vous reconnecter'
      });
    }
    
    // Ajouter les données utilisateur à la requête
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('[Auth Middleware] Erreur:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur',
      details: error.message
    });
  }
}

/**
 * Middleware Express pour vérifier le rôle admin
 * À utiliser après authMiddleware
 */
function adminMiddleware(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Non authentifié',
      message: 'Vous devez être connecté'
    });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Accès refusé',
      message: 'Cette ressource est réservée aux administrateurs'
    });
  }
  
  next();
}

/**
 * Crée un cookie d'authentification avec le JWT
 * @param {Object} res - Objet response Express
 * @param {string} token - Token JWT
 */
function setAuthCookie(res, token) {
  res.cookie('authToken', token, COOKIE_OPTIONS);
  console.log('[JWT] Cookie d\'authentification créé');
}

/**
 * Supprime le cookie d'authentification
 * @param {Object} res - Objet response Express
 */
function clearAuthCookie(res) {
  res.clearCookie('authToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  });
  console.log('[JWT] Cookie d\'authentification supprimé');
}

/**
 * Extrait le token depuis les cookies de la requête
 * @param {Object} req - Objet request Express
 * @returns {string|null} Token ou null
 */
function getTokenFromRequest(req) {
  return req.cookies?.authToken || null;
}

module.exports = {
  generateToken,
  verifyToken,
  authMiddleware,
  adminMiddleware,
  setAuthCookie,
  clearAuthCookie,
  getTokenFromRequest,
  COOKIE_OPTIONS
};

