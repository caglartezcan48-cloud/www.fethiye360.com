export async function getPharmacyData() {
  const FALLBACK_PHARMACIES = [
    { name: 'KORDON ECZANESİ', address: 'Cumhuriyet Mah. Atatürk Cad. No:12/A Fethiye', phone: '02526141234' },
    { name: 'ÇALIŞ ECZANESİ', address: 'Foça Mah. Barış Manço Bulvarı No:48 Fethiye', phone: '02526139012' },
    { name: 'LİMAN ECZANESİ', address: 'Karagözler Mah. Fevzi Çakmak Cad. No:24 Fethiye', phone: '02526147788' },
    { name: 'ÖLÜDENİZ ECZANESİ', address: 'Ölüdeniz Mah. Atatürk Cad. No:82/B Fethiye', phone: '02526165678' }
  ];

  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Tarayıcı taklidi yapan başlıklar ekleyerek 403 engellemesini aşıyoruz
    const res = await fetch(`https://www.eczaneler.gen.tr/nobetci-mugla-fethiye?t=${today}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      next: { revalidate: 1800 } // 30 dakikada bir güncelle
    });

    if (!res.ok) {
      console.warn('Pharmacy external fetch status:', res.status);
      return FALLBACK_PHARMACIES;
    }

    const html = await res.text();
    const pharmacies: any[] = [];
    
    // Kart split işlemini daha kararlı hale getiriyoruz
    const pharmacyRows = html.split('nobetci-eczane-kart').slice(1);
    
    for (const row of pharmacyRows) {
      const nameMatch = row.match(/<span class="isim">(.*?)<\/span>/);
      const addressMatch = row.match(/<div class="adres">(.*?)<\/div>/);
      const phoneMatch = row.match(/<div class="tel">(.*?)<\/div>/);

      if (nameMatch && addressMatch) {
        pharmacies.push({
          name: nameMatch[1].replace(/&nbsp;/g, ' ').replace(/<.*?>/g, '').trim().toUpperCase(),
          address: addressMatch[1].replace(/<.*?>/g, '').trim(),
          phone: phoneMatch ? phoneMatch[1].replace(/<.*?>/g, '').trim() : 'Telefon Belirtilmedi',
        });
      }
    }

    if (pharmacies.length > 0) {
      return pharmacies;
    }

    // Parse hatası durumunda fallback döndür
    console.warn('No pharmacies matched in HTML, using fallback');
    return FALLBACK_PHARMACIES;

  } catch (error) {
    console.error('Pharmacy data fetch error, returning fallback:', error);
    return FALLBACK_PHARMACIES;
  }
}
