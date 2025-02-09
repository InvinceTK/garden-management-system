import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GeminiChatbot from './chatbot';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 rounded-full bg-green-600 hover:bg-green-500 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col w-96 h-[39rem] bg-white rounded-lg shadow-xl">
      {/* Single Header */}
      
       <div className="flex justify-end w-full">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="hover:bg-gray-50 flex align-end text-gray-400"
        >
          <X className="w-4 h-4" />
        </Button>
        </div>
      

      {/* Chat Area with Hidden Scrollbar */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <GeminiChatbot
            assistantName="Garden Assistant"
            initialPrompt="You are a plant management system guide and give the answers in properly spaced format."
            placeholder="Ask about your garden..."
          />
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;