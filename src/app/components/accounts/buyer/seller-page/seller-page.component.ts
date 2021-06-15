import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AccountService } from 'src/app/services/account';
import { UploadService } from 'src/app/services/upload';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import {AngularFireStorage} from '@angular/fire/storage';

const localAPI = 'http://localhost:3000'

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

interface Portfolio {
  _id?: string;
  artworkname: string;
  description: string;
  images: {
      filename: string,
      contentType: string, 
      imageBase64: string
  }
}
@Component({
  selector: 'app-seller-page',
  templateUrl: './seller-page.component.html',
  styleUrls: ['./seller-page.component.css']
})
export class SellerPageComponent implements OnInit, OnDestroy {
  openImageModal: boolean = false;
  user:  User;
  public imageSRC: any;
  public imageSRC_artwork: any;

  subs: Subscription[] = []

  @Input() portfolioList: Portfolio[] = [];

  constructor(private domSanitizer: DomSanitizer, 
    private accountService: AccountService,
    private uploadService: UploadService) { }

  ngOnInit(): void {
    //getting and displaying the data of the  logged in user by UserId
    this.accountService.getUserdata()
    this.subs.push(this.accountService.user.subscribe((user)=>{
        this.user = user 
        this.imageSRC = this.user.profileImage?.imageBase64
    }, (error) => {
        console.log("Error", error)
      })
    )
    //Getting and displaying portfolio of user
    this.subs.push(
      this.uploadService.getPortfoliodata().subscribe( artwork => {
        this.portfolioList = artwork.data.portfolioArray;
      })
    )
    //For Tabs
    const tabs = document.querySelectorAll('.tabs li');
    const tabContentBoxes = document.querySelectorAll('#tab-content > div');

    tabs.forEach((tab: any) => {
      tab.addEventListener('click', () => {
        tabs.forEach(item => item.classList.remove('is-active'))
        tab.classList.add('is-active');

        const target = tab.dataset.target;
        tabContentBoxes.forEach( box => {
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

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe())
  }

  onClickOpen (item:any, index:any) {
    this.openImageModal = true;
    this.imageSRC_artwork = this.portfolioList[index].images.imageBase64;
  }

  onClickExit () {
    this.openImageModal = false;
    this.imageSRC_artwork = '';

  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: false
  }
}
