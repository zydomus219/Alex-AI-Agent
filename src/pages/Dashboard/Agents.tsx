
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useKnowledgeBases } from '@/hooks/useKnowledgeBases';
import { useAgents } from '@/hooks/useAgents';
import { AgentUsageDialog } from '@/components/AgentUsageDialog';
import { AgentAvatarUpload } from '@/components/AgentAvatarUpload';
import { Bot, Plus, Phone, PhoneCall, MessageSquare, Settings, Play, Upload, Edit, Trash2, User } from 'lucide-react';

const DEFAULT_GREETING_TEMPLATE = `Hello! I'm your AI assistant. I'm here to help you with any questions you might have. How can I assist you today?`;

const DEFAULT_MESSAGE_TEMPLATE = `Thank you for your message. I'm processing your request and will provide you with the most accurate information based on my knowledge base. Please give me a moment to find the best answer for you.`;

const Agents = () => {
  const { toast } = useToast();
  const { knowledgeBases, isLoading: kbLoading } = useKnowledgeBases();
  const { agents, loading, createAgentWithPrompt, updateAgent, deleteAgent } = useAgents();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<any>(null);
  const [usageAgent, setUsageAgent] = useState<any>(null);
  const [newAgent, setNewAgent] = useState({
    name: '',
    description: '',
    type: 'inbound' as 'inbound' | 'outbound',
    knowledge_base_id: '',
    status: 'active' as 'active' | 'inactive',
    avatar_url: null as string | null,
  });
  const [promptData, setPromptData] = useState({
    type: 'manual' as 'manual' | 'pdf',
    greetingPrompt: DEFAULT_GREETING_TEMPLATE,
    messagePrompt: DEFAULT_MESSAGE_TEMPLATE,
    file: null as File | null,
  });

  const handleCreateAgent = async () => {
    if (!newAgent.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter an agent name",
        variant: "destructive",
      });
      return;
    }

    if (!newAgent.knowledge_base_id) {
      toast({
        title: "Error",
        description: "Please select a knowledge base",
        variant: "destructive",
      });
      return;
    }

    try {
      await createAgentWithPrompt(newAgent, promptData);
      resetForm();
      setIsCreateDialogOpen(false);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleUpdateAgent = async () => {
    if (!editingAgent) return;

    try {
      await updateAgent(editingAgent.id, editingAgent);
      setEditingAgent(null);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleDeleteAgent = async (agentId: string) => {
    try {
      await deleteAgent(agentId);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const resetForm = () => {
    setNewAgent({
      name: '',
      description: '',
      type: 'inbound',
      knowledge_base_id: '',
      status: 'active',
      avatar_url: null,
    });
    setPromptData({
      type: 'manual',
      greetingPrompt: DEFAULT_GREETING_TEMPLATE,
      messagePrompt: DEFAULT_MESSAGE_TEMPLATE,
      file: null,
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPromptData(prev => ({
        ...prev,
        file,
      }));
    } else {
      toast({
        title: "Error",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
    }
  };

  const getKnowledgeBaseName = (knowledgeBaseId: string) => {
    const kb = knowledgeBases.find(kb => kb.id === knowledgeBaseId);
    return kb?.name || 'Unknown';
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">Loading agents...</div>
      </div>
    );
  }

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
          <DialogContent className="sm:max-w-[425px] max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Create New Agent</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh] pr-4">
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
                  <Label>Agent Avatar</Label>
                  <div className="mt-2">
                    <AgentAvatarUpload
                      avatarUrl={newAgent.avatar_url}
                      onAvatarChange={(url) => setNewAgent(prev => ({ ...prev, avatar_url: url }))}
                      agentName={newAgent.name}
                    />
                  </div>
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
                  <Select value={newAgent.knowledge_base_id} onValueChange={(value) => setNewAgent(prev => ({ ...prev, knowledge_base_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder={kbLoading ? "Loading..." : "Select a knowledge base"} />
                    </SelectTrigger>
                    <SelectContent>
                      {knowledgeBases.map((kb) => (
                        <SelectItem key={kb.id} value={kb.id}>{kb.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {knowledgeBases.length === 0 && !kbLoading && (
                    <p className="text-sm text-muted-foreground mt-1">
                      No knowledge bases found. Create one first.
                    </p>
                  )}
                </div>
                
                <div>
                  <Label>Prompts</Label>
                  <Tabs value={promptData.type} onValueChange={(value) => setPromptData(prev => ({ ...prev, type: value as 'manual' | 'pdf' }))}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="manual">Manual Input</TabsTrigger>
                      <TabsTrigger value="pdf">Upload PDF</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="manual" className="space-y-4">
                      <div>
                        <Label htmlFor="greeting-prompt">Greeting Prompt</Label>
                        <Textarea
                          id="greeting-prompt"
                          value={promptData.greetingPrompt}
                          onChange={(e) => setPromptData(prev => ({ ...prev, greetingPrompt: e.target.value }))}
                          placeholder="Enter greeting prompt template"
                          className="min-h-[80px]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="message-prompt">Message Prompt</Label>
                        <Textarea
                          id="message-prompt"
                          value={promptData.messagePrompt}
                          onChange={(e) => setPromptData(prev => ({ ...prev, messagePrompt: e.target.value }))}
                          placeholder="Enter message prompt template"
                          className="min-h-[80px]"
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="pdf" className="space-y-4">
                      <div>
                        <Label htmlFor="pdf-upload">Upload PDF Prompt</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="pdf-upload"
                            type="file"
                            accept=".pdf"
                            onChange={handleFileUpload}
                            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
                          />
                          <Upload className="w-4 h-4" />
                        </div>
                        {promptData.file && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Selected: {promptData.file.name}
                          </p>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => {
                    setIsCreateDialogOpen(false);
                    resetForm();
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateAgent}>
                    Create Agent
                  </Button>
                </div>
              </div>
            </ScrollArea>
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
                    <Avatar className="w-8 h-8">
                      {agent.avatar_url ? (
                        <AvatarImage src={agent.avatar_url} alt={agent.name} />
                      ) : (
                        <AvatarFallback>
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      )}
                    </Avatar>
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
                    <span>Knowledge: {getKnowledgeBaseName(agent.knowledge_base_id)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Created: {new Date(agent.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 gap-2"
                      onClick={() => setUsageAgent(agent)}
                    >
                      <Play className="w-4 h-4" />
                      Use Agent
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setEditingAgent({ ...agent })}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Agent
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Agent
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Agent</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{agent.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteAgent(agent.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Agent Dialog */}
      <Dialog open={!!editingAgent} onOpenChange={() => setEditingAgent(null)}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edit Agent</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            {editingAgent && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-agent-name">Agent Name</Label>
                  <Input
                    id="edit-agent-name"
                    value={editingAgent.name}
                    onChange={(e) => setEditingAgent(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter agent name"
                  />
                </div>
                
                <div>
                  <Label>Agent Avatar</Label>
                  <div className="mt-2">
                    <AgentAvatarUpload
                      avatarUrl={editingAgent.avatar_url}
                      onAvatarChange={(url) => setEditingAgent(prev => ({ ...prev, avatar_url: url }))}
                      agentName={editingAgent.name}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="edit-agent-description">Description</Label>
                  <Textarea
                    id="edit-agent-description"
                    value={editingAgent.description || ''}
                    onChange={(e) => setEditingAgent(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this agent does"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-agent-type">Agent Type</Label>
                  <Select value={editingAgent.type} onValueChange={(value: 'inbound' | 'outbound') => setEditingAgent(prev => ({ ...prev, type: value }))}>
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
                  <Label htmlFor="edit-knowledge-base">Knowledge Base</Label>
                  <Select value={editingAgent.knowledge_base_id} onValueChange={(value) => setEditingAgent(prev => ({ ...prev, knowledge_base_id: value }))}>
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
                <div>
                  <Label htmlFor="edit-prompt-content">Prompt Content</Label>
                  <Textarea
                    id="edit-prompt-content"
                    value={editingAgent.prompt_content || ''}
                    onChange={(e) => setEditingAgent(prev => ({ ...prev, prompt_content: e.target.value }))}
                    placeholder="Enter prompt content"
                    className="min-h-[120px]"
                  />
                </div>
                
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setEditingAgent(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateAgent}>
                    Update Agent
                  </Button>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Agent Usage Dialog */}
      <AgentUsageDialog
        agent={usageAgent}
        isOpen={!!usageAgent}
        onClose={() => setUsageAgent(null)}
      />
    </div>
  );
};

export default Agents;
