// your-react-app/server/server.js

// Load environment variables from .env file
// In ESM, dotenv requires a slightly different approach for immediate loading
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

const individualResponseSchema = new mongoose.Schema({
    questionId: { type: String, required: true },
    questionText: { type: String, required: true },
    answer: { type: mongoose.Schema.Types.Mixed, required: true },
    timestamp: { type: Date, default: Date.now }
}, {
    collection: 'individual_questionnaire_responses'
});

const IndividualQuestionnaireResponse = mongoose.model('IndividualQuestionnaireResponse', individualResponseSchema);

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

app.post('/submit-questionnaire', async (req, res) => {
    try {
        const answers = req.body;

        if (!answers || Object.keys(answers).length === 0) {
            return res.status(400).json({ message: 'No answers provided in the request body.' });
        }

        const responseDocuments = [];
        for (const questionId in answers) {
            if (Object.hasOwnProperty.call(answers, questionId)) {
                const questionText = answers[`${questionId}_text`] || `Question ${questionId}`;

                responseDocuments.push({
                    questionId: questionId,
                    questionText: questionText,
                    answer: answers[questionId]
                });
            }
        }

        const insertedResponses = await IndividualQuestionnaireResponse.insertMany(responseDocuments);

        console.log('Individual questionnaire answers saved successfully:', insertedResponses);
        res.status(200).json({ message: 'Questionnaire submitted successfully!', data: insertedResponses });

    } catch (error) {
        console.error('Error submitting individual questionnaire:', error);
        res.status(500).json({ message: 'Failed to submit questionnaire.', error: error.message });
    }
});

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

// --- Start the Server ---
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`MongoDB URI used: ${MONGODB_URI ? '*****' : 'Not set!'}`);
});