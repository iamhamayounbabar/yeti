import { Component } from '@angular/core';
import { YetiRanking, Yeti } from 'src/app/entities/yetiRanking';
import { SwitchType } from 'src/app/enums/switch-type.enum';
import { Filter } from 'src/app/models/filter.model';
import { ApiController } from 'src/app/services/api.service';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';
import { StorageService } from 'src/app/services/storage.service';
import { IconContractService } from 'src/app/services/icon.service';
import { environment } from 'src/app/environments/environment';
import { LoadingService } from 'src/app/services/loading.service';
import { ChangeDetectorRef } from '@angular/core';
import { Farm } from 'src/app/entities/Farm';
import { ToasterService } from 'src/app/services/toaster.service';
import { YetiService } from 'src/app/services/yeti.service';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent {
  farms: any = [
    { img: 'assets/images/cloud_nine.png', title: 'Cloud nine', num: 'Cloud nine #21', level: '5', workers: '3/4', product: '2 $FRMD /' },
    { img: 'assets/images/frosty.png', title: 'Frosty peak', num: 'Frosty peak #1015', level: '5', workers: '2/2', product: '2 $FRMD /' },
    { img: 'assets/images/arctic.png', title: 'Arctic', num: 'Arctic glacier #997', level: '5', workers: '3/4', product: '2 $FRMD /' },
    { img: 'assets/images/cloud_nine.png', title: 'Cloud nine', num: 'Cloud nine #21', level: '5', workers: '3/4', product: '2 $FRMD /' },
    { img: 'assets/images/frosty.png', title: 'Frosty peak', num: 'Frosty peak #1015', level: '5', workers: '2/2', product: '2 $FRMD /' },
    { img: 'assets/images/arctic.png', title: 'Arctic', num: 'Arctic glacier #997', level: '5', workers: '3/4', product: '2 $FRMD /' },
    { img: 'assets/images/cloud_nine.png', title: 'Cloud nine', num: 'Cloud nine #21', level: '5', workers: '3/4', product: '2 $FRMD /' },
    { img: 'assets/images/frosty.png', title: 'Frosty peak', num: 'Frosty peak #1015', level: '5', workers: '2/2', product: '2 $FRMD /' },
    { img: 'assets/images/cloud_nine.png', title: 'Cloud nine', num: 'Cloud nine #21', level: '5', workers: '3/4', product: '2 $FRMD /' },
    { img: 'assets/images/frosty.png', title: 'Frosty peak', num: 'Frosty peak #1015', level: '5', workers: '2/2', product: '2 $FRMD /' },
    { img: 'assets/images/arctic.png', title: 'Arctic', num: 'Arctic glacier #997', level: '5', workers: '3/4', product: '2 $FRMD /' },
    { img: 'assets/images/cloud_nine.png', title: 'Cloud nine', num: 'Cloud nine #21', level: '5', workers: '3/4', product: '2 $FRMD /' },
    { img: 'assets/images/frosty.png', title: 'Frosty peak', num: 'Frosty peak #1015', level: '5', workers: '2/2', product: '2 $FRMD /' },
    { img: 'assets/images/arctic.png', title: 'Arctic', num: 'Arctic glacier #997', level: '5', workers: '3/4', product: '2 $FRMD /' },
    { img: 'assets/images/cloud_nine.png', title: 'Cloud nine', num: 'Cloud nine #21', level: '5', workers: '3/4', product: '2 $FRMD /' },
    { img: 'assets/images/frosty.png', title: 'Frosty peak', num: 'Frosty peak #1015', level: '5', workers: '2/2', product: '2 $FRMD /' },
  ]

  address: string | null = "";
  farmsOnAccount: number = 0;
  subscriptionName: Subscription; 
  farm: Farm[] = [];
  page = 1;

  constructor(private apiController: ApiController, 
    private sharedService: SharedService,
    private storageService: StorageService,
    private iconService: IconContractService,
    private loadingController: LoadingService,
    private changeDetectorRef: ChangeDetectorRef,
    private toasterService: ToasterService,
    private yetiService: YetiService) {
 

    this.subscriptionName = this.sharedService.getUpdate().subscribe(
      message => { this.loadFarms();}
    );
  }

  async ngOnInit() {
    this.address = await this.storageService.get('ytsc:public_address');
    if(this.address) {
      this.loadFarms();
    }
  } 


  async loadFarms() {

    var params: any = {"_address": this.address };
    this.farmsOnAccount = this.iconService.toInt(await this.iconService.getScoreMethod(environment.farmContract, "numberOfTokensByAddress", params));
    if(this.farmsOnAccount > 0) {
      await this.loadingController.present();
      const nftCollection = await this.apiController.GetAllByAddress(this.address!, this.page) as Farm[];
      this.farm.push(...nftCollection);   
      await this.loadingController.dismiss();
    } 
  }
  
  loadmore(){
    let data = [
      { img: 'assets/images/arctic.png', title: 'Arctic', num: 'Arctic glacier #997', level: '5', workers: '3/4', product: '2 $FRMD /' },
      { img: 'assets/images/cloud_nine.png', title: 'Cloud nine', num: 'Cloud nine #21', level: '5', workers: '3/4', product: '2 $FRMD /' },
      { img: 'assets/images/frosty.png', title: 'Frosty peak', num: 'Frosty peak #1015', level: '5', workers: '2/2', product: '2 $FRMD /' },
    ]
    data.forEach(e => {
      this.farms.push(e)
    })
  }
}
