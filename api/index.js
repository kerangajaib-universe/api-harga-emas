const cheerio = require('cheerio');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    const urlAntam = 'https://harga-emas.org/antam/'; 
    // Menggunakan proxy alternatif yang lebih stabil untuk membaca teks mentah
    const proxyUrl = 'https://api.codetabs.com/v1/proxy?quest=' + urlAntam;
    
    // Membaca hasil proxy sebagai teks HTML biasa
    const response = await fetch(proxyUrl);
    const html = await response.text(); 
    
    const $ = cheerio.load(html);
    let harga1Gram = '';
    
    // Pencarian tabel
    $('tr').each((index, element) => {
       const teksBaris = $(element).text().toLowerCase();
       
       if(teksBaris.includes('1 gram')) {
           const kolom = $(element).find('td');
           if(kolom.length > 1) {
               harga1Gram = $(kolom[1]).text().trim().replace(/\s+/g, ' '); 
           }
       }
    });

    res.status(200).json({
      status: "sukses",
      waktu_pengecekan: new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
      data: {
        merk: "Antam",
        gramasi: "1 gr",
        harga_terkini: harga1Gram || "Data tabel gagal dibaca (Web Target Berubah)"
      }
    });

  } catch (error) {
    res.status(500).json({ 
      status: "gagal", 
      pesan: error.message 
    });
  }
}