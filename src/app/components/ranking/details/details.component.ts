import { Component } from '@angular/core';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent {


  history: any = [
    {img: 'assets/images/emoji1.png', id:'hxfkkd.....323', detail: 'put 1 unit on sale 3 hrs ago', icon:'...'},
    {img: 'assets/images/emoji2.png', id:'hxfkkd.....323', detail: 'put 1 unit for 100 ICX 2 months ago', icon:'...'},
    {img: 'assets/images/emoji3.png', id:'hxfkkd.....323', detail: 'put 1 unit on sale 3 hrs ago', icon:'...'},
    {img: 'assets/images/emoji4.png', id:'hxfkkd.....323', detail: 'put 1 unit for 100 ICX 2 months ago', icon:'...'},
  ]

  offers: any = [
    {price: '40 ICX', offerby: 'Wafkkdodsppdfs3p3ik32pinpnpip1889'},
    {price: '38 ICX', offerby: 'hxfkkdodsppdZs3p3ik32pinpnpip3323'},
    {price: '35 ICX', offerby: 'OxfkkdodsppdXs3p3ik32pinpnpip3110'},
    {price: '32 ICX', offerby: 'hxfkkdodsppdfs3p3ik32pinpnpip3323'},
  ]

}
