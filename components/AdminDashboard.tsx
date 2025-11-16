
import React, { useState, useEffect, useMemo } from 'react';
import { Message, Role } from '../types';
import AIAvatar from './AIAvatar';

interface AdminDashboardProps {
    onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    const [chatData, setChatData] = useState<Record<string, Message[]>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            const response = await fetch('/api/chatHistory');
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.statusText}`);
            }
            const data = await response.json();
            setChatData(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Set up polling to refresh data every 15 seconds
        const interval = setInterval(fetchData, 15000);
        return () => clearInterval(interval);
    }, []);

    const analytics = useMemo(() => {
        const allMessages = Object.values(chatData).flat().filter(m => m.id !== 'welcome-0');
        const userMessages = allMessages.filter(m => m.role === Role.USER);
        const modelResponses = allMessages.filter(m => m.role === Role.MODEL);
        const userList = Object.keys(chatData);

        return {
            totalUsers: userList.length,
            totalMessages: allMessages.length,
            totalUserMessages: userMessages.length,
            totalModelResponses: modelResponses.length,
            users: userList.map(email => ({
                email,
                messageCount: (chatData[email] || []).filter(m => m.id !== 'welcome-0').length,
            })).sort((a, b) => b.messageCount - a.messageCount),
        };
    }, [chatData]);

    const handleDownload = () => {
        try {
            const jsonString = JSON.stringify(chatData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'all_chat_history.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (downloadError) {
            console.error("Failed to generate download:", downloadError);
            setError("Could not prepare file for download.");
        }
    };

    const StatCard = ({ title, value }: { title: string, value: string | number }) => (
        <div className="bg-brand-med-dark p-5 rounded-lg border border-brand-border shadow-md">
            <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
            <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
    );

    const UserChatHistory = ({ email, history }: { email: string, history: Message[] }) => (
        <div className="bg-brand-med-dark/50 p-4 rounded-lg mt-6 border border-brand-border">
            <div className="flex justify-between items-center mb-4">
                 <h3 className="text-lg font-semibold text-amber-300/90">
                    Chat History for <span className="font-normal text-gray-300">{email}</span>
                </h3>
                <button 
                    onClick={() => setSelectedUser(null)}
                    className='text-gray-400 hover:text-white transition-colors'
                >✖</button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4">
                {history.filter(msg => msg.id !== 'welcome-0').map(msg => (
                    <div key={msg.id} className={`flex items-start gap-3 ${msg.role === Role.USER ? 'justify-end' : ''}`}>
                        {msg.role === Role.MODEL && <AIAvatar />}
                        <div className={`max-w-lg p-3 rounded-lg text-sm ${msg.role === Role.USER ? 'bg-purple-800/60 rounded-br-none' : 'bg-brand-med rounded-tl-none'}`}>
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                    </div>
                ))}
                 {history.filter(msg => msg.id !== 'welcome-0').length === 0 && <p className='text-center text-gray-400 py-4'>No conversation history for this user yet.</p>}
            </div>
        </div>
    );

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen bg-brand-dark text-white">Loading Dashboard...</div>;
    }

    if (error) {
        return <div className="flex items-center justify-center min-h-screen bg-brand-dark text-red-400">Error: {error}</div>;
    }

    return (
        <div className="min-h-screen bg-brand-dark text-white font-sans">
            <header className="bg-brand-med-dark/50 backdrop-blur-sm p-4 border-b border-brand-border shadow-lg sticky top-0 z-20">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <h1 className="text-xl font-bold">Administrator Dashboard</h1>
                    <div className='flex items-center gap-4'>
                        <button
                            onClick={handleDownload}
                            disabled={analytics.totalUsers === 0}
                            className="bg-pink-600 text-white font-semibold rounded-lg px-4 py-2 text-sm transition-all duration-200 ease-in-out enabled:hover:bg-pink-500 enabled:active:scale-95 disabled:bg-brand-light disabled:cursor-not-allowed"
                        >
                            Download History (JSON)
                        </button>
                        <button
                            onClick={onLogout}
                            className="bg-red-600 text-white font-semibold rounded-lg px-4 py-2 text-sm transition-all duration-200 ease-in-out enabled:hover:bg-red-500 enabled:active:scale-95"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="p-4 md:p-6 max-w-7xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4">Usage Analytics</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard title="Total Users" value={analytics.totalUsers} />
                    <StatCard title="Total Messages" value={analytics.totalMessages} />
                    <StatCard title="User Queries" value={analytics.totalUserMessages} />
                    <StatCard title="Model Responses" value={analytics.totalModelResponses} />
                </div>

                {selectedUser ? (
                    <UserChatHistory email={selectedUser} history={chatData[selectedUser]} />
                ) : (
                    <div className="bg-brand-med-dark rounded-lg border border-brand-border shadow-md">
                        <h2 className="text-xl font-semibold p-4 border-b border-brand-border">User Activity</h2>
                        <div className="max-h-[60vh] overflow-y-auto">
                             <table className="w-full text-left">
                                <thead className='sticky top-0 bg-brand-med-dark/80 backdrop-blur-sm'>
                                    <tr>
                                        <th className="p-4 font-semibold">User Email</th>
                                        <th className="p-4 font-semibold text-right">Messages Sent</th>
                                        <th className="p-4 font-semibold text-center">View History</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analytics.users.length > 0 ? analytics.users.map(user => (
                                        <tr key={user.email} className='border-t border-brand-border/50 hover:bg-brand-med/30'>
                                            <td className="p-4">{user.email}</td>
                                            <td className="p-4 text-right">{user.messageCount}</td>
                                            <td className="p-4 text-center">
                                                <button onClick={() => setSelectedUser(user.email)} className='text-pink-400 hover:underline text-sm'>
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={3} className="text-center p-8 text-gray-400">No user data available yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
