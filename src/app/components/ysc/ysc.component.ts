import { Component } from '@angular/core';
import { IconContractService } from '../../services/icon.service';
import { environment } from '../../environments/environment';
import { BalancedStats } from "../../entities/Balanced";
import { ApiController } from '../../services/api.service';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment'; // Import moment as well
import { ChartData } from 'src/app/models/chartData.model';
import { LoadingService } from 'src/app/services/loading.service';


@Component({
  selector: 'app-ysc',
  templateUrl: './ysc.component.html',
  styleUrls: ['./ysc.component.css']
})
export class YscComponent {
progressBar1: number = 100;
circulatingSupplyProgress: number = 0;
stakedProgress: number = 0;
progressBar4: number = 0;
yetiMinted: number = 0;
farmMinted: number = 0;
public icxPrice: number = 0;
public holders: number = 0;
public priceChangeValue24: string;
public priceDirection: boolean = false;
public frmdPrice : number = 0;
public circulatingSupply: number = 0;
public totalStaked: number = 0;
totalFrmd: string;
frmdLockedSupply: number = 0;
frmdLockedProgress: number = 0;
bStart: string= '1656651631';
selectedOption: string = '1W';

  selectedFilter: number | undefined = -1;

  chartFilterButtons: { display: string, time: string, value: number, cValue: moment.DurationInputArg2, bStart: number | null }[] = [
    { display: '15 min', time: '15m', value: 7, cValue: 'd', bStart: null},
    { display: '1 H', time: '1h', value: 30, cValue: 'd', bStart: null},
    { display: '4 H', time: '4h', value: 4, cValue: 'h', bStart: 1656651631},
    { display: '1 W', time: '1w', value: 1, cValue: 'w', bStart: 1656651631},
    { display: '1 D', time: '1d', value: 1, cValue: 'd', bStart: 1656651631},
  ]

  chartData: {x: string, y: number}[] = [
    {x: '02 Jan', y: 31},
    {x: '05 Jan', y: 40},
    {x: '10 Jan', y: 28},
    {x: '15 Jan', y: 51},
    {x: '20 Jan', y: 42},
    {x: '25 Jan', y: 109},
    {x: '30 Jan', y: 100},
  ]

  nft: any = [
    {value : '8000', text: 'YETI NFTs minted'},
    {value : '3000', text: 'Farm NFTs minted'},
    {value : '3000', text: '$FRMD farmed daily'},
    {value : '800', text: 'Unique holders'},
    {value : '$0.03', text: '24% change price'},
  ]

  yeti: any = [
    {img: 'assets/images/cloud_yeti.svg', title: 'Cloud Yeti', detail: `A mysterious and elusive
    group, considered a myth even by other Yeti tribes, they reside atop the unclimbable
    Cloud Peak.`},
    {img: 'assets/images/ice_yeti.svg', title: 'Ice Yeti', detail: `The most chill tribe, known
    for being hospitable and laidback. They celebrate explorers who manage to reach
    their elevated territory.`},
    {img: 'assets/images/snow_yeti.svg', title: 'Snow Yeti', detail: `Complaining about the cold,
    they find solace in clearing the Yeti paths and snowboarding on the snowy slopes of
    the Snow Peak.`},
    {img: 'assets/images/water_yeti.svg', title: 'Water Yeti', detail: `A transient group following
    the flowing rivers of Water Peak, they are often found swiping equipment from
    unsuspecting campers.`}
  ]

  constructor(private iconService: IconContractService,private httpClient: HttpClient, 
    private apiController: ApiController, private loadingService: LoadingService) {}

  async ngOnInit() {
      var totalMinted = await this.iconService.getScoreMethod(environment.score_address, 'getYetiMintCount', null);
      this.yetiMinted = this.iconService.toInt(totalMinted);
      try {
        this.farmMinted = this.iconService.toInt(await this.iconService.getScoreMethod(environment.farmContract, 'getFarmMintCount', null));
      } catch {}
      this.loadBalancedData();
      this.tokenDistro();
      this.filterChartData('15m', 7, 'd', 0, null, true);
  }
  

  async loadBalancedData() {
    const balancedStats: BalancedStats[] = await this.apiController.GetBalancedStats() as BalancedStats[];
    this.holders = balancedStats[0].holders;
    const currentPrice = balancedStats[0].price;
    const priceTh = balancedStats[0].price_24h;
    const priceChange = await this.priceChange(currentPrice, priceTh);
    if (priceChange > 0) {
      this.priceChangeValue24 = "+"+priceChange.toFixed(2)+"%";
      this.priceDirection = true;
    } else if (priceChange < 0) {
      this.priceChangeValue24 = priceChange.toFixed(2)+"%";
      this.priceDirection = false;
    } else {
      this.priceChangeValue24 = "0%"
      this.priceDirection = true;
    }
  
    this.frmdPrice = currentPrice;
  }

  async priceChange(currentPrice: number, previousPrice: number) {
    const change = currentPrice - previousPrice;
    const percentChange = (change / previousPrice) * 100;
    return percentChange;
  }

  async tokenDistro() {
    this.totalStaked =  this.iconService.toBigInt(await this.iconService.getScoreMethod(environment.frmd_Address, "totalStakedBalance", null)); 
    const balanceOfFRMDContract = this.iconService.toBigInt(await this.iconService.getScoreMethod(environment.frmd_Address, "balanceOf", {"_owner": environment.frmd_admin }));
    const totalSupply = this.iconService.toBigInt(await this.iconService.getScoreMethod(environment.frmd_Address, "totalSupply", null));
    const yetiHoldings = this.iconService.toBigInt(await this.iconService.getScoreMethod(environment.frmd_Address, "balanceOf",  {"_owner": environment.score_address }));
    const nodeHoldings = this.iconService.toBigInt(await this.iconService.getScoreMethod(environment.frmd_Address, "balanceOf",  {"_owner": environment.node_address }));
    this.circulatingSupply = (totalSupply - balanceOfFRMDContract - yetiHoldings - nodeHoldings);
    this.circulatingSupplyProgress = (this.circulatingSupply / 32000000) * 100;
    this.stakedProgress = (this.totalStaked / this.circulatingSupply) * 100;

    // locked suppply
    this.frmdLockedSupply = this.iconService.toBigInt(await this.iconService.getScoreMethod(environment.treasuryContract, "FundsInFRMDTreasury", null));
    this.frmdLockedProgress = (this.frmdLockedSupply / this.circulatingSupply) * 100;
  }

  selectOption(option: string) {
    this.selectedOption = option;
  }

  filterChartData(time: string, timeValue: number, cValue: moment.DurationInputArg2, index: number, bStart: number | null, onLoad: boolean = false) {
    this.selectedFilter = index;

    let fromTs  = moment().subtract(timeValue, cValue).valueOf();
    let toTs = moment().valueOf();

    let fromUnix = moment(fromTs).unix();
    let toUnix = moment(toTs).unix();

    if(bStart) {
      fromUnix = bStart;
    }

    // Define the URL based on the selected filter
    let //apiUrl: string = `https://balanced.icon.community/api/v1/pools/series/48/1h/${fromUnix}/1698123631`;
    apiUrl = `https://balanced.icon.community/api/v1/pools/series/48/${time}/${fromUnix}/${toUnix}`; //Uncomment this to test the chart data.
    

    // Load data from the URL
    if (apiUrl) {
      this.loadChartData(apiUrl, onLoad);
    }
  }

  loadChartData(url: string, onLoad: boolean) {
    if(!onLoad) {
      this.loadingService.present();
    }
    this.httpClient.get<ChartData[]>(url).subscribe((data: ChartData[]) => {
      if(data && data.length > 0){
        this.chartData = data.map((item: ChartData) => ({
          x: moment.unix(item.timestamp).format('YYYY-MM-DD HH:mm:ss'), // Format the timestamp using Moment.js
          y: parseFloat(item.close.toFixed(4)),     // Replace 'item.value' with the actual property containing the price data
        }));
      }
      this.loadingService.dismiss();
    });

  }

}
