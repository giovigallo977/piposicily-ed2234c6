import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/**
 * Edge function per ricevere eventi di tracking e inviarli a Google Sheets
 * 
 * Struttura Google Sheet (colonne):
 * A: timestamp
 * B: event_type
 * C: session_id
 * D: zona
 * E: mood
 * F: hotspot_name
 * G: hotspot_id
 * H: source_page
 * I: device
 * 
 * Per configurare:
 * 1. Crea un Google Sheet
 * 2. Vai su Estensioni > Apps Script
 * 3. Incolla lo script doPost (vedi sotto)
 * 4. Pubblica come Web App
 * 5. Aggiungi l'URL come secret GOOGLE_SHEETS_WEBHOOK_URL
 */

interface TrackingEvent {
  timestamp: string;
  event_type: string;
  session_id: string;
  zona: string | null;
  mood: string | null;
  hotspot_name: string | null;
  hotspot_id: string | null;
  source_page: string;
  device: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const event: TrackingEvent = await req.json();
    
    // Recupera l'URL del webhook Google Sheets dai secrets
    const webhookUrl = Deno.env.get("GOOGLE_SHEETS_WEBHOOK_URL");
    
    if (!webhookUrl) {
      console.log("GOOGLE_SHEETS_WEBHOOK_URL not configured - logging event locally");
      console.log("Event received:", JSON.stringify(event, null, 2));
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Event logged locally (webhook not configured)" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Invia l'evento a Google Sheets
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      throw new Error(`Google Sheets webhook failed: ${response.status}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Event tracked successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Tracking error:", errorMessage);
    
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
