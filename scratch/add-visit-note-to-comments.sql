-- destination_comments tablosuna visit_note sutunu ekleyelim
ALTER TABLE public.destination_comments ADD COLUMN IF NOT EXISTS visit_note TEXT;
