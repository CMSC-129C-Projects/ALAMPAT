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
  totalAmount?: number,
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

  comm_link:string |undefined = ' '
  total_Amt: number |undefined= 0
  saved_link:boolean = false
  saved_amount:boolean = false
  res_id: string
  subs: Subscription[] = []
  constructor(
    private reserv: ReservationService,
  ) { 
    
  }

  ngOnInit( ): void {
    this.setreservation()
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
      form: ' ',
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

  inputLink(event:Event){
    
    const input = (event.target as HTMLInputElement).value
    this.comm_link = input
    console.log("Form Link: " + this.comm_link)
  }

  inputTotalAmt(event:Event){
    const input = (event.target as HTMLInputElement).value
    this.total_Amt = Number(input)
    console.log("Total Amount: " + this.total_Amt)
  }

  onClickForm(item:reservation){
    this.res_id = item._id
    this.comm_link = item.form ? item.form : ' ' 
    this.total_Amt = item.totalAmount ? item.totalAmount : 0 
  }

  saveLink(){
    //console.log("Form Link: " + this.comm_link + ' id: ' + item._id )
    this.saved_link = true;
    this.reserv.addCommissionForm(this.res_id, String(this.comm_link))
    setTimeout( ()=>{
      this.subs.forEach( x=> x.unsubscribe())
      this.subscribeReserveList()
    }, 500)
  }

  saveTotalAmt(){
    this.saved_amount = true;
    //console.log("Total Amount: " + this.total_Amt)
    this.reserv.addtotalAmount(this.res_id, Number(this.total_Amt))
    setTimeout( ()=>{
      this.subs.forEach( x=> x.unsubscribe())
      this.subscribeReserveList()
    }, 500)
  }

  onClickExit () {
    if(this.openCommFormModal == true) {
      this.openCommFormModal = false;
      this.comm_link = ''
      this.total_Amt = 0
      this.saved_link = false
      this.saved_amount = false
    }
  }
}
