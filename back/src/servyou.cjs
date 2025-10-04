const express = require('express');
const n8nRouter = require('./router/n8nRouter');

const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

// Debug des variables d'environnement
console.log('Variables d\'environnement chargées:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT_BACKEND: process.env.PORT,
  FRONTEND_URL: process.env.FRONTEND_URL,
  N8N_WORKFLOW_HELLO_LOCAL: process.env.N8N_WORKFLOW_HELLO_LOCAL
});

const app = express();
const port = process.env.PORT_BACKEND;

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://127.0.0.1:5678',
    'http://localhost:5678',
    'https://codeurbase.fr',
    'http://codeurbase.fr',
    'http://localhost:5173',
    'http://127.0.0.1:5173'
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Route de test pour vérifier que tout fonctionne
app.get('/', (req, res) => {
  res.json(true);
});

// Route de health check pour Umami
app.get('/health/umami', async (req, res) => {
  try {
    const axios = require('axios');
    const umamiUrl = process.env.UMAMI_INTERNAL_URL || 'http://umami_Codeurbase:3000';
    const response = await axios.get(umamiUrl, { timeout: 5000 });

    // Renvoi en texte pour le frontend
    res.json({
      umami: response.status  ? "true" : "false",
      message: response.status === 200 ? 'Umami OK' : 'Umami responded with error'
    });
  } catch (error) {
    res.json({
      umami: "false",
      message: `Impossible de joindre Umami: ${error.message}`
    });
  }
});


// Route de health check pour phpMyAdmin
app.get('/health/phpmyadmin', async (req, res) => {
  try {
    const axios = require('axios');
    const phpmyadminUrl = process.env.PHPMYADMIN_INTERNAL_URL || 'http://phpmyadmin_codeurbase:80';
    const response = await axios.get(phpmyadminUrl, { timeout: 5000 });
    res.json({ status: 'ok', phpmyadmin: response.status === 200 || response.status === 302 });
  } catch (error) {
    res.json({ status: 'error', phpmyadmin: false, error: error.message });
  }
});

app.use('/codeurbaseApi/n8n', n8nRouter);
// Start the server


app.listen(port, () => {
  console.log(`*********************Server is running on ${port} *************************`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log("Toutes les variables d'env:", process.env);

});
