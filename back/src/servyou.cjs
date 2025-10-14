const express = require('express');
const n8nRouter = require('./router/n8nRouter');
const securityRouter = require('./router/securityRouter');
const authRouter = require('./router/SecureRouter/secureN8nRouter');
const axios = require('axios');

const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

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

// Sécurité des headers HTTP avec Helmet
app.use(helmet({
  // Désactiver CSP car vous utilisez des scripts externes (GSAP, Umami, cdnjs)
  // Vous pourrez le réactiver plus tard avec une config précise
  contentSecurityPolicy: false,
  
  // HSTS seulement en production (force HTTPS)
  hsts: process.env.NODE_ENV === 'production',
  
  // Autres headers activés par défaut (bon pour vous) :
  // - X-Frame-Options: DENY (anti-clickjacking)
  // - X-Content-Type-Options: nosniff
  // - X-DNS-Prefetch-Control: off
  // - Referrer-Policy: no-referrer
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
    const umamiUrl =  process.env.UMAMI_INTERNAL_URL_PROD || 'http://umami_Codeurbase:3001' ;

    // Ping minimal : on interroge la racine ou /api/heartbeat mais sans insérer de session
    const response = await axios.get(`${umamiUrl}`, { timeout: 5000 });

    // Si le serveur répond, on renvoie "true" textuel pour le front
    if (response.status === 200) {
      console.log("response", response);
      res.json({ umami: "true", message: "Umami ping OK" });
    } else {
      res.json({ umami: "false", message: "Umami ping NOK" });
    }
  } catch (error) {
    res.json({ umami: "false", message: `Impossible de joindre Umami: ${error.message}` });
  }
});

// Route de health check pour phpMyAdmin
app.get('/health/phpmyadmin', async (req, res) => {
  try {
    const axios = require('axios');
    const phpmyadminUrl = process.env.PHPMYADMIN_INTERNAL_URL ;
    const response = await axios.get(phpmyadminUrl, { timeout: 5000 });
    res.json({ status: 'ok', phpmyadmin: response.status === 200 || response.status === 302 });
  } catch (error) {
    res.json({ status: 'error', phpmyadmin: false, error: error.message });
  }
});

// Rate limiting pour protéger contre les attaques par force brute
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Maximum 5 tentatives par IP
  message: { 
    success: false, 
    error: 'Trop de tentatives de connexion',
    message: 'Veuillez réessayer dans 15 minutes'
  },
  standardHeaders: true, // Retourne les infos de rate limit dans les headers `RateLimit-*`
  legacyHeaders: false // Désactive les headers `X-RateLimit-*`
});

app.use('/codeurbaseApi/n8n', n8nRouter);
app.use('/api/security', securityRouter);
app.use('/api/auth/login', loginLimiter); // Applique le rate limiting sur le login
app.use('/api/auth', authRouter);

app.listen(port, () => {
  console.log(`*********************Server is running on ${port} *************************`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log("Toutes les variables d'env:", process.env);

});
