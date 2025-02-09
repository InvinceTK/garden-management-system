import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import GeminiChatbot from './chatbot';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 rounded-full bg-green-600 hover:bg-green-500 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
      ) : (
        <Card className="w-96 h-[500px] bg-zinc-900 border-green-500/20 shadow-xl relative">
          <div className="absolute top-2 right-2 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="hover:bg-zinc-800"
            >
              <X className="w-5 h-5 text-zinc-400" />
            </Button>
          </div>
          <div className="h-full overflow-hidden">
            <div className="h-full pt-12 px-4">
              <GeminiChatbot
                assistantName="Garden Assistant"
                initialPrompt="You are a plant management system guide and give the answers in properly spaced format."
                placeholder="Ask about your garden..."
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ChatWidget;