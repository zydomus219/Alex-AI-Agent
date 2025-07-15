
-- Remove unnecessary columns from agents table
ALTER TABLE public.agents 
DROP COLUMN IF EXISTS prompt_source,
DROP COLUMN IF EXISTS prompt_file_name,
DROP COLUMN IF EXISTS greeting_prompt,
DROP COLUMN IF EXISTS message_prompt;

-- Remove unnecessary columns from knowledge_items table
ALTER TABLE public.knowledge_items
DROP COLUMN IF EXISTS url,
DROP COLUMN IF EXISTS file_name,
DROP COLUMN IF EXISTS file_path;
