import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SwitchType } from 'src/app/enums/switch-type.enum';

@Component({
  selector: 'app-toggle-switch',
  templateUrl: './toggle-switch.component.html',
  styleUrls: ['./toggle-switch.component.css']
})
export class ToggleSwitchComponent {
  @Output() callback: EventEmitter<SwitchType> = new EventEmitter<SwitchType>();
  switchType = SwitchType;

  selected(type: SwitchType){
    this.callback.emit(type);
  }
}
