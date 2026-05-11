export interface ActivityItem {
  time: string;
  title: string;
  description: string;
  image: string;
  type: 'historical' | 'nature' | 'food' | 'adventure' | 'experience';
}

export interface DayPlan {
  day: number;
  activities: ActivityItem[];
}

export const REGIONS = [
  { id: 'merkez', name: 'Fethiye Merkez', image: 'https://images.unsplash.com/photo-1544833058-e70f9ca25c17?w=800' },
  { id: 'oludeniz', name: 'Ölüdeniz', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800' },
  { id: 'calis', name: 'Çalış', image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800' },
  { id: 'hisaronu', name: 'Hisarönü / Ovacık', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800' },
  { id: 'gocek', name: 'Göcek', image: 'https://images.unsplash.com/photo-1596395817188-466d6a2f3234?w=800' },
];

export const BUCKET_LIST = [
  { id: 'para', title: 'Babadağ Yamaç Paraşütü', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400' },
  { id: 'boat', title: '12 Adalar Tekne Turu', image: 'https://images.unsplash.com/photo-1544833058-e70f9ca25c17?w=400' },
  { id: 'kayakoy', title: 'Kayaköy Hayalet Köy Gezisi', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400' },
  { id: 'saklikent', title: 'Saklıkent Kanyonu Yürüyüşü', image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=400' },
  { id: 'amintas', title: 'Amintas Kaya Mezarları Gün Batımı', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400' },
];

export const REGION_PLANS: Record<string, DayPlan[]> = {
  merkez: [
    {
      day: 1,
      activities: [
        { time: '09:00', title: 'Klasik Fethiye Kahvaltısı', description: 'Kordon boyunda denize karşı güne başlayın.', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', type: 'food' },
        { time: '11:00', title: 'Amintas Kaya Mezarları', description: 'Fethiye\'nin simgesi antik mezarları ziyaret edin.', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', type: 'historical' },
        { time: '14:00', title: 'Paspatur Çarşısı', description: 'Tarihi dar sokaklarda alışveriş ve çay molası.', image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800', type: 'experience' },
        { time: '19:00', title: 'Kordon Balık Restoranları', description: 'Taze deniz mahsulleri ile akşam yemeği.', image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800', type: 'food' },
      ]
    },
    {
      day: 2,
      activities: [
        { time: '10:00', title: 'Şövalye Adası Tekne Transferi', description: 'Sessiz ve sakin bir gün için adaya geçiş.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', type: 'nature' },
        { time: '16:00', title: 'Fethiye Müzesi', description: 'Bölge tarihini derinlemesine inceleyin.', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', type: 'historical' },
        { time: '20:00', title: 'Çikolata Evi Deneyimi', description: 'Merkezde el yapımı çikolatalarla tatlı bir final.', image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800', type: 'experience' },
      ]
    }
  ],
  oludeniz: [
    {
      day: 1,
      activities: [
        { time: '08:00', title: 'Babadağ Yamaç Paraşütü', description: 'Güne dünyanın en iyi parkurunda uçarak başlayın.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', type: 'adventure' },
        { time: '12:00', title: 'Blue Lagoon (Ölüdeniz)', description: 'Mavi bayraklı durgun sularda yüzme keyfi.', image: 'https://images.unsplash.com/photo-1544833058-e70f9ca25c17?w=800', type: 'nature' },
        { time: '18:00', title: 'Belcekız Plajı Gün Batımı', description: 'Kumsalda kokteyl eşliğinde günü uğurlayın.', image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800', type: 'experience' },
      ]
    }
  ]
};
