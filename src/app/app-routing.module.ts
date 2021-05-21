import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoPageFoundComponent } from './components/no-page-found/no-page-found.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { HeaderbuyerComponent } from './components/accounts/buyer/headerbuyer/headerbuyer.component';
import { HeadersellerComponent } from './components/accounts/seller/headerseller/headerseller.component';
import { MyaccountbuyerComponent } from './components/accounts/buyer/myaccountbuyer/myaccountbuyer.component';
import { MyaccountsellerComponent } from './components/accounts/seller/myaccountseller/myaccountseller.component';
import { ProductsComponent } from './components/accounts/seller/products/products.component';
import { LoginComponent } from './components/login/login.component';
import { AddProductComponent } from './components/accounts/seller/add-product/add-product.component';
import { AuthGuard } from './auth.guard';
import { SellershopComponent } from './components/sellershop/sellershop.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';

const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'my-accounts-seller', component: MyaccountsellerComponent, canActivate: [AuthGuard] },
  { path: 'my-accounts-buyer', component: MyaccountbuyerComponent, canActivate: [AuthGuard] },
  { path: 'seller-shop', component: SellershopComponent, canActivate: [AuthGuard]  },
  { path: 'seller-portfolio', component: PortfolioComponent, canActivate: [AuthGuard]  },
  //{ path: 'seller-commission', component: ProductsComponent, canActivate: [AuthGuard]  },
  { path: 'seller-products', component: ProductsComponent, canActivate: [AuthGuard]  },
  { path: 'notfound', component: NoPageFoundComponent},
  { path: '**', redirectTo:'notfound' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }

export const routingComponents = [
  NoPageFoundComponent,
  HeaderbuyerComponent,
  HeadersellerComponent,
  MyaccountbuyerComponent,
  MyaccountsellerComponent,
  LoginComponent,
  ProductsComponent,
  AddProductComponent
]