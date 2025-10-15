-- Enable real-time for custom_request_milestones
ALTER PUBLICATION supabase_realtime ADD TABLE custom_request_milestones;

-- Add RLS policies for buyers to view and send messages
CREATE POLICY "Buyers can view messages for their requests"
ON public.developer_messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM custom_requests cr
    WHERE cr.id = developer_messages.custom_request_id
    AND cr.user_id = auth.uid()
  )
);

CREATE POLICY "Buyers can send messages for their requests"
ON public.developer_messages
FOR INSERT
WITH CHECK (
  sender_type = 'buyer'
  AND sender_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM custom_requests cr
    WHERE cr.id = developer_messages.custom_request_id
    AND cr.user_id = auth.uid()
  )
);