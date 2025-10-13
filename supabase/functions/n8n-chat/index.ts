import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { message, session_id } = await req.json();
    
    if (!message || !session_id) {
      return new Response(
        JSON.stringify({ error: 'Missing message or session_id' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get the n8n webhook URL from Supabase secrets
    const n8nWebhookUrl = Deno.env.get('N8N_WEBHOOK_URL');
    
    if (!n8nWebhookUrl) {
      console.log('No n8n webhook URL configured, using fallback response');
      
      // Fallback response when no webhook is configured
      const fallbackResponse = getFallbackResponse(message);
      
      return new Response(
        JSON.stringify({ 
          response: fallbackResponse,
          session_id: session_id,
          timestamp: new Date().toISOString(),
          source: 'fallback'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Sending to n8n webhook:', n8nWebhookUrl);

    // Send message to n8n webhook
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        session_id: session_id,
        timestamp: new Date().toISOString()
      }),
    });

    if (!n8nResponse.ok) {
      throw new Error(`n8n webhook error: ${n8nResponse.status}`);
    }

    const n8nData = await n8nResponse.json();
    
    return new Response(
      JSON.stringify({
        response: n8nData.response || n8nData.message || 'Response received from n8n',
        session_id: session_id,
        timestamp: new Date().toISOString(),
        source: 'n8n'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in n8n-chat function:', error);
    
    // Return fallback response on error
    const { message, session_id } = await req.json().catch(() => ({ message: '', session_id: '' }));
    const fallbackResponse = getFallbackResponse(message);
    
    return new Response(
      JSON.stringify({
        response: fallbackResponse,
        session_id: session_id,
        timestamp: new Date().toISOString(),
        source: 'fallback',
        error: 'n8n webhook failed'
      }),
      { 
        status: 200, // Return 200 to provide fallback response
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Simple keyword-based responses
  if (lowerMessage.includes('e-commerce') || lowerMessage.includes('shop') || lowerMessage.includes('store')) {
    return "I found that you're interested in e-commerce projects! I can help you find complete e-commerce solutions with features like inventory management, payment integration, and admin dashboards. What's your budget range?";
  }
  
  if (lowerMessage.includes('portfolio') || lowerMessage.includes('personal website')) {
    return "Great! Portfolio websites are perfect for showcasing your work. I can help you find responsive portfolio templates with contact forms, project galleries, and modern designs. Are you looking for any specific technologies?";
  }
  
  if (lowerMessage.includes('dashboard') || lowerMessage.includes('admin')) {
    return "Admin dashboards are very popular! I can help you find feature-rich dashboards with analytics, user management, and real-time data visualization. What type of business is this for?";
  }
  
  if (lowerMessage.includes('budget') || lowerMessage.includes('price') || lowerMessage.includes('cost')) {
    return "I understand budget is important! Our projects range from ₹5,000 for simple templates to ₹50,000+ for complex applications. What's your budget range?";
  }
  
  if (lowerMessage.includes('react') || lowerMessage.includes('vue') || lowerMessage.includes('angular')) {
    return "I see you have technology preferences! We have projects built with modern frameworks like React, Vue.js, Angular, and more. What type of project are you building?";
  }
  
  return "I'd love to help you find the perfect project! Could you tell me more about what you're looking for? For example, what type of project (e-commerce, portfolio, dashboard), your preferred technologies, and your budget range?";
}