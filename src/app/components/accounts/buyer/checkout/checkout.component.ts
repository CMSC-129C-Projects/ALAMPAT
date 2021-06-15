import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/services/order';
import { Subscription} from 'rxjs';

interface details {
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
    category: string,
  },
  seller:{
    _id: string,
    name: string,
  },
  buyer:{
    _id: string,
    name: string,
    email: string,
    address: string,
    phoneNumber: string,
  },
  reservationStatus: string,
}
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {

  reserv_id: string = ''

  checkout_sub: Subscription
  
  checkout_details: details

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private orderserv: OrderService,
  ) {
    this.setDetails()
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe( params => {
        console.log(params.id)
        this.reserv_id = params.id
      })
    
    this.getCheckoutdetails()
  }

  ngOnDestroy():void {
    this.checkout_sub.unsubscribe()
  }
  
  setDetails(){
    this.checkout_details = {
      _id: '',
      service: {
        images:{
          filename: '',
          contentType: '', 
          imageBase64: ''
        },
        _id: '', 
        commissionname: '',
        price: 0,
        category: '',
      },
      seller:{
        _id: '',
        name: '',
      },
      buyer:{
        _id: '',
        name: '',
        email: '',
        address: '',
        phoneNumber: '',
      },
      reservationStatus: '',
    }
  }

  getCheckoutdetails(){
    this.checkout_sub = this.orderserv.getCheckoutdetails(this.reserv_id).subscribe( item => {
      this.checkout_details = item.data.details
      console.log( JSON.stringify(item.data))
    })
  }
  onBack(){
    this.router.navigate(['/reservation/'])
  }


}
