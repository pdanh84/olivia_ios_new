import { OverlayEventDetail } from '@ionic/core';
import { Component, NgZone, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Platform, NavController, AlertController, ToastController, ActionSheetController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { C } from './../providers/constants';
import { Camera, CameraOptions, CameraResultType, CameraSource } from '@capacitor/camera';
import { ValueGlobal } from '../providers/book-service';
import { GlobalFunction } from './../providers/globalfunction';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
import { File, FileReader } from '@awesome-cordova-plugins/file/ngx';
import { ConfirmotpPage} from 'src/app/confirmotp/confirmotp';

@Component({
        selector: 'app-userprofile',
        templateUrl: 'userprofile.html',
        styleUrls: ['userprofile.scss'],
        providers: [ImagePicker],
    })

export class UserProfilePage implements OnInit {
    userInfoData: any;
    public userProfileData: FormGroup;
    public changepass = false;
    public phone = "";
    public name = "";
    public changephone = false;
    public changename = false;
    public sentOTP = false;
    public haspassword = '';
    public photos: any;
    public strwarning = "";
    public isShowWarning = false;
    public strwarningoldpass = "";
    public intervalID;
    public base64Image: any;
    public htmlImageFromCamera: string;
    respData: any;
    imagePickerOptions = {
        maximumImagesCount: 1,
        quality: 50
    };
    croppedImagepath: any;
    croppedImagefilename: any;
    croppedFile: any;
    selectedImage: any;
    fileType: any;
    
    constructor(public navCtrl: NavController, public toastCtrl: ToastController,public modalCtrl: ModalController,
        public zone: NgZone, public storage: Storage, public alertCtrl: AlertController, public formBuilder: FormBuilder,
        public actionsheetCtrl: ActionSheetController, public platform: Platform, public valueGlobal: ValueGlobal,
        private file: File,
        public gf: GlobalFunction) {
        //self.loadUserInfo();
        //self.checkHasPassword();

        //google analytic
        gf.googleAnalytion('userprofile', 'load', '');
    }

    ngOnInit() {

    }
    /**
     * Load thông tin user
     */
    loadUserInfo() {
        var se = this;
        se.storage.get('auth_token').then(auth_token => {
            if (auth_token) {
                var text = "Bearer " + auth_token;
                // var options = {
                //     method: 'GET',
                //     url: C.urls.baseUrl.urlMobile + '/api/Dashboard/GetUserInfo',
                //     timeout: 10000, maxAttempts: 5, retryDelay: 2000,
                //     headers:
                //     {
                //         'cache-control': 'no-cache',
                //         'content-type': 'application/json',
                //         authorization: text
                //     }
                // };
                let urlStr = C.urls.baseUrl.urlMobile + '/api/Dashboard/GetUserInfo';
          
                let headers = {
                    'cache-control': 'no-cache',
                    'content-type': 'application/json',
                    authorization: text
                };
                this.gf.RequestApi('GET', urlStr, headers, {}, 'userlinkprofile', 'postDatafb').then((data)=>{

                        if (data) {
                            se.zone.run(() => {
                                se.userInfoData = data;
                                se.bindFormGroup(se.userInfoData);
                            })
                            se.storage.set('userInfoData', data);
                        }
                        else {
                            if (!se.isShowWarning) {
                                //se.showConfirm();
                                se.isShowWarning = true;
                            }
                        }
                    
                });
            } else {
                se.zone.run(() => {
                    se.bindFormGroup(null);
                })
            }
        })
    }

    ionViewWillEnter() {
        var se = this;
        setTimeout(() => {
            se.zone.run(() => {
                se.storage.get('userInfoData').then((data: any) => {
                    if (data) {
                        se.zone.run(() => {
                            se.userInfoData = data;
                            se.bindFormGroup(data);

                        })
                    } else {
                        se.loadUserInfo();
                    }
                })
                se.checkHasPassword();
            })
        }, 100)
        //Set activetab theo form cha
        se.gf.setActivatedTab(5);
        if (se.gf.getParams('userAvatar')) {
            se.croppedImagepath = se.gf.getParams('userAvatar');
        }
    }
    goback() {
        var self = this;
        self.sentOTP = false;
        this.valueGlobal.pagechangetab5='';
        this.navCtrl.back();
    }
    /**
     * Bind thông tin user + validate
     * @param data thông tin user
     */
    bindFormGroup(data) {
        var se = this;
        se.phone = data.phone;
        se.name = data.name;
        se.userProfileData = se.formBuilder.group({
            name: [data.fullname || '', Validators.compose([Validators.required])],
            phone: [data.phone || '', Validators.compose([Validators.required, Validators.pattern("0[9|8|1|7|3|5]([0-9]|\s|-|\.){8,12}")])],
            email: [data.email || '', Validators.compose([Validators.required])],
            oldpassword: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
            newpassword: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
            confirmnewpassword: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
            otp: ['', Validators.compose([Validators.required])],
        });
    }

    changePass() {
        this.zone.run(() => {
            this.changepass = !this.changepass;
        })
    }

    public async showConfirm() {
        let alert = await this.alertCtrl.create({
            message: "Phiên đăng nhập hết hạn. Xin vui lòng đăng nhập lại để sử dụng chức năng này.",
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
                        this.valueGlobal.countNotifi = 0;
                        this.navCtrl.navigateRoot('/tab5');
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
                        //this.valueGlobal.logingoback = "MainPage";
                        this.valueGlobal.countNotifi = 0;
                        this.navCtrl.navigateForward('/login');
                    }
                }
            ]
        });
        alert.present();

        //   alert.onDidDismiss().then((data)=>{
        //     this.storage.remove('auth_token');
        //     this.storage.remove('email');
        //     this.storage.remove('username');
        //     this.storage.remove('jti');
        //     this.storage.remove('userInfoData');
        //     this.storage.remove('userRewardData');
        //     this.storage.remove('point');
        //     this.navCtrl.navigateBack('/');
        //   })
    }

    public phoneChange(val) {
        var se = this;
        //user có số phone thì check thay đổi mới show
        se.zone.run(() => {
            if (se.phone) {
                se.changephone = se.phone != val.detail.value;
            } else {
                se.changephone = true;
                se.phone = val.detail.value;
            }
        })

    }

    cancel() {
        var self = this;
        self.sentOTP = false;
        self.navCtrl.back();
    }

    saveChange() {
        var se = this;
        var obj = {};
        //validate
        if (!se.userProfileData.value.name) {
            se.presentToast('Họ tên không được để trống');
            return;
        }
        // if (!se.userProfileData.value.email) {
        //     se.presentToast('Email không được để trống');
        //     return;
        // }
        if (se.changepass && !se.userProfileData.value.oldpassword) {
            se.presentToast('Mật khẩu cũ không được để trống');
            return;
        }
        if (se.changepass && !se.userProfileData.value.newpassword) {
            se.presentToast('Mật khẩu mới không được để trống');
            return;
        }
        if (se.changepass && !se.userProfileData.value.confirmnewpassword) {
            se.presentToast('Xác nhận mật khẩu mới không được để trống');
            return;
        }
        if ((se.changepass && se.userProfileData.value.oldpassword && se.userProfileData.value.oldpassword.length < 6)
            || (se.userProfileData.value.newpassword && se.userProfileData.value.newpassword.length < 6)
            || (se.userProfileData.value.confirmnewpassword && se.userProfileData.value.confirmnewpassword.length < 6)) {
            se.presentToast('Mật khẩu phải lớn hơn 6 ký tự');
            return;
        }
        if (se.changepass && se.userProfileData.value.newpassword != se.userProfileData.value.confirmnewpassword) {
            se.presentToast('Mật khẩu mới không trùng khớp');
            return;
        }
        if (!se.changepass) {
            obj = {
                "userInfo": {
                    "email": se.userProfileData.value.email,
                    "fullname": se.userProfileData.value.name,
                    //"avatar": "string",
                    "phone": se.userProfileData.value.phone,
                    "otpPhone": se.userProfileData.value.otp,
                    "passCheckbox": se.changepass,
                }
            }
        }
        else {
            obj = {
                "userInfo": {
                    "email": se.userProfileData.value.email,
                    "fullname": se.userProfileData.value.name,
                    //"avatar": "string",
                    "phone": se.userProfileData.value.phone,
                    "otpPhone": se.userProfileData.value.otp,
                    "passCheckbox": true,
                    "oldPassword": se.haspassword ? se.userProfileData.value.oldpassword : "",
                    "newPassword1": se.userProfileData.value.newpassword,
                    "newPassword2": se.userProfileData.value.confirmnewpassword
                }
            }
        }
        se.valueGlobal.objchangeinfo = obj;
        se.valueGlobal.phone = se.userProfileData.value.phone;
        se.valueGlobal.name = se.userProfileData.value.name;
        se.storage.get('auth_token').then(auth_token => {
            if (auth_token) {
                var text = "Bearer " + auth_token;
                // var options = {
                //     method: 'POST',
                //     url: C.urls.baseUrl.urlMobile + '/api/Dashboard/ChangeUserInfo',
                //     timeout: 10000, maxAttempts: 5, retryDelay: 2000,
                //     headers:
                //     {
                //         'cache-control': 'no-cache',
                //         'content-type': 'application/json-patch+json',
                //         authorization: text
                //     },
                //     body: JSON.stringify(obj)
                // };
                // request.timeout = 60000;

                let urlStr = C.urls.baseUrl.urlMobile + '/api/Dashboard/ChangeUserInfo';
          
                let headers = {
                    'cache-control': 'no-cache',
                    'content-type': 'application/json',
                    authorization: text
                };
                this.gf.RequestApi('POST', urlStr, headers, obj, 'userlinkprofile', 'postDatafb').then((data)=>{

                        var rs = data;
                        if (rs.result) {
                            var info;
                            var textfullname = se.userProfileData.value.name.split(' ')
                            if (textfullname.length > 2) {
                                let name = '';
                                for (let i = 1; i < textfullname.length; i++) {
                                    if (i == 1) {
                                        name += textfullname[i];
                                    } else {
                                        name += ' ' + textfullname[i];
                                    }
                                }
                                info = { ho: textfullname[0], ten: name, phone: se.userProfileData.value.phone }
                            } else if (textfullname.length > 1) {
                                info = { ho: textfullname[0], ten: textfullname[1], phone: se.userProfileData.value.phone }
                            }
                            else if (textfullname.length == 1) {
                                info = { ho: textfullname[0], ten: "", phone: se.userProfileData.value.phone }
                            }
                            se.storage.remove('infocus');
                            se.storage.remove('userInfoData');
                            se.storage.set("infocus", info);
                            se.presentToast("Cập nhật hồ sơ thành công.");
                            //se.refreshToken();
                            se.clearSessionOTP();
                            se.loadUserInfo();

                        }
                    
                })
            }
        })
    }

    async presentToast(msg) {
        const toast = await this.toastCtrl.create({
            message: msg,
            duration: 2000,
            position: 'top',
        });
        toast.present();
    }

    async sendOTP() {
        var se = this;
        // se.navCtrl.navigateForward(['/confirmotp']);
      
        if (this.phonenumber(se.userProfileData.value.phone)) {
        se.sentOTP = true;
        var textphone = se.userProfileData.value.phone || "";
        se.storage.get('auth_token').then(auth_token => {
            if (auth_token) {
                var text = "Bearer " + auth_token;
                // var options = {
                //     method: 'POST',
                //     url: C.urls.baseUrl.urlMobile + '/api/Dashboard/OTPChangePhoneNumber',
                //     headers:
                //     {
                //         'cache-control': 'no-cache',
                //         'content-type': 'application/json-patch+json',
                //         authorization: text
                //     },
                //     body: JSON.stringify({ "phoneNumber": textphone })
                // };

                let urlStr = C.urls.baseUrl.urlMobile + '/api/Dashboard/OTPChangePhoneNumber';
          
                let headers = {
                    'cache-control': 'no-cache',
                    'content-type': 'application/json',
                    authorization: text
                };
                this.gf.RequestApi('POST', urlStr, headers, { "phoneNumber": textphone }, 'userprofile', 'sendOTP').then((data)=>{
                        var rs = data;
                        // se.navCtrl.navigateForward(['/confirmotp']);
                        se.showpopup();
                        setTimeout(() => {
                            se.clearSessionOTP();
                        }, 180000);
                    
                })
            }
        })
        }
        else
        {
            this.presentToastPhone();
        }       
    }
    async showpopup()
    {
        var se=this;
        const modal: HTMLIonModalElement =
        await this.modalCtrl.create({
          component: ConfirmotpPage,
  
        });
        modal.present();
        modal.onDidDismiss().then((data: OverlayEventDetail) => {
            se.clearSessionOTP();
            se.loadUserInfo();
        })
    }
    clearSessionOTP() {
        var se = this;
        se.zone.run(() => {
            se.sentOTP = false;
            se.changephone = false;
            se.changename = false;
            se.changepass = false;
            se.strwarning = "";
            se.strwarningoldpass = "";
        })
    }

    refreshToken() {
        var se = this;
        se.storage.get('auth_token').then(auth_token => {
            if (auth_token) {
                var text = "Bearer " + auth_token;
                // var options = {
                //     method: 'GET',
                //     url: C.urls.baseUrl.urlMobile + '/api/Account/reloadTokenClaims',
                //     headers:
                //     {
                //         'cache-control': 'no-cache',
                //         'content-type': 'application/json',
                //         authorization: text
                //     },
                // }

                let urlStr = C.urls.baseUrl.urlMobile + '/api/Account/reloadTokenClaims';
          
                let headers = {
                    'cache-control': 'no-cache',
                    'content-type': 'application/json',
                    authorization: text
                };
                this.gf.RequestApi('GET', urlStr, headers, { }, 'userprofile', 'refreshToken').then((data)=>{
                        var au = data;
                        se.zone.run(() => {
                            se.storage.remove('auth_token');
                            se.storage.set('auth_token', au.auth_token);
                            if (se.changename) {
                                se.storage.remove('username');
                                se.storage.set('username', se.userProfileData.value.name);
                            }
                        })
                    
                })
            }
        })
    }

    checkHasPassword() {
        var se = this;
        se.storage.get('auth_token').then(auth_token => {
            if (auth_token) {
                var text = "Bearer " + auth_token;
                // var options = {
                //     method: 'GET',
                //     url: C.urls.baseUrl.urlMobile + '/api/Dashboard/CheckHasPassword',
                //     headers:
                //     {
                //         'cache-control': 'no-cache',
                //         'content-type': 'application/json-patch+json',
                //         authorization: text
                //     }
                // };
                // request.timeout = 60000;

                let urlStr = C.urls.baseUrl.urlMobile + '/api/Dashboard/CheckHasPassword';
          
                let headers = {
                    'cache-control': 'no-cache',
                    'content-type': 'application/json',
                    authorization: text
                };
                this.gf.RequestApi('GET', urlStr, headers, { }, 'userprofile', 'checkHasPassword').then((data)=>{

                        var obj = data;
                        se.zone.run(() => {
                            se.haspassword = obj.hasPassword;
                        })
                    
                })
            }
        })
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
                        "fileExtension": se.fileType
                    };
                    let urlStr = C.urls.baseUrl.urlMobile + '/api/dashboard/UploadAvatarBase64';
          
                    let headers = {
                        'cache-control': 'no-cache',
                        'content-type': 'application/json',
                        authorization: text
                    };
                    this.gf.RequestApi('POST', urlStr, headers, body, 'userprofile', 'uploadAvatar').then((data)=>{
                            se.storage.remove('userInfoData');
                        
                    })
                }
            })

       // });



    }


    nameChange(val) {
        var se = this;
        //user có số phone thì check thay đổi mới show
        se.zone.run(() => {
            if (se.userProfileData.value.name) {
                se.changename = se.name != val.detail.value;
            }
        })
    }

    changepassword() {
        this.navCtrl.navigateForward(['app/tabs/userchangepassword']);
    }

    cropImage(imgPath) {
        
        // crop.show({
        //     source: imgPath,
        //     ratio:"16:9"
        // }).then( 
        //     newPath => {
        //             //this.showCroppedImage(newPath.split('?')[0]);
        //             console.log(newPath);
        //             this.showCroppedImage(newPath);
        //         },
        //         error => {
        //         throw error;
        //     })
        this.showCroppedImage(imgPath);
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
            se.file.readAsDataURL(filePath, imageName).then(base64 => {
                let b64: any = base64.split(',')[1];
                resolve(b64);
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
        se.file.readAsDataURL(filePath, imageName).then(base64 => {
            se.zone.run(() => {
                se.croppedImagepath = base64;
            })
            const contentType = 'image/' + imageType;
            let b64: any = base64.split(',')[1];
            //se.croppedImagepath = "data:image/jpeg;base64,"+base64;
            se.uploadAvatar(b64);
            if (se.croppedImagepath) {
                se.gf.setParams(se.croppedImagepath, 'userAvatar');
            }
        })

    }
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
    async presentToastPhone() {
        let toast = await this.toastCtrl.create({
          message: "Số điện thoại không hợp lệ. Xin vui lòng nhập lại.",
          duration: 3000,
          position: 'top'
        });
    
        toast.present();
      }
}