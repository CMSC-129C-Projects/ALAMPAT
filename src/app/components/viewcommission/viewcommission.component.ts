import { Component, OnInit, OnDestroy, Input} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Subject, BehaviorSubject } from 'rxjs';
import { MarketService } from 'src/app/services/market';
import { ReservationService } from 'src/app/services/reservation';
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
  @Input() openSuccessModal: boolean;

  comm_item:  commission
  comm_slot: any;
  subs : Subscription[] = []
  image_list :any[] = []
  slide_len: any ;
  copy: BehaviorSubject<any> 
  imageSRC: string;
  openImageModal: boolean = false;

  constructor(
    private route:ActivatedRoute,
    private marketserv: MarketService,
    private resServ: ReservationService,
  ) {
    
    this.copy = new BehaviorSubject<any>('')
   }

  ngOnInit(): void {
    const com_id = this.route.snapshot.paramMap.get('id');
    this.slide_len = "i"
    this.marketserv.getCommission(com_id)
    this.subs.push(this.marketserv.getcommission().subscribe((com:commission)=>{
      this.comm_item = com
      this.comm_slot = com.slot
      this.image_list = com.images
      this.slide_len.concat(String(this.comm_item.images.length))
      this.copy.next(com)
    })
    )
    this.slide_len.concat(String(this.copy.value.images.length))
    console.log("slide  : " + JSON.stringify(this.slide_len))
  }

  ngOnDestroy(): void{
    this.subs.forEach((x)=> x.unsubscribe())
  }
  addReservation(comm: any){
    this.openSuccessModal = true;

    console.log("id: " + JSON.stringify(comm))
    let reservation = {
      service_id: comm._id,
      
      reservationstatus: "Waiting for Approval",
    }

    this.resServ.addReservation(reservation)
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
}
