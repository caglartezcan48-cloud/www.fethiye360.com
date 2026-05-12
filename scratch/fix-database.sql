-- 1. Notifications Tablosu Olusturma
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    post_id UUID REFERENCES public.user_posts(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'like', 'comment', 'follow'
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Ayarlari
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see their own notifications"
    ON public.notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "System/Users can insert notifications"
    ON public.notifications FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update their own notifications"
    ON public.notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- 2. Businesses Tablosuna owner_id Ekleme (Eger yoksa)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='businesses' AND COLUMN_NAME='owner_id') THEN
        ALTER TABLE public.businesses ADD COLUMN owner_id UUID REFERENCES auth.users(id);
    END IF;
END $$;
