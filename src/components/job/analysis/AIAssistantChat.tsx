import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Bot, Send, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

interface AIAssistantChatProps {
  jobTitle: string;
  matchScore: number;
  matchedKeywords: Array<{ keyword: string; priority: string }>;
  missingKeywords: Array<{ keyword: string; priority: string }>;
}

export function AIAssistantChat({ 
  jobTitle, 
  matchScore, 
  matchedKeywords, 
  missingKeywords 
}: AIAssistantChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-job-chat', {
        body: {
          message: userMessage,
          context: {
            jobTitle,
            matchScore,
            matchedKeywords: matchedKeywords.map(k => `${k.keyword} (${k.priority} priority)`),
            missingKeywords: missingKeywords.map(k => `${k.keyword} (${k.priority} priority)`)
          }
        }
      });

      if (error) throw error;

      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error in AI chat:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[400px] bg-white rounded-lg border">
      <div className="px-4 py-3 border-b">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-500" />
          AI Assistant
        </h3>
        <p className="text-sm text-slate-500">
          Ask questions about the analysis or get personalized suggestions
        </p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex gap-2 ${
                message.role === 'assistant' ? 'items-start' : 'items-start flex-row-reverse'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'assistant' ? 'bg-blue-100' : 'bg-slate-100'
                }`}
              >
                {message.role === 'assistant' ? (
                  <Bot className="h-4 w-4 text-blue-500" />
                ) : (
                  <User className="h-4 w-4 text-slate-500" />
                )}
              </div>
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'assistant'
                    ? 'bg-blue-50 text-slate-700'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {messages.length === 0 && (
            <div className="text-center text-slate-500 py-8">
              No messages yet. Ask a question about the job analysis!
            </div>
          )}
        </div>
      </ScrollArea>

      <Separator />

      <div className="p-4 flex gap-2">
        <Input
          placeholder="Ask about the analysis or get suggestions..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          disabled={isLoading}
        />
        <Button
          onClick={handleSendMessage}
          disabled={isLoading || !input.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}