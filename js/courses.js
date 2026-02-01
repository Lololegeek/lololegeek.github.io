// Courses page JavaScript - Progress tracking and lesson locking

document.addEventListener('DOMContentLoaded', () => {
    // Check if user was redirected from a locked lesson
    const urlParams = new URLSearchParams(window.location.search);
    const lockedId = urlParams.get('locked');
    if (lockedId) {
        showLockedMessage(lockedId);
        // Clear param without refreshing to avoid repeated toasts
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    updateLessonStates();
    updateProgressOverview();
    initModuleCollapses();
});

// Use the global lesson order from LessonManager if available
const lessonOrder = window.LessonManager ? window.LessonManager.order : [
    // Fallback if main.js failed to load
    '1-1', '1-2', '1-3', '1-4', '1-5', '1-6',
    '2-1', '2-2', '2-3', '2-4', '2-5',
    '3-1', '3-2', '3-3',
    '4-1', '4-2', '4-3',
    '5-1', '5-2', '5-3', '5-4', '5-5',
    '6-1', '6-2', '6-3', '6-4', '6-5',
    '7-1', '7-2', '7-3'
];

function updateLessonStates() {
    const lessonCards = document.querySelectorAll('.lesson-card');

    lessonCards.forEach(card => {
        const lessonId = card.getAttribute('data-lesson');
        const isCompleted = Progress.get('lesson_' + lessonId);
        const isUnlocked = isLessonUnlocked(lessonId);

        const statusIcon = card.querySelector('.lesson-status i');

        if (isCompleted) {
            // Lesson completed
            card.classList.add('completed');
            card.classList.remove('locked');
            if (statusIcon) {
                statusIcon.className = 'fas fa-check-circle';
                statusIcon.style.color = 'var(--secondary)';
            }
        } else if (isUnlocked) {
            // Lesson available but not completed
            card.classList.remove('locked', 'completed');
            if (statusIcon) {
                statusIcon.className = 'fas fa-circle';
                statusIcon.style.color = '';
            }
        } else {
            // Lesson locked
            card.classList.add('locked');
            card.classList.remove('completed');
            if (statusIcon) {
                statusIcon.className = 'fas fa-lock';
                statusIcon.style.color = 'var(--text-muted)';
            }

            // Prevent navigation
            card.addEventListener('click', (e) => {
                if (card.classList.contains('locked')) {
                    e.preventDefault();
                    showLockedMessage(lessonId);
                }
            });
        }
    });
}

function isLessonUnlocked(lessonId) {
    if (Progress.DEBUG_DISABLE_LOCKS) return true;
    const lessonIndex = lessonOrder.indexOf(lessonId);

    // First lesson is always unlocked
    if (lessonIndex === 0) return true;

    // Previous lesson must be completed
    const prevLessonId = lessonOrder[lessonIndex - 1];
    return Progress.get('lesson_' + prevLessonId) === true;
}

function showLockedMessage(lessonId) {
    const lessonIndex = lessonOrder.indexOf(lessonId);
    const prevLessonId = lessonOrder[lessonIndex - 1];

    // Create and show toast notification
    const toast = document.createElement('div');
    toast.className = 'lock-toast';
    toast.innerHTML = `
        <i class="fas fa-lock"></i>
        <span>Termine d'abord la leçon ${prevLessonId} pour débloquer celle-ci !</span>
    `;

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove after 3s
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function updateProgressOverview() {
    const completedCount = Progress.completedLessons();
    const totalLessons = lessonOrder.length;
    const percentage = Math.round((completedCount / totalLessons) * 100);

    // Update progress circle
    const progressCircle = document.querySelector('.progress-ring');
    if (progressCircle) {
        const circumference = 2 * Math.PI * 45; // r = 45
        const offset = circumference - (percentage / 100) * circumference;
        progressCircle.style.strokeDasharray = circumference;
        progressCircle.style.strokeDashoffset = offset;
    }

    // Update percentage text
    const percentText = document.querySelector('.progress-percent');
    if (percentText) {
        percentText.textContent = percentage + '%';
    }

    // Update lessons count
    const completedEl = document.getElementById('completed-lessons');
    if (completedEl) {
        completedEl.textContent = completedCount;
    }

    // Update total count if present
    const totalEl = document.getElementById('total-lessons');
    if (totalEl) {
        totalEl.textContent = totalLessons;
    }

    // Update each module's completion status
    updateModuleProgress();
}

function updateModuleProgress() {
    const modules = {
        'module-1': ['1-1', '1-2', '1-3', '1-4', '1-5', '1-6'],
        'module-2': ['2-1', '2-2', '2-3', '2-4', '2-5'],
        'module-3': ['3-1', '3-2', '3-3'],
        'module-4': ['4-1', '4-2', '4-3'],
        'module-5': ['5-1', '5-2', '5-3', '5-4', '5-5'],
        'module-6': ['6-1', '6-2', '6-3', '6-4', '6-5'],
        'module-7': ['7-1', '7-2', '7-3']
    };

    Object.keys(modules).forEach(moduleId => {
        const lessons = modules[moduleId];
        const completed = lessons.filter(id => Progress.get('lesson_' + id)).length;
        const total = lessons.length;

        const moduleCard = document.getElementById(moduleId);
        if (moduleCard) {
            const progressEl = moduleCard.querySelector('.module-progress-text');
            if (progressEl) {
                progressEl.textContent = `${completed}/${total} leçons`;
            }

            const progressBar = moduleCard.querySelector('.module-progress-fill');
            if (progressBar) {
                progressBar.style.width = `${(completed / total) * 100}%`;
            }

            // Mark module as completed if all lessons done
            if (completed === total) {
                moduleCard.classList.add('module-completed');
            }
        }
    });
}

function initModuleCollapses() {
    const moduleHeaders = document.querySelectorAll('.module-header-toggle');

    moduleHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const module = header.closest('.module-card');
            module.classList.toggle('collapsed');
        });
    });
}

// Add toast styles
const style = document.createElement('style');
style.textContent = `
    .lock-toast {
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        padding: 16px 24px;
        border-radius: var(--border-radius);
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        opacity: 0;
        transition: all 0.3s ease;
    }

    .lock-toast.show {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }

    .lock-toast i {
        color: var(--accent);
        font-size: 1.2rem;
    }

    .lock-toast span {
        color: var(--text-primary);
        font-weight: 500;
    }

    .lesson-card.locked {
        opacity: 0.5;
        pointer-events: auto;
        position: relative;
    }

    .lesson-card.locked::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.2);
        border-radius: inherit;
        cursor: not-allowed;
    }

    .lesson-card.locked:hover {
        transform: none;
        border-color: var(--border-color);
    }

    .lesson-card.completed {
        border-color: var(--secondary);
        box-shadow: 0 5px 20px rgba(0, 206, 201, 0.1);
        position: relative;
    }

    .lesson-card.completed::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, transparent 50%, rgba(0, 206, 201, 0.1) 50%);
        border-radius: 0 12px 0 0;
    }

    .lesson-card.completed .lesson-number {
        background: rgba(0, 206, 201, 0.15);
        color: var(--secondary);
        padding: 4px 10px;
        border-radius: 6px;
        font-weight: 700;
        width: fit-content;
    }

    .lesson-card.completed:hover {
        box-shadow: 0 10px 30px rgba(0, 206, 201, 0.2);
    }

    @media (max-width: 600px) {
        .lock-toast {
            width: 90%;
            left: 5%;
            transform: translateX(0) translateY(100px);
            padding: 14px 18px;
            font-size: 0.9rem;
        }

        .lock-toast.show {
            transform: translateX(0) translateY(0);
        }
    }
`;
document.head.appendChild(style);
