import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { FooterComponent } from './components/footer/footer.component';
import { ContactComponent } from './components/contact/contact.component';
import { HeaderbuyerComponent } from './components/headerbuyer/headerbuyer.component';
import { HeadersellerComponent } from './components/headerseller/headerseller.component';
import { MyaccountbuyerComponent } from './components/myaccountbuyer/myaccountbuyer.component';
import { MyaccountsellerComponent } from './components/myaccountseller/myaccountseller.component';
import { LoginComponent } from './components/login/login.component';
import { LoadingComponent } from './components/loading/loading.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { PortfolioArtworkComponent } from './components/portfolio-artwork/portfolio-artwork.component';
import { DeletemodalComponent } from './components/deletemodal/deletemodal.component';


@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    FooterComponent,
    ContactComponent,
    MyaccountbuyerComponent,
    MyaccountsellerComponent,
    HeaderbuyerComponent,
    HeadersellerComponent,
    LoginComponent,
    LoadingComponent,
    PortfolioComponent,
    PortfolioArtworkComponent,
    DeletemodalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
  

  ],
  exports:[
    WelcomeComponent,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
