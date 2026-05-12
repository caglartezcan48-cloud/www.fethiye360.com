-- 1. destination_comments tablosu icin RLS politikalarini duzenleyelim
ALTER TABLE public.destination_comments ENABLE ROW LEVEL SECURITY;

-- Mevcut politikalari silelim (temiz bir baslangic icin)
DROP POLICY IF EXISTS "Anyone can read approved comments" ON public.destination_comments;
DROP POLICY IF EXISTS "Authenticated users can insert comments" ON public.destination_comments;

-- Herkes onaylanmis yorumlari okuyabilsin
CREATE POLICY "Anyone can read approved comments"
ON public.destination_comments FOR SELECT
USING (is_approved = true OR auth.uid() = user_id);

-- Giris yapmis her kullanici yorum ekleyebilsin
CREATE POLICY "Authenticated users can insert comments"
ON public.destination_comments FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 2. Sema onbellegini yenileyelim (406 hatasini cozmek icin)
NOTIFY pgrst, 'reload schema';
