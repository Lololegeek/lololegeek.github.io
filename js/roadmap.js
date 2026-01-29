/**
 * Roadmap Page - Expert++ Controller
 * Synchronizes progress with visual timeline
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // Initiation immédiate
    initRoadmap();

    // Refresh on resize for line accuracy
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(initRoadmap, 250);
    });
});

function initRoadmap() {
    const roadmapContainer = document.querySelector('.roadmap-container');
    const progressBar = document.getElementById('roadmap-progress');
    const skillNodes = document.querySelectorAll('.skill-node');

    if (!roadmapContainer || !progressBar) return;

    // Configuration des compétences vers les cours
    const skillMap = {
        'print': '1-1',
        'variables': '1-3',
        'operators': '1-4',
        'conditions': '2-1',
        'while': '2-3',
        'for': '2-4',
        'functions': '3-1',
        'scope': '3-3',
        'arrays': '3-2',
        'dicts': '3-2',
        'iteration': '3-2',
        'instances': '4-1',
        'services': '4-1',
        'events': '4-2',
        'remotes': '4-3',
        'project-inv': '5-1',
        'project-combat': '5-2'
    };

    let lastCompletedTop = 0;

    skillNodes.forEach(node => {
        const skillId = node.getAttribute('data-skill');
        const lessonId = skillMap[skillId];
        const statusIcon = node.querySelector('.node-status');

        if (!lessonId) return;

        const isCompleted = Progress.get('lesson_' + lessonId) === true;
        const isUnlocked = window.LessonManager ? window.LessonManager.isUnlocked(lessonId) : true;

        node.classList.remove('completed', 'unlocked', 'locked');

        if (isCompleted) {
            node.classList.add('completed');
            if (statusIcon) statusIcon.innerHTML = '<i class="fas fa-check"></i>';

            // Calculer la position pour la barre de progression
            const rect = node.getBoundingClientRect();
            const containerRect = roadmapContainer.getBoundingClientRect();
            const nodeMiddle = (rect.top + rect.height / 2) - containerRect.top;
            if (nodeMiddle > lastCompletedTop) lastCompletedTop = nodeMiddle;

        } else if (isUnlocked) {
            node.classList.add('unlocked');
            if (statusIcon) statusIcon.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            node.classList.add('locked');
            if (statusIcon) statusIcon.innerHTML = '<i class="fas fa-lock"></i>';
        }

        // Action au clic
        node.style.cursor = (isCompleted || isUnlocked) ? 'pointer' : 'not-allowed';
        node.onclick = () => {
            if (isCompleted || isUnlocked) {
                // Essayer de trouver le fichier de la leçon, sinon vers courses
                window.location.href = `courses.html?lesson=${lessonId}`;
            }
        };
    });

    // Mise à jour de la Phase (couleur du numéro)
    document.querySelectorAll('.roadmap-phase').forEach(phase => {
        const nodes = phase.querySelectorAll('.skill-node');
        const completedCount = Array.from(nodes).filter(n => n.classList.contains('completed')).length;
        if (completedCount > 0 && completedCount === nodes.length) {
            phase.classList.add('completed');
        } else {
            phase.classList.remove('completed');
        }
    });

    // Animation de la barre de progression
    // On ajoute un petit délai pour que le layout soit stabilisé
    requestAnimationFrame(() => {
        progressBar.style.height = `${lastCompletedTop}px`;
    });
}
