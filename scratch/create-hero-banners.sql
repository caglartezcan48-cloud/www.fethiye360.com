-- create-hero-banners.sql
-- Fethiye360 Kayan Reklam Bannerları (hero_banners) Tablosu

CREATE TABLE IF NOT EXISTS public.hero_banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  background_image TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  display_order INTEGER DEFAULT 1 NOT NULL,
  scroll_speed INTEGER DEFAULT 30 NOT NULL,
  scroll_direction TEXT DEFAULT 'left' NOT NULL,
  link_url TEXT,
  alt_text TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Row Level Security (RLS) Aktifleştirme
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;

-- Eski politikaları temizleme
DROP POLICY IF EXISTS "Banners are viewable by everyone" ON public.hero_banners;
DROP POLICY IF EXISTS "Banners are modifiable by authenticated users" ON public.hero_banners;

-- Herkesin reklamları görebilmesi için SELECT politikası
CREATE POLICY "Banners are viewable by everyone"
  ON public.hero_banners FOR SELECT
  USING (true);

-- Sadece giriş yapmış yetkili kullanıcıların değişiklik yapabilmesi için ALL politikası
CREATE POLICY "Banners are modifiable by authenticated users"
  ON public.hero_banners FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
