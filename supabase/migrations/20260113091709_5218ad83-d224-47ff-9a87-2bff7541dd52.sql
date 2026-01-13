-- Create storage bucket for hotspot images
INSERT INTO storage.buckets (id, name, public)
VALUES ('hotspot-images', 'hotspot-images', true);

-- Allow anyone to view images (public bucket)
CREATE POLICY "Hotspot images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'hotspot-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload hotspot images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'hotspot-images' AND auth.uid() IS NOT NULL);

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update hotspot images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'hotspot-images' AND auth.uid() IS NOT NULL);

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete hotspot images"
ON storage.objects FOR DELETE
USING (bucket_id = 'hotspot-images' AND auth.uid() IS NOT NULL);