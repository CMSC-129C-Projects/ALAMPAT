import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Portfolio } from 'src/app/models/Portfolio';
import { UploadService } from 'src/app/services/upload';

@Component({
  selector: 'app-portfolio-artwork',
  templateUrl: './portfolio-artwork.component.html',
  styleUrls: ['./portfolio-artwork.component.css']
})
export class PortfolioArtworkComponent implements OnInit {
  @Input() openAddArtworkModal: boolean;
  submitted: boolean = false;
  portfolioForm: FormGroup;
  file: File;

  constructor(private formBuilder: FormBuilder, public uploadService: UploadService) { }

  ngOnInit(): void {
    this.portfolioForm = this.formBuilder.group ({
      artworkname: ['', Validators.required],
      artworkimage: [null, Validators.required],
      artworkdescription: ['', Validators.required]
    });
  }
  get formControls() { return this.portfolioForm.controls; }

  uploadFile(event: any) {
    console.log(event);
    this.file = <File>event.target.files[0];
    this.portfolioForm.patchValue({
      artworkimage: this.file
    });
    this.portfolioForm.get('artworkimage')?.updateValueAndValidity()
  }

  onClickExit = () => {
    this.openAddArtworkModal = false;
    this.submitted = false;
    this.portfolioForm.reset();
  }

  addArtwork = async () => {
    console.log(this.portfolioForm.value);
    this.submitted = true;
    if(this.portfolioForm.invalid){
      return;
    }
    var formData: any = new FormData();
      formData.append("artworkname", this.portfolioForm.get('artworkname')?.value);
      formData.append("artworkimage", this.portfolioForm.get('artworkimage')?.value);
      formData.append("artworkdiscription", this.portfolioForm.get('artworkdescription')?.value);
    
    const artwork: Portfolio = {
      artworkname: formData.get('artworkname')?.value,
      artworkimage: formData.get('artworkimage')?.value,
      artworkdescription: formData.get('artworkdescription')?.value,
    }
    this.uploadService.uploadPortfolio(artwork);
    //this.userService.login(this.loginForm.value);
  }
}
