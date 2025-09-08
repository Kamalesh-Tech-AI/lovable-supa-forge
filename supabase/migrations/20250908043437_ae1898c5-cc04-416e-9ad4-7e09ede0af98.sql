-- Fix function search path issues by updating existing functions
CREATE OR REPLACE FUNCTION public.notify_milestone_update()
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.notify_request_status_update()
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;