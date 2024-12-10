import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const filePath = path.resolve(process.cwd(), 'db.json');
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    const products = JSON.parse(data);
    res.status(200).json(products.clothing); // Assuming your db.json has a clothing key
  } catch (error) {
    res.status(500).json({ error: 'Failed to read products' });
  }
}
