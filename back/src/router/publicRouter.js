const express = require('express');
const router = express.Router();

/**
 * GET /api/articles
 * Route publique pour récupérer tous les articles publiés
 * Retourne la liste des articles pour l'affichage des cartes
 */
router.get('/articles', async (req, res) => {
  try {
    console.log('[PublicArticles] Demande de récupération des articles');
    
    // Import du modèle ArticleValidate
    const ArticleValidate = require('../models/ArticleValidate');
    
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
    
    console.log(`[PublicArticles] ${articles.length} articles trouvés`);
    
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
    console.error('[PublicArticles] Erreur:', error);
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
