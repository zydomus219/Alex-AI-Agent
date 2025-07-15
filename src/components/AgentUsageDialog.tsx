
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Mic, Phone, PhoneCall } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { Agent } from '@/hooks/useAgents';

interface AgentUsageDialogProps {
  agent: Agent | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AgentUsageDialog = ({ agent, isOpen, onClose }: AgentUsageDialogProps) => {
  const [usageMode, setUsageMode] = useState<'voice' | 'chat' | null>(null);
  const { toast } = useToast();

  if (!agent) return null;

  const handleVoiceCall = () => {
    toast({
      title: "Voice Call Initiated",
      description: `Starting voice call with ${agent.name}`,
    });
    // Here you would integrate with your voice calling service
    console.log('Starting voice call with agent:', agent);
  };

  const handleTextChat = () => {
    toast({
      title: "Chat Started",
      description: `Opening chat with ${agent.name}`,
    });
    // Here you would navigate to or open a chat interface
    console.log('Starting text chat with agent:', agent);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {agent.type === 'inbound' ? (
              <Phone className="w-5 h-5" />
            ) : (
              <PhoneCall className="w-5 h-5" />
            )}
            Use Agent: {agent.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
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
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
