module.exports = async function handler(req, res) {
  // Mengizinkan aplikasi Android-mu mengakses API ini
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    // Kita tidak lagi membedah HTML web, tapi langsung memanggil API Komunitas Emas
    const response = await fetch('https://logam-mulia-api.vercel.app/api/antam');
    const dataApi = await response.json();
    
    let harga1Gram = '';
    
    // Mencari data spesifik 1 gram dari daftar JSON yang diberikan API
    if (dataApi && dataApi.data) {
        const item1Gram = dataApi.data.find(emas => emas.weight === '1 gram');
        if (item1Gram) {
            // Mengambil teks harganya (contoh: "Rp 1.450.000")
            harga1Gram = item1Gram.price;
        }
    }

    // Mengirimkan hasilnya ke layar / ke aplikasi Android
    res.status(200).json({
      status: "sukses",
      waktu_pengecekan: new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
      data: {
        merk: "Antam",
        gramasi: "1 gr",
        harga_terkini: harga1Gram || "Rp 1.450.000 (Data Estimasi)"
      }
    });

  } catch (error) {
    res.status(500).json({ 
      status: "gagal", 
      pesan: "Gagal menyambung ke server sumber: " + error.message 
    });
  }
}