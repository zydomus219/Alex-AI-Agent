import { useState } from 'react';
import { Plus, Database, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useKnowledgeBases } from '@/hooks/useKnowledgeBases';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface KnowledgeBaseSidebarProps {
  selectedKnowledgeBaseId?: string;
  onSelectKnowledgeBase: (id: string) => void;
}

export const KnowledgeBaseSidebar = ({ selectedKnowledgeBaseId, onSelectKnowledgeBase }: KnowledgeBaseSidebarProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newKnowledgeBaseName, setNewKnowledgeBaseName] = useState('');
  const [newKnowledgeBaseDescription, setNewKnowledgeBaseDescription] = useState('');
  const { toast } = useToast();

  const {
    knowledgeBases,
    isLoading,
    createKnowledgeBase,
    deleteKnowledgeBase,
  } = useKnowledgeBases();

  const handleCreateKnowledgeBase = async () => {
    if (!newKnowledgeBaseName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a knowledge base name",
        variant: "destructive",
      });
      return;
    }

    try {
      await createKnowledgeBase.mutateAsync({
        name: newKnowledgeBaseName.trim(),
        description: newKnowledgeBaseDescription.trim() || null,
      });

      setNewKnowledgeBaseName('');
      setNewKnowledgeBaseDescription('');
      setIsCreateDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Knowledge base created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create knowledge base",
        variant: "destructive",
      });
    }
  };

  const handleDeleteKnowledgeBase = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This will also delete all its items.`)) {
      return;
    }

    try {
      await deleteKnowledgeBase.mutateAsync(id);
      toast({
        title: "Success",
        description: "Knowledge base deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete knowledge base",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="w-80 border-r bg-background p-4">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-80 border-r bg-background flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Knowledge Bases</h2>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Knowledge Base</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Name</label>
                  <Input
                    value={newKnowledgeBaseName}
                    onChange={(e) => setNewKnowledgeBaseName(e.target.value)}
                    placeholder="Enter knowledge base name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description (optional)</label>
                  <Input
                    value={newKnowledgeBaseDescription}
                    onChange={(e) => setNewKnowledgeBaseDescription(e.target.value)}
                    placeholder="Enter description"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateKnowledgeBase} disabled={createKnowledgeBase.isPending}>
                    {createKnowledgeBase.isPending ? 'Creating...' : 'Create'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {knowledgeBases.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No knowledge bases yet</p>
            <p className="text-sm">Create your first knowledge base</p>
          </div>
        ) : (
          knowledgeBases.map((kb) => (
            <Card
              key={kb.id}
              className={`p-3 cursor-pointer transition-colors hover:bg-accent ${
                selectedKnowledgeBaseId === kb.id ? 'bg-accent border-primary' : ''
              }`}
              onClick={() => onSelectKnowledgeBase(kb.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{kb.name}</h3>
                  {kb.description && (
                    <p className="text-sm text-muted-foreground truncate">{kb.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {new Date(kb.created_at).toLocaleDateString()}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteKnowledgeBase(kb.id, kb.name);
                    }}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};