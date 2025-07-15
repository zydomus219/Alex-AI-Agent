
-- Create a table for knowledge base items
CREATE TABLE public.knowledge_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('pdf', 'url', 'text')),
  title TEXT NOT NULL,
  content TEXT,
  embedding vector(1536), -- OpenAI Ada-002 embedding (1536-dim float vector)
  url TEXT,
  file_name TEXT,
  file_path TEXT,
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'error')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own knowledge items
ALTER TABLE public.knowledge_items ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own knowledge items
CREATE POLICY "Users can view their own knowledge items" 
  ON public.knowledge_items 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own knowledge items
CREATE POLICY "Users can create their own knowledge items" 
  ON public.knowledge_items 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own knowledge items
CREATE POLICY "Users can update their own knowledge items" 
  ON public.knowledge_items 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own knowledge items
CREATE POLICY "Users can delete their own knowledge items" 
  ON public.knowledge_items 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create storage bucket for PDF files
INSERT INTO storage.buckets (id, name, public) VALUES ('knowledge-files', 'knowledge-files', true);

-- Create storage policies for the knowledge-files bucket
CREATE POLICY "Users can upload their own files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'knowledge-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own files" ON storage.objects
  FOR SELECT USING (bucket_id = 'knowledge-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own files" ON storage.objects
  FOR DELETE USING (bucket_id = 'knowledge-files' AND auth.uid()::text = (storage.foldername(name))[1]);
