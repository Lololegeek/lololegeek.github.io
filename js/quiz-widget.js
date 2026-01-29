const quizzes = {
    "1-1": [
        { q: "Que signifie Lua ?", options: ["Lune", "Soleil", "Lumière"], a: 0 },
        { q: "Quel logiciel utilise-t-on pour Roblox ?", options: ["Roblox Studio", "Unity", "Unreal"], a: 0 }
    ],
    "1-2": [
        { q: "Quelle fonction affiche du texte ?", options: ["log()", "print()", "show()"], a: 1 },
        { q: "Comment écrit-on un commentaire ?", options: ["//", "#", "--"], a: 2 }
    ],
    // D'autres quiz génériques pour les autres leçons par défaut
    "default": [
        { q: "Avez-vous bien lu ?", options: ["Oui", "Non"], a: 0 },
        { q: "Prêt pour la suite ?", options: ["Oui", "Absolument"], a: 0 }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    const lessonId = document.getElementById('complete-lesson')?.getAttribute('data-lesson');
    if (lessonId) initQuizWidget(lessonId);
});

function initQuizWidget(id) {
    const container = document.querySelector('.lesson-complete');
    if (!container) return;

    // Si déjà validé, on laisse le bouton
    if (localStorage.getItem('lesson_' + id + '_completed')) return;

    const questions = quizzes[id] || quizzes["default"];
    let html = `<div class="quiz-widget"><h3>🧠 Quiz de Validation</h3>`;

    questions.forEach((q, i) => {
        html += `<div class="qw-item" data-idx="${i}">
            <p>${q.q}</p>
            <div class="qw-options">
                ${q.options.map((opt, oi) => `<button class="btn-opt" onclick="checkQ('${id}', ${i}, ${oi}, this)">${opt}</button>`).join('')}
            </div>
        </div>`;
    });

    html += `</div>`;
    container.innerHTML = html;
}

window.checkQ = function (id, qIdx, optIdx, btn) {
    const questions = quizzes[id] || quizzes["default"];
    const isCorrect = questions[qIdx].a === optIdx;

    btn.style.background = isCorrect ? 'var(--success)' : 'var(--error)';
    btn.style.color = 'white';

    // Vérifier si tout est bon
    const widget = btn.closest('.quiz-widget');
    const allCorrect = widget.querySelectorAll('button[style*="rgb(0, 184, 148)"]').length === questions.length;

    if (allCorrect && !widget.querySelector('.completion-msg')) {
        widget.innerHTML += `<div class="completion-msg" style="margin-top:20px; color:var(--success); font-weight:bold;">
            🎉 Bravo ! Leçon validée.
            <button class="btn btn-primary" onclick="validateLesson('${id}')">Continuer</button>
        </div>`;
    }
};

window.validateLesson = function (id) {
    localStorage.setItem('lesson_' + id + '_completed', 'true');
    location.reload();
}
