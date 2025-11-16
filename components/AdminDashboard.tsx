import React, { useState, useEffect } from 'react';
import { Message, Role } from '../types';

interface AdminDashboardProps {
    onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    const [allChatHistories, setAllChatHistories] = useState<Record<string, Message[]>>({});

    useEffect(() => {
        const storedHistories = localStorage.getItem('chatHistory');
        if (storedHistories) {
            setAllChatHistories(JSON.parse(storedHistories));
        }
    }, []);

    const generateXml = (histories: Record<string, Message[]>): string => {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<allChatHistory>\n';
        for (const [email, history] of Object.entries(histories)) {
            xml += `  <userChat email="${email}">\n`;
            history.forEach(msg => {
                // Filter out the initial welcome message from exports
                if (msg.id === 'welcome-0') return;

                xml += `    <message id="${msg.id}" role="${msg.role}">\n`;
                xml += `      <content><![CDATA[${msg.content}]]></content>\n`;
                xml += `    </message>\n`;
            });
            xml += `  </userChat>\n`;
        }
        xml += '</allChatHistory>';
        return xml;
    };

    const handleDownload = () => {
        const xmlString = generateXml(allChatHistories);
        const blob = new Blob([xmlString], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'all_chat_history.xml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    
    const allMessages = Object.values(allChatHistories).flat();
    const totalMessages = allMessages.filter(m => m.id !== 'welcome-0').length;
    const userMessages = allMessages.filter(m => m.role === Role.USER).length;
    const modelMessages = totalMessages - userMessages;
    const totalUsers = Object.keys(allChatHistories).length;

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <header className="bg-gray-800/50 backdrop-blur-sm p-4 border-b border-gray-700 shadow-lg sticky top-0 z-10">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <h1 className="text-xl font-bold">Admin Dashboard</h1>
                    <button
                        onClick={onLogout}
                        className="bg-red-600 text-white font-semibold rounded-lg px-4 py-2 text-sm transition-all duration-200 ease-in-out enabled:hover:bg-red-500 enabled:active:scale-95"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="p-4 md:p-6 max-w-6xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4">Usage Analytics</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                        <h3 className="text-gray-400 text-sm font-medium">Total Users</h3>
                        <p className="text-3xl font-bold">{totalUsers}</p>
                    </div>
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
                    <h2 className="text-2xl font-semibold">All User Chat History</h2>
                    <button
                        onClick={handleDownload}
                        disabled={Object.keys(allChatHistories).length === 0}
                        className="bg-pink-600 text-white font-semibold rounded-lg px-5 py-2 transition-all duration-200 ease-in-out enabled:hover:bg-pink-500 enabled:active:scale-95 disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        Download All as XML
                    </button>
                </div>

                <div className="bg-gray-800 rounded-lg border border-gray-700 max-h-[60vh] overflow-y-auto">
                    <div className="p-4 space-y-6">
                        {Object.keys(allChatHistories).length > 0 ? (
                           Object.entries(allChatHistories).map(([email, history]) => (
                                <div key={email} className="border border-gray-700 rounded-lg p-4">
                                    <h3 className="text-md font-semibold text-amber-300/90 pb-2 mb-3 border-b border-gray-600/50">
                                        User: <span className="font-normal text-gray-300">{email}</span>
                                    </h3>
                                    <div className="space-y-3">
                                        {history.map(msg => (
                                            msg.id !== 'welcome-0' && (
                                                <div key={msg.id} className={`p-3 rounded-lg ${msg.role === Role.USER ? 'bg-purple-800/50' : 'bg-gray-700/50'}`}>
                                                    <p className="text-xs font-bold capitalize text-pink-400 mb-1">{msg.role}</p>
                                                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                           ))
                        ) : (
                            <p className="text-gray-400 text-center py-8">No chat history found in this browser.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;