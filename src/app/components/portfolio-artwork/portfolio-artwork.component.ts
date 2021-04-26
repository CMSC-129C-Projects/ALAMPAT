import { Component, Input, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Portfolio } from 'src/app/models/Portfolio';
import { UploadService } from 'src/app/services/upload';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-portfolio-artwork',
  templateUrl: './portfolio-artwork.component.html',
  styleUrls: ['./portfolio-artwork.component.css']
})
export class PortfolioArtworkComponent implements OnInit {
  @Input() openAddArtworkModal: boolean;
  @Input() openEditArtworkModal: boolean;
  saved: boolean = false;
  submitted: boolean = false;
  portfolioForm: FormGroup;
  artwork: any;
  string64: any;
  filetype: any;
  fileName: string;
  public imageSRC : any;

  constructor(private formBuilder: FormBuilder, private cd: ChangeDetectorRef, private domSanitizer: DomSanitizer, private uploadService: UploadService) { }

  ngOnInit(): void {
    this.uploadService.getPortfoliodata()
    this.uploadService.portfolio.subscribe((artwork)=>{
      this.artwork = artwork 

      this.initForm()
      //replace this when frontend is integrated to backend since it will be saved in one string
      this.imageSRC = this.domSanitizer.bypassSecurityTrustUrl(this.artwork.artworkimage?.imageBase64)
      //console.log("User image: " + JSON.stringify(this.imageSRC))
    }, (error) => {
      console.log("Error", error)
    })

    this.portfolioForm = this.formBuilder.group ({
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

  onClickExit = () => {
    if(this.openAddArtworkModal) {
      this.openAddArtworkModal = false;
      this.submitted = false;
    }
    if(this.openEditArtworkModal) {
      this.openEditArtworkModal = false;
      this.saved = false;
    }
    this.portfolioForm.reset();
  }

  

  addArtwork = async () => {
    console.log(this.portfolioForm.value);
    this.submitted = true;
    if(this.portfolioForm.invalid){
      return;
    }
    const artwork: Portfolio = {
      artworkname: this.portfolioForm.get('artworkname')?.value,
      artworkimage: this.portfolioForm.get('artworkimage')?.value,
      artworkdescription: this.portfolioForm.get('artworkdescription')?.value,
    }
    this.uploadService.uploadPortfolio(artwork);
  }

  saveArtwork = async () => {
    if (this.portfolioForm.invalid) {
      this.saved = true;
      this.initForm();
    } else {
      var userdata = await this.uploadService.updatePortfoliodata(this.portfolioForm.value);
      if (userdata === true) {
        this.ngOnInit()
        //this.router.navigate(['/']) back to accounts page
      }
      else{
        this.initForm();
      }
    }
  }
    initForm = () => {
      this.portfolioForm.reset({
        artworkname: this.artwork?.artworkname,
        artworkdescription: this.artwork?.artworkdescription,
        artworkimage:{
          filename: this.artwork?.artworkimage.filename,
          contentType: this.artwork?.artworkimage.contentType,
          imageBase64: this.artwork?.artworkimage.imageBase64
          }
        });
    }
}
