import { Component, OnInit, OnDestroy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Subject, BehaviorSubject } from 'rxjs';
import { MarketService } from 'src/app/services/market';
import { CartService } from 'src/app/services/cart';
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

  prod_item:  product
  prod_stock: any
  subs : Subscription[] = []
  image_list :any[] = []

  constructor(
    private route:ActivatedRoute,
    private marketserv: MarketService,
    private cartServ: CartService,
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
    console.log("id: " + JSON.stringify(prod._id))
    this.cartServ.addtoCart(prod._id)
  }
}
