import { Component, OnChanges, OnInit, Input } from '@angular/core';
import { ReservationService } from 'src/app/services/reservation';
import { Subscription } from 'rxjs';

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
    price: number
  }
  seller:{
    _id: string,
    name: string,
  }
  buyer:{
    _id: string,
    name: string,
  },
  form?: string,
  totalAmount: number,
  reservationStatus: string,
}
@Component({
  selector: 'app-reservation-seller',
  templateUrl: './reservation-seller.component.html',
  styleUrls: ['./reservation-seller.component.css']
})
export class ReservationSellerComponent implements OnInit, OnChanges {
  @Input() openCommFormModal: boolean;

  reserv_List: reservation[] = []
  reservation: reservation

  subs: Subscription[] = []
  constructor(
    private reserv: ReservationService,
  ) { 
    this.setreservation()
  }

  ngOnInit( ): void {
    this.subscribeReserveList()
  }

  ngOnChanges(): void {
    
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
        price: 0
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

  subscribeReserveList(){
    this.subs.push(
      this.reserv.getReservationList().subscribe((reservs: any)=>{
        this.reserv_List = reservs.data.reservationsArray
        //this.reserv_List.forEach(x => { console.log("Reservation: " + JSON.stringify(x))})
       
      })
    )
  }

  acceptReservation(item:any){
    this.reserv.updateReservation(item._id, "Approved")
    setTimeout( ()=>{
      this.subs.forEach( x=> x.unsubscribe())
      this.subscribeReserveList()
    }, 500)
  }

  rejectReservation(item:any){
    this.reserv.updateReservation(item._id, "Rejected")
    setTimeout( ()=>{
      this.subs.forEach( x=> x.unsubscribe())
      this.subscribeReserveList()
    }, 500)
  }

  removeReservation(item:any){
    this.reserv.deleteReservation(item._id)
    setTimeout( ()=>{
      this.subs.forEach( x=> x.unsubscribe())
      this.subscribeReserveList()
    }, 500)
  }

  CommissionFormModal() {
    this.openCommFormModal = true;
  }

  onClickExit () {
    if(this.openCommFormModal == true) {
      this.openCommFormModal = false;
    }
  }
}
