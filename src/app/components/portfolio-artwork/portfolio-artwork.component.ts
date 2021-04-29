import { Component, Input, ChangeDetectorRef, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Portfolio } from 'src/app/models/Portfolio';
import { UploadService } from 'src/app/services/upload';
import { DomSanitizer } from '@angular/platform-browser';

import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-portfolio-artwork',
  templateUrl: './portfolio-artwork.component.html',
  styleUrls: ['./portfolio-artwork.component.css']
})
export class PortfolioArtworkComponent implements OnInit {
  @Input() openAddArtworkModal: boolean;
  @Input() openEditArtworkModal: boolean;
  @Input() openSuccessModal: boolean;
  saved: boolean = false;
  submitted: boolean = false;
  portfolioForm: FormGroup;
  addPortfolio: FormGroup;
  artwork: any = {};
  blank_art: any = {};
  string64: any;
  filetype: any;
  fileName: string = '' ;
  public imageSRC : any = '' ;



  constructor(private formBuilder: FormBuilder, 
    private cd: ChangeDetectorRef, 
    private domSanitizer: DomSanitizer, 
    private uploadService: UploadService,
   ) {
      
     }

  ngOnInit(): void {
    this.uploadService.getPortfoliodata()
    
    /*this.uploadService.currArt.subscribe(currArt =>{
      console.log("Selected Art: " + JSON.stringify(currArt))
      this.artwork = currArt
      this.initForm()
    })*/

    this.uploadService.artSource.asObservable().subscribe(currArt =>{
      //console.log("Selected Art: " + JSON.stringify(currArt))
      this.artwork = currArt
      this.imageSRC = this.artwork.images.imageBase64
      this.initForm()
    })
    
    this.fileName = ''
    this.imageSRC = ''

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
    console.log(event);
    const reader = new FileReader();
    const target= event.target as HTMLInputElement;

    if(target.files && target.files.length) {
      const file: File = (target.files as FileList)[0];
      this.fileName = file.name;
      this.filetype = this.domSanitizer.bypassSecurityTrustUrl(file.type);
      reader.readAsDataURL(file);
  
      reader.onload = () => {
        this.string64 = reader.result
        this.imageSRC = this.domSanitizer.bypassSecurityTrustUrl(this.string64);
        
        this.portfolioForm.patchValue({
          artworkimage: {
            filename: file.name,
            contentType: file.type,
            imageBase64: reader.result as string
          }
        });
        this.cd.markForCheck();
      };
      
    }    
  }

  //upload file function for add forms
  uploadFileInAddForm(event: Event) {
    console.log(event);
    const reader = new FileReader();
    const target= event.target as HTMLInputElement;

    if(target.files && target.files.length) {
      
      const file: File = (target.files as FileList)[0];
      this.fileName = file.name;
      this.filetype = this.domSanitizer.bypassSecurityTrustUrl(file.type);
      reader.readAsDataURL(file);
  
      reader.onload = () => {
        this.string64 = reader.result
        this.imageSRC = this.domSanitizer.bypassSecurityTrustUrl(this.string64);
        
        this.addPortfolio.patchValue({
          artworkimage: {
            filename: file.name,
            contentType: file.type,
            imageBase64: reader.result as string
          }
        });
        this.cd.markForCheck();
      };
      
    }    
  }

  //functions when the modal exits or cancels
  onClickExit = () => {
    //console.log("On Exit Art: " + JSON.stringify(this.artwork))
    this.portfolioForm.reset();
    if(this.openAddArtworkModal) {
      this.openAddArtworkModal = false;
      this.submitted = false;
    }
    if(this.openEditArtworkModal) {
      this.openEditArtworkModal = false;
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
    //console.log(this.portfolioForm.value);
    //this.portfolioForm.reset();
    
    this.submitted = true;
    
    if(this.addPortfolio.invalid){
      
      return;
    }
    else{
      this.openSuccessModal = true;
      const artwork: Portfolio = {
        artworkname: this.addPortfolio.get('artworkname')?.value,
        artworkimage: this.addPortfolio.get('artworkimage')?.value,
        artworkdescription: this.addPortfolio.get('artworkdescription')?.value,
      }

      this.uploadService.uploadPortfolio(artwork);
      
      this.ngOnInit()
      this.openAddArtworkModal = false;
      this.addPortfolio.reset();
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
        this.ngOnInit()
        //this.portfolioForm.reset();
        
        this.fileName = ''
        this.imageSRC = ''

        this.openEditArtworkModal = false
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
        imageBase64: this.artwork?.images.imageBase64.changingThisBreaksApplicationSecurity
        }
      });
  }
}
