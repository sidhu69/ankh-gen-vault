-- Create storage bucket for story photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('story-photos', 'story-photos', true);

-- RLS policies for story photos bucket
CREATE POLICY "Users can upload photos to their family stories"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'story-photos' AND
  EXISTS (
    SELECT 1 FROM member_stories ms
    JOIN family_members fm ON fm.id = ms.member_id
    JOIN families f ON f.id = fm.family_id
    WHERE f.created_by = auth.uid()
    AND (storage.foldername(name))[1] = ms.id::text
  )
);

CREATE POLICY "Users can view photos from their family stories"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'story-photos' AND
  EXISTS (
    SELECT 1 FROM member_stories ms
    JOIN family_members fm ON fm.id = ms.member_id
    JOIN families f ON f.id = fm.family_id
    WHERE f.created_by = auth.uid()
    AND (storage.foldername(name))[1] = ms.id::text
  )
);

CREATE POLICY "Users can delete photos from their family stories"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'story-photos' AND
  EXISTS (
    SELECT 1 FROM member_stories ms
    JOIN family_members fm ON fm.id = ms.member_id
    JOIN families f ON f.id = fm.family_id
    WHERE f.created_by = auth.uid()
    AND (storage.foldername(name))[1] = ms.id::text
  )
);