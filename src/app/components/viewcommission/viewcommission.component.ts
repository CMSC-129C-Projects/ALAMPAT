import { Component, OnInit, OnDestroy, Input} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Subject, BehaviorSubject } from 'rxjs';
import { MarketService } from 'src/app/services/market';
import { ReservationService } from 'src/app/services/reservation';
import {Location} from '@angular/common';

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
  seller_id?: string;
  profileImage: string;
}

interface User {
  _id?: string;
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
    private router: Router,
    private _location: Location,
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
      this.comm_slot = com.slot
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

  goBack(){
    this._location.back();
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

  ViewSeller(item:  any){ //how dis
    //const _id = seller ? seller._id : null;
    this.subs.forEach((x)=> x.unsubscribe())
    console.log(item.seller_id)
    this.router.navigate(['/seller/'], {queryParams: { id: item.seller_id}} )
  }
}
