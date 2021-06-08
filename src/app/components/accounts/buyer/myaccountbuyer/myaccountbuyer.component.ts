import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccountService } from 'src/app/services/account';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';


interface User {
  name: string;
    profileImage:{
        filename: string,
        contentType: string, 
        imageBase64: string
    }
    email: string;
    phoneNumber: string;
    address: string;
    password: string;
    userType: string;
    description: string;
}

@Component({
  selector: 'app-myaccountbuyer',
  templateUrl: './myaccountbuyer.component.html',
  styleUrls: ['./myaccountbuyer.component.css']
})
export class MyaccountbuyerComponent implements OnInit, OnDestroy {
  showEditAccountBuyerModal: boolean = false;
  user:  User;
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
        this.imageSRC = this.user.profileImage?.imageBase64
        //console.log("User image: " + JSON.stringify(this.imageSRC))
    }, (error) => {
        console.log("Error", error)
    })
    )

    //For sidebar menu
    const menu = document.querySelectorAll('.menu-list a');
    const menuContent = document.querySelectorAll('#menu-content > div');

    menu.forEach((m: any) => {
      m.addEventListener('click', () => {
        menu.forEach(item => item.classList.remove('is-active'))
        m.classList.add('is-active');

        const target = m.dataset.target;
        menuContent.forEach( box => {
          console.log(target);
          if (box.getAttribute('id') == target) {
            box.classList.remove('is-hidden');
          } else {
            box.classList.add('is-hidden');
          }
        });
      })
    })
  }

  ngOnDestroy(): void{
    this.subs.forEach(sub => sub.unsubscribe())
  }

  onClickEditAccountBuyer = () => {
    this.accountService.editswitch(true)
    //this.showEditAccountBuyerModal = !this.showEditAccountBuyerModal;
  }
}
