import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders,HttpClientModule  } from '@angular/common/http';
import { ToasterService } from './toaster.service';
import { EMPTY } from 'rxjs';
import { catchError, retry, shareReplay } from 'rxjs/operators';
import { environment } from "../environments/environment";
import { BalancedStats } from "../entities/Balanced";
import { YetiRanking } from '../entities/yetiRanking';
import { YetiMarketStats } from '../entities/yetiMarketStats';
import { YetiTrait } from '../entities/Traits';
import { YetiSaleHistory } from '../entities/YetiSaleHistory';
import { Farm } from '../entities/Farm';
import { Market } from '../entities/MarketActivity';
import { Nft } from '../models/nft.model';

@Injectable()
export class ApiController  {

  private END_POINT: string = "address";

    constructor(private http: HttpClient, 
                @Inject('BASE_API_URL') private baseUrl: string,
                private toasterService: ToasterService)  { }


    async GetBalancedStats() {
        const endpoint: string = `https://balanced.icon.community/api/v1/tokens?address=${environment.frmd_Address}`;
        return this.http.get<BalancedStats[]>(endpoint).pipe(
            retry(3),
            catchError(() => {
                this.toasterService.showError("Error!: Unable to balanced stats, please try again", '');
                return EMPTY;
            }),
            shareReplay()
        ).toPromise();
    }
    async GetYetiRankingByAddress(address: string, take: number=50, skip: number=0){
        const httpOptions = {
            headers: new HttpHeaders({ 
              'Access-Control-Allow-Origin':'*'
            })
          };
        const endpoint: string = `https://ytsc-ranking.com/api/yeti?skip=${skip}&take=${take}&buyNow=false&address=${address}`;
        return this.http.get<YetiRanking>(endpoint, httpOptions).toPromise();
    }

    async GetYetiStats() {
        const httpOptions = {
            headers: new HttpHeaders({ 
              'Access-Control-Allow-Origin':'*'
            })
          };
        const endpoint: string = `https://ytsc-ranking.com/api/activity/stats`;
        return this.http.get<YetiMarketStats>(endpoint, httpOptions).toPromise();
    }

    async GetYetiById(yetiId: number) {
      const httpOptions = {
          headers: new HttpHeaders({ 
            'Access-Control-Allow-Origin':'*'
          })
        };
      const endpoint: string = `https://ytsc-ranking.com/api/traits?yetiId=${yetiId}`;
      return this.http.get<YetiTrait>(endpoint, httpOptions).toPromise();
  }

  async GetYetiSaleHistory(yetiId: number) {
    const httpOptions = {
        headers: new HttpHeaders({ 
          'Access-Control-Allow-Origin':'*'
        })
      };
    const endpoint: string = `https://api.craft.network/nft/history/cx30f18d26f45d990112a4cd4825c0b79af73aac7c:${yetiId}`;
    return this.http.get<YetiSaleHistory>(endpoint, httpOptions).toPromise();
  }

  async GetMarketActivity(take: number=50, skip: number=0){
    const httpOptions = {
        headers: new HttpHeaders({ 
          'Access-Control-Allow-Origin':'*'
        })
      };
    const endpoint: string = `https://ytsc-ranking.com/api/activity?skip=${skip}&take=${take}&sort=Date`;
    return this.http.get<Market>(endpoint, httpOptions).toPromise();
  }

  async GetAllByAddress(address: string, page: number) {
    var endpoint: string = `${this.END_POINT}/${address}/nft/farm?page=${page}`;
    if(!environment.production) {
      endpoint = `${this.END_POINT}/${address}/nft/farm?page=${page}&test=true`;
    }

    return await this.http.get<Farm[]>(this.baseUrl + endpoint).pipe(
        retry(3),
        catchError(() => {
            this.toasterService.showError("Error!: Unable to retrieve nft data, please try again", '');
            return EMPTY;
        }),
        shareReplay()
    ).toPromise();
  }

  async GetFarmById(address: string, id: number) {
    var endpoint: string = `${this.END_POINT}/${address}/nft/farm/&${id}`;
    if(!environment.production) {
      endpoint = `${this.END_POINT}/${address}/nft/farm/&${id}&test=true`;
    }
 
    return await this.http.get<Farm>(this.baseUrl + endpoint).pipe(
        retry(3),
        catchError(() => {
             this.toasterService.showError("Error!: Unable to retrieve nft data, please try again", '');
             return EMPTY;
        }),
        shareReplay()
    ).toPromise();
  }

  async GetFarmDetails(address: string) {
    var endpoint: string = `${this.END_POINT}/${address}/nft/farm?page=1&detail=true`;
    if(!environment.production) {
      endpoint = `${this.END_POINT}/${address}/nft/farm?page=1&detail=true&test=true`;
    }
 
    return await this.http.get<Farm[]>(this.baseUrl + endpoint).pipe(
        retry(3),
        catchError(() => {
             this.toasterService.showError("Error!: Unable to retrieve nft data, please try again", '');
             return EMPTY;
        }),
        shareReplay()
    ).toPromise();
  }

  async GetYetiAvailableForHousing(address: string) {
    var endpoint: string = `${this.END_POINT}/${address}/nft/yeti?page=1&farmsyeti=true`;
    if(!environment.production) {
      endpoint = `${this.END_POINT}/${address}/nft/yeti?page=1&farmsyeti=true&test=true`;
    }
 
    return await this.http.get<Nft[]>(this.baseUrl + endpoint).pipe(
        retry(3),
        catchError(() => {
             this.toasterService.showError("Error!: Unable to retrieve nft data, please try again", '');
             return EMPTY;
        }),
        shareReplay()
    ).toPromise();
  }
}

