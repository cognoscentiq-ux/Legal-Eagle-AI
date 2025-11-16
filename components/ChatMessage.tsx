import React from 'react';
import { Message, Role, Source } from '../types';

interface ChatMessageProps {
  message: Message;
  sources?: Source[];
}

// Basic markdown to HTML renderer
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const renderContent = () => {
        // Bold: **text** -> <strong>text</strong>
        let html = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Italic: *text* -> <em>text</em>
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        // New lines: \n -> <br>
        html = html.replace(/\n/g, '<br />');

        return { __html: html };
    };

    return <div dangerouslySetInnerHTML={renderContent()} />;
};


const ChatMessage: React.FC<ChatMessageProps> = ({ message, sources }) => {
  const isModel = message.role === Role.MODEL;

  // Special handling for the welcome message to apply custom styles
  if (isModel && message.id === 'welcome-0') {
    const [header, ...bodyParts] = message.content.split('\n\n');
    const [line1, line2] = header.trim().split('\n');
    const thirdLine = bodyParts[0];
    const restOfBody = bodyParts.slice(1).join('\n\n');
    
    return (
        <div className={`flex items-start gap-4 my-4`}>
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-400" viewBox="0 0 24 24" fill="currentColor">
               <path d="M12.753 1.558a1.5 1.5 0 00-1.506 0l-8.25 4.512A1.5 1.5 0 002 7.58v1.948c0 .414.336.75.75.75h.346c.219.001.435.03.647.087a2.33 2.33 0 011.698 1.54l.953 3.811c.21 1.053 1.11 1.832 2.18 1.832h2.848c1.07 0 1.97-.78 2.18-1.832l.954-3.811a2.33 2.33 0 011.698-1.54c.212-.056.428-.086.647-.087h.346a.75.75 0 00.75-.75V7.58c0-.712-.52-1.338-1.247-1.51L12.753 1.558zM12 8.25a.75.75 0 00-.75.75v3a.75.75 0 001.5 0v-3a.75.75 0 00-.75-.75z" />
               <path fillRule="evenodd" d="M1 15.75c0-1.06.75-2.054 1.82-2.39a2.25 2.25 0 012.336 1.107l.25.501a2.25 2.25 0 004.188 0l.25-.501a2.25 2.25 0 012.336-1.107c1.07.336 1.82 1.33 1.82 2.39 0 .964-.626 1.82-1.532 2.18a24.819 24.819 0 01-14.936 0C1.626 17.57 1 16.714 1 15.75zm12 .02a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008zm-3.75-.75a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75v-.008a.75.75 0 00-.75-.75h-.008z" clipRule="evenodd" />
            </svg>
          </div>
          <div
            className={`max-w-xl p-4 rounded-2xl text-base leading-relaxed bg-gray-700 text-gray-200 rounded-tl-none`}
          >
            <div className="font-extrabold text-3xl leading-tight">
                <p>{line1}</p>
                <p>{line2}</p>
            </div>
            <div className="mt-4">
                <div className="font-semibold text-lg">
                    <MarkdownRenderer content={thirdLine} />
                </div>
                <div className="mt-4">
                    <MarkdownRenderer content={restOfBody} />
                </div>
            </div>
          </div>
        </div>
    );
  }

  return (
    <div className={`flex items-start gap-4 my-4 ${!isModel ? 'justify-end' : ''}`}>
      {isModel && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-400" viewBox="0 0 24 24" fill="currentColor">
             <path d="M12.753 1.558a1.5 1.5 0 00-1.506 0l-8.25 4.512A1.5 1.5 0 002 7.58v1.948c0 .414.336.75.75.75h.346c.219.001.435.03.647.087a2.33 2.33 0 011.698 1.54l.953 3.811c.21 1.053 1.11 1.832 2.18 1.832h2.848c1.07 0 1.97-.78 2.18-1.832l.954-3.811a2.33 2.33 0 011.698-1.54c.212-.056.428-.086.647-.087h.346a.75.75 0 00.75-.75V7.58c0-.712-.52-1.338-1.247-1.51L12.753 1.558zM12 8.25a.75.75 0 00-.75.75v3a.75.75 0 001.5 0v-3a.75.75 0 00-.75-.75z" />
             <path fillRule="evenodd" d="M1 15.75c0-1.06.75-2.054 1.82-2.39a2.25 2.25 0 012.336 1.107l.25.501a2.25 2.25 0 004.188 0l.25-.501a2.25 2.25 0 012.336-1.107c1.07.336 1.82 1.33 1.82 2.39 0 .964-.626 1.82-1.532 2.18a24.819 24.819 0 01-14.936 0C1.626 17.57 1 16.714 1 15.75zm12 .02a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008zm-3.75-.75a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75v-.008a.75.75 0 00-.75-.75h-.008z" clipRule="evenodd" />
          </svg>
        </div>
      )}
      <div
        className={`max-w-xl p-4 rounded-2xl text-base leading-relaxed ${
          isModel ? 'bg-gray-700 text-gray-200 rounded-tl-none' : 'bg-purple-700 text-white rounded-br-none'
        }`}
      >
        <MarkdownRenderer content={message.content} />
        {isModel && sources && sources.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-600">
            <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Sources</h4>
            <ol className="space-y-1 list-decimal list-inside">
              {sources.map((source, index) => (
                <li key={index} className="text-sm text-pink-400">
                  <a href={source.uri} target="_blank" rel="noopener noreferrer" className="hover:underline" title={source.title}>
                    {source.title || new URL(source.uri).hostname}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;