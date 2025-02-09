import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';

// Configuration
const GEMINI_API_KEY = 'AIzaSyClCr9EtBT38guEq0uEc7UE9A-BLva3MQA';
const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Message formatting function
const formatMessageContent = (content) => {
  let lines = content.split('\n');
  
  lines = lines.map(line => {
    line = line.replace(/\*\*\s*(.*?)\s*:\s*\*\*/g, '\n** $1: **\n');
    line = line.replace(/\*\s*([^*]+)/g, '* $1\n');
    line = line.replace(/\*{2,}/g, '**');
    return line;
  });
  
  return lines.join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ ]+/g, ' ')
    .trim();
};

const GeminiChatbot = ({ 
  assistantName = 'AI Assistant', 
  placeholder = 'Ask me anything...',
  initialPrompt = 'You are a helpful AI assistant. Respond concisely and helpfully.',
  model = 'gemini-pro'
}) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const callGeminiAPI = async (conversationHistory) => {
    try {
      const formattedMessages = conversationHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: initialPrompt }] },
            ...formattedMessages
          ],
          generationConfig: {
            maxOutputTokens: 300,
            temperature: 0.7,
            topP: 1
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${await response.text()}`);
      }

      const data = await response.json();
      return formatMessageContent(data.candidates[0].content.parts[0].text.trim());
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return 'Sorry, there was an error processing your request.';
    }
  };

  const handleSendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const formattedInput = formatMessageContent(trimmedInput);
    const newUserMessage = { role: 'user', content: formattedInput };
    const updatedMessages = [...messages, newUserMessage];

    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await callGeminiAPI(updatedMessages);
      setMessages(prevMessages => [
        ...prevMessages, 
        { role: 'assistant', content: aiResponse }
      ]);
    } catch (error) {
      setMessages(prevMessages => [
        ...prevMessages, 
        { role: 'assistant', content: 'Sorry, I encountered an error.' }
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto h-[600px] bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Bot className="w-6 h-6 text-green-500" />
          <h2 className="text-lg font-semibold text-gray-800">{assistantName}</h2>
        </div>
      </div>

      {/* Chat Messages Area with Custom Scrollbar */}
      <div className="flex-grow overflow-y-auto px-6 py-4 space-y-6 custom-scrollbar">
        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #c2c2c2;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
          }
        `}</style>
        
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex items-start space-x-3 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="flex-shrink-0 rounded-full bg-green-100 p-2">
                <Bot className="w-5 h-5 text-green-600" />
              </div>
            )}
            <div 
              className={`px-4 py-3 rounded-2xl max-w-[85%] whitespace-pre-wrap shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div className="flex-shrink-0 rounded-full bg-blue-100 p-2">
                <User className="w-5 h-5 text-blue-600" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start items-center space-x-3">
            <div className="flex-shrink-0 rounded-full bg-green-100 p-2">
              <Bot className="w-5 h-5 text-green-600" />
            </div>
            <div className="bg-gray-100 px-4 py-3 rounded-2xl text-gray-600">
              Typing...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-xl">
        <div className="flex items-center space-x-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            className="flex-grow resize-none rounded-xl border border-gray-200 p-3 max-h-24 overflow-y-auto focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            rows={1}
          />
          <button 
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-green-500 text-white p-3 rounded-xl disabled:opacity-50 hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeminiChatbot;