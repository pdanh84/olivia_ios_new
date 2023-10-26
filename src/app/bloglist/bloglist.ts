import { Component, OnInit, NgZone, ViewChild, HostListener } from '@angular/core';
import { NavController, Platform, LoadingController } from '@ionic/angular';
import { C } from '../providers/constants';
import { GlobalFunction } from '../providers/globalfunction';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { ValueGlobal, SearchHotel } from '../providers/book-service';
import { Storage } from '@ionic/storage';
import { NetworkProvider } from '../network-provider.service';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';
import * as $ from 'jquery';
/**
 * Generated class for the PolicyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-bloglist',
  templateUrl: 'bloglist.html',
  styleUrls: ['bloglist.scss'],
})
export class BlogListPage implements OnInit {
  blogtrips: any = []; arrbloglike: any = []; istextblog = false; public isConnected: boolean = true; username; page = 1;
  _infiniteScroll: any; ischeckloadmore = false; filterblog: boolean = false;
  items: any = [];
  textsearch: string;
  regionname: any;
  loadblogslug: boolean = false;
  regionCode: any;
  myloader: any;
  ; loader: any; ischecksearchbar = false;
  regionnamesuggest = "";
  loaddatadone = false;
  blogtripssk = [1, 2, 3, 4, 5];
  searchblog = false;
  @ViewChild('inputSearchBlog') input;
  @HostListener('keydown', ['$event'])
  keyEvent(e) {
    var code = e.keyCode || e.which;
    if (code === 13) {
      if (e.srcElement.tagName === "INPUT") {
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
  constructor(public searchhotel: SearchHotel, public networkProvider: NetworkProvider, public loadingCtrl: LoadingController, public valueGlobal: ValueGlobal, public storage: Storage, public platform: Platform, public navCtrl: NavController, public value: ValueGlobal, public gf: GlobalFunction, private activatedRoute: ActivatedRoute, public zone: NgZone, private socialSharing: SocialSharing,
    public keyboard: Keyboard) {
    this.searchhotel.backPage = "bloglist";
    storage.get('username').then(username => {
      this.username = username;
    });
    if (this.networkProvider.isOnline()) {
      this.isConnected = true;
      this.getbloglike(0);
    } else {
      this.isConnected = false;
      this.gf.showWarning('Không có kết nối mạng', 'Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng', 'Đóng');
    }
  }

  ngOnInit() {

  }

  ionViewDidEnter() {

  }

  async presentLoadingData() {
    this.myloader = await this.loadingCtrl.create({
      duration: 300
    });
    this.myloader.present();
  }

  getblogtrips() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        let headers =
        {
          'cache-control': 'no-cache',
            'content-type': 'application/json',
            authorization: text
        }
          let strUrl = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/GeBlogByTripLatestOfUser' + '?pageIndex=' + this.page + '&pageSize=10';
          se.gf.RequestApi('GET', strUrl, headers,  { }, 'blog', 'likeItem').then((data) => {
            if (data && data.items && data.items.length > 0) {
              var data = data;
              var listBlogtemp = data.items;
              if (listBlogtemp && listBlogtemp.length > 0) {
                se.regionname = data.regionName;
                se.regionnamesuggest = "Vi Vu " + data.regionName;
                if (se.arrbloglike.length > 0) {
                  var itemblog;
                  for (let i = 0; i < listBlogtemp.length; i++) {
                    listBlogtemp[i].date = moment(listBlogtemp[i].date).format('HH:ss DD/MM/YYYY');
                    itemblog = { avatar: listBlogtemp[i].avatar, date: listBlogtemp[i].date, id: listBlogtemp[i].id, title: listBlogtemp[i].title, url: listBlogtemp[i].url, Like: false }
                    for (let j = 0; j < se.arrbloglike.length; j++) {
                      if (se.arrbloglike[j].id == listBlogtemp[i].id) {
                        itemblog = { avatar: listBlogtemp[i].avatar, date: listBlogtemp[i].date, id: listBlogtemp[i].id, title: listBlogtemp[i].title, url: listBlogtemp[i].url, Like: true };
                        break;
                      }
                    }
                    if (!se.gf.checkExistsItemInArray(se.blogtrips, itemblog, 'blogsearch')) {
                      se.blogtrips.push(itemblog);
                    }
                  }
                }
                else {
                  for (let i = 0; i < listBlogtemp.length; i++) {
                    listBlogtemp[i].date = moment(listBlogtemp[i].date).format('HH:ss DD/MM/YYYY');
                    itemblog = { avatar: listBlogtemp[i].avatar, date: listBlogtemp[i].date, id: listBlogtemp[i].id, title: listBlogtemp[i].title, url: listBlogtemp[i].url, Like: false }
                    if (!se.gf.checkExistsItemInArray(se.blogtrips, itemblog, 'blogsearch')) {
                      se.blogtrips.push(itemblog);
                    }
                  }
                }
                se.zone.run(() => {
                  se.loaddatadone = true;
                })
                if (se._infiniteScroll) {
                  se._infiniteScroll.target.complete();
                }
              }
            }
        });
      }
      else {
      }
    });
  }
  getbloglike(value) {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        let headers =
        {
          'cache-control': 'no-cache',
            'content-type': 'application/json',
            authorization: text
        }
          let strUrl = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/GetFavouriteBlogByUser';
          se.gf.RequestApi('GET', strUrl, headers,  { }, 'bloglist', 'getbloglike').then((data) => {
          se.zone.run(() => {
            se.arrbloglike = data;
            if (data.msg) {
              se.arrbloglike = [];
            }
            if (value == 0) {
              let loadtype = se.gf.getParams('seemoreblog');
              if (loadtype == 1) {
                se.getblogtrips();
              } else {
                se.getNewsBlog();
              }
            } else {
              se.bindItemLike(se.arrbloglike);
            }
          });
        });
      }
      else {
        this.getNewsBlog();
      }
    });
  }

  getNewsBlog() {
    var se = this;
    var options = {
      method: 'GET',
      url: C.urls.baseUrl.urlBlog + '/GetNewsBlog' + '?pageIndex=' + this.page + '&pageSize=10',
      timeout: 10000, maxAttempts: 5, retryDelay: 2000,
      headers:
      {
      }
    };
    let headers =
        {
        }
          let strUrl = C.urls.baseUrl.urlBlog + '/GetNewsBlog' + '?pageIndex=' + this.page + '&pageSize=10';
          se.gf.RequestApi('GET', strUrl, headers,  { }, 'bloglist', 'getNewsBlog').then((data) => {
      se.zone.run(() => {
        var listBlogtemp = data;
        se.regionnamesuggest = "Cẩm nang du lịch"
        for (let i = 0; i < listBlogtemp.length; i++) {
          listBlogtemp[i].Date = moment(listBlogtemp[i].Date).format('DD/MM/YYYY');
        }
        if (se.arrbloglike && se.arrbloglike.length > 0) {
          var itemblog;
          for (let i = 0; i < listBlogtemp.length; i++) {
            itemblog = { avatar: listBlogtemp[i].Avatar, date: listBlogtemp[i].Date, id: listBlogtemp[i].id, title: listBlogtemp[i].Title, url: listBlogtemp[i].Url, Like: false }
            for (let j = 0; j < se.arrbloglike.length; j++) {
              if (se.arrbloglike[j].id == listBlogtemp[i].id) {
                itemblog = { avatar: listBlogtemp[i].Avatar, date: listBlogtemp[i].Date, id: listBlogtemp[i].id, title: listBlogtemp[i].Title, url: listBlogtemp[i].Url, Like: true };
                break;
              }
            }
            if (!se.gf.checkExistsItemInArray(se.blogtrips, itemblog, 'blogsearch')) {
              se.blogtrips.push(itemblog);
            }
          }
        }
        else {
          for (let i = 0; i < listBlogtemp.length; i++) {
            itemblog = { avatar: listBlogtemp[i].Avatar, date: listBlogtemp[i].Date, id: listBlogtemp[i].id, title: listBlogtemp[i].Title, url: listBlogtemp[i].Url, Like: false }
            if (!se.gf.checkExistsItemInArray(se.blogtrips, itemblog, 'blogsearch')) {
              se.blogtrips.push(itemblog);
            }
          }
        }
      })
      se.zone.run(() => {
        se.loaddatadone = true;
      })
      if (se._infiniteScroll) {
        se._infiniteScroll.target.complete();
      }
    });
  }

  bindItemLike(listLike) {
    var se = this;
    se.blogtrips.forEach(element => {
      var itemlikemap = listLike.filter((item) => { return item.id == element.id });
      if (itemlikemap && itemlikemap.length > 0) {
        se.zone.run(() => {
          element.Like = true;
        })
      }
      else {
        se.zone.run(() => {
          element.Like = false;
        })
      }
    });
  }


  share(url) {
    this.socialSharing.share('','','', url).then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });
  }
  goback() {
    if (!$('.searchbar-input').val()) {
      this.navCtrl.navigateBack(['/app/tabs/tab1']);
    } else {
      if(this.input){
        this.input.value = '';
      }
      
      this.filterblog = false;
      this.searchblog = false;
      this.loaddatadone = true;
      $('.div-cover').removeClass('glass-bloglist');
    }
  }
  itemblogclick(item) {
    this.valueGlobal.urlblog = item.url;
    this.navCtrl.navigateForward('/blog/' + item.id);
    //google analytic
    this.gf.googleAnalytion('blogsearch', 'Search', '');
  }
  doInfinite(infiniteScroll) {
    var se = this;
    setTimeout(() => {
      se.page = se.page + 1;
      this._infiniteScroll = infiniteScroll;
      if (!se.loadblogslug) {
        se.getbloglike(0);
      } else {
        se.loadBlogSlug();
      }
    }, 10);
  }
  ionViewWillEnter() {
    this.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        if (this.valueGlobal.blogid) {
          this.likeItemblog(this.valueGlobal.blogid);
        }
        else{
          this.getbloglike(1);
        }
      }
    })
  }
  likeItemblog(id) {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        se.getbloglikelocal(id);
        var text = "Bearer " + auth_token;
        let headers =
        {
          authorization: text
        }
          let strUrl = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/AddFavouriteBlog';
          se.gf.RequestApi('POST', strUrl, headers,  { postId: id }, 'bloglist', 'getNewsBlog').then((data) => {
          if (se.valueGlobal.blogid) {
            se.getbloglike(1);
            se.valueGlobal.blogid='';
          }
        });
      }
      else {
        se.valueGlobal.blogid = id;
        se.valueGlobal.logingoback = '/bloglist';
        se.navCtrl.navigateForward('/login');
      }
    });
  }
  unlikeItemblog(id) {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        se.ungetbloglikelocal(id);
        var text = "Bearer " + auth_token;
        let headers =
        {
          authorization: text
        }
          let strUrl = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/RemoveFavouriteBlogByUser';
          se.gf.RequestApi('POST', strUrl, headers,  { postId: id }, 'bloglist', 'getNewsBlog').then((data) => {
          se.zone.run(() => se.getbloglike(1));
          console.log(data);
        });
      }
      else {
        this.navCtrl.navigateForward('/login');
      }
    });
  }
  getbloglikelocal(id) {
    this.zone.run(() => {
      for (let i = 0; i < this.blogtrips.length; i++) {
        if (this.blogtrips[i].id == id) {
          this.blogtrips[i].Like = true;
          break;
        }
      }
    })
  }
  ungetbloglikelocal(id) {
    this.zone.run(() => {
      for (let i = 0; i < this.blogtrips.length; i++) {
        if (this.blogtrips[i].id == id) {
            this.blogtrips[i].Like = false;
          break;
        }
      }
    })
  }
  change() {
    this.ischecksearchbar = !this.ischecksearchbar;
  }
  iconcancel() {
    this.ischecksearchbar = !this.ischecksearchbar;
  }

  clickSearchBlog() {
    this.searchblog = !this.searchblog;
    this.filterblog = true;
    setTimeout(() => {
      if (this.input) {
        this.input.setFocus();
      }
    }, 100);
    $('.div-cover').addClass('glass-bloglist');
  }

  clickCancel() {
    if (!$('.searchbar-input').val()) {
      this.searchblog = !this.searchblog;
      this.filterblog = false;
      setTimeout(() => {
        if (this.input) {
          this.input.setFocus();
        }
      }, 100);
      $('.div-cover').removeClass('glass-bloglist');
    } else {
      this.input.value = '';
    }
  }


  cancelInput() {
    this.filterblog = false;
    this.input.value = '';
    this.items = [];
    $('.div-cover').removeClass('glass-bloglist');
  }

  clickSearch(ev) {
    var se = this;
    if (ev.detail.value) {
      se.filterblog = true;
      const val = ev.detail.value;
      let loadtype = se.gf.getParams('seemoreblog');
      //Nếu mở từ susggest my trip thì ưu tiên sort theo vùng mytrip
      let url = C.urls.baseUrl.urlMobile + '/api/Data/SearchBlog?keyword=' + val + (se.regionname ? (" " + se.regionname) : "");
      se.gf.RequestApi('GET', url, {}, {}, 'bloglist', 'clickSearch').then((data: any) => {
        if (data && data.length > 0) {
          if (se.items.length == 0) {
            data.forEach(element => {
              element.show = true;
            })
            se.items.push(...data);
          } else {
            se.items.forEach(e => {
              e.show = false;
            })

            data.forEach(element => {
              let check = se.items.filter((i) => { return i.id == element.id });
              if (check && check.length == 0) {
                element.show = true;
                se.items.push(element);
              } else {
                check[0].show = true;
              }
            })
          }
        }
      })
    } else {
      se.filterblog = false;
      se.items.forEach(element => {
        element.show = false;
      });
    }
  }

  itemSearchBlogClick(item, index) {
    var se = this;
    if (item) {
      se.loaddatadone = false;
      se.gf.setParams(null, 'itemslug');
      if (item.type == 1) {
        se.navCtrl.navigateForward('/blog/' + item.objectId);
      } else {
        se.loadblogslug = true;
        se.regionCode = item.slug;
        se.filterblog = false;
        se.searchblog = false;
        se.items = [];
        se.blogtrips = [];
        se.regionnamesuggest = item.title;
        se.loadBlogSlug();
      }
    }
    se.gf.googleAnalytion("searchblog", "Search", "");
  }

  loadBlogSlug() {
    var se = this;
    let headers ={};
          let strUrl = `https://svc3.ivivu.com/GetBlogByCategorySlug?slug=${se.regionCode}&pageindex=${se.page}&pagesize=10`;
          se.gf.RequestApi('GET', strUrl, headers,  { }, 'bloglist', 'loadBlogSlug').then((data) => {
      se.zone.run(() => {
          if (data && data.length > 0) {
            var listBlogtemp = data;
            if (listBlogtemp && listBlogtemp.length > 0) {
              if (se.arrbloglike.length > 0) {
                var itemblog;
                for (let i = 0; i < listBlogtemp.length; i++) {
                  listBlogtemp[i].Date = moment(listBlogtemp[i].Date).format('HH:ss DD/MM/YYYY');
                  itemblog = { avatar: listBlogtemp[i].Avatar, date: listBlogtemp[i].Date, id: listBlogtemp[i].id, title: listBlogtemp[i].Title, url: listBlogtemp[i].Url, Like: false }
                  for (let j = 0; j < se.arrbloglike.length; j++) {
                    if (se.arrbloglike[j].id == listBlogtemp[i].id) {
                      itemblog = { avatar: listBlogtemp[i].Avatar, date: listBlogtemp[i].Date, id: listBlogtemp[i].id, title: listBlogtemp[i].Title, url: listBlogtemp[i].Url, Like: true };
                      break;
                    }
                  }
                  if (!se.gf.checkExistsItemInArray(se.blogtrips, itemblog, 'blogsearch')) {
                    se.blogtrips.push(itemblog);
                  }
                }
              }
              else {
                for (let i = 0; i < listBlogtemp.length; i++) {
                  listBlogtemp[i].Date = moment(listBlogtemp[i].Date).format('HH:ss DD/MM/YYYY');
                  itemblog = { avatar: listBlogtemp[i].Avatar, date: listBlogtemp[i].Date, id: listBlogtemp[i].id, title: listBlogtemp[i].Title, url: listBlogtemp[i].Url, Like: false }
                  if (!se.gf.checkExistsItemInArray(se.blogtrips, itemblog, 'blogsearch')) {
                    se.blogtrips.push(itemblog);
                  }
                }
              }
              se.zone.run(() => {
                se.loaddatadone = true;
              })
              if (se._infiniteScroll) {
                se._infiniteScroll.target.complete();
              }
            }
          } else {
            if (se._infiniteScroll) {
              se._infiniteScroll.target.complete();
            }
          }
      })
    })
  }
}
