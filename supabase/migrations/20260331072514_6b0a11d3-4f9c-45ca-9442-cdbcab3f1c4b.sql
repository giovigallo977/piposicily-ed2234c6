CREATE POLICY "Anon can insert granted_emails"
ON public.granted_emails FOR INSERT TO anon
WITH CHECK (true);