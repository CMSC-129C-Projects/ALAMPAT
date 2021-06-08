import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router';

import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire';

import { NgxPaginationModule } from 'ngx-pagination'

import { UploadService } from './services/upload';
import { AccountService } from './services/account';
import { ProductService } from './services/productServ';
import { UserService } from './services/auth';
import { MarketService } from './services/market';
import { ReservationService } from './services/reservation';
import { AuthGuard } from './auth.guard';

import { AppComponent } from './app.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { FooterComponent } from './components/footer/footer.component';
import { ContactComponent } from './components/contact/contact.component';
import { MyaccountbuyerComponent } from './components/accounts/buyer/myaccountbuyer/myaccountbuyer.component';
import { MyaccountsellerComponent } from './components/accounts/seller/myaccountseller/myaccountseller.component';
import { HeaderbuyerComponent } from './components/accounts/buyer/headerbuyer/headerbuyer.component';
import { HeadersellerComponent } from './components/accounts/seller/headerseller/headerseller.component';
import { EditaccountbuyerComponent } from './components/accounts/buyer/editaccountbuyer/editaccountbuyer.component';
import { EditaccountsellerComponent } from './components/accounts/seller/editaccountseller/editaccountseller.component';
import { PortfolioComponent } from './components/accounts/seller/portfolios/portfolio/portfolio.component';
import { PortfolioArtworkComponent } from './components/accounts/seller/portfolios/portfolio-artwork/portfolio-artwork.component';
import { ProductsComponent } from './components/accounts/seller/product/products/products.component';
import { AddProductComponent } from './components/accounts/seller/product/add-product/add-product.component';
import { ViewcommissionComponent } from './components/viewcommission/viewcommission.component';
import { MarketplaceComponent } from './components/marketplace/marketplace.component'
import { SellershopComponent } from './components/accounts/seller/sellershop/sellershop.component';

import { CommissionComponent } from './components/accounts/seller/commissions/commission/commission.component';
import { CommissionItemComponent } from './components/accounts/seller/commissions/commission-item/commission-item.component';
import { ViewProductComponent } from './components/accounts/buyer/view-product/view-product.component';
import { ReservationsComponent } from './components/accounts/buyer/reservations/reservations.component';

import { OrderbuyerComponent } from './components/accounts/buyer/orderbuyer/orderbuyer.component';
import { OrderdetailsbuyerComponent } from './components/accounts/buyer/orderdetailsbuyer/orderdetailsbuyer.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    FooterComponent,
    ContactComponent,
    routingComponents,
    MarketplaceComponent,
    ViewcommissionComponent,
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
    SellershopComponent,
    CommissionComponent,
    CommissionItemComponent,
    ViewProductComponent,
    ReservationsComponent,
    OrderbuyerComponent,
    OrderdetailsbuyerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
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
    NgxPaginationModule,
    RouterModule.forRoot([]),

  ],
  exports: [
    WelcomeComponent,
    
  ],
  providers: [
    UserService,
    UploadService,
    AccountService,
    ProductService,
    AuthGuard,
    MarketService,
    ReservationService,
  
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

