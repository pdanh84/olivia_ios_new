import { Component, NgZone, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { C } from '../../providers/constants';
import { GlobalFunction } from 'src/app/providers/globalfunction';
import { ticketService } from 'src/app/providers/ticketService';
@Component({
  selector: 'app-ticketfilter',
  templateUrl: './ticketfilter.page.html',
  styleUrls: ['./ticketfilter.page.scss'],
})
export class TicketfilterPage implements OnInit {
  arrFilter: any;
  arrResult: any;
  itemTicket: any;
  itemRegion: any;
  constructor(private navCtrl: NavController,private modalCtrl: ModalController, public gf: GlobalFunction, public ticketService: ticketService,public zone: NgZone) { }

  ngOnInit() {
    // this.getdata(0)
    if (this.ticketService.isFilter) {
      this.arrFilter = this.ticketService.ticketFilter;
      this.executeQuantity(0);
      this.arrFilter.topics = this.arrFilter.topics.map((item) => {
        return { ...item, checked: false }
      });
      if (this.ticketService.topicfilters.length > 0) {
        // var idx = this.arrFilter.topics.findIndex(item => this.ticketService.topicfilters.includes(item.id));
        // this.arrFilter.topics[idx].checked = true;
        this.arrFilter.topics = this.arrFilter.topics.map((item) => {
          // Kiểm tra xem item có trong mảng topicfilters hay không
          const isItemInTopicFilters = this.ticketService.topicfilters.includes(item.id);
          // Nếu có trong topicfilters, đặt checked thành true, ngược lại giữ nguyên giá trị checked
          return {
            ...item,
            checked: isItemInTopicFilters,
          };
        });
      }
    } else {
      this.getdata(0)
    }

  }
  getdata(stt) {
    let url = C.urls.baseUrl.urlTicket + '/api/Category/GetInitsearchModel';
    this.gf.RequestApi('GET', url, null, null, 'ticketfilter', 'GetInitsearchModel').then((data) => {
      let res = data;
      this.arrFilter = res.data;
      this.arrFilter.regions = this.arrFilter.regions.map((item) => {
        return { ...item, show: false }
      });
      if (stt == 0) {
        if (this.ticketService.itemShowList) {
          for (let i = 0; i < this.arrFilter.regions.length; i++) {
            const element = this.arrFilter.regions[i];
            // var idx = element.findIndex((el) => { return el.id == this.ticketService.itemShowList.id });
            if (element.id == this.ticketService.itemShowList.id ) {
              element.checked = true;
            }
            
          }
        }
        this.arrFilter.topics = this.arrFilter.topics.map((item) => {
          return { ...item, checked: false }
        });
        if (this.ticketService.itemTicketTopic) {
          var idx = this.arrFilter.topics.findIndex((el) => { return el.id == this.ticketService.itemTicketTopic.topicId });
          this.arrFilter.topics[idx].checked = true;
        }
        this.executeQuantity(1);
      }

    })
  }
  private executeQuantity(stt) {
      this.arrFilter.regions.forEach(parent => {
        const [parentVM] = this.ticketService.regionModels.filter(x => x.id === parent.id)
        parent.childs.forEach(child =>{
            if(this.ticketService.regionFilters.includes(child.id)){
                child.checked = true;
                parent.show = true;
            }else{
                child.checked = false
            }
            // binding quantity
            if(parentVM){
                parent.quantity = parentVM.quantity
                const [childVM] = parentVM.childs.filter(x => x.id === child.id)
                child.quantity = childVM ? childVM.quantity : 0
            }else{
                parent.quantity = 0
                child.quantity = 0
            }
        })
        // let checkChild = parent.childs.filter(x => x.checked);
        // if (checkChild.length > 0) {
        //   parent.indeterminate = true;
        // }else{
        //   parent.indeterminate = false;
        // }
   
          parent.indeterminate = false;
          parent.checked = false;
          if (parent.childs.length > 0) {
            let countObj = parent.childs.filter(x => x.checked == true);
            if (countObj.length == parent.childs.length) {
              parent.checked = true;
            }else{
              if (countObj.length > 0) {

                parent.indeterminate = true;
              }
            
            }  
          
        }

           
       
        // if (stt==0) {
        //   let countObj = parent.childs.filter(x => x.checked == true);
        //   if (countObj.length == parent.childs.length) {
        //     parent.checked = true;
        //   }else{
        //     parent.checked = false;
        //   }
        // }
    
        parent.quantity = parent.childs.reduce((n, {quantity}) => n + quantity, 0);
      });
      // this.arrFilter.types.forEach(_type => {
      //   const [typeVM] = this.ticketService.typeModels.filter(x => x.id === _type.id);
      //   _type.quantity = typeVM ? typeVM.quantity : 0;

      // });
      
      this.arrFilter.topics.forEach(_type => {
        const [typeVM] = this.ticketService.topicModels.filter(x => x.id === _type.id);
        _type.quantity = typeVM ? typeVM.quantity : 0;

      });
  
  }

  close() {
    this.modalCtrl.dismiss({ hasfilter: false });
  }
  getItems(ev: any) {
    this.ticketService.inputText = ev.detail.value;
    // if (!this.ticketService.inputText) {
    //   this.ticketService.searchType = 1;
    //   this.getdata(0);
    // }
    var se = this;
        if(ev.detail.value){
          const val = ev.detail.value;
          let url = `${C.urls.baseUrl.urlTicket}/api/Home/SearchExperience?keyword=` +val;
          let headers = {
            apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
            apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
          };
          se.gf.RequestApi('GET', url, headers, null, 'searchregion', 'getItems').then((data) => {
                  se.zone.run(() => {
                    let lstitems = data;
                    console.log(lstitems);
                    if(lstitems.data.experiences.length && lstitems.data.experiences.length >0 || lstitems.data.regions.length && lstitems.data.regions.length >0){
                      se.itemTicket = lstitems.data.experiences;
                      se.itemRegion = lstitems.data.regions;
                    }else{
                      // se.items.forEach(element => {
                      //   element.show = false;
                      // });
                      // se.ischecktext=true;
                    }
                  });
          })
         }
  }
  search() {
      this.ticketService.searchType = 1;
      this.gf.SearchKeyword().then(() => {
        this.executeQuantity(1);
      })
  }
  checkEvent(ev: any, item, stt) {
    item.checked = ev.detail.checked;
    if (stt == 0) {
      if (item.checked) {
        item.childs = item.childs.map((itemC) => {
          return { ...itemC, checked: true }
        });
      }
      else {
        if (!item.indeterminate) {
          item.childs = item.childs.map((itemC) => {
            return { ...itemC, checked: false }
          });
        }
      }
    }

    // if (this.ticketService.itemTicketTopic && item.code == this.ticketService.itemTicketTopic.topicCode) {
    //   this.ticketService.itemTicketTopic = "";
    //   this.getdata();
    //   this.ticketService.searchType = 1;
    // }
    // if (this.ticketService.itemShowList && item.id == this.ticketService.itemShowList.id) {
    //   this.ticketService.itemShowList = "";
    //   this.getdata();
    //   this.ticketService.searchType = 1;
    // }
    this.ticketService.searchType = 1;
    this.setData();
    this.gf.SearchKeyword().then((data) => {
      if (data) {
        this.executeQuantity(1);
      }
    })

  }
  showmore(item) {
    item.show = !item.show;
  }
  filter() {
    if (this.arrFilter) {

      this.ticketService.ticketFilter = this.arrFilter;
      this.ticketService.countFilter = 0;
      this.ticketService.itemTicketTopic = "";
      this.ticketService.itemShowList = "";
      this.setData();
      // this.ticketService.itemShowList = "";
      // this.ticketService.itemTicketTopic = "";

    }
    // else{
    //   this.ticketService.countFilter = 0;
    //   this.ticketService.regionFilters = []
    //   if (!this.ticketService.itemShowList) {
    //     for (let i = 0; i < this.ticketService.regionModels.length; i++) {
    //       const element = this.ticketService.regionModels[i];
    //       element.childs.forEach(item => {
    //         if (item.checked) {
    //           this.ticketService.regionFilters.push(item.id);
    //           this.ticketService.countFilter++;
    //         }
    //       });
    //     // }
    //   }
    //   }



    //   this.ticketService.typeFilters = [];
    //   for (let i = 0; i < this.ticketService.typeModels.length; i++) {

    //     if (this.ticketService.typeModels[i].checked) {
    //       this.ticketService.typeFilters.push(this.ticketService.typeModels[i].id);
    //       this.ticketService.countFilter++;
    //     }
    //   }
    //   this.ticketService.topicfilters = [];
    //   if (!this.ticketService.itemTicketTopic) {
    //     for (let i = 0; i < this.ticketService.topicModels.length; i++) {

    //       if (this.ticketService.topicModels[i].checked) {
    //         this.ticketService.topicfilters.push(this.ticketService.topicModels[i].id);
    //         this.ticketService.countFilter++;
    //       }
    //     }
    //   }


    // }

    this.ticketService.isFilter = true;
    this.gf.SearchKeyword().then((data) => {
      if (data) {
        this.modalCtrl.dismiss({ hasfilter: true });
      }
    })
  }
  private setData() {
    
    this.ticketService.regionFilters = [];
    for (let i = 0; i < this.arrFilter.regions.length; i++) {
      const element = this.arrFilter.regions[i];
      element.childs.forEach(item => {
        if (item.checked) {
          this.ticketService.regionFilters.push(item.id);
          this.ticketService.countFilter++;
        }
      });
      // }
    }

    this.ticketService.typeFilters = [];
    for (let i = 0; i < this.arrFilter.types.length; i++) {

      if (this.arrFilter.types[i].checked) {
        this.ticketService.typeFilters.push(this.arrFilter.types[i].id);
        this.ticketService.countFilter++;
      }
    }
    this.ticketService.topicfilters = [];
    for (let i = 0; i < this.arrFilter.topics.length; i++) {

      if (this.arrFilter.topics[i].checked) {
        this.ticketService.topicfilters.push(this.arrFilter.topics[i].id);
        this.ticketService.countFilter++;
      }
    }
  }

  clearFilter() {
    // this.ticketService.itemShowList = "";
    // this.ticketService.itemTicketTopic = "";
    this.arrFilter.regions = [];
    this.arrFilter.topics = [];
    this.ticketService.inputText = "";
    this.ticketService.searchType = 1;
    this.getdata(1);
  }
  itemclick(item,stt) {
    if (stt==1) {
      this.ticketService.itemTicketDetail = item;
      this.ticketService.itemTicketDetail.experienceId = item.id;
      this.ticketService.backPage = 'hometicket';
      this.modalCtrl.dismiss({ hasfilter: false });
      this.ticketService.inputText = "";
      this.navCtrl.navigateForward('/ticketdetail');   
    }else {
      this.ticketService.itemSearchDestination = item;
      this.ticketService.searchType = 1
      this.ticketService.regionFilters = [];
      this.ticketService.regionFilters.push(this.ticketService.itemSearchDestination.id);
      this.ticketService.itemShowList = null;
      this.ticketService.inputText = "";
      this.ticketService.ticketFilter = this.arrFilter;
      this.ticketService.isFilter = true;
      this.gf.SearchKeyword().then(() => {
        this.executeQuantity(1);
        this.modalCtrl.dismiss({ hasfilter: true });
      })

   
    }
    
  }
  gotoSearch(){
    this.modalCtrl.dismiss({ hasfilter: false });
    this.navCtrl.navigateForward('/ticketsearch'); 
  }
}
