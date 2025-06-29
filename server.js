// server.js

import express from 'express';
import cors from 'cors';
import formidable from 'formidable';
import Papa from 'papaparse';
import fs from 'fs';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const app = express();
// Use the PORT environment variable provided by Render, or default to 3001 for local development
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- Serve static files from the Vite build output ---
app.use(express.static(path.join(__dirname, 'dist')));

// --- Helper Function ---
const parseCsv = (file) => {
  return new Promise((resolve, reject) => {
    const fileContent = fs.readFileSync(file.filepath, 'utf8');
    Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

// --- API Endpoints ---

app.post('/api/upload', async (req, res) => {
  const form = formidable({});
  try {
    const [fields, files] = await form.parse(req);
    const file = files.file?.[0];

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    if (file.mimetype === 'text/csv' || file.originalFilename?.endsWith('.csv')) {
      const data = await parseCsv(file);
      return res.status(200).json({ data });
    } else {
      return res.status(400).json({ error: 'Unsupported file type. Please upload a CSV.' });
    }
  } catch (error) {
    console.error('Error processing file upload:', error);
    return res.status(500).json({ error: 'Error processing file upload.' });
  }
});

app.post('/api/search', async (req, res) => {
  const { dataType, searchQuery, data } = req.body;
  if (!dataType || !searchQuery || !data) {
    return res.status(400).json({ error: 'Missing required search parameters.' });
  }
  const lowerCaseQuery = searchQuery.toLowerCase();
  const filteredData = data.filter(row =>
    Object.values(row).some(value =>
      String(value).toLowerCase().includes(lowerCaseQuery)
    )
  );
  return res.status(200).json({ data: filteredData });
});

app.post('/api/export-csv', (req, res) => {
  const { data } = req.body;
  if (!data || !Array.isArray(data) || data.length === 0) {
    return res.status(400).json({ error: 'No data provided for export.' });
  }
  try {
    const csv = Papa.unparse(data);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=exported_data.csv');
    res.status(200).send(csv);
  } catch (error) {
    console.error('Failed to generate CSV:', error);
    res.status(500).json({ error: 'Failed to generate CSV.' });
  }
});

app.post('/api/get-suggestion', async (req, res) => {
    const { column, error, currentValue } = req.body;
    if (!column || !error || currentValue === undefined) {
        return res.status(400).json({ error: 'Missing parameters for AI suggestion.' });
    }
    const prompt = `For a CSV file column named '${column}', a data entry of '${currentValue}' is invalid. The error is: '${error}'. Provide a likely correct value. Respond with only the corrected value, and nothing else.`;
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "system", content: "You are a helpful data correction assistant." }, { role: "user", content: prompt }],
            model: "llama3-8b-8192",
            temperature: 0.2,
        });
        const suggestion = chatCompletion.choices[0]?.message?.content?.trim() || "";
        res.status(200).json({ suggestion });
    } catch(e) {
        console.error("Error calling Groq API:", e);
        res.status(500).json({ error: "Failed to contact AI service." });
    }
});

app.post('/api/propose-modification', async (req, res) => {
    const { command, data, dataType } = req.body;
    if (!command || !data || !dataType) {
        return res.status(400).json({ error: 'Missing command, data, or dataType.' });
    }
    const prompt = `You are a data modification assistant...`; // Abridged for clarity
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "system", content: "You are a data modification assistant that only responds with JSON." }, { role: "user", content: prompt }],
            model: "llama3-8b-8192",
            temperature: 0.1,
            response_format: { type: "json_object" },
        });
        const aiResponse = chatCompletion.choices[0]?.message?.content || '{}';
        const proposal = JSON.parse(aiResponse);
        proposal.summary = `The AI proposes making ${proposal.modifications?.length || 0} change(s)...`; // Abridged
        res.status(200).json(proposal);
    } catch (e) {
        console.error("Error calling Groq for modification:", e);
        res.status(500).json({ error: "Failed to get AI modification proposal." });
    }
});

app.post('/api/recommend-rules', async (req, res) => {
    const { data, dataType } = req.body;
    if (!data || !dataType) {
        return res.status(400).json({ error: 'Missing data or dataType for recommendations.' });
    }
    const prompt = `You are an expert data analysis assistant...`; // Abridged for clarity
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "system", content: "You are a data analysis assistant that only responds with JSON." }, { role: "user", content: prompt }],
            model: "llama3-8b-8192",
            temperature: 0.5,
            response_format: { type: "json_object" },
        });
        const aiResponse = chatCompletion.choices[0]?.message?.content || '{}';
        res.status(200).json(JSON.parse(aiResponse));
    } catch (e) {
        console.error("Error calling Groq for rule recommendations:", e);
        res.status(500).json({ error: "Failed to get AI recommendations." });
    }
});

// --- This catch-all route should be the last one ---
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
