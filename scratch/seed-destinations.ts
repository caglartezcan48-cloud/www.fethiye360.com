import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

const initialDestinations = [
  {
    title: "Ölüdeniz Plajı",
    slug: "oludeniz-plaji",
    category: "Plaj",
    main_image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
    description: "Dünyaca ünlü mavi bayraklı plajı ve lagünü ile Fethiye'nin incisi.",
    history: "Likyalılar döneminde 'Işık ve Güneş Diyarı' olarak bilinen bölge, tarih boyunca önemini korumuştur.",
    transportation: "Fethiye merkezden kalkan dolmuşlarla yaklaşık 25 dakikada ulaşılabilir.",
    meta_title: "Ölüdeniz Gezi Rehberi",
    meta_description: "Ölüdeniz hakkında her şey: Tarihçe, ulaşım ve ziyaretçi yorumları."
  },
  {
    title: "Kayaköy Hayalet Şehir",
    slug: "kayakoy",
    category: "Tarihi Yer",
    main_image: "https://images.unsplash.com/photo-1544833058-e70f9ca25c17?w=1200&q=80",
    description: "Terk edilmiş taş evleri ve tarihi kiliseleriyle mistik bir atmosfer.",
    history: "1923 mübadelesi sonrası terk edilen eski bir Rum yerleşimidir. Antik Likya kenti Karmylassos üzerine kuruludur.",
    transportation: "Hisarönü üzerinden kalkan araçlarla veya yürüyüş rotalarıyla ulaşılabilir.",
    meta_title: "Kayaköy Hayalet Şehir Rehberi",
    meta_description: "Kayaköy tarihçesi ve ulaşım rehberi."
  },
  {
    title: "Saklıkent Kanyonu",
    slug: "saklikent-kanyonu",
    category: "Doğa",
    main_image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80",
    description: "Avrupa'nın en derin kanyonlarından biri, buz gibi sular ve doğa harikası.",
    history: "Bir çoban tarafından şans eseri keşfedilen kanyon, günümüzde milli park statüsündedir.",
    transportation: "Fethiye merkezden kalkan Saklıkent dolmuşlarıyla 45 dakikada ulaşılabilir.",
    meta_title: "Saklıkent Kanyonu Gezi Rehberi",
    meta_description: "Saklıkent kanyonu hakkında detaylı bilgiler."
  },
  {
    title: "Kelebekler Vadisi",
    slug: "kelebekler-vadisi",
    category: "Doğa",
    main_image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    description: "Sarp kayalıklar arasında gizlenmiş, sadece deniz yoluyla ulaşılabilen bir cennet.",
    history: "Adını barındırdığı 80'den fazla kelebek türünden alır. Kaplumbağa plajına benzer bir ekosisteme sahiptir.",
    transportation: "Ölüdeniz'den kalkan teknelerle ulaşım sağlanmaktadır.",
    meta_title: "Kelebekler Vadisi Rehberi",
    meta_description: "Kelebekler vadisine nasıl gidilir?"
  }
]

async function seed() {
  console.log('Veriler yükleniyor...')
  for (const dest of initialDestinations) {
    const { error } = await supabase.from('destinations').upsert(dest, { onConflict: 'slug' })
    if (error) console.error(`Hata (${dest.title}):`, error.message)
    else console.log(`Başarılı: ${dest.title}`)
  }
}

seed()
