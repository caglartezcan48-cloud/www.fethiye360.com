-- destination_comments tablosuna rating sutunu ekleyelim
ALTER TABLE public.destination_comments ADD COLUMN IF NOT EXISTS rating INTEGER DEFAULT 5;
