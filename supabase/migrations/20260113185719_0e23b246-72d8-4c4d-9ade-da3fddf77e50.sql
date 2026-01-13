-- Add tags column to hotspots table
ALTER TABLE public.hotspots 
ADD COLUMN tags text[] DEFAULT ARRAY[]::text[];