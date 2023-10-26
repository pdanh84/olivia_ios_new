import { Component,OnInit, NgZone } from '@angular/core';
import { NavController,Platform, ModalController, ActionSheetController, PickerController } from '@ionic/angular';
import { SearchHotel } from '../providers/book-service';
import { C } from './../providers/constants';
import { GlobalFunction } from './../providers/globalfunction';
import { ValueGlobal } from './../providers/book-service';
import * as $ from 'jquery';
import { flightService } from '../providers/flightService';
/**
 * Generated class for the OccupancyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-flightselectpax',
  templateUrl: 'flightselectpax.page.html',
  styleUrls: ['flightselectpax.page.scss'],
})
export class FlightselectpaxPage implements OnInit {
  adults = 2;
  child = 0;
  infant=0;
  room = 1;
  arrchild: any = [];
  public numage;
  ischeckadults = true;
  ischeckchild = false;
  ischeckroom = false;
  cout; cin;
  ComboDayNum;namecombo;Address;imghotel;namehotel;
  showpopupfromrequestcombo = false;ChildAgeTo
  ischeckinfant: boolean;
  constructor(public platform: Platform,public navCtrl: NavController, public modalCtrl: ModalController,public valueGlobal:ValueGlobal,
    public searchhotel: SearchHotel, public gf: GlobalFunction,
    public actionsheetCtrl: ActionSheetController,
    public pickerController: PickerController,
    private zone: NgZone,
    public _flightService: flightService) {
    if (_flightService.itemFlightCache.adult) {
      this.adults = _flightService.itemFlightCache.adult;
    }
    if (_flightService.itemFlightCache.child) {
      this.child = _flightService.itemFlightCache.child;
    }
    if (_flightService.itemFlightCache.infant) {
      this.infant = _flightService.itemFlightCache.infant;
    }
    if (_flightService.itemFlightCache.ChildAgeTo) {
      this.ChildAgeTo = _flightService.itemFlightCache.ChildAgeTo;
    }
    else
    {
      this.ChildAgeTo = 16;
    }
    if (_flightService.itemFlightCache.arrchild) {
      _flightService.itemFlightCache.arrchild.forEach(element => {
        this.arrchild.push(element);
      });
    }
    this.showpopupfromrequestcombo = this.gf.getParams('requestcombo');
      this.ischeckchild = this.child ? true : false;
      this.ischeckinfant = this.infant ? true :false;
    //google analytic
    gf.googleAnalytion('occupancy','load','');
  }

  ngOnInit() {
   
  }
  closeModal() {
    if(this.valueGlobal.backValue == "flightchangeinfo"){
        this.modalCtrl.dismiss();
    }else{
        this.navCtrl.back();
    }
    
  }
  plusadults() {
    let pax = this.adults + this.child + (this.infant ? this.infant : 0);
    if( pax <9){
      this.adults++;
    }
    else{
      this.gf.showToastWarning('iVIVU phục vụ tối đa 9 hành khách và mỗi người lớn chỉ đi kèm 1 em bé.');
    }
    
    if (this.adults == 1) {
      this.ischeckadults = false;
    }
    else {
      this.ischeckadults = true;
    }
  }
  minusadults() {
    if (this.adults > 1) {
      this.adults--;
    }
    if (this.adults == 1) {
      this.ischeckadults = false;
    }
    else {
      this.ischeckadults = true;
    }
    
  }
  pluschild() {
    let pax = this.adults + this.child + (this.infant ? this.infant : 0);
    if(pax < 9){
      this.child++;
      var arr = {id: this.child, text: 'Trẻ em' + ' ' + this.child, numage: "7" }
      this.arrchild.push(arr);
    }
    else{
      this.gf.showToastWarning('iVIVU phục vụ tối đa 9 hành khách và mỗi người lớn chỉ đi kèm 1 em bé.');
    }
      this.ischeckchild = this.child ? true : false;
  }
  minuschild() {

    if (this.child > 0) {
      this.child--;
      this.removeChildInArrayChild(this.arrchild);
      this.removeChildInArrayChild(this._flightService.itemFlightCache.arrchild);
    }
    
    if (this.child == 0) {
      this.ischeckchild = false;
      this.removeChildInArrayChild(this.arrchild);
      this.removeChildInArrayChild(this._flightService.itemFlightCache.arrchild);
    }
    else {
      this.ischeckchild = true;
    }
  }

  plusinfant() {
    let pax = this.adults + this.child + (this.infant ? this.infant : 0);
    if(pax <9 ){
      this.infant++;
      var arr = {id: this.infant, text: 'Trẻ sơ sinh' + ' ' + this.infant, numage: "1", isInfant: true }
      this.arrchild.push(arr);
      
    }
    else{
      this.gf.showToastWarning('iVIVU phục vụ tối đa 9 hành khách và mỗi người lớn chỉ đi kèm 1 em bé.');
    }

    this.ischeckinfant = this.infant ? true :false;
  }
  minusinfant() {

    if (this.infant > 0) {
      this.infant--;
      this.removeInfantInArrayChild(this.arrchild);
      this.removeInfantInArrayChild(this._flightService.itemFlightCache.arrchild);
    }

    this.ischeckinfant = this.infant ? true :false;
  }
  selectclick(event, text) {
    for (let i = 0; i < this.arrchild.length; i++) {
      if (this.arrchild[i].text == text) {
        this.zone.run(()=>{
          this.arrchild[i].numage = event;
        })
        
        break;
      }

    }
  }

  checkpax() : Promise<any>{
    return new Promise((resolve, reject) => {
      if((this.adults + this.child + this.infant) >9){
        resolve(false);
      }
      else if( this.infant && this.adults && this.infant /this.adults >1){
        resolve(false);
      }
      else if(this.child && !this.adults){
        resolve(false)
      }
      else{
        resolve(true);
      }
    })
    
  }

  public removeInfantInArrayChild(array){
    if(array && array.length >0){
      let item = array.filter((i) => { return i.isInfant})[0];
      if(item){
        array.forEach( (arrayItem, index) => {
          if(arrayItem.id == item.id && arrayItem.isInfant) array.splice(index,1);
        });
      }
    }
    
   
  }

  public removeChildInArrayChild(array){
    if(array && array.length >0){
      let item = array.filter((i) => { return !i.isInfant})[0];
      if(item){
        array.forEach( (arrayItem, index) => {
          if(arrayItem.id == item.id && !arrayItem.isInfant) array.splice(index,1);
        });
      }
    }
   
  }

  data()
  {
    this.checkpax().then((valid) => {
      if(valid){
        this.valueGlobal.checksendcb=true;
        this._flightService.itemFlightCache.adult=this.adults;
        this._flightService.itemFlightCache.child=this.child;
        this._flightService.itemFlightCache.infant  = this.infant;
        this._flightService.itemFlightCache.roomnumber=this.room;
        this._flightService.itemFlightCache.arrchild= this.arrchild;
        this._flightService.itemFlightChangePax.emit(1);
        
        if(this.valueGlobal.backValue == "flightchangeinfo"){
          this.modalCtrl.dismiss(1);
        }else{
            this.navCtrl.back();
        }
      }else{
        this.gf.showToastWarning('iVIVU phục vụ tối đa 9 hành khách và mỗi người lớn chỉ đi kèm 1 em bé.');
      }
    });
    
  }
  ionViewDidLoad() {
    let elements = window.document.querySelectorAll(".tabbar");

    if (elements != null) {
      Object.keys(elements).map((key) => {
        elements[key].style.display = 'none';
      });
    }
  }

  async selectAge(textchild){
    var se =this;
   
    var columnOptions =['2','3','4','5','6','7','8','9','10','11'];

    const picker = await this.pickerController.create({
      columns: this.getColumns(1, se.ChildAgeTo, columnOptions, textchild),
      cssClass: 'action-sheets-select-age',
      buttons: [
        {
          text: textchild,
          cssClass: 'picker-header',
          handler: (value) => {
           return false;
          }
        }
      ],
    });

    $('.picker-wrapper.sc-ion-picker-ios').append('<div class="div-button"><button (click)="getPickerValue()" ion-button round outline class="button button-done">Xong</button></div>');
    $('.action-sheets-select-age .button-done').on('click', ()=>{
      let value = $('.picker-opt.picker-opt-selected')[0].innerText;
      se.selectclick(value, textchild);
      picker.dismiss();
    })
    await picker.present();
  }

  getColumns(numColumns, numOptions, columnOptions, textchild) {
    let columns: any = [];
    for (let i = 0; i < numColumns; i++) {
      columns.push({
        name: textchild,
        options: this.getColumnOptions(i, numOptions, columnOptions)
      });
    }

    return columns;
  }

  getColumnOptions(columnIndex, numOptions, columnOptions) {
    let options: any = [];
    for (let i = 0; i < numOptions; i++) {
      options.push({
        text: columnOptions[i],
        value: i
      })
    }

    return options;
  }

  getPickerValue(){
    var se = this;
    
  }
}