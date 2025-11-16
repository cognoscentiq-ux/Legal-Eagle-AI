
import React, { useState, useEffect } from 'react';

const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [chatData, setChatData] = useState<Record<string, any>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/chatHistory');
            if (!response.ok) {
                throw new Error(`Failed to fetch data. Server responded with ${response.status}.`);
            }
            const data = await response.json();
            setChatData(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-brand-dark text-white font-sans p-4">
            <header className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <button
                    onClick={onLogout}
                    className="bg-red-600 text-white font-semibold rounded-lg px-4 py-2 text-sm"
                >
                    Logout
                </button>
            </header>

            {isLoading && <p>Loading...</p>}
            {error && <p className="text-red-400">{error}</p>}

            <div className="bg-brand-med-dark p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Chat History (JSON)</h2>
                <pre className="whitespace-pre-wrap text-sm">
                    {JSON.stringify(chatData, null, 2)}
                </pre>
            </div>
        </div>
    );
};

export default AdminDashboard;
