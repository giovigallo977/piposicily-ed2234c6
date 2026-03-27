
CREATE TABLE public.experience_waitlist (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.experience_waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert into experience_waitlist"
  ON public.experience_waitlist
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read experience_waitlist"
  ON public.experience_waitlist
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);
