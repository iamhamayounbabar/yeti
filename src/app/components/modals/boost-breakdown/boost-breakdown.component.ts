import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-boost-breakdown',
  templateUrl: './boost-breakdown.component.html',
  styleUrls: ['./boost-breakdown.component.css']
})
export class BoostBreakdownComponent {
  @Input() id: string ;
}
