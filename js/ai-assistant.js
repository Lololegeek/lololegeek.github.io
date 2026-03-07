const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

// Clé API Groq par défaut (pour les utilisateurs autorisés)
const DEFAULT_GROQ_API_KEY = "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";

console.log("🤖 AI Assistant script loaded");

// Variable pour stocker les erreurs capturées
let capturedErrors = [];

function initAI() {
    console.log("🤖 Initializing AI UI...");
    if (document.querySelector('.ai-fab')) return; // Déjà injecté

    // Auto-configurer la clé API si pas déjà présente
    if (!localStorage.getItem('GROQ_API_KEY')) {
        localStorage.setItem('GROQ_API_KEY', DEFAULT_GROQ_API_KEY);
        console.log("🔑 Clé API configurée automatiquement");
    }

    // Capturer les erreurs de la console
    captureConsoleErrors();

    injectChatUI();

    // Mettre en place l'observation des changements de page
    setupPageChangeObserver();

    // Vérifier le contexte initial
    checkContextStatus();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAI);
} else {
    initAI(); // DOM déjà prêt
}


function injectChatUI() {
    // Bouton flottant
    const fab = document.createElement('button');
    fab.className = 'ai-fab';
    fab.innerHTML = '<i class="fas fa-robot"></i>';
    fab.title = "Assistant IA (Groq)";
    fab.onclick = toggleChat;
    document.body.appendChild(fab);

    // Bouton d'aide dans l'éditeur (si on est dans l'éditeur)
    if (document.querySelector('.editor-toolbar')) {
        setTimeout(addEditorHelpButton, 1000); // Attendre que l'éditeur soit chargé
    }

    // Fenêtre de chat
    const chatWindow = document.createElement('div');
    chatWindow.className = 'ai-chat-window';
    chatWindow.innerHTML = `
        <div class="ai-header">
            <span><i class="fas fa-brain"></i> Assistant LuaMaster</span>
            <div>
                <button onclick="showContextInfo()" title="Voir le contexte actuel"><i class="fas fa-info-circle"></i></button>
                <button onclick="toggleChat()"><i class="fas fa-times"></i></button>
            </div>
        </div>
        <div class="ai-messages" id="ai-messages">
            <div class="ai-msg system">Bonjour ! Je suis ton assistant Lua. Je connais automatiquement le contexte de ta page actuelle. Pose-moi une question ! 🤖</div>
        </div>
        <div class="ai-context-info" id="ai-context-info">
            <span id="context-status">🔄 Vérification du contexte...</span>
        </div>
        <div class="ai-input-area">
            <input type="text" id="ai-input" placeholder="Explique-moi ce code..." onkeypress="handleEnter(event)">
            <button onclick="sendMessage()"><i class="fas fa-paper-plane"></i></button>
        </div>
        <div class="ai-footer">
            <div>
                <small onclick="resetApiKey()" style="cursor:pointer; opacity:0.5; margin-right: 15px;">Reset API Key</small>
                <small onclick="reloadEditorDetection()" style="cursor:pointer; opacity:0.5;">🔄 Recharger l'éditeur</small>
            </div>
        </div>
    `;
    document.body.appendChild(chatWindow);

    // Styles CSS injectés dynamiquement
    const style = document.createElement('style');
    style.textContent = `
        .ai-fab { position: fixed; bottom: 30px; right: 30px; width: 60px; height: 60px; border-radius: 50%; background: var(--primary); color: white; border: none; font-size: 24px; cursor: pointer; box-shadow: 0 5px 20px rgba(108, 92, 231, 0.4); z-index: 9999; transition: 0.3s; }
        .ai-fab:hover { transform: scale(1.1); box-shadow: 0 10px 30px rgba(108, 92, 231, 0.6); }
        
        .ai-chat-window { position: fixed; bottom: 100px; right: 30px; width: 350px; height: 500px; background: #1e1e2f; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; display: none; flex-direction: column; overflow: hidden; z-index: 9999; box-shadow: 0 20px 50px rgba(0,0,0,0.5); font-family: 'Inter', sans-serif; }
        .ai-chat-window.active { display: flex; animation: slideUp 0.3s ease; }
        
        .ai-header { padding: 15px; background: rgba(108, 92, 231, 0.1); border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; color: var(--primary); font-weight: 700; }
        .ai-header > div { display: flex; align-items: center; }
        .ai-header button { background: none; border: none; color: white; cursor: pointer; margin-left: 8px; }
        .ai-header button:first-child { margin-left: 0; }
        
        .ai-messages { flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
        
        .ai-msg { padding: 10px 15px; border-radius: 12px; font-size: 0.9rem; line-height: 1.4; max-width: 85%; word-wrap: break-word; }
        .ai-msg.user { background: var(--primary); color: white; align-self: flex-end; border-bottom-right-radius: 2px; }
        .ai-msg.bot { background: rgba(255,255,255,0.05); color: #ddd; align-self: flex-start; border-bottom-left-radius: 2px; }
        .ai-msg.system { background: transparent; color: #888; text-align: center; align-self: center; font-size: 0.8rem; font-style: italic; }
        
        .ai-input-area { padding: 15px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; gap: 10px; }
        .ai-input-area input { flex: 1; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); padding: 10px; border-radius: 8px; color: white; outline: none; }
        .ai-input-area input:focus { border-color: var(--primary); }
        .ai-input-area button { background: var(--primary); border: none; width: 40px; border-radius: 8px; color: white; cursor: pointer; }
        
        .ai-footer { padding: 8px; text-align: center; font-size: 0.7rem; color: #555; background: rgba(0,0,0,0.1); }
        .ai-footer div { display: flex; justify-content: center; align-items: center; }
        .ai-context-info { padding: 8px; background: rgba(0,0,0,0.2); border-top: 1px solid rgba(255,255,255,0.05); font-size: 0.8rem; text-align: center; color: #aaa; }
        .ai-context-info.ok { color: #10b981; }
        .ai-context-info.warn { color: #f59e0b; }
        .ai-context-info.error { color: #ef4444; }
        
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    `;
    document.head.appendChild(style);
}

function toggleChat() {
    const win = document.querySelector('.ai-chat-window');
    win.classList.toggle('active');

    // Check API Key on open
    if (win.classList.contains('active') && !localStorage.getItem('GROQ_API_KEY')) {
        askApiKey();
    }
}

function askApiKey() {
    const key = prompt("Entre ta clé API Groq (commence par gsk_...) :\nElle sera stockée localement dans ton navigateur.");
    if (key && key.trim().startsWith('gsk_')) {
        localStorage.setItem('GROQ_API_KEY', key.trim());
        addMsg("Clé API enregistrée ! Tu peux discuter. ✅", 'system');
    } else {
        alert("Clé invalide ou annulée. L'assistant ne pourra pas répondre.");
    }
}

function resetApiKey() {
    localStorage.removeItem('GROQ_API_KEY');
    location.reload();
}

function setupPageChangeObserver() {
    // Observer les changements dans le DOM qui pourraient indiquer un changement de page
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList') {
                // Vérifier si le contexte a changé (par exemple, passage d'une leçon à une autre)
                const currentContext = getCurrentPageContext();

                // Si le contexte a changé, on pourrait mettre à jour l'AI
                // Pour l'instant, on se contente de logger
                console.log('Contexte mis à jour:', currentContext);
            }
        });
    });

    // Observer les changements dans le body
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });
}

function getCurrentPageContext() {
    if (document.querySelector('.lesson-content')) {
        return 'leçon';
    } else if (document.querySelector('.editor-main')) {
        return 'éditeur';
    } else if (document.querySelector('.courses-section')) {
        return 'cours';
    } else if (document.querySelector('.hero')) {
        return 'accueil';
    }
    return 'inconnu';
}

function tryAlternativeCodeAccess(input) {
    let codeFound = null;

    // Méthode 1: Essayer d'accéder via Monaco directement
    try {
        if (typeof monaco !== 'undefined' && monaco.editor) {
            const editors = monaco.editor.getEditors();
            if (editors && editors.length > 0) {
                codeFound = editors[0].getValue();
                addMsg("✅ Code trouvé via Monaco API !", 'system');
            }
        }
    } catch (error) {
        console.error("Méthode 1 échouée:", error);
    }

    // Méthode 2: Essayer de trouver le textarea caché
    if (!codeFound) {
        try {
            const textarea = document.querySelector('#monaco-editor-container textarea');
            if (textarea && textarea.value) {
                codeFound = textarea.value;
                addMsg("✅ Code trouvé via textarea caché !", 'system');
            }
        } catch (error) {
            console.error("Méthode 2 échouée:", error);
        }
    }

    // Méthode 3: Essayer de trouver les lignes de code dans le DOM
    if (!codeFound) {
        try {
            const lineElements = document.querySelectorAll('.view-line');
            if (lineElements && lineElements.length > 0) {
                let codeFromLines = '';
                lineElements.forEach(line => {
                    const lineText = line.textContent;
                    if (lineText) {
                        codeFromLines += lineText + '\n';
                    }
                });
                if (codeFromLines.trim()) {
                    codeFound = codeFromLines;
                    addMsg("✅ Code trouvé via les lignes du DOM !", 'system');
                }
            }
        } catch (error) {
            console.error("Méthode 3 échouée:", error);
        }
    }

    // Si du code a été trouvé, remplir le champ
    if (codeFound) {
        const question = `Peux-tu m'expliquer ce que fait ce code et me donner des conseils pour l'améliorer ?\n\nCode actuel:\n\`\`\`lua\n${codeFound}\n\`\`\``;

        setTimeout(() => {
            input.value = question;
            input.focus();
            input.selectionStart = input.selectionEnd = input.value.length;
            addMsg("Question générée avec le code récupéré !", 'system');
        }, 100);
    } else {
        addMsg("❌ Impossible de récupérer le code avec les méthodes alternatives. Veuillez essayer de copier-coller votre code manuellement.", 'system');
    }
}

function checkContextStatus() {
    // Vérifier périodiquement si le contexte est disponible
    const checkInterval = setInterval(() => {
        const contextStatus = document.getElementById('context-status');
        if (!contextStatus) {
            clearInterval(checkInterval);
            return;
        }

        const systemPrompt = generateSystemPrompt();
        const analysis = analyzeContext(systemPrompt);

        // Déterminer le statut
        if (analysis.includes("✅ Code accessible")) {
            contextStatus.textContent = "✅ Contexte prêt - Code accessible";
            contextStatus.parentElement.className = "ai-context-info ok";
        } else if (analysis.includes("⚠️  Éditeur chargé mais accès au code limité")) {
            contextStatus.textContent = "⚠️ Éditeur détecté - Accès limité";
            contextStatus.parentElement.className = "ai-context-info warn";
        } else if (analysis.includes("⏳ Éditeur en cours de chargement")) {
            contextStatus.textContent = "⏳ Attente de l'éditeur...";
            contextStatus.parentElement.className = "ai-context-info warn";
        } else if (analysis.includes("❌ Impossible d'accéder")) {
            contextStatus.textContent = "❌ Accès au code bloqué";
            contextStatus.parentElement.className = "ai-context-info error";
        } else if (analysis.includes("✅ Leçon détectée")) {
            contextStatus.textContent = "✅ Contexte prêt - Leçon détectée";
            contextStatus.parentElement.className = "ai-context-info ok";
        } else {
            contextStatus.textContent = "ℹ️ Contexte général disponible";
            contextStatus.parentElement.className = "ai-context-info";
        }

        // Arrêter après avoir trouvé un statut stable
        if (analysis.includes("✅ Code accessible") || analysis.includes("✅ Leçon détectée")) {
            setTimeout(() => {
                clearInterval(checkInterval);
            }, 5000); // Continuer à vérifier pendant 5 secondes de plus
        }
    }, 2000); // Vérifier toutes les 2 secondes

    // Limiter la durée totale
    setTimeout(() => {
        clearInterval(checkInterval);
        const contextStatus = document.getElementById('context-status');
        if (contextStatus) {
            contextStatus.textContent = "📌 Contexte vérifié";
        }
    }, 30000);
}

// Fonction globale pour que l'utilisateur puisse vérifier le contexte
window.checkAIContext = function () {
    checkContextStatus();
    showContextInfo();
};

// Fonction pour forcer le rechargement de la détection de l'éditeur
window.reloadEditorDetection = function () {
    addMsg("🔄 Rechargement de la détection de l'éditeur...", 'system');

    // Réinitialiser le statut
    const contextStatus = document.getElementById('context-status');
    if (contextStatus) {
        contextStatus.textContent = "🔄 Vérification du contexte...";
        contextStatus.parentElement.className = "ai-context-info";
    }

    // Relancer la vérification du contexte
    checkContextStatus();

    // Essayer de récupérer le code immédiatement
    setTimeout(() => {
        const systemPrompt = generateSystemPrompt();
        const analysis = analyzeContext(systemPrompt);

        if (analysis.includes("✅ Code accessible")) {
            addMsg("✅ L'éditeur est maintenant accessible !", 'system');
        } else if (analysis.includes("⚠️  Éditeur chargé mais accès au code limité")) {
            addMsg("⚠️  Toujours un accès limité. Essayons les méthodes alternatives...", 'system');
            const input = document.getElementById('ai-input');
            if (input) {
                tryAlternativeCodeAccess(input);
            }
        }
    }, 1000);
};

function captureConsoleErrors() {
    // Surcharger console.error pour capturer les erreurs
    const originalError = console.error;
    console.error = function (...args) {
        // Appeler la fonction originale
        originalError.apply(console, args);

        // Stocker l'erreur
        const errorMessage = args.map(arg => {
            if (arg instanceof Error) {
                return arg.message + '\n' + arg.stack;
            }
            return String(arg);
        }).join(' ');

        capturedErrors.push({
            message: errorMessage,
            timestamp: new Date().toISOString(),
            type: 'error'
        });

        // Limiter à 10 erreurs pour éviter la surcharge
        if (capturedErrors.length > 10) {
            capturedErrors.shift();
        }
    };

    // Surcharger console.warn pour capturer les avertissements
    const originalWarn = console.warn;
    console.warn = function (...args) {
        originalWarn.apply(console, args);

        const warningMessage = args.map(arg => String(arg)).join(' ');
        capturedErrors.push({
            message: warningMessage,
            timestamp: new Date().toISOString(),
            type: 'warning'
        });

        if (capturedErrors.length > 10) {
            capturedErrors.shift();
        }
    };
}

function getErrorContext() {
    if (capturedErrors.length === 0) {
        return "Aucune erreur récente détectée.";
    }

    let context = "Erreurs/avertissements récents détectés :\n\n";

    capturedErrors.forEach((error, index) => {
        context += `=== ${error.type.toUpperCase()} ${capturedErrors.length - index} ===\n`;
        context += `${error.message}\n\n`;
    });

    return context;
}

function showContextInfo() {
    const systemPrompt = generateSystemPrompt();

    // Analyser le contexte pour voir ce qui est disponible
    const contextAnalysis = analyzeContext(systemPrompt);

    // Créer une version simplifiée pour l'affichage
    const maxLength = 600;
    const shortPrompt = systemPrompt.length > maxLength
        ? systemPrompt.substring(0, maxLength) + '... [contexte tronqué]'
        : systemPrompt;

    addMsg(`📋 Analyse du contexte actuel:\n\n${contextAnalysis}\n\n--- Contexte envoyé à l'AI ---\n${shortPrompt.replace(/\`\`\`lua\n([\s\S]*?)\n\`\`\`/g, (match, code) => {
        const lines = code.split('\n').length;
        return `[Code Lua - ${lines} lignes]`;
    })}`, 'system');
}

function analyzeContext(systemPrompt) {
    let analysis = "🔍 Analyse du contexte disponible:\n";

    // Vérifier si l'éditeur est détecté
    if (systemPrompt.includes("L'utilisateur travaille dans l'éditeur de code")) {
        analysis += "✅ Éditeur de code détecté\n";

        if (systemPrompt.includes("-- Code actuel dans l'éditeur:")) {
            analysis += "✅ Code accessible et prêt à être analysé\n";
        } else if (systemPrompt.includes("-- Aucun code dans l'éditeur --")) {
            analysis += "⚠️  Éditeur vide - aucun code à analyser\n";
        } else if (systemPrompt.includes("-- Impossible d'accéder au code")) {
            analysis += "❌ Impossible d'accéder au code de l'éditeur\n";
        } else if (systemPrompt.includes("-- Éditeur Monaco détecté mais code non accessible --")) {
            analysis += "⚠️  Éditeur chargé mais accès au code limité\n";
        } else if (systemPrompt.includes("-- Éditeur Monaco en cours de chargement --")) {
            analysis += "⏳ Éditeur en cours de chargement\n";
        }
    }

    // Vérifier si une leçon est détectée
    if (systemPrompt.includes("L'utilisateur consulte la leçon")) {
        const match = systemPrompt.match(/L'utilisateur consulte la leçon : "([^"]+)"/);
        if (match) {
            analysis += `✅ Leçon détectée: "${match[1]}"\n`;
        }
    }

    // Vérifier les erreurs
    if (systemPrompt.includes("Erreurs/avertissements récents détectés")) {
        const errorCount = (systemPrompt.match(/=== ERROR \d+ ===/g) || []).length;
        const warningCount = (systemPrompt.match(/=== WARNING \d+ ===/g) || []).length;

        if (errorCount > 0 || warningCount > 0) {
            analysis += `⚠️  Erreurs détectées: ${errorCount} erreur(s), ${warningCount} avertissement(s)\n`;
        } else {
            analysis += "✅ Aucune erreur récente\n";
        }
    }

    // Vérifier si le contexte est complet
    if (systemPrompt.includes("Tu as toujours accès au contexte automatique")) {
        analysis += "📌 Le contexte est complet et prêt pour l'AI\n";
    }

    return analysis;
}

function addEditorHelpButton() {
    const toolbar = document.querySelector('.toolbar-actions');
    if (!toolbar) return;

    const helpButton = document.createElement('button');
    helpButton.className = 'toolbar-btn ai-help-btn';
    helpButton.title = "Demander de l'aide sur ce code";
    helpButton.innerHTML = '<i class="fas fa-question-circle"></i>';
    helpButton.onclick = function () {
        askForCodeHelp();
    };

    // Ajouter le bouton avant le bouton d'exécution
    const runButton = toolbar.querySelector('.run-button');
    if (runButton) {
        toolbar.insertBefore(helpButton, runButton);
    } else {
        toolbar.appendChild(helpButton);
    }

    // Vérifier périodiquement si l'éditeur est chargé
    startEditorMonitoring();
}

function startEditorMonitoring() {
    // Vérifier toutes les secondes si l'éditeur est disponible
    const interval = setInterval(() => {
        if (window.editor && typeof window.editor.getValue === 'function') {
            clearInterval(interval);
            console.log("🤖 Éditeur Monaco chargé et accessible");
        }
    }, 1000);

    // Arrêter après 30 secondes pour éviter les fuites de mémoire
    setTimeout(() => {
        clearInterval(interval);
    }, 30000);
}

function askForCodeHelp() {
    const input = document.getElementById('ai-input');
    if (!input) return;

    // Ouvrir le chat si nécessaire
    const chatWindow = document.querySelector('.ai-chat-window');
    if (!chatWindow.classList.contains('active')) {
        toggleChat();
    }

    // Vérifier si le code est accessible
    const systemPrompt = generateSystemPrompt();
    const analysis = analyzeContext(systemPrompt);

    if (analysis.includes("✅ Code accessible")) {
        // Remplir automatiquement avec une question sur le code
        const currentCode = window.editor ? window.editor.getValue() : '';
        const question = `Peux-tu m'expliquer ce que fait ce code et me donner des conseils pour l'améliorer ?\n\nCode actuel:\n\`\`\`lua\n${currentCode}\n\`\`\``;

        // Corriger le blocage du champ de texte
        setTimeout(() => {
            input.value = question;
            input.focus();

            // Déplacer le curseur à la fin
            input.selectionStart = input.selectionEnd = input.value.length;

            // Ajouter un message système
            addMsg("Question automatique sur le code actuel", 'system');
        }, 100);
    } else if (analysis.includes("⚠️  Éditeur chargé mais accès au code limité")) {
        addMsg("⚠️  L'éditeur est chargé mais je n'arrive pas à accéder au code. Essayons une approche alternative...", 'system');

        // Essayer de récupérer le code avec les méthodes alternatives
        setTimeout(() => {
            tryAlternativeCodeAccess(input);
        }, 500);
    } else if (analysis.includes("⏳ Éditeur en cours de chargement")) {
        addMsg("⏳ L'éditeur est encore en cours de chargement. Veuillez patienter quelques secondes.", 'system');
    } else if (analysis.includes("❌ Impossible d'accéder")) {
        addMsg("❌ Impossible d'accéder au code de l'éditeur. Veuillez actualiser la page.", 'system');
    } else {
        addMsg("ℹ️ Aucun code détecté. Veuillez écrire du code dans l'éditeur d'abord.", 'system');
    }
}

function handleEnter(e) {
    if (e.key === 'Enter') sendMessage();
}

function addMsg(text, type) {
    const container = document.getElementById('ai-messages');
    const div = document.createElement('div');
    div.className = `ai-msg ${type}`;

    // Si c'est le bot, on parse un peu le markdown basique (code blocks)
    if (type === 'bot') {
        text = text.replace(/```([\s\S]*?)```/g, '<pre style="background:rgba(0,0,0,0.3); padding:5px; border-radius:4px; overflow-x:auto;"><code>$1</code></pre>');
        text = text.replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.1); padding:2px 4px; border-radius:3px;">$1</code>');
    }

    div.innerHTML = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    return div;
}

async function sendMessage() {
    const input = document.getElementById('ai-input');
    const text = input.value.trim();
    if (!text) return;

    const apiKey = localStorage.getItem('GROQ_API_KEY');
    if (!apiKey) {
        askApiKey();
        return;
    }

    // Générer le contexte automatique
    const systemPrompt = generateSystemPrompt();

    addMsg(text, 'user');
    input.value = '';

    const loadingMsg = addMsg("Réflexion...", 'system');

    try {
        const response = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    {
                        role: "system",
                        content: systemPrompt
                    },
                    {
                        role: "user",
                        content: text
                    }
                ],
                temperature: 0.7,
                max_tokens: 1024
            })
        });

        if (!response.ok) {
            if (response.status === 401) {
                loadingMsg.remove();
                addMsg("❌ Erreur 401 : Clé API invalide. Essaye de réinitialiser la clé via le bouton en bas ou entre une nouvelle clé valide.", 'system');
                return;
            }
            throw new Error("Erreur API: " + response.status);
        }

        const data = await response.json();
        const reply = data.choices[0].message.content;

        loadingMsg.remove();
        addMsg(reply, 'bot');

    } catch (error) {
        if (loadingMsg) loadingMsg.remove();
        addMsg("Erreur de connexion à Groq. Vérifie ta clé ou ta connexion. Détails: " + error.message, 'system');
        console.error(error);
    }
}

function generateSystemPrompt() {
    // Récupérer le contexte en fonction de la page
    let contextCode = "";
    let contextInfo = "";

    // 1. Récupérer le code de l'éditeur (Monaco) si disponible
    // Vérification améliorée avec plusieurs méthodes
    let editorAvailable = false;
    let editorCode = "";

    // Méthode 1: Vérification directe de window.editor
    if (window.editor && typeof window.editor.getValue === 'function') {
        try {
            editorCode = window.editor.getValue();
            editorAvailable = true;
        } catch (error) {
            console.error("Erreur lors de la récupération du code (méthode 1):", error);
        }
    }

    // Méthode 2: Si window.editor n'est pas disponible, essayer de trouver l'éditeur dans le DOM
    if (!editorAvailable && document.querySelector('#monaco-editor-container')) {
        try {
            // Essayer d'accéder à l'éditeur via Monaco directement
            if (typeof monaco !== 'undefined' && monaco.editor) {
                const editors = monaco.editor.getEditors();
                if (editors && editors.length > 0) {
                    editorCode = editors[0].getValue();
                    editorAvailable = true;
                }
            }
        } catch (error) {
            console.error("Erreur lors de la récupération du code (méthode 2):", error);
        }
    }

    // Méthode 3: Vérification de l'élément textarea caché que Monaco utilise
    if (!editorAvailable) {
        const textarea = document.querySelector('#monaco-editor-container textarea');
        if (textarea && textarea.value) {
            editorCode = textarea.value;
            editorAvailable = true;
        }
    }

    // Déterminer le contexte en fonction de ce qui a été trouvé
    if (editorAvailable) {
        contextInfo = "L'utilisateur travaille dans l'éditeur de code.\n";

        // Vérifier si le code n'est pas vide
        if (!editorCode || editorCode.trim() === '') {
            contextCode = "-- Aucun code dans l'éditeur --";
        } else {
            contextCode = "-- Code actuel dans l'éditeur:\n" + editorCode;
        }
    } else if (document.querySelector('#monaco-editor-container')) {
        // Vérifier si Monaco est en train de charger
        if (document.querySelector('.monaco-editor')) {
            // L'éditeur semble chargé mais pas accessible
            contextInfo = "L'utilisateur est dans l'éditeur de code (éditeur chargé mais accès limité).\n";
            contextCode = "-- Éditeur Monaco détecté mais code non accessible --";
        } else {
            // L'éditeur est vraiment en cours de chargement
            contextInfo = "L'utilisateur est dans l'éditeur de code (éditeur en cours de chargement).\n";
            contextCode = "-- Éditeur Monaco en cours de chargement --";
        }
    }

    // 2. Récupérer le contenu de la leçon si disponible
    if (document.querySelector('.lesson-content')) {
        const lessonTitle = document.querySelector('.lesson-content h1')?.textContent || 'Leçon inconnue';
        const lessonDescription = document.querySelector('.lesson-content .lesson-intro')?.textContent || '';
        const lessonSections = document.querySelectorAll('.lesson-content .code-block');
        const lessonSectionTitles = document.querySelectorAll('.lesson-content h2');

        contextInfo = `L'utilisateur consulte la leçon : "${lessonTitle}".\n`;
        if (lessonDescription) {
            contextInfo += `Description : ${lessonDescription}\n\n`;
        }

        // Extraire les titres des sections pour le contexte
        let sectionsInfo = "Sections de la leçon : ";
        lessonSectionTitles.forEach((title, index) => {
            if (index < 3) { // Limiter à 3 sections pour éviter la surcharge
                sectionsInfo += `${title.textContent.trim()}; `;
            }
        });
        contextInfo += sectionsInfo + "\n\n";

        // Extraire les exemples de code de la leçon
        lessonSections.forEach((section, index) => {
            const code = section.querySelector('code')?.textContent;
            if (code) {
                contextCode += `\n-- Exemple ${index + 1} de la leçon:\n${code}\n`;
            }
        });
    }

    // 3. Détection de la page des cours
    if (document.querySelector('.courses-section')) {
        contextInfo = "L'utilisateur consulte la liste des cours.\n";

        // Ajouter les modules disponibles
        const modules = document.querySelectorAll('.course-module');
        contextInfo += `Modules disponibles : ${modules.length} modules\n`;
    }

    // 4. Détection de la page d'accueil
    if (document.querySelector('.hero')) {
        contextInfo = "L'utilisateur est sur la page d'accueil de LuaMaster.\n";
    }

    // 5. Si aucun contexte spécifique, utiliser un contexte générique
    if (!contextInfo) {
        contextInfo = "L'utilisateur navigue sur la plateforme LuaMaster.";
    }

    // Générer le system prompt complet
    return `Tu es un assistant expert en Lua et Roblox Studio. 
    Aide l'utilisateur avec son code. Sois concis, pédagogique et encourageant.
    
    Contexte actuel : ${contextInfo}
    
    Code pertinent :\n\`\`\`lua\n${contextCode}\n\`\`\`
    
    Erreurs/avertissements récents :
    ${getErrorContext()}
    
    Règles importantes :
    1. Si l'utilisateur demande de l'aide sur un concept, utilise des exemples simples et clairs
    2. Si l'utilisateur a une erreur, aide-le à la corriger étape par étape
    3. Encourage toujours l'utilisateur et sois positif
    4. Si tu ne connais pas la réponse, dis-le honnêtement
    5. Si des erreurs sont présentes, propose des solutions spécifiques
    6. Tu as toujours accès au contexte automatique, pas besoin de demander le code`;
}
