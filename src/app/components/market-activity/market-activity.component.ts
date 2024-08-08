import { Component } from '@angular/core';
import { timeout } from 'rxjs';
import { Activity, Market } from 'src/app/entities/MarketActivity';
import { SwitchType } from 'src/app/enums/switch-type.enum';
import { Filter } from 'src/app/models/filter.model';
import { ApiController } from 'src/app/services/api.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-market-activity',
  templateUrl: './market-activity.component.html',
  styleUrls: ['./market-activity.component.css']
})
export class MarketActivityComponent {
  activity: Activity[] = [];
  skip: number = 0;
  page: number = 1;
  selectedSwitch: SwitchType = SwitchType.Yeti;
  tableData: any = [];
  total: number = 0;
  filterItems: Filter[] = [
    { category: 'Tribe', filters: ['Cloud', 'Ice', 'Snow', 'Water'] },
    { category: 'Neck', filters: ['Rainbow', 'YTSC Chain', 'Compass Chain', 'FRAMD Chain', 'Emerald'] },
    { category: 'Facemask', filters: ['Ape Blue'] },
  ];

  showSmallSwtich: boolean = false;

  constructor(private apiController: ApiController, private loadingService: LoadingService){
    this.tableData = [
      { td2Img: 'assets/images/emoji1.png', td2Value: 'Yeti#232', td3: '1002', td4: '122.5 ICX', td5: '02/04/2023', td6Value: 'hx35a5.....fb8d5', td7Value: 'hx35a5.....fb8d5' },
      { td2Img: 'assets/images/emoji2.png', td2Value: 'Yeti#291', td3: '1015', td4: '122.5 ICX', td5: '02/04/2023', td6Value: 'hx35a5.....fb8d5', td7Value: 'hx35a5.....fb8d5' },
      { td2Img: 'assets/images/emoji3.png', td2Value: 'Yeti#336', td3: '1019', td4: '122.5 ICX', td5: '02/04/2023', td6Value: 'hx35a5.....fb8d5', td7Value: 'hx35a5.....fb8d5' },
      { td2Img: 'assets/images/emoji4.png', td2Value: 'Yeti#347', td3: '1024', td4: '122.5 ICX', td5: '02/04/2023', td6Value: 'hx35a5.....fb8d5', td7Value: 'hx35a5.....fb8d5' },
      { td2Img: 'assets/images/emoji5.png', td2Value: 'Yeti#361', td3: '1031', td4: '122.5 ICX', td5: '02/04/2023', td6Value: 'hx35a5.....fb8d5', td7Value: 'hx35a5.....fb8d5' },
      { td2Img: 'assets/images/emoji7.png', td2Value: 'Yeti#377', td3: '1044', td4: '122.5 ICX', td5: '02/04/2023', td6Value: 'hx35a5.....fb8d5', td7Value: 'hx35a5.....fb8d5' },
      { td2Img: 'assets/images/emoji1.png', td2Value: 'Yeti#232', td3: '1002', td4: '122.5 ICX', td5: '02/04/2023', td6Value: 'hx35a5.....fb8d5', td7Value: 'hx35a5.....fb8d5' },
      { td2Img: 'assets/images/emoji2.png', td2Value: 'Yeti#291', td3: '1015', td4: '122.5 ICX', td5: '02/04/2023', td6Value: 'hx35a5.....fb8d5', td7Value: 'hx35a5.....fb8d5' },
      { td2Img: 'assets/images/emoji3.png', td2Value: 'Yeti#336', td3: '1019', td4: '122.5 ICX', td5: '02/04/2023', td6Value: 'hx35a5.....fb8d5', td7Value: 'hx35a5.....fb8d5' },
      { td2Img: 'assets/images/emoji4.png', td2Value: 'Yeti#347', td3: '1024', td4: '122.5 ICX', td5: '02/04/2023', td6Value: 'hx35a5.....fb8d5', td7Value: 'hx35a5.....fb8d5' },
    ]
    window.addEventListener('resize', () => {
      this.onResize();
    });
    this.onResize();
  }

  public displayAddress = (address: string) => `${address.slice(0, 9)}...${address.slice(-7)}`;

  async ngOnInit() {
   this.loadYetiMarket();
  }

  async loadYetiMarket() {
    this.loadingService.present();
    const market: Market = await this.apiController.GetMarketActivity(20, this.skip) as Market;
    this.total = market.total;
    this.activity.push(...market.activities);
    this.loadingService.dismiss();
  }

  onResize(){
    if(window.innerWidth < 992){
      this.showSmallSwtich = true;
    }
    else{
      this.showSmallSwtich = false;
    }
  }

  selectedType(type: SwitchType){
    console.log(type);
    this.selectedSwitch = type;
  }


  async loadmore() {
    if(this.selectedSwitch==SwitchType.Yeti) {
      this.page++; 
      if(this.page > 1 ) {
        this.skip = this.skip + 20;
      }
      this.loadYetiMarket();
    }
  }

  switchTable(value: SwitchType){
    console.log(value);
  }

  filtersUpdated(selectedFilters: string[]){
    console.log(selectedFilters);
  }
}
