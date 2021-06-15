import { Component, OnInit, OnDestroy, Input} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Subject, BehaviorSubject } from 'rxjs';
import { MarketService } from 'src/app/services/market';
import { ReservationService } from 'src/app/services/reservation';
interface product {
  _id: string;
  itemname:string;
  description: string;
  //stock?: number;
  stock?: number;
  price: number;
  images: [{
    filename: string;
    contentType: string;
    imageBase64: string;
  }];
  category:string;
  sellername?: string;
  profileImage: string;
}
@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit, OnDestroy{
  @Input() openSuccessModal: boolean;
  
  prod_item:  product
  prod_stock: any
  subs : Subscription[] = []
  image_list :any[] = []
  imageSRC: string;
  openImageModal: boolean = false;

  constructor(
    private route:ActivatedRoute,
    private marketserv: MarketService,
    private cartServ: ReservationService,
    private router: Router,
  ) {
    
    //this.copy = new BehaviorSubject<any>('')
   }

  ngOnInit(): void {
    const com_id = this.route.snapshot.paramMap.get('id');
    //this.slide_len = "i"
    //console.log("Item : " + JSON.stringify(com_id))
    this.marketserv.getProduct(com_id)
    
    this.subs.push(this.marketserv.getproduct().subscribe((prod:product)=>{
      this.prod_item = prod
      this.prod_stock = prod.stock
      this.image_list = prod.images
      //var len = com.images.length
      //this.slide_len = this.slide_len + String(len)
      //this.slide_len.concat(String(this.comm_item.images.length))
      //\console.log("Item : " + JSON.stringify(this.comm_item))
      //this.copy.next(com)
    })
    )
  }


  ngOnDestroy():void{
    this.subs.forEach((x)=> x.unsubscribe())
  }

  addtoCart(prod: any){
    this.openSuccessModal = true;
    console.log("id: " + JSON.stringify(prod._id))
    this.cartServ.addtoCart(prod._id)
  }
  onClickOpen (index: any) {
    this.openImageModal = true;
    this.imageSRC = this.image_list[index].imageBase64;
  }

  onClickExit () {
      this.openImageModal = false;
      this.imageSRC = '';

      if(this.openSuccessModal) {
        this.openSuccessModal = false;
      }
  }

  ViewSeller(item:  any){ 
    this.subs.forEach((x)=> x.unsubscribe())
    console.log(item.seller_id)
    this.router.navigate(['/seller/'], {queryParams: { id: item.seller_id}} )
  }
}
