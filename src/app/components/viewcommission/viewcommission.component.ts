import { Component, OnInit, OnDestroy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Subject, BehaviorSubject } from 'rxjs';
import { MarketService } from 'src/app/services/market';
import { CartService } from 'src/app/services/cart';
interface commission {
  _id?: string;
  itemname:string;
  description: string;
  //stock?: number;
  slot?: number;
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
  selector: 'app-viewcommission',
  templateUrl: './viewcommission.component.html',
  styleUrls: ['./viewcommission.component.css']
})
export class ViewcommissionComponent implements OnInit, OnDestroy {

  comm_item:  commission
  subs : Subscription[] = []
  image_list :any[] = []
  slide_len: any ;
  copy: BehaviorSubject<any> 
  constructor(
    private route:ActivatedRoute,
    private marketserv: MarketService,
    private cartServ: CartService,
  ) {
    
    this.copy = new BehaviorSubject<any>('')
   }

  ngOnInit(): void {
    const com_id = this.route.snapshot.paramMap.get('id');
    this.slide_len = "i"
    //console.log("Item : " + JSON.stringify(com_id))
    this.marketserv.getCommission(com_id)
    this.subs.push(this.marketserv.getcommission().subscribe((com:commission)=>{
      this.comm_item = com
      this.image_list = com.images
      //var len = com.images.length
      //this.slide_len = this.slide_len + String(len)
      this.slide_len.concat(String(this.comm_item.images.length))
      //\console.log("Item : " + JSON.stringify(this.comm_item))
      this.copy.next(com)
    })
    )
    this.slide_len.concat(String(this.copy.value.images.length))
    console.log("slide  : " + JSON.stringify(this.slide_len))
  }

  ngOnDestroy(): void{
    
    
    //this.marketserv.editReload(false)
    this.subs.forEach((x)=> x.unsubscribe())
  }
  addReservation(prod: any){
    console.log("id: " + JSON.stringify(prod._id))
    this.cartServ.addReservation(prod._id)
  }
}
