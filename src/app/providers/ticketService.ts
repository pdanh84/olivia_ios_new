
import {Injectable, EventEmitter} from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root' // <- ADD THIS
})

export class ticketService{
  gaPaymentType = '';
  private filterTourSubject = new Subject<any>();
  private scrollToDepartureDivSubject = new Subject<any>();
  private searchTicketSubject = new Subject<any>();
  itemTicketList: any;
  itemTicketDetail: any;
  itemTicketService: any;
  totalPrice: string;
  qrimg: any;
  BillingCode: any;
  periodPaymentDate: any;
  discountPrice: any;
  paymentType: number=0;
  totalPriceStr: Promise<boolean>;
  backPage: string;
  itemSearchTicket = new EventEmitter();
  itemTicketTopic: any;
  ticketDetailId: any;
  hasAllotment:any
  totalPriceNum: number;
  indexDetail: number;
  departureCalendarStr: string;
  itemSearchDestination: any;
  itemShowList: any;
  itemSearchDepature: any;
  input: any;
  experience: any;
  itemDetail : any;
  skus: any;
  adult : any;
  child : any;
  elder : any;
  bookingInfo: any;
  isFilter: boolean = false;
  inputText: string;
  slideData: any;
  regionFilters: any = [];
  typeFilters: any = [];
  topicfilters: any = [];
  ticketFilter: any;
  countFilter: number = 1;
  searchType: any;
  regionModels: any;
  topicModels: any;
  typeModels: any;
  selectedDateDisplay: string;
  selectedDate: string;
  totalPax: number;
  itemExperienceDetail: any;
  ischeckCalendar: any;
  timeId: any;
  checkinDate: any;
  discountpromo: number;
  promocode: string;
  itemFlightCache: any;
  dataAllExperiences: any=[];
  dataPopularLocationVN: any=[];
  dataPopularLocation: any=[];
  publicFilterTour(data: any) {
    this.filterTourSubject.next(data);
  }

  getObservableFilterTour(): Subject<any> {
    return this.filterTourSubject;
  }

  publicScrollToDepartureDiv(data: any) {
    this.scrollToDepartureDivSubject.next(data);
  }

  getObservableScrollToDepartureDiv(): Subject<any> {
    return this.scrollToDepartureDivSubject;
  }
  
  publicSearchTicketRegion(data:any) {
    this.searchTicketSubject.next(data);
  }

  getObservableSearchTicketRegion(): Subject<any> {
    return this.searchTicketSubject;
  }

}

