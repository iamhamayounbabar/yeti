import { Injectable } from '@angular/core';
import { IconContractService } from './icon.service';
import { IconexService } from './iconex.service';
import { environment } from '../../environments/environment';
import { LedgerService } from './ledger.service';
import { StorageService } from './storage.service';

@Injectable({providedIn: 'root'})
export class ProposalService {

    constructor(
        public iconService: IconContractService,
        public iconexService: IconexService,
        public ledgerService: LedgerService,
        public storageService: StorageService
    ) { }
    public async SubmitProposal(address: string, endTime: number, ipfsHash: string) {
        var params = {
            _endTime: this.iconService.toHex(+endTime),
            _ipfsHash: ipfsHash
        }

        var wallet_provider = await this.storageService.get('wallet_provider');
        var result: any;

        if(wallet_provider == 'ledger') {
            const point = parseInt(await this.storageService.get('point') || "");
            result = await this.iconexService.sendfromLedger(address, point, environment.proposal_score, 'submitProposal', 0, params);
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
            result = await this.iconexService.callTransaction(address, environment.proposal_score, 'submitProposal', 0, params);
            if (result && result.result) {
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
}    