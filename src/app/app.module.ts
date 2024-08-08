import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { YscComponent } from './components/ysc/ysc.component';
import { MintComponent } from './components/mint/mint.component';
import { RankingComponent } from './components/ranking/ranking.component';
import { MarketActivityComponent } from './components/market-activity/market-activity.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { FarmDetailComponent } from './components/application/farm-detail/farm-detail.component';
import { TraitsComponent } from './components/ranking/traits/traits.component';
import { DetailsComponent } from './components/ranking/details/details.component';
import { ApplicationComponent } from './components/application/application.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { Dashboard2Component } from './components/dashboard2/dashboard2.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { ChartComponent } from './components/chart/chart.component';
import { CalculatorModalComponent } from './components/modals/calculator-modal/calculator-modal.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { GenericModalComponent } from './components/modals/generic-modal/generic-modal.component';
import { ConnectWalletComponent } from './components/modals/connect-wallet/connect-wallet.component';
import { BoostBreakdownComponent } from './components/modals/boost-breakdown/boost-breakdown.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToggleSwitchComponent } from './components/toggle-switch/toggle-switch.component';
import { HttpClientModule } from '@angular/common/http';
import { FilterComponent } from './components/filter/filter.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LedgerService } from './services/ledger.service';
import { environment } from './environments/environment';
import { IconContractService } from './services/icon.service';
import { SharedService } from './services/shared.service';
import { StorageService } from './services/storage.service';
import { ToasterService } from './services/toaster.service';
import { ToastrModule } from 'ngx-toastr';
import { ApiController } from './services/api.service';
import { LoadingService } from './services/loading.service';
import { IonicModule } from '@ionic/angular';
import { ClipboardModule } from 'ngx-clipboard';

@NgModule({
  declarations: [
    AppComponent,
    YscComponent,
    MintComponent,
    RankingComponent,
    MarketActivityComponent,
    NavbarComponent,
    FooterComponent,
    FarmDetailComponent,
    TraitsComponent,
    DetailsComponent,
    ApplicationComponent,
    DashboardComponent,
    Dashboard2Component,
    CarouselComponent,
    ChartComponent,
    CalculatorModalComponent,
    GenericModalComponent,
    ConnectWalletComponent,
    BoostBreakdownComponent,
    ToggleSwitchComponent,
    FilterComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    IvyCarouselModule,
    NgApexchartsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ClipboardModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    }),
    IonicModule.forRoot(),
  ],
  providers: [
    { provide: "BASE_API_URL", useValue: environment.apiUrl}, IconContractService, LoadingService, LedgerService, SharedService, StorageService, ToasterService, ApiController],
  bootstrap: [AppComponent]
})
export class AppModule { }
