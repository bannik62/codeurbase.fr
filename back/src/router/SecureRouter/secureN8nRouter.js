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

/**
 * POST /auth/createArticle
 * Route sécurisée pour créer un article via N8N
 * Nécessite d'être authentifié et admin
 */
router.post('/createArticle', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { prompt } = req.body;
    
    // Validation
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Le prompt est requis'
      });
    }
    
    console.log(`[CreateArticle] Demande de création par ${req.user.username}`);
    console.log(`[CreateArticle] Prompt:`, prompt);
    
    // Appeler le webhook N8N
    const N8N_WEBHOOK_URL = process.env.N8N_WORKFLOW_CREATE_ARTICLE;
    
    console.log('[CreateArticle] N8N_WEBHOOK_URL:', N8N_WEBHOOK_URL);
    
    if (!N8N_WEBHOOK_URL) {
      return res.status(500).json({
        success: false,
        message: 'Webhook N8N non configuré'
      });
    }
    
    const axios = require('axios');
    
    console.log('[CreateArticle] Appel N8N avec payload:', {
      prompt: prompt.trim(),
      author: req.user.username,
      requestedBy: req.user.email
    });
    
    const n8nResponse = await axios.post(N8N_WEBHOOK_URL, {
      prompt: prompt.trim(),
      author: req.user.username,
      requestedBy: req.user.email
    }, { timeout: 120000 }); // 2 minutes timeout
    
    console.log('[CreateArticle] Réponse N8N:', n8nResponse.data);
    
    // N8N retourne un tableau avec output.validated et output.article
    const n8nData = n8nResponse.data[0]?.output || n8nResponse.data;
    
    console.log('[CreateArticle] Article extrait:', n8nData.article);
    
    // TODO: Sauvegarder en BDD si validé
    // if (n8nData.validated) {
    //   const Article = require('../../models/Article');
    //   await Article.create({
    //     ...n8nData.article,
    //     isPublished: true
    //   });
    // }
    
    res.json({
      success: true,
      message: 'Article généré avec succès',
      data: n8nData
    });
    
  } catch (error) {
    console.error('[CreateArticle] Erreur:', error);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || 'Erreur lors de la création de l\'article',
      error: error.message
    });
  }
});

/**
 * POST /auth/validateArticle
 * Route sécurisée pour valider et sauvegarder un article en BDD
 * Nécessite d'être authentifié et admin
 */
router.post('/validateArticle', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { article } = req.body;
    
    // Validation des données reçues
    if (!article) {
      return res.status(400).json({
        success: false,
        message: 'L\'article est requis'
      });
    }
    
    // Vérification des champs obligatoires
    const requiredFields = ['title', 'excerpt', 'content', 'category', 'author'];
    for (const field of requiredFields) {
      if (!article[field]) {
        return res.status(400).json({
          success: false,
          message: `Le champ ${field} est requis`
        });
      }
    }
    
    console.log(`[ValidateArticle] Demande de validation par ${req.user.username}`);
    console.log(`[ValidateArticle] Article reçu:`, article.title);
    
    // Import du modèle ArticleValidate
    const ArticleValidate = require('../../models/ArticleValidate');
    
    // Sauvegarde en BDD
    const savedArticle = await ArticleValidate.create({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      author: article.author,
      image: article.image || null,
      tags: article.tags || null,
      is_published: true
    });
    
    console.log(`[ValidateArticle] Article sauvegardé avec l'ID: ${savedArticle.id}`);
    
    res.json({
      success: true,
      message: 'Article validé et sauvegardé avec succès',
      data: {
        id: savedArticle.id,
        title: savedArticle.title,
        is_published: savedArticle.is_published
      }
    });
    
  } catch (error) {
    console.error('[ValidateArticle] Erreur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la validation de l\'article',
      error: error.message
    });
  }
});

/**
 * GET /api/articles
 * Route publique pour récupérer tous les articles publiés
 * Retourne la liste des articles pour l'affichage des cartes
 */
router.get('/articles', async (req, res) => {
  try {
    console.log('[Articles] Demande de récupération des articles');
    
    // Import du modèle ArticleValidate
    const ArticleValidate = require('../../models/ArticleValidate');
    
    // Récupérer tous les articles publiés, triés par date de création (plus récents en premier)
    const articles = await ArticleValidate.findAll({
      where: {
        is_published: true
      },
      order: [['created_at', 'DESC']],
      attributes: [
        'id',
        'title',
        'excerpt', 
        'content',
        'category',
        'author',
        'image',
        'tags',
        'is_published',
        'created_at',
        'updated_at'
      ]
    });
    
    console.log(`[Articles] ${articles.length} articles trouvés`);
    
    // Formater les articles pour le frontend
    const formattedArticles = articles.map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      author: article.author,
      image: article.image || 'https://via.placeholder.com/400x200?text=Article',
      tags: article.tags || [],
      date: article.created_at,
      createdAt: article.created_at,
      updatedAt: article.updated_at,
      is_published: article.is_published
    }));
    
    res.json({
      success: true,
      message: 'Articles récupérés avec succès',
      articles: formattedArticles,
      count: formattedArticles.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('[Articles] Erreur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des articles',
      error: error.message,
      articles: [],
      count: 0
    });
  }
});

module.exports = router;

