import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { OrderService } from 'src/app/services/order';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormArray } from '@angular/forms';
interface order_details{
  _id?: string;
  progresstrackerDescription?: string[],
  orderStatus: string,
  orderType: string,
  trackingNumber: string,
  reservation: {
    _id: string, 

    service:{
      images:{
        filename: string,
        contentType: string,
        imageBase64: string,
      },
      _id: string,
      commissionname: string,
      price: number,
      terms: string,
    },

    seller:{
      _id: string,
      name: string,
    },

    buyer:{
          _id: string,
          name: string,
          phoneNumber: string,
          email: string,
          address: string
        },

  },
  proof: [{
    filename: string,
    contentType: string,
    imageBase64: string,
  }]
  amount_paid: number,
  totalAmount: number,
  cancellationReason?: string,
}
@Component({
  selector: 'app-orderdetailsbuyer',
  templateUrl: './orderdetailsbuyer.component.html',
  styleUrls: ['./orderdetailsbuyer.component.css']
})
export class OrderdetailsbuyerComponent implements OnChanges {
  @Input() openOrderDetailsModal: boolean

  order: order_details
  sub: Subscription
  proof_payment = FormArray
  amt_topay: number = 0

  constructor(
    private orderserv: OrderService
    )
     { }

  ngOnChanges(): void {
    this.setorderDetails()
  
    const order_id = this.orderserv.orderID_value
    //console.log("Order ID: " + order_id)
    if(order_id){
      this.sub = this.orderserv.getOrder(order_id).subscribe( item => {
        this.order = item.data.order
        //console.log("Order ID: " + JSON.stringify(this.order))
        this.amt_topay = this.order.totalAmount - this.order.amount_paid
        this.proof_payment = item.data.proof
      } )
    }
    
    
    
  }

  //Function when the modal exits or cancels
  onClickExit () {
    if(this.openOrderDetailsModal) {
      this.orderserv.detailsswitch(false)
    }
  }

  setorderDetails(){
    this.order = {
      _id: '',
      progresstrackerDescription: [],
      orderStatus: '',
      orderType: '',
      trackingNumber: '',
      reservation: {
        _id: '', 
    
        service:{
          images:{
            filename: '',
            contentType: '',
            imageBase64: '',
          },
          _id: '',
          commissionname: '',
          price: 0,
          terms: ''
        },
    
        seller:{
          _id: '',
          name: '',
        },
    
        buyer:{
              _id: '',
              name: '',
              phoneNumber: '',
              email: '',
              address: ''
            },
    
      },
      proof: [{
        filename: '',
        contentType: '',
        imageBase64: '',
      }],
      amount_paid: 0,
      totalAmount: 0,
      cancellationReason: '',
    }
  }
}
