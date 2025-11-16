import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import Header from './components/Header';
import ChatInput from './components/ChatInput';
import ChatMessage from './components/ChatMessage';
import { Message, Role, Source } from './types';
import { SYSTEM_INSTRUCTION } from './constants';
import AIAvatar from './components/AIAvatar';

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
              <AIAvatar />
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