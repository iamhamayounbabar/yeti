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
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent {
  tab: number = 1;
  selectedSwitch: SwitchType = SwitchType.Yeti;
  yeti: Yeti[] = [];
  farm: Farm[] = [];
  subscriptionName: Subscription; 
  address: string | null = "";
  yetiOnAccount: number;
  farmsOnAccount: number;
  expectedPageLength: number;
  perPage = 20;
  public page = 1;
  skip: number = 0;
  yetiMinted: number = 0;
  loadedFarms: boolean = false;
  totalYetisMinted: number = 0;
  totalUnclaimedFramd: number = 0;
  notInit: boolean = false;

  filterItems: Filter[] = [
    { category: 'Tribe', filters: ['Cloud', 'Ice', 'Snow', 'Water'] },
    { category: 'Neck', filters: ['Rainbow', 'YTSC Chain', 'Compass Chain', 'FRAMD Chain', 'Emerald'] },
    { category: 'Facemask', filters: ['Ape Blue'] },
  ];

  showSmallSwtich: boolean = false;

  constructor(private apiController: ApiController, 
    private sharedService: SharedService,
    private storageService: StorageService,
    private iconService: IconContractService,
    private loadingController: LoadingService,
    private changeDetectorRef: ChangeDetectorRef,
    private toasterService: ToasterService,
    private yetiService: YetiService) {
    window.addEventListener('resize', () => {
      this.onResize();
    });
    this.onResize();

    this.subscriptionName = this.sharedService.getUpdate().subscribe(
      message => { this.yeti = []; this.ngOnInit();}
    );
  }

  async ngOnInit() {
    this.address = await this.storageService.get('ytsc:public_address');
    if(!this.address) {
      this.showAll(); 
    } else {
      this.loadData();
    }
  } 

  async loadData() {
    this.address = await this.storageService.get('ytsc:public_address');
    var params: any = {"_address": this.address };
    var totalMinted = await this.iconService.getScoreMethod(environment.score_address, 'getYetiMintCount', null);
    this.yetiMinted = this.iconService.toInt(totalMinted);
    try {
        this.farmsOnAccount = this.iconService.toInt(await this.iconService.getScoreMethod(environment.farmContract, "numberOfTokensByAddress", params));
    } catch {}
    this.yetiOnAccount = this.iconService.toInt(await this.iconService.getScoreMethod(environment.score_address, "numberOfTokensByAddress", params));
    this.totalUnclaimedFramd = this.iconService.toInt(await this.iconService.getScoreMethod(environment.score_address, "totalFrmdUnclaimedByAddress", params));
    this.expectedPageLength = Math.ceil(this.yetiOnAccount / this.perPage);
    this.loadYeti();
    this.changeDetectorRef.detectChanges();
  }

  async loadYeti() {
      if(this.yetiOnAccount > 0) { 
        await this.loadingController.present();
        if(this.address) {
          if(this.page > 1 ) {
           this.skip  = this.skip + 20;
          }
          const yetiRanking: YetiRanking = await this.apiController.GetYetiRankingByAddress(this.address, 20, this.skip) as YetiRanking;
          this.yeti.push(...yetiRanking.yetis);
        }

       await this.loadingController.dismiss();
      }
      this.tab=1;
      this.changeDetectorRef.detectChanges();
  }

  async showAll() {
    this.skip = 0;
    this.page = 1;
    this.tab=2;
    this.yeti = [];
    await this.loadingController.present();
    const yetiRanking: YetiRanking = await this.apiController.GetYetiRankingByAddress("", 100, this.skip) as YetiRanking;
    this.yeti.push(...yetiRanking.yetis);
    await this.loadingController.dismiss();
    this.changeDetectorRef.detectChanges();
  } 

  async myCollection () {
    this.skip = 0;
    this.page = 1;
    this.tab=1;
    this.yeti = [];
    this.loadData();
  }

  onResize(){
    if(window.innerWidth < 992){
      this.showSmallSwtich = true;
    }
    else{
      this.showSmallSwtich = false;
    }
  }

  async loadmore() {
    if(this.tab==1) {
      if(this.expectedPageLength != this.page) {
        this.page++;
        this.loadYeti();
      }
    } else {
      this.page++;
      
      if(this.page > 1 ) {
        this.skip = this.skip + 100;
      }
      await this.loadingController.present();
      const yetiRanking: YetiRanking = await this.apiController.GetYetiRankingByAddress("", 100, this.skip) as YetiRanking;
      this.yeti.push(...yetiRanking.yetis);
      await this.loadingController.dismiss();
    }
  }

  async loadMoreFarm() {
    if(this.expectedPageLength != this.page) {
      this.page++;
      await this.loadFarm();
  }
  }

  async loadFarm() {
    if(this.farmsOnAccount > 0) {
      await this.loadingController.present();
      if(this.address) {
        const nftCollection = await this.apiController.GetAllByAddress(this.address, this.page) as Farm[];
        this.farm.push(...nftCollection);
      }
      await this.loadingController.dismiss();
      this.loadedFarms = true;
    } 
  }

  selectedType(type: SwitchType){
    if(type == SwitchType.Yeti) {
     // this.yeti = [];
      //this.loadYeti();
    }
    else {
      if(!this.loadedFarms) {
        this.loadFarm();
      }
    }
    this.selectedSwitch = type;
  }

  async claimAll() {
      var params: any = {"_address": this.address };
      const value = this.iconService.toInt(await this.iconService.getScoreMethod(environment.score_address, "totalFrmdUnclaimedByAddress", params));
      if(value > 0) {
        try {  
          this.loadingController.present();
          var result = await this.yetiService.ClaimAll(this.address!, this.yetiOnAccount);
          if (!result.failure) {
              this.toasterService.showSuccess(`${await this.toFixed(value,2)} $FRMD has been claimed`, "");
         
          } else {
            this.toasterService.showError(`Error: ${result.failure}`, "");
          }
        } 
        catch (exception) {
          this.toasterService.showError(`Error: ${exception}`, "");
        } 
      } else {
        this.toasterService.showInfo('No Rewards to Claim', "");
      }
        this.loadingController.dismiss();
        this.ngOnInit();
  }

  filtersUpdated(selectedFilters: string[]){
    console.log(selectedFilters);
  }

  private async toFixed(num: number, fixed: number) {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)![0];
  }
}
