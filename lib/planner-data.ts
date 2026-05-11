export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: 'adrenalin' | 'huzur' | 'kultur' | 'lezzet';
  location: string;
}

export const ALL_ACTIVITIES: ActivityItem[] = [
  // Adrenalin
  { id: 'para', title: 'Yamaç Paraşütü', description: 'Babadağ\'dan gökyüzüne süzülün.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', category: 'adrenalin', location: 'Ölüdeniz' },
  { id: 'scuba', title: 'Tüplü Dalış', description: 'Fethiye\'nin sualtı dünyasını keşfedin.', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', category: 'adrenalin', location: 'Merkez' },
  { id: 'jeep', title: 'Jeep Safari', description: 'Tozlu yollarda Saklıkent kanyonuna yolculuk.', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800', category: 'adrenalin', location: 'Tlos/Saklıkent' },
  
  // Huzur
  { id: 'boat', title: '12 Adalar Tekne Turu', description: 'Ege\'nin kristal koylarında bir gün.', image: 'https://images.unsplash.com/photo-1544833058-e70f9ca25c17?w=800', category: 'huzur', location: 'Merkez Liman' },
  { id: 'butterfly', title: 'Kelebekler Vadisi', description: 'Doğanın kalbinde huzurlu bir mola.', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', category: 'huzur', location: 'Faralya' },
  { id: 'kabak', title: 'Kabak Koyu', description: 'Eşsiz manzarada kamp ve deniz keyfi.', image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800', category: 'huzur', location: 'Faralya' },
  
  // Kültür
  { id: 'kayakoy', title: 'Kayaköy Hayalet Köy', description: 'Mübadele döneminin sessiz tanığı.', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', category: 'kultur', location: 'Kayaköy' },
  { id: 'tlos', title: 'Tlos Antik Kenti', description: 'Likya\'nın en eski yerleşimlerinden biri.', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800', category: 'kultur', location: 'Yaka' },
  { id: 'amintas', title: 'Amintas Kaya Mezarları', description: 'Fethiye kalesinin eteklerinde dev mezarlar.', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800', category: 'kultur', location: 'Merkez' },
  
  // Lezzet
  { id: 'fish', title: 'Fethiye Balık Pazarı', description: 'Seçtiğiniz taze balığı pişirip yiyin.', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', category: 'lezzet', location: 'Merkez' },
  { id: 'choco', title: 'Fethiye Çikolata Evi', description: 'El yapımı özel çikolata deneyimi.', image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800', category: 'lezzet', location: 'Merkez' },
  { id: 'kordon', title: 'Kordon Kahvaltısı', description: 'Denize sıfır serpme kahvaltı keyfi.', image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800', category: 'lezzet', location: 'Kordon' },
];

export const REGIONS = [
  { id: 'merkez', name: 'Fethiye Merkez', image: 'https://images.unsplash.com/photo-1544833058-e70f9ca25c17?w=800' },
  { id: 'oludeniz', name: 'Ölüdeniz', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800' },
  { id: 'calis', name: 'Çalış', image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800' },
  { id: 'hisaronu', name: 'Hisarönü / Ovacık', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800' },
  { id: 'gocek', name: 'Göcek', image: 'https://images.unsplash.com/photo-1596395817188-466d6a2f3234?w=800' },
];
