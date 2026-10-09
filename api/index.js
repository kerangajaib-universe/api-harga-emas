const cheerio = require('cheerio');

module.exports = async function handler(req, res) {
  // Mengatur agar API bisa diakses dari aplikasi Android Adek (CORS)
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    // 1. Membuka web harga emas alternatif yang tidak memblokir bot
    const urlAntam = 'https://harga-emas.org/antam/'; 
    
    // Melakukan request ke URL tersebut
    const response = await fetch(urlAntam);
    const html = await response.text();

    // 2. Cheerio mulai membaca struktur HTML halamannya
    const $ = cheerio.load(html);

    // 3. Mencari angka di dalam tabel 
    let harga1Gram = '';
    
    // Mencari baris tabel (td) yang mengandung teks "1 Gram"
    $('td').each((index, element) => {
       const teks = $(element).text();
       if(teks.includes('1 Gram')) {
           // Mengambil nilai di kolom sebelah kanannya (harga)
           harga1Gram = $(element).next().text().trim(); 
       }
    });

    // 4. Membungkus data yang didapat menjadi format JSON
    res.status(200).json({
      status: "sukses",
      waktu_pengecekan: new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
      data: {
        merk: "Antam",
        gramasi: "1 gr",
        harga_terkini: harga1Gram || "Sedang gangguan/Data tidak ditemukan"
      }
    });

  } catch (error) {
    // Jika terjadi error (misal internet putus atau web target down)
    res.status(500).json({ 
      status: "gagal", 
      pesan: error.message 
    });
  }
}