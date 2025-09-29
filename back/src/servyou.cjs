const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config({ path: '/app/.env' });

// Debug des variables d'environnement
console.log('Variables d\'environnement chargées:', {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  FRONTEND_URL: process.env.FRONTEND_URL
});

const app = express();
const port = process.env.PORT;

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'https://codeurbase.fr',
    'http://codeurbase.fr',
    'http://localhost:5173'
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

app.get('/n8n', (req, res) => {
  res.json(false);
});
// Start the server
app.listen(port, () => {
  console.log(`*********************Server is running on ${port} *************************`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
