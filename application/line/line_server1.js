var express = require('express');
var router = express.Router();


var querystring = require('querystring');
var http = require('http');
var fs = require('fs');
var jsonfile = require('jsonfile')

var util = require('./util')
var GLOBALS = require('../../globals')


// middleware specific to this router
router.use(function timeLog(req, res, next) {
//   console.log('Time: ', Date.now());
//   console.log('ceeeeee');
//       console.log("LINEXXX START");
//     console.log("check "+req+" - "+res);

  //PostCode("U3c5ac9f58f31eff7927737cceabfe87a");
  next();
});

// define the home page route
router.get('/line', function(req, res) {
    res.send('LINE GET home page');
    //res.end("success");
    console.log("LINE GET home page");
    //handleRequest(req, res); 
});

router.post('/', function(req, res) {
    res.send('LINE POST home page');
    //res.end("success");
    console.log("LINE POST home page");
    handleRequest(req, res); 
});

// define the about route
router.get('/about', function(req, res) {
  res.send('About birds');
});


//Lets define a port we want to listen to
const PORT=8081; 
var flagMenu = -1;
var flagMain = [];


function isMenuChek(message, menu){
    return message.toLowerCase() === menu.toLowerCase();
}

function resetFlag(){
    flagMenu = 0;
    flagMain = 0;
}

//We need a function which handles requests and send response
function handleRequest(request, response){
    
    console.log("LINE START");
    console.log("check "+request+" - "+response);
    
    try {
        console.log("check request");
        for(var data in request) {
            //console.log("       data "+data);
        }
        
         console.log("check response");
        for(var data in response) {
            //console.log("       data "+data);
        }
        
        console.log(" chek data "+request.method);
        
        var POST = {};
        if (request.method == 'POST') {
            request.on('data', function(data) {
                data = data.toString();
                console.log(data);
                
                var obj = JSON.parse(data);
                var userId = obj.events[0].source.userId;
                var message = obj.events[0].message.text;
                
                console.log("CEKKK :: flag menu BEFORE ::"+flagMenu+" "+message);
                
                if(isMenuChek(message, "Info")) {
                    var messages = util.msg_type_basic_text("HEllo World");
                    util.post(userId, messages);
                } else if(isMenuChek(message, "Start")) {
                    var messages = util.msg_ready_registration();
                    util.post(userId, messages);
                } else if(isMenuChek(message, "Registrasi")) {
                    flagMenu = GLOBALS.REG.STEP_1;
                }  else if(isMenuChek(message, "Cek Saldo")) {
                    flagMenu = GLOBALS.MENU.CEK_SALDO;
                } 
                
                else if(isMenuChek(message, "Cek Mutasi Rekening")) {
                    flagMenu = GLOBALS.MENU.CEK_MUTASI_REK;
                } else if(flagMenu === GLOBALS.MENU.CEK_MUTASI_REK && isMenuChek(message, GLOBALS.CEK_MUTASI_REK.REK_UTAMA.LABEL)) {
                    flagMenu = GLOBALS.CEK_MUTASI_REK.REK_UTAMA.VALUE;
                } else if(flagMenu === GLOBALS.MENU.CEK_MUTASI_REK && isMenuChek(message, GLOBALS.CEK_MUTASI_REK.REK_LAIN.LABEL)) {
                    flagMenu = GLOBALS.CEK_MUTASI_REK.REK_LAIN.VALUE;
                } 
                
                else if(isMenuChek(message, "Kartu Kredit")) {
                    flagMenu = GLOBALS.MENU.REG_KK;
                }
                
                else if(isMenuChek(message, GLOBALS.MENU.TUTUP_LAYANAN.LABEL)) {
                    flagMenu = GLOBALS.MENU.TUTUP_LAYANAN.VALUE;
                } else if(flagMenu === GLOBALS.MENU.TUTUP_LAYANAN.VALUE && isMenuChek(message, GLOBALS.TUTUP_LAYANAN.YA.LABEL)) {
                    flagMenu = GLOBALS.TUTUP_LAYANAN.YA.VALUE;
                } else if(flagMenu === GLOBALS.MENU.TUTUP_LAYANAN.VALUE && isMenuChek(message, GLOBALS.TUTUP_LAYANAN.TIDAK.LABEL)) {
                    flagMenu = GLOBALS.TUTUP_LAYANAN.TIDAK.VALUE;
                } 
                
                
                console.log("CEKKK :: flag menu AFTER ::"+flagMenu+" "+message+" || "+( GLOBALS.MENU.TUTUP_LAYANAN.LABEL) );

                /* CEK SALDO */
                if(flagMenu === GLOBALS.MENU.CEK_SALDO) {
                    var myMessages = String.raw`Saldo \n22/09 08:18:12 527xxx0000 Rp 1,000,000.00`;
                    var messages = util.msg_type_basic_text(myMessages);
                    util.post(userId, messages);
                    resetFlag();
                }
                /* END OF CEK SALDO */
                
                /* CARA PAKAI */
                if(flagMenu === GLOBALS.CARA_PAKAI.PLEASE_REG) {
                    var buttons =["Registrasi", "Ketentuan - ketentuan"];
                    var message = String.raw`Kamu belum registrasi layanan BCA Chat Banking. Untuk registrasi tekan tombol Registrasi di bawah ini. \n\nDengan melakukan registrasi, maka kamu menyetujui ketentuan - ketentuan yang berlaku.`;
                    var messages = util.msg_buttons_without_pict_titlebuttons(buttons, message);
                    util.post(userId, messages);
                }
                
                if(flagMenu === GLOBALS.CARA_PAKAI.INFO_PICT) {
                    var buttons =["Registrasi", "Ketentuan - ketentuan"];
                    var message = String.raw`Kamu belum registrasi layanan BCA Chat Banking. Untuk registrasi tekan tombol Registrasi di bawah ini. \n\nDengan melakukan registrasi, maka kamu menyetujui ketentuan - ketentuan yang berlaku.`;
                    var messages = util.msg_buttons_without_pict_titlebuttons(buttons, message);
                    util.post(userId, messages);
                }
                /* END OF CARA PAKAI */
                
                /* REGISTRASI */
                 if(flagMenu === GLOBALS.REG.STEP_1) {
                    flagMenu = GLOBALS.REG.STEP_2;
                    var messages = util.msg_type_basic_text("Silakan masukkan nomor kartu ATM kamu.");
                    util.post(userId, messages);
                } else if(flagMenu === GLOBALS.REG.STEP_2) {
                    flagMenu = GLOBALS.REG.STEP_3;
                    var myMessage ='{"success": true,"MSISDNList": [{"MSISDNData":{"MSISDNID": "081299991234","MSISDN": "0812xxxx1234"}},{"MSISDNData":{"MSISDNID": "081299991235","MSISDN": "0812xxxx1235"}}]}';
                    var messages = util.msg_reg_activation(myMessage);
                    util.post(userId, messages);
                } else if(flagMenu === GLOBALS.REG.STEP_3) {
                    flagMenu = GLOBALS.REG.STEP_4;
                    var messages = util.msg_reg_otp();
                    util.post(userId, messages);
                } else if(flagMenu === GLOBALS.REG.STEP_4) {
                    flagMenu = GLOBALS.REG.STEP_5;
                    var messages = util.msg_type_basic_text("Silakan masukkan OTP");
                    util.post(userId, messages);
                } else if(flagMenu === GLOBALS.REG.STEP_5) {
                    flagMenu = GLOBALS.MENU;
                    var messages = util.msg_type_basic_text("Kamu telah terdaftar dalam layanan BCA Chat Banking. Silakan pilih transaksi yang ingin dilakukan dengan menekan tombol di bawah ini.");
                    util.post(userId, messages);
                    resetFlag();
                }
                /* END OF REGISTRASI */
                
                /* CEK MUTASI */
                if(flagMenu === GLOBALS.MENU.CEK_MUTASI_REK) {
                    var buttons =[GLOBALS.CEK_MUTASI_REK.REK_UTAMA.LABEL,  GLOBALS.CEK_MUTASI_REK.REK_LAIN.LABEL];
                    var message = String.raw`Silakan pilih jenis mutasi rekening.`;
                    var messages = util.msg_buttons_without_pict_title(buttons, message);
                    util.post(userId, messages);
                } else if(flagMenu === GLOBALS.CEK_MUTASI_REK.REK_UTAMA.VALUE) {
                    var myMessages = String.raw`22/09 ETR Rp. 37,000.00 DB Naomi\n20/09 ETR Rp. 50,000.00 DB\n13/09 EPY Rp. 40,500.00 DB\n09/09 EPY Rp. 42,500.00 DBB`;
                    var messages = util.msg_type_basic_text(myMessages);
                    util.post(userId, messages);
                    resetFlag();
                } else if(flagMenu === GLOBALS.CEK_MUTASI_REK.REK_LAIN.VALUE) {
                    flagMenu = GLOBALS.CEK_MUTASI_REK.REK_LAIN.STEP.STEP_1
                    var buttons =[GLOBALS.BUTTON.BATAL];
                    var message = String.raw`Ketik nomor rek. kamu pada aplikasi ini. Nomor rekening yang diketik adalah nomor rekening yang terhubung ke kartu ATM yang sama dengan nomor rekening utama`;
                    var messages = util.msg_buttons_without_pict_title(buttons, message);
                    util.post(userId, messages);
                } else if(flagMenu === GLOBALS.CEK_MUTASI_REK.REK_LAIN.STEP.STEP_1) {
                    var myMessages = String.raw`22/09 ETR Rp. 37,000.00 DB Naomi\n20/09 ETR Rp. 50,000.00 DB\n13/09 EPY Rp. 40,500.00 DB\n09/09 EPY Rp. 42,500.00 DBB`;
                    var messages = util.msg_type_basic_text(myMessages);
                    util.post(userId, messages);
                    resetFlag();
                }
                /* END OF MUTASI */
                
                /* REGISTRASI KARTU KREDIT */
                if(flagMenu === GLOBALS.MENU.REG_KK) {
                    flagMenu = GLOBALS.REG_KK.STEP_1;
                    var buttons =[GLOBALS.BUTTON.BATAL];
                    var message = String.raw`Silakan ketik nomor kartu kredit kamu pada aplikasi ini`;
                    var messages = util.msg_buttons_without_pict_title(buttons, message);
                    util.post(userId, messages);
                } else if(flagMenu === GLOBALS.REG_KK.STEP_1) {
                    var bodyMessage = String.raw`Registrasi info kartu kredit BCA sudah selesai.\n\nProses persetujuan registrasi maksimal 3 hari kerja.`;
                    var messages = util.msg_type_basic_text(bodyMessage);
                    util.post(userId, messages);
                    resetFlag();
                }
                /* END OF REGISTRASI KARTU KREDIT */
                
                
                /* TUTUP LAYANAN */
                if(flagMenu === GLOBALS.MENU.TUTUP_LAYANAN.VALUE) {
                    var buttons =["Ya", "Tidak"];
                    var bodyMessage = String.raw`Apakah  kamu yakin?`;
                    var messages = util.msg_confirm(buttons, bodyMessage);
                    util.post(userId, messages);
                } else if(flagMenu === GLOBALS.TUTUP_LAYANAN.YA.VALUE) {
                    var bodyMessage = String.raw`Kamu sudah tidak terdaftar pada layanan BCA Chat Banking.\n\nTerima kasih telah menggunakan layanan BCA Chat Banking.`;
                    var messages = util.msg_type_basic_text(bodyMessage);
                    util.post(userId, messages);
                    resetFlag();
                } else if(flagMenu === GLOBALS.TUTUP_LAYANAN.TIDAK.VALUE) {
                    flagMenu = GLOBALS.DEFAULT_MESSAGE.MSG_1;
                }
                /* END OF TUTUP LAYANAN */


                /* DEFAULT MESSAGE */
                if(flagMenu === GLOBALS.DEFAULT_MESSAGE.MSG_1) {
                    var bodyMessage = String.raw`Silakan pilih transaksi yang ingin dilakukan dengan menekan tombol di bawah ini.`;
                    var messages = util.msg_type_basic_text(bodyMessage);
                    util.post(userId, messages);
                    resetFlag();
                }
                /* END OF DEFAULT MESSAGE */

            })
        }
        

    }
    catch (e) {
      console.log("entering catch block");
      console.log(e);
      console.log("leaving catch block");
    }
    finally {
      console.log("entering and leaving the finally block");
      console.log("LINE FINISH");
    }



    response.end('LINE It Works!! Path Hit: ' + request.url);
}

//Create a server
// var server = http.createServer(handleRequest);

// //Lets start our server
// server.listen(PORT, function(){
//     //Callback triggered when server is successfully listening. Hurray!
//     console.log("Server listening on: http://localhost:%s", PORT);
// });

module.exports = router;