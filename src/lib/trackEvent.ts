import { supabase } from "@/integrations/supabase/client";

type EventType = "page_view" | "hotspot_view" | "payment_click";

export const trackEvent = (event_type: EventType) => {
  supabase.from("analytics_events").insert({ event_type }).then(() => {});
};
