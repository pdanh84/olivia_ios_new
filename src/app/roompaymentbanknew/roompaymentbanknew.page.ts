import { Bookcombo, SearchHotel } from './../providers/book-service';
import { Component, NgZone, OnInit } from '@angular/core';
import {  NavController ,LoadingController,Platform, ToastController} from '@ionic/angular';
import { Booking, RoomInfo } from '../providers/book-service';

import { Storage } from '@ionic/storage';
import { C } from '../providers/constants';
import { GlobalFunction, ActivityService } from '../providers/globalfunction';
import { InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';
import { voucherService } from '../providers/voucherService';
@Component({
  selector: 'app-roompaymentbanknew',
  templateUrl: './roompaymentbanknew.page.html',
  styleUrls: ['./roompaymentbanknew.page.scss'],
})
export class RoompaymentbanknewPage implements OnInit {

  ischeckvcbactive = true; ischeckvcb; ischeckacb; ischeckacbactive; ischeckvietin; ischeckvietinactive; ischecktechcom; ischecktechcomactive;
  ischeckdongaactive; ischeckdonga; ischeckagri; ischeckagriactive; ischeckbidv; ischeckbidvactive; ischecksacom; ischecksacomactive;
  text; ischecktext; ischecktextend; isenabled = true; input; ischeck; isenabledbtn; timestamp; paymentMethod; room; jsonroom;ischeckhdactive;ischeckhd;
  ischeckscbactive;ischeckscb;ischeckocbactive=false;ischeckocb
  public loader:any;
  auth_token: any='';
  rowoneactive = false;
  rowtwoactive = false;
  rowthreeactive = false;
  totalPrice: any;
  textbank: string='';
  bookingCode: any;
  bankName: string;
  accountNumber: string;
  bankBranch: string;
  roomtype;PriceAvgPlusTAStr;priceshow;
  jti: any;
  constructor(public platform: Platform,public Roomif: RoomInfo, public zone: NgZone, public storage: Storage, 
    public navCtrl: NavController, public booking: Booking, public loadingCtrl: LoadingController,
    public gf: GlobalFunction, private toastCtrl: ToastController,public bookCombo:Bookcombo,
    public activityService: ActivityService,
    public iab: InAppBrowser,
    public clipboard: Clipboard,
    public searchhotel: SearchHotel,
    public _voucherService: voucherService) {
    this.ischeckvietin = true;
    this.ischeckacb = true;
    this.ischecktechcom = true;
    this.ischeckdonga = true;
    this.ischeckagri = true;
    this.ischeckbidv = true;
    this.ischecksacom = true;
    this.ischecktextend = false;
    this.ischecktext = true;
    this.ischeckscb=true;
    this.ischeckocb = true;
    this.text = "";
    this.isenabledbtn = false;
    this.ischeckvcbactive = true;
    this.ischeckhd=true;
    this.paymentMethod = "42";
    this.text = "Ngân hàng Thương Mại Cổ Phần Ngoại Thương Việt Nam (VCB)<br>Chi nhánh Tp. Hồ Chí Minh<br>Số TK: <b>007 1000 895 230</b><a class='text-copy' (click)='copyClipboard(1)'>Sao chép</a> <br>Người thụ hưởng: Công ty Cổ Phần IVIVU.COM <a class='text-copy' (click)='copyClipboard(1)'>Sao chép</a> <br>Nội dung thanh toán: <b>{{totalPrice}}</b><a class='text-copy' (click)='copyClipboard(1)'>Sao chép</a> </li>";
    this.bankBranch = "Chi nhánh Tp. Hồ Chí Minh";
    this.accountNumber = "007 1000 895 230";
    this.room = Roomif.arrroom;
    this.jsonroom = {...Roomif.jsonroom};
    this.rowoneactive = true;
    this.textbank = "Vietcombank";
    this.bankName = "Ngân hàng Thương Mại Cổ Phần Ngoại Thương Việt Nam (VCB)";
    this.roomtype = Roomif.roomtype;
    this.PriceAvgPlusTAStr = this.roomtype.PriceAvgPlusTAStr;
    if (Roomif.priceshow) {
      this.priceshow = Roomif.priceshow;
    }
    else {
      this.priceshow = this.PriceAvgPlusTAStr;
    }
    this.storage.get('jti').then(jti => {
      if (jti) {
        this.jti = jti;
      }
    })
    //gf.googleAnalytion('roompaymentbank','load','');
    this.searchhotel.paymentType = 'banktransfer';
    this.gf.logEventFirebase(this.searchhotel.paymentType,this.searchhotel, 'roompaymentselect-ean', 'add_payment_info', 'Hotels');
  }
  ngOnInit() {
  }
  ionViewWillEnter(){
    this.storage.get('auth_token').then(auth_token => {
      this.auth_token = auth_token;
      })
  }
  acb() {
    this.zone.run(() => {
      this.ischeckacbactive = true;

      this.ischeckacb = false;
      this.ischeckvietinactive = false;
      this.ischecktechcomactive = false;
      this.ischeckdongaactive = false;
      this.ischeckbidvactive = false;
      this.ischecksacomactive = false;
      this.ischeckagriactive = false;
      this.ischeckvcbactive = false;
      this.ischeckscbactive=false;
      this.ischeckhdactive=false;

      this.ischeckocbactive = false;
      this.ischeckocb = true;

      this.ischeckvietin = true;
      this.ischecktechcom = true;
      this.ischeckdonga = true;
      this.ischeckbidv = true;
      this.ischecksacom = true;
      this.ischeckagri = true;
      this.ischeckvcb = true;
      this.ischeckscb=true;
      this.ischeckhd=true;
      this.text = "Ngân hàng Á Châu (ACB)<br>Chi nhánh Tp. Hồ Chí Minh<br>Số TK: <b>190862589</b><br>Chủ TK: <b>Công ty Cổ Phần IVIVU.COM</b></li>";
      this.ischecktextend = false;
      this.ischecktext = true;
      this.isenabledbtn = false;
      this.paymentMethod = "41";

      this.rowoneactive =true;
      this.rowtwoactive = false;
      this.rowthreeactive = false;
      this.textbank = "ACB";
      this.bankName = "Ngân hàng TMCP Á Châu (ACB)";
      this.bankBranch = "Chi nhánh Tp. Hồ Chí Minh";
      this.accountNumber = "190862589";
    })

  }
  vcb() {
    this.zone.run(() => {
      this.ischeckvcbactive = true;

      this.ischeckvcb = false;
      this.ischeckvietinactive = false;
      this.ischecktechcomactive = false;
      this.ischeckdongaactive = false;
      this.ischeckbidvactive = false;
      this.ischecksacomactive = false;
      this.ischeckagriactive = false;
      this.ischeckacbactive = false;
      this.ischeckscbactive=false;
      this.ischeckhdactive=false;

      this.ischeckocbactive = false;
      this.ischeckocb = true;

      this.ischeckvietin = true;
      this.ischecktechcom = true;
      this.ischeckdonga = true;
      this.ischeckbidv = true;
      this.ischecksacom = true;
      this.ischeckagri = true;
      this.ischeckacb = true;
      this.ischeckscb=true;
      this.ischeckhd=true;
      this.ischecktextend = false;
      this.ischecktext = true;
      this.text = "Ngân hàng Thương Mại Cổ Phần Ngoại Thương Việt Nam (VCB)<br>Chi nhánh Tp. Hồ Chí Minh<br>Số TK: <b>007 1000 895 230</b><a class='text-copy' (click)='copyClipboard(1)'>Sao chép</a> <br>Người thụ hưởng: Công ty Cổ Phần IVIVU.COM <a class='text-copy' (click)='copyClipboard(1)'>Sao chép</a> <br>Nội dung thanh toán: <b>{{totalPrice}}</b><a class='text-copy' (click)='copyClipboard(1)'>Sao chép</a> </li>";
      this.isenabledbtn = false;
      this.paymentMethod = "42";
      this.rowoneactive =true;
      this.rowtwoactive = false;
      this.rowthreeactive = false;
      this.textbank = "Vietcombank";
      this.bankName = "Ngân TMCP Ngoại Thương Việt Nam (VCB)";
      this.bankBranch = "Chi nhánh Tp. Hồ Chí Minh";
      this.accountNumber = "007 1000 895 230";
    })

  }
  vietin() {
    this.zone.run(() => {
      this.ischeckvietinactive = true;

      this.ischeckvcbactive = false;
      this.ischecktechcomactive = false;
      this.ischeckdongaactive = false;
      this.ischeckbidvactive = false;
      this.ischecksacomactive = false;
      this.ischeckagriactive = false;
      this.ischeckacbactive = false;
      this.ischeckvietin = false;
      this.ischeckscbactive=false;
      this.ischeckhdactive=false;

      this.ischeckocbactive = false;
      this.ischeckocb = true;

      this.ischeckvcb = true;
      this.ischecktechcom = true;
      this.ischeckdonga = true;
      this.ischeckbidv = true;
      this.ischecksacom = true;
      this.ischeckagri = true;
      this.ischeckacb = true;
      this.ischeckscb=true;
      this.ischeckhd=true;
      this.text = "NH VietinBank<br>Chi Nhánh 03, Tp.HCM<br>Số TK: <b>1110 0014 2852</b><br>Chủ TK: <b>Công ty Cổ Phần IVIVU.COM</b>";
      this.ischecktextend = false;
      this.ischecktext = true;
      this.isenabledbtn = false;
      this.paymentMethod = "45";

      this.rowoneactive =true;
      this.rowtwoactive = false;
      this.rowthreeactive = false;
      this.textbank = "Viettinbank";
      this.bankName = "Ngân hàng TMCP Công thương Việt Nam VietinBank";
      this.bankBranch = "Chi Nhánh 03, Tp.HCM";
      this.accountNumber = "1110 0014 2852";
    })

  }
  techcom() {
    this.zone.run(() => {
      this.ischecktechcomactive = true;

      this.ischeckvcbactive = false;
      this.ischeckvietinactive = false;
      this.ischeckdongaactive = false;
      this.ischeckbidvactive = false;
      this.ischecksacomactive = false;
      this.ischeckagriactive = false;
      this.ischeckacbactive = false;
      this.ischecktechcom = false;
      this.ischeckscbactive=false;
      this.ischeckhdactive=false;

      this.ischeckocbactive = false;
      this.ischeckocb = true;

      this.ischeckvcb = true;
      this.ischeckvietin = true;
      this.ischeckdonga = true;
      this.ischeckbidv = true;
      this.ischecksacom = true;
      this.ischeckagri = true;
      this.ischeckacb = true;
      this.ischeckscb=true;
      this.ischeckhd=true;
      this.text = "NH TMCP Kỹ Thương Việt Nam (Techcombank)<br>Chi nhánh Trần Quang Diệu, Tp.HCM<br>Số TK: <b>19128840912016</b><br>Chủ TK: <b>Công ty Cổ Phần IVIVU.COM</b>"
      this.ischecktextend = false;
      this.ischecktext = true;
      this.isenabledbtn = false;
      this.paymentMethod = "44";

      this.rowoneactive =true;
      this.rowtwoactive = false;
      this.rowthreeactive = false;
      this.textbank = "Techcombank";
      this.bankName = "NH TMCP Kỹ Thương Việt Nam (Techcombank)";
      this.bankBranch = "Chi nhánh Trần Quang Diệu, Tp.HCM";
      this.accountNumber = "19128840912016";
    })

  }

  donga() {
    this.zone.run(() => {
      this.ischeckdongaactive = true;

      this.ischeckvcbactive = false;
      this.ischeckvietinactive = false;
      this.ischecktechcomactive = false;
      this.ischeckbidvactive = false;
      this.ischecksacomactive = false;
      this.ischeckagriactive = false;
      this.ischeckacbactive = false;
      this.ischeckdonga = false;
      this.ischeckscbactive=false;
      this.ischeckhdactive=false;

      this.ischeckocbactive = false;
      this.ischeckocb = true;

      this.ischeckvcb = true;
      this.ischeckvietin = true;
      this.ischecktechcom = true;
      this.ischeckbidv = true;
      this.ischecksacom = true;
      this.ischeckagri = true;
      this.ischeckacb = true;
      this.ischeckscb=true;
      this.ischeckhd=true;
      this.ischecktextend = true;
      this.ischecktext = false;
      this.text = "NH TMCP Đông Á (DongABank)<br>Chi nhánh Lê Văn Sỹ, Tp.HCM<br>Số TK: <b>0139 9166 0002</b><br>Chủ TK: <b>Công ty Cổ Phần IVIVU.COM</b>";
      this.isenabledbtn = false;
      this.paymentMethod = "43";

      this.rowoneactive = false;
      this.rowtwoactive = true;
      this.rowthreeactive = false;
      this.textbank = "dongabank";
      this.bankName = "NH TMCP Đông Á (DongABank)";
      this.bankBranch = "Chi nhánh Lê Văn Sỹ, Tp.HCM";
      this.accountNumber = "0139 9166 0002";
    })

  }

  agri() {
    this.zone.run(() => {
      this.ischeckagriactive = true;

      this.ischeckvcbactive = false;
      this.ischeckvietinactive = false;
      this.ischecktechcomactive = false;
      this.ischeckbidvactive = false;
      this.ischecksacomactive = false;
      this.ischeckdongaactive = false;
      this.ischeckacbactive = false;
      this.ischeckagri = false;
      this.ischeckscbactive=false;
      this.ischeckhdactive=false;

      this.ischeckocbactive = false;
      this.ischeckocb = true;

      this.ischeckvcb = true;
      this.ischeckvietin = true;
      this.ischecktechcom = true;
      this.ischeckbidv = true;
      this.ischecksacom = true;
      this.ischeckdonga = true;
      this.ischeckacb = true;
      this.ischeckscb=true;
      this.ischeckhd=true;
      this.ischecktextend = true;
      this.ischecktext = false;
      this.text = "NH Agribank<br>Chi Nhánh 03, Tp.HCM<br>Số TK: <b>160 2201 361 086</b><br>Chủ TK: <b>Công ty Cổ Phần IVIVU.COM</b>";
      this.isenabledbtn = false;
      this.paymentMethod = "47";
      
      this.rowoneactive = false;
      this.rowtwoactive = true;
      this.rowthreeactive = false;
      this.textbank = "Agribank";
      this.bankName = "Ngân hàng Agribank";
      this.bankBranch = "Chi Nhánh 03, Tp.HCM";
      this.accountNumber = "160 2201 361 086";
    })

  }

  bidv() {
    this.zone.run(() => {
      this.ischeckbidvactive = true;

      this.ischeckvcbactive = false;
      this.ischeckvietinactive = false;
      this.ischecktechcomactive = false;
      this.ischeckagriactive = false;
      this.ischecksacomactive = false;
      this.ischeckdongaactive = false;
      this.ischeckacbactive = false;
      this.ischeckbidv = false;
      this.ischeckscbactive=false;
      this.ischeckhdactive=false;

      this.ischeckocbactive = false;
      this.ischeckocb = true;

      this.ischeckvcb = true;
      this.ischeckvietin = true;
      this.ischecktechcom = true;
      this.ischeckagri = true;
      this.ischecksacom = true;
      this.ischeckdonga = true;
      this.ischeckacb = true;
      this.ischeckscb=true;
      this.ischeckhd=true;
      this.ischecktextend = true;
      this.ischecktext = false;
      this.text = "NH TM CP Đầu Tư và Phát Triển Việt Nam (BIDV)<br>Chi Nhánh 02, Tp.HCM<br>Số TK: <b>130 147 4890</b><br>Chủ TK: <b>Công ty Cổ Phần IVIVU.COM</b>";
      this.isenabledbtn = false;
      this.paymentMethod = "48";
      
      this.rowoneactive = false;
      this.rowtwoactive = true;
      this.rowthreeactive = false;
      this.textbank = "BIDV";
      this.bankName = "NH TM CP Đầu Tư và Phát Triển Việt Nam (BIDV)";
      this.bankBranch = "Chi Nhánh 02, Tp.HCM";
      this.accountNumber = "130 147 4890";
    })

  }

  sacom() {
    this.zone.run(() => {
      this.ischecksacomactive = true;

      this.ischeckvcbactive = false;
      this.ischeckvietinactive = false;
      this.ischecktechcomactive = false;
      this.ischeckagriactive = false;
      this.ischeckbidvactive = false;
      this.ischeckdongaactive = false;
      this.ischeckacbactive = false;
      this.ischecksacom = false;
      this.ischeckscbactive=false;
      this.ischeckhdactive=false;
      
      this.ischeckocbactive = false;
      this.ischeckocb = true;

      this.ischeckvcb = true;
      this.ischeckvietin = true;
      this.ischecktechcom = true;
      this.ischeckagri = true;
      this.ischeckbidv = true;
      this.ischeckdonga = true;
      this.ischeckacb = true;
      this.ischeckscb=true;
      this.ischeckhd=true;
      this.ischecktextend = true;
      this.ischecktext = false;
      this.text = "Ngân Hàng TMCP Sài Gòn Thương Tín (Sacombank)<br>Chi nhánh Cao Thắng, Tp.HCM<br>Số TK: <b>060 0952 73354</b><br>Chủ TK: <b>Công ty Cổ Phần IVIVU.COM</b>";
      this.isenabledbtn = false;
      this.paymentMethod = "46";
      
      this.rowoneactive = false;
      this.rowtwoactive = true;
      this.rowthreeactive = false;
      this.textbank = "Sacombank";
      this.bankName = "Ngân Hàng TMCP Sài Gòn Thương Tín (Sacombank)";
      this.bankBranch = "Chi nhánh Cao Thắng, Tp.HCM";
      this.accountNumber = "060 0952 73354";
    })

  }
  hd() {
    this.zone.run(() => {
      this.ischeckhdactive = true;

      this.ischeckvcbactive = false;
      this.ischeckvietinactive = false;
      this.ischecktechcomactive = false;
      this.ischeckagriactive = false;
      this.ischeckbidvactive = false;
      this.ischeckdongaactive = false;
      this.ischeckacbactive = false;
      this.ischeckhd = false;
      this.ischecksacomactive = false;
      this.ischeckscbactive = false;
      
      this.ischeckocbactive = false;
      this.ischeckocb = true;

      this.ischeckvcb = true;
      this.ischeckvietin = true;
      this.ischecktechcom = true;
      this.ischeckagri = true;
      this.ischeckbidv = true;
      this.ischeckdonga = true;
      this.ischeckacb = true;
      this.ischecksacom = true;
      this.ischeckscb = true;
      this.ischecktextend = true;
      this.ischecktext = false;
      this.text = "Ngân hàng HDBANK<br>Chi nhánh Sài gòn<br>Số TK: <b>052704070018649</b><br>Chủ TK: <b>Công ty Cổ Phần IVIVU.COM</b>";
      this.isenabledbtn = false;
      this.paymentMethod = "50";

      this.rowoneactive = false;
      this.rowtwoactive = false;
      this.rowthreeactive = true;
      this.textbank = "HDBank";
      this.bankName = "Ngân hàng HDBANK";
      this.bankBranch = "Chi nhánh Sài gòn";
      this.accountNumber = "052704070018649";
    })

  }
  scb() {
    this.zone.run(() => {
      this.ischeckscbactive = true;

      this.ischeckvcbactive = false;
      this.ischeckvietinactive = false;
      this.ischecktechcomactive = false;
      this.ischeckagriactive = false;
      this.ischeckbidvactive = false;
      this.ischeckdongaactive = false;
      this.ischeckacbactive = false;
      this.ischecksacom = false;
      this.ischeckscb = false;
      this.ischecksacomactive = false;
      this.ischeckhdactive = false;
      
      this.ischeckocbactive = false;
      this.ischeckocb = true;

      this.ischeckvcb = true;
      this.ischeckvietin = true;
      this.ischecktechcom = true;
      this.ischeckagri = true;
      this.ischeckbidv = true;
      this.ischeckdonga = true;
      this.ischeckacb = true;
      this.ischecksacom = true;
      this.ischeckhd = true;
      this.ischecktextend = true;
      this.ischecktext = false;
      this.text = "Ngân Hàng Sài Gòn (SCB)<br>Chi nhánh Phú Đông<br>Số TK: <b>023 0109 7937 00001</b><br>Chủ TK: <b>Công ty Cổ Phần IVIVU.COM</b>";
      this.isenabledbtn = false;
      this.paymentMethod = "49";
      
      this.rowoneactive = false;
      this.rowtwoactive = false;
      this.rowthreeactive = true;
      this.textbank = "SCB";
      this.bankName = "Ngân Hàng Sài Gòn (SCB)";
      this.bankBranch = "Chi nhánh Phú Đông";
      this.accountNumber = "023 0109 7937 00001";
    })

  }
  ocb() {
    this.zone.run(() => {
      this.ischeckocbactive = true;

      this.ischeckvcbactive = false;
      this.ischeckvietinactive = false;
      this.ischecktechcomactive = false;
      this.ischeckagriactive = false;
      this.ischeckbidvactive = false;
      this.ischeckdongaactive = false;
      this.ischeckacbactive = false;
      this.ischecksacom = false;
      this.ischeckscb = false;
      this.ischecksacomactive = false;
      this.ischeckhdactive = false;
      this.ischeckscbactive = false;

      this.ischeckvcb = true;
      this.ischeckvietin = true;
      this.ischecktechcom = true;
      this.ischeckagri = true;
      this.ischeckbidv = true;
      this.ischeckdonga = true;
      this.ischeckacb = true;
      this.ischecksacom = true;
      this.ischeckhd = true;
      this.ischeckscb = true;
      this.ischeckocb = false;
      this.ischecktextend = true;
      this.ischecktext = false;
      //this.text = "Ngân Hàng Sài Gòn (SCB)<br>Chi nhánh Phú Đông<br>Số TK: <b>023 0109 7937 00001</b><br>Chủ TK: <b>Công ty Cổ Phần IVIVU.COM</b>";
      this.isenabledbtn = false;
      this.paymentMethod = "53";

      this.rowoneactive = false;
      this.rowtwoactive = false;
      this.rowthreeactive = true;
      this.textbank = "OCB";
      this.bankName = "Ngân hàng Phương Đông (OCB)";
      this.bankBranch = "Chợ Lớn, TP.HCM";
      this.accountNumber = "001 7101 6190 02045";
    })

  }
  next() {
    let se = this;
    if(se.Roomif.roomtype.Supplier == 'SERI'){
      se.gf.checkAllotmentSeri(
        se.booking.HotelId,
        se.Roomif.RoomId,
        se.booking.CheckInDate,
        se.booking.CheckOutDate,
        se.Roomif.roomnumber,
        'SERI', se.Roomif.roomtype.HotelCheckDetailTokenInternal
        ).then((allow)=> {
          if(allow){
            se.continueBook();
          }
          else{
            if (se.loader) {
              se.loader.dismiss();
            }
              se.gf.showToastWarning('Hiện tại khách sạn đã hết phòng loại này.');
            }
          })
    }else{
      se.continueBook();
    }
  }

  continueBook() {
    var se = this;
    this.presentLoading();
    //Nếu không phải thanh toán từ mytrip thì theo luồng cũ
        if (se.booking.CEmail) {
            this.jsonroom.RoomClasses=this.room;
            this.timestamp = Date.now();
            var Invoice=0;
            if (se.Roomif.order) {
              Invoice=1;
            }
            let voucherSelectedMap = this._voucherService.voucherSelected.map(v => {
              let newitem = {};
              newitem["voucherCode"] = v.code;
              newitem["voucherName"] = v.rewardsItem.title;
              newitem["voucherType"] = v.applyFor || v.rewardsItem.rewardsType;
              newitem["voucherDiscount"] = v.rewardsItem.price;
              newitem["keepCurrentVoucher"] = false;
              return newitem;
            });
            let promoSelectedMap = this._voucherService.listObjectPromoCode.map(v => {
              let newitem = {};
              newitem["voucherCode"] = v.code;
              newitem["voucherName"] = v.name;
              newitem["voucherType"] = 2;
              newitem["voucherDiscount"] = v.price;
              newitem["keepCurrentVoucher"] = false;
              return newitem;
            });
            let checkpromocode = this._voucherService.voucherSelected && this._voucherService.voucherSelected.length ==0 && this._voucherService.listObjectPromoCode && this._voucherService.listObjectPromoCode.length ==0;
            let arrpromocode = this.Roomif.promocode ?[{"voucherCode": this.Roomif.promocode, "voucherName": this.Roomif.promocode,"voucherType": 1,"voucherDiscount": this.Roomif.priceshow ,"keepCurrentVoucher": false  }] : [];
        
            let body =
            {
              RoomClassObj : se.jsonroom.RoomClasses[0].ListObjRoomClass,
              CName: se.Roomif.hoten,
              CEmail: se.booking.CEmail,
              CPhone: se.Roomif.phone,
              timestamp: se.timestamp,
              HotelID: se.booking.HotelId,
              paymentMethod: se.paymentMethod,
              note:se.Roomif.notetotal,
              source  :'6',
              MemberToken: se.auth_token,
              CustomersStr: JSON.stringify(se.Roomif.arrcustomer),
              UsePointPrice:se.Roomif.pricepoint,
              NoteCorp:se.Roomif.order,
              Invoice:Invoice,
              UserPoints:se.Roomif.point,
              CheckInDate: se.jsonroom.CheckInDate,
              CheckOutDate: se.jsonroom.CheckOutDate,
              TotalNight: se.jsonroom.TotalNight,
              MealTypeIndex : se.booking.indexmealtype,
              CompanyName:se.Roomif.companyname,
              CompanyAddress:se.Roomif.address,
              CompanyTaxCode:se.Roomif.tax,
              BillingAddress :se.Roomif.addressorder,
              //promotionCode:se.Roomif.promocode,
              comboid:se.bookCombo.ComboId,
              PenaltyDescription:se.Roomif.textcancel,
              companycontactname: this.Roomif.nameOrder,
              vouchers : !checkpromocode ? [...voucherSelectedMap,...promoSelectedMap] : arrpromocode,
            };
            let headers = {'content-type': 'application/json'};
          let strUrl = C.urls.baseUrl.urlPost +'/mInsertBooking';
          this.gf.RequestApi('POST', strUrl, headers, body, 'roompaymentbanknew', 'next').then((data)=>{
              if (data) {
                if (data.error == 0) {
                  se.loader.dismiss();
                  //thông tin bank
                  se.Roomif.accountNumber = se.accountNumber;
                  se.Roomif.textbank = se.textbank;
                  se.Roomif.bankName = se.bankName;
                  se.Roomif.bankBranch = se.bankBranch;
                  se.Roomif.paymentbank=se.paymentMethod;
                  se.Roomif.bookingCode = data.code;
                let totalprice = '';
                  if (se.Roomif.priceshow) {
                    totalprice= se.Roomif.priceshow;
                  }
                  else
                  {
                    totalprice=(se.Roomif.roomtype as any).PriceAvgPlusTAStr;
                  }
                  if(se.jti){
                    let url  = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=tranfer&BanksTranfer='+se.textbank+'&source=app&amount=' + totalprice.toString().replace(/\./g, '').replace(/\,/g, '') + '&orderCode=' + data.code + '&memberId=' + se.jti + '&buyerPhone=' + se.Roomif.phone;
                    se.gf.CreateUrl(url);
                  }
                  se.activityService.bankName = se.bankName;
                  se.activityService.bankTransfer = se.textbank;
                  se.activityService.bankAccount = se.accountNumber;
                  se.activityService.totalPriceTransfer = totalprice;
                  se.activityService.bookingCode = data.code;
                  se.activityService.qrcodepaymentfrom = 2;
                  if (se.Roomif.notetotal) {
                    se.gf.CreateSupportRequest(data.code,se.booking.CEmail,se.Roomif.hoten,se.Roomif.phone,se.Roomif.notetotal);
                  }
                  se.navCtrl.navigateForward('/paymentqrcode');
                }
                else{
                  se.loader.dismiss();
                  alert(data.Msg);
                }
              }
              else{
                // error.page = "roompaymentbank";
                // error.func = "next";
                // error.param = JSON.stringify(options);
                // C.writeErrorLog(error,response);
                se.loader.dismiss();
                se.gf.showAlertMessageOnly("Đã có sự cố xảy ra, vui lòng thử lại!");
              }
            });
         
        }else{
          se.loader.dismiss();
          se.presentToastr('Email không hợp lệ. Vui lòng kiểm tra lại.');
          }
        }
  
  select() {
    this.navCtrl.back();
  }
  check() {
    if (this.ischeck) {
      this.isenabled = false;
    } else {
      this.isenabled = true;
    }
  }
  // async presentLoading() {
  //   let loader = await this.loadingCtrl.create({
  //     message: "Đang xử lý...",
  //   });
  //   loader.present();
  // }
  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
    });
    this.loader.present();
  }
  goback(){
    this.navCtrl.back();
    this.activityService.objPaymentMytrip = null;
  }
  async presentToastr(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  openPaymentLink(){
    var se = this, bankid=-1, url='';
    //thanh toán vietcombank
    if(se.ischeckvcbactive){
      bankid = 1;
      url = 'https://www.vietcombank.com.vn/IBanking2020';
    }
    //thanh toán acb
    else if(se.ischeckacbactive){
      url= 'https://online.acb.com.vn/acbib';
    }
    //thanh toán vietinbank
    else if(se.ischeckvietinactive){
      bankid = 4;
      url= 'https://ebanking.vietinbank.vn/rcas';
    }
    //thanh toán techcombank
    else if(se.ischecktechcomactive){
      bankid = 2;
      url='https://ib.techcombank.com.vn/servlet/BrowserServlet';
    }
    //thanh toán dongabank
    else if(se.ischeckdongaactive){
      bankid = 6;
      url='https://ebanking.dongabank.com.vn/khcn/';
    }
    //thanh toán agribank
    else if(se.ischeckagriactive){
      bankid = 24;
      url='https://ibank.agribank.com.vn/ibank';
    }
    //thanh toán bidv
    else if(se.ischeckbidvactive){
      bankid = 19;
      url='https://www.bidv.vn:81/iportalweb/iRetail@1';
    }
    //thanh toán sacombank
    else if(se.ischecksacomactive){
      bankid = 16;
      url='https://www.isacombank.com.vn/corp/AuthenticationController?FORMSGROUP_ID__=AuthenticationFG&__START_TRAN_FLAG__=Y&FG_BUTTONS__=LOAD&ACTION.LOAD=Y&AuthenticationFG.LOGIN_FLAG=1&BANK_ID=303&LANGUAGE_ID=003';
    }
    //thanh toán hdbank
    else if(se.ischeckhdactive){
      bankid = 7;
      url='https://ebanking.hdbank.vn/ipc/vi/';
    }
    //thanh toán scb
    else if(se.ischeckscbactive){
      bankid = 25;
      url='https://ebanking.scb.com.vn/?module=login';
    }

    if(bankid){
      // se.activityService.objPaymentMytrip.book = {
      //   code: se.activityService.objPaymentMytrip.trip.HotelIdERP,
      //   timestamp: se.timestamp,
      //   cost: se.activityService.objPaymentMytrip.trip.amount_after_tax,
      //   BanhkID: bankid,
      //   paymentType: "1"
      // }
      // var url = C.urls.baseUrl.urlPayment + "/Home/PaymentAppEan?info=" + JSON.stringify(se.activityService.objPaymentMytrip.book);

      se.openWebpage(url);
    }else{
      se.gf.showToastWarning('Vui lòng chọn ngân hàng thanh toán.');
    }
    
  }

  openWebpage(url: string) {
    var se = this;
    const options: InAppBrowserOptions = {
      zoom: 'no',
      location: 'yes',
      toolbar: 'yes',
      hideurlbar: 'yes',
      closebuttoncaption: 'Đóng',
      hidenavigationbuttons: 'yes'
    };
    const browser = this.iab.create(url, '_self', options);
    //const browser:any = se.iab.open(url, '_self', "zoom=no; location=yes; toolbar=yes; hideurlbar=yes; closebuttoncaption=Đóng");
    browser.on('exit').subscribe(() => {
      // var options = {
      //   method: 'GET',
      //   url: C.urls.baseUrl.urlPost + '/mCheckBooking',
      //   qs: { code: se.activityService.objPaymentMytrip.trip.code },
      //   headers:
      //   {
      //   }
      // };
      let headers = {'content-type': 'application/json'};
          let strUrl = C.urls.baseUrl.urlPost + '/mCheckBooking&code=' + se.activityService.objPaymentMytrip.trip.code;
          this.gf.RequestApi('GET', strUrl, headers, {}, 'roompaymentbanknew', 'openWebpage').then((data)=>{
        if (data) {
          var rs = data;
          if (rs.StatusBooking == 3) {
            var id = rs.BookingCode;
            var total = se.activityService.objPaymentMytrip.trip.priceShow;
            se.Roomif.priceshowtt = se.activityService.objPaymentMytrip.trip.priceShow;
            var ischeck = '0';
            se.activityService.objPaymentMytrip.trip.payment_status = 1;
          }
          else {
            se.gf.showAlertMessageOnly("Hiện tại, giao dịch của bạn hết hiệu lực, xin vui lòng thử lại sau!");
          }
        }
        else {
          // error.page = "roomchoosebank";
          // error.func = "mCheckBooking";
          // error.param = JSON.stringify(options);
          // C.writeErrorLog(error, response);
          se.gf.showAlertMessageOnly("Đã có sự cố xảy ra, vui lòng thử lại!");
        }

      });
      se.navCtrl.navigateBack(['/app/tabs/tab3/']);
    }, err => {
      console.error(err);
    });
    browser.show();

  }
}

