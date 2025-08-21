-- Create custom_requests table for custom development requests
CREATE TABLE public.custom_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  budget_range TEXT NOT NULL,
  timeline TEXT,
  category TEXT,
  preferred_tech TEXT,
  status TEXT DEFAULT 'pending'::text,
  assigned_to UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.custom_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for custom_requests
CREATE POLICY "Users can view their own requests" 
ON public.custom_requests 
FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() = assigned_to);

CREATE POLICY "Users can create their own requests" 
ON public.custom_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own requests" 
ON public.custom_requests 
FOR UPDATE 
USING (auth.uid() = user_id OR auth.uid() = assigned_to);

-- Create purchases table for tracking project purchases
CREATE TABLE public.purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID NOT NULL,
  project_id UUID NOT NULL,
  amount_paid INTEGER NOT NULL,
  currency TEXT DEFAULT 'INR'::text,
  status TEXT DEFAULT 'completed'::text,
  payment_method TEXT,
  transaction_id TEXT,
  purchased_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  download_url TEXT,
  FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Create policies for purchases
CREATE POLICY "Users can view their own purchases" 
ON public.purchases 
FOR SELECT 
USING (auth.uid() = buyer_id);

CREATE POLICY "Users can create purchases" 
ON public.purchases 
FOR INSERT 
WITH CHECK (auth.uid() = buyer_id);

-- Create project_likes table for liked projects
CREATE TABLE public.project_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  project_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, project_id),
  FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.project_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for project_likes
CREATE POLICY "Users can view all likes" 
ON public.project_likes 
FOR SELECT 
USING (true);

CREATE POLICY "Users can like projects" 
ON public.project_likes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike projects" 
ON public.project_likes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create custom_request_milestones table for tracking progress
CREATE TABLE public.custom_request_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pending'::text,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (request_id) REFERENCES public.custom_requests(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.custom_request_milestones ENABLE ROW LEVEL SECURITY;

-- Create policies for milestones
CREATE POLICY "Users can view milestones for their requests" 
ON public.custom_request_milestones 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.custom_requests 
    WHERE id = request_id AND (user_id = auth.uid() OR assigned_to = auth.uid())
  )
);

-- Add trigger for updating timestamps
CREATE TRIGGER update_custom_requests_updated_at
BEFORE UPDATE ON public.custom_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();