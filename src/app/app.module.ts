import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { FooterComponent } from './components/footer/footer.component';
import { ContactComponent } from './components/contact/contact.component';
import {AngularFireStorageModule} from '@angular/fire/storage'
import {AngularFireModule} from '@angular/fire'
import { UploadService } from './services/upload';
import { CommissionComponent } from './components/commission/commission.component';
import { CommissionItemComponent } from './components/commission-item/commission-item.component';
@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    FooterComponent,
    ContactComponent,
    routingComponents,
    CommissionComponent,
    CommissionItemComponent

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

