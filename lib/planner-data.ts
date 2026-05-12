export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: 'doga' | 'tarih' | 'deneyim' | 'sosyal' | 'yakin';
  location: string;
  transport: 'land' | 'boat';
  boatRoute?: '12adalar' | 'oludeniz_boat';
  isPopular?: boolean;
}

export const ALL_ACTIVITIES: ActivityItem[] = [
  // Doğa & Manzara
  { id: 'oludeniz', title: 'Ölüdeniz', description: 'Dünyaca ünlü lagün ve plaj.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', category: 'doga', location: 'Ölüdeniz', transport: 'land', isPopular: true },
  { id: 'kumburnu', title: 'Kumburnu Plajı', description: 'Ölüdeniz\'in en uç noktası, sakin sular.', image: 'https://images.unsplash.com/photo-1544833058-e70f9ca25c17?w=800', category: 'doga', location: 'Ölüdeniz', transport: 'land' },
  { id: 'belcekiz', title: 'Belcekız Plajı', description: 'Ölüdeniz\'in ana plajı ve kalkış noktası.', image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800', category: 'doga', location: 'Ölüdeniz', transport: 'land' },
  { id: 'butterfly', title: 'Kelebekler Vadisi', description: 'Sarp kayalıklar arasında saklı cennet.', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', category: 'doga', location: 'Faralya', transport: 'boat', boatRoute: 'oludeniz_boat', isPopular: true },
  { id: 'kabak', title: 'Kabak Koyu', description: 'Doğa ile baş başa, eşsiz bir huzur.', image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800', category: 'doga', location: 'Faralya', transport: 'land', isPopular: true },
  { id: 'cennet', title: 'Cennet Koyu', description: 'Sadece denizden ulaşılabilen bakir koy.', image: 'https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=800', category: 'doga', location: 'Faralya', transport: 'boat', boatRoute: 'oludeniz_boat' },
  { id: 'soguksu', title: 'Soğuk Su Koyu', description: 'Denizin altından çıkan tatlı su kaynağı.', image: 'https://images.unsplash.com/photo-1544833058-e70f9ca25c17?w=800', category: 'doga', location: 'Kayaköy', transport: 'boat', boatRoute: 'oludeniz_boat' },
  { id: 'akvaryum', title: 'Akvaryum Koyu', description: 'Cam gibi berrak sular ve sualtı dünyası.', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', category: 'doga', location: 'Fethiye', transport: 'boat', boatRoute: '12adalar' },
  { id: 'gemiler_koyu', title: 'Gemiler Koyu', description: 'Tarih ve denizin buluştuğu nokta.', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', category: 'doga', location: 'Kayaköy', transport: 'land' },
  { id: 'boncuklu', title: 'Boncuklu Koyu', description: 'Masmavi denizi ile meşhur butik koy.', image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800', category: 'doga', location: 'Fethiye', transport: 'land' },
  { id: 'katranci', title: 'Katrancı Koyu', description: 'Çam ağaçları altında kamp ve deniz.', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800', category: 'doga', location: 'Yanıklar', transport: 'land' },
  { id: 'gunluklu', title: 'Günlüklü Koyu', description: 'Dünyada nadir bulunan sığla ağaçları.', image: 'https://images.unsplash.com/photo-1544833058-e70f9ca25c17?w=800', category: 'doga', location: 'Yanıklar', transport: 'land' },
  { id: 'calis', title: 'Çalış Plajı', description: 'Eşsiz gün batımı ve esintili sahil.', image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800', category: 'doga', location: 'Çalış', transport: 'land', isPopular: true },
  { id: 'aksazlar', title: 'Aksazlar Koyu', description: 'Durgun ve sığ denizi ile aileler için ideal.', image: 'https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=800', category: 'doga', location: 'Fethiye', transport: 'land' },
  { id: 'inlice', title: 'İnlice Plajı', description: 'Göcek yolu üzerinde doğal bir plaj.', image: 'https://images.unsplash.com/photo-1544833058-e70f9ca25c17?w=800', category: 'doga', location: 'Göcek', transport: 'land' },
  { id: 'saklikent', title: 'Saklıkent Kanyonu', description: 'Dev kayaların arasında buz gibi sular.', image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800', category: 'doga', location: 'Seydikemer', transport: 'land', isPopular: true },
  { id: 'gizlikent', title: 'Gizlikent Şelalesi', description: 'Yeşillikler içinde saklı bir şelale.', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', category: 'doga', location: 'Seydikemer', transport: 'land' },
  { id: 'yakapark', title: 'Yakapark', description: 'Soğuk suların üzerinde doğal park.', image: 'https://images.unsplash.com/photo-1544833058-e70f9ca25c17?w=800', category: 'doga', location: 'Yaka', transport: 'land' },
  { id: 'babadag', title: 'Babadağ', description: 'Fethiye\'nin çatısı, uçuş noktası.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', category: 'doga', location: 'Ölüdeniz', transport: 'land', isPopular: true },
  { id: 'mendos', title: 'Mendos Dağı', description: 'Zirvesinden tüm körfezi izleyin.', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800', category: 'doga', location: 'Fethiye', transport: 'land' },

  // Tarihi & Antik Yerler
  { id: 'amintas', title: 'Amyntas Mezarları', description: 'Fethiye\'nin kalbinde antik tarih.', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800', category: 'tarih', location: 'Merkez', transport: 'land', isPopular: true },
  { id: 'telmessos', title: 'Telmessos', description: 'Işık ülkesinin antik kenti.', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', category: 'tarih', location: 'Merkez', transport: 'land' },
  { id: 'antik_tiyatro', title: 'Antik Tiyatro', description: 'Denize karşı antik bir sahne.', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800', category: 'tarih', location: 'Merkez', transport: 'land' },
  { id: 'kayakoy', title: 'Kayaköy', description: 'Terk edilmiş taş evler şehri.', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', category: 'tarih', location: 'Kayaköy', transport: 'land', isPopular: true },
  { id: 'afkule', title: 'Afkule Manastırı', description: 'Kayalıklara oyulmuş inziva köşesi.', image: 'https://images.unsplash.com/photo-1544833058-e70f9ca25c17?w=800', category: 'tarih', location: 'Kayaköy', transport: 'land' },
  { id: 'tlos', title: 'Tlos Antik Kenti', description: 'Pegasus\'un doğduğu antik kent.', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800', category: 'tarih', location: 'Seydikemer', transport: 'land' },
  { id: 'letoon', title: 'Letoon', description: 'Likya birliğinin kutsal merkezi.', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', category: 'tarih', location: 'Seydikemer', transport: 'land' },
  { id: 'xanthos', title: 'Xanthos', description: 'Bağımsızlık için ölen kahramanların şehri.', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800', category: 'tarih', location: 'Seydikemer', transport: 'land' },
  { id: 'pinara', title: 'Pınara', description: 'Binlerce kaya mezarlı asil şehir.', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', category: 'tarih', location: 'Seydikemer', transport: 'land' },
  { id: 'sidyma', title: 'Sidyma', description: 'Doğa içinde saklı Likya kenti.', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800', category: 'tarih', location: 'Seydikemer', transport: 'land' },
  { id: 'gemiler_adasi', title: 'Gemiler Adası', description: 'Bizans kiliseleri ve antik liman.', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', category: 'tarih', location: 'Kayaköy', transport: 'boat', boatRoute: 'oludeniz_boat', isPopular: true },

  // Aktivite & Deneyim
  { id: 'teleferik', title: 'Babadağ Teleferik', description: 'Bulutların üzerine yolculuk.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', category: 'deneyim', location: 'Ölüdeniz', transport: 'land' },
  { id: 'paragliding', title: 'Yamaç Paraşütü', description: 'Dünyanın en iyi uçuş deneyimi.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', category: 'deneyim', location: 'Ölüdeniz', transport: 'land' },
  { id: 'tekne_turu', title: '12 Adalar Tekne Turu', description: 'Mavi turun vazgeçilmez rotası.', image: 'https://images.unsplash.com/photo-1544833058-e70f9ca25c17?w=800', category: 'deneyim', location: 'Merkez Liman', transport: 'boat', boatRoute: '12adalar' },
  { id: 'jeep_safari', title: 'Jeep Safari', description: 'Macera dolu bir gün.', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800', category: 'deneyim', location: 'Seydikemer', transport: 'land' },
  { id: 'atv_safari', title: 'ATV Safari', description: 'Orman içinde adrenalin.', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800', category: 'deneyim', location: 'Kayaköy', transport: 'land' },
  { id: 'dalis', title: 'Dalış Turları', description: 'Su altındaki yaşamı keşfedin.', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', category: 'deneyim', location: 'Merkez', transport: 'boat' },
  { id: 'gunbatimi_tekne', title: 'Gün Batımı Tekne Turu', description: 'Akşam yemeği ve kızıl ufuklar.', image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800', category: 'deneyim', location: 'Fethiye', transport: 'boat' },
  { id: 'likya_yolu', title: 'Likya Yolu', description: 'Dünyanın en iyi yürüyüş rotalarından.', image: 'https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=800', category: 'deneyim', location: 'Tüm Bölge', transport: 'land' },
  { id: 'kano', title: 'Kano & Paddle Board', description: 'Sessiz koylarda kürek çekme.', image: 'https://images.unsplash.com/photo-1544833058-e70f9ca25c17?w=800', category: 'deneyim', location: 'Ölüdeniz', transport: 'boat', boatRoute: 'oludeniz_boat' },
  { id: 'balık_avı', title: 'Balık Avı Turları', description: 'Olta başında huzur.', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', category: 'deneyim', location: 'Fethiye', transport: 'boat' },
  { id: 'at_safari', title: 'At Safari', description: 'Kayaköy sokaklarında at binme.', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', category: 'deneyim', location: 'Kayaköy', transport: 'land' },

  // Merkez & Sosyal
  { id: 'marina', title: 'Fethiye Marina', description: 'Lüks yatlar ve yürüyüş yolu.', image: 'https://images.unsplash.com/photo-1544833058-e70f9ca25c17?w=800', category: 'sosyal', location: 'Merkez', transport: 'land' },
  { id: 'ece_marina', title: 'Ece Marina', description: 'Sosyal yaşamın merkezi.', image: 'https://images.unsplash.com/photo-1544833058-e70f9ca25c17?w=800', category: 'sosyal', location: 'Merkez', transport: 'land' },
  { id: 'paspatur', title: 'Paspatur Çarşısı', description: 'Tarihi butikler ve kafeler.', image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800', category: 'sosyal', location: 'Merkez', transport: 'land', isPopular: true },
  { id: 'balik_pazari', title: 'Balık Pazarı', description: 'Taze balığın lezzetle buluştuğu yer.', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', category: 'sosyal', location: 'Merkez', transport: 'land' },
  { id: 'beskaza', title: 'Beşkaza Meydanı', description: 'Şehrin ana meydanı ve etkinlikler.', image: 'https://images.unsplash.com/photo-1544833058-e70f9ca25c17?w=800', category: 'sosyal', location: 'Merkez', transport: 'land' },
  { id: 'fethi_bey_parki', title: 'Şehit Fethi Bey Parkı', description: 'Devasa rekreasyon alanı.', image: 'https://images.unsplash.com/photo-1544833058-e70f9ca25c17?w=800', category: 'sosyal', location: 'Merkez', transport: 'land' },

  // Yakın Yerler
  { id: 'gocek_merkez', title: 'Göcek', description: 'Yatçılığın kalbi.', image: 'https://images.unsplash.com/photo-1596395817188-466d6a2f3234?w=800', category: 'yakin', location: 'Göcek', transport: 'land' },
  { id: 'kas', title: 'Kaş', description: 'Masmavi denizi ile komşu ilçe.', image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800', category: 'yakin', location: 'Antalya', transport: 'land' },
  { id: 'kalkan', title: 'Kalkan', description: 'Yamaçlarda saklı bir kasaba.', image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800', category: 'yakin', location: 'Antalya', transport: 'land' },
  { id: 'patara', title: 'Patara Plajı', description: 'Dünyanın en uzun kumsallarından.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', category: 'yakin', location: 'Kaş', transport: 'land' },
  { id: 'kaputas', title: 'Kaputaş Plajı', description: 'Turkuaz rengiyle büyüleyen sahil.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', category: 'yakin', location: 'Kaş', transport: 'land' },
];

export const REGIONS = [
  { id: 'merkez', name: 'Fethiye Merkez', image: 'https://images.unsplash.com/photo-1544833058-e70f9ca25c17?w=800' },
  { id: 'oludeniz', name: 'Ölüdeniz', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800' },
  { id: 'calis', name: 'Çalış', image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800' },
  { id: 'hisaronu', name: 'Hisarönü / Ovacık', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800' },
  { id: 'gocek', name: 'Göcek', image: 'https://images.unsplash.com/photo-1596395817188-466d6a2f3234?w=800' },
];
