
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { extractPDFContent, extractURLContent } from '@/services/contentExtractor';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

type KnowledgeItem = Tables<'knowledge_items'>;
type KnowledgeItemInsert = TablesInsert<'knowledge_items'>;

export const useKnowledgeItems = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch knowledge items
  const { data: knowledgeItems = [], isLoading, error } = useQuery({
    queryKey: ['knowledge-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('knowledge_items')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as KnowledgeItem[];
    },
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('knowledge-items-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'knowledge_items'
        },
        () => {
          // Invalidate and refetch knowledge items when any change occurs
          queryClient.invalidateQueries({ queryKey: ['knowledge-items'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Create knowledge item mutation
  const createKnowledgeItem = useMutation({
    mutationFn: async (item: Omit<KnowledgeItemInsert, 'user_id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('knowledge_items')
        .insert({ ...item, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-items'] });
    },
  });

  // Update knowledge item mutation
  const updateKnowledgeItem = useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<KnowledgeItem> }) => {
      const { data, error } = await supabase
        .from('knowledge_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-items'] });
    },
  });

  // Delete knowledge item mutation
  const deleteKnowledgeItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('knowledge_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-items'] });
      toast({
        title: "Item deleted",
        description: "Knowledge base item has been removed.",
      });
    },
  });

  // Process PDF file with Python backend
  const processPDF = async (file: File): Promise<{ content: string; title: string }> => {
    const result = await extractPDFContent(file);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to extract PDF content');
    }
    
    return {
      content: result.content,
      title: result.title
    };
  };

  // Process URL with Python backend
  const processURL = async (url: string): Promise<{ content: string; title: string }> => {
    const result = await extractURLContent(url);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to extract URL content');
    }
    
    return {
      content: result.content,
      title: result.title
    };
  };

  return {
    knowledgeItems,
    isLoading,
    error,
    createKnowledgeItem,
    updateKnowledgeItem,
    deleteKnowledgeItem,
    processPDF,
    processURL,
  };
};
