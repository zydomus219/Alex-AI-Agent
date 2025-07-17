import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/AuthProvider';
import { extractPDFContent } from '@/services/contentExtractor';
import { config } from '@/config/env';

export interface Agent {
  id: string;
  name: string;
  description: string | null;
  type: 'inbound' | 'outbound';
  knowledge_base_id: string;
  prompt_content: string | null;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const useAgents = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchAgents = async () => {
    if (!user) {
      setAgents([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAgents((data as Agent[]) || []);
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast({
        title: "Error",
        description: "Failed to fetch agents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createAgent = async (agentData: Omit<Agent, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('agents')
        .insert({
          ...agentData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setAgents(prev => [data as Agent, ...prev]);
      toast({
        title: "Success",
        description: "Agent created successfully",
      });

      return data;
    } catch (error) {
      console.error('Error creating agent:', error);
      toast({
        title: "Error",
        description: "Failed to create agent",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateAgent = async (id: string, updates: Partial<Agent>) => {
    try {
      const { data, error } = await supabase
        .from('agents')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;

      setAgents(prev => prev.map(agent => agent.id === id ? data as Agent : agent));
      toast({
        title: "Success",
        description: "Agent updated successfully",
      });

      return data;
    } catch (error) {
      console.error('Error updating agent:', error);
      toast({
        title: "Error",
        description: "Failed to update agent",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteAgent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      setAgents(prev => prev.filter(agent => agent.id !== id));
      toast({
        title: "Success",
        description: "Agent deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast({
        title: "Error",
        description: "Failed to delete agent",
        variant: "destructive",
      });
      throw error;
    }
  };

  const generateKnowledgeEmbedding = async (userId: string, knowledgeBaseId: string) => {
    try {
      const response = await fetch(`${config.backend.url}/knowledge_embedding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          knowledge_base_id: knowledgeBaseId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate knowledge embedding');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to generate knowledge embedding');
      }

      console.log('Knowledge embedding generated successfully:', result);
      return result;
    } catch (error) {
      console.error('Error generating knowledge embedding:', error);
      throw error;
    }
  };

  const createAgentWithPrompt = async (
    agentData: Omit<Agent, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'prompt_content'>,
    promptInput: { type: 'manual' | 'pdf'; greetingPrompt?: string; messagePrompt?: string; file?: File }
  ) => {
    try {
      if (!user) throw new Error('User not authenticated');

      let promptContent = '';

      if (promptInput.type === 'manual') {
        // Combine greeting and message prompts
        promptContent = `${promptInput.greetingPrompt || ''}\n\n${promptInput.messagePrompt || ''}`.trim();
      } else if (promptInput.type === 'pdf' && promptInput.file) {
        // Extract content from PDF using backend
        const extractionResult = await extractPDFContent(promptInput.file);
        if (!extractionResult.success) {
          throw new Error(extractionResult.error || 'Failed to extract PDF content');
        }
        promptContent = extractionResult.content;
      }

      // Create the agent first
      const newAgent = await createAgent({
        ...agentData,
        prompt_content: promptContent,
      });

      // Generate knowledge embedding for the selected knowledge base
      try {
        await generateKnowledgeEmbedding(user.id, agentData.knowledge_base_id);
        toast({
          title: "Success",
          description: "Agent created and knowledge base embedding generated successfully",
        });
      } catch (embeddingError) {
        console.error('Error generating embedding:', embeddingError);
        toast({
          title: "Warning",
          description: "Agent created but failed to generate knowledge base embedding. You may need to regenerate it manually.",
          variant: "destructive",
        });
      }

      return newAgent;
    } catch (error) {
      console.error('Error creating agent with prompt:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchAgents();
  }, [user]);

  return {
    agents,
    loading,
    createAgent,
    updateAgent,
    deleteAgent,
    createAgentWithPrompt,
    refetch: fetchAgents,
  };
};
