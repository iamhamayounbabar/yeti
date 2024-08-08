import { Component } from '@angular/core';
import { FarmType } from 'src/app/enums/farm-type.enum';
import { SwitchType } from 'src/app/enums/switch-type.enum';
import { YetiType } from 'src/app/enums/yeti-type.enum';
import { Nft } from 'src/app/models/nft.model';
import { YetiService } from 'src/app/services/yeti.service';
import { ApiController } from 'src/app/services/api.service';
import { Subscription, throwError } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';
import { StorageService } from 'src/app/services/storage.service';
import { IconContractService } from 'src/app/services/icon.service';
import { environment } from 'src/app/environments/environment';
import { LoadingService } from 'src/app/services/loading.service';
import { ChangeDetectorRef } from '@angular/core';
import { Attribute, Farm } from 'src/app/entities/Farm';
import { Yeti } from 'src/app/entities/yetiRanking';
import { ToasterService } from 'src/app/services/toaster.service';
import { IconService } from 'icon-sdk-js';
const {IconConverter } = IconService;


@Component({
  selector: 'app-farm-detail',
  templateUrl: './farm-detail.component.html',
  styleUrls: ['./farm-detail.component.css']
})
export class FarmDetailComponent {

  yetiList: Nft[] = [];
  filteredYetis: Nft[] = [];
  yetiSelected: YetiType | undefined;
  yetiType = YetiType;
  farmIdClicked: number = 0;
  farmSelected: boolean = false;
  address: string | null = "";
  selectedFarmType: number = -1;
  yeti: Yeti[] = [];
  farms: Farm[] = [];
  selectedFarmTraits: Attribute[];
  stake1: Nft | undefined;
  stake2: Nft | undefined;
  stake3: Nft | undefined;
  stake4: Nft | undefined;
  img: string = "";
  selectedTribe: string = "";
  synergyBoosted: string = "";
  waterBoosted: string = "";
  currentLevel: number;
  nextLevel: number = -1;
  farmsOnAccount: number = 0;
  page: number = 1;
  upgradeQuote: number = 0;
  productivity: number = 0;

  subscriptionName: Subscription; 

  constructor(private apiController: ApiController, 
    private sharedService: SharedService,
    private storageService: StorageService,
    private iconService: IconContractService,
    private loadingController: LoadingService,
    private changeDetectorRef: ChangeDetectorRef,
    private toasterService: ToasterService,
    private yetiService: YetiService) { 

      this.subscriptionName = this.sharedService.getUpdate().subscribe(
        message => { this.ngOnInit();}
      );
    }
 

  async ngOnInit(){
    // this.address = await this.storageService.get('ytsc:public_address');
    this.address="hx5af8bd1b5cdc321a53ead7a836601ce8e2c938c9"
    if(this.address) {
      this.loadFarms();
      this.loadYetis();
    }
  }


  async loadFarms() {
    var params: any = {"_address": this.address };
    this.farmsOnAccount = this.iconService.toInt(await this.iconService.getScoreMethod(environment.farmContract, "numberOfTokensByAddress", params));
    if(this.farmsOnAccount > 0) {
      try {
        await this.loadingController.present();
        var farmDetails = await this.apiController.GetFarmDetails(this.address!) as Farm[];;
        this.farms.push(...farmDetails);
        console.log(this.farms);
      }
      catch {
        await this.loadingController.dismiss();
      }
   } 
   await this.loadingController.dismiss();
  }

  addYetiInStake(index: number){
    if(this.stake1 == undefined){
      this.stake1 = this.filteredYetis[index];
    }
    else if(this.stake2 == undefined){
      this.stake2 = this.filteredYetis[index];
    }
    else if(this.stake3 == undefined){
      this.stake3 = this.filteredYetis[index];
    }
    else if(this.stake4 == undefined){
      this.stake4 = this.filteredYetis[index];
    }
    this.filterYeti();
  }

  selectFarm(farmId: number) {
    this.farmSelected = true;
    this.farmIdClicked = farmId;

    for(var i=0; i<this.farms.length; i++) {
      if(this.farms[i].edition == farmId) {
        this.selectedFarmTraits = this.farms[i].attributes;
        this.img = this.farms[i].image;
        this.currentLevel = parseInt(this.farms[i].detail.level);
        this.waterBoosted = this.farms[i].detail.isWaterBoosted;
        this.synergyBoosted = this.farms[i].detail.isSynergyBoosted;
        this.productivity = parseInt(this.farms[i].detail.dailyFrmdDistribution);
        this.selectedFarmType = parseInt(this.farms[i].detail.FarmType);
        break;
      }
    }
  }

  filterYeti(){
    if(!this.yetiSelected){
      this.filteredYetis = (Object.assign([], this.yetiList) as Nft[]).filter(f => f != this.stake1 && f != this.stake2 && f != this.stake3 && f != this.stake4);
      //Enable this when yeti have valid unique id's so they can be filtered on that.
      //this.filteredYetis = (Object.assign([], this.yetiList) as Nft[]).filter(f => f.id != this.stake1?.id || f.id != this.stake2?.id || f.id != this.stake4?.id || f.id != this.stake3?.id);
    }
    else{
      this.filteredYetis = this.yetiList.filter(f => f.attributes.find(a => a.trait_type == "Tribe")?.value == this.yetiSelected && (f != this.stake1 && f != this.stake2 && f != this.stake3 && f != this.stake4));
      //Enable this when yeti have valid unique id's so they can be filtered on that.
      //this.filteredYetis = this.yetiList.filter(f => f.attributes.find(a => a.trait_type == "Tribe")?.value == this.yetiSelected && (f.id != this.stake1?.id || f.id != this.stake2?.id || f.id != this.stake4?.id || f.id != this.stake3?.id));
    }
  }

  getAdditionalYetiByIndex(index: number, desired: number){
    if(this.filteredYetis[index + desired])
      return this.filteredYetis[index + desired];
    return undefined;
  }

  async loadYetis() {

    this.yetiList = await this.apiController.GetYetiAvailableForHousing(this.address!) as Nft[];
    this.filteredYetis = this.yetiList;
    console.log(this.yetiList);

   // this.yetiService.getYetis().subscribe(
   //   (nfts) => {
   //     this.yetiList = nfts;
   //     this.filteredYetis = nfts;
   //   }
   // )
  }

  async upgrade() {
    try {  
      var result = await this.yetiService.upgradeFarm(this.address!, this.nextLevel, this.farmIdClicked, this.upgradeQuote )
      if (!result.failure) {
          this.selectFarm(this.farmIdClicked);
          this.toasterService.showSuccess(`Farm upgrade succesfully"`,"");
          this.currentLevel = this.nextLevel;
      } else {
        this.toasterService.showError(`Error: ${result.failure}`, "");
      }
    } 
    catch (exception) {
      this.toasterService.showError(`Error: ${exception}`, "");
    } 
  }


  levels: any = [
    { level: 'Level 1' },
    { level: 'Level 2' },
    { level: 'Level 3' },
    { level: 'Level 4' },
    { level: 'Level 5' },
    { level: 'Level 6' },
    { level: 'Level 7' },
    { level: 'Level 8' },
    { level: 'Level 9' },
    { level: 'Level 10' }
  ]

  onLevelClick(index: number) {
    if(index > this.currentLevel) {
      this.nextLevel = index;
      this.calculateUpgradeCost();
    }
  }


  async calculateUpgradeCost() {
    if(this.farmIdClicked != -1) {
      var params: any = {"farmType": IconConverter.toHex(IconConverter.toBigNumber(this.selectedFarmType)), "currentLevel": IconConverter.toHex(IconConverter.toBigNumber(this.currentLevel)), "desiredLevel": IconConverter.toHex(IconConverter.toBigNumber(this.nextLevel)) };
      this.upgradeQuote = this.iconService.toBigInt(await this.iconService.getScoreMethod(environment.farmContract, "getUpgradeQuote", params));
    }
  }

  getConnectingLineStyle() {
    if (this.nextLevel > 1) {
      const width = ((this.nextLevel - this.currentLevel) * 10) + 0.5 + '%';
      const marginLeft = (this.currentLevel * 10) - 5.5 + '%';
      return {
        width: width,
        opacity: '1',
        marginLeft: marginLeft
      };
    } else {
      return {
        opacity: '0'
      };
    }
  }
}