const express = require('express');
const axios = require('axios');

const router = express.Router();
 
/**
 * Exemple : /api/n8n/helloWorld?prenom=Yoann&nom=Vanherzecke
 */
router.get("/helloWorld", async (req, res) => {
    try {
      // Appel N8N
      const response = await axios.get(process.env.N8N_WORKFLOW_HELLO_LOCAL, { params: req.query });

  
      // Toujours renvoyer le tableau N8N tel quel
      res.json({
        route: "helloWorld",
        n8nResponse: response.data // tableau N8N intact
      });
  
    } catch (error) {
      console.error("Erreur appel N8N [helloWorld]:", error.message);
      res.status(500).json({
        error: "Impossible de joindre n8n",
        details: error.message,
      });
    }
  });



  router.post("/chatWithMe", async (req, res) => {
    try {
      const { message, timestamp, sessionId } = req.body;
      console.log("Message reçu du frontend:", message);
      console.log("Timestamp reçu du frontend:", timestamp);
      console.log("SessionId reçu du frontend:", sessionId);
      
      // Récupérer la vraie IP du client (pas du proxy Docker)
      const clientIP = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection.remoteAddress || req.ip || 'anonymous';
      const cleanIP = clientIP.split(',')[0].trim(); // Prendre la première IP si plusieurs
      
      const n8nParams = {
        message: message,
        timestamp: timestamp || new Date().toISOString(),
        userId: cleanIP,
        sessionId: sessionId || `user-${cleanIP}` // Utiliser sessionId du frontend ou fallback IP
      };
  
      console.log("Envoi vers N8N:", n8nParams);
  
      // Appel N8N avec POST et JSON body
      const n8nResponse = await axios.post(
        process.env.N8N_WORKFLOW_CHAT_WITH_ME_LOCAL || 'http://n8n_codeurbase:5678/webhook/98adabbc-d0a1-4b60-adbb-60b150d1bcb0',
        n8nParams, // <- JSON directement dans le body
        { timeout: 30000 } // 30 secondes
      );
  
      console.log("Réponse N8N:", n8nResponse.data);
  
      // Renvoi la réponse reçue de N8N au frontend
      res.json({
        ...n8nResponse.data[0],
        timestamp: new Date().toISOString()
      });
      
  
    } catch (error) {
      console.error("Erreur appel N8N [chatWithMe POST]:", error.message);
      
      // En cas d'erreur N8N, retourner une réponse de fallback
      res.json({
        message: "Désolé, je ne peux pas répondre pour le moment. Veuillez réessayer plus tard.",
        success: false,
        error: "N8N indisponible",
        timestamp: new Date().toISOString()
      });
    }
  });
  

/**
 * GET /codeurbaseApi/articlesRead
 * Route pour récupérer les articles de blog
 * 
 * TODO: Remplacer par Article.findAll() quand la BDD sera prête
 */
router.get("/articlesRead", async (req, res) => {
  try {
    // TODO: Quand la BDD sera prête, utiliser :
    // const Article = require('../models/Article');
    // const articles = await Article.findAll({ 
    //   where: { isPublished: true },
    //   order: [['createdAt', 'DESC']]
    // });
    
    // Pour l'instant, articles hardcodés de test
    const articlesTest = [
      {
        id: 1,
        title: "Article de test généré par IA",
        excerpt: "Ceci est un article de test en attendant la mise en place de la base de données et de l'agent N8N.",
        content: "<p>Contenu complet de l'article de test.</p>",
        category: "développement",
        author: "Yohann",
        image: "/src/assets/blog/default-robot.svg",
        tags: ["test", "ia", "blog"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        title: "Design moderne avec Svelte",
        excerpt: "Découvrez comment créer des interfaces modernes et réactives avec Svelte 5.",
        content: "<p>Contenu sur le design avec Svelte.</p>",
        category: "design",
        author: "Yohann",
        image: "/src/assets/blog/default-robot.svg",
        tags: ["svelte", "design", "ui"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 3,
        title: "Tutoriel Node.js et Express",
        excerpt: "Apprenez à créer une API REST complète avec Node.js et Express.",
        content: "<p>Tutoriel complet sur Node.js.</p>",
        category: "tutoriel",
        author: "Yohann",
        image: "/src/assets/blog/default-robot.svg",
        tags: ["nodejs", "express", "api"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    res.json({
      success: true,
      articles: articlesTest,
      total: articlesTest.length
    });
    
  } catch (error) {
    console.error("Erreur lors de la récupération des articles:", error.message);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des articles",
      details: error.message,
      articles: []
    });
  }
});

/**
 * Tu pourras ajouter d'autres routes similaires ici
 * Exemple : /api/n8n/contactForm, /api/n8n/sendMail, etc.
 */
// router.post("/contactForm", async (req, res) => { ... });

module.exports = router;
