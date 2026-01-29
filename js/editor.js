// Editor JavaScript - Powered by Monaco Editor & Fengari

const examples = {
    hello: `-- 🎮 Hello World en Lua !
-- C'est ton premier programme
-- Clique sur "Exécuter" (ou Ctrl+Enter) pour lancer

print("Bonjour le monde !")
print("Bienvenue dans LuaMaster !")

-- Les commentaires commencent par --
-- Ils ne sont pas exécutés`,

    variables: `-- 📦 Les Variables en Lua
-- Les variables stockent des données

-- Déclarer une variable locale
local nom = "Alex"
local age = 16
local estJoueur = true
local score = 1500.50

-- Afficher les variables
print("Nom: " .. nom)
print("Âge: " .. age)
print("Est joueur: " .. tostring(estJoueur))
print("Score: " .. score)

-- Modifier une variable
score = score + 100
print("Nouveau score: " .. score)`,

    conditions: `-- 🔀 Les Conditions (if/else)
-- Prendre des décisions dans le code

local score = 85

-- Condition simple
if score >= 90 then
    print("Excellent ! Note: A")
elseif score >= 80 then
    print("Très bien ! Note: B")
elseif score >= 70 then
    print("Bien ! Note: C")
else
    print("Continue tes efforts !")
end

-- Opérateurs logiques
local niveau = 10
local aEpee = true

if niveau >= 5 and aEpee then
    print("Tu peux combattre le boss !")
end

if niveau < 3 or not aEpee then
    print("Tu n'es pas prêt...")
end`,

    loops: `-- 🔁 Les Boucles
-- Répéter des actions

-- Boucle for (nombre de fois défini)
print("=== Boucle for ===")
for i = 1, 5 do
    print("Itération: " .. i)
end

-- Boucle for avec pas
print("\\n=== Compte à rebours ===")
for i = 10, 1, -1 do
    print(i .. "...")
end
print("Décollage ! 🚀")

-- Boucle while
print("\\n=== Boucle while ===")
local energie = 100
while energie > 0 do
    print("Énergie: " .. energie)
    energie = energie - 25
end
print("Plus d'énergie !")`,

    functions: `-- ⚡ Les Fonctions
-- Réutiliser du code

-- Fonction simple
local function saluer()
    print("Salut !")
end

saluer()

-- Fonction avec paramètre
local function direBonjour(nom)
    print("Bonjour, " .. nom .. " !")
end

direBonjour("Alex")
direBonjour("Marie")

-- Fonction avec retour
local function additionner(a, b)
    return a + b
end

local resultat = additionner(10, 5)
print("10 + 5 = " .. resultat)

-- Fonction avec plusieurs retours
local function calculer(a, b)
    local somme = a + b
    local produit = a * b
    return somme, produit
end

local s, p = calculer(3, 4)
print("Somme: " .. s, "Produit: " .. p)`,

    tables: `-- 📋 Les Tables
-- Stocker plusieurs valeurs

-- Array (tableau indexé)
local fruits = {"Pomme", "Banane", "Orange"}
print("Premier fruit: " .. fruits[1])
print("Nombre de fruits: " .. #fruits)

-- Parcourir un array
print("\\n=== Liste des fruits ===")
for i, fruit in ipairs(fruits) do
    print(i .. ". " .. fruit)
end

-- Dictionnaire (clé-valeur)
local joueur = {
    nom = "Alex",
    niveau = 25,
    vie = 100,
    mana = 50
}

print("\\n=== Stats du joueur ===")
print("Nom: " .. joueur.nom)
print("Niveau: " .. joueur.niveau)
print("Vie: " .. joueur.vie)

-- Parcourir un dictionnaire
print("\\n=== Toutes les stats ===")
for cle, valeur in pairs(joueur) do
    print(cle .. ": " .. tostring(valeur))
end`,

    roblox: `-- 🎮 Concepts Roblox (simulation)
-- Note: Ce code simule l'API Roblox pour l'apprentissage

print("=== Simulation Roblox ===\\n")

-- Simuler un joueur (Instance)
local player = {
    Name = "Player1",
    UserId = 12345,
    Character = {
        Humanoid = {
            Health = 100,
            MaxHealth = 100,
            WalkSpeed = 16
        }
    }
}

print("Joueur: " .. player.Name)
print("UserID: " .. player.UserId)

-- Simuler un événement
local function onPlayerJoin(p)
    print("\\n" .. p.Name .. " a rejoint le jeu !")
    print("Bienvenue ! 🎉")
end

onPlayerJoin(player)

-- Simuler un système de points (Leaderstats)
local leaderstats = {
    Points = 0,
    Wins = 0
}

local function addPoints(amount)
    leaderstats.Points = leaderstats.Points + amount
    print("+" .. amount .. " points ! Total: " .. leaderstats.Points)
end

addPoints(10)
addPoints(25)
addPoints(100)

print("\\n=== Leaderboard ===")
for stat, valeur in pairs(leaderstats) do
    print(stat .. ": " .. valeur)
end`
};

let editor; // Monaco editor instance
let output;

document.addEventListener('DOMContentLoaded', () => {
    output = document.getElementById('console-output');

    initMonaco();
    initExamples();
    initButtons();
});

function initMonaco() {
    require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' } });

    require(['vs/editor/editor.main'], function () {
        // Define Lua Luau theme
        monaco.editor.defineTheme('luauDark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '6a9955', fontStyle: 'italic' },
                { token: 'keyword', foreground: 'c678dd', fontStyle: 'bold' },
                { token: 'identifier', foreground: 'e06c75' },
                { token: 'string', foreground: '98c379' },
                { token: 'number', foreground: 'd19a66' },
                { token: 'delimiter', foreground: 'abb2bf' }
            ],
            colors: {
                'editor.background': '#1e1e1e00', // Transparent to use CSS bg
                'editor.background': '#0f0f1a', // Fallback
            }
        });

        // Register custom Lua completion provider if needed
        // For now, default Lua support is great

        editor = monaco.editor.create(document.getElementById('monaco-editor-container'), {
            value: examples.hello,
            language: 'lua',
            theme: 'luauDark',
            automaticLayout: true,
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            minimap: {
                enabled: false
            },
            lineNumbers: 'on',
            lineNumbersMinChars: 3,
            scrollBeyondLastLine: false,
            renderLineHighlight: 'all',
            roundedSelection: true,
            scrollbar: {
                vertical: 'auto',
                horizontal: 'auto'
            },
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
        });

        // Add Ctrl+Enter command
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, function () {
            runCode();
        });
    });
}

function initExamples() {
    document.querySelectorAll('.example-item').forEach(item => {
        item.addEventListener('click', () => {
            const exampleName = item.getAttribute('data-example');
            loadExample(exampleName);

            document.querySelectorAll('.example-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

function loadExample(name) {
    if (examples[name] && editor) {
        editor.setValue(examples[name]);
        clearConsole();
        logOutput('Exemple chargé: ' + name, 'info');
    }
}

function initButtons() {
    document.getElementById('btn-run').addEventListener('click', runCode);
    document.getElementById('btn-clear').addEventListener('click', () => {
        if (editor) editor.setValue('');
    });
    document.getElementById('btn-copy').addEventListener('click', () => {
        if (editor) {
            navigator.clipboard.writeText(editor.getValue());
            showToast('Code copié !');
        }
    });
    document.getElementById('btn-format').addEventListener('click', () => {
        if (editor) {
            editor.getAction('editor.action.formatDocument').run();
        }
    });
    document.getElementById('btn-clear-console').addEventListener('click', clearConsole);
}

function runCode() {
    clearConsole();
    if (!editor) return;

    const code = editor.getValue();

    if (!code.trim()) {
        logOutput('Écrivez du code avant d\'exécuter !', 'warn');
        return;
    }

    logOutput('▶ Exécution...', 'info');

    try {
        if (typeof fengari !== 'undefined') {
            const L = fengari.lauxlib.luaL_newstate();
            fengari.lualib.luaL_openlibs(L);

            // --- 1. Surcharger print pour la console HTML ---
            fengari.lua.lua_pushcfunction(L, function (L) {
                const nargs = fengari.lua.lua_gettop(L);
                const parts = [];
                for (let i = 1; i <= nargs; i++) {
                    if (fengari.lua.lua_isnil(L, i)) {
                        parts.push("nil");
                    } else if (fengari.lua.lua_isboolean(L, i)) {
                        parts.push(fengari.lua.lua_toboolean(L, i) ? "true" : "false");
                    } else {
                        const s = fengari.lauxlib.luaL_tolstring(L, i);
                        parts.push(fengari.to_jsstring(s));
                        fengari.lua.lua_pop(L, 1);
                    }
                }
                logOutput(parts.join('\t'), 'success');
                return 0;
            });
            fengari.lua.lua_setglobal(L, fengari.to_luastring('print'));

            // --- 2. Simuler l'API Roblox (Environment Mock) ---

            // Mocks simplifiés mais fonctionnels
            const setupRobloxEnv = `
                -- 1. Simulation de Vector3
                Vector3 = {
                    new = function(x, y, z) 
                        return {x=x or 0, y=y or 0, z=z or 0, __type="Vector3"} 
                    end,
                    zero = {x=0, y=0, z=0},
                    one = {x=1, y=1, z=1}
                }
                setmetatable(Vector3, {
                    __call = function(_, x, y, z) return Vector3.new(x, y, z) end,
                    __index = function(t, k)
                        if k == "new" then return Vector3.new end
                    end
                })
                
                -- Metatable pour les instances Vector3
                debug.setmetatable({__type="Vector3"}, {
                    __tostring = function(v) return string.format("%.3f, %.3f, %.3f", v.x, v.y, v.z) end,
                    __add = function(a, b) return Vector3.new(a.x+b.x, a.y+b.y, a.z+b.z) end
                })

                -- 2. Simulation de Instance.new
                Instance = {}
                function Instance.new(className, parent)
                    print("🛠️ Simulation: Création d'une instance '" .. className .. "'")
                    
                    local obj = {
                        Name = className,
                        ClassName = className,
                        Parent = parent,
                        Position = Vector3.new(0,0,0),
                        Anchored = false,
                        Transparency = 0,
                        BrickColor = "Medium stone grey",
                        Destroy = function(self) print("🗑️ " .. self.Name .. " détruit") end,
                        Clone = function(self) print("📋 " .. self.Name .. " cloné"); return self end,
                        FindFirstChild = function(self, name) 
                             print("🔍 Recherche de '" .. name .. "' dans " .. self.Name)
                             return nil 
                        end,
                        WaitForChild = function(self, name)
                             print("⏳ Attente de '" .. name .. "' dans " .. self.Name)
                             return {Name = name} -- Mock result
                        end
                    }
                    
                    if parent then
                        print("   ↳ Parenté à: " .. parent.Name)
                    end
                    
                    return obj
                end

                -- 3. Simulation de task.wait
                task = {}
                function task.wait(t)
                    t = t or 0
                    print("⏳ (Pause simulée de " .. t .. "s)")
                    return t
                end
                
                -- Compatibilité wait()
                function wait(t) return task.wait(t) end

                -- 4. Simulation de game et Workspace
                game = {
                    GetService = function(self, service)
                        print("🔌 GetService: " .. service)
                        return {Name = service, ClassName = service}
                    end,
                    Workspace = {Name = "Workspace", ClassName = "Workspace"},
                    Players = {
                        LocalPlayer = {Name = "JoueurTest", UserId = 112233},
                        GetPlayers = function() return { {Name = "JoueurTest"} } end
                    },
                    Lighting = {ClockTime = 14},
                    ReplicatedStorage = {Name = "ReplicatedStorage"}
                }
                workspace = game.Workspace
                
                -- Redirection de game.Workspace si possible (limité par la structure de table simple)
                
                -- 5. Maths Roblox
                math.clamp = function(x, min, max) return math.min(math.max(x, min), max) end
                math.round = function(x) return math.floor(x + 0.5) end
                
                print("✅ Environnement Roblox simulé chargé !")
            `;

            // Charger l'environnement simulé
            // Note: On le fait dans un pcall pour éviter de crasher si erreur de syntaxe interne
            const statusMock = fengari.lauxlib.luaL_dostring(L, fengari.to_luastring(setupRobloxEnv));
            if (statusMock !== fengari.lua.LUA_OK) {
                const errorMsg = fengari.lua.lua_tojsstring(L, -1);
                console.error("Erreur chargement mock:", errorMsg);
            }

            // --- 3. Exécuter le code utilisateur ---
            const status = fengari.lauxlib.luaL_dostring(L, fengari.to_luastring(code));

            if (status !== fengari.lua.LUA_OK) {
                const errorMsg = fengari.lua.lua_tojsstring(L, -1);
                // Nettoyer le message d'erreur
                const cleanError = errorMsg.replace(/^\[string ".*?"\]:\d+:\s*/, '');
                logOutput('Erreur: ' + cleanError, 'error');
            }

            fengari.lua.lua_close(L);
        } else {
            logOutput('Erreur système: L\'interpréteur Lua n\'est pas chargé.', 'error');
        }
    } catch (error) {
        console.error(error);
        logOutput('Erreur critique: ' + error.message, 'error');
    }
}

function logOutput(message, type = 'info') {
    const p = document.createElement('p');
    p.className = 'console-' + type;

    const icon = type === 'success' ? '►' :
        type === 'error' ? '✗' :
            type === 'warn' ? '⚠' : 'ℹ';

    // Safety escape
    const escapedMessage = message.replace(/[&<>'"]/g,
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag]));

    p.innerHTML = `<span class="console-icon">${icon}</span> <span class="console-text">${escapedMessage}</span>`;
    output.appendChild(p);
    output.scrollTop = output.scrollHeight;
}

function clearConsole() {
    output.innerHTML = '';
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 24px;
        background: var(--secondary);
        color: white;
        border-radius: 8px;
        font-size: 0.9rem;
        z-index: 10000;
        animation: fadeInUp 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}
