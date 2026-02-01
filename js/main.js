// Main JS - Interactions globales et Animations

// Progress Tracking System
window.Progress = {
    // Variable pour désactiver la sécurité du cours (utile pour le dev)
    DEBUG_DISABLE_LOCKS: false,

    get: function (key) {
        const data = localStorage.getItem('luaMasterProgress');
        if (!data) return false;

        try {
            const progress = JSON.parse(data);
            return progress[key] || false;
        } catch (e) {
            console.error('Error parsing progress data:', e);
            return false;
        }
    },

    set: function (key, value) {
        let progress = {};
        const data = localStorage.getItem('luaMasterProgress');

        if (data) {
            try {
                progress = JSON.parse(data);
            } catch (e) {
                console.error('Error parsing progress data:', e);
            }
        }

        progress[key] = value;
        localStorage.setItem('luaMasterProgress', JSON.stringify(progress));
    },

    completedLessons: function () {
        const data = localStorage.getItem('luaMasterProgress');
        if (!data) return 0;

        try {
            const progress = JSON.parse(data);
            let count = 0;

            for (const key in progress) {
                if (key.startsWith('lesson_') && progress[key]) {
                    count++;
                }
            }

            return count;
        } catch (e) {
            console.error('Error counting completed lessons:', e);
            return 0;
        }
    }
};

// Cours Management System - Global
window.LessonManager = {
    // Ordre officiel des leçons pour le système de verrouillage
    order: [
        // Module 1
        '1-1', '1-2', '1-3', '1-4', '1-5', '1-6',
        // Module 2
        '2-1', '2-2', '2-3', '2-4', '2-5',
        // Module 3
        '3-1', '3-2', '3-3',
        // Module 4
        '4-1', '4-2', '4-3',
        // Module 5
        '5-1', '5-2', '5-3', '5-4', '5-5',
        // Module 6
        '6-1', '6-2', '6-3', '6-4', '6-5',
        // Module 7
        '7-1', '7-2', '7-3'
    ],

    isUnlocked: function (lessonId) {
        if (Progress.DEBUG_DISABLE_LOCKS) return true;
        if (!lessonId) return false;

        // La première leçon est toujours débloquée
        const index = this.order.indexOf(lessonId);
        if (index === 0) return true;
        if (index === -1) return false; // Leçon inconnue = bloquée par sécurité

        // Vérifier si la précédente est complétée
        const prevId = this.order[index - 1];
        return Progress.get('lesson_' + prevId) === true;
    },

    getNextLesson: function (lessonId) {
        const index = this.order.indexOf(lessonId);
        if (index !== -1 && index < this.order.length - 1) {
            return this.order[index + 1];
        }
        return null;
    }
};



document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Nav Toggle
    const toggle = document.getElementById('nav-toggle');
    const nav = document.getElementById('nav-menu');

    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            // Animation du burger
            const spans = toggle.querySelectorAll('span');
            if (nav.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }



    // 2. Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(15, 15, 19, 0.98)';
                navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.5)';
            } else {
                navbar.style.background = 'rgba(15, 15, 19, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        }
    });

    // 3. Animation des Statistiques (Compteur)
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-count'));
                    animateValue(el, 0, target, 2000);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => observer.observe(stat));
    }

    // 4. Animation Typewriter pour le Code Hero
    const codeElement = document.getElementById('hero-code');
    if (codeElement && window.innerWidth >= 1000) {
        const codeText = `local player = game.Players.LocalPlayer
local part = Instance.new("Part")

part.Name = "SuperPart"
part.Color = Color3.fromRGB(255, 100, 100)
part.Parent = workspace

print("Hello " .. player.Name .. "!")`;

        typeWriter(codeElement, codeText, 0);
    }

});

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function typeWriter(element, text, i) {
    if (i < text.length) {
        // Coloration syntaxique basique durant la frappe
        let char = text.charAt(i);
        let currentHTML = element.innerHTML;

        // Gestion des sauts de ligne
        if (char === '\n') {
            element.innerHTML += '<br>';
        } else {
            element.innerHTML += char;
        }

        // Highlight une fois fini (plus simple ici) ou progressif
        // Pour l'instant on écrit juste le texte

        setTimeout(() => typeWriter(element, text, i + 1), 30 + Math.random() * 30);
    } else {
        // Appliquer la coloration syntaxique à la fin
        hljsHighlight(element);
    }
}

function hljsHighlight(el) {
    // Simulation simple de coloration pour l'effet visuel
    let html = el.innerHTML;
    html = html.replace(/local/g, '<span style="color:#c678dd">local</span>');
    html = html.replace(/function/g, '<span style="color:#c678dd">function</span>');
    html = html.replace(/print/g, '<span style="color:#61afef">print</span>');
    html = html.replace(/"(.*?)"/g, '<span style="color:#98c379">"$1"</span>');
    html = html.replace(/game/g, '<span style="color:#e5c07b">game</span>');
    html = html.replace(/workspace/g, '<span style="color:#e5c07b">workspace</span>');
    el.innerHTML = html;
}


