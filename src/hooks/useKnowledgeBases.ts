import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { useEffect } from 'react';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

type KnowledgeBase = Tables<'knowledge_bases'>;
type KnowledgeBaseInsert = TablesInsert<'knowledge_bases'>;

export const useKnowledgeBases = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch knowledge bases
  const {
    data: knowledgeBases = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['knowledge_bases'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('knowledge_bases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as KnowledgeBase[];
    },
    enabled: !!user,
  });

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('knowledge_bases_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'knowledge_bases'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['knowledge_bases'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  // Create knowledge base
  const createKnowledgeBase = useMutation({
    mutationFn: async (data: Omit<KnowledgeBaseInsert, 'user_id'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data: newKnowledgeBase, error } = await supabase
        .from('knowledge_bases')
        .insert({
          ...data,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return newKnowledgeBase;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge_bases'] });
    },
  });

  // Update knowledge base
  const updateKnowledgeBase = useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<KnowledgeBaseInsert>) => {
      const { data: updatedKnowledgeBase, error } = await supabase
        .from('knowledge_bases')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updatedKnowledgeBase;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge_bases'] });
    },
  });

  // Delete knowledge base
  const deleteKnowledgeBase = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('knowledge_bases')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge_bases'] });
      queryClient.invalidateQueries({ queryKey: ['knowledge_items'] });
    },
  });

  return {
    knowledgeBases,
    isLoading,
    error,
    createKnowledgeBase,
    updateKnowledgeBase,
    deleteKnowledgeBase,
  };
};