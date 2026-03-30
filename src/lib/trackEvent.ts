import { supabase } from "@/integrations/supabase/client";

type EventType =
  | "page_view"
  | "hotspot_view"
  | "payment_click"
  | "cta_self_trip"
  | "cta_experience"
  | "hotspot_aperti"
  | "itinerari_cliccati"
  | "mail_wall_mostrato"
  | "email_inserita";

export const trackEvent = (event_type: EventType) => {
  supabase.from("analytics_events").insert({ event_type }).then(() => {});
};
