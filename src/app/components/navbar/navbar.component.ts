import { Component, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { LedgerService } from 'src/app/services/ledger.service';
import { SharedService } from 'src/app/services/shared.service';
import { IconexService } from 'src/app/services/iconex.service';
import { LedgerAddress } from 'src/app/entities/LedgerAddress';
import { IconContractService } from 'src/app/services/icon.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isAuthorized: boolean = false;
  show: boolean = false;
  public address: string | null = "";
  public icxPrice: number = 0;
  public holders: number = 0;
  public priceChangeValue24: string;
  public priceDirection: boolean = false;
  public connected: boolean = false;
  public ledgerAddress: LedgerAddress[] = [];
  public balance: number;
  public pageNumber: number = 0;
  messageReceived: any;
  public subscriptionName: Subscription; //important to create a subscription

  constructor(private router: Router,
    private storageService: StorageService,
    private ledgerService: LedgerService,
    private sharedService: SharedService,
    private iconService: IconContractService){
      this.subscriptionName = this.sharedService.getUpdate().subscribe(
        message => { this.getAddress();}
      );
  }

  public displayAddress = (address: string) => `${address.slice(0, 9)}...${address.slice(-7)}`;
  public displayBalance = (value: any) => {return this.iconService.toInt(value) / 10 ** 18;};

  async ngOnInit() {
    await this.getAddress();
  }

  async getAddress() {
    this.address = await this.storageService.get('ytsc:public_address');
    const point = await this.storageService.get('point');

    if(point !== undefined || point !== null) {
      this.ledgerService.activeSwitch(true);
    }
    else {
      this.ledgerService.activeSwitch(false);
    }

    if(this.address) {
      this.connected = true;
    }
  }


  disconnect() {
    this.storageService.remove('ytsc:public_address');
    this.storageService.set('wallet_provider', 'disconnected');
    this.storageService.remove('point');
    this.address = "";
    this.connected = false;
    this.ledgerService.close();
    this.sharedService.sendUpdate(this.address!);
  }
}