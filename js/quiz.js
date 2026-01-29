// Quiz JavaScript - Interactive quiz system

const quizData = {
    basics: {
        title: "Les Bases du Lua",
        questions: [
            {
                question: "Comment déclare-t-on une variable locale en Lua ?",
                code: "",
                answers: ["var nom = 'test'", "local nom = 'test'", "let nom = 'test'", "const nom = 'test'"],
                correct: 1
            },
            {
                question: "Quel est le résultat de ce code ?",
                code: "local x = 10\nlocal y = 3\nprint(x % y)",
                answers: ["3", "1", "3.33", "10"],
                correct: 1
            },
            {
                question: "Quel type représente une valeur 'vide' ou 'rien' en Lua ?",
                code: "",
                answers: ["null", "undefined", "nil", "none"],
                correct: 2
            },
            {
                question: "Comment concatène-t-on deux strings en Lua ?",
                code: "",
                answers: ["'Hello' + 'World'", "'Hello' & 'World'", "'Hello' .. 'World'", "'Hello'.concat('World')"],
                correct: 2
            },
            {
                question: "Quel est le type de la valeur true en Lua ?",
                code: "",
                answers: ["bool", "boolean", "bit", "logical"],
                correct: 1
            },
            {
                question: "Comment affiche-t-on du texte dans la console ?",
                code: "",
                answers: ["console.log('Hello')", "echo 'Hello'", "print('Hello')", "write('Hello')"],
                correct: 2
            },
            {
                question: "Quel opérateur vérifie l'égalité en Lua ?",
                code: "",
                answers: ["=", "==", "===", "equals"],
                correct: 1
            },
            {
                question: "Les tableaux en Lua commencent à quel index ?",
                code: "",
                answers: ["0", "1", "-1", "Ça dépend"],
                correct: 1
            },
            {
                question: "Comment écrire un commentaire sur une ligne ?",
                code: "",
                answers: ["// commentaire", "# commentaire", "-- commentaire", "/* commentaire */"],
                correct: 2
            },
            {
                question: "Quel est le résultat de 5 / 2 en Lua ?",
                code: "",
                answers: ["2", "2.5", "2.0", "Erreur"],
                correct: 1
            }
        ]
    },
    control: {
        title: "Conditions & Boucles",
        questions: [
            {
                question: "Quelle est la syntaxe correcte pour une condition if ?",
                code: "",
                answers: ["if (x > 5) { ... }", "if x > 5 then ... end", "if x > 5: ...", "if x > 5 do ... end"],
                correct: 1
            },
            {
                question: "Comment écrit-on 'sinon si' en Lua ?",
                code: "",
                answers: ["else if", "elif", "elseif", "elsif"],
                correct: 2
            },
            {
                question: "Combien de fois s'exécute cette boucle ?",
                code: "for i = 1, 5 do\n    print(i)\nend",
                answers: ["4 fois", "5 fois", "6 fois", "Infini"],
                correct: 1
            },
            {
                question: "Quel mot-clé permet de sortir d'une boucle ?",
                code: "",
                answers: ["exit", "stop", "break", "return"],
                correct: 2
            },
            {
                question: "Quelle boucle vérifie la condition AVANT d'exécuter ?",
                code: "",
                answers: ["for", "while", "repeat", "do"],
                correct: 1
            },
            {
                question: "Quel est le résultat de not true ?",
                code: "",
                answers: ["true", "false", "nil", "0"],
                correct: 1
            },
            {
                question: "Que signifie 'and' en programmation ?",
                code: "",
                answers: ["OU logique", "ET logique", "NON logique", "Addition"],
                correct: 1
            },
            {
                question: "Combien de fois s'affiche 'test' ?",
                code: "for i = 10, 1, -2 do\n    print('test')\nend",
                answers: ["5 fois", "10 fois", "4 fois", "Erreur"],
                correct: 0
            },
            {
                question: "Quelle boucle exécute AU MOINS une fois ?",
                code: "",
                answers: ["for", "while", "repeat...until", "Aucune"],
                correct: 2
            },
            {
                question: "Quel opérateur représente 'différent de' ?",
                code: "",
                answers: ["!=", "<>", "~=", "!=="],
                correct: 2
            }
        ]
    },
    functions: {
        title: "Fonctions",
        questions: [
            {
                question: "Comment déclare-t-on une fonction nommée en Lua ?",
                code: "",
                answers: ["def maFonction() end", "function maFonction() end", "fn maFonction() end", "func maFonction() end"],
                correct: 1
            },
            {
                question: "Comment retourne-t-on une valeur depuis une fonction ?",
                code: "",
                answers: ["output valeur", "return valeur", "give valeur", "send valeur"],
                correct: 1
            },
            {
                question: "Une fonction peut-elle retourner plusieurs valeurs ?",
                code: "",
                answers: ["Non, jamais", "Oui, avec des virgules", "Oui, avec un tableau", "Seulement 2 maximum"],
                correct: 1
            },
            {
                question: "Que retourne cette fonction si appelée sans argument ?",
                code: "function test(x)\n    return x * 2\nend\nprint(test())",
                answers: ["0", "nil", "Erreur", "2"],
                correct: 2
            },
            {
                question: "Qu'est-ce qu'une fonction anonyme ?",
                code: "",
                answers: ["Une fonction cachée", "Une fonction sans nom", "Une fonction privée", "Une fonction vide"],
                correct: 1
            },
            {
                question: "Comment passer un nombre variable d'arguments ?",
                code: "",
                answers: ["...args", "...", "*args", "varargs"],
                correct: 1
            },
            {
                question: "Qu'est-ce qu'une closure ?",
                code: "",
                answers: ["Une fonction fermée", "Une fonction qui capture des variables externes", "Une erreur", "Un type de boucle"],
                correct: 1
            },
            {
                question: "Les fonctions sont-elles des 'first-class values' en Lua ?",
                code: "",
                answers: ["Non", "Oui", "Parfois", "Seulement les locales"],
                correct: 1
            },
            {
                question: "Que fait cette syntaxe ?",
                code: "local add = function(a, b) return a + b end",
                answers: ["Erreur de syntaxe", "Crée une fonction anonyme stockée dans add", "Appelle une fonction", "Rien"],
                correct: 1
            },
            {
                question: "Peut-on appeler une fonction avant sa déclaration ?",
                code: "",
                answers: ["Oui toujours", "Non jamais", "Seulement si globale", "Seulement avec local"],
                correct: 1
            }
        ]
    },
    tables: {
        title: "Tables & Structures",
        questions: [
            {
                question: "Comment crée-t-on une table vide en Lua ?",
                code: "",
                answers: ["[]", "{}", "new Table()", "table()"],
                correct: 1
            },
            {
                question: "Comment accède-t-on au premier élément d'un tableau ?",
                code: "local fruits = {'pomme', 'banane', 'orange'}",
                answers: ["fruits[0]", "fruits[1]", "fruits.first", "fruits(1)"],
                correct: 1
            },
            {
                question: "Quelle fonction retourne la taille d'un tableau ?",
                code: "",
                answers: ["len(t)", "size(t)", "#t", "t.length"],
                correct: 2
            },
            {
                question: "Comment ajoute-t-on un élément à la fin d'un tableau ?",
                code: "",
                answers: ["table.add(t, v)", "table.insert(t, v)", "t.push(v)", "t.append(v)"],
                correct: 1
            },
            {
                question: "Quelle est la différence entre ipairs et pairs ?",
                code: "",
                answers: ["Aucune", "ipairs pour les index numériques, pairs pour tout", "pairs est plus rapide", "ipairs n'existe pas"],
                correct: 1
            },
            {
                question: "Comment accède-t-on à une clé string ?",
                code: "local player = {name = 'Alex', level = 10}",
                answers: ["player['name'] ou player.name", "player->name", "player:name", "player(name)"],
                correct: 0
            },
            {
                question: "Que retourne #t pour un dictionnaire ?",
                code: "local t = {a = 1, b = 2, c = 3}",
                answers: ["3", "0", "nil", "Erreur"],
                correct: 1
            },
            {
                question: "Comment supprime-t-on un élément d'un tableau ?",
                code: "",
                answers: ["delete t[1]", "table.remove(t, 1)", "t.remove(1)", "remove(t, 1)"],
                correct: 1
            },
            {
                question: "Les tables Lua peuvent-elles contenir des types mixtes ?",
                code: "",
                answers: ["Non", "Oui", "Seulement nombres et strings", "Seulement avec mixed = true"],
                correct: 1
            },
            {
                question: "Comment copie-t-on une table en profondeur ?",
                code: "",
                answers: ["local copy = original", "local copy = table.copy(original)", "Il faut le faire manuellement ou avec une fonction", "copy(original)"],
                correct: 2
            }
        ]
    },
    roblox: {
        title: "API Roblox",
        questions: [
            {
                question: "Comment obtient-on le service Players ?",
                code: "",
                answers: ["game.Players", "Players.GetService()", "require('Players')", "Roblox.Players"],
                correct: 0
            },
            {
                question: "Que représente game.Workspace ?",
                code: "",
                answers: ["Le code du jeu", "L'espace 3D du jeu", "Les paramètres", "Les joueurs"],
                correct: 1
            },
            {
                question: "Comment créer une nouvelle Instance ?",
                code: "",
                answers: ["new Part()", "Part.new()", "Instance.new('Part')", "create('Part')"],
                correct: 2
            },
            {
                question: "Quel événement se déclenche quand un joueur rejoint ?",
                code: "",
                answers: ["Players.PlayerJoined", "Players.PlayerAdded", "Players.OnJoin", "Players.NewPlayer"],
                correct: 1
            },
            {
                question: "Comment connecte-t-on une fonction à un événement ?",
                code: "",
                answers: ["event.on(func)", "event:Connect(func)", "event.listen(func)", "event.bind(func)"],
                correct: 1
            },
            {
                question: "Où s'exécute un LocalScript ?",
                code: "",
                answers: ["Sur le serveur", "Sur le client", "Les deux", "Nulle part"],
                correct: 1
            },
            {
                question: "Où s'exécute un Script normal ?",
                code: "",
                answers: ["Sur le serveur", "Sur le client", "Les deux", "Nulle part"],
                correct: 0
            },
            {
                question: "À quoi sert un RemoteEvent ?",
                code: "",
                answers: ["Stocker des données", "Communication client-serveur", "Créer des effets", "Timer"],
                correct: 1
            },
            {
                question: "Comment attendre qu'un enfant existe ?",
                code: "",
                answers: ["wait(child)", "WaitForChild(name)", ":WaitForChild(name)", "FindChild(name)"],
                correct: 2
            },
            {
                question: "Quel service gère la sauvegarde des données ?",
                code: "",
                answers: ["SaveService", "DataStore", "DataStoreService", "StorageService"],
                correct: 2
            },
            {
                question: "Comment obtenir le personnage d'un joueur ?",
                code: "",
                answers: ["player.Avatar", "player.Character", "player.Model", "player.Body"],
                correct: 1
            },
            {
                question: "Que fait wait(5) ?",
                code: "",
                answers: ["Pause 5 millisecondes", "Pause 5 secondes", "Attend 5 frames", "Erreur"],
                correct: 1
            },
            {
                question: "Comment cloner un objet ?",
                code: "",
                answers: ["object.Copy()", "object:Clone()", "Clone(object)", "object.clone"],
                correct: 1
            },
            {
                question: "Où placer les RemoteEvents pour y accéder des deux côtés ?",
                code: "",
                answers: ["Workspace", "ServerStorage", "ReplicatedStorage", "StarterGui"],
                correct: 2
            },
            {
                question: "Comment détruire une Instance ?",
                code: "",
                answers: ["delete instance", "instance:Destroy()", "instance.remove()", "Remove(instance)"],
                correct: 1
            }
        ]
    }
};

let currentQuiz = null;
let currentQuestion = 0;
let userAnswers = [];
let quizModal, resultsModal;

document.addEventListener('DOMContentLoaded', () => {
    quizModal = document.getElementById('quiz-modal');
    resultsModal = document.getElementById('results-modal');

    initQuizButtons();
    loadSavedScores();
    initModalEvents();
});

function initQuizButtons() {
    document.querySelectorAll('.start-quiz').forEach(btn => {
        btn.addEventListener('click', () => {
            const quizId = btn.getAttribute('data-quiz');
            startQuiz(quizId);
        });
    });
}

function loadSavedScores() {
    Object.keys(quizData).forEach(quizId => {
        const score = Progress.get('quiz_' + quizId);
        const scoreEl = document.getElementById('score-' + quizId);
        if (score !== false && score !== undefined && scoreEl) {
            const total = quizData[quizId].questions.length;
            scoreEl.innerHTML = `<i class="fas fa-medal"></i><span>${score}/${total}</span>`;
            scoreEl.classList.add('completed');
        } else if (scoreEl) {
            scoreEl.innerHTML = `<i class="fas fa-medal"></i><span>Non complété</span>`;
            scoreEl.classList.remove('completed');
        }
    });
}

function initModalEvents() {
    document.getElementById('quiz-close').addEventListener('click', closeQuiz);
    document.getElementById('btn-prev').addEventListener('click', prevQuestion);
    document.getElementById('btn-next').addEventListener('click', nextQuestion);
    document.getElementById('btn-close-results').addEventListener('click', closeResults);
    document.getElementById('btn-review').addEventListener('click', reviewAnswers);
}

function startQuiz(quizId) {
    currentQuiz = quizId;
    currentQuestion = 0;
    userAnswers = new Array(quizData[quizId].questions.length).fill(null);

    document.getElementById('quiz-title').textContent = quizData[quizId].title;
    quizModal.classList.add('active');

    showQuestion();
}

function showQuestion() {
    const quiz = quizData[currentQuiz];
    const q = quiz.questions[currentQuestion];
    const total = quiz.questions.length;

    // Update progress
    document.getElementById('quiz-progress-text').textContent = `Question ${currentQuestion + 1}/${total}`;
    document.getElementById('quiz-progress-bar').style.width = ((currentQuestion + 1) / total * 100) + '%';

    // Update question
    document.getElementById('question-text').textContent = q.question;
    document.getElementById('question-code').textContent = q.code || '';

    // Update answers
    const container = document.getElementById('answers-container');
    container.innerHTML = '';

    const letters = ['A', 'B', 'C', 'D'];
    q.answers.forEach((answer, index) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        if (userAnswers[currentQuestion] === index) {
            btn.classList.add('selected');
        }
        btn.innerHTML = `
            <span class="answer-letter">${letters[index]}</span>
            <span class="answer-text">${answer}</span>
        `;
        btn.addEventListener('click', () => selectAnswer(index));
        container.appendChild(btn);
    });

    // Update nav buttons
    document.getElementById('btn-prev').disabled = currentQuestion === 0;
    const nextBtn = document.getElementById('btn-next');
    if (currentQuestion === total - 1) {
        nextBtn.innerHTML = 'Terminer <i class="fas fa-check"></i>';
    } else {
        nextBtn.innerHTML = 'Suivant <i class="fas fa-arrow-right"></i>';
    }
}

function selectAnswer(index) {
    userAnswers[currentQuestion] = index;

    document.querySelectorAll('.answer-btn').forEach((btn, i) => {
        btn.classList.toggle('selected', i === index);
    });
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion();
    }
}

function nextQuestion() {
    const total = quizData[currentQuiz].questions.length;

    if (currentQuestion < total - 1) {
        currentQuestion++;
        showQuestion();
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    const quiz = quizData[currentQuiz];
    let correct = 0;

    quiz.questions.forEach((q, i) => {
        if (userAnswers[i] === q.correct) {
            correct++;
        }
    });

    const total = quiz.questions.length;
    const percent = Math.round((correct / total) * 100);

    // Save score
    Progress.set('quiz_' + currentQuiz, correct);
    loadSavedScores();

    // Close quiz modal
    quizModal.classList.remove('active');

    // Show results
    const icon = document.getElementById('results-icon');
    icon.className = 'results-icon';

    if (percent >= 90) {
        icon.classList.add('gold');
        icon.innerHTML = '<i class="fas fa-trophy"></i>';
        document.getElementById('results-title').textContent = 'Excellent ! 🎉';
        document.getElementById('results-message').textContent = 'Tu maîtrises parfaitement ce sujet !';
    } else if (percent >= 70) {
        icon.classList.add('silver');
        icon.innerHTML = '<i class="fas fa-medal"></i>';
        document.getElementById('results-title').textContent = 'Très bien !';
        document.getElementById('results-message').textContent = 'Tu as de bonnes bases !';
    } else if (percent >= 50) {
        icon.classList.add('bronze');
        icon.innerHTML = '<i class="fas fa-star"></i>';
        document.getElementById('results-title').textContent = 'Pas mal !';
        document.getElementById('results-message').textContent = 'Continue à pratiquer !';
    } else {
        icon.innerHTML = '<i class="fas fa-book"></i>';
        document.getElementById('results-title').textContent = 'Continue d\'apprendre !';
        document.getElementById('results-message').textContent = 'Revois les cours et réessaie !';
    }

    document.getElementById('results-score').textContent = `${correct}/${total}`;
    document.getElementById('results-details').textContent = `${percent}% de bonnes réponses`;

    resultsModal.classList.add('active');
}

function reviewAnswers() {
    resultsModal.classList.remove('active');
    quizModal.classList.add('active');
    currentQuestion = 0;
    showQuestionReview();
}

function showQuestionReview() {
    const quiz = quizData[currentQuiz];
    const q = quiz.questions[currentQuestion];
    const total = quiz.questions.length;

    document.getElementById('quiz-progress-text').textContent = `Correction ${currentQuestion + 1}/${total}`;
    document.getElementById('quiz-progress-bar').style.width = ((currentQuestion + 1) / total * 100) + '%';

    document.getElementById('question-text').textContent = q.question;
    document.getElementById('question-code').textContent = q.code || '';

    const container = document.getElementById('answers-container');
    container.innerHTML = '';

    const letters = ['A', 'B', 'C', 'D'];
    q.answers.forEach((answer, index) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';

        if (index === q.correct) {
            btn.classList.add('correct');
        } else if (userAnswers[currentQuestion] === index) {
            btn.classList.add('incorrect');
        }

        btn.innerHTML = `
            <span class="answer-letter">${letters[index]}</span>
            <span class="answer-text">${answer}</span>
        `;
        btn.style.cursor = 'default';
        container.appendChild(btn);
    });

    document.getElementById('btn-prev').disabled = currentQuestion === 0;
    const nextBtn = document.getElementById('btn-next');
    if (currentQuestion === total - 1) {
        nextBtn.innerHTML = 'Fermer <i class="fas fa-times"></i>';
        nextBtn.onclick = closeQuiz;
    } else {
        nextBtn.innerHTML = 'Suivant <i class="fas fa-arrow-right"></i>';
        nextBtn.onclick = () => {
            currentQuestion++;
            showQuestionReview();
        };
    }

    document.getElementById('btn-prev').onclick = () => {
        if (currentQuestion > 0) {
            currentQuestion--;
            showQuestionReview();
        }
    };
}

function closeQuiz() {
    quizModal.classList.remove('active');
    currentQuiz = null;
}

function closeResults() {
    resultsModal.classList.remove('active');
}
