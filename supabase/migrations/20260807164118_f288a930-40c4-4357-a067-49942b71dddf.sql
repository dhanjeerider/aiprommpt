CREATE POLICY "auth upload images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'uploads');
CREATE POLICY "auth read images" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'uploads');
CREATE POLICY "auth update images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'uploads');
CREATE POLICY "auth delete images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'uploads');