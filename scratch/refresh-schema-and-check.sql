-- 1. Businesses tablosundaki owner_id'yi tekrar garantiye alalim
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='businesses' AND column_name='owner_id') THEN
        ALTER TABLE public.businesses ADD COLUMN owner_id UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- 2. Yorum tablosundaki sutunlari tekrar kontrol edelim
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='destination_comments' AND column_name='rating') THEN
        ALTER TABLE public.destination_comments ADD COLUMN rating INTEGER DEFAULT 5;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='destination_comments' AND column_name='visit_note') THEN
        ALTER TABLE public.destination_comments ADD COLUMN visit_note TEXT;
    END IF;
END $$;

-- 3. KRITIK: Sema onbellegini yenileyelim (Tum 406 hatalarini bu cozer)
NOTIFY pgrst, 'reload schema';
