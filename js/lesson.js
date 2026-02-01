// Lesson page JavaScript - Enhanced with modal quiz system

document.addEventListener('DOMContentLoaded', () => {
    // --- SECURITY & NAVIGATION CHECK ---
    const btn = document.getElementById('complete-lesson');
    if (btn && window.LessonManager) {
        const lessonId = btn.getAttribute('data-lesson');

        // 1. Security Redirect: If lesson is locked, go back to courses
        if (!window.LessonManager.isUnlocked(lessonId)) {
            // Utilisation d'un paramètre pour afficher le toast dans courses.html (à implémenter si besoin)
            window.location.href = '../courses.html?locked=' + lessonId;
            return;
        }

        // 2. Next Lesson Button Locking
        const nextLink = document.querySelector('.nav-next a');
        if (nextLink) {
            const nextLessonId = window.LessonManager.getNextLesson(lessonId);
            // Vérifier si la prochaine leçon est débloquée (donc si la courante est finie)
            // Ou plus simplement : si la leçon courante n'est pas finie, la suivante est bloquée.
            const isCurrentFinished = Progress.get('lesson_' + lessonId);

            if (!isCurrentFinished && !Progress.DEBUG_DISABLE_LOCKS) {
                // Save the original href before locking
                nextLink.dataset.originalHref = nextLink.href;
                nextLink.classList.add('locked-link');
                nextLink.href = 'javascript:void(0)';
                nextLink.style.opacity = '0.6';
                nextLink.style.cursor = 'not-allowed';
                nextLink.innerHTML += ' <i class="fas fa-lock" style="font-size:0.8em; margin-left:5px;"></i>';

                // Add toast on click
                nextLink.addEventListener('click', () => {
                    alert("Vous devez terminer cette leçon (et le quiz) pour passer à la suivante !");
                });
            }
        }
    }
    // -----------------------------------

    initCompleteButton();
    loadCompletedLessons();
    initLessonQuizModal();
    initExerciseButtons();
});

function initExerciseButtons() {
    const lessonId = document.getElementById('complete-lesson')?.getAttribute('data-lesson');
    if (!lessonId) return;

    // Helper to ensure data is loaded
    if (!window.ExerciseData) {
        const script = document.createElement('script');
        script.src = '../js/data/exercises.js';
        script.onload = () => initExerciseButtons();
        document.head.appendChild(script);
        return;
    }

    const data = window.ExerciseData[lessonId];
    if (!data) return;

    const sections = document.querySelectorAll('.lesson-section, .info-box, .warning-box');

    sections.forEach(section => {
        const title = section.querySelector('h2, h3, h4');
        if (title && title.textContent.toLowerCase().includes('exercice')) {
            // Check if already processed
            if (section.classList.contains('exercise-processed')) return;
            section.classList.add('exercise-processed');

            let tasksHtml = data.tasks.map(t => `<li><i class="fas fa-check-circle"></i> <span>${t}</span></li>`).join('');

            section.innerHTML = `
                <div class="exercise-header">
                    <div class="exercise-badge"><i class="fas fa-play-circle"></i> Exercice</div>
                    <h2>${data.title}</h2>
                </div>
                <p class="exercise-desc">${data.description}</p>
                <ul class="exercise-task-list">
                    ${tasksHtml}
                </ul>
                <div class="exercise-footer">
                    <a href="../editor.html?lesson=${lessonId}" class="btn btn-primary exercise-launch-btn">
                        <i class="fas fa-code"></i> Lancer dans l'Éditeur
                        <div class="btn-shine"></div>
                    </a>
                </div>
            `;

            section.classList.add('premium-exercise-box');
        }
    });
}

// Lesson quiz data - specific questions for each lesson
const lessonQuizzes = {
    '1-1': {
        title: 'Quiz - Introduction au Lua',
        questions: [
            {
                question: 'Que signifie le mot "Lua" en portugais ?',
                answers: ['Soleil', 'Lune', 'Étoile', 'Terre'],
                correct: 1
            },
            {
                question: 'En quelle année Lua a-t-il été créé ?',
                answers: ['1993', '2000', '2004', '2010'],
                correct: 0
            },
            {
                question: 'Comment s\'appelle la version de Lua utilisée par Roblox ?',
                answers: ['Lua++', 'LuaScript', 'Luau', 'RobloxLua'],
                correct: 2
            }
        ],
        requiredScore: 2
    },
    '1-2': {
        title: 'Quiz - Premier Script',
        questions: [
            {
                question: 'Quelle fonction affiche du texte dans la console ?',
                answers: ['console.log()', 'echo()', 'print()', 'write()'],
                correct: 2
            },
            {
                question: 'Où apparaissent les messages de print() dans Roblox Studio ?',
                answers: ['Dans le jeu', 'Dans l\'Output', 'Dans Explorer', 'Nulle part'],
                correct: 1
            },
            {
                question: 'Comment commence un commentaire en Lua ?',
                answers: ['//', '#', '--', '/*'],
                correct: 2
            }
        ],
        requiredScore: 2
    },
    '1-3': {
        title: 'Quiz - Les Variables',
        questions: [
            {
                question: 'Quel mot-clé déclare une variable locale ?',
                answers: ['var', 'let', 'local', 'const'],
                correct: 2
            },
            {
                question: 'Une variable sans "local" est de quelle portée ?',
                answers: ['Locale', 'Globale', 'Privée', 'Protégée'],
                correct: 1
            },
            {
                question: 'Peut-on changer la valeur d\'une variable après sa création ?',
                answers: ['Non, jamais', 'Oui, toujours', 'Seulement les nombres', 'Seulement les strings'],
                correct: 1
            }
        ],
        requiredScore: 2
    },
    '1-4': {
        title: 'Quiz - Types de Données',
        questions: [
            {
                question: 'Quel type représente du texte en Lua ?',
                answers: ['text', 'char', 'string', 'word'],
                correct: 2
            },
            {
                question: 'Que représente "nil" en Lua ?',
                answers: ['Zéro', 'Faux', 'Rien/Absence de valeur', 'Erreur'],
                correct: 2
            },
            {
                question: 'Quels sont les deux valeurs possibles pour un boolean ?',
                answers: ['0 et 1', 'oui et non', 'true et false', 'vrai et faux'],
                correct: 2
            }
        ],
        requiredScore: 2
    },
    '1-5': {
        title: 'Quiz - Opérateurs',
        questions: [
            {
                question: 'Quel opérateur fait le modulo (reste de division) ?',
                answers: ['/', '%', 'mod', '\\\\'],
                correct: 1
            },
            {
                question: 'Comment concatène-t-on deux strings ?',
                answers: ['+', '&', '..', 'concat'],
                correct: 2
            },
            {
                question: 'Quel opérateur vérifie "différent de" ?',
                answers: ['!=', '<>', '~=', '!=='],
                correct: 2
            }
        ],
        requiredScore: 2
    },
    '1-6': {
        title: 'Quiz - Conditions',
        questions: [
            {
                question: 'Quelle syntaxe termine un bloc if ?',
                answers: ['endif', '}', 'fi', 'end'],
                correct: 3
            },
            {
                question: 'Comment écrit-on "sinon si" en Lua ?',
                answers: ['else if', 'elif', 'elseif', 'elsif'],
                correct: 2
            },
            {
                question: 'Que retourne "not true" ?',
                answers: ['true', 'false', 'nil', 'erreur'],
                correct: 1
            }
        ],
        requiredScore: 2
    },
    '2-1': {
        title: 'Quiz - Boucle while',
        questions: [
            {
                question: 'Combien de fois s\'exécute while false do ... end ?',
                answers: ['0 fois', '1 fois', 'Infini', 'Erreur'],
                correct: 0
            },
            {
                question: 'Quel mot-clé sort immédiatement d\'une boucle ?',
                answers: ['exit', 'stop', 'break', 'return'],
                correct: 2
            },
            {
                question: 'La condition while est vérifiée à quel moment ?',
                answers: ['Avant chaque itération', 'Après chaque itération', 'Une seule fois', 'Jamais'],
                correct: 0
            }
        ],
        requiredScore: 2
    },
    '2-2': {
        title: 'Quiz - Boucle for',
        questions: [
            {
                question: 'Combien de fois s\'exécute: for i = 1, 5 do ?',
                answers: ['4 fois', '5 fois', '6 fois', 'Infini'],
                correct: 1
            },
            {
                question: 'Que fait le 3ème paramètre dans for i = 10, 1, -1 ?',
                answers: ['Définit la fin', 'Définit le pas', 'Définit le début', 'Rien'],
                correct: 1
            },
            {
                question: 'La variable i dans for i = ... est-elle accessible après la boucle ?',
                answers: ['Oui', 'Non', 'Parfois', 'Si globale seulement'],
                correct: 1
            }
        ],
        requiredScore: 2
    },
    '2-3': {
        title: 'Quiz - Fonctions',
        questions: [
            {
                question: 'Quel mot-clé déclare une fonction ?',
                answers: ['def', 'func', 'function', 'fn'],
                correct: 2
            },
            {
                question: 'Comment retourne-t-on une valeur ?',
                answers: ['output', 'return', 'give', 'send'],
                correct: 1
            },
            {
                question: 'Une fonction peut-elle ne rien retourner ?',
                answers: ['Non jamais', 'Oui, elle retourne nil', 'Erreur', 'Seulement si vide'],
                correct: 1
            }
        ],
        requiredScore: 2
    },
    '2-4': {
        title: 'Quiz - Paramètres & Retours',
        questions: [
            {
                question: 'Si une fonction attend 2 params mais n\'en reçoit qu\'1 ?',
                answers: ['Erreur', 'Le 2ème est nil', 'Le 2ème est 0', 'La fonction ne s\'exécute pas'],
                correct: 1
            },
            {
                question: 'Peut-on retourner plusieurs valeurs ?',
                answers: ['Non', 'Oui, avec return a, b', 'Oui, avec un tableau', 'Max 2'],
                correct: 1
            },
            {
                question: 'Comment passe-t-on un nombre variable d\'arguments ?',
                answers: ['...args', '...', '*args', 'varargs'],
                correct: 1
            }
        ],
        requiredScore: 2
    },
    '2-5': {
        title: 'Quiz - Scope & Closures',
        questions: [
            {
                question: 'Une variable local dans une fonction est visible où ?',
                answers: ['Partout', 'Dans la fonction seulement', 'Dans le fichier', 'Nulle part'],
                correct: 1
            },
            {
                question: 'Qu\'est-ce qu\'une closure ?',
                answers: ['Une erreur', 'Une fonction fermée', 'Une fonction qui capture des variables externes', 'Un type de boucle'],
                correct: 2
            },
            {
                question: 'Les fonctions en Lua sont-elles des "first-class values" ?',
                answers: ['Non', 'Oui', 'Parfois', 'Seulement les locales'],
                correct: 1
            }
        ],
        requiredScore: 2
    },
    '3-1': {
        title: 'Quiz - Tables Introduction',
        questions: [
            {
                question: 'Comment crée-t-on une table vide ?',
                answers: ['[]', '{}', 'new Table()', 'table()'],
                correct: 1
            },
            {
                question: 'Les tableaux Lua commencent à quel index ?',
                answers: ['0', '1', '-1', 'Ça dépend'],
                correct: 1
            },
            {
                question: 'Les tables peuvent-elles contenir des types mixtes ?',
                answers: ['Non', 'Oui', 'Seulement nombres et strings', 'Avec mixed = true'],
                correct: 1
            }
        ],
        requiredScore: 2
    },
    '3-2': {
        title: 'Quiz - Dictionnaires',
        questions: [
            {
                question: 'Comment accéder à player.name autrement ?',
                answers: ['player->name', 'player["name"]', 'player:name', 'player(name)'],
                correct: 1
            },
            {
                question: 'Que retourne #t pour {a=1, b=2} ?',
                answers: ['2', '0', 'nil', 'Erreur'],
                correct: 1
            },
            {
                question: 'Comment supprimer une clé d\'un dictionnaire ?',
                answers: ['delete t.key', 't.key = nil', 'remove(t, "key")', 't.remove("key")'],
                correct: 1
            }
        ],
        requiredScore: 2
    },
    '3-3': {
        title: 'Quiz - Itération',
        questions: [
            {
                question: 'ipairs parcourt quels types de clés ?',
                answers: ['Toutes', 'Numériques séquentielles', 'Strings seulement', 'Aléatoires'],
                correct: 1
            },
            {
                question: 'pairs parcourt quels types de clés ?',
                answers: ['Numériques seulement', 'Strings seulement', 'Toutes les clés', 'Aucune'],
                correct: 2
            },
            {
                question: 'L\'ordre de pairs est-il garanti ?',
                answers: ['Oui, toujours', 'Non, pas garanti', 'Alphabétique', 'Numérique'],
                correct: 1
            }
        ],
        requiredScore: 2
    },
    '4-1': {
        title: 'Quiz - Instances',
        questions: [
            {
                question: 'Comment créer une nouvelle Part ?',
                answers: ['new Part()', 'Part.new()', 'Instance.new("Part")', 'create("Part")'],
                correct: 2
            },
            {
                question: 'Que représente Parent ?',
                answers: ['Le type', 'Le conteneur parent', 'Le nom', 'La taille'],
                correct: 1
            },
            {
                question: 'Comment cloner un objet ?',
                answers: ['object.Copy()', 'object:Clone()', 'Clone(object)', 'object.clone'],
                correct: 1
            }
        ],
        requiredScore: 2
    },
    '4-2': {
        title: 'Quiz - Services',
        questions: [
            {
                question: 'Comment obtenir le service Players ?',
                answers: ['game.Players', 'Players.GetService()', 'require("Players")', 'Roblox.Players'],
                correct: 0
            },
            {
                question: 'Que contient game.Workspace ?',
                answers: ['Le code', 'L\'espace 3D du jeu', 'Les paramètres', 'Les joueurs'],
                correct: 1
            },
            {
                question: 'Où stocker des objets accessibles client ET serveur ?',
                answers: ['ServerStorage', 'ReplicatedStorage', 'Workspace', 'StarterGui'],
                correct: 1
            }
        ],
        requiredScore: 2
    },
    '4-3': {
        title: 'Quiz - Events',
        questions: [
            {
                question: 'Quel événement se déclenche quand un joueur rejoint ?',
                answers: ['PlayerJoined', 'PlayerAdded', 'OnJoin', 'NewPlayer'],
                correct: 1
            },
            {
                question: 'Comment connecter une fonction à un événement ?',
                answers: ['event.on(func)', 'event:Connect(func)', 'event.listen(func)', 'event.bind(func)'],
                correct: 1
            },
            {
                question: 'Que fait :Disconnect() ?',
                answers: ['Supprime l\'événement', 'Déconnecte la fonction', 'Erreur', 'Rien'],
                correct: 1
            }
        ],
        requiredScore: 2
    },
    '5-1': {
        title: 'Quiz - Leaderstats',
        questions: [
            {
                question: 'Quel doit être le nom du folder pour les leaderstats ?',
                answers: ['"leaderboard"', '"stats"', '"leaderstats"', '"score"'],
                correct: 2
            },
            {
                question: 'Où doit-on parent le folder leaderstats ?',
                answers: ['Workspace', 'ReplicatedStorage', 'Au Player', 'ServerStorage'],
                correct: 2
            },
            {
                question: 'Quel type utiliser pour une valeur entière ?',
                answers: ['NumberValue', 'IntValue', 'IntegerValue', 'WholeValue'],
                correct: 1
            }
        ],
        requiredScore: 2
    },
    '5-2': {
        title: 'Quiz - ClickDetector',
        questions: [
            {
                question: 'Dans quoi place-t-on un ClickDetector ?',
                answers: ['Un Script', 'Une Part', 'Workspace directement', 'Le joueur'],
                correct: 1
            },
            {
                question: 'Quel événement se déclenche au clic ?',
                answers: ['Clicked', 'MouseClick', 'Click', 'OnClick'],
                correct: 1
            },
            {
                question: 'Quel paramètre reçoit l\'événement MouseClick ?',
                answers: ['La Part', 'Le joueur qui a cliqué', 'La position', 'Rien'],
                correct: 1
            }
        ],
        requiredScore: 2
    },
    '5-3': {
        title: 'Quiz - Obby & Checkpoints',
        questions: [
            {
                question: 'Quel événement permet de créer une pièce qui tue (KillBrick) ?',
                answers: ['Touched', 'Clicked', 'Interacted', 'Collided'],
                correct: 0
            },
            {
                question: 'Comment téléporter le personnage avec un script ?',
                answers: ['character.Position = Vector3', 'character:MoveTo(Vector3)', 'character.Location = Vector3', 'character:Teleport(Vector3)'],
                correct: 1
            },
            {
                question: 'Quelle propriété du SpawnLocation gère les équipes ?',
                answers: ['TeamName', 'TeamId', 'TeamColor', 'TeamGroup'],
                correct: 2
            }
        ],
        requiredScore: 2
    },
    '5-4': {
        title: 'Quiz - Boutique & RemoteEvents',
        questions: [
            {
                question: 'Pourquoi utiliser un RemoteEvent pour les achats ?',
                answers: ['C\'est plus rapide', 'Pour la sécurité (Server)', 'Pour l\'animation', 'C\'est obligatoire pour tout'],
                correct: 1
            },
            {
                question: 'Dans quel dossier met-on les objets à vendre pour les cloner ?',
                answers: ['Workspace', 'StarterPack', 'ReplicatedStorage', 'ServerScriptService'],
                correct: 2
            },
            {
                question: 'Où le joueur stocke-t-il ses objets équipables ?',
                answers: ['Inventory', 'Backpack', 'Pocket', 'Storage'],
                correct: 1
            }
        ],
        requiredScore: 2
    },
    '5-5': {
        title: 'Quiz - DataStore',
        questions: [
            {
                question: 'Quel service permet de sauvegarder les données ?',
                answers: ['SaveService', 'StorageService', 'DataStoreService', 'MemoryService'],
                correct: 2
            },
            {
                question: 'Pourquoi utiliser pcall() ?',
                answers: ['Pour accélérer le code', 'Pour gérer les erreurs sans planter', 'Pour crypter les données', 'Pour appeler le serveur'],
                correct: 1
            },
            {
                question: 'Quelle fonction sauvegarde les données ?',
                answers: ['GetAsync', 'SaveAsync', 'SetAsync', 'UpdateAsync'],
                correct: 2
            }
        ],
        requiredScore: 2
    },
    '6-1': {
        title: 'Quiz - Bases du GUI',
        questions: [
            {
                question: 'Où sont stockées les interfaces par défaut dans l\'Explorer ?',
                answers: ['Workspace', 'ServerStorage', 'StarterGui', 'ReplicatedFirst'],
                correct: 2
            },
            {
                question: 'Quel élément est obligatoire pour afficher du GUI sur l\'écran ?',
                answers: ['Frame', 'ScreenGui', 'TextLabel', 'BillboardGui'],
                correct: 1
            },
            {
                question: 'Que signifie une valeur de Scale à 0.5 ?',
                answers: ['50 pixels', '50% de l\'écran', 'La moitié de la Frame parente', 'Le milieu de l\'écran'],
                correct: 2
            }
        ],
        requiredScore: 2
    },
    '6-2': {
        title: 'Quiz - Éléments Universels',
        questions: [
            {
                question: 'Quel élément est principalement utilisé comme "conteneur" pour grouper d\'autres objets ?',
                answers: ['TextLabel', 'ImageLabel', 'Frame', 'TextButton'],
                correct: 2
            },
            {
                question: 'Comment appelle-t-on l\'objet qui permet d\'arrondir les bords d\'une Frame ?',
                answers: ['UICorner', 'UIStroke', 'UIGradient', 'UIPadding'],
                correct: 0
            },
            {
                question: 'Quelle propriété des textes permet de s\'assurer qu\'ils remplissent toujours leur cadre ?',
                answers: ['TextWrapped', 'TextScaled', 'RichText', 'Font'],
                correct: 1
            }
        ],
        requiredScore: 2
    },
    '6-3': {
        title: 'Quiz - Layouts Flexibles',
        questions: [
            {
                question: 'Quel objet aligne automatiquement les éléments les uns en dessous des autres ou côte à côte ?',
                answers: ['UIGridLayout', 'UIListLayout', 'UIAspectRatioConstraint', 'UIPadding'],
                correct: 1
            },
            {
                question: 'Quel objet est le plus adapté pour créer une grille d\'inventaire ?',
                answers: ['UIListLayout', 'UIGridLayout', 'UIStroke', 'UICorner'],
                correct: 1
            },
            {
                question: 'À quoi sert l\'objet UIAspectRatioConstraint ?',
                answers: ['À ajouter une bordure', 'À garder les proportions (ex: un carré)', 'À changer la couleur au clic', 'À trier les éléments'],
                correct: 1
            }
        ],
        requiredScore: 2
    },
    '6-4': {
        title: 'Quiz - Interactions & Événements',
        questions: [
            {
                question: 'Quel événement se déclenche lorsqu\'un bouton est cliqué ?',
                answers: ['OnClick', 'MouseButton1Click', 'Touched', 'Triggered'],
                correct: 1
            },
            {
                question: 'Quel événement détecte quand la souris entre sur un élément UI ?',
                answers: ['MouseOver', 'MouseEnter', 'HoverStart', 'MouseInside'],
                correct: 1
            },
            {
                question: 'Peut-on manipuler l\'UI depuis un Script classique (Server) ?',
                answers: ['Oui, toujours', 'Non, seulement via un LocalScript', 'Seulement pour les couleurs', 'Seulement pour TextLabel'],
                correct: 1
            }
        ],
        requiredScore: 2
    },
    '6-5': {
        title: 'Quiz - Animations & Tweens',
        questions: [
            {
                question: 'Quel service permet de créer des animations fluides de propriétés ?',
                answers: ['AnimService', 'TweenService', 'SmoothService', 'MotionService'],
                correct: 1
            },
            {
                question: 'Quelle fonction est utilisée pour lancer une animation ?',
                answers: ['play()', 'start()', ':Play()', ':Run()'],
                correct: 2
            },
            {
                question: 'Comment définit-on la durée d\'un deplacement ?',
                answers: ['Via TweenInfo', 'Via Vector3', 'Via wait()', 'C\'est fixe (0.5s)'],
                correct: 0
            }
        ],
        requiredScore: 2
    },
    '7-1': {
        title: 'Quiz - Intro à Discordia',
        questions: [
            {
                question: 'Comment s\'appelle la librairie Lua la plus utilisée pour les bots Discord ?',
                answers: ['Discord.js', 'Discordia', 'LuaBot', 'Disclua'],
                correct: 1
            },
            {
                question: 'Quelle méthode crée une nouvelle instance de bot ?',
                answers: ['discordia.Bot()', 'discordia.Client()', 'Client.new()', 'discordia.create()'],
                correct: 1
            },
            {
                question: 'Quelle fonction est nécessaire pour lancer le bot avec son token ?',
                answers: ['bot:start()', 'bot:connect()', 'bot:run()', 'bot:login()'],
                correct: 2
            }
        ],
        requiredScore: 2
    },
    '7-2': {
        title: 'Quiz - Événements Discord',
        questions: [
            {
                question: 'Quel événement se déclenche lorsqu\'un message est envoyé ?',
                answers: ['onMessage', 'messageCreate', 'message', 'textReceived'],
                correct: 2
            },
            {
                question: 'Quelle méthode du message permet de répondre directement ?',
                answers: ['message:answer()', 'message:reply()', 'message:send()', 'message:write()'],
                correct: 1
            },
            {
                question: 'Comment s\'appelle l\'objet qui représente l\'auteur d\'un message ?',
                answers: ['User', 'Member', 'Author', 'Sender'],
                correct: 2
            }
        ],
        requiredScore: 2
    },
    '7-3': {
        title: 'Quiz - Commandes Avancées',
        questions: [
            {
                question: 'Comment extraire le premier mot d\'un message pour une commande ?',
                answers: ['message.content:split(" ")[1]', 'string.sub(message.content, 1, 10)', 'message.word', 'message:getCommand()'],
                correct: 0
            },
            {
                question: 'À quoi sert le préfixe dans un bot Discord ?',
                answers: ['À décorer les messages', 'À identifier les commandes pour le bot', 'À crypter les données', 'À se connecter à l\'API'],
                correct: 1
            },
            {
                question: 'Comment vérifier si un utilisateur a une permission spécifique ?',
                answers: ['member:hasPermission(p)', 'member.permission == p', 'author.admin', 'roles:find(p)'],
                correct: 0
            }
        ],
        requiredScore: 2
    }
};

// Quiz Modal State
let currentQuizLesson = null;
let currentQuizQuestion = 0;
let quizAnswers = [];

function initCompleteButton() {
    const btn = document.getElementById('complete-lesson');
    if (!btn) return;

    const lessonId = btn.getAttribute('data-lesson');
    const quizCompleted = Progress.get('quiz_lesson_' + lessonId);
    const lessonCompleted = Progress.get('lesson_' + lessonId);

    updateCompleteButton(btn, lessonId, lessonCompleted, quizCompleted);

    btn.addEventListener('click', () => {
        const isCompleted = Progress.get('lesson_' + lessonId);
        const hasQuiz = lessonQuizzes[lessonId];
        const quizDone = Progress.get('quiz_lesson_' + lessonId);

        if (!isCompleted) {
            if (hasQuiz && !quizDone) {
                openQuizModal(lessonId);
                return;
            }
            Progress.set('lesson_' + lessonId, true);
            markAsCompleted(btn);
            showConfetti();
        } else {
            Progress.set('lesson_' + lessonId, false);
            markAsIncomplete(btn, lessonId);
        }
    });
}

function updateCompleteButton(btn, lessonId, lessonCompleted, quizCompleted) {
    const hasQuiz = lessonQuizzes[lessonId];

    if (lessonCompleted) {
        markAsCompleted(btn);
    } else if (hasQuiz && !quizCompleted) {
        btn.innerHTML = '<i class="fas fa-gamepad"></i> Passer le Quiz pour terminer';
        btn.classList.add('needs-quiz');
    }
}

function markAsCompleted(btn) {
    btn.innerHTML = '<i class="fas fa-check-circle"></i> Complété ! <span class="uncomplete-hint">(Cliquer pour annuler)</span>';
    btn.classList.add('completed');
    btn.classList.remove('needs-quiz');
    unlockNextButton();
}

function unlockNextButton() {
    const nextLink = document.querySelector('.nav-next a');
    if (nextLink && nextLink.classList.contains('locked-link')) {
        nextLink.classList.remove('locked-link');
        nextLink.style.opacity = '';
        nextLink.style.cursor = '';

        // Restore original href from saved data attribute
        if (nextLink.dataset.originalHref) {
            nextLink.href = nextLink.dataset.originalHref;
        }

        // Remove lock icon
        const lockIcon = nextLink.querySelector('.fa-lock');
        if (lockIcon) {
            lockIcon.remove();
        }

        // Clone and replace to remove event listeners
        const newLink = nextLink.cloneNode(true);
        nextLink.parentNode.replaceChild(newLink, nextLink);
    }
}

function markAsIncomplete(btn, lessonId) {
    const hasQuiz = lessonQuizzes[lessonId];
    const quizDone = Progress.get('quiz_lesson_' + lessonId);

    btn.classList.remove('completed');

    if (hasQuiz && !quizDone) {
        btn.innerHTML = '<i class="fas fa-gamepad"></i> Passer le Quiz pour terminer';
        btn.classList.add('needs-quiz');
    } else {
        btn.innerHTML = '<i class="fas fa-check-circle"></i> Marquer comme terminé';
        btn.classList.remove('needs-quiz');
    }
}

function loadCompletedLessons() {
    document.querySelectorAll('.lesson-item').forEach(item => {
        const link = item.querySelector('a');
        if (link) {
            const href = link.getAttribute('href');
            const match = href.match(/(\d+-\d+)/);
            if (match && Progress.get('lesson_' + match[1])) {
                item.classList.add('completed');
            }
        }
    });
}

// ============================================
// QUIZ MODAL SYSTEM
// ============================================

function initLessonQuizModal() {
    // Create modal HTML if it doesn't exist
    if (!document.getElementById('lesson-quiz-modal')) {
        createQuizModalHTML();
    }
}

function createQuizModalHTML() {
    const modalHTML = `
    <div class="lesson-quiz-modal" id="lesson-quiz-modal">
        <div class="lqm-overlay"></div>
        <div class="lqm-content">
            <div class="lqm-header">
                <h2 id="lqm-title">Quiz</h2>
                <div class="lqm-progress">
                    <div class="lqm-progress-bar">
                        <div class="lqm-progress-fill" id="lqm-progress-fill"></div>
                    </div>
                    <span class="lqm-progress-text" id="lqm-progress-text">1/3</span>
                </div>
                <button class="lqm-close" id="lqm-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="lqm-body">
                <div class="lqm-question-container">
                    <div class="lqm-question-number" id="lqm-question-number">Q1</div>
                    <h3 class="lqm-question-text" id="lqm-question-text">Question ici</h3>
                </div>
                <div class="lqm-answers" id="lqm-answers">
                    <!-- Answers will be inserted here -->
                </div>
            </div>
            <div class="lqm-footer">
                <button class="btn btn-secondary" id="lqm-prev" disabled>
                    <i class="fas fa-arrow-left"></i> Précédent
                </button>
                <button class="btn btn-primary" id="lqm-next">
                    Suivant <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    </div>

    <div class="lqm-results-modal" id="lqm-results-modal">
        <div class="lqm-overlay"></div>
        <div class="lqm-results-content">
            <div class="lqm-results-icon" id="lqm-results-icon">
                <i class="fas fa-trophy"></i>
            </div>
            <h2 id="lqm-results-title">Résultats</h2>
            <div class="lqm-score">
                <span class="lqm-score-value" id="lqm-score-value">3/3</span>
                <span class="lqm-score-label">Bonnes réponses</span>
            </div>
            <p class="lqm-results-message" id="lqm-results-message">Message</p>
            <div class="lqm-results-actions">
                <button class="btn btn-secondary" id="lqm-retry">
                    <i class="fas fa-redo"></i> Réessayer
                </button>
                <button class="btn btn-primary" id="lqm-continue" style="display:none;">
                    <i class="fas fa-check"></i> Continuer
                </button>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Add event listeners
    document.getElementById('lqm-close').addEventListener('click', closeQuizModal);
    document.getElementById('lesson-quiz-modal').querySelector('.lqm-overlay').addEventListener('click', closeQuizModal);
    document.getElementById('lqm-results-modal').querySelector('.lqm-overlay').addEventListener('click', closeResultsModal);
    document.getElementById('lqm-prev').addEventListener('click', prevQuestion);
    document.getElementById('lqm-next').addEventListener('click', nextQuestion);
    document.getElementById('lqm-retry').addEventListener('click', retryQuiz);
    document.getElementById('lqm-continue').addEventListener('click', continueAfterQuiz);

    // Add modal styles
    addQuizModalStyles();
}

function addQuizModalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .lesson-quiz-modal, .lqm-results-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: none;
            align-items: center;
            justify-content: center;
        }

        .lesson-quiz-modal.active, .lqm-results-modal.active {
            display: flex;
        }

        .lqm-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
        }

        .lqm-content {
            position: relative;
            width: 90%;
            max-width: 600px;
            max-height: 90vh;
            background: var(--bg-secondary);
            border-radius: var(--border-radius-lg);
            border: 1px solid var(--border-color);
            overflow: hidden;
            animation: modalSlideIn 0.3s ease;
        }

        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-30px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        .lqm-header {
            display: flex;
            align-items: center;
            gap: 20px;
            padding: 20px 24px;
            background: var(--bg-tertiary);
            border-bottom: 1px solid var(--border-color);
        }

        .lqm-header h2 {
            font-size: 1.1rem;
            font-weight: 700;
            color: var(--primary);
            margin: 0;
            white-space: nowrap;
        }

        .lqm-progress {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .lqm-progress-bar {
            flex: 1;
            height: 6px;
            background: var(--bg-glass);
            border-radius: 3px;
            overflow: hidden;
        }

        .lqm-progress-fill {
            height: 100%;
            background: var(--gradient-primary);
            border-radius: 3px;
            transition: width 0.3s ease;
        }

        .lqm-progress-text {
            font-size: 0.85rem;
            color: var(--text-muted);
            font-weight: 600;
            white-space: nowrap;
        }

        .lqm-close {
            width: 36px;
            height: 36px;
            background: var(--bg-glass);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            color: var(--text-secondary);
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .lqm-close:hover {
            background: rgba(239, 68, 68, 0.2);
            border-color: #ef4444;
            color: #ef4444;
        }

        .lqm-body {
            padding: 32px 24px;
        }

        .lqm-question-container {
            display: flex;
            align-items: flex-start;
            gap: 16px;
            margin-bottom: 28px;
        }

        .lqm-question-number {
            width: 44px;
            height: 44px;
            background: var(--gradient-primary);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 0.9rem;
            color: white;
            flex-shrink: 0;
        }

        .lqm-question-text {
            font-size: 1.15rem;
            font-weight: 600;
            color: var(--text-primary);
            line-height: 1.5;
            margin: 0;
            padding-top: 8px;
        }

        .lqm-answers {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .lqm-answer-btn {
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 16px 20px;
            background: var(--bg-tertiary);
            border: 2px solid var(--border-color);
            border-radius: var(--border-radius);
            cursor: pointer;
            transition: all 0.2s ease;
            text-align: left;
            color: var(--text-secondary);
            font-size: 1rem;
        }

        .lqm-answer-btn:hover {
            border-color: var(--primary);
            background: rgba(99, 102, 241, 0.1);
            color: var(--text-primary);
        }

        .lqm-answer-btn.selected {
            border-color: var(--primary);
            background: rgba(99, 102, 241, 0.15);
            color: var(--text-primary);
        }

        .lqm-answer-btn.selected .lqm-answer-letter {
            background: var(--primary);
            color: white;
        }

        .lqm-answer-letter {
            width: 32px;
            height: 32px;
            background: var(--bg-glass);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 0.85rem;
            flex-shrink: 0;
            transition: inherit;
        }

        .lqm-answer-text {
            flex: 1;
            line-height: 1.4;
        }

        .lqm-footer {
            display: flex;
            justify-content: space-between;
            padding: 20px 24px;
            background: var(--bg-tertiary);
            border-top: 1px solid var(--border-color);
        }

        .lqm-footer .btn {
            min-width: 140px;
        }

        /* Results Modal */
        .lqm-results-content {
            position: relative;
            width: 90%;
            max-width: 420px;
            padding: 48px 40px;
            background: var(--bg-secondary);
            border-radius: var(--border-radius-lg);
            border: 1px solid var(--border-color);
            text-align: center;
            animation: modalSlideIn 0.3s ease;
        }

        .lqm-results-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
        }

        .lqm-results-icon.success {
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
        }

        .lqm-results-icon.failure {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
        }

        .lqm-results-content h2 {
            font-size: 1.5rem;
            margin-bottom: 20px;
        }

        .lqm-score {
            margin-bottom: 16px;
        }

        .lqm-score-value {
            display: block;
            font-size: 3rem;
            font-weight: 800;
            background: var(--gradient-primary);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .lqm-score-label {
            font-size: 0.9rem;
            color: var(--text-muted);
        }

        .lqm-results-message {
            color: var(--text-secondary);
            margin-bottom: 28px;
            line-height: 1.6;
        }

        .lqm-results-actions {
            display: flex;
            gap: 12px;
            justify-content: center;
        }

        .lqm-results-actions .btn {
            min-width: 130px;
        }

        /* Mobile Responsive */
        @media (max-width: 600px) {
            .lqm-content {
                width: 95%;
                max-height: 95vh;
            }

            .lqm-header {
                flex-wrap: wrap;
                gap: 12px;
                padding: 16px 20px;
            }

            .lqm-header h2 {
                font-size: 1rem;
            }

            .lqm-progress {
                order: 3;
                flex: 1 1 100%;
            }

            .lqm-close {
                order: 2;
            }

            .lqm-body {
                padding: 24px 20px;
            }

            .lqm-question-container {
                flex-direction: column;
                gap: 12px;
            }

            .lqm-question-number {
                width: 36px;
                height: 36px;
                font-size: 0.8rem;
            }

            .lqm-question-text {
                font-size: 1rem;
                padding-top: 0;
            }

            .lqm-answer-btn {
                padding: 14px 16px;
                font-size: 0.9rem;
            }

            .lqm-answer-letter {
                width: 28px;
                height: 28px;
                font-size: 0.8rem;
            }

            .lqm-footer {
                flex-direction: column;
                gap: 10px;
                padding: 16px 20px;
            }

            .lqm-footer .btn {
                width: 100%;
            }

            .lqm-results-content {
                width: 95%;
                padding: 32px 24px;
            }

            .lqm-score-value {
                font-size: 2.5rem;
            }

            .lqm-results-actions {
                flex-direction: column;
            }

            .lqm-results-actions .btn {
                width: 100%;
            }
        }
    `;
    document.head.appendChild(style);
}

function openQuizModal(lessonId) {
    currentQuizLesson = lessonId;
    currentQuizQuestion = 0;
    const quizData = lessonQuizzes[lessonId];
    quizAnswers = new Array(quizData.questions.length).fill(null);

    document.getElementById('lqm-title').textContent = quizData.title;
    showQuizQuestion();

    document.getElementById('lesson-quiz-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeQuizModal() {
    document.getElementById('lesson-quiz-modal').classList.remove('active');
    document.body.style.overflow = '';
}

function closeResultsModal() {
    document.getElementById('lqm-results-modal').classList.remove('active');
    document.body.style.overflow = '';
}

function showQuizQuestion() {
    const quizData = lessonQuizzes[currentQuizLesson];
    const q = quizData.questions[currentQuizQuestion];
    const total = quizData.questions.length;

    // Update progress
    const progress = ((currentQuizQuestion + 1) / total) * 100;
    document.getElementById('lqm-progress-fill').style.width = progress + '%';
    document.getElementById('lqm-progress-text').textContent = `${currentQuizQuestion + 1}/${total}`;

    // Update question
    document.getElementById('lqm-question-number').textContent = `Q${currentQuizQuestion + 1}`;
    document.getElementById('lqm-question-text').textContent = q.question;

    // Update answers
    const answersContainer = document.getElementById('lqm-answers');
    const letters = ['A', 'B', 'C', 'D'];
    answersContainer.innerHTML = q.answers.map((answer, index) => `
        <button class="lqm-answer-btn ${quizAnswers[currentQuizQuestion] === index ? 'selected' : ''}" data-answer="${index}">
            <span class="lqm-answer-letter">${letters[index]}</span>
            <span class="lqm-answer-text">${answer}</span>
        </button>
    `).join('');

    // Add click handlers
    answersContainer.querySelectorAll('.lqm-answer-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            answersContainer.querySelectorAll('.lqm-answer-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            quizAnswers[currentQuizQuestion] = parseInt(btn.getAttribute('data-answer'));
        });
    });

    // Update nav buttons
    document.getElementById('lqm-prev').disabled = currentQuizQuestion === 0;
    const nextBtn = document.getElementById('lqm-next');
    if (currentQuizQuestion === total - 1) {
        nextBtn.innerHTML = 'Terminer <i class="fas fa-check"></i>';
    } else {
        nextBtn.innerHTML = 'Suivant <i class="fas fa-arrow-right"></i>';
    }
}

function prevQuestion() {
    if (currentQuizQuestion > 0) {
        currentQuizQuestion--;
        showQuizQuestion();
    }
}

function nextQuestion() {
    const quizData = lessonQuizzes[currentQuizLesson];
    const total = quizData.questions.length;

    if (quizAnswers[currentQuizQuestion] === null) {
        // Shake the answers to indicate selection needed
        const container = document.getElementById('lqm-answers');
        container.style.animation = 'shake 0.3s ease';
        setTimeout(() => container.style.animation = '', 300);
        return;
    }

    if (currentQuizQuestion < total - 1) {
        currentQuizQuestion++;
        showQuizQuestion();
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    const quizData = lessonQuizzes[currentQuizLesson];
    let correct = 0;

    quizData.questions.forEach((q, index) => {
        if (quizAnswers[index] === q.correct) {
            correct++;
        }
    });

    const total = quizData.questions.length;
    const passed = correct >= quizData.requiredScore;

    // Close quiz modal
    closeQuizModal();

    // Show results
    const resultsModal = document.getElementById('lqm-results-modal');
    const icon = document.getElementById('lqm-results-icon');
    const title = document.getElementById('lqm-results-title');
    const score = document.getElementById('lqm-score-value');
    const message = document.getElementById('lqm-results-message');
    const retryBtn = document.getElementById('lqm-retry');
    const continueBtn = document.getElementById('lqm-continue');

    score.textContent = `${correct}/${total}`;

    if (passed) {
        icon.className = 'lqm-results-icon success';
        icon.innerHTML = '<i class="fas fa-trophy"></i>';
        title.textContent = 'Bravo ! 🎉';
        message.textContent = 'Tu as réussi le quiz ! Tu peux maintenant marquer cette leçon comme terminée.';
        retryBtn.style.display = 'none';
        continueBtn.style.display = 'inline-flex';

        // Save quiz completion
        Progress.set('quiz_lesson_' + currentQuizLesson, true);
    } else {
        icon.className = 'lqm-results-icon failure';
        icon.innerHTML = '<i class="fas fa-times"></i>';
        title.textContent = 'Pas tout à fait...';
        message.textContent = `Il te faut au moins ${quizData.requiredScore} bonnes réponses pour valider. Révise un peu et réessaie !`;
        retryBtn.style.display = 'inline-flex';
        continueBtn.style.display = 'none';
    }

    resultsModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function retryQuiz() {
    closeResultsModal();
    setTimeout(() => {
        openQuizModal(currentQuizLesson);
    }, 200);
}

function continueAfterQuiz() {
    closeResultsModal();

    // Update complete button
    const btn = document.getElementById('complete-lesson');
    if (btn) {
        const lessonId = btn.getAttribute('data-lesson');

        // Save lesson completion immediately
        Progress.set('lesson_' + lessonId, true);

        // Update UI to completed state
        markAsCompleted(btn);
    }

    showConfetti();
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function copyCode(btn) {
    const codeBlock = btn.closest('.code-block');
    const code = codeBlock.querySelector('code').textContent;

    navigator.clipboard.writeText(code).then(() => {
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copié !';
        btn.style.color = 'var(--secondary)';

        setTimeout(() => {
            btn.innerHTML = originalHtml;
            btn.style.color = '';
        }, 2000);
    });
}

function showConfetti() {
    const colors = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    const container = document.body;

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}vw;
            top: -10px;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            pointer-events: none;
            z-index: 10000;
            animation: confettiFall ${2 + Math.random() * 2}s linear forwards;
        `;
        container.appendChild(confetti);

        setTimeout(() => confetti.remove(), 4000);
    }
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Make copyCode available globally
window.copyCode = copyCode;
