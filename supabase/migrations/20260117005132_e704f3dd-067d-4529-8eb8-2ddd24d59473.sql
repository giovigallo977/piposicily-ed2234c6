-- Add zona field to hotspots table
ALTER TABLE public.hotspots 
ADD COLUMN zona text DEFAULT ''::text;