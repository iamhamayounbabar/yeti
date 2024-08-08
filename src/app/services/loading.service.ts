import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({providedIn: 'root'})
export class LoadingService {
    private loadingPresent: boolean;
    constructor(public loadingController: LoadingController) { }

    public async present() {
 
        const loading = await this.loadingController.create({
          spinner: 'dots',
          cssClass: 'loading-css',
          showBackdrop: true
        });
     
        return await loading.present();
      }
    
    public async dismiss() {
        await this.loadingController.dismiss();
    }
}