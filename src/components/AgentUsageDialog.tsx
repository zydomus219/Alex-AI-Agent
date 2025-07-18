
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Mic, Phone, PhoneCall, Send, MicOff } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { Agent } from '@/hooks/useAgents';
import { queryAgentResponse } from '@/services/contentExtractor';

interface AgentUsageDialogProps {
  agent: Agent | null;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

export const AgentUsageDialog = ({ agent, isOpen, onClose }: AgentUsageDialogProps) => {
  const [mode, setMode] = useState<'selection' | 'voice' | 'chat'>('selection');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  if (!agent) return null;

  const handleVoiceCall = () => {
    setMode('voice');
    toast({
      title: "Voice Call Started",
      description: `Voice conversation with ${agent.name} is now active`,
    });
    
    // Add initial greeting message
    const greetingMessage: Message = {
      id: Date.now().toString(),
      text: agent.prompt_content?.split('\n')[0] || `Hello! I'm ${agent.name}, your AI assistant. How can I help you today?`,
      sender: 'agent',
      timestamp: new Date(),
    };
    setMessages([greetingMessage]);
  };

  const handleTextChat = () => {
    setMode('chat');
    toast({
      title: "Chat Started",
      description: `Text conversation with ${agent.name} is now active`,
    });
    
    // Add initial greeting message
    const greetingMessage: Message = {
      id: Date.now().toString(),
      text: agent.prompt_content?.split('\n')[0] || `Hello! I'm ${agent.name}, your AI assistant. How can I help you today?`,
      sender: 'agent',
      timestamp: new Date(),
    };
    setMessages([greetingMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // // Simulate agent response
    // setTimeout(() => {
    //   const agentResponse: Message = {
    //     id: (Date.now() + 1).toString(),
    //     text: `Thank you for your message. I'm ${agent.name} and I'm here to help you based on my knowledge from "${agent.name}" knowledge base. How can I assist you further?`,
    //     sender: 'agent',
    //     timestamp: new Date(),
    //   };
    //   setMessages(prev => [...prev, agentResponse]);
    // }, 1000);

    try {
      const response = await queryAgentResponse({ agentId: agent.id, message: userMessage.text });
      if (response.success && response.response) {
        const agentResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: response.response,
          sender: 'agent',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, agentResponse]);
      } else {
        toast({
          title: 'Agent Error',
          description: response.error || 'Failed to get agent response.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Agent Error',
        description: error.message || 'Failed to get agent response.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartListening = () => {
    setIsListening(true);
    toast({
      title: "Listening",
      description: "Speak now, I'm listening...",
    });

    // Simulate listening for 3 seconds
    setTimeout(() => {
      setIsListening(false);
      const userMessage: Message = {
        id: Date.now().toString(),
        text: "Hello, can you help me with my question?",
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);

      // Simulate agent voice response
      setTimeout(() => {
        setIsSpeaking(true);
        const agentResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: `Of course! I'm ${agent.name} and I'd be happy to help you. What would you like to know?`,
          sender: 'agent',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, agentResponse]);

        // Stop speaking after 2 seconds
        setTimeout(() => {
          setIsSpeaking(false);
        }, 2000);
      }, 500);
    }, 3000);
  };

  const handleClose = () => {
    setMode('selection');
    setMessages([]);
    setInputMessage('');
    setIsListening(false);
    setIsSpeaking(false);
    onClose();
  };

  const renderSelectionMode = () => (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{agent.name}</CardTitle>
            <div className="flex gap-2">
              <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                {agent.status}
              </Badge>
              <Badge variant="outline">
                {agent.type}
              </Badge>
            </div>
          </div>
          <CardDescription>{agent.description || 'No description'}</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-3">
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={handleVoiceCall}>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 rounded-lg bg-blue-500/10">
              <Mic className="w-6 h-6 text-blue-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Voice Call</h3>
              <p className="text-sm text-muted-foreground">
                Start a voice conversation with your AI agent
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={handleTextChat}>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 rounded-lg bg-green-500/10">
              <MessageSquare className="w-6 h-6 text-green-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Text Chat</h3>
              <p className="text-sm text-muted-foreground">
                Have a text-based conversation with your AI agent
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleClose}>
          Cancel
        </Button>
      </div>
    </>
  );

  const renderVoiceMode = () => (
    <div className="space-y-4">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          {agent.type === 'inbound' ? (
            <Phone className="w-5 h-5" />
          ) : (
            <PhoneCall className="w-5 h-5" />
          )}
          <h3 className="font-semibold">Voice Call with {agent.name}</h3>
        </div>
        <Badge variant={isListening ? 'default' : isSpeaking ? 'secondary' : 'outline'}>
          {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Ready'}
        </Badge>
      </div>

      <ScrollArea className="h-64 border rounded-lg p-4">
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="flex justify-center">
        <Button
          onClick={handleStartListening}
          disabled={isListening || isSpeaking}
          className="w-16 h-16 rounded-full"
          variant={isListening ? "destructive" : "default"}
        >
          {isListening ? (
            <MicOff className="w-6 h-6" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </Button>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setMode('selection')} className="flex-1">
          Back
        </Button>
        <Button variant="destructive" onClick={handleClose} className="flex-1">
          End Call
        </Button>
      </div>
    </div>
  );

  const renderChatMode = () => (
    <div className="space-y-4">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <MessageSquare className="w-5 h-5" />
          <h3 className="font-semibold">Chat with {agent.name}</h3>
        </div>
        <Badge variant="default">Active</Badge>
      </div>

      <ScrollArea className="h-64 border rounded-lg p-4">
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="flex gap-2">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1"
        />
        <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isLoading}>
          <Send className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setMode('selection')} className="flex-1">
          Back
        </Button>
        <Button variant="destructive" onClick={handleClose} className="flex-1">
          End Chat
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {agent.type === 'inbound' ? (
              <Phone className="w-5 h-5" />
            ) : (
              <PhoneCall className="w-5 h-5" />
            )}
            Test Agent: {agent.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {mode === 'selection' && renderSelectionMode()}
          {mode === 'voice' && renderVoiceMode()}
          {mode === 'chat' && renderChatMode()}
        </div>
      </DialogContent>
    </Dialog>
  );
};
