import { ValueGlobal } from './../providers/book-service';
import { Component, NgZone, OnInit } from '@angular/core';
import { NavController, AlertController, ModalController, Platform, ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { C } from './../providers/constants';
import { GlobalFunction } from './../providers/globalfunction';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

import { NetworkProvider } from '../network-provider.service';
//import { File, FileReader } from '@awesome-cordova-plugins/file/ngx';
import {Filesystem, Directory, Encoding} from '@capacitor/filesystem';
import { Camera, CameraOptions, CameraResultType, CameraSource } from '@capacitor/camera';
import { FCM } from '@capacitor-community/fcm';
import { BizTravelService } from '../providers/bizTravelService';
import { InAppBrowser, InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';

var document:any;
/**
 * Generated class for the TabPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'app-tab5',
  templateUrl: 'tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})

export class Tab5Page implements OnInit {
  loginuser;
  username;
  listSupport:any = [];
  isShowConfirm = false;
  point = -1;
  private subscription:any;
  public isConnected: boolean = true;
  base64Image: any;
  croppedImagefilename: any;
  fileType: any;
  croppedImagepath: any;
  avatar: any;
  linkfb: any;
  version: any;
  constructor(public platform: Platform, public navCtrl: NavController, public storage: Storage, public modalCtrl: ModalController,
    public valueGlobal: ValueGlobal, public zone: NgZone, public alertCtrl: AlertController, public gf: GlobalFunction, private router: Router,
    
    public networkProvider: NetworkProvider,
    public actionsheetCtrl: ActionSheetController,
    public bizTravelService: BizTravelService,
    private iab: InAppBrowser) {

    storage.get('auth_token').then(auth_token => {
      this.loginuser = auth_token;
    });
    this.storage.get('fbaccesstoken').then((accesstoken) => {
      this.linkfb = accesstoken;
    });
    this.storage.get('userInfoData').then((data)=>{
      if(data.point){
        
        this.point = data.point;
      }
    });
    this.platform.resume.subscribe(async () => {
      this.ionViewWillEnter();
    })
    //google analytic
    gf.googleAnalytion('show-more', 'Search', '');
    //Kiểm tra mạng trước khi loaddata
    if (this.networkProvider.isOnline()) {
      this.isConnected = true;
      //
      this.gf.setNetworkStatus(true);
      setTimeout(() => {
        //Lấy danh sách nhân viên hỗ trợ
        this.loadEmployeeSupport();
      }, 300)
    } else {
      this.isConnected = false;
      //
      this.gf.setNetworkStatus(false);
      this.gf.showWarning('Không có kết nối mạng', 'Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng', 'Đóng');
    }
  }

  public async ngOnInit() {
    var se = this;
    await se.onEnter();
    se.subscription = se.router.events.subscribe((event) => {
      se.storage.get('auth_token').then(auth_token => {
        if (auth_token) {
          se.zone.run(() => {
            se.loginuser = auth_token;
            se.refreshUserName();
            se.point = -1;
          })

          if (event instanceof NavigationEnd && (event.url.indexOf("tab5") != -1)) {
            se.onEnter();
          }
        }
      });


    })
  }

  onEnter() {
    var se = this;
    se.zone.run(() => {
      se.storage.get('userInfoData').then((data) => {
        if (data) {
          se.avatar = data.avatar;
          if (data.bizAccount) {
            se.bizTravelService.bizAccount = data.bizAccount;
            se.bizTravelService.isCompany = true;
            se.bizTravelService.accountBizTravelChange.emit(1);
          } else {
            se.bizTravelService.bizAccount = null;
            se.bizTravelService.isCompany = false;
            se.bizTravelService.accountBizTravelChange.emit(2);
          }

          if(data.point){
            se.point = data.point;
          }
        } else {
          //se.avatar = null;
          se.loadUserInfo();
        }

      })
      if (se.gf.getParams('userAvatar')) {
        se.croppedImagepath = se.gf.getParams('userAvatar');
      }
      
    })

  }

  refreshUserName() {
    this.storage.get('username').then(username => {
      this.username = username;
    });
  }

  loadEmployeeSupport() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        let urlStr = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/BookingMemberDetailByUser';
        let headers = {
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          authorization: text
        };
        this.gf.RequestApi('GET', urlStr, headers, {}, 'tab5', 'loadEmployeeSupport').then((data) => {

          if (data) {
            se.zone.run(() => {
              var listemployee = data;
              listemployee.forEach(element => {
                if (se.listSupport.length == 0) {
                  se.listSupport.push(element);
                } else if (!se.checkExistEmployee(se.listSupport, element)) {
                  se.listSupport.push(element);
                }
              });
            });
          } else {
            se.listSupport = [];

          }

        });
      }
    });
  }

  checkExistEmployee(list, itemcheck) {
    var se = this, res = false;
    var obj = list.filter((item) => { return item.name == itemcheck.name });
    if (obj && obj.length > 0) {
      res = true;
    }

    return res;
  }


  enabledTabbar() {
    let elements = window.document.querySelectorAll(".tabbar");

    if (elements != null) {
      Object.keys(elements).map((key) => {
        elements[key].style.display = 'flex';
      });
    }
  }

  ionViewDidLoad() {
    this.gf.clearActivatedTab();
    this.enabledTabbar();
  }
  async ionViewWillEnter() {
    var se = this;

    if (this.valueGlobal.pagechangetab5) {
      this.navCtrl.navigateForward([this.valueGlobal.pagechangetab5]);
    } else {
      se.point = -1;
      if (this.networkProvider.isOnline()) {
        this.isConnected = true;
        
        this.gf.setNetworkStatus(true);
        setTimeout(() => {
          //Lấy danh sách nhân viên hỗ trợ
          this.loadEmployeeSupport();
          //this.GetUserInfo()
        }, 300)
      } else {
        this.isConnected = false;
        
        this.gf.setNetworkStatus(false);
        this.gf.showWarning('Không có kết nối mạng', 'Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng', 'Đóng');
      }
      setTimeout(() => {
        se.zone.run(() => {
          se.loadUserInfo();
          se.refreshUserName();

        })
      }, 100)
     
    }
  //Lấy app version
  this.version= await this.gf.getAppVersion();
  }

  ionViewDidEnter() {
    var se = this;
    se.storage.get('username').then(username => {
      se.username = username;
    });
  }

  /**
   * Load thông tin user
   */
  loadUserInfo() {
    var se = this;
    try {
     
      se.storage.get('auth_token').then(auth_token => {
        if (auth_token) {
            se.gf.getUserInfo(auth_token).then((data) => {
              if (data) {
                se.zone.run(() => {
                  if (data) {
                    se.avatar = data.avatar;
                  }
                  se.point = data.point;
                  se.storage.set('userInfoData', data);
                  se.storage.set('point', data.point);
                  se.storage.set("email", data.email);
                  se.storage.set("jti", data.memberId);
                  se.storage.set("username", data.fullname);
                  se.storage.set("phone", data.phone);
                  se.storage.set("point", data.point);
                  se.storage.get('auth_token').then(auth_token => {
                    se.loginuser = auth_token;
                  });
                  se.storage.get('username').then(username => {
                    se.username = username;
                  });
                  if (data.bizAccount) {
                    se.bizTravelService.bizAccount = data.bizAccount;
                    se.bizTravelService.isCompany = true;
                  } else {
                    se.bizTravelService.bizAccount = null;
                    se.bizTravelService.isCompany = false;
                  }
  
                  se.storage.get('fbaccesstoken').then((accesstoken) => {
                    se.linkfb = accesstoken;
                  });
                })
  
  
  
              }
            })
          //});
        } else {
          se.zone.run(() => {
            se.bizTravelService.bizAccount = null;
            se.bizTravelService.isCompany = false;
            se.loginuser = null;
          })
        }
      })
    } catch (error) {
      var objError = {
        page: 'tab5',
        func: 'LoadUserInfo',
        message: 'error',
        content: error,
        type: "error",
        param: JSON.stringify(error)
      };
      C.writeErrorLog(objError,error);
    }
    
  }

  loadUserInfoRefresh(token) {
    var se = this;
    if (token) {
      var text = "Bearer " + token;
      let urlStr = C.urls.baseUrl.urlMobile + '/api/Dashboard/GetUserInfo';
      let headers = {
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        authorization: text
      };
      this.gf.RequestApi('GET', urlStr, headers, {}, 'tab5', 'loadUserInfoRefresh').then((data) => {
        if (data) {
          se.zone.run(() => {
            se.avatar = data.avatar;

            se.storage.get('fbaccesstoken').then((accesstoken) => {
              se.linkfb = accesstoken;
            });
          })
          se.point = data.point;
          se.storage.remove('userInfoData').then(() => {
            se.storage.set('userInfoData', data);
          });

          if (data.bizAccount) {
            se.bizTravelService.bizAccount = data.bizAccount;
            se.bizTravelService.isCompany = true;
          }
        }

      });
    }
  }

  goToLogin() {
    this.storage.get('auth_token').then(auth_token => {
      if (!auth_token) {
        this.valueGlobal.backValue = 'tab5';
        this.valueGlobal.logingoback = '/app/tabs/tab5';
        this.navCtrl.navigateForward('/login');
      }
    });
  }
  goToLogout() {
    this.storage.get('auth_token').then(id_token => {
      if (id_token !== null) {
        this.showConfirmLogout('Bạn có chắc chắn muốn đăng xuất?', id_token);
      }
    });
  }
  /***
     * Gọi tổng đài hỗ trợ
     * PDANH 26/02/2019
     */
  async makeCallSupport(value) {
    try {
      let tel = "19001870";
      if (value == 1) {
        tel = "19002045";
      } else if (value == 2) {
        tel = "19001870";
      }
      if (value > 3) {
        tel = value;
      }
      else {
        tel = "19002087";
      }
      setTimeout(() => {
        window.open(`tel:${tel}`, '_system');
      }, 100);
    }
    catch (error:any) {
      if (error) {
        error.page = "show-more";
        error.func = "makeCallSupport";
        C.writeErrorLog(error, null);
      };
    }
    //google analytic
    this.gf.googleAnalytion('show-more', 'callsupport', '');
  }


  public async showConfirm(msg) {
    let alert = await this.alertCtrl.create({
      message: msg,
      buttons: [
        {
          text: 'Để sau',
          handler: () => {
            this.storage.remove('auth_token');
            this.storage.remove('email');
            this.storage.remove('username');
            this.storage.remove('jti');
            this.storage.remove('userInfoData');
            this.storage.remove('userRewardData');
            this.storage.remove('point');
            this.storage.remove('blogtripdefault');
            this.storage.remove('infocus');
            this.zone.run(() => {
              this.point = 0;
              this.isShowConfirm = false;
              this.gf.reLoad = true;
              this.valueGlobal.countNotifi = 0;
              this.loginuser = null;
              this.username = "";
            })
            //this.navCtrl.navigateBack('/');
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

            this.zone.run(() => {
              this.point = 0;
              this.isShowConfirm = false;
              this.gf.reLoad = true;
              this.valueGlobal.countNotifi = 0;
              this.loginuser = null;
              this.username = "";
            })
            this.valueGlobal.backValue = 'tab5';
            this.navCtrl.navigateForward('/login');
          }
        }
      ]
    });
    alert.present();

    alert.onDidDismiss().then((data) => {
      this.storage.remove('auth_token');
      this.storage.remove('email');
      this.storage.remove('username');
      this.storage.remove('jti');
      this.storage.remove('userInfoData');
      this.storage.remove('userRewardData');
      this.storage.remove('point');
      this.storage.remove('blogtripdefault');
      this.zone.run(() => {
        this.point = 0;
        this.isShowConfirm = false;
        this.gf.reLoad = true;
        this.valueGlobal.countNotifi = 0;
        this.loginuser = null;
        this.username = "";
      })
      this.navCtrl.navigateBack('/');
    })
  }

  public async showConfirmLogin(msg) {
    let alert = await this.alertCtrl.create({
      message: msg,
      buttons: [
        {
          text: 'Để sau',
          handler: () => {
            this.storage.remove('auth_token');
            this.storage.remove('email');
            this.storage.remove('username');
            this.storage.remove('jti');
            this.storage.remove('userInfoData');
            this.storage.remove('userRewardData');
            this.storage.remove('point');
            this.storage.remove('blogtripdefault');
            this.zone.run(() => {
              this.point = 0;
              this.isShowConfirm = false;
              this.gf.reLoad = true;
              this.valueGlobal.countNotifi = 0;
              this.loginuser = null;
              this.username = "";
            })
            //this.navCtrl.navigateBack('/');
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
            this.zone.run(() => {
              this.point = 0;
              this.isShowConfirm = false;

              this.gf.reLoad = true;
              this.valueGlobal.countNotifi = 0;
              this.loginuser = null;
              this.username = "";
            })
            this.valueGlobal.backValue = 'tab5';
            this.navCtrl.navigateForward('/login');
          }
        }
      ]
    });
    alert.present();
    alert.onDidDismiss().then((data) => {
      this.isShowConfirm = false;
    })
  }

  public async showConfirmLogout(msg, id_token) {
    let alert = await this.alertCtrl.create({
      message: msg,
      cssClass: "cls-alert-showmore",
      buttons: [{
        text: 'Có',
        role: 'OK',
        handler: () => {
          this.storage.remove('auth_token');
          this.storage.remove('email');
          this.storage.remove('username');
          this.storage.remove('jti');
          this.storage.remove('userInfoData');
          this.storage.remove('userRewardData');
          this.storage.remove('weatherInfo');
          this.storage.remove('point');
          this.storage.remove('infocus');
          this.storage.remove('blogtripdefault');
          this.storage.remove('listmytrips');
          this.storage.clear();
          this.zone.run(() => {
            this.point = 0;
            this.loginuser = null;
            this.username = "";
            this.valueGlobal.backValue = 'tab5';

            this.isShowConfirm = false;
            this.valueGlobal.countNotifi = 0;
            this.gf.reLoad = true;
            this.gf.setParams(null, 'userAvatar');
            this.croppedImagepath = '';
            //Xóa token device khi logout
            if (this.platform.is('cordova')) {
              FCM.getToken().then(token => {
                this.gf.DeleteTokenOfUser(token, id_token, this.gf.getAppVersion());
              });
            }

            this.bizTravelService.bizAccount = null;
            this.bizTravelService.actionHistory = [];
            this.bizTravelService.isCompany = false;
            this.bizTravelService.accountBizTravelChange.emit(2);
            this.navCtrl.navigateForward('/login');
          })

        }
      },
      {
        text: 'Không',
        handler: () => {

        }
      }
      ]
    });
    alert.present();
  }

  showUserReward() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        // let modal = this.modalCtrl.create("UserRewardPage");
        // modal.present();
        this.navCtrl.navigateForward('/userreward');
      } else {
        if (se.isShowConfirm) return;
        se.showConfirmLogin("Bạn cần đăng nhập để sử dụng chức năng này.");
        se.isShowConfirm = true;
      }
    });
    //google analytic
    se.gf.googleAnalytion('show-more', 'Search', 'userreward');
  }

  showUserProfile() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        // let modal = se.modalCtrl.create("UserProfilePage");
        // modal.present();
        this.valueGlobal.pagechangetab5 = '/userprofile';
        this.gf.setParams(se.croppedImagepath, 'userAvatar');
        this.navCtrl.navigateForward('/userprofile');
      } else {
        if (se.isShowConfirm) return;
        se.showConfirmLogin("Bạn cần đăng nhập để sử dụng chức năng này.");
        se.isShowConfirm = true;
      }
    });
    //google analytic
    se.gf.googleAnalytion('show-more', 'Search', 'userprofile');
  }

  Point() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        //se.app.getActiveNav().push('CuspointsPage');
        // this.valueGlobal.pagechange='/cuspoints';
        this.navCtrl.navigateForward('/cuspoints');
      } else {
        if (se.isShowConfirm) return;
        se.showConfirmLogin("Bạn cần đăng nhập để sử dụng chức năng này.");
        se.isShowConfirm = true;
      }
    });
    //google analytic
    se.gf.googleAnalytion('show-more', 'Search', 'userpoint');
  }

  showUserReviews() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        // let modal = se.modalCtrl.create("UserReviewsPage");
        // modal.present();
        this.navCtrl.navigateForward('/userreviews');
      } else {
        if (se.isShowConfirm) return;
        se.showConfirmLogin("Bạn cần đăng nhập để sử dụng chức năng này.");
        se.isShowConfirm = true;
      }
    });
    //google analytic
    se.gf.googleAnalytion('show-more', 'Search', 'userreviews');
  }

  sendSMSSupport() {
    var se = this;
    // let modal =se.modalCtrl.create("SendSmsPage");
    // modal.present();
    this.navCtrl.navigateForward('/sendsms');
  }

  showUserTravelHobby() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        se.navCtrl.navigateForward('/usertravelhobby');
      } else {
        if (se.isShowConfirm) return;
        se.showConfirmLogin("Bạn cần đăng nhập để sử dụng chức năng này.");
        se.isShowConfirm = true;
      }
    });
  }

  doRefresh(event) {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        se.loginuser = auth_token;

        se.zone.run(() => {
          se.refreshUserName();
          se.storage.get('point').then(point => {
            se.point = point;
          });
        })
      } else {
        //se.showConfirm("Phiên đăng nhập hết hạn. Xin vui lòng đăng nhập lại để sử dụng chức năng này.");
        se.isShowConfirm = true;
      }
    });
    setTimeout(() => {
      event.target.complete();
    }, 200)

  }

  async changeAvatar() {
    let actionSheet = await this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Chụp ảnh',
          role: 'destructive',
          icon: 'camera',
          handler: () => {

            this.captureImage();
          }
        },
        {
          text: 'Chọn ảnh từ bộ sưu tập',
          icon: 'image',
          handler: () => {
            this.captureImageGallery();
          }
        },
      ]
    });
    actionSheet.present();
    actionSheet.onDidDismiss().then((data: any) => {
      if (!data) {
        actionSheet.dismiss();
      }
    })
  }
  /**
   * Chọn từ bộ sưu tập
   * @param useAlbum 
   */
  async captureImageGallery() {
    var se = this;
    const options: CameraOptions = {
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      saveToGallery: true,
      correctOrientation: true,
    }

    Camera.getPhoto(options).then((res:any) => {
      if (res && res.base64String) {
        let base64Image = res.base64String;
        let filename, path;
        let imageData = res.base64String;
        se.base64Image = imageData;
        se.zone.run(() => {
          se.croppedImagepath = "data:image/jpeg;base64," + imageData;
        })
        path = imageData.substring(0, imageData.lastIndexOf('/') + 1);
        filename = imageData.substring(imageData.lastIndexOf('/') + 1);
        let index = filename.indexOf('?');
        if (index > -1) {
          filename = filename.substring(0, index);
          imageData = imageData.split('?')[0];

        }
        se.croppedImagefilename = filename;
        se.uploadAvatar(imageData);
      }

    })
  }

  /**
   * Chụp ảnh
   * @param useAlbum 
   */
  async captureImage() {
    var se = this;
    const options: CameraOptions = {
      quality: 90,
      resultType: CameraResultType.Base64,
      //encodingType: this.camera.EncodingType.JPEG,
      //mediaType: this.camera.MediaType.PICTURE,
      source: CameraSource.Camera,
      saveToGallery: true,
      correctOrientation: true,
    }

    this.zone.run(() => {
      Camera.getPhoto(options).then((res:any) => {
        if (res && res.base64String) {
          let filename, path;
          let base64Image = res.base64String;
          se.base64Image = base64Image;
          se.zone.run(() => {
            se.croppedImagepath =  "data:image/jpeg;base64," +base64Image;
          })
          path = base64Image.substring(0, base64Image.lastIndexOf('/') + 1);
          filename = base64Image.substring(base64Image.lastIndexOf('/') + 1);
          let index = filename.indexOf('?');
          if (index > -1) {
            filename = filename.substring(0, index);
          }
          se.croppedImagefilename = filename;
          se.uploadAvatar(base64Image);
        }
      });
    })
  }

  uploadAvatar(image: any) {
    var se = this;
    //se.getFullImage(se.base64Image.split('?')[0]).then((data) => {
      se.storage.get('auth_token').then(auth_token => {
        if (auth_token) {
          var text = "Bearer " + auth_token;
          let body = {
            "imgBase64Full": image,
            "imgBase64Crop": image,
            "fileExtension": 'jpeg'
          };
          let urlStr = C.urls.baseUrl.urlMobile + '/api/dashboard/UploadAvatarBase64';
          let headers = {
            authorization: text
          };
          this.gf.RequestApi('POST', urlStr, headers, body, 'tab5', 'uploadAvatar').then((data) => {

            se.storage.remove('userInfoData');

          })
        }
      })

    //});



  }

  cropImage(imgPath) {
    // crop.show({
    //   source: imgPath,
    //   ratio:"16:9"
    // }).then( 
    //     newPath => {
    //             //this.showCroppedImage(newPath.split('?')[0]);
    //             console.log(newPath);
    //             this.showCroppedImage(newPath);
    //         },
    //         error => {
    //         throw error;
    //     })
    //this.showCroppedImage(imgPath);
    this.uploadAvatar(imgPath);
  }
  /**
   * Trả về dạng base64 của image full
   * @param ImagePath Đường dẫn image full
   */
  getFullImage(ImagePath): Promise<any> {
    return new Promise((resolve, reject) => {
      var copyPath = ImagePath;
      var splitPath = copyPath.split('/');
      var imageName = splitPath[splitPath.length - 1];
      var filePath = ImagePath.split(imageName)[0];
      var splitType = imageName.split('.');
      var imageType = splitType[splitType.length - 1];
      var se = this;
      Filesystem.readFile({path: ImagePath,  directory: Directory.Documents,
        encoding: Encoding.UTF8}).then(base64 => {
          console.log(base64)
        //let b64: any = base64.split(',')[1];
        resolve(base64);
      })
    })
  }
  /**
 * Trả về dạng base64 của image đã scrop
 * @param ImagePath Đường dẫn image scrop
 */
  showCroppedImage(ImagePath) {
    var copyPath = ImagePath;
    var splitPath = copyPath.split('/');
    var imageName = splitPath[splitPath.length - 1];
    var filePath = ImagePath.split(imageName)[0];
    var splitType = imageName.split('.');
    var imageType = splitType[splitType.length - 1];

    var se = this;
    se.fileType = imageType;
    Filesystem.readFile({path: filePath,  directory: Directory.Documents,
      encoding: Encoding.UTF8}).then(base64 => {
      se.zone.run(() => {
        se.croppedImagepath = base64;
      })
      const contentType = 'image/' + imageType;
      //let b64: any = base64.split(',')[1];
      //se.croppedImagepath = "data:image/jpeg;base64,"+base64;
      se.uploadAvatar(base64);
    })

  }
  GetUserInfo() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        this.gf.getUserInfo(auth_token).then((data) => {
          if (data && data.statusCode != 401) {
            var info;
            var checkfullname = se.validateEmail(data.fullname);

            if (!checkfullname) {
              var textfullname = data.fullname.split(' ')
              //info = { ho: textfullname[0], ten: textfullname[1], phone: data.phone }
              if (textfullname.length > 2) {
                let name = '';
                for (let i = 1; i < textfullname.length; i++) {
                  if (i == 1) {
                    name += textfullname[i];
                  } else {
                    name += ' ' + textfullname[i];
                  }
                }
                info = { ho: textfullname[0], ten: name, phone: data.phone }
              } else {
                info = { ho: textfullname[0], ten: textfullname[1], phone: data.phone }
              }
              se.storage.set("infocus", info);
            } else {
              info = { ho: "", ten: "", phone: data.phone }
              se.storage.set("infocus", info);
            }
            se.storage.set("email", data.email);
            se.storage.set("jti", data.memberId);
            //se.storage.set("auth_token", body.auth_token);
            se.storage.set("username", data.fullname);
            se.storage.set("phone", data.phone);
            se.storage.set("point", data.point);
            se.storage.get('auth_token').then(auth_token => {
              se.loginuser = auth_token;
            });
            se.storage.get('username').then(username => {
              se.username = username;
            });
            se.storage.get('point').then(point => {
              
              se.point = point;
            });
          }


        });
      }
    })
  }
  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  showCompanyInfo() {
    this.navCtrl.navigateForward('/companyinfo');
  }

  linkProfile() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        this.navCtrl.navigateForward('/userlinkprofile');
      } else {
        if (se.isShowConfirm) return;
        se.showConfirmLogin("Bạn cần đăng nhập để sử dụng chức năng này.");
        se.isShowConfirm = true;
      }
    });

  }

  showPrivacyPolicy() {
    //this.navCtrl.navigateForward('/userprivacypolicy');
    const options: InAppBrowserOptions = {
      zoom: 'no',
      location: 'yes',
      toolbar: 'yes',
      hideurlbar: 'yes',
      closebuttoncaption: 'Đóng',
      hidenavigationbuttons: 'yes'
    };
    let _iab = this.iab.create('https://www.ivivu.com/chinh-sach-rieng-tu', '_self', options);
    _iab.on('exit').subscribe(() => {

    })
  }

  showCondition() {
    //this.navCtrl.navigateForward('/usercondition');
    const options: InAppBrowserOptions = {
      zoom: 'no',
      location: 'yes',
      toolbar: 'yes',
      hideurlbar: 'yes',
      closebuttoncaption: 'Đóng',
      hidenavigationbuttons: 'yes'
    };
    let _iab = this.iab.create('https://www.ivivu.com/dieu-kien-dieu-khoan', '_self', options);
    _iab.on('exit').subscribe(() => {

    })
  }

  showUserVoucher() {
    let se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        this.navCtrl.navigateForward('/myvoucher');
      } else {
        if (se.isShowConfirm)
          return;

        se.showConfirmLogin("Bạn cần đăng nhập để sử dụng chức năng này.");
        se.isShowConfirm = true;
      }
    });

  }
  goToRegister() {
    this.navCtrl.navigateForward('/register');
  }
  openZaloPage() {
    this.navCtrl.navigateForward('/userzalo');
  }
  deleteAcc() {
    var se=this;

      se.storage.get('jti').then((memberid) => {
        let strUrl =  C.urls.baseUrl.urlMobile + '/api/Dashboard/getActiveBookingByMemberID?memberid='+memberid+'&pageIndex=1&pageSize=100';
        se.gf.RequestApi('GET', strUrl, {}, {}, 'Tab1', 'getShowNotice').then((data)=> {
          if (data.status==0) {
              se.navCtrl.navigateForward('accountdeletion');
          }else if(data.status==1){
           // alert('Chúng tôi đã nhận được yêu cầu của bạn. Vui lòng kiểm tra hộp thư '+data.email+' để hoàn tất việc xóa tài khoản của bạn');
           se.navCtrl.navigateForward('accountdeletion');
          } else if (data.status==2) {
            alert('Tính năng hiện tại chưa sử dụng được vì quý khách đang có đơn hàng chưa hoàn thành');
          }else if(data.status==-2){
            alert('Tài khoản của quý khách không tồn tại');
          }else if(data.status==-1){
            alert('Gửi mail bị lỗi. Vui lòng thử lại sau');
          }
        })
       
       
    })
   

  }
}