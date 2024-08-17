import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from 'react-markdown';


interface ChatMessage {
  user: 'You' | 'Mint';
  message: string;
}

const AIFinancialAssistant: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [aiChatHistory, setAiChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [aiChatHistory]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);
    const newMessage: ChatMessage = { user: 'You', message: input };
    setAiChatHistory(prev => [...prev, newMessage]);
    setInput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const { result } = await response.json();
      console.log(result.data[0])
      const aiReply: ChatMessage = { user: 'Mint', message: result.data[0] };
      setAiChatHistory(prev => [...prev, aiReply]);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to get a response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="col-span-2 max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">AI Financial Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea 
          className="h-[400px] mb-4 p-4 border rounded bg-dotted-pattern"
          ref={scrollAreaRef}
        >
          {aiChatHistory.map((chat, index) => (
            <div 
              key={index} 
              className={`mb-4 p-3 rounded-lg ${
                chat.user === 'You' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
              } max-w-[80%] ${chat.user === 'You' ? 'text-right' : 'text-left'}`}
            >
              <p className="font-semibold mb-1">{chat.user}</p>
              <p className="prose">
                <ReactMarkdown>{chat.message}</ReactMarkdown></p>
            </div>
          ))}
          {isLoading && (
            <div className="text-center text-gray-500">
              Mint is thinking...
            </div>
          )}
          {error && (
            <div className="text-center text-red-500">
              {error}
            </div>
          )}
        </ScrollArea>
        <div className="flex">
          <Input
            placeholder="Ask a financial question..."
            className="flex-grow mr-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIFinancialAssistant;