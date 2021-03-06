import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoPageFoundComponent } from './components/no-page-found/no-page-found.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { UploadService } from './services/upload';
import { ViewcommissionComponent } from './components/viewcommission/viewcommission.component';
import { MarketplaceComponent } from './components/marketplace/marketplace.component'

import { HeaderbuyerComponent } from './components/accounts/buyer/headerbuyer/headerbuyer.component';
import { HeadersellerComponent } from './components/accounts/seller/headerseller/headerseller.component';
import { MyaccountbuyerComponent } from './components/accounts/buyer/myaccountbuyer/myaccountbuyer.component';
import { MyaccountsellerComponent } from './components/accounts/seller/myaccountseller/myaccountseller.component';
import { ProductsComponent } from './components/accounts/seller/product/products/products.component';
import { LoginComponent } from './components/login/login.component';
import { AddProductComponent } from './components/accounts/seller/product/add-product/add-product.component';
import { PortfolioComponent } from './components/accounts/seller/portfolios/portfolio/portfolio.component';
import { PortfolioArtworkComponent } from './components/accounts/seller/portfolios/portfolio-artwork/portfolio-artwork.component';
import { AuthGuard } from './auth.guard';
import { SellershopComponent } from './components/accounts/seller/sellershop/sellershop.component';
import { CommissionComponent } from './components/accounts/seller/commissions/commission/commission.component';

import { ViewProductComponent } from './components/accounts/buyer/view-product/view-product.component';
import { ReservationsComponent } from './components/accounts/buyer/reservations/reservations.component';
import { CheckoutComponent } from './components/accounts/buyer/checkout/checkout.component';
import { ReservationSellerComponent } from './components/accounts/seller/reservation-seller/reservation-seller.component';
import { AboutusComponent } from './aboutus/aboutus.component';

const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'my-accounts-seller', component: MyaccountsellerComponent, canActivate: [AuthGuard] },
  { path: 'my-accounts-buyer', component: MyaccountbuyerComponent, canActivate: [AuthGuard] },
  { path: 'seller-shop', component: SellershopComponent, canActivate: [AuthGuard]  },
  { path: 'seller-portfolio', component: PortfolioComponent, canActivate: [AuthGuard]  },
  { path: 'seller-commission', component: CommissionComponent, canActivate: [AuthGuard]  },
  { path: 'seller-products', component: ProductsComponent, canActivate: [AuthGuard]  },
  { path: 'view-reservations', component: ReservationsComponent, canActivate: [AuthGuard] },
  { path: 'buyer-productview', component: ViewProductComponent, canActivate:[AuthGuard] }, 
  { path: 'marketplace', component: MarketplaceComponent },
  { path: 'commission-item', component: ViewcommissionComponent },
  { path: 'checkout', component: CheckoutComponent, canActivate:[AuthGuard]},
  { path: 'reservation', component: ReservationsComponent, canActivate:[AuthGuard]},
  { path: 'reservation-seller', component: ReservationSellerComponent, canActivate:[AuthGuard]},
  { path: 'product-item', component: ViewProductComponent },
  { path: 'notfound', component: NoPageFoundComponent},
  { path: 'about-us', component: AboutusComponent },
  { path: '**', redirectTo:'notfound' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})

export class AppRoutingModule { }

export const routingComponents = [
  PortfolioComponent,
  PortfolioArtworkComponent,
  NoPageFoundComponent,
  HeaderbuyerComponent,
  HeadersellerComponent,
  MyaccountbuyerComponent,
  MyaccountsellerComponent,
  LoginComponent,
  ProductsComponent,
  AddProductComponent,
  ReservationsComponent,
  ReservationSellerComponent,
  CheckoutComponent,
  AboutusComponent
]