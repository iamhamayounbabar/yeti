import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { IconService, CallTransactionBuilder } from 'icon-sdk-js';
const { IconBuilder, IconAmount, IconConverter } = IconService;
import { environment } from '../environments/environment';
import { LedgerService } from './ledger.service';
import { IconContractService } from './icon.service';

@Injectable({
  providedIn: 'root'
})

export class IconexService {
  private iconexEvent : EventEmitter<any> = new EventEmitter();
  private subscriptions: Subscription | undefined;
  public stepCost = 50000000;

  constructor(private ledgerService: LedgerService, 
    private provider: IconContractService) {        
      this.registerForIconexEvents();
  }

  private registerForIconexEvents() {
      const eventHandler: any = (event: { detail: { type: any; payload: any; }; }) => {
          const { type, payload } = event.detail;
          this.iconexEvent.emit(payload)
          this.subscriptions?.unsubscribe();
          delete this.subscriptions
      }

      // Publish to top Iconbet frame, works when loaded in iconbet
      window?.top?.addEventListener('IFRAME_RESPONSE', eventHandler);

      // Publish to local frame, works when doing localdev
      window.addEventListener('ICONEX_RELAY_RESPONSE', eventHandler);
  }

  private sendIconexEvent(type: string, payload?: any) {
      // Subscribe to current frame, works when loaded in main frame, works for local dev
      let customEvent = new CustomEvent('ICONEX_RELAY_REQUEST', {
          detail: { 
              type: type,
              payload: payload
          }
      });
      window.dispatchEvent(customEvent);

      // Subscribe to top Iconbet frame, works when loaded in iconbet frame
      customEvent = new CustomEvent('IFRAME_REQUEST', {
          detail: { 
              type: type,
              payload: payload
          }
      });
      window?.top?.dispatchEvent(customEvent);
  }

  private addSubsciption(subscription: Subscription) {
      if (!this.subscriptions)
          this.subscriptions = subscription;
      else 
          this.subscriptions.add(subscription);
  }

  public async hasAccount(): Promise<boolean> {
      this.sendIconexEvent('REQUEST_HAS_ACCOUNT');

      return new Promise<boolean>((resolve, reject) => {
          this.addSubsciption(this.iconexEvent.subscribe(a => resolve(a.hasAccount)));
      });
  }

  public async hasAddress(address: string): Promise<boolean> {
      this.sendIconexEvent('REQUEST_HAS_ADDRESS', address);

      return new Promise<boolean>((resolve, reject) => {
          this.addSubsciption(this.iconexEvent.subscribe(a => resolve(a.hasAddress)));
      });
  }

  public async selectAddress() : Promise<string> {
      this.sendIconexEvent('REQUEST_ADDRESS');

      return new Promise<string>((resolve, reject) => {
          this.addSubsciption(this.iconexEvent.subscribe(a => resolve(a)));
      });
  }

  public async sendfromLedger(from: string, point: number, to: string, method: string, value: number, params = {}, yetiOnAccount = 0): Promise<any> {
    var stepCost = 50000000;
    if(yetiOnAccount >= 60) {
        stepCost = 2000000000;
    }
    const transaction = this.icxCallTransactionBuild(from, to, method, value, params, stepCost);
    const rawTx = IconConverter.toRawTransaction(transaction);

    const signedTransaction = await this.ledgerService.signTransaction(rawTx, point);
    const result = await this.provider.sendTransaction(signedTransaction);

    return result;
  }

  public async callTransaction(from: string, to: string, method: string, value: number, params = {}, yetiOnAccount = 0): Promise<any> {
    var stepCost = 50000000;
    if(yetiOnAccount >= 60) {
        stepCost = 2000000000;
    }
    const transaction = this.icxCallTransactionBuild(from, to, method, value, params, stepCost)
    const jsonRpcQuery = {
        jsonrpc: '2.0',
        method: 'icx_sendTransaction',
        params: IconConverter.toRawTransaction(transaction),
        id: 1234
    }

      this.sendIconexEvent('REQUEST_JSON-RPC', jsonRpcQuery);

      return new Promise<any>((resolve, reject) => {
          this.addSubsciption(this.iconexEvent.subscribe(a => resolve(a)));
      });
  }

  private icxCallTransactionBuild(from: string, to: string, method: string, value: number, params = {}, stepCost = 50000000) {
    let tx = null;
    const timestamp = (new Date()).getTime() * 1000;
    const nonce = IconConverter.toHex(IconConverter.toBigNumber(1));
    const stepLimit = IconConverter.toHex((IconConverter.toBigNumber(stepCost)));
    const version = IconConverter.toHex((IconConverter.toBigNumber(3)));
    const nid = IconConverter.toHex(IconConverter.toBigNumber(environment.nid));
    value = value ? IconConverter.toHex(IconAmount.of(value, IconAmount.Unit.ICX).toLoop()) : "0x0";

    /* Build `CallTransaction` instance for executing SCORE function. */
    tx = new CallTransactionBuilder()
        .from(from)
        .to(to)
        .stepLimit(stepLimit)
        .nid(nid)
        .value(value)
        .nonce(nonce)
        .version(version)
        .timestamp(timestamp)
        .method(method)
        .params(params)
        .build();

    return tx;
  }

}