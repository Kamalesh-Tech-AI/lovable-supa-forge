-- Create admin_buyer_chat table for private conversations between admin and buyers
CREATE TABLE public.admin_buyer_chat (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  custom_request_id UUID NOT NULL REFERENCES custom_requests(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('admin', 'buyer')),
  message TEXT NOT NULL,
  attachments TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_buyer_chat ENABLE ROW LEVEL SECURITY;

-- Admins can view all admin-buyer messages
CREATE POLICY "Admins can view all admin-buyer messages"
ON public.admin_buyer_chat
FOR SELECT
TO authenticated
USING (is_admin());

-- Admins can send messages
CREATE POLICY "Admins can send admin-buyer messages"
ON public.admin_buyer_chat
FOR INSERT
TO authenticated
WITH CHECK (
  sender_type = 'admin' AND is_admin()
);

-- Buyers can view messages for their own requests
CREATE POLICY "Buyers can view admin-buyer messages for their requests"
ON public.admin_buyer_chat
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM custom_requests cr
    WHERE cr.id = admin_buyer_chat.custom_request_id
    AND cr.user_id = auth.uid()
  )
);

-- Buyers can send messages for their own requests
CREATE POLICY "Buyers can send admin-buyer messages for their requests"
ON public.admin_buyer_chat
FOR INSERT
TO authenticated
WITH CHECK (
  sender_type = 'buyer' 
  AND sender_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM custom_requests cr
    WHERE cr.id = admin_buyer_chat.custom_request_id
    AND cr.user_id = auth.uid()
  )
);

-- Enable realtime
ALTER TABLE public.admin_buyer_chat REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_buyer_chat;

-- Create trigger for updated_at
CREATE TRIGGER update_admin_buyer_chat_updated_at
BEFORE UPDATE ON public.admin_buyer_chat
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();