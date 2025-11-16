
import express from 'express';
import { Low, JSONFile } from 'lowdb';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const file = join(__dirname, 'db.json');

// Define the structure of the database
interface Data {
  chatHistories: { [email: string]: any[] };
}

const adapter = new JSONFile<Data>(file);
const db = new Low(adapter);

const initializeDb = async () => {
    await db.read();
    if (!db.data) {
        db.data = { chatHistories: {} };
        await db.write();
    }
};

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.post('/api/analytics', (req, res) => {
  console.log('Analytics event received:', req.body);
  res.status(200).send('Event received');
});

app.get('/api/chatHistory', async (req, res) => {
    await db.read();
    res.json(db.data?.chatHistories || {});
});

app.post('/api/chatHistory', async (req, res) => {
    const { email, history } = req.body;
    if (!email || !history) {
        return res.status(400).send('Missing email or history');
    }

    await db.read();
    if (!db.data) {
        db.data = { chatHistories: {} };
    }
    db.data.chatHistories[email] = history;
    await db.write();

    res.status(200).send('Chat history saved');
});

const start = async () => {
    try {
        await initializeDb();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start the server:', error);
    }
};

start();
