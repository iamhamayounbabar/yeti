import { Component } from '@angular/core';
import { SwitchType } from 'src/app/enums/switch-type.enum';
import { IconContractService } from '../../services/icon.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { YetiService } from 'src/app/services/yeti.service';
import { environment } from 'src/app/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.css']
})
export class MintComponent {
  private sub: any;
  count = 1;
  tab = 1;
  isYetiChecked: boolean = true;
  showText= false;
  yetiCost = 100;
  farmCost = 40;
  balance: number = 0;
  address: string | null;
  mintType: string = "Yeti" ;
  yetiMinted: number = 0;
  farmMinted: number = 0;

  constructor(private iconService: IconContractService, 
    private storageService: StorageService,
    private toasterService: ToasterService,
    private yetiService: YetiService,
    private route: ActivatedRoute,
    private router: Router) {   
    }

  async ngOnInit() {
    var totalMinted = await this.iconService.getScoreMethod(environment.score_address, 'getYetiMintCount', null);
    try {
      var totalFarmMinted = await this.iconService.getScoreMethod(environment.farmContract, 'getFarmMintCount', null);
    } catch {}
    this.yetiMinted = this.iconService.toInt(totalMinted);
    this.farmMinted = this.iconService.toInt(totalFarmMinted);
  }  

  incrementCount() {
    this.count++;
    if(this.mintType == 'Yeti') {
      this.yetiCost+=100;
    }
    else {
      this.farmCost+=40;
    }
  }

  decrementCount() {
    if (this.count > 1) {
      this.count--;
      if(this.mintType == "Yeti") {
        this.yetiCost-=100;
      }
      else {
        this.farmCost-=40;
      }

    }
  }

  selectedType(type: SwitchType) {
    this.count = 1;
    this.mintType = type;
    this.yetiCost = 100;
    this.farmCost = 40;
  }

  
  async mint() {
    this.address = await this.storageService.get('ytsc:public_address');

    if (!this.address) {
      this.toasterService.showWarning("Please connect your wallet first", "");
      return;
    }


    if(this.mintType == "Yeti") {
      var b = (await this.iconService.getBalance(this.address!));
      this.balance = this.iconService.toInt(b) /  10 ** 18;
      if(this.balance < this.yetiCost) {
        this.toasterService.showWarning(`You do not have enough ICX in your wallet make this purchase`, "");
        return
      } 
      this.sendYetiMintTx(this.yetiCost, this.yetiCost/100);
    }
    else {
      const bnUSDBalance = this.iconService.toBigInt(await this.iconService.getScoreMethod(environment.bnUSD, "balanceOf", {"_owner": this.address }));
      if(bnUSDBalance < this.farmCost) {
        this.toasterService.showWarning(`You do not have enough bnUSD in your wallet make this purchase`, "");
        return
      } 

      this.sendFarmMintTx(this.farmCost, this.farmCost/40);
    }
  }

  async sendYetiMintTx(cost: number, quantity: number) {
    var wallet_provider = await this.storageService.get('ytsc:wallet_provider');
    if(wallet_provider == "ledger") {
      this.toasterService.showInfo(`Confirm transction on your ledger device"`,"");
    }

    try {  
      var result = await this.yetiService.MintYeti(this.address!, cost, quantity);   
      if (!result.failure) {
        if (quantity == 1)
          this.toasterService.showSuccess(`Your Yeti is now viewable in "Ranking"`,"");
        else
          this.toasterService.showSuccess(`Your Yetis are now viewable in "Ranking"`,"");

      } else {
        this.toasterService.showError(`Error: ${result.failure}`, "");
      }
    } 
    catch (exception) {
      this.toasterService.showError(`Error: ${exception}`, "");
    } 
  }

  async sendFarmMintTx(cost: number, quantity: number) {
    var wallet_provider = await this.storageService.get('ytsc:wallet_provider');
    if(wallet_provider == "ledger") {
      this.toasterService.showInfo(`Confirm transction on your ledger device"`,"");
    }

    try {  
      var result = await this.yetiService.MintFarm(this.address!, cost, quantity);   
      if (!result.failure) {
        if (quantity == 1)
          this.toasterService.showSuccess(`Your Farm is now viewable in "Ranking"`,"");
        else
          this.toasterService.showSuccess(`Your Farms are now viewable in "Ranking"`,"");

      } else {
        this.toasterService.showError(`Error: ${result.failure}`, "");
      }
    } 
    catch (exception) {
      this.toasterService.showError(`Error: ${exception}`, "");
    } 
  }
}
