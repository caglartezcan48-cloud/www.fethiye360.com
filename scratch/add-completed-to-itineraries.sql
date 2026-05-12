-- user_itineraries tablosuna tamamlanan aktiviteleri tutmak icin sutun ekleyelim
ALTER TABLE public.user_itineraries ADD COLUMN IF NOT EXISTS completed_activities JSONB DEFAULT '[]'::jsonb;
