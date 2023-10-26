
import {Injectable, EventEmitter} from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
    providedIn: 'root' // <- ADD THIS
})
@Injectable()
export class flightService{
    itemFlightChangePax = new EventEmitter();
    itemFlightChangeLocation = new EventEmitter();
    itemTabFlightActive = new EventEmitter();
    itemFlightLuggagePriceChange = new EventEmitter();
    itemFlightMealPriceChange = new EventEmitter();
    itemFlightSeatPriceChange = new EventEmitter();
    itemFlightFilterChange = new EventEmitter();
    itemFlightFilterChangeReturn= new EventEmitter();
    itemFlightLogin = new EventEmitter();
    itemMenuFlightClick = new EventEmitter();
    itemFlightMytripRefresh= new EventEmitter();
    itemChangeTicketFlight= new EventEmitter();
    itemFlightReloadInfo= new EventEmitter();
    itemTabFlightFocus= new EventEmitter();
    itemTimePriorityChange= new EventEmitter();
    itemAllFlightCount= new EventEmitter();

    itemUseFulClick= new EventEmitter();
    itemHomeFlightScrollTop= new EventEmitter();
    itemFlightReChoiceSeat= new EventEmitter();
    itemResetCheckSeat= new EventEmitter();
    itemCheckHotelCity= new EventEmitter();
    itemHotelCityChange= new EventEmitter();
    itemHotelCityAddHotel= new EventEmitter();
    itemHotelCityChangeRoom= new EventEmitter();
    itemFlightAccountToken= new EventEmitter();

    itemTranferChange = new EventEmitter();
    itemFlightCache:any={};
    fromPage:any;
    objSearch: any;
  searchDepartCode: boolean;
  listAllFlight: any=[];
  listAllFlightDepart: any=[];
  listAllFlightReturn: any=[];
  objectFilter:any = null;
  listFlightFilter: any=[];
  listflightDepartFilter: any=[];
  listflightReturnFilter: any=[];
  reservationId: any;
  objBooking: any;
  
  tabFlightIndex: any=1;
  listAirport: any;
  objectFilterReturn:any= null;
  bookingCodePayment: any;
  isConnected: any;
  bookingSuccess: any;
    itemFlightLuggageReload: any;
  showCalendarLowestPrice: boolean;
  countAllFlight: any;

  itemFlightTopDeal: any;
  paymentError: any;
  itemCheckTabActive = new EventEmitter();
  itemFlightInternational: any={};
  listAirlinesFilter: any;
  listStops: any;
  listflightInternationalFilter:any = [];
  listAllFlightInternational:any = [];
  objectFilterInternational:any = {};
  itemFlightInternationalInfo: any;
  itemFlightInternationalDepartureDetail: any;

  private ItemFlightReloadInfoSubject = new Subject<any>();
  indexFlightInternational: any;
  showFlightInfoFromSearchPage: boolean;
  loadFlightInfoType: any;
  listAllPlaceByArea: any=[];
  listPrices: any=[];
  keyLoadMorePrices: string;
  classSelected: any;
  classSelectedName: string;
  fromOrderRequestChangeFlight: any;
  fromOrderRequestDetailSupport: boolean;
  filterFromRequestSearchFlight: boolean;
  orderRequestDepartFlight: any;
  orderRequestReturnFlight: any;
  typeFlightUsefulShow: number;
  itemReview: any;
  showFlightDetailFrom: string;
  listTopReviews: any;
  publicItemFlightReloadInfo(data: any) {
    this.ItemFlightReloadInfoSubject.next(data);
  }

  getItemFlightReloadInfo(): Subject<any> {
    return this.ItemFlightReloadInfoSubject;
  }
  
  private ItemFlightInternationalFilterSubject = new Subject<any>();
  publicItemFlightInternationalFilter(data: any) {
    this.ItemFlightInternationalFilterSubject.next(data);
  }

  getItemFlightInternationalFilter(): Subject<any> {
    return this.ItemFlightInternationalFilterSubject;
  }
  
  private itemShowMoreFlightTopDeal = new Subject<any>();
  publicItemShowMoreFlightTopDeal(data: any) {
    this.itemShowMoreFlightTopDeal.next(data);
  }

  getItemShowMoreFlightTopDeal(): Subject<any> {
    return this.itemShowMoreFlightTopDeal;
  }
  
  private ItemOrderRequestSearchFlightFilterSubject = new Subject<any>();
  publicOrderRequestSearchFlightFilter(data: any) {
    this.ItemOrderRequestSearchFlightFilterSubject.next(data);
  }

  getOrderRequestSearchFlightFilter(): Subject<any> {
    return this.ItemOrderRequestSearchFlightFilterSubject;
  }
    
  
  
  
  
  
  
  
  
  
}