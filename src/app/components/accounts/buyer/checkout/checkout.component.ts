import { Component, OnInit, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/services/order';
import { Subscription, Observable} from 'rxjs';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  submitted: boolean = false;

  task: AngularFireUploadTask;
  snapshot: Observable<any>;
  percentage: Observable<number|undefined> = new Observable();
  url: Promise<string>;
  payment_proof: FormGroup;
  proofForm: FormGroup;
  

  @ViewChild('proofimage') image_proof: ElementRef

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private orderserv: OrderService,
    private afStorage: AngularFireStorage,
    private formBuilder: FormBuilder
  ) {
    this.setDetails()
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe( params => {
        console.log(params.id)
        this.reserv_id = params.id
      })
    
    this.payment_proof = this.formBuilder.group({
        payment_option: ['', Validators.required],
        proof: this.formBuilder.group ({
          filename: ['', Validators.required],
          contentType: ['', Validators.required],
          imageBase64:['', Validators.required],
        })  
    })

    this.getCheckoutdetails()
  }

  get formControls() { return this.payment_proof.controls; }
  get formControlsProof() { return this.payment_proof.controls.proof as FormGroup}

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
    //Selected option in dropdown
    //this.payment_option.setValue(event.target.value, {
    //  onlySelf: true
    //})
  }

  uploadFile(event: Event) {
    const target = event.target as HTMLInputElement

    const file: File = (target.files as FileList)[0]

    //Storage Path
    const path =  `/Order/${Date.now()}_` + file.name
    
    //reference to storage bucket
    const ref = this.afStorage.ref(path)

    //main task 
    this.task = this.afStorage.upload(path, file)

    //upload progress monitoring
    this.percentage = this.task.percentageChanges() ;
    

    this.snapshot = this.task.snapshotChanges().pipe(
     finalize( async() => {
       this.url = await ref.getDownloadURL().toPromise()
       this.payment_proof.patchValue({
         proof: {
          filename: file.name,
          contentType: file.type,
          imageBase64: this.url
         }
       });

        this.fileName = file.name;
       
       this.imageSRC = this.url;
       console.log("Here: " + JSON.stringify(this.url) );
     })
    )
    this.image_proof.nativeElement.value = null;
  }
  
  placeOrder () {
    this.submitted = true;
    if (this.payment_proof.invalid) {
      console.log("Error in placing order.")
    } 
    console.log("Successfully placed order!")
  }

}
