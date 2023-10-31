import { Injectable } from '@angular/core';
import { ToastController, Platform } from '@ionic/angular';
import {
  Observable,
  fromEvent,
  merge,
  of
} from 'rxjs';

import {
  mapTo
} from 'rxjs/operators';
import { Network } from '@capacitor/network';

export enum ConnectionStatusEnum {
  Online,
  Offline
}

@Injectable({
  providedIn: 'root'
})
export class NetworkProvider {

  private online$: Observable < boolean >;
  network: any;

  constructor(public alertCtrl: ToastController, 
    private platform: Platform) {
      Network.getStatus().then((con)=>{
        this.network = con;
      })
     }

     public getNetworkType(): string {

      return this.network.type;
    }
  
    public async getNetworkStatus(): Promise<boolean> {
      return new Promise(async (resolve, reject)=>{
        const _network:any = await Network.getStatus();
        resolve(_network.connected)
      })
    }

    public setNetworkStatus(value){
      this.online$.pipe(mapTo(value)).subscribe(mapTo(value));
    }

    isOnline(): boolean {
      return this.network.connected == true;
    }

    isOffline(): boolean {
      return this.network.connected == false;
    }
}
