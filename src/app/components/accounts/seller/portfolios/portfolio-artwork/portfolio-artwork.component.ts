import { Component, Input, Output, ChangeDetectorRef, OnInit, OnDestroy, EventEmitter,ElementRef, ViewChild, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Portfolio } from 'src/app/models/Portfolio';
import { UploadService } from 'src/app/services/upload';
import { DomSanitizer } from '@angular/platform-browser';
import {AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from '@angular/fire/storage';
import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

interface portfolio {
  _id?: string;
  artworkname: string;
  description: string;
  images: {
      filename: string,
      contentType: string, 
      imageBase64: string
  }
}

@Component({
  selector: 'app-portfolio-artwork',
  templateUrl: './portfolio-artwork.component.html',
  styleUrls: ['./portfolio-artwork.component.css']
})
export class PortfolioArtworkComponent implements OnChanges, OnDestroy {
  @Input() openAddArtworkModal: boolean;
  @Input() openEditArtworkModal: boolean;
  @Input() openSuccessModal: boolean;
  
  @ViewChild('addimage') addimage:ElementRef;
  @ViewChild('editimage') editimage:ElementRef;
  @Output() exited: EventEmitter<boolean> = new EventEmitter<boolean>(false)
  @Output() exitedadd: EventEmitter<boolean> = new EventEmitter<boolean>(false)
  @Input() artwork: any = '';

  saved: boolean = false;
  submitted: boolean = false;
  portfolioForm: FormGroup;
  addPortfolio: FormGroup;
  
 
  task: AngularFireUploadTask;
  snapshot: Observable<any>;
  subscriptions: Subscription;
  percentage: Observable<number|undefined> = new Observable();

  string64: any;
  filetype: any;

  addedFileName: string = '';
  fileName: string = '' ;
  
  filePath: any;

  insertedimg: any = '';
  addedimageSRC: any = '';
  imageSRC : any = '' ; 
  prev_image: any = '' ;
  url: Promise<string>;
  
  pic_switched: boolean;

  @Output() updatepf : EventEmitter<any> = new EventEmitter(true); 

  constructor(private formBuilder: FormBuilder, 
    private cd: ChangeDetectorRef, 
    private domSanitizer: DomSanitizer, 
    private uploadService: UploadService,
    private afStorage: AngularFireStorage,
   ) {
     this.exited = new  EventEmitter<boolean>(false);
     this.exitedadd = new  EventEmitter<boolean>(false)
     this.artwork = ''
    }

  ngOnChanges(): void {

    this.portfolioForm = this.formBuilder.group ({
      artworkimage: this.formBuilder.group({
        filename: [''],
        contentType: [''],
        imageBase64:[''],
      }, {Validators: [Validators.required]} ),

      artworkname: ['', Validators.required],
      artworkdescription: ['', Validators.required]
    });
    this.addPortfolio = this.formBuilder.group ({
      artworkimage: this.formBuilder.group({
        filename: [''],
        contentType: [''],
        imageBase64:[''],
      }, {Validators: [Validators.required]}),

      artworkname: ['', Validators.required],
      artworkdescription: ['', Validators.required]
    });

    this.subscriptions = this.uploadService.artSource.asObservable().subscribe(currArt =>{
      console.log("Selected Art: " + JSON.stringify(currArt))
      this.artwork = currArt
      //this.fileName = this.artwork.images.filename
      //this.imageSRC = this.artwork.images.imageBase64
      this.prev_image = this.artwork.images.imageBase64
      this.initForm()
    })
    //console.log("Selected Art: " + JSON.stringify(this.artwork))
    //this.initForm()
    this.fileName = '';
    this.imageSRC = '';

    

    
    
  }
  
  get formControls() { return this.addPortfolio.controls; }

  //upload function for edit forms
  uploadFile(event: Event) {
    const target = event.target as HTMLInputElement

    const file: File = (target.files as FileList)[0]
    //Storage Path
    const path =  `/Portfolio/${Date.now()}_` + file.name
    
    //reference to storage bucket
    const ref = this.afStorage.ref(path)

    //main task 
    this.task = this.afStorage.upload(path, file)

    //upload progress monitoring
    this.percentage = this.task.percentageChanges() ;
    

    this.snapshot = this.task.snapshotChanges().pipe(
      finalize( async() => {
        this.url = await ref.getDownloadURL().toPromise()
        this.portfolioForm.patchValue({
          artworkimage: {
            filename: file.name,
            contentType: file.type,
            imageBase64: this.url
          }
        });
        this.fileName = file.name
        
        this.imageSRC = this.url
        this.editimage.nativeElement.value = null
        console.log("Here: " + JSON.stringify(this.url) );
      })
    )
    
  }

  //upload file function for add forms
  uploadFileInAddForm(event: Event ) {
    const target = event.target as HTMLInputElement

    const file: File = (target.files as FileList)[0]
    //Storage Path
    const path =  `/Portfolio/${Date.now()}_` + file.name
    
    //reference to storage bucket
    const ref = this.afStorage.ref(path)

    //main task 
    this.task = this.afStorage.upload(path, file)
    
    //upload progress monitoring
    this.percentage = this.task.percentageChanges() ;
    
    this.snapshot = this.task.snapshotChanges().pipe(
      finalize( async() => {
        this.url = await ref.getDownloadURL().toPromise()
        this.addPortfolio.patchValue({
          artworkimage: {
            filename: file.name,
            contentType: file.type,
            imageBase64: this.url
          }
        });
        this.addedFileName = file.name
        this.addedimageSRC = this.url
        this.addimage.nativeElement.value = null
        console.log("Here: " + JSON.stringify(this.url) );
      })
    )
    
  }
 
 

  //functions when the modal exits or cancels
  onClickExit = () => {
    //console.log("On Exit Art: " + JSON.stringify(this.artwork))
    console.log(this.portfolioForm.value);
    //console.log(this.addPortfolio.value);
    
    this.addedFileName = '';
    this.fileName = '';
    this.percentage = new Observable()
    this.snapshot = new Observable()
   
    this.submitted = false;
    
    
    if(this.openAddArtworkModal == true) {
      this.addPortfolio.reset();
      this.uploadService.addswitch(false)
      if(this.addedimageSRC){
        this.afStorage.storage.refFromURL(this.addedimageSRC).delete();
      }
      this.addedimageSRC = '';
    }

    if(this.openEditArtworkModal == true) {
      this.portfolioForm.reset();
      //console.log("prev_image " + JSON.stringify(this.prev_image))
      //console.log("imageSRC " + JSON.stringify(this.imageSRC))
      if(this.imageSRC !== this.prev_image && this.prev_image !=""){
        this.afStorage.storage.refFromURL(this.imageSRC).delete();
      }
      this.imageSRC = '';
      this.prev_image = '';

      this.saved = false;
      this.uploadService.editswitch(false)
    }
    if(this.openSuccessModal) {
      this.openSuccessModal = false;
    }
    this.exitedadd.emit(true)
  }

  //function for adding artwork
  addArtwork =  () => {
    console.log(this.addPortfolio.value);
    
    this.submitted = true;
    
    if(this.addPortfolio.invalid){
      return;
    }
    else{
      
      this.openSuccessModal = true;
      this.uploadService.selectArt(this.artwork);
      const artwork: Portfolio = {
        artworkname: this.addPortfolio.get('artworkname')?.value,
        artworkimage: this.addPortfolio.get('artworkimage')?.value,
        artworkdescription: this.addPortfolio.get('artworkdescription')?.value,
      }
      this.uploadService.uploadPortfolio(artwork);
      //this.uploadService.getPortfoliodata();
      //this.ngOnInit();
      this.uploadService.addswitch(false);
      this.percentage = new Observable();
      this.snapshot = new Observable();
      this.addPortfolio.reset();
      this.addedFileName = '';
      this.addedimageSRC = '';
      
    }
  }

  //function for updating artwork in edit forms
  saveArtwork = async () => {
    //console.log("Artwork edited data: " + JSON.stringify(this.portfolioForm.value));
    if (this.portfolioForm.invalid) {
      this.saved = true;
      this.initForm();
    } else {
      const userdata = await this.uploadService.updatePortfoliodata(this.portfolioForm.value, this.artwork._id);
      if (userdata) {
        //console.log("On Save Art: " + JSON.stringify(this.portfolioForm))
        //this.portfolioForm.get('artowkimage')?.reset();
        if(this.imageSRC != this.prev_image && this.prev_image!="" ){
          this.afStorage.storage.refFromURL(this.prev_image).delete();
        }
        //this.afStorage.storage.refFromURL(this.prev_image).delete();
        this.prev_image = '';
        //this.ngOnInit();
        //this.portfolioForm.reset();
        
        this.saved = true
        this.percentage = new Observable()
        this.snapshot = new Observable()
        this.fileName = '';
        this.imageSRC = '';
        this.uploadService.editswitch(false)
        this.exited.emit(true)
      }
      else{
        this.initForm();
      }
      
    }
  }

  //function for initating the values in edit form based on the selected data
  initForm = () => {
    this.portfolioForm.reset({
      artworkname: this.artwork?.artworkname,
      artworkdescription: this.artwork?.description,
      artworkimage:{
        filename: this.artwork?.images.filename,
        contentType: this.artwork?.images.contentType,
        imageBase64: this.artwork?.images.imageBase64
        }
      });
  }

  ngOnDestroy():void{
    this.subscriptions.unsubscribe()
  }
}

