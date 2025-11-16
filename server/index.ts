import express from 'express';
import { Low, JSONFile } from 'lowdb';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Correctly handle __dirname in ES modules
const __dirname = dirname(fileURLToPath(import.meta.url));

// Configure lowdb to use JSONFile adapter
const file = join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.post('/api/analytics', (req, res) => {
  console.log('Analytics event received:', req.body);
  res.status(200).send('Event received');
});

// New endpoints for chat history
app.get('/api/chatHistory', async (req, res) => {
  await db.read();
  res.json(db.data.chatHistories);
});

app.post('/api/chatHistory', async (req, res) => {
  const { email, history } = req.body;
  if (!email || !history) {
    return res.status(400).send('Missing email or history');
  }
  
  await db.read();
  db.data.chatHistories[email] = history;
  await db.write();

  res.status(200).send('Chat history saved');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
