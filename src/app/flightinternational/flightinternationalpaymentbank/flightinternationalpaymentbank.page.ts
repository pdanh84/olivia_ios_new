
import { Bookcombo } from './../../providers/book-service';
import { Component, NgZone, OnInit } from '@angular/core';
import {  NavController ,LoadingController,Platform, ToastController,ModalController} from '@ionic/angular';
import { Booking, RoomInfo } from '../../providers/book-service';
import { Storage } from '@ionic/storage';
import { GlobalFunction, ActivityService } from '../../providers/globalfunction';

import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';
import { C } from './../../providers/constants';

import { flightService } from '../../providers/flightService';
import { FlightquickbackPage } from '../../flightquickback/flightquickback.page';
import { CustomAnimations } from '../../providers/CustomAnimations';
import * as moment from 'moment';
import { voucherService } from '../../providers/voucherService';
@Component({
  selector: 'app-flightinternationalpaymentbank',
  templateUrl: './flightinternationalpaymentbank.page.html',
  styleUrls: ['./flightinternationalpaymentbank.page.scss'],
})
export class FlightInternationalPaymentBankPage implements OnInit {
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
  isPaymentFromMytrip: boolean = false;
  bankid: number;
  bankTransfer: string;
  allowCheckHoldTicket: boolean=true;
  jti: any;
  constructor(public platform: Platform,public Roomif: RoomInfo, public zone: NgZone, public storage: Storage, 
    public navCtrl: NavController, public booking: Booking, public loadingCtrl: LoadingController,
    public gf: GlobalFunction, private toastCtrl: ToastController,public bookCombo:Bookcombo,
    public activityService: ActivityService,
    public _voucherService: voucherService,
    public clipboard: Clipboard,public _flightService: flightService,private modalCtrl: ModalController) {
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
    this.room = Roomif.arrroom;
    this.jsonroom = {...Roomif.jsonroom};
    this.rowoneactive = true;
    this.textbank = "Vietcombank";
    this.bankName = "Ngân hàng Thương Mại Cổ Phần Ngoại Thương Việt Nam (VCB)";
    this.bankBranch = "Chi nhánh Tp. Hồ Chí Minh";
    this.accountNumber = "007 1000 895 230";
    this.bankTransfer = "Vietcombank";
    this.bookingCode = this._flightService.itemFlightCache.pnr.resNo;

    this.storage.get('jti').then(jti => {
      if (jti) {
        this.jti = jti;
      }
    })
  }
  ngOnInit() {
  }
  ionViewWillEnter(){
    this.storage.get('auth_token').then(auth_token => {
      this.auth_token = auth_token;
      })

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
      this.room = this.Roomif.arrroom;
      this.jsonroom = this.Roomif.jsonroom;
      this.rowoneactive = true;
      this.textbank = "Vietcombank";
      this.bankName = "Ngân hàng Thương Mại Cổ Phần Ngoại Thương Việt Nam (VCB)";
      this.bankBranch = "Chi nhánh Tp. Hồ Chí Minh";
      this.accountNumber = "007 1000 895 230";
      this.bankTransfer = "Vietcombank";
      this.bookingCode = this._flightService.itemFlightCache.pnr.resNo;
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
      //them ocb
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
      this.bankTransfer = "ACB";
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
   //them ocb
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
      this.bankTransfer = "Vietcombank";
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
   //them ocb
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
      this.bankTransfer = "Viettinbank";
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
   //them ocb
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
      this.bankTransfer = "Techcombank";
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
   //them ocb
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
      this.bankTransfer = "dongabank";
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
   //them ocb
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
      this.bankTransfer = "Agribank";
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
   //them ocb
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
      this.bankTransfer = "BIDV";
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
   //them ocb
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
      this.bankTransfer = "Sacombank";
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
   //them ocb
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
      this.bankTransfer = "HDBank";
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
   //them ocb
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
      this.bankTransfer = "SCB";
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
      this.bankTransfer = "OCB";
    })

  }
  next() {
    var se=this;
    se.gf.showLoading();
      se.callBuildLink().then(data => {
        if (data ) {
          se.gf.logEventFirebase(se._flightService.itemFlightCache.paymentType, se._flightService.itemFlightCache, 'flightsearchresultinternational', 'add_payment_info', 'Flights');

          //se._flightService.itemFlightCache.periodPaymentDate = data.periodPaymentDate;
          se.gf.hideLoading();
          se._flightService.itemFlightCache.ischeckpayment = 0;
          //se.checkHoldTicket(se._flightService.itemFlightCache);
          let itemcache = se._flightService.itemFlightCache;
          //se.navCtrl.navigateForward('flightinternationalpaymentdonebank/'+(itemcache.pnr.bookingCode ?itemcache.pnr.bookingCode:  itemcache.pnr.resNo)+'/'+moment(se._flightService.itemFlightCache.checkInDate).format('YYYY-MM-DD')+'/'+moment(se._flightService.itemFlightCache.checkOutDate).format('YYYY-MM-DD'));
          this.activityService.bankName = this.bankName;
          this.activityService.bankTransfer = this.textbank;
          this.activityService.bankAccount = this.accountNumber;
          this.activityService.totalPriceTransfer = this._flightService.itemFlightCache.totalPrice;
          this.activityService.bookingCode = this.bookingCode;
          this.activityService.qrcodepaymentfrom = 1;
          this.navCtrl.navigateForward('/paymentqrcode');
        }else{
          se.gf.hideLoading();
          se.gf.showAlertOutOfTicketInternational(se._flightService.itemFlightCache, 2);
        }
      })
  }

  callBuildLink(): Promise<any> {
    var se = this;
    return new Promise((resolve, reject) => {
      let itemcache = se._flightService.itemFlightCache;
      itemcache.ischeckpayment = 0;

      se.Roomif.accountNumber = se.accountNumber;
      se.Roomif.textbank = se.textbank;
      se.Roomif.bankName = se.bankName;
      se.Roomif.bankBranch = se.bankBranch;
      se.Roomif.paymentbank=se.paymentMethod;

      var url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=tranfer&BanksTranfer='+se.textbank+'&source=app&amount=' + se._flightService.itemFlightInternational.fare.price.toString().replace(/\./g, '').replace(/\,/g, '') + '&orderCode=' + (itemcache.pnr.bookingCode ?itemcache.pnr.bookingCode:  itemcache.pnr.resNo) + '&rememberToken=&buyerPhone=' + itemcache.phone+ '&memberId=' + se.jti +'&version=2&isFlightInt=true';
                  se.gf.CreatePayoo(url).then((data) => {
                        resolve(data.success);
                })
    })
  }

  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
    });
    this.loader.present();
  }
  goback(){
    this.navCtrl.back();
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
    var se = this, bankid=null, url='';
    //thanh toán vietcombank
    if(se.ischeckvcbactive){
      se.bankid = 1;
      url = 'https://www.vietcombank.com.vn/IBanking2020';
    }
    //thanh toán acb
    else if(se.ischeckacbactive){
      url= 'https://online.acb.com.vn/acbib';
    }
    //thanh toán vietinbank
    else if(se.ischeckvietinactive){
      se.bankid = 4;
      url= 'https://ebanking.vietinbank.vn/rcas';
    }
    //thanh toán techcombank
    else if(se.ischecktechcomactive){
      se.bankid = 2;
      url='https://ib.techcombank.com.vn/servlet/BrowserServlet';
    }
    //thanh toán dongabank
    else if(se.ischeckdongaactive){
      se.bankid = 6;
      url='https://ebanking.dongabank.com.vn/khcn/';
    }
    //thanh toán agribank
    else if(se.ischeckagriactive){
      se.bankid = 24;
      url='https://ibank.agribank.com.vn/ibank';
    }
    //thanh toán bidv
    else if(se.ischeckbidvactive){
      se.bankid = 19;
      url='https://www.bidv.vn:81/iportalweb/iRetail@1';
    }
    //thanh toán sacombank
    else if(se.ischecksacomactive){
      se.bankid = 16;
      url='https://www.isacombank.com.vn/corp/AuthenticationController?FORMSGROUP_ID__=AuthenticationFG&__START_TRAN_FLAG__=Y&FG_BUTTONS__=LOAD&ACTION.LOAD=Y&AuthenticationFG.LOGIN_FLAG=1&BANK_ID=303&LANGUAGE_ID=003';
    }
    //thanh toán hdbank
    else if(se.ischeckhdactive){
      se.bankid = 7;
      url='https://ebanking.hdbank.vn/ipc/vi/';
    }
    //thanh toán scb
    else if(se.ischeckscbactive){
      se.bankid = 25;
      url='https://ebanking.scb.com.vn/?module=login';
    }
    
  }
  copyClipboard(type){
    if(type == 1){
      this.clipboard.copy(this.accountNumber);
    }else if(type == 2){
      this.clipboard.copy("Người thụ hưởng: Công ty Cổ Phần IVIVU.COM");
    }else if(type == 3){
      this.clipboard.copy(this.bookingCode);
    }
    
    this.presentToastr('Đã sao chép');
  }
  async showQuickBack(){
    const modal: HTMLIonModalElement =
    await this.modalCtrl.create({
      component: FlightquickbackPage,
      componentProps: {
        aParameter: true,
      },
      showBackdrop: true,
      backdropDismiss: true,
      //enterAnimation: CustomAnimations.iosCustomEnterAnimation,
      //leaveAnimation: CustomAnimations.iosCustomLeaveAnimation,
      cssClass: "modal-flight-quick-back",
    });
  modal.present();
  }
  


}
