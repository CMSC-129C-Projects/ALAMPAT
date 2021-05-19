import { Component, Input, Output, ChangeDetectorRef, OnInit, OnDestroy, EventEmitter,ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Commission } from 'src/app/models/Commission';
import { CommissionService } from 'src/app/services/comService';
import { DomSanitizer } from '@angular/platform-browser';
import {AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from '@angular/fire/storage';
import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-commission-item',
  templateUrl: './commission-item.component.html',
  styleUrls: ['./commission-item.component.css']
})
export class CommissionItemComponent implements OnInit, OnDestroy {
  @Input() openAddServiceModal: boolean;
  @Input() openEditServiceModal: boolean;
  @Input() openSuccessModal: boolean;
  saved: boolean = false;
  submitted: boolean = false;
  serviceForm: FormGroup;
  addService: FormGroup;
  service: any = {};

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
    private afStorage: AngularFireStorage) { }

  ngOnInit(): void {
    this.commissionService.getItemdata()

    this.subscriptions = this.commissionService.comSource.asObservable().subscribe(currItem => {
      this.service = currItem
      this.imageSRC = this.service.images.imageBase64
      this.initForm()
    })

    this.fileName = '';
    this.imageSRC = '';

    this.serviceForm = this.formBuilder.group ({
      commissionimage: this.formBuilder.group({
        filename: [''],
        contentType: [''],
        imageBase64:[''],
      }, {Validators: [Validators.required]} ),
      commissionname: ['', Validators.required],
      commissiondescription: ['', Validators.required],
      category: ['', Validators.required],
      slot: ['', Validators.required],
      price: ['', Validators.required]
    });

    this.addService = this.formBuilder.group ({
      commissionimage: this.formBuilder.group({
        filename: [''],
        contentType: [''],
        imageBase64:[''],
      }, {Validators: [Validators.required]} ),
      commissionname: ['', Validators.required],
      commissiondescription: ['', Validators.required],
      category: ['', Validators.required],
      slot: ['', Validators.required],
      price: ['', Validators.required]
    });
  }

  ngOnDestroy():void{
    this.subscriptions.unsubscribe()
  }

  get formControls() {return this.serviceForm.controls; }

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
  }

  //functions when the modal exits or cancels
  onClickExit = () => {
    this.addedFileName = '';
    
    this.fileName = '';
    this.percentage;
    this.prev_image = '';
    this.serviceForm.reset();
    this.addService.reset();
    if(this.openAddServiceModal) {
      this.commissionService.addswitch(false)
      this.percentage = new Observable()
      this.addedimageSRC = '';
      this.submitted = false;

    }
    if(this.openEditServiceModal) {
      this.commissionService.editswitch(false)
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
    console.log(this.serviceForm.value);
    this.submitted = true;
    
    if(this.addService.invalid){
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
        price: this.addService.get('price')?.value
      }

      this.commissionService.uploadItem(service);
      this.commissionService.getItemdata()
      this.ngOnInit()
      this.commissionService.addswitch(false)
      this.percentage = new Observable()
      this.addService.reset();
      this.addedFileName = '';
      this.addedimageSRC = '';
    }
  }

  //function for updating commission in edit forms
  saveCommission = async () => {
    if (this.serviceForm.invalid) {
      this.saved = true;
      this.initForm();
    } else {
      const userdata = await this.commissionService.updateItemdata(this.serviceForm.value, this.service._id);
      if (userdata) {
        console.log("On Save Commission item: " + JSON.stringify(this.service))
      
        this.ngOnInit();
        this.percentage = new Observable()
        this.fileName = '';
        this.imageSRC = '';
        this.commissionService.editswitch(false)
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
      commissiondescription: this.service?.commissiondescription,
      category: this.service?.category,
      slot: this.service?.slot,
      price: this.service?.price,
      commissionimage:{
        filename: this.service?.images.filename,
        contentType: this.service?.images.contentType,
        imageBase64: this.service?.images.imageBase64
        }
      });
  }
}
