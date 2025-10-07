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
      
      // Préparer les paramètres pour N8N (GET avec query parameters)
      // Récupérer la vraie IP du client (pas du proxy Docker)
      const clientIP = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection.remoteAddress || req.ip || 'anonymous';
      const cleanIP = clientIP.split(',')[0].trim(); // Prendre la première IP si plusieurs
      
      const n8nParams = {
        message: message,
        timestamp: timestamp || new Date().toISOString(),
        userId: cleanIP,
        sessionId: sessionId || `user-${cleanIP}` // Utiliser sessionId du frontend ou fallback IP
      };

      console.log("SessionId reçu du frontend:", sessionId);
      console.log("Envoi vers N8N:", n8nParams);

      // Appel N8N avec GET (container Docker)
      const n8nResponse = await axios.get('http://n8n_codeurbase:5678/webhook/98adabbc-d0a1-4b60-adbb-60b150d1bcb0', { 
        params: n8nParams,
        timeout: 30000 // 30 secondes de timeout
      });

      console.log("Réponse N8N:", n8nResponse.data);

      res.json({
        message: n8nResponse.data.message || n8nResponse.data.response || "Réponse générée avec succès",
        success: true,
        n8nResponse: n8nResponse.data,
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
 * Tu pourras ajouter d'autres routes similaires ici
 * Exemple : /api/n8n/contactForm, /api/n8n/sendMail, etc.
 */
// router.post("/contactForm", async (req, res) => { ... });

module.exports = router;
