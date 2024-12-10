import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allowed methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allowed headers

  // Handle OPTIONS preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const filePath = path.resolve(process.cwd(), 'db.json');
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    const products = JSON.parse(data);
    res.status(200).json(products.clothing); // Assuming your db.json has a clothing key
  } catch (error) {
    console.error('Error reading db.json:', error);
    res.status(500).json({ error: 'Failed to read products' });
  }
}