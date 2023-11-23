import { map, catchError } from 'rxjs/operators';
import { Component,NgZone,OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController,IonRouterOutlet,Platform } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './../providers/auth-service';
import { ToastController } from '@ionic/angular';
import { FacebookLogin, FacebookLoginResponse } from '@capacitor-community/facebook-login';
import { Storage } from '@ionic/storage';
import { C } from './../providers/constants';

import jwt_decode from 'jwt-decode';
import { GlobalFunction } from './../providers/globalfunction';
import { Router } from '@angular/router';
import {FCM} from '@capacitor-community/fcm';
import { SearchHotel, ValueGlobal } from '../providers/book-service';
import { flightService } from '../providers/flightService';
import { HttpClient } from '@angular/common/http';
import {
  SignInWithApple,
  SignInWithAppleResponse,
  SignInWithAppleOptions,
} from '@capacitor-community/apple-sign-in';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

@Component({
  selector: 'app-login',
  templateUrl: 'login.html',
  styleUrls: ['login.scss'],
})
export class LoginPage implements OnInit{
  toUser: Object;
  public loginData: FormGroup;
  id: string;
  isLoggedIn: boolean = false;
  userData: any;
  checkreview;
  appversion:any;

  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;
  @ViewChild('user') input;emailorphone='';password='';
  public deviceToken;refreshTokenTimer;loader;
  token: any;
  
  constructor(
    public navCtrl: NavController, public authService: AuthService, public platform: Platform, private storage: Storage,
    public searchhotel: SearchHotel,public valueGlobal: ValueGlobal,
    private alertCtrl: AlertController, private toastCtrl: ToastController, public loadingCtrl: LoadingController, public gf: GlobalFunction,
    public _flightService: flightService,
    public formBuilder: FormBuilder,
    private zone: NgZone,
    private httpClient: HttpClient) {
    //google analytic
    this.storage.get('checkreview').then(checkreview => {
      this.checkreview=checkreview;
    })
   
    this.loginData = this.formBuilder.group({
      emailorphone: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
    });
    gf.googleAnalytion('login', 'load', '');
  
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
     //Test notification
     this.platform.ready().then(() => {
        FCM.getToken().then(token => {
          console.log(token);
          this.deviceToken = token;
      });
    })
  }

  ionViewDidLoad() {
    GoogleAuth.initialize();
  }

  async loadUserData(test) {
    const url = `https://graph.facebook.com/${this.token.userId}?fields=id,name,picture.width(720),birthday,email&access_token=${this.token.token}`;
    this.httpClient.get(url).subscribe((res:any) => {
      console.log(res);
      this.userData = res;
      this.userData.accessToken = this.token.token;
      this.userData.picture = res.picture['url'];
      //this.userData = { accessToken: test, id: res['id'], email: res['email'], UserName: res['first_name'], picture: res['picture_large']['data']['url'], username: res['name'], phone: res['phone'], gender: res['gender'] }
      if(res && res.email){
  
        this.postDatafb();
      }else{
        this.checknomail();
      }
      
    });
  }

  loginfb() {
    var se = this;
   
    try {
      const FACEBOOK_PERMISSIONS = [
        'email',
        'public_profile',
      ];

      FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS }).then((response: FacebookLoginResponse) => {
        if(response.accessToken){
          se.token = response.accessToken;
          let test = response.accessToken;
          se.storage.set('fbaccesstoken',test);
          se.loadUserData(test);
        }
        
      })
      //google analytic
      se.gf.googleAnalytion('login', 'loginfacebook', '');
    } catch (error) {
      alert(error);
    }
    
    
  }

  postDatafb() {
    var se = this;
    let body =
    {
      userData:
      {
        email: this.userData.email,
        name: this.userData.username,
        id: this.userData.id,
        image: this.userData.picture,
        provider: 'facebook',
        token: this.userData.accessToken || this.token,
        idToken: ''
      }
    }
    let urlPath = C.urls.baseUrl.urlMobile + '/api/account/socialLogin';
        let headers = {
          'cache-control': 'no-cache',
          'content-type': 'application/json'
        };
        try {
        se.gf.RequestApi('POST', urlPath, headers, body, 'Login', 'postDatafb').then((data)=>{

          if (data.result) {
            if(se.loader){
              se.loader.dismiss();
            }
            var decoded = jwt_decode<any>(data.auth_token);
            // console.log(JSON.stringify(decoded))
            se.refreshTokenTimer= decoded.refreshTokenTimer ? decoded.refreshTokenTimer : 10;
            se.storage.set("email", decoded.email);
            se.storage.set("auth_token", data.auth_token);
            se.storage.set("username", decoded.fullname);
            se.storage.set("phone", decoded.phone);
            se.storage.set("refreshTokenTimer", decoded.refreshTokenTimer ? decoded.refreshTokenTimer : 10);
            var checkfullname=se.hasWhiteSpace(decoded.fullname);
            //se.storage.remove('deviceToken');
            if(se.platform.is('mobile')){
              try {
                FCM.getToken().then(token => {
                  se.deviceToken = (token && token.token) ? token.token : token;
                  se.storage.set('deviceToken',se.deviceToken);
                  //PDANH 19/07/2019: Push memberid & devicetoken
                  if(se.deviceToken){
                    se.gf.pushTokenAndMemberID(data.auth_token, token.token || token, se.gf.getAppVersion());
                  }
                });
              } catch (error) {
                
              }
              
            }
            var info;
            if (checkfullname) {
              var textfullname=decoded.fullname.trim();
              textfullname=decoded.fullname.split(' ');
              //info = { ho: textfullname[0], ten: textfullname[1], phone: decoded.phone}
              if(textfullname.length >2){
                let name = '';
                for(let i = 1; i < textfullname.length; i++){
                  if(i == 1){
                    name += textfullname[i];
                  }else{
                    name +=' ' +textfullname[i];
                  }
                }
                info = { ho: textfullname[0], ten: name , phone: decoded.phone, gender: decoded.gender}
              }else if(textfullname.length>1){
                info = { ho: textfullname[0], ten: textfullname[1], phone: decoded.phone, gender: decoded.gender}
              }
              else if(textfullname.length==1){
                info = { ho: textfullname[0], ten: "", phone: decoded.phone, gender: decoded.gender}
              }
              se.storage.set("infocus", info);
            } else {
              info = { ho: "", ten: "", phone: decoded.phone,fullname:"", gender: decoded.gender}
              se.storage.set("infocus", info);
            }
            // se.storage.set("jti", decoded.jti[0]);
            if (Array.isArray(decoded.jti)) {
              se.storage.set("jti", decoded.jti[0]);
            }
            else {
              se.storage.set("jti", decoded.jti);
            }
            
            se.storage.remove('blogtripdefault');
            se.storage.remove('regionnamesuggest');
            se.storage.remove('listtopdealdefault');
            
            se.valueGlobal.countNotifi = 0;
            se.gf.setParams(true,'resetBlogTrips');
            if (!se.checkreview) {
              se.storage.set("checkreview", 0);
            }
            se.storage.set("point", decoded.point);
            se.searchhotel.rootPage ='login';
          
            if(se.valueGlobal.backValue == "flightaccount"){
              //se._flightService.itemFlightAccountToken.emit(data.auth_token);
              se._flightService.itemMenuFlightClick.emit(4);
              //se.goback();
            }
            if (se.valueGlobal.logingoback) {
              if(se.valueGlobal.logingoback == "flightadddetails"|| se.valueGlobal.logingoback == "flightadddetailsinternational"){
                se.goback();
                se._flightService.itemFlightLogin.emit(1);
              }else{
                se.navCtrl.navigateBack([se.valueGlobal.logingoback]);
              }
              
            }
            else{
              se.navCtrl.navigateRoot('/');
            }
            
          }else if(!data.result && data.msg){
            se.gf.showMessageWarning(data.msg);
            if(se.loader){
              se.loader.dismiss();
            }
          }
        });
      } catch (error) {
        alert(error);
      }
  }

  countdownRefreshToken() {
    var timer = parseInt(this.refreshTokenTimer);
    this.countdownTimer(timer);
  }
  countdownTimer(timer: number) {
    if (timer >= 0) {
      clearInterval(this.valueGlobal.interval);
      this.valueGlobal.interval = setInterval(() => {
        //console.log(timer);
        timer--;

        if (timer < 0) {
          clearInterval(this.valueGlobal.interval);
          // Reload lại Token để lấy User Info mới nhất
          this.reloadToken()
        }
      }, 1000);

    }
    
  }
  reloadToken() {
    this.refreshToken(); 
  }

  refreshToken() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        // var options = {
        //   method: 'GET',
        //   url: C.urls.baseUrl.urlMobile + '/api/Account/reloadTokenClaims',
        //   headers:
        //   {
        //     'cache-control': 'no-cache',
        //     'content-type': 'application/json',
        //     authorization: text
        //   },
        // }
        
        let urlPath = C.urls.baseUrl.urlMobile + '/api/Account/reloadTokenClaims';
        let headers = {
          'cache-control': 'no-cache',
            'content-type': 'application/json',
            authorization: text
        };
        this.gf.RequestApi('POST', urlPath, headers, {}, 'Login', 'refreshToken').then((data)=>{

        if(data) {
            var json=data;
            if (json.auth_token) {
              se.storage.remove('auth_token').then(()=>{
                se.storage.set("auth_token", json.auth_token);
              })
              
              //se.countdownRefreshToken();
            }
          }
        })
      }
    })
  }
getToken() {
  this.storage.get('auth_token').then(auth_token => {
    if (auth_token) {
    }
  })
  }
  hasWhiteSpace(s) {
    return s.indexOf(' ') >= 0;
  } 
  checknomail() {
    var se = this;
    let body =
    {
      userData:
      {
        id: this.userData.id,
        idToken: '',
        image: this.userData.picture,
        name: this.userData.name,
        provider: 'facebook',
        token: this.userData.accessToken
      }
    };
    let urlPath = C.urls.baseUrl.urlMobile + '/api/account/CheckSocialNoEmail';
        let headers = {
          'cache-control': 'no-cache',
          'content-type': 'application/json',
        };
        this.gf.RequestApi('POST', urlPath, headers, body, 'Login', 'checknomail').then((data)=>{

      if (data) {
        se.postDatafb();
      } else {
        se.presentPrompt();
      }
    });
  }
  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  logout() {
    FacebookLogin.logout()
      .then(res => this.isLoggedIn = false)
      .catch(e => {
        console.log('Error logout from Facebook', e)
        if (e) {
          e.page = "login";
          e.func = "logout";
        };
      });
    //google analytic
    this.gf.googleAnalytion('login', 'logout', '');
  }
 
  bypasslogin() {
    // let elements = Array.from(window.document.querySelectorAll('page-main'));
    //     if(elements && elements.length >0){
    //       this.app.getActiveNav().setRoot('MainPage');
    //       this.app.getRootNav().getActiveChildNav().select(0);
    //     }else{
    //       this.navCtrl.push("MainPage").then(()=>{this.view.dismiss()});
    //     }
    //this.navCtrl.popToRoot();
    //google analytic
    this.gf.googleAnalytion('login', 'bypasslogin', '');
  }
 
  async presentToast(msg) {
    let toast = await this.toastCtrl.create({
      message: msg||"Email hoặc mật khẩu không đúng.",
      duration: 3000,
      position: 'top'
    });
   
    toast.present();
  }
  /**
   * Opens a paage
   * 
   * @param page string Page name
   */
  openPage(page: string) {
    //this.navCtrl.push(page);
  }

  goback() {
    // if (this.navCtrl.canGoBack()) {
    //   this.view.dismiss();
    // } else {
    //   this.platform.exitApp();
    // }
    this.navCtrl.back();
  }
  
  async presentPrompt() {
    this.loader.dismiss();
    let alert = await  this.alertCtrl.create({
      subHeader: 'Tài khoản của bạn không có email hoặc không để ở chế độ công khai. Vui lòng cung cấp email để iVIVU có thể xác định và bảo mật tài khoản của bạn:',
      inputs: [
        {
          name: 'email',
          placeholder: 'Nhập email'
        }
      ],
      buttons: [
        {
          text: 'Bỏ qua',
          role: 'cancel',
          handler: data => {
            this.postDatafb();
          }
        },
        {
          text: 'Xác nhận',
          handler: data => {
            if (data.email) {
              // logged in!
              this.userData.email = data.email;
              var test = this.validateEmail(data.email);
              if (test == true) {
                this.postDatafb();
              } else {
                this.presentToastemail();
              }
            } else {
              // invalid login
              return false;
            }
          }
        }

      ]
    });
    await alert.present();
  }
  async presentToastemail() {
    let toast = await this.toastCtrl.create({
      message: "Định dạng email không đúng",
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  register(){
    this.navCtrl.navigateForward('register');
  }
  async presentLoadingnotime() {
    this.loader = await this.loadingCtrl.create();
    this.loader.present();
  }
  logintksms()
  {
    this.navCtrl.navigateForward('loginsms')
  }
  resetpassword(){
    this.navCtrl.navigateForward('/forgotpass');
  }
  next()
  {
    if (this.loginData.value.emailorphone) {
      var checkmail = this.validateEmail(this.loginData.value.emailorphone);
      if (checkmail) {
        if (this.loginData.value.password) {
          var test = this.loginData.value.password.length;
          if (test >= 6) {
            this.logintk();
          } else {
            this.presentToast("Mật khẩu phải ít nhất 6 ký tự");
          }
        }
        else
        {
          this.presentToast("Vui lòng nhập mật khẩu");
        }
      }
      else{
        if(this.phonenumber(this.loginData.value.emailorphone))
        {
          this.logintk();
        }
        else{
          this.presentToast("Định dạng email không đúng hoặc số điện thoại không chính xác");
        } 
      }
     
    } else {
      this.presentToast("Vui lòng nhập email hoặc số điện thoại");
    }
  }
  logintk() {
    var se = this;
    se.gf.showLoading();
    let headers = {
      'cache-control': 'no-cache',
      'content-type': 'application/json',
    };
    let strUrl = C.urls.baseUrl.urlMobile + '/api/Account/Login';
    let body =
      {
        emailOrPhone: this.loginData.value.emailorphone,
        password: this.loginData.value.password,
        rememberMe: true
      }
    se.gf.RequestApi('POST', strUrl, headers, body, 'Login', 'logintk').then((data) => {
      if (data.auth_token) {
            
        se.gf.hideLoading();
        var decoded = jwt_decode<any>(data.auth_token);
        se.refreshTokenTimer=decoded.refreshTokenTimer;
        se.storage.set("savepassword", se.loginData.value.password);
        se.storage.set("saveemail", decoded.email);
        se.zone.run(() => {
          se.storage.set("email", decoded.email);
          se.storage.set("auth_token", data.auth_token);
          se.storage.set("username", decoded.fullname);
          se.storage.set("phone", decoded.phone);
          se.storage.remove('deviceToken');
          if(se.platform.is('mobile')){
            try {
              FCM.getToken().then(token => {
                se.deviceToken = (token && token.token) ? token.token : token;
                se.storage.set('deviceToken',se.deviceToken);
                //PDANH 19/07/2019: Push memberid & devicetoken
                if(se.deviceToken){
                  se.gf.pushTokenAndMemberID(data.auth_token, token.token || token, se.gf.getAppVersion());
                }
              });
            } catch (error) {
              
            }
            
          }
          
          se.valueGlobal.countNotifi=0;
          // var checkfullname=se.hasWhiteSpace(decoded.fullname);
          var checkfullname = se.validateEmail(decoded.fullname);
          var info;
          if (!checkfullname) {
            var textfullname=decoded.fullname.split(' ')
            //info = { ho: textfullname[0], ten: textfullname[1], phone: decoded.phone}
            if(textfullname.length >2){
              let name = '';
              for(let i = 1; i < textfullname.length; i++){
                if(i == 1){
                  name += textfullname[i];
                }else{
                  name +=' ' +textfullname[i];
                }
              }
              info = { ho: textfullname[0], ten: name , phone: decoded.phone, gender: decoded.gender}
            }else if(textfullname.length>1){
              info = { ho: textfullname[0], ten: textfullname[1], phone: decoded.phone, gender: decoded.gender}
            }
            else if(textfullname.length==1){
              info = { ho: textfullname[0], ten: "", phone: decoded.phone, gender: decoded.gender}
            }
            se.storage.set("infocus", info);
          } else {
            info = { ho: "", ten: "", phone: decoded.phone, gender: decoded.gender}
            se.storage.set("infocus", info);
          }
          if (Array.isArray(decoded.jti)) {
            se.storage.set("jti", decoded.jti[0]);
          }
          else {
            se.storage.set("jti", decoded.jti);
          }
          if (!se.checkreview) {
            se.storage.set("checkreview", 0);
          }
          
          se.storage.set("point", decoded.point);

          if (se.loginData.value.ischeck) {
            se.storage.remove("password");
            se.storage.remove("emailrmb");
            se.storage.set("password", se.loginData.value.password);
            se.storage.set("emailrmb", se.loginData.value.emailorphone);
          }
          else
          {
            se.storage.remove("password");
            se.storage.remove("emailrmb");
          }
          
          se.storage.remove('blogtripdefault');
          se.storage.remove('regionnamesuggest');
          se.storage.remove('listtopdealdefault');
          se.gf.setParams(true,'resetBlogTrips');
          se.searchhotel.rootPage ='login';
          
            if(se.valueGlobal.backValue == "flightnotify"){
              se._flightService.itemMenuFlightClick.emit(3);
            }
            if(se.valueGlobal.backValue == "flightaccount"){
              se._flightService.itemMenuFlightClick.emit(4);
            }
            
          if (se.valueGlobal.logingoback) {
            if(se.valueGlobal.logingoback =="flightadddetails" || se.valueGlobal.logingoback == "flightadddetailsinternational"){
              se._flightService.itemFlightLogin.emit(1);
            }
            se.navCtrl.navigateBack([se.valueGlobal.logingoback]);
          }
          else{
            se.navCtrl.navigateRoot('/');
          }
        }, 10)

      }
      else {
        se.gf.hideLoading();
        se.presentToast(data.msg);
      }
    });

   
    //google analytic
    this.gf.googleAnalytion('loginusername', 'login', '');
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

  loginapple(){
    var se = this;
    let options: SignInWithAppleOptions = {
      clientId: 'com.ivivu.oliviaapp2019',
      redirectURI: '/',
    };
    // se.signInWithApple.signin({
    //   requestedScopes: [
    //     ASAuthorizationAppleIDRequest.ASAuthorizationScopeFullName,
    //     ASAuthorizationAppleIDRequest.ASAuthorizationScopeEmail
    //   ]
    // })
    try {
      SignInWithApple.authorize(options)
    .then((response: SignInWithAppleResponse) => {
      console.log(response);
      if (response && response.response) {
        //THEM email appid tra ve
        //var decoded = jwt_decode(res.identityToken);
        let res = response.response;
        var objAppid = {
          "identityToken":  res.identityToken,
          "authorizationCode":res.authorizationCode
        }
        se.storage.set("objAppid", objAppid);
        
        se.storage.set("email", res.email);
        se.postDataApple(res);
      } 
    })
    } catch (error) {
      alert('Đã có lỗi xảy ra. Vui lòng nâng cấp phiên bản IOS để sử dụng chức năng này!');
    }
    
    // .catch((error: SignInWithAppleResponse) => {
    //   if(!error.response){
    //     alert('Đã có lỗi xảy ra. Vui lòng nâng cấp phiên bản IOS để sử dụng chức năng này!');
    //   }else{
    //     console.log(error)
    //   }
      
    // });
  }

  postDataApple(res) {
    var se = this;
    // //alert("test");
    var options = {
      method: 'POST',
      url: C.urls.baseUrl.urlMobile + '/api/account/socialLogin',
      //url: 'http://192.168.10.103:3400/api/account/socialLogin',
      timeout: 10000, maxAttempts: 5, retryDelay: 2000,
      headers:
      {
        'cache-control': 'no-cache',
        'content-type': 'application/json'
      },
      body:
      {
        userData:
        {
          email: res.email,
          name: res.familyName + " " + res.givenName,
          id: res.user,
          provider: 'apple',
        }
      },
      json: true
    };
    let url = C.urls.baseUrl.urlMobile + '/api/account/socialLogin';
    se.gf.RequestApi('POST', url, {
      'cache-control': 'no-cache',
      'content-type': 'application/json'
    }, {
      userData:
      {
        email: res.email,
        name: res.familyName + " " + res.givenName,
        id: res.user,
        provider: 'apple',
      }
    }, 'login', 'postDataApple').then((response) => {
      if (response.statusCode != 200) {
        var objError = {
          page: "login",
          func: "postDataFb",
          message: response.statusMessage,
          content: response.body,
          type: "warning",
          param: JSON.stringify(options)
        };
        C.writeErrorLog(objError,response);
      }
      if(response.statusCode == 400){
        if(response && response.msg == "Tài khoản này đã bị khóa !"){
          se.warningInactiveAccount(response.msg);
        }
      }

      if (response) {
        var decoded:any = jwt_decode(response.auth_token);
        se.refreshTokenTimer=decoded.refreshTokenTimer;
        //se.storage.set("email", se.validateEmail(decoded.email) ? decoded.email : "");
        se.storage.remove("auth_token");
        se.storage.set("auth_token", response.auth_token);
        se.storage.set("username", decoded.fullname);
        se.storage.set("phone", decoded.phone);
        var checkfullname=se.hasWhiteSpace(decoded.fullname);
        var info;
        if (checkfullname) {
          const textfullname = decoded.fullname.trim().split(' ');
          let info = { ho: "", ten: "", phone: decoded.phone,fullname:"", gender: decoded.gender};
        
          if (textfullname.length > 0) {
            info.ho = textfullname[0];
          }
        
          if (textfullname.length > 1) {
            info.ten = textfullname.slice(1).join(' ');
          }
          se.storage.remove('infocus');
          se.storage.remove('listblogtripdefault');
          se.storage.remove('listblogdefault');
          se.storage.remove('listtopdealdefault');
          se.storage.remove('regionnamesuggest');
          se.valueGlobal.countNotifi = 0;
          se.storage.set("infocus", info);
          se.gf.setParams(true,'resetBlogTrips');
        } else {
          const info = { ho: "", ten: "", phone: decoded.phone, fullname: "", gender: decoded.gender };
          se.storage.set("infocus", info);
        }
        // se.storage.set("jti", decoded.jti[0]);
        if (Array.isArray(decoded.jti)) {
          se.storage.set("jti", decoded.jti[0]);
        }
        else {
          se.storage.set("jti", decoded.jti);
        }
        if (!se.checkreview) {
          se.storage.set("checkreview", 0);
        }
        se.storage.set("point", decoded.point);
        if(this.platform.is('mobile')){
        PushNotifications.addListener('registration',
          async (token: Token) => {
              //console.log('token: ' + token.value);
              se.deviceToken = (token && token.value) ? token.value : token;
              se.storage.set('deviceToken',se.deviceToken);
              if(se.deviceToken){
                se.gf.pushTokenAndMemberID(response.auth_token, token.value || token, se.appversion);
              }
            }
          )
        }
       se.searchhotel.rootPage ='login';
      if(se.valueGlobal.backValue == "flightaccount"){
        se.valueGlobal.logingoback = "";
        se._flightService.itemMenuFlightClick.emit(4);
      }
        // se.navCtrl.navigateForward('/');
        if(se.loader){
          se.loader.dismiss();
        }
        if (se.valueGlobal.logingoback) {
          se.valueGlobal.backValue = "";
          if(se.valueGlobal.logingoback =="flightadddetails" || se.valueGlobal.logingoback == "flightadddetailsinternational"){
            se._flightService.itemFlightLogin.emit(1);
          }
          se.navCtrl.navigateBack([se.valueGlobal.logingoback]);
        }
        else{
          se.navCtrl.navigateRoot('/');
        }
        
      }
    });
  }

  async warningInactiveAccount(msg){
    let alert = await this.alertCtrl.create({
      subHeader: 'Đăng nhập không thành công',
      message: "Tài khoản đang tạm khóa. Vui lòng liên hệ iVIVU để biết thêm thông tin.",
      buttons: [{
          text: 'Xác nhận',
          handler: data => {
            
          }
        }

      ]
    });
    await alert.present();
  }

  
  async logingg() {
    try {

    }catch(ex) {

    }
    const res = await GoogleAuth.signIn();
    this.userData = res;
    this.userData.fullName = this.userData.familyName + " " + this.userData.givenName;
    this.postDatagg();
  }

  postDatagg() {
    var se = this;
    let body =
    {
      userData:
      {
        email: this.userData.email,
        provider: 'google',
        token: '',
        idToken: '',
        bearToken: this.userData.authentication.accessToken,
        name: this.userData.familyName + " " + this.userData.givenName,
      }
    }
    let urlPath = C.urls.baseUrl.urlMobile + '/api/account/socialLogin';
        let headers = {
          'cache-control': 'no-cache',
          'content-type': 'application/json'
        };
        this.gf.RequestApi('POST', urlPath, headers, body, 'Login', 'postDatafb').then((data)=>{

      if (data.result) {
        if(se.loader){
          se.loader.dismiss();
        }
        var decoded = jwt_decode<any>(data.auth_token);
        // console.log(JSON.stringify(decoded))
        se.refreshTokenTimer= decoded.refreshTokenTimer ? decoded.refreshTokenTimer : 10;
        se.storage.set("email", decoded.email);
        se.storage.set("auth_token", data.auth_token);
        se.storage.set("username", decoded.fullname);
        se.storage.set("phone", decoded.phone);
        se.storage.set("refreshTokenTimer", decoded.refreshTokenTimer ? decoded.refreshTokenTimer : 10);
        var checkfullname=se.hasWhiteSpace(decoded.fullname);
        //se.storage.remove('deviceToken');
        if(se.platform.is('ios')){
          try {
            FCM.getToken().then(token => {
              se.deviceToken = (token && token.token) ? token.token: token;
              se.storage.set('deviceToken',se.deviceToken);
              //PDANH 19/07/2019: Push memberid & devicetoken
              if(se.deviceToken){
                se.gf.pushTokenAndMemberID(data.auth_token, token.token || token, se.appversion);
              }
            });
          } catch (error) {
            
          }
          
        }
        if (checkfullname) {
          const textfullname = decoded.fullname.trim().split(' ');
          let info = { ho: "", ten: "", phone: decoded.phone,fullname:"", gender: decoded.gender};
        
          if (textfullname.length > 0) {
            info.ho = textfullname[0];
          }
        
          if (textfullname.length > 1) {
            info.ten = textfullname.slice(1).join(' ');
          }
        
          se.storage.set("infocus", info);
        } else {
          const info = { ho: "", ten: "", phone: decoded.phone, fullname: "", gender: decoded.gender };
          se.storage.set("infocus", info);
        }
        // se.storage.set("jti", decoded.jti[0]);
        if (Array.isArray(decoded.jti)) {
          se.storage.set("jti", decoded.jti[0]);
        }
        else {
          se.storage.set("jti", decoded.jti);
        }
        
        se.storage.remove('blogtripdefault');
        se.storage.remove('regionnamesuggest');
        se.storage.remove('listtopdealdefault');
        
        se.valueGlobal.countNotifi = 0;
        se.gf.setParams(true,'resetBlogTrips');
        if (!se.checkreview) {
          se.storage.set("checkreview", 0);
        }
        se.storage.set("point", decoded.point);
        se.searchhotel.rootPage ='login';
       
        if(se.valueGlobal.backValue == "flightaccount"){
          //se._flightService.itemFlightAccountToken.emit(data.auth_token);
          se._flightService.itemMenuFlightClick.emit(4);
          //se.goback();
        }
        if (se.valueGlobal.logingoback) {
          if(se.valueGlobal.logingoback == "flightadddetails"|| se.valueGlobal.logingoback == "flightadddetailsinternational"){
            se.goback();
            se._flightService.itemFlightLogin.emit(1);
          }else{
            se.navCtrl.navigateBack([se.valueGlobal.logingoback]);
          }
          
        }
        else{
          se.navCtrl.navigateRoot('/');
        }
        
      }else if(!data.result && data.msg){
        se.gf.showMessageWarning(data.msg);
        if(se.loader){
          se.loader.dismiss();
        }
      }
    });
  }
}
