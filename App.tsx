import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import Header from './components/Header';
import ChatInput from './components/ChatInput';
import ChatMessage from './components/ChatMessage';
import { Message, Role, Source } from './types';
import { SYSTEM_INSTRUCTION } from './constants';

const welcomeMessage: Message = {
  id: 'welcome-0',
  role: Role.MODEL,
  content: "Get Simple, Straight Answers\nto Complex Legal Challenges \n\nHello! I'm Matt, an AI guru with a strong legal research background.\n\nI'll search and compile insightful legal info on ANY QUESTION, sourcing my answers from Kenyan Case Law, Acts of parliament and published articles."
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<Chat | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [sourcesByMsgId, setSourcesByMsgId] = useState<Record<string, Source[]>>({});


  const initChat = useCallback(() => {
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        throw new Error("API_KEY environment variable not set.");
      }
      const ai = new GoogleGenAI({ apiKey });
      const chatInstance = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          tools: [{googleSearch: {}}],
        },
      });
      chatRef.current = chatInstance;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred during initialization.');
      console.error(e);
    }
  }, []);

  useEffect(() => {
    initChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (userMessage: string) => {
    if (!chatRef.current) {
      setError('Chat is not initialized.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    const userMsgId = Date.now().toString();
    const modelMsgId = (Date.now() + 1).toString();

    setMessages((prev) => [
        ...prev,
        { id: userMsgId, role: Role.USER, content: userMessage },
    ]);

    // Add a placeholder for the streaming response
    setMessages((prev) => [
      ...prev,
      { id: modelMsgId, role: Role.MODEL, content: '' },
    ]);

    const currentSources: Source[] = [];
    const sourceUris = new Set<string>();

    try {
      const stream = await chatRef.current.sendMessageStream({ message: userMessage });

      for await (const chunk of stream) {
        const chunkText = chunk.text;

        const groundingChunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (groundingChunks) {
            for (const c of groundingChunks) {
                if (c.web && c.web.uri && !sourceUris.has(c.web.uri)) {
                    const newSource = { uri: c.web.uri, title: c.web.title || c.web.uri };
                    currentSources.push(newSource);
                    sourceUris.add(newSource.uri);
                }
            }
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === modelMsgId
              ? { ...msg, content: msg.content + chunkText }
              : msg
          )
        );
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
      console.error(e);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === modelMsgId
            ? { ...msg, content: `Sorry, something went wrong: ${errorMessage}` }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      if (currentSources.length > 0) {
        setSourcesByMsgId(prev => ({ ...prev, [modelMsgId]: currentSources }));
      }
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} sources={sourcesByMsgId[msg.id]} />
          ))}
           {isLoading && messages[messages.length - 1]?.role === Role.MODEL && messages[messages.length - 1]?.content === '' && (
            <div className="flex items-start gap-4 my-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-400" viewBox="0 0 24 24" fill="currentColor">
                     <path d="M12.753 1.558a1.5 1.5 0 00-1.506 0l-8.25 4.512A1.5 1.5 0 002 7.58v1.948c0 .414.336.75.75.75h.346c.219.001.435.03.647.087a2.33 2.33 0 011.698 1.54l.953 3.811c.21 1.053 1.11 1.832 2.18 1.832h2.848c1.07 0 1.97-.78 2.18-1.832l.954-3.811a2.33 2.33 0 011.698-1.54c.212-.056.428-.086.647-.087h.346a.75.75 0 00.75-.75V7.58c0-.712-.52-1.338-1.247-1.51L12.753 1.558zM12 8.25a.75.75 0 00-.75.75v3a.75.75 0 001.5 0v-3a.75.75 0 00-.75-.75z" />
                     <path fillRule="evenodd" d="M1 15.75c0-1.06.75-2.054 1.82-2.39a2.25 2.25 0 012.336 1.107l.25.501a2.25 2.25 0 004.188 0l.25-.501a2.25 2.25 0 012.336-1.107c1.07.336 1.82 1.33 1.82 2.39 0 .964-.626 1.82-1.532 2.18a24.819 24.819 0 01-14.936 0C1.626 17.57 1 16.714 1 15.75zm12 .02a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008zm-3.75-.75a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75v-.008a.75.75 0 00-.75-.75h-.008z" clipRule="evenodd" />
                  </svg>
              </div>
              <div className="max-w-xl p-4 rounded-2xl bg-gray-700 text-gray-200 rounded-tl-none">
                <div className="flex items-center space-x-2">
                    <span className="h-2 w-2 bg-pink-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-pink-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-pink-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="text-red-400 bg-red-900/50 p-3 rounded-lg text-center">{error}</div>
          )}
        </div>
      </main>
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default App;