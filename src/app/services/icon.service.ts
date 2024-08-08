import { Injectable } from '@angular/core';
import * as BigNumber from 'bignumber.js';
import { IconService, HttpProvider, CallTransactionBuilder, CallBuilder } from 'icon-sdk-js';
const { IconBuilder, IconAmount, IconConverter, IconWallet } = IconService;
import { environment } from '../environments/environment';
declare type SignedTransaction = typeof import("icon-sdk-js");

@Injectable({
  providedIn: 'root'
})
export class IconContractService {
    private httpProvider = new HttpProvider(environment.network_url);
    private iconService = new IconService(this.httpProvider);

    public toBigInt(hexValue: string): number {
        return IconConverter.toNumber(IconAmount.of(hexValue, IconAmount.Unit.LOOP).convertUnit(IconAmount.Unit.ICX));

    }

    public toInt(hexValue: any): number {
        return 1 * hexValue;
    }

    public toHex(value: number): string {
        return IconConverter.toHex(value);
    }

    public async getBalance(address: string) {
        const result: BigNumber.BigNumber =  await this.iconService.getBalance(address).execute();
        return result;

    }

    //used for sending signed transaction via ledger
    public async sendTransaction(signedTransaction: SignedTransaction) {
       const result = await this.iconService.sendTransaction(signedTransaction).execute();
       return result;
    }

    public async delay(ms: number) {
        await new Promise<void>(resolve => setTimeout(()=>resolve(), ms)).then(()=>console.log("fired"));
    }

    public async getTransaction(txHash: string): Promise<any> {
        var result;
        let i: number = 1;
        const maxRetries = 10;

        await this.delay(2000);
        while (i < maxRetries) {
            if (console) console.log (i + ') Getting Transaction result : ' + txHash);
            try {
                result = await this.iconService.getTransactionResult(txHash).execute();
                i = maxRetries;
            }
            catch (exception) {
                if (console) console.log (`[${i}] Exception getting Transaction result : ${exception}`);
                await this.delay(250);
            }
            i++;
        }

        if (console) console.log ('Transaction result : ' + JSON.stringify(result));
        return result;
    }
    
    public async getScoreMethod(score: string, method: string, params: any) {
        if (console) console.log ('Getting Score result : ' + score + ', ' + method + ', ' + JSON.stringify(params));

        const call = new CallBuilder()
        .to(score)
        .method(method)
        .params(params)				
        .build();

        var response = await this.iconService.call(call).execute();
        if (response) {
            if (console) console.log (method + ' result : ' + JSON.stringify(response));
            return response;
        }
        else
            throw "Error calling Score";
    }
}