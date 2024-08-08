import { Component, EventEmitter, Input, Output,ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ApiController } from 'src/app/services/api.service';
import { StorageService } from 'src/app/services/storage.service';
import { LedgerService } from 'src/app/services/ledger.service';
import { SharedService } from 'src/app/services/shared.service';
import { IconexService } from 'src/app/services/iconex.service';
import { LoadingService } from 'src/app/services/loading.service';
import { LedgerAddress } from 'src/app/entities/LedgerAddress';
import { ToasterService } from 'src/app/services/toaster.service';
import { IconContractService } from 'src/app/services/icon.service';

@Component({
  selector: 'app-connect-wallet',
  templateUrl: './connect-wallet.component.html',
  styleUrls: ['./connect-wallet.component.css']
})
export class ConnectWalletComponent {
  @Input()
  isAuthorized: boolean = false;
  @Output() authenticated: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() id: string;
  public address: string | null = "";
  public icxPrice: number = 0;
  public holders: number = 0;
  public priceChangeValue24: string;
  public priceDirection: boolean = false;
  public connected: boolean = false;
  public ledgerAddress: LedgerAddress[] = [];
  public balance: number;
  public pageNumber: number = 0;
  public showLedger: boolean = false;
  public hanaSelected: boolean = false;
  public ledgerSelected: boolean = false;

  
  @ViewChild('closeModal',{static: false}) closeModal: ElementRef
  @ViewChild('closeModalLedger',{static: false}) closeModalLedger: ElementRef
  showModal: boolean = false;
  constructor(private router: Router,
    private apiController: ApiController, 
    private storageService: StorageService,
    private ledgerService: LedgerService,
    private sharedService: SharedService,
    private iconexService: IconexService,
    private loadingService: LoadingService,
    private toasterService: ToasterService,
    private iconService: IconContractService,
    private cd: ChangeDetectorRef,){

  }

  ngOnInit(){
  }

  public displayAddress = (address: string) => `${address.slice(0, 9)}...${address.slice(-7)}`;
  public displayBalance = (value: any) => {return this.iconService.toInt(value) / 10 ** 18;};

  displayModal(){
    setTimeout(() => {
      this.showModal = true;
    }, 300);
  }
 
  crypto_chain: any = [
    {img: 'assets/images/symbol6.svg'}
  ]

  wallet: any = [
    {img: 'assets/images/hana.png'},
    {img: 'assets/images/symbol5.svg'}
  ]

  selectedCrypto: number = -1;
  selectedWallet: number = -1;

  selectCryptoItem(index: number) {
    this.selectedCrypto = index;
  }

  selectWalletItem(index: number) {
    this.selectedWallet = index;

    if(index == 0) {
      this.LoginUsingIconex();
    }
    else {
      this.closeModal.nativeElement.click()
      this.showLedger = true;
    }
  }

  connect(): boolean{
    //Your authentication code.
    localStorage.setItem("Auth", "Connected");
    this.authenticated.emit(true);
    return true;
  }

  async LoginUsingIconex() {
    this.hanaSelected = true;
    this.ledgerSelected = false;
    this.address = await this.iconexService.selectAddress();
    this.cd.detectChanges(); 
    await this.storageService.set('ytsc:public_address', this.address);
    this.connected = true;
    await this.storageService.set('ytsc:wallet_provider', 'iconex');
    this.sharedService.sendUpdate(this.address);
    this.closeModal.nativeElement.click()
  }

  async LoginUsingLedger() {
    this.hanaSelected = false;
    this.ledgerSelected = true;
    //get the top 5 address to display
    await this.loadingService.present();
    try {
          this.ledgerAddress = await this.ledgerService.getLedgerAddress(0, 5);   
          await this.loadingService.dismiss();
          this.closeModal.nativeElement.click();   
    }
    catch {
      this.toasterService.showError('Unable to commucate to Ledger, please check if it is connected', 'Ledger Error');
      await this.loadingService.dismiss();
      this.closeModalLedger.nativeElement.click();  
    }
  }

  async loadNext() {
    this.ledgerAddress.splice(0);
    this.pageNumber = this.pageNumber + 6; 
    await this.loadingService.present();
    try {
          this.ledgerAddress = await this.ledgerService.getLedgerAddress(this.pageNumber, 5);   
          await this.loadingService.dismiss();
  }
  catch {
    this.toasterService.showError('Unable to commucate to Ledger, please check if it is connected', 'Ledger Error');
    await this.loadingService.dismiss();
  }
}

async loadPrevious() {
  this.ledgerAddress.splice(0);
  this.pageNumber = this.pageNumber - 6; 
  await this.loadingService.present();
  try {
          this.ledgerAddress = await this.ledgerService.getLedgerAddress(this.pageNumber, 5);   
          await this.loadingService.dismiss();
  }
  catch {
    this.toasterService.showError('Unable to commucate to Ledger, please check if it is connected', 'Ledger Error');
    await this.loadingService.dismiss();
  }
}

async SelectLedgerAddress(address: string, point: number) {
  await this.storageService.set('ytsc:public_address', address);
  await this.storageService.set('ytsc:wallet_provider', 'ledger');
  await this.storageService.set('ytsc:point', point.toString());
  this.sharedService.sendUpdate(address);
  this.connected = true;
  this.closeModalLedger.nativeElement.click();
}


  disconnect(): boolean{
    //Your disconnect code.
    localStorage.removeItem("Auth");
    this.authenticated.emit(false);
    if(this.router.url == '/app'){
      this.router.navigate(['/ysc']);
    }
    return false;
  }
}