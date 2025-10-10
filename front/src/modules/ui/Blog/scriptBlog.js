/**
 * Logique du Blog - Gestion des articles et des catégories
 * @author CodeurBase.fr
 * @version 1.0.0
 */

/**
 * Classe principale pour gérer la logique du blog
 */
export class BlogManager {
    constructor() {
        this.articles = [];
        this.categories = [];
        this.currentFilter = 'all';
        this.isLoading = false;
        this.error = null;
        
        // Initialiser les articles par défaut
        this.initializeDefaultArticles();
        
        // Bind des méthodes
        this.filterByCategory = this.filterByCategory.bind(this);
        this.searchArticles = this.searchArticles.bind(this);
    }

    /**
     * Initialise les articles par défaut
     */
    initializeDefaultArticles() {
        this.articles = [
            {
                id: 1,
                title: "Débuter avec Svelte",
                excerpt: "Découvrez comment créer des applications web modernes avec Svelte, un framework JavaScript innovant.",
                category: "développement",
                date: "2025-01-15",
                author: "Yohann",
                image: "/images/blog/svelte-intro.jpg",
                tags: ["svelte", "javascript", "frontend"]
            },
            {
                id: 2,
                title: "Les bases de GSAP pour les animations",
                excerpt: "Apprenez à créer des animations fluides et performantes avec la bibliothèque GSAP.",
                category: "design",
                date: "2025-01-10",
                author: "Yohann",
                image: "/images/blog/gsap-basics.jpg",
                tags: ["gsap", "animations", "css"]
            },
            {
                id: 3,
                title: "Architecture d'une application moderne",
                excerpt: "Explorez les meilleures pratiques pour structurer une application web scalable.",
                category: "développement",
                date: "2025-01-05",
                author: "Yohann",
                image: "/images/blog/architecture.jpg",
                tags: ["architecture", "best-practices", "backend"]
            }
        ];

        // Extraire les catégories uniques
        this.categories = ['all', ...new Set(this.articles.map(article => article.category))];
    }

    /**
     * Obtenir tous les articles
     * @returns {Array} Liste des articles
     */
    getAllArticles() {
        return this.articles;
    }

    /**
     * Obtenir les articles filtrés
     * @returns {Array} Articles filtrés selon la catégorie courante
     */
    getFilteredArticles() {
        if (this.currentFilter === 'all') {
            return this.articles;
        }
        return this.articles.filter(article => article.category === this.currentFilter);
    }

    /**
     * Filtrer les articles par catégorie
     * @param {string} category - Catégorie à filtrer
     */
    filterByCategory(category) {
        this.currentFilter = category;
    }

    /**
     * Rechercher des articles
     * @param {string} query - Terme de recherche
     * @returns {Array} Articles correspondants
     */
    searchArticles(query) {
        if (!query || query.trim() === '') return this.articles;
        
        const searchTerm = query.toLowerCase().trim();
        return this.articles.filter(article => 
            article.title.toLowerCase().includes(searchTerm) ||
            article.excerpt.toLowerCase().includes(searchTerm) ||
            article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }

    /**
     * Obtenir un article par ID
     * @param {number} id - ID de l'article
     * @returns {Object|null} Article trouvé ou null
     */
    getArticleById(id) {
        return this.articles.find(article => article.id === id) || null;
    }

    /**
     * Obtenir les articles récents
     * @param {number} limit - Nombre d'articles à retourner
     * @returns {Array} Articles récents
     */
    getRecentArticles(limit = 3) {
        return [...this.articles]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, limit);
    }

    /**
     * Obtenir toutes les catégories
     * @returns {Array} Liste des catégories
     */
    getCategories() {
        return this.categories;
    }

    /**
     * Formater une date pour l'affichage
     * @param {string} dateString - Date au format ISO
     * @returns {string} Date formatée
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * Obtenir le temps de lecture estimé
     * @param {string} content - Contenu de l'article
     * @returns {number} Temps de lecture en minutes
     */
    getReadingTime(content) {
        const wordsPerMinute = 200;
        const wordCount = Number(content.split(/\s+/).length);
        return Math.ceil(Number(wordCount) / Number(wordsPerMinute));
    }

    /**
     * Ajouter un article (pour future API)
     * @param {Object} articleData - Données de l'article
     */
    addArticle(articleData) {
        const newArticle = {
            id: this.articles.length + 1,
            ...articleData,
            date: new Date().toISOString()
        };
        this.articles.unshift(newArticle);
    }
}

/**
 * Hook Svelte pour utiliser le BlogManager
 * @returns {Object} Interface pour utiliser le blog
 */
export function useBlog() {
    const blogManager = new BlogManager();
    
    return {
        // État du blog
        articles: blogManager.articles,
        categories: blogManager.categories,
        currentFilter: blogManager.currentFilter,
        isLoading: blogManager.isLoading,
        error: blogManager.error,
        
        // Méthodes
        getAllArticles: blogManager.getAllArticles.bind(blogManager),
        getFilteredArticles: blogManager.getFilteredArticles.bind(blogManager),
        filterByCategory: blogManager.filterByCategory.bind(blogManager),
        searchArticles: blogManager.searchArticles.bind(blogManager),
        getArticleById: blogManager.getArticleById.bind(blogManager),
        getRecentArticles: blogManager.getRecentArticles.bind(blogManager),
        getCategories: blogManager.getCategories.bind(blogManager),
        formatDate: blogManager.formatDate.bind(blogManager),
        getReadingTime: blogManager.getReadingTime.bind(blogManager),
        
        // Getters réactifs
        get hasArticles() {
            return blogManager.articles.length > 0;
        },
        
        get articleCount() {
            return blogManager.articles.length;
        }
    };
}

/**
 * Utilitaires pour le blog
 */
export const BlogUtils = {
    /**
     * Tronquer un texte
     * @param {string} text - Texte à tronquer
     * @param {number} maxLength - Longueur maximale
     * @returns {string} Texte tronqué
     */
    truncateText(text, maxLength = 150) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    },

    /**
     * Générer un slug à partir d'un titre
     * @param {string} title - Titre de l'article
     * @returns {string} Slug généré
     */
    generateSlug(title) {
        return title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    },

    /**
     * Obtenir une couleur pour une catégorie
     * @param {string} category - Nom de la catégorie
     * @returns {string} Couleur HEX
     */
    getCategoryColor(category) {
        const colors = {
            'développement': '#4CAF50',
            'design': '#FF6B6B',
            'tutoriel': '#FFD93D',
            'actualité': '#6BCF7F',
            'all': '#FFFFFF'
        };
        return colors[category.toLowerCase()] || '#888888';
    }
};

export default BlogManager;

