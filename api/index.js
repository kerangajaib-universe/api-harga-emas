module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    // Menggunakan API Cloudflare yang jauh lebih stabil dan tahan banting
    const response = await fetch('https://logam-mulia-api.iamutaki.workers.dev/api/prices/anekalogam');
    
    // Karena ini API resmi, data yang dikembalikan dijamin dalam bentuk JSON
    const dataApi = await response.json();
    
    let harga1Gram = '';
    
    // Struktur API ini sedikit berbeda, dia menyimpan data di dalam array 'data'
    if (dataApi && dataApi.data && Array.isArray(dataApi.data)) {
        // Mencari objek yang memiliki weight 1 (1 gram)
        const item1Gram = dataApi.data.find(emas => emas.weight === 1);
        if (item1Gram && item1Gram.sellPrice) {
            // Mengubah angka menjadi format Rupiah yang cantik (contoh: Rp 1.450.000)
            harga1Gram = "Rp " + item1Gram.sellPrice.toLocaleString('id-ID');
        }
    }

    res.status(200).json({
      status: "sukses",
      waktu_pengecekan: new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
      data: {
        merk: "Antam",
        gramasi: "1 gr",
        harga_terkini: harga1Gram || "Data gramasi tidak ditemukan"
      }
    });

  } catch (error) {
    res.status(500).json({ 
      status: "gagal", 
      pesan: "Sistem gagal menghubungi server Cloudflare: " + error.message 
    });
  }
}