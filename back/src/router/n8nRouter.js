const express = require('express');
const axios = require('axios');

const router = express.Router();

/**
 * Exemple : /api/n8n/helloWorld?prenom=Yoann&nom=Vanherzecke
 */
router.get("/helloWorld", async (req, res) => {
  try {
    const response = await axios.get(
      process.env.N8N_WORKFLOW_HELLO_LOCAL,
      { params: req.query }
    );

    res.json({
      route: "helloWorld",
      n8nResponse: response.data,
    });
  } catch (error) {
    console.error("Erreur appel N8N [helloWorld]:", error.message);
    res.status(500).json({
      error: "Impossible de joindre n8n",
      details: error.message,
    });
  }
});

/**
 * Tu pourras ajouter d'autres routes similaires ici
 * Exemple : /api/n8n/contactForm, /api/n8n/sendMail, etc.
 */
// router.post("/contactForm", async (req, res) => { ... });

module.exports = router;
