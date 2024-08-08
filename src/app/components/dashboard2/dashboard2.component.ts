import { Component, Input } from '@angular/core';
import { SwitchType } from 'src/app/enums/switch-type.enum';
import { ApiController } from 'src/app/services/api.service';
import { YetiMarketStats } from 'src/app/entities/yetiMarketStats';


@Component({
  selector: 'app-dashboard2',
  templateUrl: './dashboard2.component.html',
  styleUrls: ['./dashboard2.component.css']
})
export class Dashboard2Component {
  @Input()
  selectedSwitchType: SwitchType = SwitchType.Yeti;
  switchType = SwitchType;
  yetiMarketStats: YetiMarketStats;


  farm_dashboard: any =[
    {img: 'assets/images/Cloud Nine.png', title: 'Cloud Nine', text: 'Floor price', value: '122', icon:'assets/images/calque_2.png'},
    {img: 'assets/images/Arctic Glacier.jpg', title: 'Arctic Glacier', text: 'Floor price', value: '50', icon:'assets/images/calque_2.png'},
    {img: 'assets/images/Frosty Peak.png', title: 'Frosty Peak', text: 'Floor price', value: '42', icon:'assets/images/calque_2.png'},
  ]

  constructor(private apiController: ApiController)
  { 
  }

  async ngOnChanges() {
    this.marketStats();
  }

  async marketStats() {
    if(this.selectedSwitchType == SwitchType.Yeti) {
     this.yetiMarketStats = await this.apiController.GetYetiStats() as YetiMarketStats;
     //console.log(this.yetiMarketStats[0])
    }


  }
}
