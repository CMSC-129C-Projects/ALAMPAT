import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { ReservationService } from 'src/app/services/reservation';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Url, UrlObject } from 'url';
interface reservation {
  _id: string;
  service: {
    images:{
      filename: string,
      contentType: string, 
      imageBase64: string
    }
    _id: string, 
    commissionname: string,
    price: number,
    days: number,
    terms: string
  }
  seller:{
    _id: string,
    name: string,
  }
  buyer:{
    _id: string,
    name: string,
  }
  form?: string,
  totalAmount?: number,
  reservationStatus: string,
}
@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit, OnDestroy{
  // @Input() openReservationModal: boolean;
  showReservation: boolean = false;
  
  totalAmount= 0;
  form: any;
  reserv_List: reservation[] = []

  reservation: reservation
 
  subs: Subscription[] = []

  constructor(
    private reserv: ReservationService,
    private router: Router,
  ) {
    this.showReservation = false;
    this.setreservation()
  }

  ngOnInit(): void {
    this.subscribeReserveList()
    console.log(this.form)

  }
  
  setreservation(){
    this.reservation = {
      _id: '',
      service: {
        images:{
          filename: "",
          contentType: "", 
          imageBase64: ""
        },
        _id: "", 
        commissionname: "",
        price: 0,
        days: 0,
        terms: ''
      },
      seller:{
        _id: "",
        name: "",
      },
      buyer: {
        _id: "",
        name: "",
      },
      form: '',
      totalAmount: 0,
      reservationStatus: "",
    }
  }

  ngOnDestroy(){
    this.subs.forEach(x => x.unsubscribe())
  }

  

  subscribeReserveList(){
    this.subs.push(
      this.reserv.getReservationList().subscribe((reservs: any)=>{
        this.reserv_List = reservs.data.reservationsArray
      })
    )
  }
  
  onClickInfo = (item_id:string) => {
    this.subs.forEach(x => x.unsubscribe())
    
    this.subscribeReserv(item_id)
    this.showReservation = !this.showReservation;
  }

  subscribeReserv(item_id:string){
    this.subs.push(
      this.reserv.getReservation(item_id).subscribe( reserv => {
        this.reservation = reserv.data.reserv_data
        if( reserv.data.reserv_data.totalAmount > 0) { 
          this.totalAmount = reserv.data.reserv_data.totalAmount
        }
        if( reserv.data.reserv_data.form != ""){
          this.form = reserv.data.reserv_data.form
        }

      })
    )
  }

  onCancellation(reserv_id: string){
    this.reserv.cancelReservation(reserv_id)
    this.subs.forEach(x => x.unsubscribe())
    
    setTimeout(() =>{
      this.subscribeReserv(reserv_id)
      this.subscribeReserveList()
    }, 500)
    
  }

  onRemoval(reserve_id: string){
    this.reserv.deleteReservation(reserve_id)
    this.onClickExit()
  }

  onCheckout(reserv_id: string){
    this.router.navigate(['/checkout/'], { queryParams: { id: reserv_id} })
  }
  onClickExit = () => {
    this.subs.forEach(x => x.unsubscribe())
    this.subscribeReserveList()
    this.setreservation()
    if(this.showReservation) {
      this.showReservation = false;
    }
  }
}
