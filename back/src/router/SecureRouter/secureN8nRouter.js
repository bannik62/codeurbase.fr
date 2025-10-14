const express = require('express');
const { csrfMiddleware, validateCsrfToken } = require('../../moduleOfSecurity/generatorCsrf');
const { generateToken, setAuthCookie, clearAuthCookie, authMiddleware, adminMiddleware } = require('../../moduleOfSecurity/jwtManagerSession');

const router = express.Router();

/**
 * Identifiants fictifs pour tester le système
 * Les mots de passe sont stockés dans les variables d'environnement
 * En production, utiliser une base de données avec des mots de passe hashés (bcrypt)
 */
const FAKE_USERS = [
  {
    id: 1,
    username: 'admin',
    password: process.env.TEST_ADMIN_PASSWORD,
    role: 'admin',
    email: 'admin@codeurbase.fr'
  },
  {
    id: 2,
    username: 'user',
    password: process.env.TEST_USER_PASSWORD,
    role: 'user',
    email: 'user@codeurbase.fr'
  },
  {
    id: 3,
    username: 'test',
    password: process.env.TEST_TEST_PASSWORD,
    role: 'user',
    email: 'test@codeurbase.fr'
  }
];

/**
 * POST /api/auth/login
 * Route d'authentification avec protection CSRF
 * 
 * Body attendu:
 * {
 *   username: string,
 *   password: string,
 *   csrfToken: string
 * }
 */
router.post('/login', (req, res) => {
  try {
    const { username, password, csrfToken } = req.body;
    
    // 1. Validation des champs requis
    if (!username || !password || !csrfToken) {
      return res.status(400).json({
        success: false,
        error: 'Champs manquants',
        message: 'Username, password et csrfToken sont requis'
      });
    }
    
    // 2. Validation du token CSRF
    if (!validateCsrfToken(csrfToken)) {
      return res.status(403).json({
        success: false,
        error: 'Token CSRF invalide ou expiré',
        message: 'Veuillez rafraîchir la page et réessayer'
      });
    }
    
    // 3. Vérification des credentials
    const user = FAKE_USERS.find(
      u => u.username === username && u.password === password
    );
    
    if (!user) {
      console.log(`[Auth] Tentative de connexion échouée pour: ${username}`);
      return res.status(401).json({
        success: false,
        error: 'Identifiants invalides',
        message: 'Nom d\'utilisateur ou mot de passe incorrect'
      });
    }
    
    // 4. Connexion réussie
    console.log(`[Auth] Connexion réussie pour: ${username} (${user.role})`);
    
    // Ne pas renvoyer le mot de passe !
    const { password: _, ...userWithoutPassword } = user;
    
    // Générer le JWT
    const token = generateToken(userWithoutPassword);
    
    // Créer le cookie httpOnly avec le JWT
    setAuthCookie(res, token);
    
    res.json({
      success: true,
      message: 'Connexion réussie',
      user: userWithoutPassword,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('[Auth] Erreur lors de la connexion:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur',
      message: 'Une erreur est survenue lors de la connexion',
      details: error.message
    });
  }
});

/**
 * GET /api/auth/verifySession
 * Vérifie simplement si la session (cookie JWT) est valide
 * Retourne un boolean
 */
router.get('/verifySession', (req, res) => {
  try {
    const { getTokenFromRequest, verifyToken } = require('../../moduleOfSecurity/jwtManagerSession');
    
    // Récupérer le token depuis le cookie
    const token = getTokenFromRequest(req);
    
    if (!token) {
      console.log('[Auth] Pas de token de session');
      return res.json({
        valid: false,
        message: 'Pas de session active'
      });
    }
    
    // Vérifier le token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      console.log('[Auth] Token de session invalide ou expiré');
      return res.json({
        valid: false,
        message: 'Session invalide ou expirée'
      });
    }
    
    console.log(`[Auth] Session valide pour: ${decoded.username}`);
    res.json({
      valid: true,
      user: decoded
    });
    
  } catch (error) {
    console.error('[Auth] Erreur lors de la vérification de session:', error);
    res.json({
      valid: false,
      message: 'Erreur lors de la vérification'
    });
  }
});

/**
 * GET /api/auth/me
 * Vérifie si l'utilisateur est connecté et retourne ses informations
 * Protégé par authMiddleware
 */
router.get('/me', authMiddleware, (req, res) => {
  try {
    // req.user est ajouté par authMiddleware après vérification du JWT
    res.json({
      success: true,
      user: req.user,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Auth] Erreur lors de la vérification:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur',
      details: error.message
    });
  }
});

/**
 * POST /api/auth/logout
 * Route de déconnexion - Supprime le cookie JWT
 */
router.post('/logout', (req, res) => {
  try {
    // Supprimer le cookie d'authentification
    clearAuthCookie(res);
    
    console.log('[Auth] Déconnexion réussie');
    
    res.json({
      success: true,
      message: 'Déconnexion réussie',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('[Auth] Erreur lors de la déconnexion:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur',
      details: error.message
    });
  }
});

/**
 * GET /api/auth/users (debug seulement)
 * Liste des utilisateurs fictifs disponibles
 * ⚠️ À désactiver en production !
 */
router.get('/users', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      success: false,
      error: 'Route désactivée en production'
    });
  }
  
  // Renvoyer les users sans les mots de passe
  const usersWithoutPasswords = FAKE_USERS.map(({ password, ...user }) => user);
  
  res.json({
    success: true,
    users: usersWithoutPasswords,
    message: '⚠️ Route de debug - désactiver en production'
  });
});

module.exports = router;

