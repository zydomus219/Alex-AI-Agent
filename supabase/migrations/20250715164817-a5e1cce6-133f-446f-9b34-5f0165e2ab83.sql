
-- Create a table for AI agents
CREATE TABLE public.agents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('inbound', 'outbound')),
  knowledge_base_id UUID REFERENCES public.knowledge_bases(id) NOT NULL,
  greeting_prompt TEXT,
  message_prompt TEXT,
  prompt_content TEXT,
  prompt_source TEXT CHECK (prompt_source IN ('manual', 'pdf')),
  prompt_file_name TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own agents
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own agents
CREATE POLICY "Users can view their own agents" 
  ON public.agents 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own agents
CREATE POLICY "Users can create their own agents" 
  ON public.agents 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own agents
CREATE POLICY "Users can update their own agents" 
  ON public.agents 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own agents
CREATE POLICY "Users can delete their own agents" 
  ON public.agents 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create trigger for updated_at timestamp
CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON public.agents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
