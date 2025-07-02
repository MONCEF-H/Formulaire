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
const individualResponseSchema = new mongoose.Schema({
    questionId: { type: String, required: true },
    questionText: { type: String, required: true },
    answer: { type: mongoose.Schema.Types.Mixed, required: true },
    timestamp: { type: Date, default: Date.now }
}, {
    collection: 'reponses' // Collection 'reponses' dans la DB 'sondage'
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

        const emailQuestionId = "10000000"; // L'ID que nous avons assigné à l'e-mail dans App.js
        const submittedEmail = answers[emailQuestionId];

        if (!submittedEmail || typeof submittedEmail !== 'string' || submittedEmail.trim() === '') {
            return res.status(400).json({ message: 'Adresse électronique requise ou non valide pour la soumission.' });
        }

        const existingEmailSubmission = await IndividualQuestionnaireResponse.findOne({
            questionId: emailQuestionId,
            answer: submittedEmail
        });

        if (existingEmailSubmission) {
            console.log(`Tentative de soumission en doublon pour l'e-mail : ${submittedEmail}`);
            return res.status(409).json({ message: 'Cette adresse électronique a déjà soumis le questionnaire.' });
        }

        const responseDocuments = [];
        for (const questionIdKey in answers) {
            if (Object.hasOwnProperty.call(answers, questionIdKey) && !questionIdKey.endsWith('_text')) {
                const questionText = answers[`${questionIdKey}_text`];
                const answerValue = answers[questionIdKey];

                if (questionText === undefined) {
                    console.warn(`Missing questionText for questionId: ${questionIdKey}. Skipping this entry.`);
                    continue;
                }

                responseDocuments.push({
                    questionId: questionIdKey,
                    questionText: questionText,
                    answer: answerValue
                });
            }
        }

        const insertedResponses = await IndividualQuestionnaireResponse.insertMany(responseDocuments);

        console.log('Individual questionnaire answers saved successfully into the "reponses" collection:', insertedResponses);
        res.status(200).json({ message: 'Questionnaire submitted successfully!', data: insertedResponses });

    } catch (error) {
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

// --- ANALYTICS ENDPOINTS POUR LE DASHBOARD ADMIN ---

// GET : Obtenir le nombre total de soumissions
app.get('/analytics/total-submissions', async (req, res) => {
    try {
        const count = await IndividualQuestionnaireResponse.countDocuments({});
        res.status(200).json({ total: count });
    } catch (error) {
        console.error("Error fetching total submissions:", error);
        res.status(500).json({ message: 'Failed to retrieve total submissions.', error: error.message });
    }
});

// GET : Obtenir la répartition pour les questions à choix unique (radio buttons)
// Fonctionne pour Q6, Q7, Q9, Q12, Q15, Q18, Q19
app.get('/analytics/single-choice/:questionId', async (req, res) => {
    try {
        const { questionId } = req.params;
        const results = await IndividualQuestionnaireResponse.aggregate([
            { $match: { questionId: questionId, answer: { $type: "string" } } }, // Match questionId et s'assurer que la réponse est une chaîne (option directe)
            { $group: {
                _id: "$answer",
                count: { $sum: 1 }
            }},
            { $sort: { count: -1 } }
        ]);
        res.status(200).json(results);
    } catch (error) {
        console.error(`Error fetching single choice analytics for question ${req.params.questionId}:`, error);
        res.status(500).json({ message: 'Failed to retrieve single choice analytics.', error: error.message });
    }
});

// GET : Obtenir la répartition pour les questions à choix unique avec "Autre" texte (radio + text input)
// Fonctionne pour Q1, Q2, Q5
app.get('/analytics/single-choice-with-other/:questionId', async (req, res) => {
    try {
        const { questionId } = req.params;
        const results = await IndividualQuestionnaireResponse.aggregate([
            { $match: { questionId: questionId } },
            { $project: {
                // Si l'answer est un objet avec 'option'=='Autre', utiliser 'otherText', sinon utiliser 'answer'
                effectiveAnswer: {
                    $cond: {
                        if: { $and: [
                            { $eq: [ { $type: "$answer" }, "object" ] },
                            { $eq: [ "$answer.option", "Autre" ] }
                        ]},
                        then: "$answer.otherText",
                        else: "$answer"
                    }
                }
            }},
            // Filtrer les réponses nulles ou vides qui pourraient résulter d'une mauvaise saisie
            { $match: { effectiveAnswer: { $ne: null, $ne: "" } } },
            { $group: {
                _id: "$effectiveAnswer",
                count: { $sum: 1 }
            }},
            { $sort: { count: -1 } }
        ]);
        res.status(200).json(results);
    } catch (error) {
        console.error(`Error fetching single choice with other analytics for question ${req.params.questionId}:`, error);
        res.status(500).json({ message: 'Failed to retrieve single choice with other analytics.', error: error.message });
    }
});


// GET : Obtenir la répartition pour les questions à choix multiples (checkboxes)
// Fonctionne pour Q11, Q14, Q17
app.get('/analytics/multi-select/:questionId', async (req, res) => {
    try {
        const { questionId } = req.params;
        const results = await IndividualQuestionnaireResponse.aggregate([
            { $match: { questionId: questionId, answer: { $type: "array" } } }, // Match questionId et s'assurer que la réponse est un tableau
            { $unwind: "$answer" }, // Déconstruit le tableau 'answer' en documents séparés pour chaque option
            { $group: {
                _id: "$answer", // Groupe par chaque option sélectionnée
                count: { $sum: 1 }
            }},
            { $sort: { count: -1 } }
        ]);
        res.status(200).json(results);
    } catch (error) {
        console.error(`Error fetching multi-select analytics for question ${req.params.questionId}:`, error);
        res.status(500).json({ message: 'Failed to retrieve multi-select analytics.', error: error.message });
    }
});


// GET : Obtenir la moyenne des notes pour les questions de type "Rating"
// Fonctionne pour toutes les questions 10.x et 13.x, et Q16
app.get('/analytics/average-rating/:questionId', async (req, res) => {
    try {
        const { questionId } = req.params;
        const results = await IndividualQuestionnaireResponse.aggregate([
            { $match: { questionId: questionId, answer: { $type: "number" } } }, // Match questionId et s'assurer que la réponse est un nombre
            { $group: {
                _id: null,
                average: { $avg: "$answer" },
                distribution: {
                    $push: "$answer" // Pour obtenir la distribution des notes si nécessaire
                }
            }}
        ]);

        if (results.length > 0) {
            // Calculer la distribution des notes (nombre de 1, 2, 3, 4)
            const distribution = { '1': 0, '2': 0, '3': 0, '4': 0 };
            results[0].distribution.forEach(score => {
                if (score >= 1 && score <= 4) {
                    distribution[score.toString()]++;
                }
            });
            res.status(200).json({
                questionId: questionId,
                averageRating: results[0].average,
                distribution: distribution
            });
        } else {
            res.status(404).json({ message: 'No numeric ratings found for this question ID.' });
        }
    } catch (error) {
        console.error(`Error fetching average rating for question ${req.params.questionId}:`, error);
        res.status(500).json({ message: 'Failed to retrieve average rating.', error: error.message });
    }
});

// GET : Obtenir les données pour la question de classement (Question 8 - ID 21398890)
app.get('/analytics/ranking/:questionId', async (req, res) => {
    try {
        const { questionId } = req.params;

        if (questionId !== "21398890") {
            return res.status(400).json({ message: "This endpoint is specifically for ranking question ID 21398890." });
        }

        const results = await IndividualQuestionnaireResponse.aggregate([
            { $match: { questionId: questionId } },
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

// GET : Obtenir les réponses brutes pour les champs de texte (Email, Nom complet, Siret, Ville, Nom du cabinet)
// Fonctionne pour 10000000 (Email), 10000001 (Nom complet), 21398881 (Nom cabinet), 21398882 (Siret), 21398885 (Ville)
app.get('/analytics/raw-text-answers/:questionId', async (req, res) => {
    try {
        const { questionId } = req.params;
        const results = await IndividualQuestionnaireResponse.aggregate([
            { $match: { questionId: questionId, answer: { $type: "string" } } },
            { $group: {
                _id: "$answer", // Groupe par la réponse exacte
                count: { $sum: 1 }
            }},
            { $sort: { count: -1 } } // Trie par les réponses les plus fréquentes
        ]);
        res.status(200).json(results);
    } catch (error) {
        console.error(`Error fetching raw text answers for question ${req.params.questionId}:`, error);
        res.status(500).json({ message: 'Failed to retrieve raw text answers.', error: error.message });
    }
});


// --- Start the Server ---
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`MongoDB URI used: ${MONGODB_URI ? '*****' : 'Not set!'}`);
});
