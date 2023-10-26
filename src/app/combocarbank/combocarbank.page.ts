import { Bookcombo, SearchHotel } from './../providers/book-service';
import { Component, NgZone, OnInit } from '@angular/core';
import { NavController, LoadingController, Platform } from '@ionic/angular';
import { Booking, RoomInfo } from '../providers/book-service';
import { Storage } from '@ionic/storage';
import { C } from '../providers/constants';
import { ActivityService, GlobalFunction } from '../providers/globalfunction';
import jwt_decode from 'jwt-decode';
import * as moment from 'moment';
@Component({
  selector: 'app-combocarbank',
  templateUrl: './combocarbank.page.html',
  styleUrls: ['./combocarbank.page.scss'],
})
export class CombocarbankPage implements OnInit {

  ischeckvcbactive = true; ischeckvcb; ischeckacb; ischeckacbactive; ischeckvietin; ischeckvietinactive; ischecktechcom; ischecktechcomactive;
  ischeckdongaactive; ischeckdonga; ischeckagri; ischeckagriactive; ischeckbidv; ischeckbidvactive; ischecksacom; ischecksacomactive;
  text; ischecktext; ischecktextend; isenabled = true; input; ischeck; isenabledbtn; timestamp; paymentMethod; room; jsonroom; ischeckhdactive; ischeckhd;
  ischeckscbactive; ischeckscb; listcars; hoten; phone; totalAdult; email; ischeckocbactive = false; ischeckocb
  public loader: any;
  textbank: string = '';
  bookingCode: any;
  bankName: string;
  accountNumber: string;
  bankBranch: string;
  jti: any;
  constructor(public platform: Platform, public Roomif: RoomInfo, public zone: NgZone, public storage: Storage,
    public navCtrl: NavController, public booking: Booking, public loadingCtrl: LoadingController, public bookCombo: Bookcombo,
    public gf: GlobalFunction,
    public activityService: ActivityService,
    public searchhotel: SearchHotel) {
    this.listcars = this.gf.getParams('carscombo');
    this.hoten = this.Roomif.hoten;
    this.phone = this.Roomif.phone
    this.totalAdult = bookCombo.totalAdult;
    this.ischeckvietin = true;
    this.ischeckacb = true;
    this.ischecktechcom = true;
    this.ischeckdonga = true;
    this.ischeckagri = true;
    this.ischeckbidv = true;
    this.ischecksacom = true;
    this.ischecktextend = false;
    this.ischecktext = true;
    this.ischeckscb = true;
    this.ischeckocb = true;
    this.text = "";
    this.isenabledbtn = false;
    this.ischeckvcbactive = true;
    this.ischeckhd = true;
    this.paymentMethod = "42";
    this.textbank = "Vietcombank";
    this.bankName = "Ngân TMCP Ngoại Thương Việt Nam (VCB)";
    this.bankBranch = "Chi nhánh Tp. Hồ Chí Minh";
    this.accountNumber = "007 1000 895 230";
    this.text = "Ngân hàng Thương Mại Cổ Phần Ngoại Thương Việt Nam (VCB)<br>Chi nhánh Tp. Hồ Chí Minh<br>Số TK: <b>007 1000 895 230</b><br>Chủ TK: <b>Công ty Cổ Phần IVIVU.COM</b></li>";
    this.room = Roomif.arrroom;
    this.jsonroom = {...Roomif.jsonroom};
    this.storage.get('email').then(e => {
      if (e !== null) {
        this.email = e;
      }
    })
    this.storage.get('jti').then(jti => {
      if (jti) {
        this.jti = jti;
      }
    })
    //gf.googleAnalytion('roompaymentbank', 'load', '');
    this.gf.logEventFirebase('banktransfer',this.searchhotel, 'combocarbank', 'add_payment_info', 'Combo');
  }
  ngOnInit() {
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
      this.ischeckscbactive = false;
      this.ischeckhdactive = false;
      this.ischeckocbactive = false;
      this.ischeckocb = true;
      this.ischeckvietin = true;
      this.ischecktechcom = true;
      this.ischeckdonga = true;
      this.ischeckbidv = true;
      this.ischecksacom = true;
      this.ischeckagri = true;
      this.ischeckvcb = true;
      this.ischeckscb = true;
      this.ischeckhd = true;
      this.text = "Ngân hàng Á Châu (ACB)<br>Chi nhánh Tp. Hồ Chí Minh<br>Số TK: <b>190862589</b><br>Chủ TK: <b>Công ty Cổ Phần IVIVU.COM</b></li>";
      this.ischecktextend = false;
      this.ischecktext = true;
      this.isenabledbtn = false;
      this.paymentMethod = "41";
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
      this.ischeckscbactive = false;
      this.ischeckhdactive = false;
      this.ischeckocbactive = false;
      this.ischeckocb = true;
      this.ischeckvietin = true;
      this.ischecktechcom = true;
      this.ischeckdonga = true;
      this.ischeckbidv = true;
      this.ischecksacom = true;
      this.ischeckagri = true;
      this.ischeckacb = true;
      this.ischeckscb = true;
      this.ischeckhd = true;
      this.ischecktextend = false;
      this.ischecktext = true;
      this.text = "Ngân hàng Thương Mại Cổ Phần Ngoại Thương Việt Nam (VCB)<br>Chi nhánh Tp. Hồ Chí Minh<br>Số TK: <b>007 1000 895 230</b><a class='text-copy' (click)='copyClipboard(1)'>Sao chép</a> <br>Người thụ hưởng: Công ty Cổ Phần IVIVU.COM <a class='text-copy' (click)='copyClipboard(1)'>Sao chép</a> <br>Nội dung thanh toán: <b>{{totalPrice}}</b><a class='text-copy' (click)='copyClipboard(1)'>Sao chép</a> </li>";
      this.isenabledbtn = false;
      this.paymentMethod = "42";
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
      this.ischeckscbactive = false;
      this.ischeckhdactive = false;
      this.ischeckocbactive = false;
      this.ischeckocb = true;
      this.ischeckvcb = true;
      this.ischecktechcom = true;
      this.ischeckdonga = true;
      this.ischeckbidv = true;
      this.ischecksacom = true;
      this.ischeckagri = true;
      this.ischeckacb = true;
      this.ischeckscb = true;
      this.ischeckhd = true;
      this.text = "NH VietinBank<br>Chi Nhánh 03, Tp.HCM<br>Số TK: <b>1110 0014 2852</b><br>Chủ TK: <b>Công ty Cổ Phần IVIVU.COM</b>";
      this.ischecktextend = false;
      this.ischecktext = true;
      this.isenabledbtn = false;
      this.paymentMethod = "45";
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
      this.ischeckscbactive = false;
      this.ischeckhdactive = false;
      this.ischeckocbactive = false;
      this.ischeckocb = true;
      this.ischeckvcb = true;
      this.ischeckvietin = true;
      this.ischeckdonga = true;
      this.ischeckbidv = true;
      this.ischecksacom = true;
      this.ischeckagri = true;
      this.ischeckacb = true;
      this.ischeckscb = true;
      this.ischeckhd = true;
      this.text = "NH TMCP Kỹ Thương Việt Nam (Techcombank)<br>Chi nhánh Trần Quang Diệu, Tp.HCM<br>Số TK: <b>19128840912016</b><br>Chủ TK: <b>Công ty Cổ Phần IVIVU.COM</b>"
      this.ischecktextend = false;
      this.ischecktext = true;
      this.isenabledbtn = false;
      this.paymentMethod = "44";
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
      this.ischeckscbactive = false;
      this.ischeckhdactive = false;
      this.ischeckocbactive = false;
      this.ischeckocb = true;
      this.ischeckvcb = true;
      this.ischeckvietin = true;
      this.ischecktechcom = true;
      this.ischeckbidv = true;
      this.ischecksacom = true;
      this.ischeckagri = true;
      this.ischeckacb = true;
      this.ischeckscb = true;
      this.ischeckhd = true;
      this.ischecktextend = true;
      this.ischecktext = false;
      this.text = "NH TMCP Đông Á (DongABank)<br>Chi nhánh Lê Văn Sỹ, Tp.HCM<br>Số TK: <b>0139 9166 0002</b><br>Chủ TK: <b>Công ty Cổ Phần IVIVU.COM</b>";
      this.isenabledbtn = false;
      this.paymentMethod = "43";
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
      this.ischeckscbactive = false;
      this.ischeckhdactive = false;
      this.ischeckocbactive = false;
      this.ischeckocb = true;
      this.ischeckvcb = true;
      this.ischeckvietin = true;
      this.ischecktechcom = true;
      this.ischeckbidv = true;
      this.ischecksacom = true;
      this.ischeckdonga = true;
      this.ischeckacb = true;
      this.ischeckscb = true;
      this.ischeckhd = true;
      this.ischecktextend = true;
      this.ischecktext = false;
      this.text = "NH Agribank<br>Chi Nhánh 03, Tp.HCM<br>Số TK: <b>160 2201 361 086</b><br>Chủ TK: <b>Công ty Cổ Phần IVIVU.COM</b>";
      this.isenabledbtn = false;
      this.paymentMethod = "47";
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
      this.ischeckscbactive = false;
      this.ischeckhdactive = false;
      this.ischeckocbactive = false;
      this.ischeckocb = true;
      this.ischeckvcb = true;
      this.ischeckvietin = true;
      this.ischecktechcom = true;
      this.ischeckagri = true;
      this.ischecksacom = true;
      this.ischeckdonga = true;
      this.ischeckacb = true;
      this.ischeckscb = true;
      this.ischeckhd = true;
      this.ischecktextend = true;
      this.ischecktext = false;
      this.text = "NH TM CP Đầu Tư và Phát Triển Việt Nam (BIDV)<br>Chi Nhánh 02, Tp.HCM<br>Số TK: <b>130 147 4890</b><br>Chủ TK: <b>Công ty Cổ Phần IVIVU.COM</b>";
      this.isenabledbtn = false;
      this.paymentMethod = "48";
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
      this.ischeckscbactive = false;
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
      this.ischeckscb = true;
      this.ischeckhd = true;
      this.ischecktextend = true;
      this.ischecktext = false;
      this.text = "Ngân Hàng TMCP Sài Gòn Thương Tín (Sacombank)<br>Chi nhánh Cao Thắng, Tp.HCM<br>Số TK: <b>060 0952 73354</b><br>Chủ TK: <b>Công ty Cổ Phần IVIVU.COM</b>";
      this.isenabledbtn = false;
      this.paymentMethod = "46";
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
      this.isenabledbtn = false;
      this.paymentMethod = "53";
      this.textbank = "OCB";
      this.bankName = "Ngân hàng Phương Đông (OCB)";
      this.bankBranch = "Chợ Lớn, TP.HCM";
      this.accountNumber = "001 7101 6190 02045";
    })

  }
  CreateCombo() {
    var se = this;
    var form = this.listcars;
    form.HotelBooking.PaymentMethod = this.paymentMethod;
      let strUrl = C.urls.baseUrl.urlContracting + '/api/ToolsAPI/CreateComboTransferBooking';
      se.gf.RequestApi('POST', strUrl, {}, form, 'comboadddetails', 'postapibook').then((data) => {
        var obj = data;
        let body = 
        {
          BookingCode: obj.Code,
          DepartATCode: obj.TransferReserveCode.DepartReserveCode,
          ReturnATCode: obj.TransferReserveCode.ReturnReserveCode,
          FromPlaceCode: se.listcars.TransferBooking.fromPlaceCode
        };
        let strUrl = C.urls.baseUrl.urlContracting + '/api/ToolsAPI/CreateTransactionIDComboTransfer';
        se.gf.RequestApi('POST', strUrl, {}, body, 'comboadddetails', 'postapibook').then((data) => {
          se.loader.dismiss();
          var json = data;
          if (json.Error == 0) {
            //thông tin bank
            se.Roomif.accountNumber = se.accountNumber;
            se.Roomif.textbank = se.textbank;
            se.Roomif.bankName = se.bankName;
            se.Roomif.bankBranch = se.bankBranch;
            se.Roomif.paymentbank = se.paymentMethod;
            if(se.jti){
                var url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=tranfer&BanksTranfer='+se.textbank+'&source=app&amount=' + se.bookCombo.totalprice.toString().replace(/\./g, '').replace(/\,/g, '') + '&orderCode=' + obj.Code+ '&memberId=' + se.jti;
                se.gf.CreatePayoo(url);
              }
            if (se.Roomif.payment == 'AL') {
              se.activityService.bankName = se.bankName;
              se.activityService.bankTransfer = se.textbank;
              se.activityService.bankAccount = se.accountNumber;
              se.activityService.totalPriceTransfer = se.bookCombo.totalprice;
              se.activityService.bookingCode = obj.Code;
              se.activityService.qrcodepaymentfrom = 5;
              se.navCtrl.navigateForward('/paymentqrcode');
              //se.navCtrl.navigateForward('/combodonebank/' + obj.Code);
            }
            else {
              se.navCtrl.navigateForward('/combodone/' + obj.Code);
            }
          }
        });
      })
  }
  refreshToken() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        let headers =
        {
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          authorization: text
        };
        let strUrl = C.urls.baseUrl.urlMobile + '/api/Account/reloadTokenClaims';
        se.gf.RequestApi('GET', strUrl, headers, {}, 'combocarbank', 'refreshToken').then((data) => {
            var au = data;
            se.zone.run(() => {
              se.storage.remove('auth_token');
              se.storage.set('auth_token', au.auth_token);
              var decoded = jwt_decode<any>(au.auth_token);
              se.storage.remove('point');
              se.storage.set('point', decoded.point);
            })
        })
      }
    })
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
  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
    });
    this.loader.present();
  }
  goback() {
    this.navCtrl.back();
  }
  postapibook() {
    var se = this;
    se.presentLoading();
      let headers =
      {
        apikey: 'sx25k7TABO6W4ULFjfxoJJaLjQr0wUGxYCph1TQiTBM',
        apisecret: 'wZH8vCalp5-ZsUzJiP1IP6V2beWUm0ej8G_25gzg2xg'
      };
      let body =
      {
        departParams:
        {
          trip_code: this.listcars.TransferBooking.departTransfer.TransferNumber,
          total_seats: this.bookCombo.totalseatsdep,
          total_price: this.bookCombo.pricedep,
          code: '',
          dropoff_place: "",
          pickup_place: ""
        },
        returnParams:
        {
          trip_code: this.listcars.TransferBooking.returnTransfer.TransferNumber,
          total_seats: this.bookCombo.totalseatsret,
          total_price: this.bookCombo.priceret,
          code: '',
          pickup_place: '',
          dropoff_place: ''
        },
        customer_phone: se.phone,
        customer_name: se.hoten,
        customer_email: 'tc@ivivu.com',
        pay_status: 0
      };
        let strUrl = C.urls.baseUrl.urlMobile + '/booking';
        se.gf.RequestApi('POST', strUrl, headers, body, 'combocarbank', 'refreshToken').then((data) => {
        if (data.status == 0) {
          var json = data.data;
          if (json.length > 0) {
            se.listcars.TransferBooking.departTransfer.ReservedTickets = JSON.stringify(json[0].data.reserve_Tickets);
            se.listcars.TransferBooking.returnTransfer.ReservedTickets = JSON.stringify(json[1].data.reserve_Tickets);
            var expiredtimedep = moment(json[0].data.reserve_Tickets.expired_time).format('YYYYMMDDHHmm');
            var expiredtimeret = moment(json[1].data.reserve_Tickets.expired_time).format('YYYYMMDDHHmm');
  
            if (Number(expiredtimedep) == Number(expiredtimeret)) {
              se.Roomif.expiredtime = json[0].data.reserve_Tickets.expired_time;
            }
            else if (Number(expiredtimedep) > Number(expiredtimeret)) {
              se.Roomif.expiredtime = json[1].data.reserve_Tickets.expired_time;
            }
            else if (Number(expiredtimedep) < Number(expiredtimeret)) {
              se.Roomif.expiredtime = json[0].data.reserve_Tickets.expired_time;
            }
            var Seatsde = json[0].data.seats;
            var Seatsre = json[1].data.seats;
            var seatstextde = "";
            var seatstextre = "";
            for (let i = 0; i < Seatsde.length; i++) {
              if (i == Seatsde.length - 1) {
                seatstextde = seatstextde + Seatsde[i].seat_code;
              }
              else {
                seatstextde = seatstextde + Seatsde[i].seat_code + ',';
              }
            }
            for (let i = 0; i < Seatsre.length; i++) {
              if (i == Seatsre.length - 1) {
                seatstextre = seatstextre + Seatsre[i].seat_code;
              }
              else {
                seatstextre = seatstextre + Seatsre[i].seat_code + ',';
              }
            }
            se.listcars.TransferBooking.departTransfer.Seats = seatstextde;
            se.listcars.TransferBooking.returnTransfer.Seats = seatstextre;
            var textfullname = se.hoten.split(' ')
            var FirstName;
            var LastName;
            if (textfullname.length > 2) {
              let name = '';
              for (let i = 1; i < textfullname.length; i++) {
                if (i == 1) {
                  name += textfullname[i];
                } else {
                  name += ' ' + textfullname[i];
                }
              }
              FirstName = textfullname[0];
              LastName = name;
            } else if (textfullname.length > 1) {
              FirstName = textfullname[0];
              LastName = textfullname[1];
            }
            else if (textfullname.length == 1) {
              FirstName = textfullname[0];
              LastName = "";
            }
            se.listcars.TransferBooking.passengerInfo.FirstName = FirstName;
            se.listcars.TransferBooking.passengerInfo.LastName = LastName;
            se.listcars.TransferBooking.passengerInfo.Email = se.email;
            se.listcars.TransferBooking.passengerInfo.MobileNumber = se.phone;
            se.listcars.HotelBooking.CPhone = se.phone;
            se.listcars.HotelBooking.LeadingName = se.hoten;
            se.listcars.HotelBooking.LeadingEmail = se.email;
            se.listcars.HotelBooking.LeadingPhone = se.phone;
            //se.CreateCombo();
            if(se.bookCombo.mealTypeRates.Supplier == 'SERI' && se.bookCombo.mealTypeRates.HotelCheckDetailTokenInternal){
              //Check allotment trước khi book
              se.gf.checkAllotmentSeri(
                se.booking.HotelId,
                se.bookCombo.mealTypeRates.RoomId,
                se.booking.CheckInDate,
                se.booking.CheckOutDate,
                se.bookCombo.mealTypeRates.TotalRoom,
                'SERI', se.bookCombo.mealTypeRates.HotelCheckDetailTokenInternal
                ).then((allow)=> {
                  if(allow){
                    se.CreateCombo();
                  }else{
                    if (se.loader) {
                      se.loader.dismiss();
                    }
                    se.gf.showToastWarning('Hiện tại khách sạn đã hết phòng loại này.');
                  }
                })
            }else{
              se.CreateCombo();
            }
          } else {
            se.loader.dismiss();
            se.gf.showAlertMessageOnly("Không còn ghế xe, vui lòng chọn Nhà xe khác!");
            se.navCtrl.navigateForward('/combocarnew');
          }
        }
        else {
          se.loader.dismiss();
          se.gf.showAlertMessageOnly("Không còn ghế xe, vui lòng chọn Nhà xe khác!");
          se.navCtrl.navigateForward('/combocarnew');
        }
      });
  }

  CreateBuildLink(){
    var se= this;
    var url = C.urls.baseUrl.urlContracting + '/build-link-to-pay-aio?paymentType=tranfer&source=app&amount=' + this.bookCombo.totalprice + '&orderCode=' + se.Roomif.bookingCode + '&buyerPhone=' + this.Roomif.phone + '&BanksTranfer='+this.textbank+'&callbackUrl=android-app%3A%2F%2FiVIVU.com%2F';
    this.gf.CreateUrl(url).then(dataBuildLink => {
      if (this.loader) {
        this.loader.dismiss();
      }
      //thông tin bank
      se.Roomif.accountNumber = se.accountNumber;
      se.Roomif.textbank = se.textbank;
      se.Roomif.bankName = se.bankName;
      se.Roomif.bankBranch = se.bankBranch;
      se.Roomif.paymentbank = se.paymentMethod;
      if (se.Roomif.payment == 'AL') {
        se.navCtrl.navigateForward('/combodonebank/' + this.Roomif.bookingCode);
      }
      else {
        se.navCtrl.navigateForward('/combodone/' + this.Roomif.bookingCode);
      }
    })
  }
}
