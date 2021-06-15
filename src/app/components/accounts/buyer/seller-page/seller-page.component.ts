import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AccountService } from 'src/app/services/account';
import { UploadService } from 'src/app/services/upload';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/productServ';
import { CommissionService } from 'src/app/services/comService';
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

  seller_id: string
  subs: Subscription[] = []

  @Input() portfolioList: Portfolio[] = [];

  commissionList: any
  productList: any

  constructor(
      private router: Router,
      private route: ActivatedRoute, 
      private accountService: AccountService,
      private uploadService: UploadService,
      private productserv: ProductService,
      private commserv: CommissionService,
    ) { }

  ngOnInit(): void {

    this.route.queryParams
      .subscribe(params => {
        this.seller_id = params.id
      })

    //getting and displaying the data of the  seller by UserId
    this.subs.push(this.accountService.getUserdata_SP(this.seller_id).subscribe((user)=>{
        this.user = user.data.userData
        this.imageSRC = this.user.profileImage?.imageBase64
    }, (error) => {
        console.log("Error", error)
      })
    )

    //Getting and displaying portfolio of seller
    this.subs.push(
      this.uploadService.getPortfolio_SP(this.seller_id).subscribe( artwork => {
        this.portfolioList = artwork.data.portfolioArray;
      })
    )
    
    //Getting and displaying commissions  listof seller
    this.subs.push(
      this.commserv.getItemdata_SP(this.seller_id).subscribe( commlist => {
        this.commissionList = commlist.data.commissionsArray;
        console.log("Comms: " + JSON.stringify(commlist.data.commissionsArray))
      })
    )
    
    //Getting and displaying product list  of seller
    this.subs.push(
      this.productserv.getProductdata_SP(this.seller_id).subscribe( prodlist => {
        this.productList = prodlist.data.productsArray;
        console.log("Products: " + JSON.stringify(prodlist.data.productsArray))
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
