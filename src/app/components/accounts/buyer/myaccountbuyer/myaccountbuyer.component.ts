import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccountService } from 'src/app/services/account';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-myaccountbuyer',
  templateUrl: './myaccountbuyer.component.html',
  styleUrls: ['./myaccountbuyer.component.css']
})
export class MyaccountbuyerComponent implements OnInit, OnDestroy {
  showEditAccountBuyerModal: boolean = false;
  user:  any;
  public imageSRC: any ;
  userID: string = '607fe491958fa65f08f14d0e';

  subs: Subscription[] = []

  constructor(
    private domSanitizer: DomSanitizer,
    private accountService: AccountService){
      this.subs.push(
        this.accountService.showEdit.subscribe((x)=>{
          this.showEditAccountBuyerModal = x
        }
        )
      )
     }

  ngOnInit(): void {
    this.accountService.getUserdata()
    this.subs.push(this.accountService.user.subscribe((user)=>{
        this.user = user 
        this.imageSRC = this.domSanitizer.bypassSecurityTrustUrl(this.user.profileImage?.imageBase64)
        //console.log("User image: " + JSON.stringify(this.imageSRC))
    }, (error) => {
        console.log("Error", error)
    })
    )
  }

  ngOnDestroy(): void{
    this.subs.forEach(sub => sub.unsubscribe())
  }

  onClickEditAccountBuyer = () => {
    this.accountService.editswitch(true)
    //this.showEditAccountBuyerModal = !this.showEditAccountBuyerModal;
  }
}
