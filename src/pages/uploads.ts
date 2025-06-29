// src/pages/api/upload.ts

import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import Papa from 'papaparse';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseCsv = (file: formidable.File): Promise<any[]> => {
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


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const form = formidable({});

  try {
    const [fields, files] = await form.parse(req);

    const file = files.file?.[0];

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    // For XLSX, you would add a different parsing logic here
    if (file.mimetype === 'text/csv' || file.originalFilename?.endsWith('.csv')) {
      const data = await parseCsv(file);
      return res.status(200).json({ data });
    } else {
      // Placeholder for XLSX parsing
      return res.status(400).json({ error: 'Unsupported file type. Please upload a CSV.' });
    }

  } catch (error) {
    console.error('Error processing file upload:', error);
    return res.status(500).json({ error: 'Error processing file upload.' });
  }
}