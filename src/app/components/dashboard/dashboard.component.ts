import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  @Input()
  selectedFarmName: string | undefined;
  show_up_icon: boolean = true;

 toggleIcons() {
  this.show_up_icon = !this.show_up_icon;
  }

  constructor() {
    
  }
}
