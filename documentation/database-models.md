# 🗄️ Documentation Base de Données - CodeurBase

## 📋 Table des matières
- [Configuration de la base de données](#configuration-de-la-base-de-données)
- [Architecture des modèles](#architecture-des-modèles)
- [Modèle ArticleValidate](#modèle-articlevalidate)
- [Modèle Users](#modèle-users)
- [Connexion à la base de données](#connexion-à-la-base-de-données)
- [Migrations](#migrations)
- [Utilisation des modèles](#utilisation-des-modèles)

---

## 🔧 Configuration de la base de données

### Fichier de configuration
**Localisation :** `back/config/database.js`

```javascript
module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'codeurbase_dev',
    host: process.env.DB_HOST || 'db',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: console.log,
    timezone: '+01:00'
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    timezone: '+01:00'
  }
};
```

### Variables d'environnement
**Fichier :** `.env`

```env
NODE_ENV=production
DB_HOST=db
DB_PORT=3306
DB_NAME=codeurbase_prod
DB_USER=root
DB_PASSWORD=password
```

---

## 🏗️ Architecture des modèles

### Structure des fichiers
```
back/src/models/
├── index.js              # Configuration Sequelize principale
├── ArticleValidate.js    # Modèle pour les articles validés
└── Users.js             # Modèle pour les utilisateurs
```

### Configuration globale Sequelize
**Fichier :** `back/src/models/index.js`

```javascript
const { Sequelize } = require('sequelize');
const process = require('process');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/database.js')[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    ...config,
    define: {
      underscored: true  // Utilise created_at/updated_at au lieu de createdAt/updatedAt
    }
  }
);

sequelize.authenticate()
    .then(() => console.log('Database connected!'))
    .catch(err => console.error('Database connection error:', err));

module.exports = sequelize;
```

**Points clés :**
- ✅ Configuration centralisée
- ✅ Support multi-environnements (dev/prod)
- ✅ `underscored: true` pour compatibilité avec les migrations
- ✅ Gestion automatique des timestamps

---

## 📰 Modèle ArticleValidate

### Définition
**Fichier :** `back/src/models/ArticleValidate.js`

```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('./index.js');

const ArticleValidate = sequelize.define('ArticleValidate', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  excerpt: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  author: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true
  },
  is_published: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'article_validates',
  timestamps: true  // Ajoute created_at et updated_at automatiquement
});

module.exports = ArticleValidate;
```

### Champs de la table
| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | Identifiant unique |
| `title` | VARCHAR(255) | NOT NULL | Titre de l'article |
| `excerpt` | TEXT | NOT NULL | Résumé de l'article |
| `content` | TEXT | NOT NULL | Contenu HTML de l'article |
| `category` | VARCHAR(100) | NOT NULL | Catégorie de l'article |
| `author` | VARCHAR(100) | NOT NULL | Auteur de l'article |
| `image` | VARCHAR(500) | NULL | URL de l'image |
| `tags` | JSON | NULL | Tags de l'article |
| `is_published` | BOOLEAN | DEFAULT false | Statut de publication |
| `created_at` | DATETIME | NOT NULL | Date de création |
| `updated_at` | DATETIME | NOT NULL | Date de modification |

---

## 👥 Modèle Users

### Définition
**Fichier :** `back/src/models/Users.js`

```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('./index.js');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 50]
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'users',
  timestamps: true
});

module.exports = User;
```

### Champs de la table
| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | Identifiant unique |
| `username` | VARCHAR(50) | NOT NULL, UNIQUE | Nom d'utilisateur |
| `email` | VARCHAR(100) | NOT NULL, UNIQUE | Adresse email |
| `password` | VARCHAR(255) | NOT NULL | Mot de passe hashé |
| `role` | ENUM | DEFAULT 'user' | Rôle (user/admin) |
| `isActive` | BOOLEAN | DEFAULT true | Statut actif |
| `created_at` | DATETIME | NOT NULL | Date de création |
| `updated_at` | DATETIME | NOT NULL | Date de modification |

---

## 🔌 Connexion à la base de données

### Initialisation
```javascript
const sequelize = require('./models/index.js');
```

### Vérification de connexion
```javascript
sequelize.authenticate()
    .then(() => console.log('Database connected!'))
    .catch(err => console.error('Database connection error:', err));
```

### Configuration Docker
**Fichier :** `docker-compose.yml`

```yaml
services:
  database_codeurbase:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: codeurbase_prod
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"
```

---

## 🚀 Migrations

### Commandes principales
```bash
# Vérifier l'état des migrations
NODE_ENV=production npx sequelize-cli db:migrate:status

# Exécuter les migrations
NODE_ENV=production npx sequelize-cli db:migrate

# Annuler la dernière migration
NODE_ENV=production npx sequelize-cli db:migrate:undo

# Annuler toutes les migrations
NODE_ENV=production npx sequelize-cli db:migrate:undo:all
```

### Fichiers de migration
- `20251015201955-create-article-validates.js`
- `20251015202000-create-users.js`

---

## 💻 Utilisation des modèles

### Import des modèles
```javascript
// Import direct
const ArticleValidate = require('./models/ArticleValidate');
const User = require('./models/Users');

// Import de sequelize
const sequelize = require('./models/index.js');
```

### Opérations CRUD

#### Créer un article
```javascript
const article = await ArticleValidate.create({
  title: 'Mon article',
  excerpt: 'Résumé de l\'article',
  content: '<p>Contenu HTML</p>',
  category: 'tutoriel',
  author: 'admin',
  is_published: true
});
```

#### Lire des articles
```javascript
// Tous les articles
const articles = await ArticleValidate.findAll();

// Articles publiés
const publishedArticles = await ArticleValidate.findAll({
  where: { is_published: true }
});

// Article par ID
const article = await ArticleValidate.findByPk(1);
```

#### Mettre à jour un article
```javascript
await ArticleValidate.update(
  { is_published: true },
  { where: { id: 1 } }
);
```

#### Supprimer un article
```javascript
await ArticleValidate.destroy({
  where: { id: 1 }
});
```

### Exemple d'utilisation dans une route
```javascript
router.post('/validateArticle', async (req, res) => {
  try {
    const { article } = req.body;
    
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
    console.error('Erreur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la validation de l\'article',
      error: error.message
    });
  }
});
```

---

## 🔧 Dépannage

### Problèmes courants

#### 1. Erreur de dépendance circulaire
**Symptôme :** `TypeError: require(...) is not a function`
**Solution :** Utiliser la structure simple avec import direct de `sequelize`

#### 2. Colonnes timestamps manquantes
**Symptôme :** `Unknown column 'createdAt' in 'field list'`
**Solution :** Utiliser `define: { underscored: true }` dans la config Sequelize

#### 3. Connexion à la base de données
**Symptôme :** `Database connection error`
**Vérifications :**
- Variables d'environnement correctes
- Service MySQL démarré
- Credentials corrects

### Logs utiles
```bash
# Logs du backend
sudo docker logs -f backend_codeurbase

# Logs de la base de données
sudo docker logs -f database_codeurbase
```

---

## 📚 Ressources

- [Documentation Sequelize](https://sequelize.org/)
- [Documentation MySQL](https://dev.mysql.com/doc/)
- [Sequelize CLI](https://github.com/sequelize/cli)

---

*Documentation générée le 16/10/2025 - CodeurBase.fr*
