const cheerio = require('cheerio');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    // 1. Menggunakan URL Proxy (Penyamar) agar Vercel tidak diblokir
    const urlAntam = 'https://harga-emas.org/antam/'; 
    const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(urlAntam);
    
    // Vercel mengambil data lewat Proxy
    const response = await fetch(proxyUrl);
    const dataProxy = await response.json();
    
    // Mengeluarkan isi HTML asli dari bungkus proxy
    const html = dataProxy.contents; 

    // 2. Cheerio membaca HTML aslinya
    const $ = cheerio.load(html);
    let harga1Gram = '';
    
    // 3. Mencari baris tabel yang berisi 1 gram
    $('tr').each((index, element) => {
       const teksBaris = $(element).text().toLowerCase();
       
       if(teksBaris.includes('1 gram')) {
           const kolom = $(element).find('td');
           if(kolom.length > 1) {
               // Mengambil teks harganya dan merapikan spasi
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
        harga_terkini: harga1Gram || "Masih diblokir / Gagal diekstrak"
      }
    });

  } catch (error) {
    res.status(500).json({ 
      status: "gagal", 
      pesan: error.message 
    });
  }
}