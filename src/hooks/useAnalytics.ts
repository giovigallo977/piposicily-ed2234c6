/**
 * Hook per il tracking degli eventi utente verso Google Sheets
 * 
 * Eventi tracciati:
 * - wizard_step1_zona_selected: Selezione zona nello step 1 del wizard
 * - wizard_step2_mood_selected: Selezione mood nello step 2 del wizard
 * - wizard_completed: Completamento wizard con combinazione zona + mood
 * - hotspot_navigate_clicked: Click sul pulsante "naviga" di un hotspot
 * - hotspot_expand_clicked: Click sul pulsante "+" espansione scheda
 */

import { useCallback, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Tipi di evento supportati
export type EventType =
  | "wizard_step1_zona_selected"
  | "wizard_step2_mood_selected"
  | "wizard_completed"
  | "hotspot_navigate_clicked"
  | "hotspot_expand_clicked";

// Struttura dati evento
export interface AnalyticsEvent {
  event_type: EventType;
  zona?: string | null;
  mood?: string | null;
  hotspot_name?: string | null;
  hotspot_id?: string | null;
}

// Genera o recupera un session ID persistente
const getSessionId = (): string => {
  const STORAGE_KEY = "pipo_session_id";
  let sessionId = localStorage.getItem(STORAGE_KEY);
  
  if (!sessionId) {
    // Genera un ID univoco basato su timestamp + random
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(STORAGE_KEY, sessionId);
  }
  
  return sessionId;
};

// Recupera informazioni device
const getDeviceInfo = (): string => {
  return navigator.userAgent;
};

export const useAnalytics = () => {
  const sessionIdRef = useRef<string>("");

  useEffect(() => {
    sessionIdRef.current = getSessionId();
  }, []);

  const trackEvent = useCallback(async (event: AnalyticsEvent) => {
    try {
      const payload = {
        timestamp: new Date().toISOString(),
        event_type: event.event_type,
        session_id: sessionIdRef.current || getSessionId(),
        zona: event.zona || null,
        mood: event.mood || null,
        hotspot_name: event.hotspot_name || null,
        hotspot_id: event.hotspot_id || null,
        source_page: window.location.pathname,
        device: getDeviceInfo(),
      };

      // Invia all'edge function
      const { error } = await supabase.functions.invoke("track-event", {
        body: payload,
      });

      if (error) {
        console.error("Analytics tracking error:", error);
      }
    } catch (err) {
      // Non bloccare l'UX in caso di errore di tracking
      console.error("Analytics tracking failed:", err);
    }
  }, []);

  // Helper functions per ogni tipo di evento
  const trackWizardZonaSelected = useCallback((zona: string) => {
    trackEvent({
      event_type: "wizard_step1_zona_selected",
      zona,
    });
  }, [trackEvent]);

  const trackWizardMoodSelected = useCallback((zona: string | null, mood: string) => {
    trackEvent({
      event_type: "wizard_step2_mood_selected",
      zona,
      mood,
    });
  }, [trackEvent]);

  const trackWizardCompleted = useCallback((zona: string | null, mood: string | null) => {
    trackEvent({
      event_type: "wizard_completed",
      zona,
      mood,
    });
  }, [trackEvent]);

  const trackHotspotNavigate = useCallback((hotspotId: string, hotspotName: string) => {
    trackEvent({
      event_type: "hotspot_navigate_clicked",
      hotspot_id: hotspotId,
      hotspot_name: hotspotName,
    });
  }, [trackEvent]);

  const trackHotspotExpand = useCallback((hotspotId: string, hotspotName: string) => {
    trackEvent({
      event_type: "hotspot_expand_clicked",
      hotspot_id: hotspotId,
      hotspot_name: hotspotName,
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackWizardZonaSelected,
    trackWizardMoodSelected,
    trackWizardCompleted,
    trackHotspotNavigate,
    trackHotspotExpand,
  };
};
