
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useKnowledgeItems } from '@/hooks/useKnowledgeItems';
import { useKnowledgeBases } from '@/hooks/useKnowledgeBases';
import { KnowledgeBaseHeader } from '@/components/knowledge-base/KnowledgeBaseHeader';
import { AddContentTabs } from '@/components/knowledge-base/AddContentTabs';
import { KnowledgeItemsList } from '@/components/knowledge-base/KnowledgeItemsList';
import { KnowledgeBaseSidebar } from '@/components/knowledge-base/KnowledgeBaseSidebar';
import { useAuth } from '@/components/AuthProvider';

const KnowledgeBase = () => {
  const [selectedKnowledgeBaseId, setSelectedKnowledgeBaseId] = useState<string>();
  const { toast } = useToast();
  const { user } = useAuth();
  const { knowledgeBases } = useKnowledgeBases();
  
  const {
    knowledgeItems,
    isLoading,
    createKnowledgeItem,
    updateKnowledgeItem,
    deleteKnowledgeItem,
    processPDF,
    processURL,
  } = useKnowledgeItems(selectedKnowledgeBaseId);

  // Auto-select first knowledge base if none selected
  useEffect(() => {
    if (knowledgeBases.length > 0 && !selectedKnowledgeBaseId) {
      setSelectedKnowledgeBaseId(knowledgeBases[0].id);
    }
  }, [knowledgeBases, selectedKnowledgeBaseId]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedKnowledgeBaseId) {
      toast({
        title: "No knowledge base selected",
        description: "Please select or create a knowledge base first.",
        variant: "destructive",
      });
      return;
    }

    console.log('File upload triggered');
    const file = event.target.files?.[0];
    console.log('Selected file:', file);
    
    if (!file) {
      console.log('No file selected');
      return;
    }

    if (file.type !== 'application/pdf') {
      console.log('Invalid file type:', file.type);
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Starting PDF processing with Python backend...');
      
      // First create the knowledge item with processing status
      const newItem = await createKnowledgeItem.mutateAsync({
        type: 'pdf',
        title: file.name,
        status: 'processing',
        knowledge_base_id: selectedKnowledgeBaseId,
      });

      console.log('Knowledge item created:', newItem);

      toast({
        title: "PDF uploaded successfully",
        description: "Your document is being processed...",
      });

      // Process PDF with Python backend
      const { content, title } = await processPDF(file);
      console.log('PDF content extracted:', content.substring(0, 100) + '...');
      
      // Update the item with the extracted content
      await updateKnowledgeItem.mutateAsync({
        id: newItem.id,
        updates: {
          content: content,
          title: title,
          status: 'completed',
        },
      });

      console.log('Knowledge item updated with extracted content');

      toast({
        title: "PDF processed successfully",
        description: "Content has been extracted and saved.",
      });

      // Reset file input
      event.target.value = '';
    } catch (error: any) {
      console.error('PDF processing error:', error);
      toast({
        title: "Processing failed",
        description: error.message || "Failed to process PDF file",
        variant: "destructive",
      });
    }
  };

  const handleUrlSubmit = async (urlInput: string) => {
    if (!selectedKnowledgeBaseId) {
      toast({
        title: "No knowledge base selected",
        description: "Please select or create a knowledge base first.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Starting URL processing with Python backend...');
      
      // First create the knowledge item with processing status
      const newItem = await createKnowledgeItem.mutateAsync({
        type: 'url',
        title: 'Processing...',
        status: 'processing',
        knowledge_base_id: selectedKnowledgeBaseId,
      });

      toast({
        title: "URL added successfully",
        description: "Website content is being processed...",
      });

      // Process URL with Python backend
      const { content, title } = await processURL(urlInput);
      console.log('URL content extracted:', content.substring(0, 100) + '...');
      
      // Update the item with the extracted content
      await updateKnowledgeItem.mutateAsync({
        id: newItem.id,
        updates: {
          content: content,
          title: title,
          status: 'completed',
        },
      });

      toast({
        title: "Website processed successfully",
        description: "Content has been extracted and saved.",
      });

    } catch (error: any) {
      console.error('URL processing error:', error);
      toast({
        title: "Processing failed",
        description: error.message || "Failed to process website URL",
        variant: "destructive",
      });
    }
  };

  const handleTextSubmit = async (textTitle: string, textInput: string) => {
    if (!selectedKnowledgeBaseId) {
      toast({
        title: "No knowledge base selected",
        description: "Please select or create a knowledge base first.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createKnowledgeItem.mutateAsync({
        type: 'text',
        title: textTitle,
        content: textInput,
        status: 'completed',
        knowledge_base_id: selectedKnowledgeBaseId,
      });

      toast({
        title: "Text added successfully",
        description: "Your custom text has been added to the knowledge base.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to add text",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteKnowledgeItem.mutateAsync(id);
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Knowledge Base Management</h1>
          <p className="text-white/60">Please sign in to manage your knowledge base</p>
        </div>
      </div>
    );
  }

  const selectedKnowledgeBase = knowledgeBases.find(kb => kb.id === selectedKnowledgeBaseId);

  return (
    <div className="flex h-full">
      <KnowledgeBaseSidebar 
        selectedKnowledgeBaseId={selectedKnowledgeBaseId}
        onSelectKnowledgeBase={setSelectedKnowledgeBaseId}
      />

      <div className="flex-1 p-6">
        {selectedKnowledgeBase ? (
          <>
            <KnowledgeBaseHeader itemCount={knowledgeItems.length} />

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">{selectedKnowledgeBase.name}</h1>
              <p className="text-muted-foreground">
                {selectedKnowledgeBase.description || 'Add content to train your AI agent with custom knowledge'}
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <AddContentTabs
                  onFileUpload={handleFileUpload}
                  onUrlSubmit={handleUrlSubmit}
                  onTextSubmit={handleTextSubmit}
                  isLoading={createKnowledgeItem.isPending}
                />
              </div>

              <div className="lg:col-span-2">
                <KnowledgeItemsList
                  knowledgeItems={knowledgeItems}
                  isLoading={isLoading}
                  onDelete={handleDelete}
                  isDeleting={deleteKnowledgeItem.isPending}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">Welcome to Knowledge Base</h2>
              <p className="text-muted-foreground mb-6">
                Create your first knowledge base to get started organizing your AI training content.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeBase;
