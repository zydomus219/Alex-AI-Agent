import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useKnowledgeBases } from '@/hooks/useKnowledgeBases';
import { Bot, Plus, Phone, PhoneCall, MessageSquare, Settings, Play } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  description: string;
  type: 'inbound' | 'outbound';
  knowledgeBaseId: string;
  knowledgeBaseName: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

const Agents = () => {
  const { toast } = useToast();
  const { knowledgeBases } = useKnowledgeBases();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newAgent, setNewAgent] = useState({
    name: '',
    description: '',
    type: 'inbound' as 'inbound' | 'outbound',
    knowledgeBaseId: '',
  });

  const handleCreateAgent = () => {
    if (!newAgent.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter an agent name",
        variant: "destructive",
      });
      return;
    }

    if (!newAgent.knowledgeBaseId) {
      toast({
        title: "Error",
        description: "Please select a knowledge base",
        variant: "destructive",
      });
      return;
    }

    const knowledgeBase = knowledgeBases.find(kb => kb.id === newAgent.knowledgeBaseId);
    if (!knowledgeBase) return;

    const agent: Agent = {
      id: Date.now().toString(),
      name: newAgent.name,
      description: newAgent.description,
      type: newAgent.type,
      knowledgeBaseId: newAgent.knowledgeBaseId,
      knowledgeBaseName: knowledgeBase.name,
      status: 'active',
      createdAt: new Date(),
    };

    setAgents(prev => [...prev, agent]);
    setNewAgent({
      name: '',
      description: '',
      type: 'inbound',
      knowledgeBaseId: '',
    });
    setIsCreateDialogOpen(false);

    toast({
      title: "Success",
      description: "Agent created successfully",
    });
  };

  const handleUseAgent = (agent: Agent) => {
    // For now, just show a success message
    toast({
      title: "Agent Activated",
      description: `${agent.name} is now ready to use`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Agents</h1>
          <p className="text-muted-foreground">Create and manage your AI agents trained on your knowledge bases</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Agent
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Agent</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="agent-name">Agent Name</Label>
                <Input
                  id="agent-name"
                  value={newAgent.name}
                  onChange={(e) => setNewAgent(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter agent name"
                />
              </div>
              <div>
                <Label htmlFor="agent-description">Description</Label>
                <Textarea
                  id="agent-description"
                  value={newAgent.description}
                  onChange={(e) => setNewAgent(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this agent does"
                />
              </div>
              <div>
                <Label htmlFor="agent-type">Agent Type</Label>
                <Select value={newAgent.type} onValueChange={(value: 'inbound' | 'outbound') => setNewAgent(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inbound">Inbound (Receives calls/messages)</SelectItem>
                    <SelectItem value="outbound">Outbound (Makes calls/messages)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="knowledge-base">Knowledge Base</Label>
                <Select value={newAgent.knowledgeBaseId} onValueChange={(value) => setNewAgent(prev => ({ ...prev, knowledgeBaseId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a knowledge base" />
                  </SelectTrigger>
                  <SelectContent>
                    {knowledgeBases.map((kb) => (
                      <SelectItem key={kb.id} value={kb.id}>{kb.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateAgent}>
                  Create Agent
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {agents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bot className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No agents yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first AI agent to start automating conversations with your knowledge base
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Create Your First Agent
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <Card key={agent.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      {agent.type === 'inbound' ? (
                        <Phone className="w-4 h-4 text-primary" />
                      ) : (
                        <PhoneCall className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                      {agent.status}
                    </Badge>
                  </div>
                  <Badge variant="outline">
                    {agent.type}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{agent.name}</CardTitle>
                <CardDescription>{agent.description || 'No description'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageSquare className="w-4 h-4" />
                    <span>Knowledge: {agent.knowledgeBaseName}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Created: {agent.createdAt.toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 gap-2"
                      onClick={() => handleUseAgent(agent)}
                    >
                      <Play className="w-4 h-4" />
                      Use Now
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Agents;