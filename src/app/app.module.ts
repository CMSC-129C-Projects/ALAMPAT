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
import { UploadService } from './services/upload';

import {AngularFireStorageModule} from '@angular/fire/storage'
import {AngularFireModule} from '@angular/fire'

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
    PortfolioArtworkComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyAYsXEKw9iqkrLxKgItK3_BxS94pWyLY9I",
      authDomain: "alampat-59bb8.firebaseapp.com",
      projectId: "alampat-59bb8",
      storageBucket: "alampat-59bb8.appspot.com",
      messagingSenderId: "42190675269",
      appId: "1:42190675269:web:4d4f246a30fb3b380df22c",
      measurementId: "G-M7VWRJ4WN7"
    }),
    AngularFireStorageModule

  ],
  exports:[
    WelcomeComponent,
    
  ],
  providers: [UploadService],
  bootstrap: [AppComponent]
})
export class AppModule { }
