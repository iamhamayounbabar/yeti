import { Component } from '@angular/core';

@Component({
  selector: 'app-calculator-modal',
  templateUrl: './calculator-modal.component.html',
  styleUrls: ['./calculator-modal.component.css']
})
export class CalculatorModalComponent {
  showDiv: number = 0; // Variable to control the visibility of the div
  hideDiv: boolean = false; // Variable to control the visibility of the div
  select: number = 0;
  selectedImage1: string = '';
  selectedImage2: string = '';
  selectedImage3: string = '';
  selectedImage4: string = '';

  click(index: number) {
    this.showDiv = 0; // Display the blank box
    this.select = index;
    this.showDiv = index;
    this.hideDiv = !this.hideDiv
  }

  selectIconBox1(index: number) {
    if (index === 0) {
      this.selectedImage1 = 'assets/images/cloud_emoji.svg';
      this.hideDiv = !this.hideDiv;
    } else if (index === 1) {
      this.selectedImage1 = 'assets/images/ice_emoji.svg';
      this.hideDiv = !this.hideDiv;
    } else if (index === 2) {
      this.selectedImage1 = 'assets/images/snow_emoji.svg';
      this.hideDiv = !this.hideDiv;
    } else if (index === 3) {
      this.selectedImage1 = 'assets/images/water_emoji.svg';
      this.hideDiv = !this.hideDiv;
    }
  }

  selectIconBox2(index: number) {
    if (index === 0) {
      this.selectedImage2 = 'assets/images/cloud_emoji.svg';
      this.hideDiv = !this.hideDiv;
    } else if (index === 1) {
      this.selectedImage2 = 'assets/images/ice_emoji.svg';
      this.hideDiv = !this.hideDiv;
    } else if (index === 2) {
      this.selectedImage2 = 'assets/images/snow_emoji.svg';
      this.hideDiv = !this.hideDiv;
    } else if (index === 3) {
      this.selectedImage2 = 'assets/images/water_emoji.svg';
      this.hideDiv = !this.hideDiv;
    }
  }

  selectIconBox3(index: number) {
    if (index === 0) {
      this.selectedImage3 = 'assets/images/cloud_emoji.svg';
      this.hideDiv = !this.hideDiv;
    } else if (index === 1) {
      this.selectedImage3 = 'assets/images/ice_emoji.svg';
      this.hideDiv = !this.hideDiv;
    } else if (index === 2) {
      this.selectedImage3 = 'assets/images/snow_emoji.svg';
      this.hideDiv = !this.hideDiv;
    } else if (index === 3) {
      this.selectedImage3 = 'assets/images/water_emoji.svg';
      this.hideDiv = !this.hideDiv;
    }
  }

  selectIconBox4(index: number) {
    if (index === 0) {
      this.selectedImage4 = 'assets/images/cloud_emoji.svg';
      this.hideDiv = !this.hideDiv;
    } else if (index === 1) {
      this.selectedImage4 = 'assets/images/ice_emoji.svg';
      this.hideDiv = !this.hideDiv;
    } else if (index === 2) {
      this.selectedImage4 = 'assets/images/snow_emoji.svg';
      this.hideDiv = !this.hideDiv;
    } else if (index === 3) {
      this.selectedImage4 = 'assets/images/water_emoji.svg';
      this.hideDiv = !this.hideDiv;
    }
  }

  getDivStyle(selected: boolean) {
    if (selected) {
      return {
        'border': '1px dashed #FF54C7',
        'box-shadow': '0px 0px 25px rgba(255, 84, 199, 0.25)',
      };
    } else {
      return {
        'border': '1px dashed #FF54C740',
      };
    }
  }

}
