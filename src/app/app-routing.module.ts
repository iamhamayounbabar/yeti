import { NgModule, inject } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { YscComponent } from './components/ysc/ysc.component';
import { MintComponent } from './components/mint/mint.component';
import { ApplicationComponent } from './components/application/application.component';
import { RankingComponent } from './components/ranking/ranking.component';
import { MarketActivityComponent } from './components/market-activity/market-activity.component';
import { FarmDetailComponent } from './components/application/farm-detail/farm-detail.component';
import { TraitsComponent } from './components/ranking/traits/traits.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'ysc'},
  {path: 'ysc', component: YscComponent},
  {path: 'mint', component: MintComponent},
  {path: 'app', component: ApplicationComponent},
  
  {path: 'farm-detail', component: FarmDetailComponent},
  {path: 'ranking', component: RankingComponent},
  {path: 'traits/:id/:price/:type', component: TraitsComponent},
  {path: 'market-activity', component: MarketActivityComponent},
  {path: '**', redirectTo: 'ysc'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: "enabled" })],
  exports: [RouterModule]
})
export class AppRoutingModule { }