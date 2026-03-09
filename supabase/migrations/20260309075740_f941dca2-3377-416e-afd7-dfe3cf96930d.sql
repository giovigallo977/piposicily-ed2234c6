CREATE OR REPLACE FUNCTION public.get_analytics_counts()
RETURNS TABLE(event_type text, count bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT event_type, count(*)::bigint
  FROM public.analytics_events
  GROUP BY event_type;
$$;