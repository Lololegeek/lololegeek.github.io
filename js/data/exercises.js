/**
 * Centralized Exercise Data
 * This data is used by both the lessons and the editor to ensure consistency.
 */
const ExerciseData = {
    '1-1': {
        title: "Premier pas",
        description: "Affichez un message de bienvenue personnalisé dans la console.",
        tasks: [
            "Utilisez la fonction <code>print()</code>",
            "Affichez la phrase : <code>Apprendre le Lua avec LuaMaster !</code>"
        ],
        defaultCode: "-- Écris ton code ici\nprint(\"...\")",
        backLink: "1-1-introduction.html"
    },
    '1-2': {
        title: "Concaténation",
        description: "Créez un message qui combine votre nom et votre âge.",
        tasks: [
            "Déclarez deux variables : <code>nom</code> et <code>age</code>",
            "Affichez une phrase les combinant avec l'opérateur <code>..</code>"
        ],
        defaultCode: "local nom = \"Alex\"\nlocal age = 16\n-- Utilise .. pour concaténer\nprint(\"Je m'appelle \" .. nom .. \" et j'ai \" .. age .. \" ans.\")",
        backLink: "1-2-premier-script.html"
    },
    '1-3': {
        title: "Calcul de Vie",
        description: "Gérez la barre de vie d'un joueur après avoir subi des dégâts.",
        tasks: [
            "Partez d'une variable <code>vie = 100</code>",
            "Soustrayez une variable <code>degats = 25</code>",
            "Affichez : <code>Vie restante: 75</code>"
        ],
        defaultCode: "local vie = 100\nlocal degats = 25\n\n-- Calcule la vie restante ici\n\nprint(\"Vie restante: \" .. vie)",
        backLink: "1-3-variables.html"
    },
    '1-4': {
        title: "Vérification de Types",
        description: "Découvrez le type de vos variables avec Lua.",
        tasks: [
            "Créez une string, un number et un boolean",
            "Affichez le type de chacun en utilisant <code>type()</code>"
        ],
        defaultCode: "local nom = \"Lolo\"\nlocal score = 10\nlocal pret = true\n\nprint(type(nom))\nprint(type(score))\nprint(type(pret))",
        backLink: "1-4-types.html"
    },
    '1-5': {
        title: "Opérateurs",
        description: "Utilisez les opérateurs mathématiques de base.",
        tasks: [
            "Calculez le reste de la division de 10 par 3",
            "Affichez le résultat (devrait être 1)"
        ],
        defaultCode: "-- Indice : utilise l'opérateur %\nprint(10 % 3)",
        backLink: "1-5-operateurs.html"
    },
    '1-6': {
        title: "Système d'Accès",
        description: "Vérifiez l'âge d'un utilisateur pour autoriser l'accès.",
        tasks: [
            "Si l'âge est >= 13, affichez <code>Accès autorisé</code>",
            "Sinon, affichez <code>Accès restreint</code>"
        ],
        defaultCode: "local age = 15\n\nif age >= 13 then\n    print(\"Accès autorisé\")\nelse\n    print(\"Accès restreint\")\nend",
        backLink: "1-6-conditions.html"
    },
    '2-1': {
        title: "Compte à Rebours",
        description: "Simulez le décollage d'une fusée avec une boucle while.",
        tasks: [
            "Comptez de 10 à 0 avec une boucle <code>while</code>",
            "Affichez <code>DÉCOLLAGE ! 🚀</code> à la fin"
        ],
        defaultCode: "local decompte = 10\nwhile decompte >= 0 do\n    print(decompte)\n    decompte = decompte - 1\nend\nprint(\"DÉCOLLAGE ! 🚀\")",
        backLink: "2-1-while.html"
    },
    '2-2': {
        title: "Nombres Pairs",
        description: "Utilisez une boucle for pour filtrer les nombres.",
        tasks: [
            "Affichez tous les nombres pairs de 2 à 20",
            "Utilisez le troisième paramètre de la boucle <code>for</code> (le pas)"
        ],
        defaultCode: "for i = 2, 20, 2 do\n    print(i)\nend",
        backLink: "2-2-for.html"
    },
    '2-3': {
        title: "Fonction de Salutation",
        description: "Créez votre première fonction réutilisable.",
        tasks: [
            "Créez une fonction <code>saluer(nom)</code>",
            "Appelez-la deux fois avec des noms différents"
        ],
        defaultCode: "function saluer(nom)\n    print(\"Salut \" .. nom .. \" !\")\nend\n\nsaluer(\"Lolo\")\nsaluer(\"Roblox\")",
        backLink: "2-3-fonctions.html"
    },
    '2-4': {
        title: "Calculateur Magique",
        description: "Explorez les retours multiples des fonctions.",
        tasks: [
            "Créez une fonction qui retourne la somme ET le produit",
            "Affichez les deux résultats"
        ],
        defaultCode: "function calculer(a, b)\n    return a + b, a * b\nend\n\nlocal s, p = calculer(5, 10)\nprint(\"Somme: \" .. s .. \" | Produit: \" .. p)",
        backLink: "2-4-parametres.html"
    },
    '2-5': {
        title: "Le Duel des Scores",
        description: "Comprenez la différence entre local et global.",
        tasks: [
            "Créez une variable globale <code>score</code>",
            "Créez une variable locale du même nom dans un bloc <code>do ... end</code>",
            "Observez laquelle est affichée"
        ],
        defaultCode: "score = 100 -- Globale\ndo\n    local score = 50\n    print(\"Local: \" .. score)\nend\nprint(\"Global: \" .. score)",
        backLink: "2-5-scope.html"
    },
    '3-1': {
        title: "Gestion d'Inventaire",
        description: "Manipulez votre première table Lua.",
        tasks: [
            "Créez un tableau avec 3 objets",
            "Ajoutez un 4ème objet avec <code>table.insert()</code>",
            "Affichez la taille totale avec <code>#</code>"
        ],
        defaultCode: "local inventaire = {\"Épée\", \"Bouclier\", \"Potion\"}\ntable.insert(inventaire, \"Armure\")\n\nprint(\"Objet 2: \" .. inventaire[2])\nprint(\"Taille: \" .. #inventaire)",
        backLink: "3-1-tables-intro.html"
    },
    '6-5': {
        title: "Animation Tween",
        description: "Créez une animation fluide pour une interface.",
        tasks: [
            "Utilisez <code>TweenService</code>",
            "Animez la transparence d'un objet de 0 à 1",
            "Lancez l'animation avec <code>:Play()</code>"
        ],
        defaultCode: "local TweenService = game:GetService(\"TweenService\")\nlocal button = { Transparency = 0 }\n\nlocal info = TweenInfo.new(2)\nlocal goal = { Transparency = 1 }\n\nlocal tween = TweenService:Create(button, info, goal)\ntween:Play()",
        backLink: "6-5-tweens.html"
    }
};

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExerciseData;
} else {
    window.ExerciseData = ExerciseData;
}
