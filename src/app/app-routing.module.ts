import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterLoadingComponent } from './components/register-loading/register-loading.component';
import { NoPageFoundComponent } from './components/no-page-found/no-page-found.component';
import { LoadingComponent } from './components/loading/loading.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ContactComponent } from '../app/components/contact/contact.component';
import { LoginComponent } from '../app/components/login/login.component';

const routes: Routes = [
    {path:'registerLoad', component: RegisterLoadingComponent},
    { path: '', redirectTo: '/welcome', pathMatch: 'full'},
    { path: 'welcome', component: WelcomeComponent},
  //{ path: 'login', component: LoginComponent},
    { path: 'loading', component: LoadingComponent},
    {path:'**', component: NoPageFoundComponent}
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [RegisterLoadingComponent, NoPageFoundComponent]