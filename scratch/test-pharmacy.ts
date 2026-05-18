import fetch from 'node-fetch';

async function test() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const url = `https://www.eczaneler.gen.tr/nobetci-mugla-fethiye?t=${today}`;
    console.log('Fetching:', url);

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'tr,en-US;q=0.7,en;q=0.3',
      }
    });

    console.log('Status:', res.status);
    const html = await res.text();
    console.log('HTML Length:', html.length);
    
    // Test card matching
    const pharmacyRows = html.split('<div class="nobetci-eczane-kart">').slice(1);
    console.log('Found card rows:', pharmacyRows.length);

    if (pharmacyRows.length === 0) {
      console.log('HTML Preview (first 1000 chars):');
      console.log(html.substring(0, 1000));
    } else {
      for (const row of pharmacyRows.slice(0, 2)) {
        const nameMatch = row.match(/<span class="isim">(.*?)<\/span>/);
        const addressMatch = row.match(/<div class="adres">(.*?)<\/div>/);
        const phoneMatch = row.match(/<div class="tel">(.*?)<\/div>/);
        console.log('Matches:', {
          name: nameMatch?.[1],
          address: addressMatch?.[1],
          phone: phoneMatch?.[1]
        });
      }
    }
  } catch (err) {
    console.error('Test error:', err);
  }
}

test();
