import { HotellistmoodfilterPageModule } from './hotellistmoodfilter/hotellistmoodfilter.module';
import { FlightcombobookingdetailPageModule } from './flightcombobookingdetail/flightcombobookingdetail.module';
import { AdddiscountPageModule } from './adddiscount/adddiscount.module';
import { CombocarchangeplacePageModule } from './combocarchangeplace/combocarchangeplace.module';
import { CardeparturePageModule } from './cardeparture/cardeparture.module';
import { ConfirmotpPageModule } from './confirmotp/confirmotp.module';
import { HotelreviewsimagePageModule } from './hotelreviewsimage/hotelreviewsimage.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Validators, FormBuilder, FormControl,FormGroup, FormsModule,ReactiveFormsModule  } from '@angular/forms';

import { Platform,IonContent } from '@ionic/angular';
import { Component, NgZone, Input, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController,ToastController,LoadingController } from '@ionic/angular';

//import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';
import { HttpClientModule,HttpClient } from '@angular/common/http';
import { AuthService } from './providers/auth-service';
import { SearchHotel, ValueGlobal, Bookcombo, RoomInfo, DeviceLocation, Booking } from './providers/book-service';
import { ComboPrice} from './providers/comboPrice';
import { C } from './providers/constants';
import { GlobalFunction, ActivityService } from './providers/globalfunction';
import { DepartureCalendarPageModule} from './departurecalendar/departurecalendar.module';
import { PickupCalendarPageModule} from './pickup-calendar/pickup-calendar.module';
import { RequestComboPageModule} from './requestcombo/requestcombo.module';
import { RequestCombo1PageModule} from './requestcombo1/requestcombo1.module';
import { OccupancyPageModule} from './occupancy/occupancy.module';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';

import { Facebook, FacebookLoginResponse } from '@awesome-cordova-plugins/facebook/ngx';

import { LaunchReview } from '@awesome-cordova-plugins/launch-review/ngx';
import {FCM} from '@capacitor-community/fcm';
import { Badge } from '@awesome-cordova-plugins/badge/ngx';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import { FirebaseDynamicLinks } from '@awesome-cordova-plugins/firebase-dynamic-links/ngx';
import { Storage } from '@ionic/storage';
//import { Deeplinks } from '@awesome-cordova-plugins/deeplinks/ngx';
import { Calendar } from '@awesome-cordova-plugins/calendar/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { CodePush, InstallMode } from '@awesome-cordova-plugins/code-push/ngx';
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';


import { environment } from '../environments/environment';
import { FlightchangeinfoPageModule} from './flightchangeinfo/flightchangeinfo.module';
import { FlightsearchairportPageModule} from './flightsearchairport/flightsearchairport.module';
import { FlightselectpaxPageModule } from './flightselectpax/flightselectpax.module';
import { FlightBookingDetailsPageModule } from './flightbookingdetails/flightbookingdetails.module';
import { FlightquickbackPageModule } from './flightquickback/flightquickback.module';
import {FlightsearchfilterPageModule} from './flightsearchfilter/flightsearchfilter.module';
import {FlightpricedetailPageModule} from './flightpricedetail/flightpricedetail.modulte';
import {FlightdetailPageModule} from './flightdetail/flightdetail.module';
import {FlightselecttimepriorityPageModule} from './flightselecttimepriority/flightselecttimepriority.module';
import {flightConfirmBookingDetailPageModule } from './flightconfirmbookingdetail/flightconfirmbookingdetail.module';
import { FlightDeparturePageModule } from './flightdeparture/flightdeparture.module';
import { NetworkProvider } from './network-provider.service';
import { SearchHotelFilterAndSortPageModule} from './search-hotel-filter-and-sort/search-hotel-filter-and-sort.module';
import { UserReviewsPageModule} from './userreviews/userreviews.module';
import { UserFeedBackPageModule } from './userfeedback/userfeedback.module';
import { InsurrancehistorypopoverPageModule } from './insurrancehistorypopover/insurrancehistorypopover.module';
import { InsurrancepopoverPageModule } from './insurrancepopover/insurrancepopover.module';
import { InsurrancedetailPageModule } from './insurrancedetail/insurrancedetail.module';
import { SearchBlogModalPageModule } from './searchblogmodal/searchblogmodal.module';
import { BlogModalPageModule } from './blogmodal/blogmodal.module';
import { TopdealfilterPageModule } from './topdealfilter/topdealfilter.module';
import { ConfirmemailPageModule } from './confirmemail/confirmemail.module';
import { FlightpointsavePageModule } from './flightpointsave/flightpointsave.module';
import { FlightcardbambooPageModule } from './flightcardbamboo/flightcardbamboo.module';
import { FlightcomboupgraderoomPageModule } from './flightcomboupgraderoom/flightcomboupgraderoom.module';
import { HotelRoomDetailPageModule } from './hotelroomdetail/hotelroomdetail.module';
import { PopupinfobkgPageModule } from './popupinfobkg/popupinfobkg.module';
import { SelectDateRangePageModule } from './selectdaterange/selectdaterange.module';
import { SelectDateOfBirthPageModule } from './selectdateofbirth/selectdateofbirth.module';
import { FlightdcpickaddressinputPageModule } from './flightdcpickaddressinput/flightdcpickaddressinput.module';

import { flightService } from './providers/flightService';
import { MytripService } from './providers/mytrip-service.service';
import { AppRoutingPreloaderService } from './providers/AppRoutingPreloaderService';
import { BizTravelService } from './providers/bizTravelService';
import { moodService } from './providers/moodService';
import { topDealService } from './providers/topDealService';
import { RequestRoomPageModule} from './requestroom/requestroom.module';
import { CommonModule } from '@angular/common';
import { VoucherDetailPageModule } from './voucher/voucherdetail/voucherdetail.module';
import { VoucherSlidePageModule } from './voucher/voucherslide/voucherslide.module';
import { VoucherSlideCarComboPageModule } from './voucher/voucherslidecarcombo/voucherslidecarcombo.module';
import { VoucherSlideFlightComboPageModule } from './voucher/voucherslideflightcombo/voucherslideflightcombo.module';
import { VoucherSlideHotelPageModule } from './voucher/voucherslidehotel/voucherslidehotel.module';
import { YoutubeVideoPlayer } from '@awesome-cordova-plugins/youtube-video-player/ngx';
import { TourListFilterPageModule } from './tour/tourlistfilter/tourlistfilter.module';

import { FlightInfoInternationalPageModule } from './flightinternational/flightinfointernationnal/flightinfointernational.module';
import { FlightDepartureDetailInternationalPageModule } from './flightinternational/flightdeparturedetailinternational/flightdeparturedetailinternational.module';
import { FlightInternationalSearchfilterPageModule } from './flightinternational/flightinternationalsearchfilter/flightinternationalsearchfilter.module';
import { FlightDetailInternationalPageModule } from './flightinternational/flightdetailinternational/flightdetailinternational.module';
import { FlightConditionAndPriceInternationalPageModule } from './flightinternational/flightconditionandpriceinternational/flightconditionandpriceinternational.module';
import { HotelreviewsvideoPageModule } from './hotelreviewsvideo/hotelreviewsvideo.module';
import { PhotoLibrary } from '@awesome-cordova-plugins/photo-library/ngx';
import { FlightInternationalFilterClassPageModule } from './flightinternational/flightinternationalfilterclass/flightinternationalfilterclass.module';

// import {
//   RecaptchaModule,
//   RECAPTCHA_SETTINGS,
//   RecaptchaSettings,
//   RecaptchaComponent,
// } from 'ng-recaptcha';
import { MytripTicketQrcodeSlidePageModule } from './mytripticketqrcodeslide/mytripticketqrcodeslide.module';
import { TicketfilterPageModule } from './ticket/ticketfilter/ticketfilter.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  declarations: [AppComponent],
  //entryComponents: [],
  imports: [CommonModule,BrowserModule,HttpClientModule, IonicModule.forRoot(),
    AppRoutingModule,
    DepartureCalendarPageModule,
    PickupCalendarPageModule,
    RequestComboPageModule,
    RequestCombo1PageModule,
    RequestRoomPageModule,
    FlightDeparturePageModule,
    SearchHotelFilterAndSortPageModule,
    OccupancyPageModule,
    HotelreviewsimagePageModule,
    UserReviewsPageModule,
    UserFeedBackPageModule,
    ConfirmotpPageModule,
    CardeparturePageModule,
    SearchBlogModalPageModule,
    BlogModalPageModule,
    InsurrancehistorypopoverPageModule,
    InsurrancepopoverPageModule,
    CombocarchangeplacePageModule,
    InsurrancedetailPageModule,
    AdddiscountPageModule,
    FlightcomboupgraderoomPageModule,
    HotelRoomDetailPageModule,
    PopupinfobkgPageModule,
    FlightsearchfilterPageModule,
    FlightpricedetailPageModule,
    FlightdetailPageModule,
    FlightchangeinfoPageModule,
    FlightsearchairportPageModule,
    FlightselectpaxPageModule,
    FlightBookingDetailsPageModule,
    FlightquickbackPageModule,
    TopdealfilterPageModule,
    ConfirmemailPageModule,
    FlightpointsavePageModule,
    FlightcombobookingdetailPageModule,
    FlightselecttimepriorityPageModule,
    flightConfirmBookingDetailPageModule,
    SelectDateRangePageModule,
    SelectDateOfBirthPageModule,
    HotellistmoodfilterPageModule,
    FlightcardbambooPageModule,
    FlightdcpickaddressinputPageModule,
    VoucherDetailPageModule,
    TourListFilterPageModule,
    FlightInfoInternationalPageModule,
    FlightDepartureDetailInternationalPageModule,
    FlightInternationalSearchfilterPageModule,
    FlightDetailInternationalPageModule,
    FlightConditionAndPriceInternationalPageModule,
    HotelreviewsvideoPageModule,
    FlightInternationalFilterClassPageModule,
    MytripTicketQrcodeSlidePageModule,
    TicketfilterPageModule
    //ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    InAppBrowser,
    AuthService,
    SearchHotel,
    ValueGlobal,
    Bookcombo,
    RoomInfo,
    ComboPrice,
    GlobalFunction,
    ActivityService,
    C,
    FormsModule, ReactiveFormsModule ,
    HttpClientModule ,
    HttpClient,
    LoadingController,
    //FirebaseAnalytics,
    Platform,
    ToastController,FormBuilder,
    //HttpModule,
    IonContent,
    SocialSharing,
    //GooglePlus,
    Camera,
    Keyboard,
    NetworkProvider,
    LaunchReview,
    Badge,
    ImagePicker,
    //Crop,
    FileTransfer,
    File,
    //HTTP,
    PhotoViewer,
    FirebaseDynamicLinks,
    //Geolocation,
    //NativeGeocoder,
    //GoogleMap,
    //Market,
    DeviceLocation,
    CodePush,
    Clipboard,
    //WebView,
    //Deeplinks,
    Calendar,
    Storage,
    flightService,
    MytripService,
    Booking,
    AppRoutingPreloaderService,
    BizTravelService,
    GlobalFunction,
    RoomInfo,
    ValueGlobal,
    SearchHotel,
    Bookcombo,
    C,
    NetworkProvider,
    moodService,
    topDealService,
    Facebook,
    YoutubeVideoPlayer,
    PhotoLibrary,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy, },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
