
import express from 'express';
import { Low, JSONFile } from 'lowdb';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

console.log('Server script starting.');

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'db.json');

console.log(`Database file path resolved to: ${file}`);

// Define the structure of the database
interface Data {
  chatHistories: { [email: string]: any[] };
}

// Initialize db.json if it doesn't exist or is empty
if (!fs.existsSync(file) || fs.readFileSync(file, 'utf-8').trim() === '') {
    console.log('db.json is missing or empty. Creating it.');
    fs.writeFileSync(file, JSON.stringify({ chatHistories: {} }, null, 2));
}

const adapter = new JSONFile<Data>(file);
const db = new Low(adapter);

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get('/api/chatHistory', async (req, res) => {
  console.log('[GET /api/chatHistory] Received request.');
  try {
    console.log('[GET /api/chatHistory] Attempting to read database...');
    await db.read();
    console.log('[GET /api/chatHistory] Database read successful.');

    if (!db.data || !db.data.chatHistories) {
        console.warn('[GET /api/chatHistory] db.data is null or missing chatHistories. Re-initializing.');
        db.data = { chatHistories: {} };
        await db.write();
        console.log('[GET /api/chatHistory] Database re-initialized and saved.');
    }
    console.log('[GET /api/chatHistory] Sending chat histories to client.');
    res.json(db.data.chatHistories);
  } catch (error) {
    console.error('[GET /api/chatHistory] A critical error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error: Could not read chat history.', details: error instanceof Error ? error.message : String(error) });
  }
});

app.post('/api/chatHistory', async (req, res) => {
  console.log('[POST /api/chatHistory] Received request.');
  const { email, history } = req.body;
  if (!email || !history) {
    console.error('[POST /api/chatHistory] Bad request: Missing email or history.');
    return res.status(400).send('Missing email or history');
  }

  try {
    console.log(`[POST /api/chatHistory] Attempting to write history for ${email}...`);
    await db.read();
    if (!db.data) {
        console.warn('[POST /api/chatHistory] db.data is null. Initializing.');
        db.data = { chatHistories: {} };
    }
    db.data.chatHistories[email] = history;
    await db.write();
    console.log(`[POST /api/chatHistory] Successfully saved history for ${email}.`);
    res.status(200).send('Chat history saved');
  } catch (error) {
    console.error(`[POST /api/chatHistory] A critical error occurred while saving for ${email}:`, error);
    res.status(500).json({ error: 'Internal Server Error: Could not save chat history.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running successfully on port ${port}.`);
});
