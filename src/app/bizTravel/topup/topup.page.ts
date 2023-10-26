import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { BizTravelService } from 'src/app/providers/bizTravelService';
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';
import { GlobalFunction } from 'src/app/providers/globalfunction';
import { C } from '../../providers/constants';

@Component({
  selector: 'app-topup',
  templateUrl: './topup.page.html',
  styleUrls: ['./topup.page.scss'],
})
export class TopupPage implements OnInit {
  typeSearch: any=0;
    expandVCB: boolean = false;
    listBanks = [
        {
            id: 1,
            bankNameShort : "VCB",
            bankName : "Ngân hàng TMCP Ngoại Thương VN",
            bankBranch : "Chi nhánh Tp. Hồ Chí Minh",
            accountNumber : "007 1000 895 230",
            imgBank: "./assets/ic_biztravel/vcb.jpg",
            expanded: false
        },
        {
            id: 2,
            bankNameShort : "ACB",
            bankName : "Ngân hàng TMCP Á Châu",
            bankBranch : "Chi nhánh Tp. Hồ Chí Minh",
            accountNumber : "190862589",
            imgBank: "./assets/ic_biztravel/acb.jpg",
            expanded: false
        },
        {
            id: 3,
            bankNameShort : "VietinBank",
            bankName : "Ngân hàng TMCP Công Thương VN",
            bankBranch : "Chi nhánh 03 TP.HCM",
            imgBank: "./assets/ic_biztravel/vietinbank.jpg",
            accountNumber : "1110 0014 2852",
            expanded: false
        },
        {
            id: 4,
            bankNameShort : "Techcombank",
            bankName : "Ngân hàng TMCP Kỹ Thương VN",
            bankBranch : "Chi nhánh Trần Quang Diệu TP.HCM",
            imgBank: "./assets/ic_biztravel/techcombank.jpg",
            accountNumber : "19128840912016",
            expanded: false
        },
        {
            id: 5,
            bankNameShort : "HDBANK",
            bankName : "Ngân hàng TMCP Phát triển TP HCM",
            bankBranch : "Chi nhánh Sài Gòn",
            imgBank: "./assets/ic_biztravel/hdbank.jpg",
            accountNumber : "052704070018649",
            expanded: false
        },
        {
            id: 6,
            bankNameShort : "DongABank",
            bankName : "Ngân hàng TMCP Đông Á",
            bankBranch : "Chi nhánh Lê Văn Sỹ TP.HCM",
            imgBank: "./assets/ic_biztravel/donga.jpg",
            accountNumber : "0139 9166 0002",
            expanded: false
        },
        {
            id: 7,
            bankNameShort : "Agribank",
            bankName : "Ngân hàng Nông nghiệp và Phát triển Nông thôn VN",
            bankBranch : "Chi Nhánh 03 TP.HCM",
            imgBank: "./assets/ic_biztravel/agribank.jpg",
            accountNumber : "160 2201 361 086",
            expanded: false
        },
        {
            id: 8,
            bankNameShort : "BIDV",
            bankName : "Ngân hàng TMCP Đầu tư và Phát triển VN",
            bankBranch : "Chi nhánh 02 TP.HCM",
            imgBank: "./assets/ic_biztravel/bidv.jpg",
            accountNumber : "130 147 4890",
            expanded: false
        },
        {
            id: 9,
            bankNameShort : "Sacombank",
            bankName : "Ngân hàng TMCP Sài Gòn Thương Tín",
            bankBranch : "Chi nhánh Cao Thắng TP.HCM",
            imgBank: "./assets/ic_biztravel/sacombank.jpg",
            accountNumber : "060 0952 73354",
            expanded: false
        },
        {
            id: 10,
            bankNameShort : "SCB",
            bankName : "Ngân hàng TMCP Sài Gòn",
            bankBranch : "Chi nhánh Phú Đông",
            imgBank: "./assets/ic_biztravel/scb.jpg",
            accountNumber : "023 0109 7937 00001",
            expanded: false
        },
        {
            id: 11,
            bankNameShort : "OCB",
            bankName : "Ngân hàng Phương Đông",
            bankBranch : "Chi nhánh Chợ Lớn TP.HCM",
            imgBank: "./assets/ic_biztravel/ocb.jpg",
            accountNumber : "001 7101 6190 02045",
            expanded: false
        },
    ];

  constructor(private navCtrl :NavController,
    public bizTravelService: BizTravelService,
    public clipboard: Clipboard,
    public gf: GlobalFunction) { 
    }

  ngOnInit() {
  }

  goback(){
    this.navCtrl.back();
  }

  expandClick(item){
        this.listBanks.forEach(element => {
            if(element.id != item.id){
                element.expanded = false;
            }
        });
        item.expanded = !item.expanded;
  }

  copyClipboard(item, type){
    if(type == 1){
      this.clipboard.copy(item.accountNumber);
    }else if(type == 2){
      this.clipboard.copy("Công ty Cổ Phần IVIVU.COM");
    }else if(type == 3){
      this.clipboard.copy("TOPUP <" + this.bizTravelService.bizAccount.phone + ">");
    }
    this.gf.showToastWarning('Đã sao chép');
  }

  support(){
    if(this.bizTravelService.bizAccount && this.bizTravelService.bizAccount.supporter){
      this.gf.showAlertMessage(this.bizTravelService.bizAccount.supporter.name+'<br/>'+this.bizTravelService.bizAccount.supporter.phone+'<br/>'+this.bizTravelService.bizAccount.supporter.email, 'Bạn cần hỗ trợ thêm xin vui lòng liên hệ thông tin bên dưới:');
    }
  }

  callsupport(){
    try {
      let phone = this.bizTravelService.bizAccount.supporter.phone.split(" ").join("");
      setTimeout(() => {
        window.open(`tel:${phone}`, '_system');
      }, 10);
    }
    catch (error:any) {
      if (error) {
        error.page = "listbookings";
        error.func = "callsupport";
        C.writeErrorLog(error, null);
      };
    }
  }

  emailsupport(){
    try {
      setTimeout(() => {
        window.open(`mailto:${this.bizTravelService.bizAccount.supporter.email}`, '_system');
      }, 10);
    }
    catch (error:any) {
      if (error) {
        error.page = "listbookings";
        error.func = "emailsupport";
        C.writeErrorLog(error, null);
      };
    }
  }

}
