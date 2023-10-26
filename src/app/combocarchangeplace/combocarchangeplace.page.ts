import { Bookcombo } from './../providers/book-service';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-combocarchangeplace',
  templateUrl: './combocarchangeplace.page.html',
  styleUrls: ['./combocarchangeplace.page.scss'],
})
export class CombocarchangeplacePage implements OnInit {
  depPlace; retPlace; isDepart
  public tabplace: string = "placed";
  arrplaced: any = [];
  arrplacet: any = [];
  arrplacetcd: any = [];
  arrplacetct: any = [];
  activeTap = 1;
  placed: any = [];
  placet: any = [];
  idpointd;
  idpointt;
  placetitle="";
  constructor(public bookCombo: Bookcombo, public modalCtrl: ModalController) {
    this.depPlace = this.bookCombo.ComboDetail.comboDetail.departurePlace;
    this.retPlace = this.bookCombo.ComboDetail.arrivalName;
    this.isDepart = this.bookCombo.isDepart;
    if (this.isDepart == '0') {
      this.placetitle=this.depPlace+' - ' +this.retPlace;
      this.arrplaced = this.bookCombo.arrplacedepd;
      this.arrplacet = this.bookCombo.arrplacedept;
      //Điểm trung chuyển
      if (this.bookCombo.arrplacedeptcd) {
        this.arrplacetcd = this.bookCombo.arrplacedeptcd;
      }
      if (this.bookCombo.arrplacedeptct) {
        this.arrplacetct = this.bookCombo.arrplacedeptct;
      }
      //id điểm đón trả
      this.idpointd= this.bookCombo.idpointdepd;
      this.idpointt= this.bookCombo.idpointdept;
    }
    else {
      this.placetitle=this.retPlace+' - ' +this.depPlace;
      this.arrplaced = this.bookCombo.arrplaceretd;
      this.arrplacet = this.bookCombo.arrplacerett;
      //Điểm trung chuyển
      this.arrplacetcd = this.bookCombo.arrplacerettcd;
      this.arrplacetct = this.bookCombo.arrplacerettct;
      //id điểm đón trả
      this.idpointd= this.bookCombo.idpointretd;
      this.idpointt= this.bookCombo.idpointrett;
    }
    for (var i = 0; i < this.arrplaced.length; i++) {
      if (this.idpointd || this.idpointd == '0') {
        if (this.idpointd == this.arrplaced[i].id) {
          var ischeck = true;
          this.arrplaced[i].ischeck = ischeck;
          this.arrplaced[i].surchargeshow = this.arrplaced[i].surcharge.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
          this.placed.push(this.arrplaced[i]);
          break;
        }
        else {
          var ischeck = false;
          this.arrplaced[i].surchargeshow = this.arrplaced[i].surcharge.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
          this.arrplaced[i].ischeck = ischeck;
        }
      }
      else {
        var ischeck = false;
        this.arrplaced[i].surchargeshow = this.arrplaced[i].surcharge.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        this.arrplaced[i].ischeck = ischeck;
      }
    }
    for (var i = 0; i < this.arrplacet.length; i++) {
      if (this.idpointt || this.idpointt == '0') {
        if (this.idpointt == this.arrplacet[i].id) {
          var ischeck = true;
          this.arrplacet[i].ischeck = ischeck;
          this.arrplacet[i].surchargeshow = this.arrplacet[i].surcharge.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
          this.placet.push(this.arrplacet[i]);
          break;
        }
        else {
          var ischeck = false;
          this.arrplacet[i].surchargeshow = this.arrplacet[i].surcharge.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
          this.arrplacet[i].ischeck = ischeck;
        }
      }
      else {
        var ischeck = false;
        this.arrplacet[i].surchargeshow = this.arrplacet[i].surcharge.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        this.arrplacet[i].ischeck = ischeck;
      }
    }
    //Điểm trung chuyển
    if (this.arrplacetcd &&this.arrplacetcd.length > 0) {
      for (var i = 0; i < this.arrplacetcd.length; i++) {
        if (this.idpointd || this.idpointd == '0') {
          if (this.idpointd == this.arrplacetcd[i].id) {
            var ischeck = true;
            this.arrplacetcd[i].ischeck = ischeck;
            this.arrplacetcd[i].surchargeshow = this.arrplacetcd[i].surcharge.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
            this.placed.push(this.arrplacetcd[i]);
            break;
          }
          else {
            var ischeck = false;
            this.arrplacetcd[i].surchargeshow = this.arrplacetcd[i].surcharge.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
            this.arrplacetcd[i].ischeck = ischeck;
          }
        }
        else {
          var ischeck = false;
          this.arrplacetcd[i].surchargeshow = this.arrplacetcd[i].surcharge.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
          this.arrplacetcd[i].ischeck = ischeck;
        }
      }
    }
    if (this.arrplacetct&&this.arrplacetct.length > 0) {
      for (var i = 0; i < this.arrplacetct.length; i++) {
        if (this.idpointt || this.idpointt == '0') {
          if (this.idpointt == this.arrplacetct[i].id) {
            var ischeck = true;
            this.arrplacetct[i].ischeck = ischeck;
            this.arrplacetct[i].surchargeshow = this.arrplacetct[i].surcharge.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
            this.placet.push(this.arrplacetct[i]);
            break;
          }
          else {
            var ischeck = false;
            this.arrplacetct[i].surchargeshow = this.arrplacetct[i].surcharge.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
            this.arrplacetct[i].ischeck = ischeck;
          }
        }
        else {
          var ischeck = false;
          this.arrplacetct[i].surchargeshow = this.arrplacetct[i].surcharge.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
          this.arrplacetct[i].ischeck = ischeck;
        }
      }
    }
  }
  //Chọn tap
  Selectdepart() {
    this.activeTap = 1;
    if (this.placed.length > 0) {
      for (let i = 0; i < this.arrplaced.length; i++) {
        if (this.arrplaced[i].id == this.placed[0].id) {
          this.arrplaced[i].ischeck = true;
        }
        else {
          this.arrplaced[i].ischeck = false;
        }
      }
      for (let i = 0; i < this.arrplacetcd.length; i++) {
        if (this.arrplacetcd[i].id == this.placed[0].id) {
          this.arrplacetcd[i].ischeck = true;
        }
        else {
          this.arrplacetcd[i].ischeck = false;
        }
      }
    }
  }
  Selectreturn() {
    this.activeTap = 2;
    if (this.placet.length > 0) {
      for (let i = 0; i < this.arrplacet.length; i++) {
        if (this.arrplacet[i].id == this.placet[0].id) {
          this.arrplacet[i].ischeck = true;
        }
        else {
          this.arrplacet[i].ischeck = false;
        }
      }
      for (let i = 0; i < this.arrplacetct.length; i++) {
        if (this.arrplacetct[i].id == this.placet[0].id) {
          this.arrplacetct[i].ischeck = true;
        }
        else {
          this.arrplacetct[i].ischeck = false;
        }
      }
    }

  }
  //chọn nơi đón
  itemrddep(item) {
    this.placed = [];
    this.placed.push(item);
    this.activeTap = 2;
    this.tabplace = 'placet';
  }
  //chọn nơi trả
  itemrdret(item) {
    this.placet = [];
    this.placet.push(item);
    this.modalCtrl.dismiss({ isdepart: this.isDepart, placed: this.placed, placet: this.placet });
  }
  ngOnInit() {
  }
  goback() {
    this.modalCtrl.dismiss({ isdepart: this.isDepart, placed: this.placed, placet: this.placet });
  }
}
