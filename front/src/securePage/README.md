# 🔐 Système d'authentification avec protection CSRF

## 📁 Architecture

```
securePage/
├── ModuleSecure/
│   ├── scriptLogin.js         # Logique d'authentification et gestion CSRF
│   └── script.AdminBoard.js   # Logique du tableau de bord admin
└── pages/
    ├── Login.svelte           # Page de connexion
    └── AdminBoard.svelte      # Tableau de bord administrateur
```

## 🔒 Sécurité CSRF + JWT

### Protection CSRF

1. **Lors du chargement de la page Login** :
   - Fetch automatique d'un token CSRF depuis `GET /api/security/csrf-token`
   - Le token est stocké dans un store Svelte réactif
   - Le token expire après 15 minutes
   - Un rafraîchissement automatique est programmé 30 secondes avant expiration

2. **Lors de la soumission du formulaire** :
   - Le token CSRF est envoyé avec les credentials vers `POST /api/auth/login`
   - Le backend valide le token avant de vérifier les credentials
   - Si le token est invalide ou expiré, la requête est rejetée avec un code 403

### Protection JWT avec cookies httpOnly 

1. **Après connexion réussie** :
   - Le serveur génère un JWT signé avec les données utilisateur
   - Le JWT est stocké dans un **cookie httpOnly** (protection XSS)
   - Le cookie a les options : `httpOnly`, `secure` (prod), `sameSite: strict`
   - Durée de validité : **24 heures**

2. **À chaque requête vers une route protégée** :
   - Le cookie est automatiquement envoyé par le navigateur
   - Le serveur vérifie le JWT via le middleware `authMiddleware`
   - Si le JWT est valide, `req.user` contient les données utilisateur
   - Si invalide ou expiré, retourne une erreur 401

3. **Protection double couche** :
   - ✅ CSRF : Protection contre les attaques Cross-Site Request Forgery
   - ✅ JWT httpOnly : Protection contre les attaques XSS (le token n'est pas accessible en JavaScript)

4. **Réutilisabilité** :
   ```javascript
   const { authMiddleware, adminMiddleware } = require('../moduleOfSecurity/jwtManager');
   
   // Route protégée (authentification requise)
   router.get('/protected', authMiddleware, (req, res) => {
     console.log('Utilisateur:', req.user);
     // ...
   });
   
   // Route admin (authentification + rôle admin requis)
   router.get('/admin-only', authMiddleware, adminMiddleware, (req, res) => {
     // Seuls les admins peuvent accéder
   });
   ```

## 🌐 API Endpoints

### Backend

#### Sécurité générale
- `GET /api/security/csrf-token` - Génère et retourne un token CSRF
- `GET /api/security/csrf-stats` - (Dev only) Statistiques des tokens CSRF

#### Authentification
- `POST /api/auth/login` - Connexion avec protection CSRF + création cookie JWT
- `GET /api/auth/me` - Vérifier l'authentification (protégé par JWT)
- `POST /api/auth/logout` - Déconnexion + suppression du cookie JWT
- `GET /api/auth/users` - (Dev only) Liste des utilisateurs fictifs

## 👤 Identifiants de test

| Username | Password  | Rôle  |
|----------|-----------|-------|
| `admin`  | `admin123`| admin |
| `user`   | `user123` | user  |
| `test`   | `test123` | user  |

⚠️ **Ces identifiants sont fictifs et stockés en clair dans le code. Ne JAMAIS utiliser en production !**

## 🚀 Comment tester

### 1. Démarrer le backend
```bash
cd /home/yo/project/codeurbase/back
npm run dev
```

### 2. Démarrer le frontend
```bash
cd /home/yo/project/codeurbase/front
npm run dev
```

### 3. Naviguer vers la page Login
- Ouvrir `http://localhost:5173` (ou votre port configuré)
- Naviguer vers le composant `Login.svelte`

### 4. Tester le flux d'authentification

#### Scénario 1 : Connexion réussie
1. La page charge → token CSRF apparaît avec l'icône 🔒
2. Entrer `admin` / `admin123`
3. Cliquer sur "Se connecter"
4. ✅ Message de succès + redirection vers AdminBoard (à implémenter)

#### Scénario 2 : Token CSRF expiré
1. Attendre 15 minutes (ou modifier `CSRF_TOKEN_EXPIRATION` dans `generatorCsrf.js` à 30 secondes pour tester)
2. Essayer de se connecter
3. ❌ Erreur "Token CSRF invalide ou expiré"
4. Cliquer sur "Réessayer" pour obtenir un nouveau token

#### Scénario 3 : Identifiants incorrects
1. Entrer des identifiants invalides
2. Cliquer sur "Se connecter"
3. ❌ Erreur "Nom d'utilisateur ou mot de passe incorrect"

## 🎨 Fonctionnalités UI

### Page Login
- ✅ Formulaire moderne et responsive
- ✅ Affichage du statut CSRF (chargement/succès/erreur)
- ✅ Validation côté client
- ✅ Affichage/masquage du mot de passe
- ✅ Messages d'erreur clairs
- ✅ Informations de debug (liste des identifiants fictifs)
- ✅ Design avec dégradé violet moderne

### Page AdminBoard
- ✅ Tableau de bord avec statistiques (données fictives)
- ✅ Activité récente avec icônes colorées
- ✅ Affichage du rôle utilisateur (admin/user)
- ✅ Bouton de rafraîchissement
- ✅ Bouton de déconnexion
- ✅ Design moderne et professionnel

## 🔧 Configuration

### Variables d'environnement Frontend
Créer un fichier `.env` dans `/front/` :
```bash
VITE_API_URL=http://localhost:3500
```

### Backend
Le serveur backend écoute sur le port défini dans `PORT_BACKEND` (par défaut 3500)

## 📝 TODO : Améliorations futures

### Priorité haute
- [x] ✅ Implémenter la navigation entre Login et AdminBoard (router Svelte)
- [x] ✅ Ajouter la gestion de sessions avec JWT et cookies httpOnly
- [ ] Stocker les tokens CSRF dans Redis au lieu de la mémoire (optionnel, uniquement si multi-serveurs)
- [ ] Hasher les mots de passe avec bcrypt
- [ ] Créer une vraie base de données utilisateurs

### Priorité moyenne
- [ ] Ajouter "Se souvenir de moi" avec cookies sécurisés
- [ ] Implémenter "Mot de passe oublié"
- [ ] Ajouter une limite de tentatives de connexion (rate limiting)
- [ ] Logs d'audit pour la sécurité
- [ ] Tests unitaires et d'intégration

### Priorité basse
- [ ] Support OAuth (Google, GitHub, etc.)
- [ ] Authentification à deux facteurs (2FA)
- [ ] Dashboard avec vraies données (connexion à la DB)

## 🐛 Debug

### Activer les logs détaillés
Tous les logs sont préfixés avec `[CSRF]`, `[Auth]`, `[Login]`, `[AdminBoard]`

### Tester manuellement l'API

#### Obtenir un token CSRF
```bash
curl http://localhost:3500/api/security/csrf-token
```

#### Se connecter avec le token
```bash
TOKEN="votre-token-csrf"
curl -X POST http://localhost:3500/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123",
    "csrfToken": "'$TOKEN'"
  }'
```

#### Voir les stats CSRF (dev only)
```bash
curl http://localhost:3500/api/security/csrf-stats
```

#### Lister les utilisateurs (dev only)
```bash
curl http://localhost:3500/api/auth/users
```

## 📚 Documentation du code

### Modules backend

#### `generatorCsrf.js`
- `generateCsrfToken()` - Génère un token CSRF
- `validateCsrfToken(token)` - Valide un token CSRF
- `invalidateCsrfToken(token)` - Invalide un token CSRF
- `csrfMiddleware` - Middleware Express pour protéger les routes contre CSRF
- `getCsrfStats()` - Statistiques (debug)

#### `jwtManager.js` ✨ NOUVEAU
- `generateToken(user)` - Génère un JWT pour un utilisateur
- `verifyToken(token)` - Vérifie et décode un JWT
- `authMiddleware` - Middleware Express pour vérifier l'authentification
- `adminMiddleware` - Middleware Express pour vérifier le rôle admin
- `setAuthCookie(res, token)` - Crée un cookie httpOnly avec le JWT
- `clearAuthCookie(res)` - Supprime le cookie d'authentification
- `getTokenFromRequest(req)` - Extrait le JWT depuis les cookies

#### `securityRouter.js`
- Routes générales de sécurité
- Route `/csrf-token` réutilisable

#### `secureN8nRouter.js`
- Routes d'authentification avec JWT
- Gestion des utilisateurs fictifs
- Routes protégées par JWT

### Modules frontend

#### `scriptLogin.js`
- `LoginManager` class - Gestion de l'authentification
- Stores Svelte réactifs (csrfToken, isLoading, loginError, etc.)
- Utilitaires de validation

#### `script.AdminBoard.js`
- `AdminBoardManager` class - Gestion du dashboard
- Stores Svelte pour les données du dashboard
- Fonctions d'affichage (formatage dates, nombres, etc.)

## 🔗 Intégration avec n8n

Pour protéger vos workflows n8n avec CSRF :

```javascript
// Dans n8nRouter.js ou secureN8nRouter.js
const { csrfMiddleware } = require('../moduleOfSecurity/generatorCsrf');

router.post('/protected-workflow', csrfMiddleware, async (req, res) => {
  // Le token CSRF est déjà validé par le middleware
  const response = await axios.post(process.env.N8N_WORKFLOW_URL, req.body);
  res.json(response.data);
});
```

Côté frontend :
```javascript
// Récupérer le token
const response = await fetch('/api/security/csrf-token');
const { csrfToken } = await response.json();

// Utiliser le token dans vos requêtes
await fetch('/api/auth/protected-workflow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    csrfToken: csrfToken,
    // ... vos données
  })
});
```

## 📞 Support

Pour toute question ou problème :
1. Vérifier les logs du backend et du frontend
2. Vérifier que les routes sont bien montées dans `servyou.cjs`
3. Vérifier les variables d'environnement
4. Tester manuellement les endpoints avec curl

---

**Auteur** : CodeurBase.fr  
**Version** : 1.0.0  
**Date** : 2025-01-11

