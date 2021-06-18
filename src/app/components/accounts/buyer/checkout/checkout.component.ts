import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/services/order';
import { Subscription, BehaviorSubject} from 'rxjs';
import {AngularFireStorage} from '@angular/fire/storage';
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
  reserv_id: string = '';

  checkout_sub: Subscription;
  checkout_details: details;

  payment_option: any;
  imageSRC : any = '';
  fileName: string = '';
  halfprice: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private orderserv: OrderService,
    private afStorage: AngularFireStorage
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
      this.halfprice = item.data.details.service.price/2
      console.log( JSON.stringify(item.data))
    })
  }
  onBack(){
    this.router.navigate(['/reservation/'])
  }

  selectChangeHandler (event: any) {
    //update the ui
    this.payment_option = event.target.value;
  }

  uploadFile(event: Event) {
    const target = event.target as HTMLInputElement

    const file: File = (target.files as FileList)[0]
    //Storage Path
    const path =  `/Service/${Date.now()}_` + file.name
    
    //reference to storage bucket
    const ref = this.afStorage.ref(path)

    //main task 
    //this.task = this.afStorage.upload(path, file)

    //upload progress monitoring
    //this.percentage = this.task.percentageChanges() ;
    

    //this.snapshot = this.task.snapshotChanges().pipe(
    //  finalize( async() => {
    //    this.url = await ref.getDownloadURL().toPromise()
    //    this.serviceForm.patchValue({
    //      commissionimage: {
    //        filename: file.name,
    //        contentType: file.type,
    //        imageBase64: this.url
    //      }
    //    });
        this.fileName = file.name
    //    this.prev_image = this.imageSRC
    //    this.imageSRC = this.url
    //    console.log("Here: " + JSON.stringify(this.url) );
    //  })
    //)
    //this.editimage.nativeElement.value = null
  } 

}
