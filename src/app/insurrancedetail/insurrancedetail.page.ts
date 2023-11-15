import { File } from '@awesome-cordova-plugins/file/ngx';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Camera, CameraOptions  } from '@awesome-cordova-plugins/camera/ngx';
import { NavController, ModalController, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { GlobalFunction, ActivityService } from '../providers/globalfunction';
import * as $ from 'jquery';
import * as moment from 'moment';

import { Storage } from '@ionic/storage';
import { C } from '../providers/constants';
import * as formData from 'form-data';
//import * as FileReader from 'filereader';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SelectDateRangePage } from '../selectdaterange/selectdaterange.page';
import { AnyARecord } from 'dns';

var document:any;
@Component({
  selector: 'app-insurrancedetail',
  templateUrl: './insurrancedetail.page.html',
  styleUrls: ['./insurrancedetail.page.scss'],
})
export class InsurrancedetailPage implements OnInit {
  @ViewChild('ipTransferBranch') inputTransferBranch;
  @ViewChild('ipAccountName') inputAccountName;
  @ViewChild('ipAccountNumber') inputAccountNumber;
  @ViewChild('ipReceiveBranch') inputReceiveBranch;
  @ViewChild('ipPhone') inputPhone;
  @ViewChild('ipEmail') inputEmail;
  @ViewChild('ipProvince') inputProvince;
  @ViewChild('ipFlightNumber') inputFlightNumber;
  @ViewChild('ipName') inputName;
  @ViewChild('ipCMND') inputCMND;
  
  imageResponse:any = [];
  imageResponsepost:any = [];
  base64Image: any;ischeck=true;
  childlist: any=[];
  item:any;
  expecteddatetime:any;
  expecteddate: any;
  expectedtime: any;
  myCalendar: any;
  realdate: any;
  realtime: any;
  countchild:any=0;
  bankid:any;
  childselect:any;
  listBank = [
    {id: 29, name: "Ngân hàng TMCP Đại Chúng Việt Nam (PVcomBank)", imgurl: './assets/ic_bankonepay/Bank-Icons-00.png'},
    {id: 1, name: "Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)", imgurl: './assets/ic_bankonepay/Bank-Icons-01.jpg'},
    {id: 10, name: "Ngân hàng TMCP Hàng Hải Việt Nam (Maritime Bank)", imgurl: './assets/ic_bankonepay/Bank-Icons-02.jpg'},
    {id: 3, name: "Ngân hàng TMCP Sài Gòn – Hà Nội (SHB)", imgurl: './assets/ic_bankonepay/Bank-Icons-03.jpg'},
    {id: 3, name: "Ngân hàng TMCP Tiên Phong (TPBank)", imgurl: './assets/ic_bankonepay/Bank-Icons-04.png'},
    {id: 11, name: "Ngân hàng TMCP Xuất Nhập khẩu Việt Nam (Eximbank)", imgurl: './assets/ic_bankonepay/Bank-Icons-05.jpg'},
    {id: 20, name: "Ngân hàng TMCP Đông Nam Á (SeABank)", imgurl: './assets/ic_bankonepay/Bank-Icons-06.jpg'},
    {id: 7, name: "Ngân hàng TMCP Phát triển TPHCM (HDBank)", imgurl: './assets/ic_bankonepay/Bank-Icons-07.jpg'},
    {id: 6, name: "Ngân hàng TMCP Đông Á (DongABank)", imgurl: './assets/ic_bankonepay/Bank-Icons-08.jpg'},
    {id: 16, name: "Ngân hàng TMCP Sài Gòn Thương Tín (SacomBank)", imgurl: './assets/ic_bankonepay/Bank-Icons-09.jpg'},
    {id: 18, name: "Ngân hàng Thương mại TNHH một thành viên Đại Dương (OceanBank)", imgurl: './assets/ic_bankonepay/Bank-Icons-10.jpg'},
    {id: 8, name: "Ngân hàng TMCP Quân Đội (MB)", imgurl: './assets/ic_bankonepay/Bank-Icons-11.jpg'},
    {id: 25, name: "Ngân hàng TMCP Sài Gòn (SCB)", imgurl: './assets/ic_bankonepay/Bank-Icons-12.jpg'},
    {id: 15, name: "Ngân hàng TMCP An Bình (ABBank)", imgurl: './assets/ic_bankonepay/Bank-Icons-13.jpg'},
    {id: 14, name: "Ngân hàng TMCP Việt Nam Thịnh Vượng (VPBank)", imgurl: './assets/ic_bankonepay/Bank-Icons-14.jpg'},
    {id: 5, name: "Ngân hàng TMCP Quốc Tế Việt Nam (VIB)", imgurl: './assets/ic_bankonepay/Bank-Icons-15.jpg'},
    {id: 4, name: "Ngân hàng TMCP Công Thương Việt Nam (VietInBank)", imgurl: './assets/ic_bankonepay/Bank-Icons-16.jpg'},
    {id: 22, name: "Ngân hàng TMCP Bắc Á (Bac A Bank)", imgurl: './assets/ic_bankonepay/Bank-Icons-17.jpg'},
    {id: 19, name: "Ngân hàng Đầu tư và Phát triển Việt Nam (BIDV)", imgurl: './assets/ic_bankonepay/Bank-Icons-18.jpg'},
    {id: 17, name: "Ngân hàng TMCP Nam Á (Nam A Bank)", imgurl: './assets/ic_bankonepay/Bank-Icons-19.jpg'},
    {id: 9, name: "Ngân hàng TMCP Việt Á (Viet A Bank)", imgurl: './assets/ic_bankonepay/Bank-Icons-20.jpg'},
    {id: 23, name: "Ngân hàng TMCP Quốc Dân (NCB)", imgurl: './assets/ic_bankonepay/Bank-Icons-21.jpg'},
    {id: 2, name: "Ngân hàng TMCP Kỹ Thương Việt Nam (TeachcomBank)", imgurl: './assets/ic_bankonepay/Bank-Icons-22.jpg'},
    {id: 28, name: "Ngân hàng TMCP Việt Nam Thương Tín (DongABank)", imgurl: './assets/ic_bankonepay/bank_28.png'},
    {id: 21, name: "Union Pay", imgurl: './assets/ic_bankonepay/bank_21.png'},
    {id: 30, name: "Ngân hàng TMCP Bản Việt (DongABank)", imgurl: './assets/ic_bankonepay/bank_30.png'},
  ]
  phone: any;
  email: any;
  bankTransferBranch:any;
  bankReceiveBranch:any;
  bankAccountName:any;
  bankAccountNumber:any;
  province:any;
  child1Id: any = '';
  child1Name: any= '';
  child2Id: any= '';
  child2Name: any= '';
  child1Relation: any= '';
  child2Relation:any= '';
  child1Dob:any= '';
  child2Dob:any= '';
  child3Dob:any= '';
  child4Dob:any= '';
  child5Dob:any= '';
  child3Name: any= '';
  child4Name: any= '';
  child5Name: any= '';
  child3Id: any= '';
  child4Id: any= '';
  child5Id: any= '';
  originDepart1: any=null;
  realDepart1: any=null;
  imageResponseGKS: any[];
  imageResponseCMND: any[];
  formData: FormData = new FormData();
  data: any;
  dataform:any = [];
  dataformCMND:any = [];
  dataformGKS:any = [];
  type: any;
  flightNumber: any;
  flightNumberDisplay:any;

  child1ImageResponseGKS: any=[];
  child1ImageResponse: any=[];
  child2ImageResponseGKS: any=[];
  child2ImageResponse: any=[];
  child3ImageResponseGKS: any=[];
  child3ImageResponse: any=[];
  child4ImageResponseGKS: any=[];
  child4ImageResponse: any=[];
  child5ImageResponseGKS: any=[];
  child5ImageResponse: any=[];
  child1ImageResponseOther: any=[];
  child2ImageResponseOther: any=[];
  child3ImageResponseOther: any=[];
  child4ImageResponseOther: any=[];
  child5ImageResponseOther: any=[];

  child1dataform:any = [];
  child1dataformGKS:any = [];
  child2dataform:any = [];
  child2dataformGKS:any = [];
  child3dataform:any = [];
  child3dataformGKS:any = [];
  child4dataform:any = [];
  child4dataformGKS:any = [];
  child5dataform:any = [];
  child5dataformGKS:any = [];
  child1dataformOther:any = [];
  child2dataformOther:any = [];
  child3dataformOther:any = [];
  child4dataformOther:any = [];
  child5dataformOther:any = [];

  checkChangeFlight = false;
  loader: any;
  departCodeDisplay: string;
  arrivalCodeDisplay: string;
  showTransferInfo: boolean = false;
  showReceiveInfo = false;
  child3Relation: any;
  child4Relation: any;
  child5Relation: any;
  listchildclaimed: any[];
  isChildren: any;
  name:any;
  identityno:any;
  constructor(private imagePicker: ImagePicker,
    public camera: Camera,
    private file: File,
    private navCtrl:NavController, 
    public gf: GlobalFunction,
    private modalCtrl: ModalController,
    private zone: NgZone,
    private storage: Storage,
    public activityService: ActivityService,
    private toastrCtrl: ToastController,
    public httpClient: HttpClient,
    private sanitizer: DomSanitizer,
    public router: Router,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController) {
      this.storage.get('infocus').then(infocus => {
        if (infocus) {
          this.phone = infocus.phone;
        }
      })

      this.storage.get('email').then(email => {
        if (email) {
          this.email = email;
        }
      })

     }

  ngOnInit() {
      // Bắt sự kiện chọn bank
      this.activityService.currentArticle.subscribe( data => {
        //Xóa gạch chân đỏ khi đã chọn bank
        this.clearRequiredField();
        //Thay đổi giá trị => hiển thị phần thông tin nhập bank
        if(this.ischeck){
          this.showTransferInfo = true;
          this.showReceiveInfo = false;
        }else{
          this.showReceiveInfo = true;
          this.showTransferInfo = false;
        }
        
      });
  }
  goback()
  {
    //this.modalCtrl.dismiss();
    this.navCtrl.back();
  }

  ionViewWillEnter(){
    var se = this;
    se.clearValue();
    var data = se.gf.getParams('insurrenceDetail');
    se.childlist = data.childlist;
    se.isChildren = data.ischild;
    
    se.item = data.item;
    se.data = data;
    se.type = data.type;
    se.flightNumberDisplay= data.flightNumber;
    //test child
    // if(data && data.trip.insuranceInfo.adultList.length >0){
    //   se.childlist = data.trip.insuranceInfo.adultList;
    // }
    if(se.childlist && se.childlist.length >0){
      se.countchild = 0;
      // se.child1Id = se.childlist[0].id;
      // se.child1Name = se.childlist[0].name;
      // se.child1Dob = se.childlist[0].birth;
      //se.child1Dob = se.childlist[0].birth;
      //se.child1Relation = "Con";
    }
    if(se.isChildren){
      se.child1Relation= "Con";
    }
    se.expecteddate = data.trip.bookingsComboData && data.trip.bookingsComboData.length >0 ? ((se.type ==1 || se.type ==3) ? data.trip.bookingsComboData[0].departureDate : data.trip.bookingsComboData[1].departureDate) : '';
    se.expectedtime = data.trip.bookingsComboData && data.trip.bookingsComboData.length >0 ? ((se.type ==1 || se.type ==3) ? data.trip.bookingsComboData[0].departureTime : data.trip.bookingsComboData[1].departureTime) : '';
    let et = se.expectedtime.replace(':','') *1;
    let defaulttimeadd = 200;
    let timeadd = et + defaulttimeadd;
    let newtimestring='';
    if(timeadd < 1200){
      newtimestring = '0'+ timeadd;
    }else if(timeadd > 2400){
      let timesub = timeadd - 2400;
      if(timesub < 100){
        newtimestring = '00'+ timesub;
      }else{
        newtimestring = '0'+ timesub;
      }
    }
    else{
      newtimestring = ''+ timeadd;
    }
    let firststr = newtimestring.substring(0,2), endstr = newtimestring.substring(2,4);
    newtimestring = firststr + ':'+ endstr;
    console.log(newtimestring);
    se.realtime ='00:00';
    if(newtimestring){
      se.realtime = newtimestring;
    }
    se.realdate = data.trip.bookingsComboData && data.trip.bookingsComboData.length >0 ? ((se.type ==1 || se.type ==3) ? data.trip.bookingsComboData[0].departureDate :data.trip.bookingsComboData[1].departureDate) : '';
    //se.realtime = data.trip.bookingsComboData && data.trip.bookingsComboData.length >0 ? data.trip.bookingsComboData[0].departureTime : '';

    se.departCodeDisplay = data.trip.bookingsComboData && data.trip.bookingsComboData.length >0 ? data.trip.bookingsComboData[0].departCode + ' → ' + data.trip.bookingsComboData[0].arrivalCode : ''
    se.arrivalCodeDisplay = data.trip.bookingsComboData && data.trip.bookingsComboData.length >0 ? data.trip.bookingsComboData[1].departCode + ' → ' + data.trip.bookingsComboData[1].arrivalCode : ''
    //tên chủ tk
    se.bankAccountName = se.item.customer_name;
  }

  ionViewWillLeave(){

  }

  changeFlightTime(event){
    var se = this;
    if(event && event.detail.value){
      if(event.detail.value.indexOf('T') != -1){
        se.realtime = event.detail.value.split('T')[1].substring(0,5);
      }else{
        se.realtime = event.detail.value;
      }
      se.checkInputDateTime();
    }
  }

  /**
   * Check hợp lệ giờ bay thực tế
   */
  async checkInputDateTime():Promise<any>{
    var se = this,
        valid = true;
       
          return new Promise((resolve, reject) => {
              //Hủy chuyến thì bỏ qua valid giờ bay
              if(se.type == 3 || se.type == 4){
                resolve(true);
              }
              else if(se.realdate && se.realtime){
                  var arrrealdate = se.realdate.split('-'),
                  realdate = new Date(arrrealdate[2], arrrealdate[1]*1-1, arrrealdate[0]),
                  arrexpecteddate = se.expecteddate.split('-'),
                  expecteddate = new Date(arrexpecteddate[2], arrexpecteddate[1]*1-1, arrexpecteddate[0]);
                if(moment(realdate).diff(moment(expecteddate)) == 0){
                  if(se.realtime.replace(':','')*1 - se.expectedtime.replace(':','') < 200){
                    valid = false;
                    se.showToastr('Quý khách chỉ nhận được bảo hiểm khi chuyến bay khởi hành trễ từ 2 tiếng. Vui lòng kiểm tra lại giờ bay.');
                    return;
                  }
                }else if(moment(realdate).diff(moment(expecteddate)) < 0){
                  valid = false;
                  se.showToastr('Giờ bay thực tế không thể nhỏ hơn giờ bay dự kiến. Vui lòng kiểm tra lại giờ bay.');
                  return;
                }
                resolve(valid);
              }else{
                se.showToastr('Chưa nhập giờ bay thực tế. Vui lòng kiểm tra lại.');
                resolve(false);
              }
          })
        
  }

  async getImages(value,type,index) {
    var se = this;
    const options: CameraOptions = {
      quality: 76,
      sourceType: se.camera.PictureSourceType.SAVEDPHOTOALBUM,
      destinationType: se.camera.DestinationType.FILE_URI,
      encodingType: se.camera.EncodingType.JPEG,
      mediaType: se.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true,
      correctOrientation: true,
    }
    
    this.imagePicker.getPictures(options).then(async(results) => {
    //const imagePaths: string[] = await this.imagePicker.getPictures({});
    const imageFiles = await se.gf.getMultipleFiles(results);
      //Khi chọn ảnh thì xóa mảng theo loại ảnh chọn
      if(type == 1){//Adult
        if(value == 1){
          imageFiles.forEach(file => {
            se.dataform.push({file : file, filename: file.name});
          });
          
        }else if(value == 2){
          imageFiles.forEach(file => {
            se.dataformCMND.push({file : file, filename: file.name});
          });
        }
        else if(value == 3){
          imageFiles.forEach(file => {
            se.dataformGKS.push({file : file, filename: file.name});
          });
        }
      }else{
        if(value == 1){
          if(index==1){
            //se.child1dataform.push(item);
            imageFiles.forEach(file => {
              se.child1dataform.push({file : file, filename: file.name});
            });
          }
          else if(index==2){
            //se.child2dataform.push(item);
            imageFiles.forEach(file => {
              se.child2dataform.push({file : file, filename: file.name});
            });
          }
          else if(index==3){
            //se.child3dataform.push(item);
            imageFiles.forEach(file => {
              se.child3dataform.push({file : file, filename: file.name});
            });
          }
          else if(index==4){
            //se.child4dataform.push(item);
            imageFiles.forEach(file => {
              se.child4dataform.push({file : file, filename: file.name});
            });
          }
          else if(index==5){
            //se.child5dataform.push(item);
            imageFiles.forEach(file => {
              se.child5dataform.push({file : file, filename: file.name});
            });
          }
        }
        else if(value == 2){
          if(index==1){
            //se.child1dataformGKS.push(item);
            imageFiles.forEach(file => {
              se.child1dataformGKS.push({file : file, filename: file.name});
            });
          }
          else if(index==2){
            //se.child2dataformGKS.push(item);
            imageFiles.forEach(file => {
              se.child2dataformGKS.push({file : file, filename: file.name});
            });
          }
          else if(index==3){
            //se.child3dataformGKS.push(item);
            imageFiles.forEach(file => {
              se.child3dataformGKS.push({file : file, filename: file.name});
            });
          }
          else if(index==4){
            //se.child4dataformGKS.push(item);
            imageFiles.forEach(file => {
              se.child4dataformGKS.push({file : file, filename: file.name});
            });
          }
          else if(index==5){
            //se.child5dataformGKS.push(item);
            imageFiles.forEach(file => {
              se.child5dataformGKS.push({file : file, filename: file.name});
            });
          }
        }
        else if(value == 3){//Giấy tờ khác
          if(index==1){
            imageFiles.forEach(file => {
              se.child1dataformOther.push({file : file, filename: file.name});
            });
          }
          else if(index==2){
            imageFiles.forEach(file => {
              se.child2dataformOther.push({file : file, filename: file.name});
            });
          }
          else if(index==3){
            imageFiles.forEach(file => {
              se.child3dataformOther.push({file : file, filename: file.name});
            });
          }
          else if(index==4){
            imageFiles.forEach(file => {
              se.child4dataformOther.push({file : file, filename: file.name});
            });
          }
          else if(index==5){
            imageFiles.forEach(file => {
              se.child5dataformOther.push({file : file, filename: file.name});
            });
          }
        }
      }
      

      for (var i = 0; i < results.length; i++) {
        let filename='', path;
        se.base64Image = results[i];
        
        path = results[i].substring(0, results[i].lastIndexOf('/') + 1);
        filename = results[i].substring(results[i].lastIndexOf('/') + 1);
        let idx = filename.indexOf('?');
        if (idx > -1) {
          filename = filename.substring(0, idx);
        }
        se.file.readAsDataURL(path, filename).then(base64 => {
          var item = { img: base64, filename: filename };
          //Đẩy vào mảng imageResponse để hiển thị trên page
          if(type==1){
            if(value == 1)//Ảnh vé máy bay
            {
              se.imageResponse.push(item);
            }else if(value ==2)//Ảnh CMND
            {
              se.imageResponseCMND.push(item);
            }
            else if(value ==3)//Ảnh Giấy khai sinh
            {
              se.imageResponseGKS.push(item);
            }
          }else{
            if(value == 1){//vé máy bay
              if(index==1){
                se.child1ImageResponse.push(item);
              }
              else if(index==2){
                se.child2ImageResponse.push(item);
              }
              else if(index==3){
                se.child3ImageResponse.push(item);
              }
              else if(index==4){
                se.child4ImageResponse.push(item);
              }
              else if(index==5){
                se.child5ImageResponse.push(item);
              }
            }
            else if(value == 2){//Giấy khai sinh
              if(index==1){
                se.child1ImageResponseGKS.push(item);
              }
              else if(index==2){
                se.child2ImageResponseGKS.push(item);
              }
              else if(index==3){
                se.child3ImageResponseGKS.push(item);
              }
              else if(index==4){
                se.child4ImageResponseGKS.push(item);
              }
              else if(index==5){
                se.child5ImageResponseGKS.push(item);
              }
            }
            else if(value == 3){//Giấy tờ khác
              if(index==1){
                se.child1ImageResponseOther.push(item);
              }
              else if(index==2){
                se.child2ImageResponseOther.push(item);
              }
              else if(index==3){
                se.child3ImageResponseOther.push(item);
              }
              else if(index==4){
                se.child4ImageResponseOther.push(item);
              }
              else if(index==5){
                se.child5ImageResponseOther.push(item);
              }
            }
          }
          
        }).catch((error:any) =>{
          alert(error);
        })
      }
    }, (err) => {
      alert(err);
    });
  }

  clearRequiredField(){
    var se = this;
    let el:any = window.document.getElementById('ipbanktransferselected');
    if(el) {
      el.firstElementChild.classList.remove('required-field');
    }

    let el1:any = window.document.getElementById('ipbankreceiveselected');
    if(el1) {
      el1.firstElementChild.classList.remove('required-field');
    }
  }

  next()
  {
    var se = this;
    se.clearRequiredField();
    se.validateInput().then(async(valid)=>{
      if(valid){
        
        let alert = await se.alertCtrl.create({
          message: "Bạn chắc chắn muốn hoàn thành gửi yêu cầu bảo hiểm?",
          buttons: [
            {
              text: 'Để sau',
              handler: () => {
                return;
              }
            },
            {
              text: 'Gửi',
              role: 'OK',
              handler: () => {
                se.submitCathay();
              }
            }
          ]
        })
        
        alert.present();
        
          
      }
    })
  }

    submitCathay(){
    var se = this;
    // tạo text Chuyến Bay để điền PDF
    let dataflight = se.data.trip.bookingsComboData;
    let flightInfo1 =  dataflight[0].flightNumner +  ' | ' + dataflight[0].flightFrom + ' → ' + dataflight[0].flightTo   + ' | ' + dataflight[0].airlineName;
    let flightInfo2 = dataflight[1].flightNumner  + ' | ' +dataflight[1].flightFrom + ' → ' + dataflight[1].flightTo +  ' | '  + dataflight[1].airlineName;
    let flightDelayInfo1 = se.flightNumber  + ' | ' + dataflight[0].flightFrom + ' → ' + dataflight[0].flightTo +  ' | ' +  dataflight[0].airlineName;
    let flightDelayInfo2 = se.flightNumber  + ' | ' + dataflight[1].flightFrom + ' → ' + dataflight[1].flightTo +  ' | ' + dataflight[1].airlineName;
    let origin1Str = 'Khởi hành ' + dataflight[0].departureTime + ', ' + dataflight[0].departureDate + ' | ' + flightInfo1
    let origin2Str = 'Khởi hành ' + dataflight[1].departureTime + ', ' + dataflight[1].departureDate + ' | ' + flightInfo2;
    let real1Str = (se.type == 1 || se.type ==3) ? 'Khởi hành ' + se.realtime + ', ' + se.realdate + ' | ' + (se.checkChangeFlight ? flightDelayInfo1 : flightInfo1) : '';
    let real2Str = '';
    if(dataflight[1]){
      real2Str = (se.type ==2 || se.type==4) ? 'Khởi hành ' + se.realtime + ', ' + se.realdate + ' | ' + (se.checkChangeFlight ? flightDelayInfo2  : flightInfo2) : '';
      //real2Str = (se.type == 3 || se.type ==4) ? 'Khởi hành ' + se.realtime + ', ' + se.realdate + ' | ' + flightInfo2 : '';
    }
    //Nếu là chuyến đi => gán lại chuỗi chiều về = '' (không hiển thị trên file pdf chiều về)
    if(se.type ==1 || se.type==3){
      origin2Str = '';
      real2Str = '';
    }else if(se.type ==2){//Ngược lại => chuỗi chiều đi = '' (không hiển thị trên file pdf chiều đi)
      origin1Str='';
      real1Str = '';
    }else if(se.type == 4){
      origin1Str = origin2Str;
      real1Str = '';
      origin2Str = '';
    }
    var form = new formData();
    if(se.dataform && se.dataform.length >0){
      se.dataform.forEach(element => {
        form.append('files[]', element.file, element.filename);
      });
    }
    
    if(se.dataformCMND && se.dataformCMND.length >0){
      se.dataformCMND.forEach(element => {
        form.append('files[]', element.file, element.filename);
      });
    }
    if(se.dataformGKS && se.dataformGKS.length >0){
      se.dataformGKS.forEach(element => {
        form.append('files[]', element.file, element.filename);
      });
    }
    //Ảnh vé máy bay trẻ em
    if(se.child1dataform && se.child1dataform.length >0){
      se.child1dataform.forEach(element => {
        form.append('files[]', element.file, element.filename);
      });
    }
    if(se.child2dataform && se.child2dataform.length >0){
      se.child2dataform.forEach(element => {
        form.append('files[]', element.file, element.filename);
      });
    }
    if(se.child3dataform && se.child3dataform.length >0){
      se.child3dataform.forEach(element => {
        form.append('files[]', element.file, element.filename);
      });
    }
    if(se.child4dataform && se.child4dataform.length >0){
      se.child4dataform.forEach(element => {
        form.append('files[]', element.file, element.filename);
      });
    }
    if(se.child5dataform && se.child5dataform.length >0){
      se.child5dataform.forEach(element => {
        form.append('files[]', element.file, element.filename);
      });
    }
    //Ảnh GKS trẻ em
    if(se.child1dataformGKS && se.child1dataformGKS.length >0){
      se.child1dataformGKS.forEach(element => {
        form.append('files[]', element.file, element.filename);
      });
    }
    if(se.child2dataformGKS && se.child2dataformGKS.length >0){
      se.child2dataformGKS.forEach(element => {
        form.append('files[]', element.file, element.filename);
      });
    }
    if(se.child3dataformGKS && se.child3dataformGKS.length >0){
      se.child3dataformGKS.forEach(element => {
        form.append('files[]', element.file, element.filename);
      });
    }
    if(se.child4dataformGKS && se.child4dataformGKS.length >0){
      se.child4dataformGKS.forEach(element => {
        form.append('files[]', element.file, element.filename);
      });
    }
    if(se.child5dataformGKS && se.child5dataformGKS.length >0){
      se.child5dataformGKS.forEach(element => {
        form.append('files[]', element.file, element.filename);
      });
    }
    //Giấy tờ khác
    if(se.child1dataformOther && se.child1dataformOther.length >0){
      se.child1dataformOther.forEach(element => {
        form.append('files[]', element.file, element.filename);
      });
    }
    if(se.child2dataformOther && se.child2dataformOther.length >0){
      se.child2dataformOther.forEach(element => {
        form.append('files[]', element.file, element.filename);
      });
    }
    if(se.child3dataformOther && se.child3dataformOther.length >0){
      se.child3dataformOther.forEach(element => {
        form.append('files[]', element.file, element.filename);
      });
    }
    if(se.child4dataformOther && se.child4dataformOther.length >0){
      se.child4dataformOther.forEach(element => {
        form.append('files[]', element.file, element.filename);
      });
    }
    if(se.child5dataformOther && se.child5dataformOther.length >0){
      se.child5dataformOther.forEach(element => {
        form.append('files[]', element.file, element.filename);
      });
    }
    se.listchildclaimed = [];
    if(se.child1Name && se.child1ImageResponse.length >0){
      se.listchildclaimed.push({code: se.child1Id, flightNumber: se.checkChangeFlight ? se.flightNumber : se.data.flightNumber })
    }
    if(se.child2Name && se.child2ImageResponse.length >0){
      se.listchildclaimed.push({code: se.child2Id, flightNumber: se.checkChangeFlight ? se.flightNumber : se.data.flightNumber })
    }
    if(se.child3Name && se.child3ImageResponse.length >0){
      se.listchildclaimed.push({code: se.child3Id, flightNumber: se.checkChangeFlight ? se.flightNumber : se.data.flightNumber })
    }
    if(se.child4Name && se.child4ImageResponse.length >0){
      se.listchildclaimed.push({code: se.child4Id, flightNumber: se.checkChangeFlight ? se.flightNumber : se.data.flightNumber })
    }
    if(se.child5Name && se.child5ImageResponse.length >0){
      se.listchildclaimed.push({code: se.child5Id, flightNumber: se.checkChangeFlight ? se.flightNumber : se.data.flightNumber })
    }

    var formObj = {
      id: se.item.insurance_code,
      cusId: se.isChildren ? se.identityno :se.item.customer_id,//Nếu chọn trẻ em ủy quyền thì lấy theo info ủy quyền
      cusName: se.isChildren ? se.name :se.item.customer_name,//Nếu chọn trẻ em ủy quyền thì lấy theo info ủy quyền
      cusBirth: se.item.customer_dob,
      cusPhone: se.phone,
      cusEmail: se.email,
      child1Id: se.isChildren ? se.item.customer_id :se.child1Id,//Nếu chọn trẻ em ủy quyền thì lấy theo item chọn để claim
      child1Name: se.isChildren ? se.item.customer_name :se.child1Name,//Nếu chọn trẻ em ủy quyền thì lấy theo item chọn để claim
      child1Birth: se.isChildren ? se.item.customer_dob :se.child1Dob,//Nếu chọn trẻ em ủy quyền thì lấy theo item chọn để claim
      child1Relation: se.child1Relation,
      child2Id: se.child2Id,
      child2Name: se.child2Name,
      child2Birth: se.child2Dob,
      child2Relation: se.child2Relation,
      bankName: se.activityService.bank.name,
      accName: se.inputAccountName ? se.inputAccountName.value : '',
      accNumber: se.inputAccountNumber ? se.inputAccountNumber.value : '',
      subBank: se.inputTransferBranch ? se.inputTransferBranch.value : se.inputReceiveBranch.value,
      province: se.province,
      originDepart1: se.type == 1 ? origin1Str : origin2Str,
      originDepart2: '' ,
      realDepart1: se.type == 1 ? real1Str : real2Str,
      realDepart2: '',
      isCancel: (se.type == 3 || se.type == 4) ? true: false,
      bookingId: se.data.trip.booking_id,
      originFlightNumber: se.checkChangeFlight ? se.data.flightNumber : "",
      isChildrenClaimForm: se.isChildren ? true : false
    }
   
    let obj = JSON.stringify(formObj);
    form.append("data", obj);

    if(form){
      se.presentLoading();
          se.storage.get('auth_token').then(auth_token => {
            //let formdata = se.formData;
            if (auth_token) {
              var text = "Bearer " + auth_token;

              var options = {
                headers: new HttpHeaders({'Authorization': text})
              }
              let urlApi = C.urls.baseUrl.urlMobile +'/api/Dashboard/ClaimCathay';
              //let urlApi = 'http://192.168.10.121:3400/api/Dashboard/ClaimCathay';
              se.httpClient.post(urlApi, form, options).subscribe((res:any)=>{
                if(res.result){
                  console.log(se.data.flightNumber);
                  let objparam = { id: se.data.trip.booking_id ,code: se.item.insurance_code, flightNumber: se.checkChangeFlight ? se.flightNumber : se.data.flightNumber, listchildclaimed: se.listchildclaimed, flightNumberOriginal: se.checkChangeFlight ? se.data.flightNumber : "" };
                  se.gf.setParams(objparam, 'insurranceClaimed');
                  se.router.navigateByUrl("/insurrancedone");
                  se.activityService.insurranceBookingId = se.data.trip.booking_id;
                  se.activityService.objClaimed = objparam;
                  se.clearValue();
                  //se.modalCtrl.dismiss({ id: se.item.booking_id ,code: se.item.insurance_code, listchildclaimed: listchildclaimed});
                }
                else{
                  se.showToastr(res.msg);
                }
                if(se.loader){
                  se.loader.dismiss();
                }
              })
        }else{
          se.showWarning('Bạn cần đăng nhập để thực hiện chức năng này.');
        }
      })
    }
  }

  test(){
    var se = this;
    let objparam = { id: se.item.booking_id ,code: se.item.insurance_code};
                  se.gf.setParams(objparam, 'insurranceClaimed');
    se.router.navigateByUrl("/insurrancedone");
  }

  itemrd()
  {
    this.ischeck=true;
    this.activityService.bank = null;
    this.showTransferInfo = true;
    this.showReceiveInfo = false;
  }
  itemrdinbank()
  {
    this.ischeck=false;
    this.activityService.bank = null;
    this.showReceiveInfo = true;
    this.showTransferInfo = false;
  }

  async openPickupCalendar() {
    var arrdate = this.expecteddate.split('-')
    let fromdate = new Date(arrdate[2],arrdate[1]*1-1, arrdate[0]);

    let modal = await this.modalCtrl.create({
      component: SelectDateRangePage,
        animated: true,
        mode: 'ios'
      });

    // se.searchhotel.formChangeDate = 2;
    // se.searchhotel.CheckInDate = fromdate;
    // se.searchhotel.CheckOutDate = se.cout;
    // se.bookCombo.CheckInDate = se.cin;
    // se.bookCombo.CheckOutDate = se.cout;
    // modal.present().then(() => {
    //   se.ischeckcalendar = true;
    // });

   
  
  }

  /**
   * Hàm bắt sự kiện click chọn ngày trên lịch bằng jquery
   * @param e biến event
   */
  async clickedElement(e: any) {
    var se = this;
    var obj: any = e.currentTarget;
    if (obj) {
      if (this.modalCtrl) {
        let fday: any;
        let tday: any;
        var monthstartdate: any;
        var yearstartdate: any;
        var objTextMonth: any;

        tday = $(obj)[0].textContent;
        objTextMonth = $('.on-selected').closest('.month-box').children()[0].textContent;

        if (objTextMonth && objTextMonth.length > 0) {
          monthstartdate = objTextMonth.split('/')[0].trim();
          yearstartdate = objTextMonth.split('/')[1].trim();
          var fromdate = new Date(yearstartdate, monthstartdate - 1, tday);
          
          //if(fromdate){
            setTimeout(() => {
              se.modalCtrl.dismiss();
            }, 100);

            se.zone.run(()=>{
              se.realdate = moment(fromdate).format('DD-MM-YYYY');
            })
          //}
        }
      }
    }
  }

  addChildInfo(){
    var se = this;
    se.countchild +=1;
    $('.item-child-'+se.countchild).parent().removeClass('hidden').addClass('show');
    if(se.countchild == 1){
      se.child1Relation = "Con";
    }
    else if(se.countchild == 2){
      se.child2Relation = "Con";
    }
    else if(se.countchild == 3){
      se.child3Relation = "Con";
    }
    else if(se.countchild == 4){
      se.child4Relation = "Con";
    }
    else if(se.countchild == 5){
      se.child5Relation = "Con";
    }
  }
  /**
   * Valida input trên page
   */
  async validateInput(){
    var se = this, valid = true;
    return new Promise((resolve,reject)=>{
      se.checkInputDateTime().then((isValid)=>{
        if(isValid){
          //Check đổi mã chuyến bay nếu có tích chọn
          if(se.checkChangeFlight && !se.flightNumber){
            se.showToastr('Xin vui lòng nhập mã chuyến bay.');
            se.inputFlightNumber.setFocus();
            valid = false;
            return;
          }
          //Nếu chọn trẻ em claim form thì check thêm họ tên & cmnd
          if(se.isChildren){
            if(!se.name){
              se.showToastr('Xin vui lòng nhập họ tên.');
              se.inputName.setFocus();
              valid = false;
              return;
            }
            else if(!se.identityno){
              se.showToastr('Xin vui lòng nhập số chứng minh nhân dân/hộ chiếu.');
              se.inputCMND.setFocus();
              valid = false;
              return;
            }
          }
          //Check input phone
          if(!se.phonenumber(se.phone)){
            se.showToastr('Xin vui lòng nhập điện thoại.');
            se.inputPhone.setFocus();
            valid = false;
            return;
          }
          //Check input email
          else if(!se.validateEmail(se.email)){
            se.showToastr('Xin vui lòng nhập email.');
            se.inputEmail.setFocus();
            valid = false;
            return;
          }
          else if(!se.activityService.bank){
            se.showToastr('Xin vui lòng chọn ngân hàng chuyển khoản.');
            valid = false;
            if(se.ischeck){
              let el:any = window.document.getElementById('ipbanktransferselected');
              if(el) {
                el.firstElementChild.classList.add('required-field');
              }
            }else{
              let el:any = window.document.getElementById('ipbankreceiveselected');
              if(el) {
                el.firstElementChild.classList.add('required-field');
              }
            }
            return;
          }
          else if(se.ischeck){
            if(!se.bankTransferBranch){
              se.showToastr('Xin vui lòng nhập chi nhánh ngân hàng.');
              se.inputTransferBranch.setFocus();
              valid = false;
              return;
            }
            if(!se.bankAccountName){
              se.showToastr('Xin vui lòng nhập tên chủ tài khoản.');
              se.inputAccountName.setFocus();
              valid = false;
              return;
            }
            if(!se.bankAccountNumber){
              se.showToastr('Xin vui lòng nhập số tài khoản.');
              se.inputAccountNumber.setFocus();
              valid = false;
              return;
            }
          }else if(!se.ischeck){
            if(!se.bankReceiveBranch){
              se.showToastr('Xin vui lòng nhập chi nhánh ngân hàng.');
              se.inputReceiveBranch.setFocus();
              valid = false;
              return;
            }
            else if(!se.province){
              se.showToastr('Xin vui lòng nhập tỉnh/ thành.');
              se.inputProvince.setFocus();
              valid = false;
              return;
            }
          }
          //Kiểm tra nhập ảnh
            if(!se.imageResponse || se.imageResponse.length ==0){
              se.showToastr('Xin vui lòng cung cấp vé máy bay.');
              valid = false;
              return;
            }
            else if(!se.imageResponseCMND || se.imageResponseCMND.length ==0){
              se.showToastr('Xin vui lòng cung cấp chứng minh nhân dân.');
              valid = false;
              return;
            }else if(se.isChildren && se.imageResponseGKS.length == 0 ){
              se.showToastr('Xin vui lòng cung cấp giấy ủy quyền.');
              valid = false;
              return;
            }
          //Kiểm tra cung cấp ảnh của trẻ em
            if(se.childlist.length >0 && se.countchild >0){
              let arrcheck = [se.child1Name, se.child2Name, se.child3Name, se.child4Name, se.child5Name];
              
              //Trẻ 1
              if(se.child1Name && se.child1ImageResponse.length == 0 ){
                se.showToastr('Xin vui lòng cung cấp vé máy bay cho trẻ 1.');
                valid = false;
                return;
              }
              else if(se.child1Name && se.child1ImageResponseGKS.length == 0 ){
                se.showToastr('Xin vui lòng cung cấp giấy khai sinh cho trẻ 1.');
                valid = false;
                return;
              }
              else if(se.child1Name && se.child1Relation == 'Khác' && se.child1ImageResponseOther.length == 0 ){
                se.showToastr('Xin vui lòng cung cấp giấy tờ khác cho trẻ 1.');
                valid = false;
                return;
              }
              else if(se.child1Name && arrcheck.filter((n)=> n == se.child1Name).length >1 ){
                se.showToastr('Trẻ em đang trùng tên. Xin vui lòng kiểm tra lại');
                valid = false;
                return;
              }
              //Trẻ 2
              else if(se.child2Name && se.child2ImageResponse.length == 0 ){
                se.showToastr('Xin vui lòng cung cấp vé máy bay cho trẻ 2.');
                valid = false;
                return;
              }
              else if(se.child2Name && se.child2ImageResponseGKS.length == 0 ){
                se.showToastr('Xin vui lòng cung cấp giấy khai sinh cho trẻ 2.');
                valid = false;
                return;
              }
              else if(se.child2Name && se.child2Relation == 'Khác' && se.child2ImageResponseOther.length == 0 ){
                se.showToastr('Xin vui lòng cung cấp giấy tờ khác cho trẻ 2.');
                valid = false;
                return;
              }
              else if(se.child2Name && arrcheck.filter((n)=> n == se.child2Name).length >1 ){
                se.showToastr('Trẻ em đang trùng tên. Xin vui lòng kiểm tra lại');
                valid = false;
                return;
              }
              //Trẻ 3
              else if(se.child3Name && se.child3ImageResponse.length == 0 ){
                se.showToastr('Xin vui lòng cung cấp vé máy bay cho trẻ 3.');
                valid = false;
                return;
              }
              else if(se.child3Name && se.child3ImageResponseGKS.length == 0 ){
                se.showToastr('Xin vui lòng cung cấp giấy khai sinh cho trẻ 3.');
                valid = false;
                return;
              }
              else if(se.child3Name && se.child3Relation == 'Khác' && se.child3ImageResponseOther.length == 0 ){
                se.showToastr('Xin vui lòng cung cấp giấy tờ khác cho trẻ 3.');
                valid = false;
                return;
              }
              else if(se.child3Name && arrcheck.filter((n)=> n == se.child3Name).length >1 ){
                se.showToastr('Trẻ em đang trùng tên. Xin vui lòng kiểm tra lại');
                valid = false;
                return;
              }
              //Trẻ 4
              else if(se.child4Name && se.child4ImageResponse.length == 0 ){
                se.showToastr('Xin vui lòng cung cấp vé máy bay cho trẻ 4.');
                valid = false;
                return;
              }
              else if(se.child4Name && se.child4ImageResponseGKS.length == 0 ){
                se.showToastr('Xin vui lòng cung cấp giấy khai sinh cho trẻ 4.');
                valid = false;
                return;
              }
              else if(se.child4Name && se.child4Relation == 'Khác' && se.child4ImageResponseOther.length == 0 ){
                se.showToastr('Xin vui lòng cung cấp giấy tờ khác cho trẻ 4.');
                valid = false;
                return;
              }
              else if(se.child4Name && arrcheck.filter((n)=> n == se.child4Name).length >1 ){
                se.showToastr('Trẻ em đang trùng tên. Xin vui lòng kiểm tra lại');
                valid = false;
                return;
              }
              //Trẻ 5
              else if(se.child5Name && se.child5ImageResponse.length == 0 ){
                se.showToastr('Xin vui lòng cung cấp vé máy bay cho trẻ 5.');
                valid = false;
                return;
              }
              else if(se.child5Name && se.child5ImageResponseGKS.length == 0 ){
                se.showToastr('Xin vui lòng cung cấp giấy khai sinh cho trẻ 5.');
                valid = false;
                return;
              }
              else if(se.child5Name && se.child5Relation == 'Khác' && se.child5ImageResponseOther.length == 0 ){
                se.showToastr('Xin vui lòng cung cấp giấy tờ khác cho trẻ 5.');
                valid = false;
                return;
              }
              else if(se.child5Name && arrcheck.filter((n)=> n == se.child5Name).length >1 ){
                se.showToastr('Trẻ em đang trùng tên. Xin vui lòng kiểm tra lại');
                valid = false;
                return;
              }
            }
         
          resolve(valid);
        }
        else{
          resolve(false);
        }
      })
      
      
    })
  }
  /**
   * Valid số điện thoại
   * @param inputtxt chuỗi input
   */
  phonenumber(inputtxt) {
    var n = Number(inputtxt);
    if (n) {
      var test1 = inputtxt.length;
      if (inputtxt) {
        if (test1 == 10) {
          return true;
        }
        else {
          return false;
        }
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }
  /**
   * Valid email
   * @param email chuỗi input email
   */
  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  async showToastr(msg){
    var se = this;
    const toast = await se.toastrCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top',
    });
    toast.present();
  }

  selectedChildren(event, index){
    var se = this;
    if(event.detail){
      if(index == 0){
        se.child1Id = event.detail.value.split('|')[0];
        se.child1Name = event.detail.value.split('|')[1];
        se.child1Dob = event.detail.value.split('|')[2];
      }else if(index == 1){
        se.child2Id = event.detail.value.split('|')[0];
        se.child2Name = event.detail.value.split('|')[1];
        se.child2Dob = event.detail.value.split('|')[2];
      }
      else if(index == 2){
        se.child3Id = event.detail.value.split('|')[0];
        se.child3Name = event.detail.value.split('|')[1];
        se.child3Dob = event.detail.value.split('|')[2];
      }
      else if(index == 3){
        se.child4Id = event.detail.value.split('|')[0];
        se.child4Name = event.detail.value.split('|')[1];
        se.child4Dob = event.detail.value.split('|')[2];
      }
      else if(index == 4){
        se.child5Id = event.detail.value.split('|')[0];
        se.child5Name = event.detail.value.split('|')[1];
        se.child5Dob = event.detail.value.split('|')[2];
      }
    }
    
    console.log(event);
  }

  selectedRelation(ev, index){
    var se = this;
    let idx = index+1;
    if(idx ==1){
      se.child1Relation = ev.detail.value;
    }
    if(idx ==2){
      se.child2Relation = ev.detail.value;
    }
    if(idx ==3){
      se.child3Relation = ev.detail.value;
    }
    if(idx ==4){
      se.child4Relation = ev.detail.value;
    }
    if(idx ==5){
      se.child5Relation = ev.detail.value;
    }
  }

  clearImg(value, idx){
    this.zone.run(()=>{
      if(value == 1){
        if(idx != undefined){
          this.imageResponse.splice(idx,1);
          this.dataform.splice(idx,1);
        }else{
          this.imageResponse = [];
          this.dataform = [];
        }
      }if(value == 2){
        if(idx != undefined){
          this.imageResponseCMND.splice(idx,1);
          this.dataformCMND.splice(idx,1);
        }else{
          this.imageResponseCMND = [];
          this.dataformCMND = [];
        }
      }if(value == 3){
        if(idx != undefined){
          this.imageResponseGKS.splice(idx,1);
          this.dataformGKS.splice(idx,1);
        }else{
          this.imageResponseGKS = [];
          this.dataformGKS = [];
        }
      }
      
    })
    
  }

  clearImgChild(value, childindex, idx){
    this.zone.run(()=>{
      if(value == 1){
        if(idx != undefined){
          if(childindex == 1){
            this.child1ImageResponse.splice(idx,1);
            this.child1dataform.splice(idx,1);
          }
          else if(childindex == 2){
            this.child2ImageResponse.splice(idx,1);
            this.child2dataform.splice(idx,1);
          }
          else if(childindex == 3){
            this.child3ImageResponse.splice(idx,1);
            this.child3dataform.splice(idx,1);
          }
          else if(childindex == 4){
            this.child4ImageResponse.splice(idx,1);
            this.child4dataform.splice(idx,1);
          }
          else if(childindex == 5){
            this.child5ImageResponse.splice(idx,1);
            this.child5dataform.splice(idx,1);
          }
          
        }else{
          if(childindex == 1){
            this.child1ImageResponse= [];
            this.child1dataform= [];
          }
          else if(childindex == 2){
            this.child2ImageResponse= [];
            this.child2dataform= [];
          }
          else if(childindex == 3){
            this.child3ImageResponse= [];
            this.child3dataform= [];
          }
          else if(childindex == 4){
            this.child4ImageResponse= [];
            this.child4dataform= [];
          }
          else if(childindex == 5){
            this.child5ImageResponse= [];
            this.child5dataform= [];
          }
        }
      }if(value == 2)
      {
        if(idx != undefined){
          if(childindex == 1){
            this.child1ImageResponseGKS.splice(idx,1);
            this.child1dataformGKS.splice(idx,1);
          }
          else if(childindex == 2){
            this.child2ImageResponseGKS.splice(idx,1);
            this.child2dataformGKS.splice(idx,1);
          }
          else if(childindex == 3){
            this.child3ImageResponseGKS.splice(idx,1);
            this.child3dataformGKS.splice(idx,1);
          }
          else if(childindex == 4){
            this.child4ImageResponseGKS.splice(idx,1);
            this.child4dataformGKS.splice(idx,1);
          }
          else if(childindex == 5){
            this.child5ImageResponseGKS.splice(idx,1);
            this.child5dataformGKS.splice(idx,1);
          }
        }else{
          if(childindex == 1){
            this.child1ImageResponseGKS = [];
            this.child1dataformGKS = [];
          }
          else if(childindex == 2){
            this.child2ImageResponseGKS = [];
            this.child2dataformGKS = [];
          }
          else if(childindex == 3){
            this.child3ImageResponseGKS = [];
            this.child3dataformGKS = [];
          }
          else if(childindex == 4){
            this.child4ImageResponseGKS = [];
            this.child4dataformGKS = [];
          }
          else if(childindex == 5){
            this.child5ImageResponseGKS = [];
            this.child5dataformGKS = [];
          }
        }
      }
      if(value == 3)
      {
        if(idx != undefined){
          if(childindex == 1){
            this.child1ImageResponseOther.splice(idx,1);
            this.child1dataformOther.splice(idx,1);
          }
          else if(childindex == 2){
            this.child2ImageResponseOther.splice(idx,1);
            this.child2dataformOther.splice(idx,1);
          }
          else if(childindex == 3){
            this.child3ImageResponseOther.splice(idx,1);
            this.child3dataformOther.splice(idx,1);
          }
          else if(childindex == 4){
            this.child4ImageResponseOther.splice(idx,1);
            this.child4dataformOther.splice(idx,1);
          }
          else if(childindex == 5){
            this.child5ImageResponseOther.splice(idx,1);
            this.child5dataformOther.splice(idx,1);
          }
        }else{
          if(childindex == 1){
            this.child1ImageResponseOther = [];
            this.child1dataformOther = [];
          }
          else if(childindex == 2){
            this.child2ImageResponseOther = [];
            this.child2dataformOther = [];
          }
          else if(childindex == 3){
            this.child3ImageResponseOther = [];
            this.child3dataformOther = [];
          }
          else if(childindex == 4){
            this.child4ImageResponseOther = [];
            this.child4dataformOther = [];
          }
          else if(childindex == 5){
            this.child5ImageResponseOther = [];
            this.child5dataformOther = [];
          }
        }
      }
    })
    
  }

  /**
   * Chọn ảnh
   * @param event object khi chọn file
   * @param value loại input: 1 - vé máy bay; 2 - CMND; 3 - Giấy khai sinh
   */
  async uploadImage(event,value){
    var se = this;
    if(!value){
      return;
    }
    if(value == 1){
      se.dataform = [];
      se.imageResponse = [];
    }else if(value == 2){
      se.dataformCMND = [];
      se.imageResponseCMND = [];
    }
    else if(value == 3){
      se.dataformGKS = [];
      se.imageResponseGKS = [];
    }
    for(let i=0; i<event.target.files.length; i++){
      var file = event.target.files[i],
      filename = file.name;
    // if(file.size > 2000000){
    //   se.showToastr('Ảnh không được quá 2Mb, vui lòng chọn lại.');
    //   return;
    // }
    if ( /\.(jpe?g|png|gif|pdf)$/i.test(file.name) ) {
    var reader  = new FileReader();
  
      reader.onload = function () {
        if(this.result){
          if(value == 1){
            
            var item = { img: this.result, filename: filename }
            se.imageResponse.push(item);
            
          }
          else if(value == 2){
            
            var item = { img: this.result, filename: filename }
            se.imageResponseCMND.push(item);
            
          }
          else if(value == 3){
            
            var item = { img: this.result, filename: filename }
            se.imageResponseGKS.push(item);
            
          }
        }
      }
    
      if (file) {
        reader.readAsDataURL(file);
        let item:any = {file: file, filename: filename}
        if(value == 1){
         
          se.dataform.push(item);
        }
        else if(value == 2){
         
          se.dataformCMND.push(item);
        }
        else if(value == 3){
          
          se.dataformGKS.push(item);
        }
      }
    }
    };
    
  }

  /**
   * Chọn ảnh
   * @param event object khi chọn file
   * @param value loại input: 1 - vé máy bay; 2 - Giấy khai sinh
   * @param index thứ tự trẻ
   */
  async uploadImageChild(event,value, index){
    var se = this;
    if(!value){
      return;
    }
    if(value == 1){
      if(index==1){
        se.child1dataform = [];
        se.child1ImageResponse = [];
      }
      else if(index==2){
        se.child2dataform = [];
        se.child2ImageResponse = [];
      }
      else if(index==3){
        se.child3dataform = [];
        se.child3ImageResponse = [];
      }
      else if(index==4){
        se.child4dataform = [];
        se.child4ImageResponse = [];
      }
      else if(index==5){
        se.child5dataform = [];
        se.child5ImageResponse = [];
      }
      
    }
    else if(value == 2){
      if(index==1){
        se.child1dataformGKS = [];
        se.child1ImageResponseGKS = [];
      }
      else if(index==2){
        se.child2dataformGKS = [];
        se.child2ImageResponseGKS = [];
      }
      else if(index==3){
        se.child3dataformGKS = [];
        se.child3ImageResponseGKS = [];
      }
      else if(index==4){
        se.child4dataformGKS = [];
        se.child4ImageResponseGKS = [];
      }
      else if(index==5){
        se.child5dataformGKS = [];
        se.child5ImageResponseGKS = [];
      }
    }
    //event.target.files.forEach(element => {
    for(let i=0; i<event.target.files.length; i++){
      var file = event.target.files[i],
      filename = file.name;
    // if(file.size > 20000000){
    //   se.showToastr('Ảnh không được quá 20Mb, vui lòng chọn lại.');
    //   return;
    // }
    if ( /\.(jpe?g|png|gif|pdf)$/i.test(file.name) ) {
    var reader  = new FileReader();
  
      reader.onload = function () {
        if(this.result){
          var item = { img: this.result, filename: filename }
          if(value == 1){
            if(index==1){
              se.child1ImageResponse.push(item);
            }
            else if(index==2){
              se.child2ImageResponse.push(item);
            }
            else if(index==3){
              se.child3ImageResponse.push(item);
            }
            else if(index==4){
              se.child4ImageResponse.push(item);
            }
            else if(index==5){
              se.child5ImageResponse.push(item);
            }
          }
          else if(value == 2){
            if(index==1){
              se.child1ImageResponseGKS.push(item);
            }
            else if(index==2){
              se.child2ImageResponseGKS.push(item);
            }
            else if(index==3){
              se.child3ImageResponseGKS.push(item);
            }
            else if(index==4){
              se.child4ImageResponseGKS.push(item);
            }
            else if(index==5){
              se.child5ImageResponseGKS.push(item);
            }
          }
        }
      }
    
      if (file) {
        reader.readAsDataURL(file);
        let item:any = {file: file, filename: filename}
        if(value == 1){
          if(index==1){
            se.child1dataform.push(item);
          }
          else if(index==2){
            se.child2dataform.push(item);
          }
          else if(index==3){
            se.child3dataform.push(item);
          }
          else if(index==4){
            se.child4dataform.push(item);
          }
          else if(index==5){
            se.child5dataform.push(item);
          }
        }
        else if(value == 2){
          if(index==1){
            se.child1dataformGKS.push(item);
          }
          else if(index==2){
            se.child2dataformGKS.push(item);
          }
          else if(index==3){
            se.child3dataformGKS.push(item);
          }
          else if(index==4){
            se.child4dataformGKS.push(item);
          }
          else if(index==5){
            se.child5dataformGKS.push(item);
          }
        }
      }
    }
    };
    
  }

  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
      duration: 60000
    });
    this.loader.present();
  }

  clearValue(){
    var se = this;
    
    se.realdate = "";
    se.realtime = "";
    se.bankTransferBranch = "";
    se.bankAccountName ="";
    se.bankAccountNumber = "";
    se.bankReceiveBranch = "";
    se.province = "";
    se.ischeck = true;
    se.checkChangeFlight = false;
    se.flightNumber = "";
    if(se.activityService.bank){
      se.activityService.bank.name = null;
    }
    var rd = window.document.getElementsByTagName('ion-radio');
    if(rd && rd.length>0){
      for (let index = 0; index < rd.length; index++) {
        const element = rd[index];
        element.classList.remove('radio-checked');
      }
    }
    se.showReceiveInfo = false;
    se.showTransferInfo = false;

    se.imageResponse=[];
    se.imageResponseCMND=[];
    se.imageResponseGKS=[];
    se.dataform=[];
    se.dataformCMND=[];
    se.dataformGKS=[];

    se.child1ImageResponseGKS =[];
    se.child1ImageResponse =[];
    se.child1ImageResponseOther =[];
    se.child2ImageResponseGKS =[];
    se.child2ImageResponse =[];
    se.child2ImageResponseOther =[];
    se.child3ImageResponseGKS =[];
    se.child3ImageResponse =[];
    se.child3ImageResponseOther =[];
    se.child4ImageResponseGKS =[];
    se.child4ImageResponse =[];
    se.child4ImageResponseOther =[];
    se.child5ImageResponseGKS =[];
    se.child5ImageResponse =[];
    se.child5ImageResponseOther =[];

    se.child1dataform = [];
    se.child1dataformGKS = [];
    se.child1dataformOther = [];
    se.child2dataform = [];
    se.child2dataformGKS = [];
    se.child2dataformOther = [];
    se.child3dataform = [];
    se.child3dataformGKS = [];
    se.child3dataformOther = [];
    se.child4dataform = [];
    se.child4dataformGKS = [];
    se.child4dataformOther = [];
    se.child5dataform = [];
    se.child5dataformGKS = [];
    se.child5dataformOther = [];

  }

  async showWarning(msg){
    var se = this;
    let alert = await this.alertCtrl.create({
      message: msg,
      buttons: [
        {
          text: 'Để sau',
          handler: () => {
            return;
          }
        },
        {
          text: 'Đăng nhập',
          role: 'OK',
          handler: () => {
            this.storage.remove('auth_token');
            this.storage.remove('email');
            this.storage.remove('username');
            this.storage.remove('jti');
            this.storage.remove('userInfoData');
            this.storage.remove('userRewardData');
            this.storage.remove('point');
            this.storage.remove('blogtripdefault');
            this.router.navigateByUrl('/login');
          }
        },
      ]
    });
    alert.present();
  }

  changeFlight(){
    this.checkChangeFlight = !this.checkChangeFlight;
  }

  inputAdultName(event){
    var se = this;
    if(event.detail){
      se.bankAccountName = event.detail.currentTarget.value;
    }
  }

  inputBankAccountName(event){
    var se = this;
    if(event.detail){
      se.name = event.detail.currentTarget.value;
    }
  }
}
