export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: 'doga' | 'tarih' | 'deneyim' | 'sosyal' | 'yakin';
  location: string;
  isPopular?: boolean;
}

export const ALL_ACTIVITIES: ActivityItem[] = [
  // Doğa & Manzara
  { id: 'oludeniz', title: 'Ölüdeniz', description: 'Dünyaca ünlü lagün ve plaj.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', category: 'doga', location: 'Ölüdeniz', isPopular: true },
  { id: 'kumburnu', title: 'Kumburnu Plajı', description: 'Ölüdeniz\'in en uç noktası, sakin sular.', image: 'https://images.unsplash.com/photo-1544833058-e70f9ca25c17?w=800', category: 'doga', location: 'Ölüdeniz' },
  { id: 'belcekiz', title: 'Belcekız Plajı', description: 'Ölüdeniz\'in ana plajı ve kalkış noktası.', image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800', category: 'doga', location: 'Ölüdeniz' },
  { id: 'butterfly', title: 'Kelebekler Vadisi', description: 'Sarp kayalıklar arasında saklı cennet.', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', category: 'doga', location: 'Faralya', isPopular: true },
  { id: 'kabak', title: 'Kabak Koyu', description: 'Doğa ile baş başa, eşsiz bir huzur.', image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800', category: 'doga', location: 'Faralya', isPopular: true },
  { id: 'cennet', title: 'Cennet Koyu', description: 'Sadece denizden ulaşılabilen bakir koy.', image: 'https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=800', category: 'doga', location: 'Faralya' },
  { id: 'soguksu', title: 'Soğuk Su Koyu', description: 'Denizin altından çıkan tatlı su kaynağı.', image: 'https://images.unsplash.com/photo-1544833058-e70f9ca25c17?w=800', category: 'doga', location: 'Kayaköy' },
  { id: 'akvaryum', title: 'Akvaryum Koyu', description: 'Cam gibi berrak sular ve sualtı dünyası.', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', category: 'doga', location: 'Fethiye' },
  { id: 'gemiler_koyu', title: 'Gemiler Koyu', description: 'Tarih ve denizin buluştuğu nokta.', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', category: 'doga', location: 'Kayaköy' },
  { id: 'boncuklu', title: 'Boncuklu Koyu', description: 'Masmavi denizi ile meşhur butik koy.', image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800', category: 'doga', location: 'Fethiye' },
  { id: 'katranci', title: 'Katrancı Koyu', description: 'Çam ağaçları altında kamp ve deniz.', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800', category: 'doga', location: 'Yanıklar' },
  { id: 'gunluklu', title: 'Günlüklü Koyu', description: 'Dünyada nadir bulunan sığla ağaçları.', image: 'https://images.unsplash.com/photo-1544833058-e70f9ca25c17?w=800', category: 'doga', location: 'Yanıklar' },
  { id: 'calis', title: 'Çalış Plajı', description: 'Eşsiz gün batımı ve esintili sahil.', image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800', category: 'doga', location: 'Çalış', isPopular: true },
  { id: 'aksazlar', title: 'Aksazlar Koyu', description: 'Durgun ve sığ denizi ile aileler için ideal.', image: 'https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=800', category: 'doga', location: 'Fethiye' },
  { id: 'inlice', title: 'İnlice Plajı', description: 'Göcek yolu üzerinde doğal bir plaj.', image: 'https://images.unsplash.com/photo-1544833058-e70f9ca25c17?w=800', category: 'doga', location: 'Göcek' },
  { id: 'saklikent', title: 'Saklıkent Kanyonu', description: 'Dev kayaların arasında buz gibi sular.', image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800', category: 'doga', location: 'Seydikemer', isPopular: true },
  { id: 'gizlikent', title: 'Gizlikent Şelalesi', description: 'Yeşillikler içinde saklı bir şelale.', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', category: 'doga', location: 'Seydikemer' },
  { id: 'yakapark', title: 'Yakapark', description: 'Soğuk suların üzerinde doğal park.', image: 'https://images.unsplash.com/photo-1544833058-e70f9ca25c17?w=800', category: 'doga', location: 'Yaka' },
  { id: 'babadag', title: 'Babadağ', description: 'Fethiye\'nin çatısı, uçuş noktası.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', category: 'doga', location: 'Ölüdeniz', isPopular: true },
  { id: 'mendos', title: 'Mendos Dağı', description: 'Zirvesinden tüm körfezi izleyin.', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800', category: 'doga', location: 'Fethiye' },

  // Tarihi & Antik Yerler
  { id: 'amintas', title: 'Amyntas Mezarları', description: 'Fethiye\'nin kalbinde antik tarih.', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800', category: 'tarih', location: 'Merkez', isPopular: true },
  { id: 'telmessos', title: 'Telmessos', description: 'Işık ülkesinin antik kenti.', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', category: 'tarih', location: 'Merkez' },
  { id: 'antik_tiyatro', title: 'Antik Tiyatro', description: 'Denize karşı antik bir sahne.', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800', category: 'tarih', location: 'Merkez' },
  { id: 'kayakoy', title: 'Kayaköy', description: 'Terk edilmiş taş evler şehri.', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', category: 'tarih', location: 'Kayaköy', isPopular: true },
  { id: 'afkule', title: 'Afkule Manastırı', description: 'Kayalıklara oyulmuş inziva köşesi.', image: 'https://images.unsplash.com/photo-1544833058-e70f9ca25c17?w=800', category: 'tarih', location: 'Kayaköy' },
  { id: 'tlos', title: 'Tlos Antik Kenti', description: 'Pegasus\'un doğduğu antik kent.', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800', category: 'tarih', location: 'Seydikemer' },
  { id: 'letoon', title: 'Letoon', description: 'Likya birliğinin kutsal merkezi.', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', category: 'tarih', location: 'Seydikemer' },
  { id: 'xanthos', title: 'Xanthos', description: 'Bağımsızlık için ölen kahramanların şehri.', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800', category: 'tarih', location: 'Seydikemer' },
  { id: 'pinara', title: 'Pınara', description: 'Binlerce kaya mezarlı asil şehir.', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', category: 'tarih', location: 'Seydikemer' },
  { id: 'sidyma', title: 'Sidyma', description: 'Doğa içinde saklı Likya kenti.', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800', category: 'tarih', location: 'Seydikemer' },
  { id: 'gemiler_adasi', title: 'Gemiler Adası', description: 'Bizans kiliseleri ve antik liman.', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', category: 'tarih', location: 'Kayaköy', isPopular: true },

  // Aktivite & Deneyim
  { id: 'teleferik', title: 'Babadağ Teleferik', description: 'Bulutların üzerine yolculuk.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', category: 'deneyim', location: 'Ölüdeniz' },
  { id: 'paragliding', title: 'Yamaç Paraşütü', description: 'Dünyanın en iyi uçuş deneyimi.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', category: 'deneyim', location: 'Ölüdeniz' },
  { id: 'tekne_turu', title: '12 Adalar Tekne Turu', description: 'Mavi turun vazgeçilmez rotası.', image: 'https://images.unsplash.com/photo-1544833058-e70f9ca25c17?w=800', category: 'deneyim', location: 'Merkez Liman' },
  { id: 'jeep_safari', title: 'Jeep Safari', description: 'Macera dolu bir gün.', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800', category: 'deneyim', location: 'Seydikemer' },
  { id: 'atv_safari', title: 'ATV Safari', description: 'Orman içinde adrenalin.', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800', category: 'deneyim', location: 'Kayaköy' },
  { id: 'dalis', title: 'Dalış Turları', description: 'Su altındaki yaşamı keşfedin.', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', category: 'deneyim', location: 'Merkez' },
  { id: 'gunbatimi_tekne', title: 'Gün Batımı Tekne Turu', description: 'Akşam yemeği ve kızıl ufuklar.', image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800', category: 'deneyim', location: 'Fethiye' },
  { id: 'likya_yolu', title: 'Likya Yolu', description: 'Dünyanın en iyi yürüyüş rotalarından.', image: 'https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=800', category: 'deneyim', location: 'Tüm Bölge' },
  { id: 'kano', title: 'Kano & Paddle Board', description: 'Sessiz koylarda kürek çekme.', image: 'https://images.unsplash.com/photo-1544833058-e70f9ca25c17?w=800', category: 'deneyim', location: 'Ölüdeniz' },
  { id: 'balık_avı', title: 'Balık Avı Turları', description: 'Olta başında huzur.', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', category: 'deneyim', location: 'Fethiye' },
  { id: 'at_safari', title: 'At Safari', description: 'Kayaköy sokaklarında at binme.', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', category: 'deneyim', location: 'Kayaköy' },

  // Merkez & Sosyal
  { id: 'marina', title: 'Fethiye Marina', description: 'Lüks yatlar ve yürüyüş yolu.', image: 'https://images.unsplash.com/photo-1544833058-e70f9ca25c17?w=800', category: 'sosyal', location: 'Merkez' },
  { id: 'ece_marina', title: 'Ece Marina', description: 'Sosyal yaşamın merkezi.', image: 'https://images.unsplash.com/photo-1544833058-e70f9ca25c17?w=800', category: 'sosyal', location: 'Merkez' },
  { id: 'paspatur', title: 'Paspatur Çarşısı', description: 'Tarihi butikler ve kafeler.', image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800', category: 'sosyal', location: 'Merkez', isPopular: true },
  { id: 'balik_pazari', title: 'Balık Pazarı', description: 'Taze balığın lezzetle buluştuğu yer.', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', category: 'sosyal', location: 'Merkez' },
  { id: 'beskaza', title: 'Beşkaza Meydanı', description: 'Şehrin ana meydanı ve etkinlikler.', image: 'https://images.unsplash.com/photo-1544833058-e70f9ca25c17?w=800', category: 'sosyal', location: 'Merkez' },
  { id: 'fethi_bey_parki', title: 'Şehit Fethi Bey Parkı', description: 'Devasa rekreasyon alanı.', image: 'https://images.unsplash.com/photo-1544833058-e70f9ca25c17?w=800', category: 'sosyal', location: 'Merkez' },

  // Yakın Yerler
  { id: 'gocek_merkez', title: 'Göcek', description: 'Yatçılığın kalbi.', image: 'https://images.unsplash.com/photo-1596395817188-466d6a2f3234?w=800', category: 'yakin', location: 'Göcek' },
  { id: 'kas', title: 'Kaş', description: 'Masmavi denizi ile komşu ilçe.', image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800', category: 'yakin', location: 'Antalya' },
  { id: 'kalkan', title: 'Kalkan', description: 'Yamaçlarda saklı bir kasaba.', image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800', category: 'yakin', location: 'Antalya' },
  { id: 'patara', title: 'Patara Plajı', description: 'Dünyanın en uzun kumsallarından.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', category: 'yakin', location: 'Kaş' },
  { id: 'kaputas', title: 'Kaputaş Plajı', description: 'Turkuaz rengiyle büyüleyen sahil.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', category: 'yakin', location: 'Kaş' },
];

export const REGIONS = [
  { id: 'merkez', name: 'Fethiye Merkez', image: 'https://images.unsplash.com/photo-1544833058-e70f9ca25c17?w=800' },
  { id: 'oludeniz', name: 'Ölüdeniz', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800' },
  { id: 'calis', name: 'Çalış', image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800' },
  { id: 'hisaronu', name: 'Hisarönü / Ovacık', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800' },
  { id: 'gocek', name: 'Göcek', image: 'https://images.unsplash.com/photo-1596395817188-466d6a2f3234?w=800' },
];
