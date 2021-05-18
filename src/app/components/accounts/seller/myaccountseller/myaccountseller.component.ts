import { Component, OnInit, Output } from '@angular/core';
import axios from 'axios'
import { AccountService } from 'src/app/services/account';

import { DomSanitizer } from '@angular/platform-browser';

const localAPI = 'http://localhost:3000'

@Component({
  selector: 'app-myaccountseller',
  templateUrl: './myaccountseller.component.html',
  styleUrls: ['./myaccountseller.component.css']
})

export class MyaccountsellerComponent implements OnInit {
  showEditAccountSellerModal: boolean = false;
  user:  any;
  public imageSRC: any;
  userID: string = '607fe491958fa65f08f14d0e';
  
  constructor(
    private domSanitizer: DomSanitizer, 
    private accountService: AccountService) { }

  ngOnInit(): void {
    //getting and displaying the data of the  logged in user by UserId
    this.accountService.getUserdata()
    this.accountService.user.subscribe((user)=>{
        this.user = user 
        this.imageSRC = this.domSanitizer.bypassSecurityTrustUrl(this.user.profileImage?.imageBase64)
        //console.log("User image: " + JSON.stringify(this.imageSRC))
    }, (error) => {
        console.log("Error", error)
    })
 
   
  }

  onClickEditAccountSeller = () => {
    this.showEditAccountSellerModal = !this.showEditAccountSellerModal;
  }
}
