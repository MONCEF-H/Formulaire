// your-react-app/server/importAggregatedData.js

// This script is meant to be run manually to import the CSV data.
// Make sure your backend server (server.js) is running before running this script.

import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import fetch from 'node-fetch'; // This will now work correctly due to "type": "module"

// In ES Modules, __dirname is not directly available. We construct it:
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
// IMPORTANT: Update this path if the CSV file is not in the root of your project
const CSV_FILE_PATH = path.join(__dirname, '..', '1.QuestionnairesClientsEXEMPLE.csv');
const BACKEND_URL = 'http://localhost:5000/import-aggregated-data'; // Your backend endpoint

async function importData() {
    const records = [];

    // Read and parse the CSV file
    fs.createReadStream(CSV_FILE_PATH)
        .pipe(csv({ separator: ';' })) // Specify semicolon delimiter
        .on('data', (row) => {
            records.push({
                pollId: row['Poll ID'],
                pollType: row['Poll Type'],
                pollQuestion: row['Poll Question'],
                description: row['Description'],
                pollOption: row['Poll Option'] === '' ? null : row['Poll Option'],
                count: parseInt(row['Count'], 10),
                totalVotes: parseInt(row['Total Votes'], 10),
                results: row['Results'] === '' ? null : parseFloat(row['Results']) || null,
                surveyName: row['Survey Name']
            });
        })
        .on('end', async () => {
            console.log(`Parsed ${records.length} records from CSV. Sending to backend...`);

            try {
                const response = await fetch(BACKEND_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(records),
                });

                const result = await response.json();

                if (response.ok) {
                    console.log('Successfully imported data:', result.message);
                } else {
                    console.error('Failed to import data:', result.message || 'Unknown error');
                    console.error('Backend response:', result);
                }
            } catch (error) {
                console.error('Error sending data to backend:', error);
            }
        });
}

importData();