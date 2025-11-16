
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { onRequest } from "firebase-functions/v2/https";

// Initialize Firebase Admin SDK
initializeApp();
const db = getFirestore();

// Define a single HTTPS function that acts as an API gateway
export const api = onRequest(async (req, res) => {
    // Enable CORS for all origins - This is open for simplicity, but for a real app, you'd want to restrict it.
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS requests for CORS
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }
    
    // --- Basic Routing ---
    // The path will be whatever comes after the domain, including the /api prefix from the rewrite rule.
    if (req.path === '/api/chatHistory') {
        if (req.method === 'GET') {
            try {
                const snapshot = await db.collection('chatHistories').get();
                if (snapshot.empty) {
                    res.status(200).json({});
                    return;
                }
                const allHistories: Record<string, any> = {};
                snapshot.forEach(doc => {
                    allHistories[doc.id] = doc.data().history || []; // Ensure history is at least an empty array
                });
                res.status(200).json(allHistories);
            } catch (error) {
                console.error("[GET /api/chatHistory] Error fetching data from Firestore:", error);
                res.status(500).send("Internal Server Error: Could not fetch chat history.");
            }

        } else if (req.method === 'POST') {
            try {
                const { email, history } = req.body;
                if (!email || !Array.isArray(history)) {
                    res.status(400).send("Bad Request: Missing 'email' or 'history' (must be an array).");
                    return;
                }
                // Use the user's email as the document ID for simplicity
                const docRef = db.collection('chatHistories').doc(email);
                await docRef.set({ history }, { merge: true }); // Use merge to avoid overwriting other fields if any
                res.status(200).send("Chat history saved successfully.");
            } catch (error) {
                console.error("[POST /api/chatHistory] Error saving data to Firestore:", error);
                res.status(500).send("Internal Server Error: Could not save chat history.");
            }
        } else {
            res.setHeader('Allow', 'GET, POST, OPTIONS');
            res.status(405).send('Method Not Allowed');
        }
    } else {
        // Handle any other paths that are not found under the /api route
        res.status(404).send(`Not Found: The path '${req.path}' does not exist on this server.`);
    }
});
