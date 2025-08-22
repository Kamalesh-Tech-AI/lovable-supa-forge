-- Create sell_projects table for project submissions
CREATE TABLE public.sell_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  tech_stack JSONB DEFAULT '[]'::jsonb,
  features TEXT[],
  price_inr INTEGER NOT NULL,
  demo_command TEXT,
  file_url TEXT,
  status TEXT DEFAULT 'pending'::text,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on sell_projects
ALTER TABLE public.sell_projects ENABLE ROW LEVEL SECURITY;

-- Create policies for sell_projects
CREATE POLICY "Sellers can insert their own sell projects" 
ON public.sell_projects 
FOR INSERT 
WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can view their own sell projects" 
ON public.sell_projects 
FOR SELECT 
USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can update their own sell projects" 
ON public.sell_projects 
FOR UPDATE 
USING (auth.uid() = seller_id);

CREATE POLICY "Admins can view all sell projects" 
ON public.sell_projects 
FOR SELECT 
USING (is_admin());

CREATE POLICY "Admins can update all sell projects" 
ON public.sell_projects 
FOR UPDATE 
USING (is_admin());

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_sell_projects_updated_at
BEFORE UPDATE ON public.sell_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Make project-files bucket public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'project-files';

-- Add images column to projects table
ALTER TABLE public.projects 
ADD COLUMN images TEXT[];

-- Add RLS policy for project-files bucket to allow public access
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'project-files');

CREATE POLICY "Authenticated users can upload project files" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'project-files' AND auth.role() = 'authenticated');