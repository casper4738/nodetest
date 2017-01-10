module.exports = {

    BELUM_REG: "Kamu belum registrasi layanan BCA Chat Banking. Untuk registrasi tekan tombol Registrasi di bawah ini.\n\nDengan melakukan registrasi, maka kamu menyetujui ketentuan - ketentuan yang berlaku.",
    REG_ULANG: "Untuk mendaftar kembali silakan tekan tombol Registrasi.\nDengan melakukan registrasi, maka kamu menyetujui syarat dan ketentuan yang berlaku.",
    MENU: "Silakan pilih transaksi yang kamu inginkan.",
    
    //INPUT
    INPUT_KARTU_ATM: "Silakan masukkan nomor kartu ATM kamu.",
    CHOOSE_NUMBER_PHONE: "Silakan pilih nomor handphone yang ingin diaktivasi untuk layanan Chat Banking.",
    INPUT_OTP: "Silakan masukkan OTP.",
    INPUT_KK:"Silakan ketik nomor kartu kredit kamu pada layanan ini.",
    
    //SUCCESS
    SUCCESS_REGISTRATION: "Kamu telah terdaftar dalam layanan BCA Chat Banking.\nSilakan pilih transaksi yang kamu inginkan.",
   
    
    
    //OTP
    SEND_OTP : "Kamu akan menerima OTP ke [MSISDN].\nSilakan tekan tombol Input OTP.\n\nUntuk mengirim ulang OTP silakan tekan Kirim Ulang OTP.",
    
    //ADMINISTRASI
    REG_INFO_KK: "Registrasi info kartu kredit BCA sudah selesai.\n\nProses persetujuan registrasi maksimal 3 hari kerja.",
    HAPUS_REG_INFO_KK: "Kamu sudah tidak terdaftar di Layanan Info Kartu Kredit BCA.\n\nUntuk daftar silakan pilih tombol \"Kartu Kredit\".",
    TUTUP_LAYANAN : "Dengan menutup layanan, maka kamu menjadi tidak dapat melakukan transaksi perbankan. Apakah  kamu yakin?",
    TUTUP_LAYANAN_YA : "Kamu sudah tidak terdaftar pada layanan BCA Chat Banking.\n\nTerima kasih telah menggunakan layanan BCA Chat Banking.",
    TUTUP_LAYANAN_TDK : "Silakan pilih transaksi yang ingin dilakukan dengan menekan tombol di bawah ini.",

    _menu: [{
        "content_type": "text",
        "title": "Cek Saldo",
        "payload": "Cek Saldo"
    }, {
        "content_type": "text",
        "title": "Cek Mutasi Rekening",
        "payload": "Cek Mutasi Rekening"
    }, {
        "content_type": "text",
        "title": "Isi Pulsa",
        "payload": "Isi Pulsa"
    }, {
        "content_type": "text",
        "title": "Info Kartu Kredit",
        "payload": "Info Kartu Kredit"
    }, {
        "content_type": "text",
        "title": "Administrasi",
        "payload": "Administrasi"

    }, {
        "content_type": "text",
        "title": "Cara Pakai",
        "payload": "Cara Pakai"

    }],


    _isi: [{
        type: "web_url",
        url: "https://www.oculus.com/en-us/rift/",
        title: "Open Web URL"
    }, {
        type: "postback",
        title: "Trigger Postback",
        payload: "DEVELOPER_DEFINED_PAYLOAD"
    }, {
        type: "phone_number",
        title: "Call Phone Number",
        payload: "+16505551234"
    }]


}
