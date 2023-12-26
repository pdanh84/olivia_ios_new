import { Component, OnInit, NgZone,ViewChild, HostListener } from '@angular/core';
import { NavController, Platform, LoadingController,IonContent, ModalController, AlertController } from '@ionic/angular';
import { C } from '../providers/constants';
import { GlobalFunction } from '../providers/globalfunction';
import { ActivatedRoute } from '@angular/router';

import * as moment from 'moment';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { ValueGlobal } from '../providers/book-service';
import { Storage } from '@ionic/storage';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';
/**
 * Generated class for the PolicyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-blog',
  templateUrl: 'blog.html',
  styleUrls: ['blog.scss'],
})
export class BlogPage implements OnInit{
  @ViewChild(IonContent) ioncontent: IonContent;
  blog;date;title;content;arrblog:any=[]
  blogID;urlblog;Liked=false;
  postLatest:any = [];
  myloader;items: any= [];blogIDlike;
  loaddatadone: boolean = false;
  searchblog =false;
  blogtripssk = [1,2,3,4,5];
  @ViewChild('inputSearchBlog') input;

  @HostListener( 'keydown', ['$event'] )
      keyEvent( e )
      {
          var code = e.keyCode || e.which;
          if( code === 13 )
          {
              if( e.srcElement.tagName === "INPUT" )
              {
                  e.preventDefault();
                  let listitem = this.items.filter((item) => { return item.show });
                  if (listitem && listitem.length > 0) {
                    this.gf.setParams(this.items.filter((item) => { return item.show }), 'listsearchblog');
                    this.gf.setParams(this.input.value, 'searchblogtext');
                    this.gf.setParams(null, 'itemslug');
                    this.keyboard.hide();
                    setTimeout(() => {
                      this.navCtrl.navigateForward('/searchblog');
                    }, 300)

                  }
              }
          }
      };
  constructor(public valueGlobal:ValueGlobal,public storage: Storage,public platform: Platform, 
    public navCtrl: NavController, public gf: GlobalFunction, private activatedRoute: ActivatedRoute, 
    public zone: NgZone,private socialSharing: SocialSharing, public value:ValueGlobal,private loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private keyboard: Keyboard) {
    
    
    //Xử lý nút back của dt

    //google analytic
    gf.googleAnalytion('blog', 'load', '');
  }

  public async ngOnInit() {
  }
  clickSearchBlog(){
    this.searchblog = !this.searchblog;
  }
  clickCancel(){
    this.searchblog = !this.searchblog;
    this.input.value = '';
    setTimeout(()=>{
      this.input.setFocus();
    }, 200)
  }
  getdata(id,value) {
    var se = this;
    if (value==1) {
      se.blogID=id
    }
    let strUrl = `https://svc3.ivivu.com/GetBlogById?postid=${id ? id : this.blogID}`;
      se.gf.RequestApi('GET', strUrl, {}, {}, 'blog', 'getdata').then((data) => {
        se.zone.run(() => {
          se.blog = data;
          se.title=se.blog.post.post_title;
          se.date= moment(se.blog.post.post_date).format('HH:ss DD/MM/YYYY');
          se.value.urlblog=se.blog.post.guid;
          se.content = se.blog.post.post_content;
          se.postLatest = se.blog.postLatest;
          for (let i = 0; i < se.postLatest.length; i++) {
            se.postLatest[i].Date = moment(se.postLatest[i].Date).format('HH:ss DD/MM/YYYY');
            se.postLatest[i].Like = false;
          }
          se.loaddatadone = true;
          se.ioncontent.scrollToTop(50);
          se.getblog();
        })
      })
  }

  ionViewWillEnter() {
    if (this.blogIDlike) {
      this.likeItem();
    }
  }

  ionViewDidEnter(){
    this.blogID = this.activatedRoute.snapshot.paramMap.get('id');
    if(!this.blogID){
      this.blogID = this.gf.getParams('blogid');
    }
    setTimeout(()=>{
      this.getdata(null,0);
    },400)
  }
  getblog()
  {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        let strUrl = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/GetFavouriteBlogByUser';
        var text = "Bearer " + auth_token;
        let headers =  {
                'cache-control': 'no-cache',
                'content-type': 'application/json',
                authorization: text
              };
        se.gf.RequestApi('GET', strUrl, headers, {}, 'blog', 'getdata', auth_token).then((data) => {
          se.zone.run(() => {
            se.arrblog = data;
            se.Liked=false;
            for (let i = 0; i < se.arrblog.length; i++) {
              if (se.arrblog[i].id==se.blogID) {
                se.Liked=true;
                break;
              }
            }
          });
        })
    }
    else
    {
      se.Liked=false;
    }
  });
}
  goback() {
    if(this.gf.getParams('blogid')){
      this.modalCtrl.dismiss();
    }else{
      //this.gf.hiddenHeader();
      if(this.valueGlobal.backValue){
        this.navCtrl.back();
      }else{
        this.navCtrl.navigateBack('/app/tabs/tab1');
      }
      
    }
  }
  share() {
    this.socialSharing.share('','','', this.value.urlblog).then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });
  }
  shareitem(url) {
    this.socialSharing.share('','','', url).then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });
  }
  likeItem() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        this.setItemLikeStatus();
        var text = "Bearer " + auth_token;
        let headers =
          {
            authorization: text
          }
        let strUrl = C.urls.baseUrl.urlMobile +'/mobile/OliviaApis/AddFavouriteBlog';
        se.gf.RequestApi('POST', strUrl, headers,  { postId: this.blogID }, 'blog', 'likeItem').then((data) => {
          se.blogIDlike='';
        })
      }
      else {
        se.showConfirmLogin("Bạn cần đăng nhập để sử dụng chức năng này.");
      }
    });
  }
  unlikeItem() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        this.setItemLikeStatus();
        var text = "Bearer " + auth_token;
        let  headers =
          {
            authorization: text
          };
        let body = { postId: this.blogID };
        let strUrl = C.urls.baseUrl.urlMobile +'/mobile/OliviaApis/RemoveFavouriteBlogByUser';
        se.gf.RequestApi('POST', strUrl, headers,  { postId: this.blogID }, 'blog', 'likeItem').then((data) => {
        });
      }
      else {
        se.showConfirmLogin("Bạn cần đăng nhập để sử dụng chức năng này.");
      }
    });
  }
  setItemLikeStatus() {
    this.Liked = !this.Liked;
    
  }
  moreBlogLinkClick(id){
    
    this.getdata(id,1);
  }
  async presentLoadingData() {
    this.myloader = await this.loadingCtrl.create({
      duration: 5000
    });
    this.myloader.present();
  }
  likeItemsame(id) {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        se.bindItemLike(id);
        var text = "Bearer " + auth_token;
        let  headers =
          {
            authorization: text
          };
        let body = { postId: id };
        let strUrl = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/AddFavouriteBlog';
        se.gf.RequestApi('POST', strUrl, headers,  body, 'blog', 'likeItemsame').then((data) => {

        })
      }
      else {
        se.showConfirmLogin("Bạn cần đăng nhập để sử dụng chức năng này.");
      }
    });
  }
  unlikeItemsame(id) {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        se.bindItemUnLike(id);
        var text = "Bearer " + auth_token;
        let  headers =
          {
            authorization: text
          };
        let body = { postId: id };
        let strUrl = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/RemoveFavouriteBlogByUser';
        se.gf.RequestApi('POST', strUrl, headers,  body, 'blog', 'unlikeItemsame').then((data) => {
        })
      }
      else {
        se.showConfirmLogin("Bạn cần đăng nhập để sử dụng chức năng này.");
      }
    });
  }
  bindItemLike(id) {
    var se = this;
    se.zone.run(() => {
      for (let i = 0; i < se.postLatest.length; i++) {
        if (se.postLatest[i].id == id) {
          se.postLatest[i].Like = true;
          break;
        }
      }
    })
  }
  bindItemUnLike(id) {
    var se = this;
    for (let i = 0; i < se.postLatest.length; i++) {
      if (se.postLatest[i].id == id) {
        se.zone.run(() => {
          se.postLatest[i].Like = false;
        })
        break;
      }
    }
  }

  cancelInput(){
    this.searchblog = false;
    this.input.value = '';
    this.items = [];
  }

  clickSearch(ev){
    var se = this;
    if(ev.detail.value){
      se.searchblog = true;
      const val = ev.detail.value;
      //Nếu mở từ susggest my trip thì ưu tiên sort theo vùng mytrip
      let url = C.urls.baseUrl.urlMobile + '/api/Data/SearchBlog?keyword='+val;
          se.gf.RequestApi('GET',url,{},{},'blog', 'clickSearch').then((data:any)=>{
            if(data && data.length>0){
              if(se.items.length ==0){
                data.forEach(element => {
                  element.show = true;
                })
                se.items.push(...data);
              }else{
                se.items.forEach(e => {
                  e.show = false;
                })
                data.forEach(element => {
                  let check = se.items.filter((i)=>{ return i.id == element.id });
                  if(check && check.length == 0)
                  {
                    element.show = true;
                    se.items.push(element);
                  }else{
                    check[0].show = true;
                  }
                })
              }
            }
          })
    }else{
      se.searchblog = false;
      se.items.forEach(element => {
          element.show = false;
      });
    }
  }

  itemSearchBlogClick(item, index){
    var se = this;
    if(item){
      if(item.type == 1){
        se.blogID = item.objectId;
        se.searchblog = false;
        se.input.value='';
        se.getdata(item.objectId, 1);
      }else{
        se.searchblog = false;
        se.input.value='';
        se.gf.setParams(item, 'itemslug');
        se.navCtrl.navigateForward('/searchblog');
      }
    }
    se.gf.googleAnalytion("searchblog","Search","");
  }
  clickHeaderSearch(){
    this.searchblog = !this.searchblog;
  }
  public async showConfirmLogin(msg){
    let alert = await this.alertCtrl.create({
      message: msg,
      cssClass: 'experience-search-confirm',
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
          alert.dismiss();
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
          this.zone.run(()=>{
          })
          this.modalCtrl.dismiss('dismissall');
          this.blogIDlike=this.blogID;
          this.navCtrl.navigateForward('/login');
        }
      }
    ]
    });
    alert.present();
    alert.onDidDismiss().then((data)=>{
    })
  }

}
