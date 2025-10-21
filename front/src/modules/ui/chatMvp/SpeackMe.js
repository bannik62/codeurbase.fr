/**
 * Logique du Chat MVP - Gestion des messages et communication avec l'IA
 * @author CodeurBase.fr
 * @version 1.0.0
 */

import axios from 'axios';
import { writable } from 'svelte/store';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

/**
 * Classe principale pour gérer la logique du chat
 */
export class ChatManager {
    constructor() {
        // Utiliser des stores Svelte pour la réactivité
        this.messages = writable([]);
        this.isLoading = writable(false);
        this.isConnected = writable(true);
        this.error = writable(null);
        this.apiEndpoint = `${BACKEND_URL}/codeurbaseApi/n8n/chatWithMe`;        
        // Générer un sessionId unique pour cet utilisateur
        this.sessionId = this.generateSessionId();
        
        // Messages d'exemple pour l'initialisation
        this.initializeDefaultMessages();
        
        // Bind des méthodes pour éviter les problèmes de contexte
        this.sendMessage = this.sendMessage.bind(this);
        this.addMessage = this.addMessage.bind(this);
        this.handleError = this.handleError.bind(this);
    }

    /**
     * Génère ou récupère un sessionId unique pour cet utilisateur
     */
    generateSessionId() {
        // Essayer de récupérer un sessionId existant
        const existingSessionId = localStorage.getItem('chatSessionId');
        
        if (existingSessionId) {
            console.log('Session existante récupérée:', existingSessionId);
            return existingSessionId;
        }
        
        // Créer un nouveau sessionId
        const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('chatSessionId', newSessionId);
        console.log('Nouvelle session créée:', newSessionId);
        
        return newSessionId;
    }

    /**
     * Réinitialise la session (nouveau sessionId)
     */
    resetSession() {
        localStorage.removeItem('chatSessionId');
        this.sessionId = this.generateSessionId();
        this.clearConversation();
        console.log('Session réinitialisée:', this.sessionId);
    }

    /**
     * Initialise les messages par défaut
     */
    initializeDefaultMessages() {
        this.messages.set([
            {
                id: 'ai-welcome',
                type: 'ai',
                content: `Bonjour ! Je suis Yohann, développeur web full stack. Peut-être votre futur développeur ?`,
                timestamp: new Date().toISOString(),
                avatar: '🤖'
            }
        ]);
    }

    /**
     * Ajoute un nouveau message à la conversation
     * @param {Object} messageData - Données du message
     */
    addMessage(messageData) {
        const message = {
            id: this.generateMessageId(),
            type: messageData.type || 'user',
            content: messageData.content,
            timestamp: new Date().toISOString(),
            avatar: messageData.avatar || (messageData.type === 'ai' ? '🤖' : '👤'),
            isLoading: messageData.isLoading || false,
            error: messageData.error || null
        };
        
        // Mettre à jour le store de manière réactive
        this.messages.update(currentMessages => [...currentMessages, message]);
        return message;
    }

    /**
     * Génère un ID unique pour un message
     * @returns {string} ID unique
     */
    generateMessageId() {
        return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Envoie un message à l'API et gère la réponse
     * @param {string} userMessage - Message de l'utilisateur
     * @returns {Promise<Object>} Réponse de l'API
     */
    async sendMessage(userMessage) {
        if (!userMessage || userMessage.trim() === '') {
            throw new Error('Le message ne peut pas être vide');
        }

        this.isLoading.set(true);
        this.error.set(null);

        try {
            // Ajouter le message de l'utilisateur
            const userMsg = this.addMessage({
                type: 'user',
                content: userMessage.trim()
            });

            // Ajouter un message de chargement pour l'IA
            const loadingMsg = this.addMessage({
                type: 'ai',
                content: 'Je réfléchis...',
                isLoading: true
            });
            console.log("API Endpoint:", this.apiEndpoint);
            // Appel à l'API
            const payload = {
                message: userMessage.trim(),
                timestamp: new Date().toISOString(),
                sessionId: this.sessionId 
            };
            console.log("Payload envoyé au backend:", payload);
            
            const response = await axios.post(this.apiEndpoint, payload, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 30000 // 30 secondes de timeout
            });

            console.log("Réponse reçue du backend:", response.data);

            // Modifier directement le message de chargement avec la réponse
            loadingMsg.content = response.data.message || 'Désolé, je n\'ai pas pu générer de réponse.';

            loadingMsg.isLoading = false;

            this.isLoading.set(false);
            return loadingMsg;

        } catch (error) {
            this.isLoading.set(false);
            this.handleError(error);
            throw error;
        }
    }

    /**
     * Supprime un message de la conversation
     * @param {string} messageId - ID du message à supprimer
     */
    removeMessage(messageId) {
        this.messages.update(currentMessages => 
            currentMessages.filter(msg => msg.id !== messageId)
        );
    }

    /**
     * Obtient l'historique de conversation pour l'API
     * @param {number} limit - Nombre maximum de messages à inclure
     * @returns {Array} Historique des messages
     */
    getConversationHistory(limit = 10) {
        let currentMessages;
        this.messages.subscribe(msgs => currentMessages = msgs)();
        
        return currentMessages
            .filter(msg => msg.type !== 'system' && !msg.isLoading)
            .slice(-limit)
            .map(msg => ({
                role: msg.type === 'ai' ? 'assistant' : 'user',
                content: msg.content,
                timestamp: msg.timestamp
            }));
    }

    /**
     * Gère les erreurs de l'API
     * @param {any} error - Erreur à traiter
     */
    handleError(error) {
        console.error('Erreur Chat API:', error);
        
        let errorMessage = 'Une erreur est survenue lors de la communication avec l\'IA.';
        
        // Vérifier si c'est une erreur Axios
        if (error && typeof error === 'object') {
            if (error.response) {
                // Erreur de réponse HTTP
                const status = error.response.status;
                switch (status) {
                    case 400:
                        errorMessage = 'Requête invalide. Veuillez vérifier votre message.';
                        break;
                    case 401:
                        errorMessage = 'Non autorisé. Veuillez vous reconnecter.';
                        break;
                    case 403:
                        errorMessage = 'Accès refusé.';
                        break;
                    case 404:
                        errorMessage = 'Service non trouvé.';
                        break;
                    case 429:
                        errorMessage = 'Trop de requêtes. Veuillez patienter un moment.';
                        break;
                    case 500:
                        errorMessage = 'Erreur interne du serveur. Veuillez réessayer plus tard.';
                        break;
                    default:
                        const responseData = error.response.data;
                        errorMessage = `Erreur ${status}: ${responseData?.message || 'Erreur inconnue'}`;
                }
            } else if (error.request) {
                // Erreur de réseau
                errorMessage = 'Impossible de joindre le serveur. Vérifiez votre connexion internet.';
                this.isConnected.set(false);
            } else {
                // Autre erreur
                errorMessage = error.message || 'Une erreur inattendue s\'est produite.';
            }
        }

        this.error.set(errorMessage);
        
        // Ajouter un message d'erreur à l'interface
        this.addMessage({
            type: 'system',
            content: errorMessage,
            error: true,
            avatar: '⚠️'
        });
    }

    /**
     * Efface la conversation
     */
    clearConversation() {
        this.messages.set([]);
        this.error.set(null);
        this.initializeDefaultMessages();
    }


    /**
     * Obtient le nombre de messages dans la conversation
     * @returns {number} Nombre de messages
     */
    getMessageCount() {
        let currentMessages;
        this.messages.subscribe(msgs => currentMessages = msgs)();
        return currentMessages.length;
    }

    /**
     * Obtient le dernier message de la conversation
     * @returns {Object|null} Dernier message ou null
     */
    getLastMessage() {
        let currentMessages;
        this.messages.subscribe(msgs => currentMessages = msgs)();
        return currentMessages.length > 0 ? currentMessages[currentMessages.length - 1] : null;
    }

    /**
     * Formate l'heure d'un message pour l'affichage
     * @param {string} timestamp - Timestamp ISO
     * @returns {string} Heure formatée
     */
    formatMessageTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Exporte la conversation en JSON
     * @returns {string} Conversation au format JSON
     */
    exportConversation() {
        let currentMessages;
        this.messages.subscribe(msgs => currentMessages = msgs)();
        
        return JSON.stringify({
            messages: currentMessages,
            exportedAt: new Date().toISOString(),
            messageCount: currentMessages.length
        }, null, 2);
    }

    /**
     * Importe une conversation depuis un JSON
     * @param {string} jsonData - Données JSON de la conversation
     */
    importConversation(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            if (data.messages && Array.isArray(data.messages)) {
                this.messages.set(data.messages);
                return true;
            }
            throw new Error('Format de données invalide');
        } catch (error) {
            console.error('Erreur lors de l\'importation:', error);
            return false;
        }
    }

    /**
     * Recherche dans les messages
     * @param {string} query - Terme de recherche
     * @returns {Array} Messages correspondants
     */
    searchMessages(query) {
        if (!query || query.trim() === '') return [];
        
        let currentMessages;
        this.messages.subscribe(msgs => currentMessages = msgs)();
        
        const searchTerm = query.toLowerCase().trim();
        return currentMessages.filter(msg => 
            msg.content.toLowerCase().includes(searchTerm) &&
            msg.type !== 'system'
        );
    }
}

/**
 * Hook Svelte pour utiliser le ChatManager
 * @returns {Object} Interface pour utiliser le chat
 */
export function useChat() {
    const chatManager = new ChatManager();
    
    return {
        // Stores réactifs
        messages: chatManager.messages,
        isLoading: chatManager.isLoading,
        isConnected: chatManager.isConnected,
        error: chatManager.error,
        
        // Méthodes
        sendMessage: chatManager.sendMessage,
        addMessage: chatManager.addMessage,
        clearConversation: chatManager.clearConversation,
        resetSession: chatManager.resetSession,
        getMessageCount: chatManager.getMessageCount,
        getLastMessage: chatManager.getLastMessage,
        formatMessageTime: chatManager.formatMessageTime,
        exportConversation: chatManager.exportConversation,
        importConversation: chatManager.importConversation,
        searchMessages: chatManager.searchMessages,
        
        // Getters réactifs
        get hasMessages() {
            let currentMessages;
            chatManager.messages.subscribe(msgs => currentMessages = msgs)();
            return currentMessages.length > 1; // Plus que le message de bienvenue
        },
        
        get lastUserMessage() {
            let currentMessages;
            chatManager.messages.subscribe(msgs => currentMessages = msgs)();
            const userMessages = currentMessages.filter(msg => msg.type === 'user');
            return userMessages.length > 0 ? userMessages[userMessages.length - 1] : null;
        },
        
        get lastAiMessage() {
            let currentMessages;
            chatManager.messages.subscribe(msgs => currentMessages = msgs)();
            const aiMessages = currentMessages.filter(msg => msg.type === 'ai');
            return aiMessages.length > 0 ? aiMessages[aiMessages.length - 1] : null;
        }
    };
}

/**
 * Utilitaires pour le chat
 */
export const ChatUtils = {
    /**
     * Valide un message utilisateur
     * @param {string} message - Message à valider
     * @returns {Object} Résultat de la validation
     */
    validateMessage(message) {
        if (!message || typeof message !== 'string') {
            return { valid: false, error: 'Le message doit être une chaîne de caractères' };
        }
        
        const trimmed = message.trim();
        
        if (trimmed.length === 0) {
            return { valid: false, error: 'Le message ne peut pas être vide' };
        }
        
        if (trimmed.length > 1000) {
            return { valid: false, error: 'Le message ne peut pas dépasser 1000 caractères' };
        }
        
        // Vérifier les caractères interdits
        const forbiddenPattern = /<script|javascript:|data:|vbscript:/i;
        if (forbiddenPattern.test(trimmed)) {
            return { valid: false, error: 'Le message contient des caractères interdits' };
        }
        
        return { valid: true, message: trimmed };
    },

    /**
     * Nettoie le contenu d'un message
     * @param {string} content - Contenu à nettoyer
     * @returns {string} Contenu nettoyé
     */
    sanitizeContent(content) {
        return content
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    },

    /**
     * Génère des suggestions de messages
     * @returns {Array} Suggestions
     */
    getMessageSuggestions() {
        return [
            "Quels sont tes compétences ?",
            "Quelles sont les dernières tendances en développement web ?",
            "Peux-tu m'aider avec du code JavaScript ?",
            "Explique-moi les concepts de programmation orientée objet",
            "Qu'est-ce que le responsive design ?"
        ];
    }
};

export default ChatManager;
