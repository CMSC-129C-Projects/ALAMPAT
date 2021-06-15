import { Component, Input, Output, OnInit, OnDestroy, EventEmitter,ViewChild, ElementRef, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Commission } from 'src/app/models/Commission';
import { CommissionService } from 'src/app/services/comService';
import { DomSanitizer } from '@angular/platform-browser';
import {AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from '@angular/fire/storage';
import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

interface commission {
  _id?: string;
  commissionname: string;
  description: string;
  images: {
      filename: string,
      contentType: string, 
      imageBase64: string
  };
  slot: number,
  price: number, 
  category: string,
  days: number,
  terms: string,
}


@Component({
  selector: 'app-commission-item',
  templateUrl: './commission-item.component.html',
  styleUrls: ['./commission-item.component.css']
})

export class CommissionItemComponent implements OnChanges, OnDestroy {
  @Input() openAddServiceModal: boolean;
  @Input() openEditServiceModal: boolean;
  @Input() openSuccessModal: boolean;
  @Output() reload: EventEmitter<boolean> ;
  @Output() reloadedit: EventEmitter<boolean>;
  
  @ViewChild('addimage') addimage: ElementRef
  @ViewChild('editimage') editimage: ElementRef
  
  saved: boolean = false;
  submitted: boolean = false;
  serviceForm: FormGroup;
  addService: FormGroup;
  service: commission;

  task: AngularFireUploadTask;
  snapshot: Observable<any>;
  subscriptions: Subscription;
  subper: Subscription;
  percentage: Observable<number|undefined> = new Observable();

  string64: any;
  filetype: any;

  addedFileName: string = '';
  fileName: string = '' ;
  
  filePath: any;

  addedimageSRC: any = '';
  imageSRC : any = '' ;
  prev_image: any = '' ;
  url: Promise<string>;
  
  pic_switched: boolean;

  @Output() updatepf : EventEmitter<any> = new EventEmitter(true); 

  constructor(private formBuilder: FormBuilder,
    private commissionService: CommissionService,
    private afStorage: AngularFireStorage) {
      this.reload = new EventEmitter(false);
      this.reloadedit = new EventEmitter(false);
     }


  ngOnChanges(): void {
    //this.commissionService.getItemdata()
    this.serviceForm = this.formBuilder.group ({
      commissionimage: this.formBuilder.group({
        filename: [''],
        contentType: [''],
        imageBase64:[''],
      }, {Validators: [Validators.required]} ),
      commissionname: ['', Validators.required],
      commissiondescription: ['', Validators.required],
      category: ['Commission', Validators.required],
      slot: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(1)]],
      days: ['', [Validators.required, Validators.min(1)]],
      terms: ['', Validators.required],
    });

    this.addService = this.formBuilder.group ({
      commissionimage: this.formBuilder.group({
        filename: [''],
        contentType: [''],
        imageBase64:[''],
      }, {Validators: [Validators.required]} ),
      commissionname: ['', Validators.required],
      commissiondescription: ['', Validators.required],
      category: ['Commission', Validators.required],
      slot: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(1)]],
      days: ['', [Validators.required, Validators.min(1)]],
      terms: ['', Validators.required],
    });

    this.subscriptions = this.commissionService.comSource.asObservable().subscribe(currItem => {
      this.service = currItem
      this.imageSRC = this.service?.images?.imageBase64
      this.initForm()
    })

    this.fileName = '';
    this.imageSRC = '';

    
  }

  ngOnDestroy():void{
    this.subscriptions.unsubscribe()
  }

  get formControls() { return this.addService.controls; }
  get formControlsEdit() { return this.serviceForm.controls; }

  //upload function for edit forms
  uploadFile(event: Event) {
    const target = event.target as HTMLInputElement

    const file: File = (target.files as FileList)[0]
    //Storage Path
    const path =  `/Service/${Date.now()}_` + file.name
    
    //reference to storage bucket
    const ref = this.afStorage.ref(path)

    //main task 
    this.task = this.afStorage.upload(path, file)

    //upload progress monitoring
    this.percentage = this.task.percentageChanges() ;
    

    this.snapshot = this.task.snapshotChanges().pipe(
      finalize( async() => {
        this.url = await ref.getDownloadURL().toPromise()
        this.serviceForm.patchValue({
          commissionimage: {
            filename: file.name,
            contentType: file.type,
            imageBase64: this.url
          }
        });
        this.fileName = file.name
        this.prev_image = this.imageSRC
        this.imageSRC = this.url
        console.log("Here: " + JSON.stringify(this.url) );
      })
    )
    this.editimage.nativeElement.value = null
  } 
  
  //upload file function for add forms
  uploadFileInAddForm(event: Event ) {
    const target = event.target as HTMLInputElement

    const file: File = (target.files as FileList)[0]
    //Storage Path
    const path =  `/Service/${Date.now()}_` + file.name
    
    //reference to storage bucket
    const ref = this.afStorage.ref(path)

    //main task 
    this.task = this.afStorage.upload(path, file)
    
    //upload progress monitoring
    this.percentage = this.task.percentageChanges() ;
    
    this.snapshot = this.task.snapshotChanges().pipe(
      finalize( async() => {
        this.url = await ref.getDownloadURL().toPromise()
        this.addService.patchValue({
          commissionimage: {
            filename: file.name,
            contentType: file.type,
            imageBase64: this.url
          }
        });
        this.addedFileName = file.name
        this.addedimageSRC = this.url
        console.log("Here: " + JSON.stringify(this.url) );
      })
    )
    this.addimage.nativeElement.value = null
  }

  //functions when the modal exits or cancels
  onClickExit = () => {
    this.addedFileName = '';
    
    this.fileName = '';
    this.percentage;
    this.prev_image = '';
    this.serviceForm.reset();
    this.addService.reset();
    this.reload.emit(true)
    if(this.openAddServiceModal) {
      this.commissionService.addswitch(false)
      // if(this.addedimageSRC){
      //   this.afStorage.storage.refFromURL(this.addedimageSRC).delete();
      // }
      this.percentage = new Observable()
      this.addedimageSRC = '';
      this.submitted = false;

    }
    if(this.openEditServiceModal) {
      this.commissionService.editswitch(false)
      // if(this.imageSRC != this.prev_image && this.prev_image !=""){
      //   this.afStorage.storage.refFromURL(this.imageSRC).delete();
      // }
      this.imageSRC = '';
      this.percentage = new Observable()
      this.saved = false;
    }
    if(this.openSuccessModal) {
      this.openSuccessModal = false;
      this.submitted = false;
    }
  }

  //function for adding commission item
  addCommission =  () => {
    this.submitted = true;
    this.addService.patchValue({"category": 'Commission'});
    console.log(this.addService.value);
    if(this.addService.invalid){
      console.log("Add failed");
      return;
    }
    else{
      this.openSuccessModal = true;
      this.commissionService.selectItem(this.service);
      const service: Commission = {
        commissionname: this.addService.get('commissionname')?.value,
        commissionimage: this.addService.get('commissionimage')?.value,
        commissiondescription: this.addService.get('commissiondescription')?.value,
        category: this.addService.get('category')?.value,
        slot: this.addService.get('slot')?.value,
        price: this.addService.get('price')?.value,
        days: this.addService.get('days')?.value,
        terms: this.addService.get('terms')?.value
      }

      this.commissionService.uploadItem(service);
      this.commissionService.getItemdata()
      //this.ngOnInit()
      this.commissionService.addswitch(false)
      this.percentage = new Observable()
      this.snapshot = new Observable()
      //this.addService.reset();
      this.addedFileName = '';
      this.addedimageSRC = '';
    }
  }

  //function for updating commission in edit forms
  saveCommission = async () => {
    if (this.serviceForm.invalid) {
      this.saved = true;
      console.log("Error in updating commission")
      // this.initForm();
    } else {
      const userdata = await this.commissionService.updateItemdata(this.serviceForm.value, this.service._id);
      if (userdata) {
        console.log("On Save Commission item: " + JSON.stringify(this.service))
        if(this.imageSRC != this.prev_image && this.prev_image!=""){
          this.afStorage.storage.refFromURL(this.prev_image).delete();
        }
        this.saved = true
        //this.ngOnInit();
        this.percentage = new Observable()
        this.snapshot = new Observable()
        this.fileName = '';
        this.imageSRC = '';
        this.commissionService.editswitch(false)
        this.reloadedit.emit(true)
      }
      else{
        this.initForm();
      }
    }
  }

  //function for initating the values in edit form based on the selected data
  initForm = () => {
    this.serviceForm.reset({
      commissionname: this.service?.commissionname,
      commissiondescription: this.service?.description,
      category: this.service?.category,
      slot: this.service?.slot,
      price: this.service?.price,
      days: this.service?.days,
      terms: this.service?.terms,
      commissionimage:{
        filename: this.service?.images.filename,
        contentType: this.service?.images.contentType,
        imageBase64: this.service?.images.imageBase64
        }
      });
  }
}
