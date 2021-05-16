import { Component, Input, Output, ChangeDetectorRef, OnInit, OnDestroy, EventEmitter,ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Portfolio } from 'src/app/models/Portfolio';
import { UploadService } from 'src/app/services/upload';
import { DomSanitizer } from '@angular/platform-browser';

import {AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from '@angular/fire/storage'

import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';


const access_token = '3taIZaHhNQ4AAAAAAAAAAepdQhfZ7Am-YbNFCjNR5tvHzXCO1TiS_MPlCwZuu4ja'

@Component({
  selector: 'app-portfolio-artwork',
  templateUrl: './portfolio-artwork.component.html',
  styleUrls: ['./portfolio-artwork.component.css']
})
export class PortfolioArtworkComponent implements OnInit, OnDestroy {
  @Input() openAddArtworkModal: boolean;
  @Input() openEditArtworkModal: boolean;
  @Input() openSuccessModal: boolean;
  saved: boolean = false;
  submitted: boolean = false;
  portfolioForm: FormGroup;
  addPortfolio: FormGroup;
  artwork: any = {};
 
  task: AngularFireUploadTask;
  snapshot: Observable<any>;
  subscriptions: Subscription

  string64: any;
  filetype: any;

  addedFileName: string = '';
  fileName: string = '' ;
  
  filePath: any;

  addedimageSRC: any = '';
  imageSRC : any = '' ;
  prev_image: any = '' ;
  url: Promise<string>;

  @Output() updatepf : EventEmitter<any> = new EventEmitter(true); 

  constructor(private formBuilder: FormBuilder, 
    private cd: ChangeDetectorRef, 
    private domSanitizer: DomSanitizer, 
    private uploadService: UploadService,
    private afStorage: AngularFireStorage,
   ) {
      
     }

  ngOnInit(): void {
    this.uploadService.getPortfoliodata()
    
    /*this.uploadService.currArt.subscribe(currArt =>{
      console.log("Selected Art: " + JSON.stringify(currArt))
      this.artwork = currArt
      this.initForm()
    })*/

    this.subscriptions = this.uploadService.artSource.asObservable().subscribe(currArt =>{
      //console.log("Selected Art: " + JSON.stringify(currArt))
      this.artwork = currArt
      this.fileName = this.artwork.images.filename
      this.imageSRC = this.artwork.images.imageBase64
      this.initForm()
    })
    
    

    this.fileName = '';
    this.imageSRC = '';

    this.portfolioForm = this.formBuilder.group ({
      artworkimage: this.formBuilder.group({
        filename: [''],
        contentType: [''],
        imageBase64:[''],
      }, {Validators: [Validators.required]}),

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
    
  }
  
  get formControls() { return this.portfolioForm.controls; }

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
    const path =  `/Portfolio/${Date.now()}_` + file.name
    
    //reference to storage bucket
    const ref = this.afStorage.ref(path)

    //main task 
    this.task = this.afStorage.upload(path, file)
    
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
        console.log("Here: " + JSON.stringify(this.url) );
      })
    )

  }
 
 

  //functions when the modal exits or cancels
  onClickExit = () => {
    //console.log("On Exit Art: " + JSON.stringify(this.artwork))
    this.addedFileName = '';
    this.addedimageSRC = '';
    this.fileName = '';
    this.imageSRC = '';
    this.portfolioForm.reset();
    this.addPortfolio.reset();
    if(this.openAddArtworkModal) {
      this.uploadService.addswitch(false)
      
      this.submitted = false;

    }
    if(this.openEditArtworkModal) {
      this.uploadService.editswitch(false)
      
      this.saved = false;
    }
    if(this.openSuccessModal) {
      this.openSuccessModal = false;
      this.submitted = false;
    }
    //this.myInputVariable.nativeElement.value = "";
    
  }

  //function for adding artwork
  addArtwork =  () => {
    console.log(this.portfolioForm.value);
    //this.portfolioForm.reset();
    
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
      this.uploadService.getPortfoliodata()
      this.ngOnInit()
      this.uploadService.addswitch(false)
      
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
        console.log("On Save Art: " + JSON.stringify(this.artwork))
        //this.portfolioForm.get('artowkimage')?.reset();
        this.ngOnInit();
        //this.portfolioForm.reset();
        this.afStorage.storage.refFromURL(this.prev_image).delete();
        this.fileName = '';
        this.imageSRC = '';
        this.uploadService.editswitch(false)
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

