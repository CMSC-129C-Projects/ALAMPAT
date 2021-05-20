import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule, routingComponents } from './app-routing.module';

import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire';

import { UploadService } from './services/upload';
import { AccountService } from './services/account';
import { ProductService } from './services/productServ';
import { UserService } from './services/auth';

import { AuthGuard } from './auth.guard';

import { AppComponent } from './app.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { FooterComponent } from './components/footer/footer.component';
import { ContactComponent } from './components/contact/contact.component';
import { MyaccountbuyerComponent } from './components/accounts/buyer/myaccountbuyer/myaccountbuyer.component';
import { MyaccountsellerComponent } from './components/accounts/seller/myaccountseller/myaccountseller.component';
import { HeaderbuyerComponent } from './components/accounts/buyer/headerbuyer/headerbuyer.component';
import { HeadersellerComponent } from './components/accounts/seller/headerseller/headerseller.component';
import { EditaccountbuyerComponent } from './components/editaccountbuyer/editaccountbuyer.component';
import { EditaccountsellerComponent } from './components/editaccountseller/editaccountseller.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { PortfolioArtworkComponent } from './components/portfolio-artwork/portfolio-artwork.component';
import { ProductsComponent } from './components/accounts/seller/products/products.component';
import { AddProductComponent } from './components/accounts/seller/add-product/add-product.component';


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
    EditaccountbuyerComponent,
    EditaccountsellerComponent,
    PortfolioComponent,
    PortfolioArtworkComponent,
    ProductsComponent,
    AddProductComponent,
    routingComponents,
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
    AngularFireStorageModule,

  ],
  exports: [
    WelcomeComponent,
    
  ],
  providers: [
    UserService,
    UploadService,
    AccountService,
    AuthGuard
  
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

