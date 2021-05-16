import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterLoadingComponent } from './components/register-loading/register-loading.component';
import { NoPageFoundComponent } from './components/no-page-found/no-page-found.component';

import { PortfolioArtworkComponent } from './components/portfolio-artwork/portfolio-artwork.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { HeaderbuyerComponent } from './components/headerbuyer/headerbuyer.component';
import { HeadersellerComponent } from './components/headerseller/headerseller.component';
import { MyaccountbuyerComponent } from './components/myaccountbuyer/myaccountbuyer.component';
import { MyaccountsellerComponent } from './components/myaccountseller/myaccountseller.component';
import { LoginComponent } from './components/login/login.component'
import { UploadService } from './services/upload';

const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'registration-confirmed', component: RegisterLoadingComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'my-accounts-seller', component: MyaccountsellerComponent },
  { path: 'my-accounts-buyer', component: MyaccountbuyerComponent },
  { path: '**', component: NoPageFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }

export const routingComponents = [
  PortfolioArtworkComponent,
  ContactComponent,
  PortfolioComponent,
  RegisterLoadingComponent,
  NoPageFoundComponent,
  HeaderbuyerComponent,
  HeadersellerComponent,
  MyaccountbuyerComponent,
  MyaccountsellerComponent,
  LoginComponent,
  UploadService
]