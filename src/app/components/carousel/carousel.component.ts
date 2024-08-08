import { Component } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent {

  images: any = [
    {path: 'assets/images/slide1.png'},
    {path: 'assets/images/slide2.png'},
    {path: 'assets/images/slide3.png'},
    {path: 'assets/images/slide1.png'},
    {path: 'assets/images/slide2.png'},
    {path: 'assets/images/slide3.png'},
    {path: 'assets/images/slide1.png'},
  ]

}
