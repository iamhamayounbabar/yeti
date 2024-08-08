import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Trait, YetiTrait } from 'src/app/entities/Traits';
import { environment } from 'src/app/environments/environment';
import { ApiController } from 'src/app/services/api.service';
import { IconContractService } from 'src/app/services/icon.service';
import { IconService } from 'icon-sdk-js';
import { LoadingService } from 'src/app/services/loading.service';
import { Location } from '@angular/common'
import { YetiSaleDetails, YetiSaleHistory } from 'src/app/entities/YetiSaleHistory';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';
import { StorageService } from 'src/app/services/storage.service';
import { YetiService } from 'src/app/services/yeti.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { SwitchType } from 'src/app/enums/switch-type.enum';
import { Farm } from 'src/app/entities/Farm';

const {IconAmount, IconConverter } = IconService;

@Component({
  selector: 'app-traits',
  templateUrl: './traits.component.html',
  styleUrls: ['./traits.component.css']
})
export class TraitsComponent {
  tab=1;

  private sub: any;
  id: number;
  yetiTrait: Trait[] = [];
  farmTrait: Farm;
  unclaimedFrmd: number;
  listedPrice: number = 0;
  loaded: boolean = false;
  showDetailLoaded: boolean = false;
  yetiSaleHistory: YetiSaleDetails[] = [];
  img: string = "";
  address: string | null = "";
  subscriptionName: Subscription;
  selectedSwitch: SwitchType;
  tribe: string;
  remainingDays: number = 0;

  history: any = [
    {img: 'assets/images/emoji1.png', id:'hxfkkd.....323', detail: 'put 1 unit on sale 3 hrs ago', icon:'...'},
    {img: 'assets/images/emoji2.png', id:'hxfkkd.....323', detail: 'put 1 unit for 100 ICX 2 months ago', icon:'...'},
    {img: 'assets/images/emoji3.png', id:'hxfkkd.....323', detail: 'put 1 unit on sale 3 hrs ago', icon:'...'},
    {img: 'assets/images/emoji4.png', id:'hxfkkd.....323', detail: 'put 1 unit for 100 ICX 2 months ago', icon:'.1..'},
  ]

  offers: any = [
    {price: '40 ICX', offerby: 'Wafkkdodsppdfs3p3ik32pinpnpip1889'},
    {price: '38 ICX', offerby: 'hxfkkdodsppdZs3p3ik32pinpnpip3323'},
    {price: '35 ICX', offerby: 'OxfkkdodsppdXs3p3ik32pinpnpip3110'},
    {price: '32 ICX', offerby: 'hxfkkdodsppdfs3p3ik32pinpnpip3323'},
  ]
  constructor(private route: ActivatedRoute, 
    private apiController: ApiController,
    private iconService: IconContractService,
    private loadingService: LoadingService,
    private location: Location,
    private sharedService: SharedService,
    private storageService: StorageService,
    private yetiService: YetiService,
    private toasterService: ToasterService) {
      this.subscriptionName = this.sharedService.getUpdate().subscribe(
        message => { this.address = message.text}
      );

    }

  public displayAddress = (address: string) => `${address.slice(0, 9)}...${address.slice(-7)}`;
  
  async ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.listedPrice = +params['price'];
      this.selectedSwitch = params['type'];    
    });

    this.address = await this.storageService.get('ytsc:public_address');

    if(this.selectedSwitch == SwitchType.Yeti) {
      this.img =`https://framd.mypinata.cloud/ipfs/QmbQTGDmF2bcSH66kuevGxtLxhbaAQFH5aUHEFvVMd4Fy1/${this.id}.png`;
      this.loadTraits();
      this.loadUnclaimedFrmd();
      this.loaded = true;
    } else {
      this.img =`https://framd.mypinata.cloud/ipfs/QmUFW4yamj2V7HkhsKT52oGWZeZVrTh25K6rFtJG6xSF1s/${this.id}.webp`;
      this.loadFarmTraits();
      this.loaded = true;
    }

    this.calculateDaysRemaining();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  async loadUnclaimedFrmd() {
    var params: any = {"_id": IconConverter.toHex(IconConverter.toBigNumber(this.id)) };
    this.unclaimedFrmd = this.iconService.toInt(await this.iconService.getScoreMethod(environment.score_address, "frmdOnToken", params));
    this.loadingService.dismiss();
  }

  async loadTraits() {
    if(!this.loaded) {
      this.yetiTrait = [];
      this.loadingService.present();
      const yetiTraints: YetiTrait = await this.apiController.GetYetiById(this.id) as YetiTrait;
      this.yetiTrait.push(...yetiTraints.traits);
      this.loadingService.dismiss();
    }
  }
  
  async loadFarmTraits() {
      const result = await this.apiController.GetFarmById(this.address!, this.id) as Farm;
      this.farmTrait = result[0];

      this.tribe = this.farmTrait.attributes[0].value;
  }

  async claim() {
      this.loadingService.present();
      try {  
        var result = await this.yetiService.claim(this.address!, this.id);
        if (!result.failure) {
          this.toasterService.showSuccess(`Successfully claimed ${this.unclaimedFrmd} $FRMD`,"");
  
        } else {
          this.toasterService.showError(`Error claiming FRMD: ${result.failure}`, "");
        }
      } 
      catch (exception) {
        this.toasterService.showError(`Error claiming FRMD: ${result.failure}`, "");
      }   
      this.loadingService.dismiss();
      this.loadUnclaimedFrmd();
   }
  
  async loadDetail() {
    if(!this.showDetailLoaded) {
      const saleHistory: YetiSaleHistory = await this.apiController.GetYetiSaleHistory(this.id) as YetiSaleHistory;
      this.yetiSaleHistory.push(...saleHistory.data);
    }
  }
  
  showTraits() {
    this.tab = 1;
    this.loadTraits();
  }

  async showDetail() {
    this.tab = 2;
    await this.loadDetail();
    this.showDetailLoaded = true;
  }

  close() {
    window.close();
  }

  private async calculateDaysRemaining() {
    try {
      var params: any = {"_id": IconConverter.toHex(IconConverter.toBigNumber(this.id)) };
      var totalClaimed =  this.iconService.toInt(await this.iconService.getScoreMethod(environment.score_address, "totalClaimed", params));
   
      if(this.id < 6467){
        this.remainingDays = 515 - (totalClaimed+ this.unclaimedFrmd);
      }else{
        this.remainingDays = 545 - (totalClaimed + this.unclaimedFrmd);
      }

    }catch(error){
    }
  }
}
