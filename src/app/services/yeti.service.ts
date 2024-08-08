import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Nft } from '../models/nft.model';
import { IconContractService } from '../services/icon.service';
import { StorageService } from 'src/app/services/storage.service';
import { IconexService } from './iconex.service';
import { environment } from '../environments/environment';
import { IconService } from 'icon-sdk-js';
const {IconAmount, IconConverter } = IconService;

@Injectable({
  providedIn: 'root'
})
export class YetiService {
  apiUrl: string = "https://v1.api.metricx.info/";
  constructor(private http: HttpClient, 
    private iconService: IconContractService, 
    private iconexService: IconexService, 
    private storageService: StorageService) { }

  getYetis(){
    return this.http.get<Nft[]>(this.apiUrl + "address/hx5cb84c5948a03d8aa1b2abc475fb42fcc1bd72c9/nft/yeti?page=1")
  }

  public async MintYeti(address: string, amount: number, supply: number){
    var params = {
        _supply: this.iconService.toHex(+supply),
    }
    
    var wallet_provider = await this.storageService.get('ytsc:wallet_provider');
    var result: any;

    if(wallet_provider == 'ledger') {
        const point = (await this.storageService.get('ytsc:point'));
        result = await this.iconexService.sendfromLedger(address, parseInt(point!), environment.score_address, 'mint', amount, params);
        if (result) {
            const txHash = result;
            var txResult = await this.iconService.getTransaction(txHash);
            if (!txResult) {
                throw `Transaction failed`;
            }
            if (txResult.failure) {
                throw `${txResult.failure.message}. Click <a href='${environment.transaction_url}${txHash}' target='_blank'><u>here</u></a> to view details`;
            }
        }
        else {
            if (result && result.message)
                throw `Unable to Mint Yeti: ${result.message}`;
            else
                throw `Unable to Mint Yeti`;
        } 
    }
    else {
        result = await this.iconexService.callTransaction(address, environment.score_address, 'mint', amount, params);
        if (result &&result.result) {
            const txHash = result.result;
            var txResult = await this.iconService.getTransaction(txHash);
            if (!txResult) {
                throw `Transaction failed`;
            }
            if (txResult.failure) {
                throw `${txResult.failure.message}. Click <a href='${environment.transaction_url}${txHash}' target='_blank'><u>here</u></a> to view details`;
            }
        }
        else {
            if (result && result.message)
                throw `Unable to Mint Yeti: ${result.message}`;
            else
                throw `Unable to Mint Yeti`;
        } 
    }
    return result;
} 

public async MintFarm(address: string, value: number, supply: number) {
    const obj = {"method":"mint","params":{"_supply":IconConverter.toHex(IconConverter.toBigNumber(supply))}}

    const data = '0x'+this.toHex(JSON.stringify(obj));
   
    var params = {
        _to: environment.farmContract,
        _value: IconConverter.toHex(IconAmount.of(value, IconAmount.Unit.ICX).toLoop()),
        _data: data
    }

    var wallet_provider = await this.storageService.get('ytsc:wallet_provider');
    var result: any;

    if(wallet_provider == 'ledger') {
        const point = (await this.storageService.get('ytsc:point'));
        result = await this.iconexService.sendfromLedger(address, parseInt(point!), environment.bnUSD, 'transfer', 0, params);
        if (result) {
            const txHash = result;
            var txResult = await this.iconService.getTransaction(txHash);
            if (!txResult) {
                throw `Transaction failed`;
            }
            if (txResult.failure) {
                throw `${txResult.failure.message}. Click <a href='${environment.transaction_url}${txHash}' target='_blank'><u>here</u></a> to view details`;
            }
        }
        else {
            if (result && result.message)
                throw `Unable to Mint Yeti: ${result.message}`;
            else
                throw `Unable to Mint Yeti`;
        } 
    }
    else {
        result = await this.iconexService.callTransaction(address, environment.bnUSD, 'transfer', 0, params);
        if (result &&result.result) {
            const txHash = result.result;
            var txResult = await this.iconService.getTransaction(txHash);
            if (!txResult) {
                throw `Transaction failed`;
            }
            if (txResult.failure) {
                throw `${txResult.failure.message}. Click <a href='${environment.transaction_url}${txHash}' target='_blank'><u>here</u></a> to view details`;
            }
        }
        else {
            if (result && result.message)
                throw `Unable to Mint Yeti: ${result.message}`;
            else
                throw `Unable to Mint Yeti`;
        } 
    }
    return result;
    } 


    async upgradeFarm(address: string, level: number, farmId: number, value: number) {
        const obj = {"method":"upgrade","level":level.toString(), "farmId": farmId.toString()}

        const data = '0x'+this.toHex(JSON.stringify(obj));
       
        var params = {
            _to: environment.farmContract,
            _value: IconConverter.toHex(IconAmount.of(value, IconAmount.Unit.ICX).toLoop()),
            _data: data
        }
    
        var wallet_provider = await this.storageService.get('ytsc:wallet_provider');
        var result: any;
    
        if(wallet_provider == 'ledger') {
            const point = (await this.storageService.get('ytsc:point'));
            result = await this.iconexService.sendfromLedger(address, parseInt(point!), environment.frmd_Address, 'transfer', 0, params);
            if (result) {
                const txHash = result;
                var txResult = await this.iconService.getTransaction(txHash);
                if (!txResult) {
                    throw `Transaction failed`;
                }
                if (txResult.failure) {
                    throw `${txResult.failure.message}. Click <a href='${environment.transaction_url}${txHash}' target='_blank'><u>here</u></a> to view details`;
                }
            }
            else {
                if (result && result.message)
                    throw `Unable to Upgrade Farm ${result.message}`;
                else
                    throw `Unable to Upgrade Farm`;
            } 
        }
        else {
            result = await this.iconexService.callTransaction(address, environment.frmd_Address, 'transfer', 0, params);
            if (result &&result.result) {
                const txHash = result.result;
                var txResult = await this.iconService.getTransaction(txHash);
                if (!txResult) {
                    throw `Transaction failed`;
                }
                if (txResult.failure) {
                    throw `${txResult.failure.message}. Click <a href='${environment.transaction_url}${txHash}' target='_blank'><u>here</u></a> to view details`;
                }
            }
            else {
                if (result && result.message)
                    throw `Unable to Upgrade Farm: ${result.message}`;
                else
                    throw `Unable to Upgrade Farm`;
            } 
        }
        return result;
    } 

    async claim(address: string, id: number) {
        var params = {
            _id: this.iconService.toHex(+id),
         }
         
         var wallet_provider = await this.storageService.get('ytsc:wallet_provider');
         var result: any;
  
         if(wallet_provider == 'ledger') {
             const point = (await this.storageService.get('ytsc:point'));
             result = await this.iconexService.sendfromLedger(address!, parseInt(point!), environment.score_address, 'claim', 0, params);
             if (result) {
                 const txHash = result;
                 var txResult = await this.iconService.getTransaction(txHash);
                 if (!txResult) {
                     throw `Transaction failed`;
                 }
                 if (txResult.failure) {
                     throw `${txResult.failure.message}. Click <a href='${environment.transaction_url}${txHash}' target='_blank'><u>here</u></a> to view details`;
                 }
             }
             else {
                 if (result && result.message)
                     throw `Unable to Claim $FRMD ${result.message}`;
                 else
                     throw `Unable to Claim $FRMD`;
             } 
         }
         else {
             result = await this.iconexService.callTransaction(address!, environment.score_address, 'claim', 0, params);
             if (result &&result.result) {
                 const txHash = result.result;
                 var txResult = await this.iconService.getTransaction(txHash);
                 if (!txResult) {
                     throw `Transaction failed`;
                 }
                 if (txResult.failure) {
                     throw `${txResult.failure.message}. Click <a href='${environment.transaction_url}${txHash}' target='_blank'><u>here</u></a> to view details`;
                 }
             }
             else {
                 if (result && result.message)
                     throw `Unable to Claim $FRMD: ${result.message}`;
                 else
                     throw `Unable to Claim $FRMD`;
             } 
         }
         return result;
     }

     public async ClaimAll(address: string, yetiOnAccount: number) {
        var params = {
            _address: address 
        }

        var wallet_provider = await this.storageService.get('ytsc:wallet_provider');
        var result: any;

        if(wallet_provider == 'ledger') {
            const point = (await this.storageService.get('ytsc:point'));
            result = await this.iconexService.sendfromLedger(address, parseInt(point!), environment.score_address, 'claimAllFrmdByAddress', 0, params, yetiOnAccount);
            if (result) {
                const txHash = result;
                var txResult = await this.iconService.getTransaction(txHash);
                if (!txResult) {
                    throw `Transaction failed`;
                }
                if (txResult.failure) {
                    throw `${txResult.failure.message}. Click <a href='${environment.transaction_url}${txHash}' target='_blank'><u>here</u></a> to view details`;
                }
            }
            else {
                if (result && result.message)
                    throw `Unable to claim: ${result.message}`;
                else
                    throw `Unable to claim`;
            } 
        }
        else {
            result = await this.iconexService.callTransaction(address, environment.score_address, 'claimAllFrmdByAddress', 0, params, yetiOnAccount);
            if (result &&result.result) {
                const txHash = result.result;
                var txResult = await this.iconService.getTransaction(txHash);
                if (!txResult) {
                    throw `Transaction failed`;
                }
                if (txResult.failure) {
                    throw `${txResult.failure.message}. Click <a href='${environment.transaction_url}${txHash}' target='_blank'><u>here</u></a> to view details`;
                }
            }
            else {
                if (result && result.message)
                    throw `Unable to claim: ${result.message}`;
                else
                    throw `Unable to claim`;
            } 
        }
        return result;
    }

    
    private toHex(str: string)  {
        let result = ''
        for (let i = 0; i < str.length; i++) {
            result += str.charCodeAt(i).toString(16)
        }
        return result
    }
}
