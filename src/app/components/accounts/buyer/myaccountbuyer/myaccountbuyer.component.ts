import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-myaccountbuyer',
  templateUrl: './myaccountbuyer.component.html',
  styleUrls: ['./myaccountbuyer.component.css']
})
export class MyaccountbuyerComponent implements OnInit {
  showEditAccountBuyerModal: boolean = false;
  user:  any;
  public imageSRC: any ;
  userID: string = '607fe491958fa65f08f14d0e';

  constructor(
    private domSanitizer: DomSanitizer,
    private accountService: AccountService) { }

  ngOnInit(): void {
    this.accountService.getUserdata()
    this.accountService.user.subscribe((user)=>{
        this.user = user 
        this.imageSRC = this.domSanitizer.bypassSecurityTrustUrl(this.user.profileImage?.imageBase64)
        //console.log("User image: " + JSON.stringify(this.imageSRC))
    }, (error) => {
        console.log("Error", error)
    })
    
  }

  onClickEditAccountBuyer = () => {
    
    this.showEditAccountBuyerModal = !this.showEditAccountBuyerModal;
    
    
  }
}
