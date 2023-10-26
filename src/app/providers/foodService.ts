
import {Injectable, EventEmitter} from '@angular/core';

@Injectable({
    providedIn: 'root' // <- ADD THIS
})
@Injectable()
export class foodService{
  itemRelateClick = new EventEmitter();
  menuFooterClick = new EventEmitter();
  itemCartChange = new EventEmitter();
  itemCountFilter = new EventEmitter();
  itemActiveFoodTab = new EventEmitter();
  itemDinnerRelateClick = new EventEmitter();
  itemTabFood= new EventEmitter();
  itemAddToCartFromFoodbill= new EventEmitter();
  itemRefreshTripHistoryAfterReview = new EventEmitter();

  itemFoodDetail: any;
  listItemsFood: any[] = [];
  chef: any[] =[];
  listFoodsFilter: any[];
  objectFilter: any={};
  listAddToCart: any = [];  
  addNew = false;
  itemAddToCart: any;
  listItemsCart: any=[];
  listItemsCartrequest: any=[];
  countcart: any=0;
  countcartdinner: any=0;
  objBooking:any;
  totalPrice:any;
  tabFoodIndex: any=1;
  bookkingCode:string;
  ischeckpayment:string;
  firstload: number=0;
  district:any = []; 
  isBook:boolean;
  ischeckchangeplace:string;
  PeriodPaymentDate:string;
  periodStartDate: any;
  periodEndDate: any;
  itemOrderDetail: any;
  BillingCode:string;
  qrimg:string;
  itemOrderBookingDetail: any;
  itemFoodReview: any;
  textStoreMsg:string;
  listMenuReviewed: any;
  listimagereview: any;
  objFoodReview: any;
  itemDinnerDetail: any;
  isDinner: any;
  itemDinnerAddToCart: any=[];
  listDinnerItemsCart: any=[];
  fromPage: string;
  periodStartDateNextWeek: any;
  periodEndDateNextWeek: any;
  listItemsFoodNextweek: any[];
  isBookDinner: boolean;
  listItemsDinnerNextWeek: any;
  myorderActiveTab: number;
  itemOrder: any;
  ischeckmomo: boolean;
  
}