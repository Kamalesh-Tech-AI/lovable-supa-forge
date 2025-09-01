
-- Add user_type column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN user_type TEXT DEFAULT 'buyer' CHECK (user_type IN ('buyer', 'seller', 'both'));

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  read BOOLEAN DEFAULT FALSE,
  related_request_id UUID REFERENCES public.custom_requests(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notification preferences table
CREATE TABLE public.notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  milestone_updates BOOLEAN DEFAULT TRUE,
  project_status_updates BOOLEAN DEFAULT TRUE,
  daily_digest BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on notifications table
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Enable RLS on notification preferences table  
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- RLS policies for notifications
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
  ON public.notifications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS policies for notification preferences
CREATE POLICY "Users can view their own notification preferences" 
  ON public.notification_preferences 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notification preferences" 
  ON public.notification_preferences 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification preferences" 
  ON public.notification_preferences 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add RLS policies for admins to manage notifications
CREATE POLICY "Admins can manage all notifications" 
  ON public.notifications 
  FOR ALL 
  USING (is_admin());

-- Add missing RLS policies for custom_request_milestones
CREATE POLICY "Admins can manage all milestones" 
  ON public.custom_request_milestones 
  FOR ALL 
  USING (is_admin());

CREATE POLICY "Assigned developers can update milestones" 
  ON public.custom_request_milestones 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM custom_requests 
    WHERE custom_requests.id = custom_request_milestones.request_id 
    AND custom_requests.assigned_to = auth.uid()
  ));

-- Function to create notification when milestone is updated
CREATE OR REPLACE FUNCTION notify_milestone_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create notification if status changed to completed
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    INSERT INTO public.notifications (user_id, title, message, type, related_request_id)
    SELECT 
      cr.user_id,
      'Milestone Completed',
      'Milestone "' || NEW.title || '" has been completed for your project "' || cr.title || '"',
      'success',
      cr.id
    FROM custom_requests cr
    WHERE cr.id = NEW.request_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for milestone updates
CREATE TRIGGER milestone_update_notification
  AFTER UPDATE ON public.custom_request_milestones
  FOR EACH ROW
  EXECUTE FUNCTION notify_milestone_update();

-- Function to create notification when custom request status changes
CREATE OR REPLACE FUNCTION notify_request_status_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create notification if status actually changed
  IF NEW.status != OLD.status THEN
    INSERT INTO public.notifications (user_id, title, message, type, related_request_id)
    VALUES (
      NEW.user_id,
      'Project Status Update',
      'Your project "' || NEW.title || '" status changed from "' || OLD.status || '" to "' || NEW.status || '"',
      CASE 
        WHEN NEW.status = 'completed' THEN 'success'
        WHEN NEW.status = 'in_progress' THEN 'info'
        ELSE 'info'
      END,
      NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for request status updates
CREATE TRIGGER request_status_update_notification
  AFTER UPDATE ON public.custom_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_request_status_update();
