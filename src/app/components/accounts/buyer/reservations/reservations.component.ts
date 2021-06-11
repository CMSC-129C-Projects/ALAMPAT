import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
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
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit, OnDestroy{
  // @Input() openReservationModal: boolean;
  showReservation: boolean = false;
  
  reserv_List: reservation[] = []

  reservation: reservation
 
  subs: Subscription[] = []

  constructor(
    private reserv: ReservationService,
  ) {
    this.showReservation = false;
    this.setreservation()
  }

  ngOnInit(): void {
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

  ngOnDestroy(){
    this.subs.forEach(x => x.unsubscribe())
  }

  

  subscribeReserveList(){
    this.subs.push(
      this.reserv.getReservationList().subscribe((reservs: any)=>{
        this.reserv_List = reservs.data.reservationsArray
        //this.reserv_List.forEach(x => { console.log("Reservation: " + JSON.stringify(x))})
       
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
        //console.log("Reservation: " + JSON.stringify(this.reservation))
      })
    )
  }

  onCancellation(reserv_id: string){
    //this.setreservation()
    this.reserv.cancelReservation(reserv_id)
    this.subs.forEach(x => x.unsubscribe())
    
    setTimeout(() =>{
      this.subscribeReserv(reserv_id)
      this.subscribeReserveList()
    }, 500)
    
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
