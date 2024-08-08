import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParamsOptions } from '@angular/common/http';
import { ToasterService } from './toaster.service';
import { EMPTY } from 'rxjs';
import { catchError, retry, shareReplay } from 'rxjs/operators';
import { environment } from "src/environments/environment";
import { ProposalMetaData } from "../entities/ProposalMetaData";
import {PinataDetail} from "../entities/PinataDetail"
import { end } from '@popperjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class IpfsController  {

    constructor(private http: HttpClient, 
                private toasterService: ToasterService)  { }

    async UploadProposal(proposal: ProposalMetaData): Promise<Observable<PinataDetail>>  {
        var reqHeader = new HttpHeaders({ 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${environment.jwt}`
            });

        const endpoint: string = `${environment.ipfsApiUrl}/pinning/pinJSONToIPFS`; 
        return this.http.post<PinataDetail>(endpoint, proposal, {headers: reqHeader});

    }
       
}

