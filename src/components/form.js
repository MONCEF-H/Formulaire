import React, { useState, useEffect } from 'react';

// Embedded and pre-processed questionnaire data from your CSV
const questionsData = [
  // NEW: Virtual questions with numeric IDs and reordered for display
  {
    "id": "10000000", // New numeric ID for Email
    "type": "Survey",
    "question": "Adresse électronique",
    "description": "",
    "options": []
  },
  {
    "id": "10000001", // New numeric ID for Full Name
    "type": "Survey",
    "question": "Nom complet",
    "description": "",
    "options": []
  },
  {
    "id": "21398881",
    "type": "Survey",
    "question": "Nom du cabinet de votre expert comptable",
    "description": "",
    "options": []
  },
  {
    "id": "21398882",
    "type": "Survey",
    "question": "N°Siret",
    "description": "",
    "options": []
  },
  {
    "id": "21398883",
    "type": "Survey",
    "question": "1/ Dans quel pays résidez-vous ?",
    "description": "",
    "options": [
      "France",
      "Autre"
    ]
  },
  {
    "id": "21398884",
    "type": "Survey",
    "question": "2/ Dans quelle région résidez-vous ?",
    "description": "",
    "options": [
      "Occitanie",
      "PACA",
      "Nouvelle Aquitaine",
      "Auvergne Rhône-Alpes",
      "Bourgogne Franche-Comté",
      "Centre-Val de Loire",
      "Pays de la Loire",
      "Bretagne",
      "Normandie",
      "Ile-de-France",
      "Grand Est",
      "Haut-de-France",
      "Corse",
      "DROM",
      "Régions limitrophes ou frontalières",
      "Autre"
    ]
  },
  {
    "id": "21398885",
    "type": "Survey",
    "question": "3/ Dans quelle ville résidez-vous ?",
    "description": "",
    "options": []
  },
  {
    "id": "21398886",
    "type": "Survey",
    "question": "4/ A quelle tranche d'âge appartenez-vous ?",
    "description": "",
    "options": [
      "18 - 24 ans",
      "25 - 34 ans",
      "35 - 49 ans",
      "50 - 64 ans",
      "65 ans et plus"
    ]
  },
  {
    "id": "21398887",
    "type": "Survey",
    "question": "5/ A quelle catégorie socio-professionnelle appartenez-vous ?",
    "description": "",
    "options": [
      "Agriculteur",
      "Artisans - Commerçants - Chefs d'entreprise - Entrepreneurs",
      "Cadres et professions intellectuelles supérieurs",
      "Professions intermédiaires",
      "Employé",
      "Ouvrier",
      "Retraité",
      "En recherche d'emploi",
      "Étudiant",
      "Autre"
    ]
  },
  {
    "id": "21398888",
    "type": "Survey",
    "question": "6/ Êtes-vous ?",
    "description": "",
    "options": [
      "Une femme",
      "Un homme",
      "Autre"
    ]
  },
  {
    "id": "21398889",
    "type": "Survey",
    "question": "7/ Connaissez-vous la notion de développement durable ?",
    "description": "",
    "options": [
      "Oui",
      "Non"
    ]
  },
  {
    "id": "21398890",
    "type": "Survey",
    "question": "8/ Classer les 3 piliers du développement durable du plus important au moins important selon vous, de 1 à 3 :",
    "description": "Voici la définition officielle (Rapport Brundtland, 1987) : \"Le développement durable est un développement qui répond aux besoins du présent sans compromettre la capacité des générations futures à répondre aux leurs.\"",
    "options": [
      "La dimension économique",
      "La dimension sociale",
      "La dimension environnementale"
    ]
  },
  {
    "id": "21398891",
    "type": "Survey",
    "question": "9/ Êtes-vous sensible aux actions environnementales et/ou sociales (des entreprises, de l'État, des collectivités...) ?",
    "description": "",
    "options": [
      "Sensible",
      "Plutôt sensible",
      "Plutôt pas sensible",
      "Pas du tout sensible"
    ]
  },
  {
    "id": "21398892",
    "type": "Rating (1-4)",
    "question": "10.1/ Selon vous quelques sont les enjeux les plus importants parmi ceux liés au développement durable qui devrait être en avant sur votre territoire (4 étoiles signifiant très important) ?\n\n👉 Lutter contre le réchauffement climatique :",
    "description": "",
    "options": []
  },
  {
    "id": "21398893",
    "type": "Rating (1-4)",
    "question": "10.2/ Selon vous quelques sont les enjeux les plus importants parmi ceux liés au développement durable qui devrait être en avant sur votre territoire (4 étoiles signifiant très important) ?\n\n👉 Réduire les inégalités :",
    "description": "",
    "options": []
  },
  {
    "id": "21398894",
    "type": "Rating (1-4)",
    "question": "10.3/ Selon vous quelques sont les enjeux les plus importants parmi ceux liés au développement durable qui devrait être en avant sur votre territoire ?\n\n👉 Garantir l'accès à la santé et à une alimentation de qualité pour tous :",
    "description": "",
    "options": []
  },
  {
    "id": "21398895",
    "type": "Rating (1-4)",
    "question": "10.4/ Selon vous quelques sont les enjeux les plus importants parmi ceux liés au développement durable qui devrait être en avant sur votre territoire (4 étoiles signifiant très important) ?\n\n👉 Accélérer la transition énergétique :",
    "description": "",
    "options": []
  },
  {
    "id": "21398896",
    "type": "Rating (1-4)",
    "question": "10.5/ Selon vous quelques sont les enjeux les plus importants parmi ceux liés au développement durable qui devrait être en avant sur votre territoire (4 étoiles signifiant très important) ?\n\n👉 Réduire le gaspillage et la production de déchets :",
    "description": "",
    "options": []
  },
  {
    "id": "21398897",
    "type": "Rating (1-4)",
    "question": "10.6/ Selon vous quelques sont les enjeux les plus importants parmi ceux liés au développement durable qui devrait être en avant sur votre territoire (4 étoiles signifiant très important) ?\n\n👉 Protéger la biodiversité aquatique et terrestre :",
    "description": "",
    "options": []
  },
  {
    "id": "21398898",
    "type": "Rating (1-4)",
    "question": "10.7/ Selon vous quelques sont les enjeux les plus importants parmi ceux liés au développement durable qui devrait être en avant sur votre territoire (4 étoiles signifiant très important) ?\n\n👉 Lutter contre les discriminations :",
    "description": "",
    "options": []
  },
  {
    "id": "21398899",
    "type": "Rating (1-4)",
    "question": "10.8/ Selon vous quelques sont les enjeux les plus importants parmi ceux liés au développement durable qui devrait être en avant sur votre territoire (4 étoiles signifiant très important) ?\n\n👉 Favoriser l'économie et les emplois locaux :",
    "description": "",
    "options": []
  },
  {
    "id": "2139900", // CORRECTED ID: Changed from "21398899" to "2139900" for uniqueness
    "type": "Rating (1-4)",
    "question": "10.9/ Selon vous quelques sont les enjeux les plus importants parmi ceux liés au développement durable qui devrait être en avant sur votre territoire ?\n\n👉 Mettre en place des systèmes de gouvernance plus justes et plus inclusifs :",
    "description": "",
    "options": []
  },
  {
    "id": "21398901",
    "type": "Survey",
    "question": "11/ Dans votre région, qui a le plus de pouvoirs pour agir en faveur du développement durable ?\nNB : Le terme \"région\" renvoie à votre région administrative de résidence (Ile-de-France, Occitanie...)",
    "description": "",
    "options": [
      "Les citoyens",
      "L'État",
      "Les collectivités territoriales",
      "Les organisations internationales (Europe, ONU, etc)",
      "Les entreprises/industries",
      "Les associations/ONG",
      "Les universités et centres de recherche"
    ]
  },
  {
    "id": "21398902",
    "type": "Survey",
    "question": "12/ Actuellement, les mesures prises par ces organisations sont-elles en cohérence avec vos attentes ?",
    "description": "",
    "options": [
      "Cohérentes",
      "Plutôt cohérentes",
      "Plutôt pas cohérentes",
      "Pas du tout cohérentes",
      "Je ne suis pas assez informé"
    ]
  },
  {
    "id": "21398903",
    "type": "Rating (1-4)",
    "question": "13.1/ Concernant les entreprises : quels paramètres sont les plus importants pour vous et pourraient impacter vos choix en tant que consommateur (4 étoiles signifiant très important) ?\n\n👉 Qualité et prix du produit :",
    "description": "",
    "options": []
  },
  {
    "id": "21398904",
    "type": "Rating (1-4)",
    "question": "13.2/ Concernant les entreprises : quels paramètres sont les plus importants pour vous et pourraient impacter vos choix en tant que consommateur (4 étoiles signifiant très important) ?\n\n👉 Bénéfice économique pour le territoire :",
    "description": "",
    "options": []
  },
  {
    "id": "21398905",
    "type": "Rating (1-4)",
    "question": "13.3/ Concernant les entreprises : quels paramètres sont les plus importants pour vous et pourraient impacter vos choix en tant que consommateur (4 étoiles signifiant très important) ?\n\n👉 Respect des droits humains et des salariés :",
    "description": "",
    "options": []
  },
  {
    "id": "21398906",
    "type": "Rating (1-4)",
    "question": "13.4/ Concernant les entreprises : quels paramètres sont les plus importants pour vous et pourraient impacter vos choix en tant que consommateur (4 étoiles signifiant très important) ?\n\n👉 Impact écologique du produit :",
    "description": "",
    "options": []
  },
  {
    "id": "21398907",
    "type": "Rating (1-4)",
    "question": "13.5/ Concernant les entreprises : quels paramètres sont les plus importants pour vous et pourraient impacter vos choix en tant que consommateur (4 étoiles signifiant très important) ?\nSociété commerciale, coopérative, entreprise à mission avec une raison d'être, association...",
    "description": "",
    "options": []
  },
  {
    "id": "21398908",
    "type": "Rating (1-4)",
    "question": "13.6/ Concernant les entreprises : quels paramètres sont les plus importants pour vous et pourraient impacter vos choix en tant que consommateur (4 étoiles signifiant très important) ?\nActions philanthropiques réalisées :Mécénat, bénévolat d'entreprise, compensation...",
    "description": "",
    "options": []
  },
  {
    "id": "21398909",
    "type": "Rating (1-4)",
    "question": "13.7/ Concernant les entreprises : quels paramètres sont les plus importants pour vous et pourraient impacter vos choix en tant que consommateur (4 étoiles signifiant très important) ?\nValeurs, éthique et transparence de l'organisation :",
    "description": "",
    "options": []
  },
  {
    "id": "21398910",
    "type": "Rating (1-4)",
    "question": "13.8/ Concernant les entreprises : quels paramètres sont les plus importants pour vous et pourraient impacter vos choix en tant que consommateur (4 étoiles signifiant très important) ?\nCréation de lien social autour de l'identité :Communauté de partage, solidarité,...",
    "description": "",
    "options": []
  },
  {
    "id": "21398911",
    "type": "Survey",
    "question": "14/ Parmi les 7 axes ci-dessous, quelles problématiques devraient selon vous être traitées en priorité par les organisations de votre région ?",
    "description": "",
    "options": [
      "La gouvernance de l'organisation (qui prend les décisions et comment)",
      "Le respect des droits de l'Homme",
      "Les relations et conditions de travail des salariés",
      "L'impact des activités sur l'environnement",
      "La lutte contra la corruption et la concurrence déloyale",
      "La responsabilité envers le consommateur (information, sécurité, respect de la vie privée...)",
      "Les responsabilité envers les communautés et le développement local"
    ]
  },
  {
    "id": "21398912",
    "type": "Survey",
    "question": "15/ Connaissez-vous au moins un label de développement durable ?",
    "description": "",
    "options": [
      "Oui",
      "Non"
    ]
  },
  {
    "id": "21398913",
    "type": "Rating (1-4)",
    "question": "16/ Si oui, sur une échelle de 1 à 4, quel degré de confiance accordez-vous aux labels de développement durable ? (4 étoiles étant le niveau de confiance maximum).",
    "description": "",
    "options": []
  },
  {
    "id": "21398914",
    "type": "Survey",
    "question": "17/ Si on vous proposait un label territorial qui certifie les bonnes pratiques des organisations en termes de développement durable, il faudrait impérativement qu'il s'appuie sur :",
    "description": "",
    "options": [
      "Les attentes et les avis des citoyens",
      "Les enjeux des différents secteurs d'activité",
      "Les particularités de chaque territoire",
      "Un cahier des charges clair, explicite et transparent",
      "Des normes réglementées, comme l'ISO 26 000 de l'AFNOR",
      "Une analyse poussée des données de l'organisation",
      "Un parcours d'accompagnement de l'organisation à la démarche RSE (Responsabilité Sociétales des Entreprises)",
      "La mise en valeur des entreprises locales et de l'économie circulaire",
      "Autre"
    ]
  },
  {
    "id": "21398915",
    "type": "Survey",
    "question": "18/ Est-ce qu'un complément de prix raisonnable et justifié sur les produits certifiés vous paraîtrait acceptable ?",
    "description": "",
    "options": [
      "Oui",
      "Non"
    ]
  },
  {
    "id": "21398916",
    "type": "Survey",
    "question": "19/ C'est presque terminé ! Souhaitez-vous recevoir les résultats de ce questionnaire sur votre adresse email ?",
    "description": "",
    "options": [
      "Oui, envoyez moi les résultats par email",
      "Non merci"
    ]
  }
];


// --- CSS Styles (directly embedded for simplicity in a single React file) ---
const appStyles = `
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f0f2f5;
    display: flex;
    justify-content: center;
    align-items: flex-start; /* Align to the top */
    min-height: 100vh;
    margin: 20px 0; /* Add some margin top/bottom */
    color: #333;
  }

  .container {
    background-color: #ffffff;
    padding: 30px 40px;
    border-radius: 12px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 800px;
    box-sizing: border-box;
  }

  h1 {
    text-align: center;
    color: #0056b3;
    margin-bottom: 30px;
    font-size: 2em;
    font-weight: 600;
  }

  .subtitle {
    text-align: center;
    color: #666;
    margin-bottom: 20px;
    font-size: 1.1em;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 25px;
  }

  .form-group {
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: #fdfdfd;
  }

  .form-group label {
    display: block;
    margin-bottom: 10px;
    font-weight: 600;
    color: #555;
    font-size: 1.1em;
  }
  .form-group label .text-danger {
    color: #dc3545; /* Couleur rouge de Bootstrap pour l'astérisque obligatoire */
  }

  .form-group input[type="text"],
  .form-group input[type="email"],
  .form-group input[type="number"],
  .form-group select {
    width: calc(100% - 20px);
    padding: 12px 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1em;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
    transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  }

  .form-group input[type="text"]:focus,
  .form-group input[type="email"]:focus,
  .form-group input[type="number"]:focus,
  .form-group select:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
    outline: none;
  }

  .radio-group, .checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .radio-option, .checkbox-option {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }

  .radio-option input[type="radio"],
  .checkbox-option input[type="checkbox"] {
    margin-right: 10px;
    transform: scale(1.2); /* Make radio/checkboxes slightly larger */
    accent-color: #007bff; /* Custom color for checked state */
  }

  .radio-option label,
  .checkbox-option label {
    font-weight: normal;
    font-size: 1em;
    color: #444;
  }

  /* Rating specific styles */
  .rating-group .stars {
    display: flex;
    gap: 5px;
    margin-top: 5px;
  }

  .rating-group .star {
    font-size: 1.8em;
    color: #ccc;
    cursor: pointer;
    transition: color 0.2s ease;
  }

  .rating-group .star.selected,
  .rating-group .star:hover {
    color: #ffc107; /* Gold color for selected/hovered stars */
  }

  /* Ranking/Priority Styles (for input type number) */
  .ranking-group {
      display: flex;
      flex-direction: column;
      gap: 15px;
  }
  .ranking-option {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 10px;
      border: 1px solid #f0f0f0;
      border-radius: 6px;
      background-color: #f8f8f8;
  }

  .ranking-option label {
      flex-grow: 1; /* Allow label to take available space */
      margin-bottom: 0; /* Override default label margin */
      font-weight: normal; /* Override default label font-weight */
      color: #444;
  }

  .ranking-option input[type="number"] {
      width: 80px; /* Fixed width for number input */
      padding: 8px 10px;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 1em;
      text-align: center;
      -moz-appearance: textfield; /* Hide arrows on Firefox */
  }
  .ranking-option input[type="number"]::-webkit-outer-spin-button,
  .ranking-option input[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none; /* Hide arrows on Chrome, Safari, Edge */
      margin: 0;
  }

  /* Style for "Autre" text input */
  .other-input-container {
    margin-top: 10px;
    padding-left: 30px; /* Indent the "Autre" field */
  }

  .other-input-container input[type="text"] {
      width: calc(100% - 30px); /* Adjust width to fit container + padding */
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 0.95em;
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  /* Specific style for inline error messages */
  .inline-error-message {
    color: #dc3545; /* Red color for error */
    font-size: 0.85em;
    margin-top: 5px;
    margin-left: 5px; /* Indent slightly */
  }

  button[type="submit"] {
    background-color: #007bff;
    color: white;
    padding: 15px 25px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.1em;
    font-weight: 600;
    transition: background-color 0.3s ease, transform 0.2s ease;
    align-self: center; /* Center the submit button */
    width: fit-content;
    margin-top: 20px;
  }

  button[type="submit"]:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }

  .description {
    font-size: 0.9em;
    color: #666;
    margin-top: 5px;
    padding-left: 5px;
    border-left: 3px solid #007bff;
  }

  .submission-message {
    text-align: center;
    margin-top: 20px;
    padding: 10px;
    border-radius: 8px;
    font-weight: bold;
  }

  .submission-message.success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }
  .submission-message.error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }

  /* Styles for the Thank You page */
  .thank-you-page {
    text-align: center;
    padding: 50px;
    background-color: #f0f2f5;
    border-radius: 12px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: 50px auto;
  }

  .thank-you-page h2 {
    color: #28a745; /* Green for success */
    font-size: 2.5em;
    margin-bottom: 20px;
  }

  .thank-you-page p {
    font-size: 1.2em;
    color: #555;
    margin-bottom: 30px;
  }

  .thank-you-page button {
    background-color: #007bff;
    color: white;
    padding: 12px 25px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.1em;
    font-weight: 600;
    transition: background-color 0.3s ease, transform 0.2s ease;
  }

  .thank-you-page button:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }


  /* Responsive adjustments */
  @media (max-width: 768px) {
    .container {
      padding: 20px 25px;
      margin: 15px;
    }

    h1 {
      font-size: 1.8em;
    }

    .form-group label {
      font-size: 1em;
    }

    button[type="submit"] {
      padding: 12px 20px;
      font-size: 1em;
    }

    .thank-you-page {
      padding: 30px;
    }
    .thank-you-page h2 {
      font-size: 2em;
    }
  }

  @media (max-width: 480px) {
    .container {
      padding: 15px 20px;
    }

    h1 {
      font-size: 1.5em;
    }
    .thank-you-page h2 {
      font-size: 1.8em;
    }
    .thank-you-page p {
      font-size: 1em;
    }
  }
`;

// Helper component for Rating questions
const RatingInput = ({ questionId, value, onChange }) => {
  const maxStars = 4; // As per "Rating (1-4)"

  const handleStarClick = (starValue) => {
    onChange(questionId, starValue);
  };

  return (
    <div className="stars">
      {[...Array(maxStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <span
            key={`star-${questionId}-${starValue}`} // Ensure unique key for each star
            className={`star ${starValue <= value ? 'selected' : ''}`}
            onClick={() => handleStarClick(starValue)}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

// Helper component for Ranking questions (Question 8)
const RankingInput = ({ questionId, options, value, onChange }) => {
  const ranks = [1, 2, 3]; // Possible ranks (1 to 3)
  const [inputErrors, setInputErrors] = useState({}); // State for individual input errors

  const handleInputChange = (optionToUpdate, inputRank) => {
    let newRank = null;
    const rankAsNumber = parseInt(inputRank, 10);

    // Strict validation: Only accept empty string, or 1, 2, or 3
    if (inputRank === '') {
      newRank = null;
      setInputErrors(prev => ({ ...prev, [optionToUpdate]: undefined })); // Clear error
    } else if (!isNaN(rankAsNumber) && ranks.includes(rankAsNumber)) {
      newRank = rankAsNumber;
      setInputErrors(prev => ({ ...prev, [optionToUpdate]: undefined })); // Clear error
    } else {
      // Invalid input: Set error message and prevent state update for this option
      setInputErrors(prev => ({ ...prev, [optionToUpdate]: "Veuillez entrer 1, 2 ou 3." }));
      return; // Stop here if input is invalid
    }

    const currentRanks = { ...value };

    // If the newRank is already taken by another option, swap them
    if (newRank !== null) { // Only attempt swap if a valid rank (1, 2, or 3) is provided
        const existingOption = Object.keys(currentRanks).find(
            key => currentRanks[key] === newRank && key !== optionToUpdate
        );
        if (existingOption) {
            currentRanks[existingOption] = currentRanks[optionToUpdate]; // Swap the ranks
        }
    }
    currentRanks[optionToUpdate] = newRank; // Update the current option's rank

    onChange(questionId, currentRanks);
  };

  return (
    <div className="ranking-group">
      {options.map(option => (
        <div key={option} className="ranking-option">
          <label>{option}</label>
          <input
            type="number"
            min="1"
            max="3"
            placeholder="Rang"
            value={value[option] || ''} // Current value for this option
            onChange={(e) => handleInputChange(option, e.target.value)}
            required // Still required for form submission validation
          />
          {inputErrors[option] && (
            <p className="inline-error-message">{inputErrors[option]}</p>
          )}
        </div>
      ))}
    </div>
  );
};


// Main App Component
const App = () => {
  const [answers, setAnswers] = useState({});
  const [submissionMessage, setSubmissionMessage] = useState(null);
  // State to hold specific error messages for individual checkbox questions
  const [checkboxErrors, setCheckboxErrors] = useState({});
  // State for email input error
  const [emailError, setEmailError] = useState(null);
  // NOUVEAUTÉ : État pour gérer la page de confirmation de soumission
  const [isSubmitted, setIsSubmitted] = useState(false);


  // Define the numeric IDs for the top inputs for easy reference
  const EMAIL_INPUT_ID = "10000000";
  const FULL_NAME_INPUT_ID = "10000001";

  // List of question IDs that should show the "Autre" input field when "Autre" is selected.
  // ONLY for Q1 (21398883), Q2 (21398884), Q5 (21398887)
  const questionsWithOtherTextInput = ["21398883", "21398884", "21398887"];

  // List of question IDs that are checkboxes and should have a max 3 selection limit
  // ALL checkbox questions: Q11, Q14, Q17
  const checkboxQuestionsWithMax3Limit = ["21398901", "21398911", "21398914"];


  // Function to handle changes in form inputs.
  const handleChange = (questionId, value, isOtherText = false) => {
    // Specific validation for email_input
    if (questionId === EMAIL_INPUT_ID) {
      setAnswers(prevAnswers => ({
        ...prevAnswers,
        [questionId]: value
      }));
      // Basic email format validation regex
      if (value.trim() === '') {
        setEmailError("L'adresse électronique est requise.");
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        setEmailError("Veuillez entrer une adresse électronique valide.");
      } else {
        setEmailError(null); // Clear error if valid
      }
      return; // Stop here for email input
    }


    setAnswers(prevAnswers => {
      if (isOtherText) {
        const currentAnswer = prevAnswers[questionId] || {};
        return {
          ...prevAnswers,
          [questionId]: {
            ...currentAnswer,
            otherText: value
          }
        };
      }

      // Logic for radio buttons that have an "Autre" option and are in `questionsWithOtherTextInput`
      if (questionsWithOtherTextInput.includes(questionId)) {
        if (value === 'Autre') {
          const currentOtherText = prevAnswers[questionId]?.otherText || '';
          return {
            ...prevAnswers,
            [questionId]: { option: 'Autre', otherText: currentOtherText }
          };
        } else {
          // If user changes from 'Autre' to another option, clear 'otherText'
          return {
            ...prevAnswers,
            [questionId]: value
          };
        }
      } else {
        // For all other standard inputs (text, radio, rating)
        return {
          ...prevAnswers,
          [questionId]: value
        };
      }
    });
  };

  // Function to handle changes for checkbox inputs specifically.
  const handleCheckboxChange = (questionId, optionValue, isChecked) => {
    setAnswers(prevAnswers => {
      const currentAnswers = prevAnswers[questionId] || [];

      // Check if this question is one of those with a max 3 limit
      if (checkboxQuestionsWithMax3Limit.includes(questionId)) {
        if (isChecked) {
          if (currentAnswers.length >= 3) {
            // Set local error message for this specific question
            setCheckboxErrors(prevErrors => ({
              ...prevErrors,
              [questionId]: `Vous ne pouvez sélectionner qu'un maximum de 3 options pour cette question.`
            }));
            return prevAnswers; // Do not update state if limit reached
          }
          // Clear local error message if a valid selection is made
          setCheckboxErrors(prevErrors => {
            const newErrors = { ...prevErrors };
            delete newErrors[questionId];
            return newErrors;
          });
          return {
            ...prevAnswers,
            [questionId]: [...currentAnswers, optionValue]
          };
        } else {
          // Clear local error message when unchecking
          setCheckboxErrors(prevErrors => {
            const newErrors = { ...prevErrors };
            delete newErrors[questionId];
            return newErrors;
          });
          return {
            ...prevAnswers,
            [questionId]: currentAnswers.filter(item => item !== optionValue)
          };
        }
      } else {
        // Default checkbox handling for other multiple choice questions (if any, though none currently defined without limit)
        if (isChecked) {
          return {
            ...prevAnswers,
            [questionId]: [...currentAnswers, optionValue]
          };
        } else {
          return {
            ...prevAnswers,
            [questionId]: currentAnswers.filter(item => item !== optionValue)
          };
        }
      }
    });
  };

  // NOUVEAUTÉ : Composant simple pour la page de remerciement
  const SubmissionSuccessPage = () => {
    return (
      <div className="thank-you-page">
        <h2>Merci pour votre soumission !</h2>
        <p>Votre questionnaire a été envoyé avec succès.</p>
        <p>Nous apprécions votre contribution.</p>
        <button onClick={() => {
          setIsSubmitted(false); // Réinitialise l'état pour afficher le formulaire à nouveau
          setAnswers({}); // Vide le formulaire
          setSubmissionMessage(null); // Efface le message de soumission
        }}>Remplir un nouveau questionnaire</button>
      </div>
    );
  };


  // Function to handle form submission.
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default browser form submission

    setSubmissionMessage(null); // Reset global submission message

    const dataToSend = {};
    let allRequiredFieldsFilled = true; // Flag to track overall form validity

    // --- Validate and add top inputs (Email, Nom complet) explicitly ---
    // Find the question definitions for these top inputs using their new numeric IDs
    const emailQuestion = questionsData.find(q => q.id === EMAIL_INPUT_ID);
    const fullNameQuestion = questionsData.find(q => q.id === FULL_NAME_INPUT_ID);


    // Validate Email First
    if (!answers[EMAIL_INPUT_ID] || answers[EMAIL_INPUT_ID].trim() === '') {
        allRequiredFieldsFilled = false;
        setSubmissionMessage("Veuillez entrer votre adresse électronique.");
        return;
    } else if (!/\S+@\S+\.\S+/.test(answers[EMAIL_INPUT_ID])) { // Basic email format validation
        allRequiredFieldsFilled = false;
        setSubmissionMessage("Veuillez entrer une adresse électronique valide.");
        return;
    } else {
        // Explicitly add email and its text to dataToSend
        dataToSend[emailQuestion.id] = answers[EMAIL_INPUT_ID];
        dataToSend[`${emailQuestion.id}_text`] = emailQuestion.question;
    }

    // Validate Full Name Second
    if (!answers[FULL_NAME_INPUT_ID] || answers[FULL_NAME_INPUT_ID].trim() === '') {
        allRequiredFieldsFilled = false;
        setSubmissionMessage("Veuillez entrer votre nom complet.");
        return;
    } else {
        // Explicitly add full name and its text to dataToSend
        dataToSend[fullNameQuestion.id] = answers[FULL_NAME_INPUT_ID];
        dataToSend[`${fullNameQuestion.id}_text`] = fullNameQuestion.question;
    }


    // --- Validate and add other questions ---
    for (const question of questionsData) {
        // Skip validation/addition for virtual questions already handled above
        if (question.id === EMAIL_INPUT_ID || question.id === FULL_NAME_INPUT_ID) {
            continue;
        }

        const answerValue = answers[question.id];

        // Validate required fields (except Q19 which is optional)
        if (question.id !== "21398916") {
            // General check for missing answers
            if (answerValue === undefined || answerValue === null || answerValue === '') {
                // If it's a "Autre" type question AND 'Autre' was selected but text is missing
                if (questionsWithOtherTextInput.includes(question.id) && (typeof answerValue === 'object' && answerValue.option === 'Autre')) {
                    if (!answerValue.otherText || answerValue.otherText.trim() === '') {
                        allRequiredFieldsFilled = false;
                        break; // Stop validation on first missing field
                    }
                } else if (question.id === "21398890") { // Ranking question
                    const selectedRanks = Object.values(answerValue || {}).filter(rank => rank !== null && rank !== '');
                    if (selectedRanks.length !== question.options.length || new Set(selectedRanks).size !== question.options.length) {
                        allRequiredFieldsFilled = false;
                        break;
                    }
                    // Additional check for ranking to ensure all values are 1, 2, or 3
                    const invalidRanks = Object.values(answerValue || {}).some(rank => rank !== null && (rank < 1 || rank > 3));
                    if (invalidRanks) {
                        allRequiredFieldsFilled = false;
                        break;
                    }

                } else if (question.type === "Survey" && question.options.length > 0 && checkboxQuestionsWithMax3Limit.includes(question.id)) { // Checkbox questions with a max limit (Q11, Q14, Q17)
                    if (!Array.isArray(answerValue) || answerValue.length === 0) {
                        allRequiredFieldsFilled = false;
                        break;
                    }
                    // This specific validation should mostly be prevented by handleCheckboxChange, but kept for robustness
                    if (answerValue.length > 3) {
                         allRequiredFieldsFilled = false;
                         break;
                    }
                } else { // Standard text, radio, rating
                    allRequiredFieldsFilled = false;
                    break; // Stop validation on first missing field
                }
            }
        }

        // Prepare data for sending (only include answered questions)
        // This part runs ONLY if allRequiredFieldsFilled is still true up to this point
        // And it only adds fields that were NOT the top inputs (full_name_input, email_input)
        if (answerValue !== undefined && answerValue !== null && answerValue !== '') {
            // For ranking (Q8) or questions with "Autre" text input
            if (question.id === "21398890" || (typeof answerValue === 'object' && questionsWithOtherTextInput.includes(question.id))) {
                dataToSend[question.id] = answerValue;
            } else {
                // For all other types (text, simple radio, rating, checkboxes)
                dataToSend[question.id] = answerValue;
            }
            dataToSend[`${question.id}_text`] = question.question; // Include question text
        }
    }

    // This block should only be reached if some required fields within the main loop were missed
    // after the top inputs were successfully validated.
    if (!allRequiredFieldsFilled) {
        // This general message will only display if a specific error message wasn't already set
        // by the validation of the top input fields (nom complet / email)
        if (!submissionMessage) {
            setSubmissionMessage("Veuillez remplir toutes les questions requises pour soumettre le questionnaire.");
        }
        return; // Stop the submission if any required field is missing
    }

    console.log("Attempting to submit questionnaire answers to backend:", dataToSend);

    try {
      const response = await fetch('http://localhost:5000/submit-questionnaire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json(); // Toujours essayer de parser la réponse JSON

      if (response.ok) {
        console.log('Success:', result);
        setSubmissionMessage('Questionnaire soumis avec succès !');
        setIsSubmitted(true); // NOUVEAUTÉ : Afficher la page de confirmation
        // setAnswers({}); // Non nécessaire car on passe à une autre vue
      } else {
        console.error('Submission Error:', result);
        // NOUVEAUTÉ : Vérifier si l'erreur vient d'un doublon d'e-mail (statut 409)
        if (response.status === 409) {
          setSubmissionMessage(result.message || 'Cette adresse électronique a déjà soumis le questionnaire.');
        } else {
          setSubmissionMessage(`Échec de la soumission : ${result.message || 'Erreur inconnue'}`);
        }
      }

    } catch (error) {
      console.error('Network or other error:', error);
      setSubmissionMessage('Une erreur est survenue lors de la connexion au serveur. Veuillez réessayer.');
    }
  };

  return (
    <>
      <style>{appStyles}</style>
      {/* NOUVEAUTÉ : Rendu conditionnel de la page de confirmation ou du formulaire */}
      {isSubmitted ? (
        <SubmissionSuccessPage />
      ) : (
        <div className="container">
          {/* TOP SECTION: Title, Welcome Message, Session ID */}
          <h1 className="form-title-icon">
              Sondage sur le Développement Durable
          </h1>
          <p className="subtitle">
            Veuillez remplir ce sondage.
          </p>
          <hr style={{ margin: '20px 0', borderColor: '#eee' }} /> {/* Separator */}

          <form onSubmit={handleSubmit}>
            {/* Render Email input explicitly at the top with real-time validation feedback */}
            <div className="form-group">
              <label htmlFor={`question-${EMAIL_INPUT_ID}`} className="fw-semibold">
                Adresse électronique <span className="text-danger"> *</span>
              </label>
              <input
                type="email"
                id={`question-${EMAIL_INPUT_ID}`}
                name={`question-${EMAIL_INPUT_ID}`}
                placeholder="votre.email@example.com"
                value={answers[EMAIL_INPUT_ID] || ''}
                onChange={(e) => handleChange(EMAIL_INPUT_ID, e.target.value)}
                required
              />
              {emailError && (
                <p className="inline-error-message">
                  {emailError}
                </p>
              )}
            </div>

            {/* Render Nom complet input explicitly after email */}
            <div className="form-group">
              <label htmlFor={`question-${FULL_NAME_INPUT_ID}`} className="fw-semibold">
                Nom complet <span className="text-danger"> *</span>
              </label>
              <input
                type="text"
                id={`question-${FULL_NAME_INPUT_ID}`}
                name={`question-${FULL_NAME_INPUT_ID}`}
                placeholder="Entrez votre nom complet"
                value={answers[FULL_NAME_INPUT_ID] || ''}
                onChange={(e) => handleChange(FULL_NAME_INPUT_ID, e.target.value)}
                required
              />
            </div>


            {questionsData.map(question => {
              // Skip rendering if this question is one of the top inputs (already rendered explicitly)
              if (question.id === EMAIL_INPUT_ID || question.id === FULL_NAME_INPUT_ID) {
                  return null;
              }

              return (
                <div key={question.id} className="form-group">
                  <label htmlFor={`question-${question.id}`} className="fw-semibold">
                      {(() => {
                        const lines = question.question.split('\n');
                        return lines.map((line, i) => (
                          <React.Fragment key={i}>
                            {line}
                            {i < lines.length - 1 && <br />}
                          </React.Fragment>
                        ));
                      })()}
                      {/* Add asterisk for required fields, except for Question 19 which is optional */}
                      {question.id !== "21398916" && <span className="text-danger"> *</span>}
                    </label>
                  {question.description && <p className="description">{question.description}</p>}

                  {/* Render different input types based on Poll Type and options */}
                  {question.type === "Survey" && question.options.length === 0 && (
                    // Text input for open-ended survey questions (e.g., Nom du cabinet, N°Siret, Ville)
                    <input
                      type="text"
                      id={`question-${question.id}`}
                      name={`question-${question.id}`}
                      value={answers[question.id] || ''}
                      onChange={(e) => handleChange(question.id, e.target.value)}
                      required
                    />
                  )}

                  {/* Radio buttons for single-choice survey questions (most Survey types, excluding ranking and specific checkboxes) */}
                  {/* This now includes only Q6, Q7, Q9, Q12, Q15, Q18, Q19 */}
                  {question.type === "Survey" && question.options.length > 0 &&
                   ![
                     "21398890", // Exclude ranking Q8
                     "21398901", // Exclude checkbox Q11
                     "21398911", // Exclude checkbox Q14
                     "21398914"  // Exclude checkbox Q17
                   ].includes(question.id) && (
                    <div className="radio-group">
                      {question.options.map(option => (
                        <div key={option} className="radio-option">
                          <input
                            type="radio"
                            id={`question-${question.id}-${option.replace(/\s/g, '-')}`}
                            name={`question-${question.id}`}
                            value={option}
                            checked={
                              (typeof answers[question.id] === 'object' && answers[question.id]?.option === option) ||
                              (typeof answers[question.id] === 'string' && answers[question.id] === option)
                            }
                            onChange={(e) => handleChange(question.id, e.target.value)}
                            required={question.id !== "21398916"} // Q19 is optional
                          />
                          <label htmlFor={`question-${question.id}-${option.replace(/\s/g, '-')}`}>
                            {option}
                          </label>
                        </div>
                      ))}
                      {/* Text input for "Autre" option, displayed ONLY for specific questions (Q1, Q2, Q5) and when "Autre" is selected */}
                      {questionsWithOtherTextInput.includes(question.id) &&
                       (typeof answers[question.id] === 'object' && answers[question.id]?.option === 'Autre') && (
                        <div className="other-input-container">
                          <input
                            type="text"
                            placeholder="Veuillez préciser"
                            value={answers[question.id]?.otherText || ''}
                            onChange={(e) => handleChange(question.id, e.target.value, true)} // Pass `true` for `isOtherText`
                            required
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {question.type === "Survey" && question.id === "21398890" && (
                    // Special handling for Question 8 (Ranking) with number inputs
                    <RankingInput
                      questionId={question.id}
                      options={question.options}
                      value={answers[question.id] || {}} // Ensure it's an object
                      onChange={handleChange}
                    />
                  )}

                  {/* Checkboxes for multiple selections (Question 11, 14, 17) */}
                  {question.type === "Survey" && question.options.length > 0 &&
                   checkboxQuestionsWithMax3Limit.includes(question.id) && ( // Now includes all checkbox questions with max 3 limit
                    <div className="checkbox-group">
                      {question.options.map(option => (
                        <div key={option} className="checkbox-option">
                          <input
                            type="checkbox"
                            id={`question-${question.id}-${option.replace(/\s/g, '-')}`}
                            name={`question-${question.id}`}
                            value={option}
                            checked={answers[question.id]?.includes(option) || false}
                            onChange={(e) => handleCheckboxChange(question.id, option, e.target.checked)}
                          />
                          <label htmlFor={`question-${question.id}-${option.replace(/\s/g, '-')}`}>
                            {option}
                          </label>
                        </div>
                      ))}
                      {/* Display local error message for max 3 limit if applicable */}
                      {checkboxErrors[question.id] && (
                        <p className="inline-error-message">
                          {checkboxErrors[question.id]}
                        </p>
                      )}
                    </div>
                  )}


                  {question.type === "Rating (1-4)" && (
                    // Star rating component for rating questions
                    <div className="rating-group">
                      <RatingInput
                        questionId={question.id}
                        value={answers[question.id] || 0}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                </div>
              );
            })}

            <button type="submit">Soumettre le questionnaire</button>

            {submissionMessage && (
              <div className={`submission-message ${submissionMessage.includes('succès') ? 'success' : 'error'}`}>
                {submissionMessage}
              </div>
            )}
          </form>
        </div>
      )}
    </>
  );
};

export default App;
