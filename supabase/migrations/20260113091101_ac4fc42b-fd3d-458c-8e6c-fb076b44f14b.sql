-- Create a table for site content like the mission page
CREATE TABLE public.site_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read site content (public facing)
CREATE POLICY "Site content is publicly readable" 
ON public.site_content 
FOR SELECT 
USING (true);

-- Only authenticated users can modify (admin)
CREATE POLICY "Authenticated users can insert site content" 
ON public.site_content 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update site content" 
ON public.site_content 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete site content" 
ON public.site_content 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Insert default mission content
INSERT INTO public.site_content (key, content) 
VALUES ('mission', 'Benvenuto nella missione di Pipo! Questo testo può essere modificato dal pannello di amministrazione.');