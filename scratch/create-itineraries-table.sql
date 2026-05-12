-- User Itineraries (Gezi Planlari) Tablosu
CREATE TABLE IF NOT EXISTS public.user_itineraries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    activities JSONB NOT NULL DEFAULT '[]'::jsonb,
    type TEXT DEFAULT 'bucket_list',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Ayarlari
ALTER TABLE public.user_itineraries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see their own itineraries"
    ON public.user_itineraries FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own itineraries"
    ON public.user_itineraries FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own itineraries"
    ON public.user_itineraries FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own itineraries"
    ON public.user_itineraries FOR UPDATE
    USING (auth.uid() = user_id);
