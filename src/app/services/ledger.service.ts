import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import { Injectable } from '@angular/core';
import { LedgerAddress } from '../entities/LedgerAddress';
import { IconContractService } from './icon.service';
import Icx from '@ledgerhq/hw-app-icx';

declare type TransportWebHID = typeof import('@ledgerhq/hw-transport-webhid');

@Injectable({
    providedIn: 'root'
  })

  export class LedgerService {
    private LEDGER_BASE_PATH: string = "44'/4801368'/0'/0'";
    public transport: any;
    public actived: boolean = false;
    private icx?: TransportWebHID;

    constructor(private iconService: IconContractService) {        
        
    }

    async initialiseTransport(): Promise<void> {
      if (this.transport?.device?.opened) {
        this.transport.close();
        this.icx = undefined;
      }
  
      if (!this.icx) {
        this.transport = await TransportWebHID.create();
        if (this.transport.setDebugMode) {
          this.transport.setDebugMode(false);
        }
  
        this.icx = new Icx(this.transport);
      }
    }

    public activeSwitch = (value: boolean) => this.actived = value;

    public async getLedgerAddress(offset: number, limit: number) {
      await this.initialiseTransport();

       const ledgerAddress: LedgerAddress[] = [];

        for (let i = offset; i < offset + limit; i++) {
          const path = `${this.LEDGER_BASE_PATH}/${i}'`;
          const { address } = await this.icx.getAddress(path, false, true);
          const balance = await this.iconService.getBalance(address.toString());

          ledgerAddress.push({
            address: address,
            balance: balance,
            point: i
          });
        }
        return ledgerAddress; 
      };
 
    public async close() {
        if(this.transport?.device?.opened) {
           this.transport.close();
           this.icx = null;
           this.actived = false;
        }
    }

    public async signTransaction(rawTransaction: any, point: number) : Promise<any>{
      
        await this.initialiseTransport()

        const hashKey = this._generateHashKey(rawTransaction);
        const signedData = await this.icx.signTransaction(`${this.LEDGER_BASE_PATH}/${point}'`, hashKey);
        const { signedRawTxBase64 } = signedData;
        rawTransaction.signature = signedRawTxBase64;

        return {
          getRawTransaction: () => rawTransaction,
          getProperties: () => rawTransaction,
          getSignature: () => signedRawTxBase64,
        };
   
    }

    _generateHashKey(obj: any): any {
      let resultStrReplaced = "";
      const resultStr = this._objTraverse(obj);
      resultStrReplaced = resultStr.substring(1).slice(0, -1);
      return "icx_sendTransaction." + resultStrReplaced;
    }
  
    _objTraverse(obj: any): any {
      let result = "";
      result += "{";
      let keys;
      keys = Object.keys(obj);
      keys.sort();
      if (keys.length > 0) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const value = obj[key];
          switch (true) {
            case value === null: {
              result += `${key}.`;
              result += String.raw`\0`;
              break;
            }
            case typeof value === "string": {
              result += `${key}.`;
              result += this._escapeString(value);
              break;
            }
            case Array.isArray(value): {
              result += `${key}.`;
              result += this._arrTraverse(value);
              break;
            }
            case typeof value === "object": {
              result += `${key}.`;
              result += this._objTraverse(value);
              break;
            }
            default:
              break;
          }
          result += ".";
        }
        result = result.slice(0, -1);
        result += "}";
      } else {
        result += "}";
      }
  
      return result;
    }
  
    _arrTraverse(arr: any): any {
      let result = "";
      result += "[";
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < arr.length; j++) {
        const value = arr[j];
        switch (true) {
          case value === null: {
            result += String.raw`\0`;
            break;
          }
          case typeof value === "string": {
            result += this._escapeString(value);
            break;
          }
          case Array.isArray(value): {
            result += this._arrTraverse(value);
            break;
          }
          case typeof value === "object": {
            result += this._objTraverse(value);
            break;
          }
          default:
            break;
        }
        result += ".";
      }
      result = result.slice(0, -1);
      result += "]";
      return result;
    }
  
    _escapeString(value: any): any {
      let newString = String.raw`${value}`;
      newString = newString.split("\\").join("\\\\");
      newString = newString.split(".").join("\\.");
      newString = newString.split("{").join("\\{");
      newString = newString.split("}").join("\\}");
      newString = newString.split("[").join("\\[");
      newString = newString.split("]").join("\\]");
      return newString;
    }

  }