import { environment } from '../../environments/environment';
import { GlobalFunction } from '../../app/providers/globalfunction';
import { Injectable } from '@angular/core';

@Injectable()
export class C {
    //public static googleAnalytics: GoogleAnalytics;
    public static UXCam_Key = 'z59iim32dkhrptd';
    public static ENV = environment.ENV || 'dev';
    public static GF :any = {
      get appVersion(){
        let gf!: GlobalFunction;
        return gf.getAppVersion();
      }
    }
    public static urls: any = {
      get baseUrl() {
        if (!C.HOSTS[C.ENV]) { }
  
        return C.HOSTS[C.ENV];
      },
      apiVersion: 'api',
      get url() {
        return this.baseUrl + '/' + this.apiVersion;
      },
      get users() {
        return this.url + '/users'; 
      },
    };
    private static HOSTS: any = {
      dev: {urlPost: 'https://svc1-beta.ivivu.com',urlGet: 'https://beta.ivivu.com', urlContracting: 'https://betapay.ivivu.com', urlMobile: 'https://beta-olivia.ivivu.com',urlBlog: 'https://svc3.ivivu.com',urlGate: 'https://beta-olivia.ivivu.com',urlPayment: 'https://beta-olivia.ivivu.com/payment',urlbookcombo:'https://betapay.ivivu.com/', urlSVC3: 'https://beta-svc3.ivivu.com/api/', urlFood: "https://beta-food.ivivu.com", urlERPFood: "https://beta-erpfood.ivivu.com/",  urlFlight: "https://beta-air.ivivu.com/",emailDC:"sandbox.test@ivivu.info", urlFlightInt: "https://beta-api-flight-internal.ivivu.com/", countryName: 'Việt Nam', urlTicket: 'https://beta-vvcapi.ivivu.com'},
      //prod: {urlPost: 'https://svc1-beta.ivivu.com',urlGet: 'https://beta.ivivu.com', urlContracting: 'https://betapay.ivivu.com', urlMobile: 'https://beta-olivia.ivivu.com',urlBlog: 'https://svc3.ivivu.com',urlGate: 'https://beta-olivia.ivivu.com',urlPayment: 'https://beta-olivia.ivivu.com/payment',urlbookcombo:'https://betapay.ivivu.com/', urlSVC3: 'https://beta-svc3.ivivu.com/api/', urlFood: "https://beta-food.ivivu.com", urlERPFood: "https://beta-erpfood.ivivu.com/",  urlFlight: "https://beta-air.ivivu.com/",emailDC:"sandbox.test@ivivu.info", urlFlightInt: "https://beta-api-flight-internal.ivivu.com/", countryName: 'Việt Nam', urlTicket: 'https://beta-vvcapi.ivivu.com'},
      // dev: {urlPost: 'https://svc1.ivivu.com',urlGet: 'https://www.ivivu.com', urlContracting: 'https://pay.ivivu.com', urlMobile: 'https://gate.ivivu.com',urlBlog: 'https://svc3.ivivu.com',urlGate: 'https://gate.ivivu.com',urlPayment: 'https://gate.ivivu.com/payment', urlSVC3: 'https://svc3.ivivu.com/api/', urlFood: "https://food.ivivu.com", urlERPFood: "https://erpfood.ivivu.com/", urlFlight: "https://api-flight.ivivu.com/",emailDC:"support@ivivu.com", urlFlightInt: "https://api-flightint.ivivu.com/", countryName: 'Việt Nam', urlTicket: 'https://vvcapi.ivivu.com'},
      prod: {urlPost: 'https://svc1.ivivu.com',urlGet: 'https://www.ivivu.com', urlContracting: 'https://pay.ivivu.com', urlMobile: 'https://gate.ivivu.com',urlBlog: 'https://svc3.ivivu.com',urlGate: 'https://gate.ivivu.com',urlPayment: 'https://gate.ivivu.com/payment', urlSVC3: 'https://svc3.ivivu.com/api/', urlFood: "https://food.ivivu.com", urlERPFood: "https://erpfood.ivivu.com/", urlFlight: "https://api-flight.ivivu.com/",emailDC:"support@ivivu.com", urlFlightInt: "https://api-flightint.ivivu.com/", countryName: 'Việt Nam', urlTicket: 'https://vvcapi.ivivu.com'},
      release: {urlPost: 'https://svc1.ivivu.com',urlGet: 'https://www.ivivu.com', urlContracting: 'https://pay.ivivu.com', urlMobile: 'https://gate.ivivu.com',urlBlog: 'https://svc3.ivivu.com',urlGate: 'https://gate.ivivu.com',urlPayment: 'https://gate.ivivu.com/payment', urlSVC3: 'https://svc3.ivivu.com/api/', urlFlight: "https://api-flight.ivivu.com/",emailDC:"support@ivivu.com", urlFlightInt: "https://api-flightint.ivivu.com/", countryName: 'Việt Nam', urlTicket: 'https://vvcapi.ivivu.com'},
    };
  

    public static writeErrorLog(objError:any,response) {
      if(objError.type){
        return;
      }
      var obj = { 
       "content": "Error from page: "+ (objError.page || "") + " - function: " + (objError.func|| "") + " - params: " + (objError.param || "" )+ " - Content: " + (objError.stack || "") + "response" +JSON.stringify(response) + " - AppVersion: "  ,
       "name": "[Olivia App] " +"page: "+ (objError.page || "") + " - function: " + (objError.func|| "") + " " + objError.message || "",
       "status": objError.type || "error",
       "type": "app", 
       }
       var options = {
         method: 'POST',
         url: C.urls.baseUrl.urlMobile +"/api/erp/Logging/write-json",
         headers:
           {
            'accept': 'application/json',
            'content-type': 'application/json-patch+json',
           },
         body: JSON.stringify(obj),
       };

       let urlPath = C.urls.baseUrl.urlMobile +"/api/erp/Logging/write-json";
        let headers = { 
          'cache-control': 'no-cache',
          'content-type': 'application/json'
        };
        let gf!: GlobalFunction;
        gf.RequestApi('POST', urlPath, headers, obj, 'policy', 'getdata').then((data)=>{
       })
     };

     public static writePaymentLog(page, func, type, param){
      let objPaymentLog = {
        page : page,
        func : func,
        type : type,
        param: param
      }
      C.writeErrorLog(objPaymentLog, {});
     }

  };
