import React, { useState, useEffect } from 'react';
import { Message, Role } from '../types';

interface AdminDashboardProps {
    onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    const [chatHistory, setChatHistory] = useState<Message[]>([]);

    useEffect(() => {
        const storedHistory = localStorage.getItem('chatHistory');
        if (storedHistory) {
            setChatHistory(JSON.parse(storedHistory));
        }
    }, []);

    const generateXml = (history: Message[]): string => {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<chatHistory>\n';
        history.forEach(msg => {
            // Filter out the initial welcome message from exports
            if (msg.id === 'welcome-0') return;

            xml += `  <message id="${msg.id}" role="${msg.role}">\n`;
            xml += `    <content><![CDATA[${msg.content}]]></content>\n`;
            xml += `  </message>\n`;
        });
        xml += '</chatHistory>';
        return xml;
    };

    const handleDownload = () => {
        const xmlString = generateXml(chatHistory);
        const blob = new Blob([xmlString], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'chat_history.xml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    
    const totalMessages = chatHistory.filter(m => m.id !== 'welcome-0').length;
    const userMessages = chatHistory.filter(m => m.role === Role.USER).length;
    const modelMessages = totalMessages - userMessages;

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <header className="bg-gray-800/50 backdrop-blur-sm p-4 border-b border-gray-700 shadow-lg sticky top-0 z-10">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <h1 className="text-xl font-bold">Admin Dashboard</h1>
                    <button
                        onClick={onLogout}
                        className="bg-red-600 text-white font-semibold rounded-lg px-4 py-2 text-sm transition-all duration-200 ease-in-out enabled:hover:bg-red-500 enabled:active:scale-95"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="p-4 md:p-6 max-w-4xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4">Usage Analytics</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                        <h3 className="text-gray-400 text-sm font-medium">Total Messages</h3>
                        <p className="text-3xl font-bold">{totalMessages}</p>
                    </div>
                     <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                        <h3 className="text-gray-400 text-sm font-medium">User Queries</h3>
                        <p className="text-3xl font-bold">{userMessages}</p>
                    </div>
                     <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                        <h3 className="text-gray-400 text-sm font-medium">Model Responses</h3>
                        <p className="text-3xl font-bold">{modelMessages}</p>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Chat History</h2>
                    <button
                        onClick={handleDownload}
                        disabled={chatHistory.length <= 1}
                        className="bg-pink-600 text-white font-semibold rounded-lg px-5 py-2 transition-all duration-200 ease-in-out enabled:hover:bg-pink-500 enabled:active:scale-95 disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        Download XML
                    </button>
                </div>

                <div className="bg-gray-800 rounded-lg border border-gray-700 max-h-[60vh] overflow-y-auto">
                    <div className="p-4 space-y-4">
                        {chatHistory.length > 1 ? (
                            chatHistory.map(msg => (
                                msg.id !== 'welcome-0' && (
                                    <div key={msg.id} className={`p-3 rounded-lg ${msg.role === Role.USER ? 'bg-purple-800/50' : 'bg-gray-700/50'}`}>
                                        <p className="text-sm font-bold capitalize text-pink-400">{msg.role}</p>
                                        <p className="whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                )
                            ))
                        ) : (
                            <p className="text-gray-400 text-center py-8">No chat history found for this browser session.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
