import { Component, OnInit } from '@angular/core';
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
  reservationStatus: string,
}
@Component({
  selector: 'app-reservation-seller',
  templateUrl: './reservation-seller.component.html',
  styleUrls: ['./reservation-seller.component.css']
})
export class ReservationSellerComponent implements OnInit {
  
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
}
