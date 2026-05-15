export async function getPharmacyData() {
  try {
    // Her zaman taze veri almak için cache-busting ekliyoruz ve revalidate süresini düşürüyoruz
    const today = new Date().toISOString().split('T')[0];
    const res = await fetch(`https://www.eczaneler.gen.tr/nobetci-mugla-fethiye?t=${today}`, {
      next: { revalidate: 1800 } // 30 dakikada bir kontrol et
    });

    if (!res.ok) throw new Error('Network response was not ok');
    const html = await res.text();

    // Regex'i daha esnek hale getiriyoruz
    const pharmacies = [];
    const pharmacyRows = html.split('<div class="nobetci-eczane-kart">').slice(1);
    
    for (const row of pharmacyRows) {
      const nameMatch = row.match(/<span class="isim">(.*?)<\/span>/);
      const addressMatch = row.match(/<div class="adres">(.*?)<\/div>/);
      const phoneMatch = row.match(/<div class="tel">(.*?)<\/div>/);

      if (nameMatch && addressMatch && phoneMatch) {
        pharmacies.push({
          name: nameMatch[1].replace(/&nbsp;/g, ' ').replace(/<.*?>/g, '').trim(),
          address: addressMatch[1].replace(/<.*?>/g, '').trim(),
          phone: phoneMatch[1].replace(/<.*?>/g, '').trim(),
        });
      }
    }

    // Başarılı olursa döndür
    if (pharmacies.length > 0) {
      return pharmacies;
    }

  } catch (error) {
    console.error('Pharmacy data fetch error:', error);
    return null;
  }
}
