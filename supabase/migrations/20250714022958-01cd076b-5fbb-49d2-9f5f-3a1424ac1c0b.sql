-- Create update function first
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create knowledge_bases table
CREATE TABLE public.knowledge_bases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.knowledge_bases ENABLE ROW LEVEL SECURITY;

-- Create policies for knowledge_bases
CREATE POLICY "Users can view their own knowledge bases" 
ON public.knowledge_bases 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own knowledge bases" 
ON public.knowledge_bases 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own knowledge bases" 
ON public.knowledge_bases 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own knowledge bases" 
ON public.knowledge_bases 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add knowledge_base_id column to knowledge_items
ALTER TABLE public.knowledge_items 
ADD COLUMN knowledge_base_id UUID REFERENCES public.knowledge_bases(id) ON DELETE CASCADE;

-- Create trigger for updating updated_at timestamp
CREATE TRIGGER update_knowledge_bases_updated_at
BEFORE UPDATE ON public.knowledge_bases
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for knowledge_bases
ALTER TABLE public.knowledge_bases REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.knowledge_bases;