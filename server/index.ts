
import express from 'express';
import { Low, JSONFile } from 'lowdb';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'db.json');

// Define the structure of the database
interface Data {
  chatHistories: { [email: string]: any[] };
}

// Initialize db.json if it doesn't exist or is empty
if (!fs.existsSync(file) || fs.readFileSync(file, 'utf-8').trim() === '') {
    fs.writeFileSync(file, JSON.stringify({ chatHistories: {} }, null, 2));
}

const adapter = new JSONFile<Data>(file);
const db = new Low(adapter);

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// This endpoint is not used by the latest dashboard, but kept for potential future use.
app.post('/api/analytics', (req, res) => {
  console.log('Analytics event received:', req.body);
  res.status(200).send('Event received');
});

app.get('/api/chatHistory', async (req, res) => {
  try {
    await db.read();
    // If the file is empty or corrupt, db.data might be null
    if (!db.data || !db.data.chatHistories) {
        // Initialize or re-initialize the structure
        db.data = { chatHistories: {} };
        await db.write(); // Write back to ensure file is fixed
    }
    res.json(db.data.chatHistories);
  } catch (error) {
    console.error('Error reading chat history:', error);
    res.status(500).json({ error: 'Internal Server Error: Could not read chat history.' });
  }
});

app.post('/api/chatHistory', async (req, res) => {
  const { email, history } = req.body;
  if (!email || !history) {
    return res.status(400).send('Missing email or history');
  }

  try {
    await db.read();
    if (!db.data) {
        db.data = { chatHistories: {} };
    }
    db.data.chatHistories[email] = history;
    await db.write();
    res.status(200).send('Chat history saved');
  } catch (error) {
    console.error('Error saving chat history:', error);
    res.status(500).json({ error: 'Internal Server Error: Could not save chat history.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
