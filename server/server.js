// your-react-app/server/server.js

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("Error: MONGODB_URI is not defined in your .env file. Please check server/.env");
    process.exit(1);
}

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully!'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// --- Mongoose Schemas and Models ---

// 1. Schema for INDIVIDUAL Questionnaire Responses (from React frontend)
// CE SCHÉMA INSÉRERA DÉSORMAIS LES DONNÉES DANS LA COLLECTION 'reponses'
const individualResponseSchema = new mongoose.Schema({
    questionId: { type: String, required: true },
    questionText: { type: String, required: true },
    answer: { type: mongoose.Schema.Types.Mixed, required: true },
    timestamp: { type: Date, default: Date.now }
}, {
    collection: 'reponses' // <-- Collection 'reponses' dans la DB 'sondage' (via .env URI)
});

const IndividualQuestionnaireResponse = mongoose.model('IndividualQuestionnaireResponse', individualResponseSchema);

// 2. Schema for AGGREGATED Questionnaire Results (from imported CSV)
const aggregatedResponseSchema = new mongoose.Schema({
    pollId: { type: String, required: true },
    pollType: { type: String, required: true },
    pollQuestion: { type: String, required: true },
    description: { type: String },
    pollOption: { type: mongoose.Schema.Types.Mixed },
    count: { type: Number, required: true },
    totalVotes: { type: Number, required: true },
    results: { type: mongoose.Schema.Types.Mixed },
    surveyName: { type: String },
    importTimestamp: { type: Date, default: Date.now }
}, {
    collection: 'aggregated_questionnaire_results'
});

const AggregatedQuestionnaireResult = mongoose.model('AggregatedQuestionnaireResult', aggregatedResponseSchema);


// --- API Routes ---

// POST endpoint for individual questionnaire submissions from React frontend
app.post('/submit-questionnaire', async (req, res) => {
    try {
        const answers = req.body;

        if (!answers || Object.keys(answers).length === 0) {
            return res.status(400).json({ message: 'No answers provided in the request body.' });
        }

        // --- NOUVEAUTÉ : Vérification de l'e-mail en doublon ---
        const emailQuestionId = "10000000"; // L'ID que nous avons assigné à l'e-mail dans App.js
        const submittedEmail = answers[emailQuestionId];

        // Validation préliminaire de l'e-mail avant la recherche en DB
        if (!submittedEmail || typeof submittedEmail !== 'string' || submittedEmail.trim() === '') {
            return res.status(400).json({ message: 'Adresse électronique requise ou non valide pour la soumission.' });
        }

        // Vérifier si cette adresse e-mail existe déjà dans la collection 'reponses'
        // On cherche un document où questionId est l'ID de l'e-mail ET où la réponse est l'e-mail soumis
        const existingEmailSubmission = await IndividualQuestionnaireResponse.findOne({
            questionId: emailQuestionId,
            answer: submittedEmail
        });

        if (existingEmailSubmission) {
            console.log(`Tentative de soumission en doublon pour l'e-mail : ${submittedEmail}`);
            // Envoyer un statut 409 Conflict pour indiquer un doublon
            return res.status(409).json({ message: 'Cette adresse électronique a déjà soumis le questionnaire.' });
        }
        // --- FIN NOUVEAUTÉ ---


        const responseDocuments = [];
        // Itérer sur toutes les réponses pour construire les documents à insérer
        for (const questionIdKey in answers) {
            // S'assurer que ce n'est pas une clé "_text" et que la réponse existe
            if (Object.hasOwnProperty.call(answers, questionIdKey) && !questionIdKey.endsWith('_text')) {
                const questionText = answers[`${questionIdKey}_text`]; // Récupérer le texte de la question
                const answerValue = answers[questionIdKey]; // Récupérer la valeur de la réponse

                // Ignorer si le texte de la question est manquant, bien qu'il devrait toujours être là
                if (questionText === undefined) {
                    console.warn(`Missing questionText for questionId: ${questionIdKey}. Skipping this entry.`);
                    continue;
                }

                responseDocuments.push({
                    questionId: questionIdKey, // Ceci sera l'ID propre (e.g., "21398887" ou "10000000")
                    questionText: questionText, // Ceci sera la question réelle (e.g., "5/ A quelle catégorie..." ou "Adresse électronique")
                    answer: answerValue // Ceci sera la réponse réelle de l'utilisateur
                });
            }
        }

        const insertedResponses = await IndividualQuestionnaireResponse.insertMany(responseDocuments);

        console.log('Individual questionnaire answers saved successfully into the "reponses" collection:', insertedResponses);
        res.status(200).json({ message: 'Questionnaire submitted successfully!', data: insertedResponses });

    } catch (error) {
        // Log l'erreur complète pour le débogage
        console.error('Error submitting individual questionnaire:', error);
        res.status(500).json({ message: 'Failed to submit questionnaire.', error: error.message });
    }
});


// POST endpoint for importing aggregated questionnaire data (from CSV script)
app.post('/import-aggregated-data', async (req, res) => {
    try {
        const aggregatedRecords = req.body;

        if (!Array.isArray(aggregatedRecords) || aggregatedRecords.length === 0) {
            return res.status(400).json({ message: 'No aggregated data records provided (expected an array).' });
        }

        const insertedAggregated = await AggregatedQuestionnaireResult.insertMany(aggregatedRecords);

        console.log(`Successfully imported ${insertedAggregated.length} aggregated records.`);
        res.status(200).json({
            message: `Successfully imported ${insertedAggregated.length} aggregated records.`,
            data: insertedAggregated
        });

    } catch (error) {
        console.error('Error importing aggregated data:', error);
        res.status(500).json({ message: 'Failed to import aggregated data.', error: error.message });
    }
});

// --- ANALYTICS ENDPOINTS ---
// (Ces endpoints interrogeront aussi la collection 'reponses')

// GET endpoint to retrieve aggregated data for a specific survey question (e.g., radio buttons, text inputs)
app.get('/analytics/survey/:questionId', async (req, res) => {
    try {
        const { questionId } = req.params;

        const results = await IndividualQuestionnaireResponse.aggregate([
            { $match: { questionId: questionId } }, // Filter by the specific question ID
            { $group: {
                _id: "$answer", // Group by the answer value (for simple answers like radio/text)
                count: { $sum: 1 } // Count occurrences of each answer
            }},
            { $sort: { count: -1 } } // Sort by most frequent answers first
        ]);

        res.status(200).json(results);
    }
    catch (error) {
        console.error(`Error fetching analytics for survey question ${req.params.questionId}:`, error);
        res.status(500).json({ message: 'Failed to retrieve survey analytics.', error: error.message });
    }
});

// GET endpoint to retrieve aggregated data for the ranking question (Question 8 - ID 21398890)
app.get('/analytics/ranking/:questionId', async (req, res) => {
    try {
        const { questionId } = req.params;

        if (questionId !== "21398890") {
            return res.status(400).json({ message: "This endpoint is specifically for ranking question ID 21398890." });
        }

        const results = await IndividualQuestionnaireResponse.aggregate([
            { $match: { questionId: questionId } }, // Filter for question 8
            { $project: {
                answers: { $objectToArray: "$answer" }
            }},
            { $unwind: "$answers" },
            { $group: {
                _id: {
                    option: "$answers.k",
                    rank: "$answers.v"
                },
                count: { $sum: 1 }
            }},
            { $sort: { "_id.option": 1, "_id.rank": 1 } }
        ]);

        const formattedResults = {};
        results.forEach(item => {
            if (!formattedResults[item._id.option]) {
                formattedResults[item._id.option] = {};
            }
            formattedResults[item._id.option][item._id.rank] = item.count;
        });

        res.status(200).json(formattedResults);
    } catch (error) {
        console.error(`Error fetching analytics for ranking question ${req.params.questionId}:`, error);
        res.status(500).json({ message: 'Failed to retrieve ranking analytics.', error: error.message });
    }
});


// --- Start the Server ---
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`MongoDB URI used: ${MONGODB_URI ? '*****' : 'Not set!'}`);
});
