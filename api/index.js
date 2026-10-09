const cheerio = require('cheerio');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    const urlAntam = 'https://harga-emas.org/antam/'; 
    
    const response = await fetch(urlAntam);
    const html = await response.text();
    const $ = cheerio.load(html);

    let harga1Gram = '';
    
    // Perbaikan: Membaca tabel baris per baris (tr) dengan lebih teliti
    $('tr').each((index, element) => {
       // Ubah huruf jadi kecil semua agar tidak salah baca
       const teksBaris = $(element).text().toLowerCase();
       
       // Mencari baris yang mengandung tulisan "1 gram"
       if(teksBaris.includes('1 gram')) {
           // Mengambil teks dari kolom (td) ke-2 yang merupakan kolom harga
           const kolom = $(element).find('td');
           if(kolom.length > 1) {
               harga1Gram = $(kolom[1]).text().trim(); 
               // Membersihkan spasi atau karakter "enter" yang berantakan
               harga1Gram = harga1Gram.replace(/\s+/g, ' ');
           }
       }
    });

    res.status(200).json({
      status: "sukses",
      waktu_pengecekan: new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
      data: {
        merk: "Antam",
        gramasi: "1 gr",
        harga_terkini: harga1Gram || "Data tabel gagal dibaca"
      }
    });

  } catch (error) {
    res.status(500).json({ 
      status: "gagal", 
      pesan: error.message 
    });
  }
}