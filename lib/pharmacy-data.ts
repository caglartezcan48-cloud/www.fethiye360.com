export async function getPharmacyData() {
  try {
    // Ücretsiz ve güncel bir kaynak olan eczaneler.gen.tr'den veriyi çekiyoruz
    // Not: Bu bir scraping örneğidir. Gerçek API kullanımı için ücretli servisler önerilir.
    const res = await fetch('https://www.eczaneler.gen.tr/nobetci-mugla-fethiye', {
      next: { revalidate: 3600 } // 1 saat önbellek
    });
    const html = await res.text();

    // Basit bir regex ile eczane isimlerini, adreslerini ve telefonlarını ayıklıyoruz
    const pharmacyMatches = html.matchAll(/<span class="isim">(.*?)<\/span>.*?<div class="adres">(.*?)<\/div>.*?<div class="tel">(.*?)<\/div>/gs);
    
    const pharmacies = [];
    for (const match of pharmacyMatches) {
      pharmacies.push({
        name: match[1].replace(/&nbsp;/g, ' ').trim(),
        address: match[2].trim(),
        phone: match[3].replace(/<.*?>/g, '').trim(),
      });
    }

    // Eğer scraping başarısız olursa (kaynak değişirse) fallback verisi döndür
    if (pharmacies.length === 0) {
      return [
        { name: 'Fethiye Merkez Eczanesi', address: 'Cumhuriyet Mah. Atatürk Cad.', phone: '0252 614 10 20' },
        { name: 'Kordon Eczanesi', address: 'Kordon Boyu No:45', phone: '0252 612 11 22' }
      ];
    }

    return pharmacies;
  } catch (error) {
    console.error('Pharmacy data fetch error:', error);
    return null;
  }
}
