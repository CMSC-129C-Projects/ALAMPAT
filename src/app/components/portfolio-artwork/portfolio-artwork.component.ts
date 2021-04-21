import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-portfolio-artwork',
  templateUrl: './portfolio-artwork.component.html',
  styleUrls: ['./portfolio-artwork.component.css']
})
export class PortfolioArtworkComponent implements OnInit {
  @Input() openAddArtworkModal: boolean;
  submitted: boolean = false;
  portfolioForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.portfolioForm = this.formBuilder.group ({
      artworkname: ['', Validators.required],
      artworkimage: [Validators.required],
      artworkdescription: ['', Validators.required]
    });
  }
  get formControls() { return this.portfolioForm.controls; }

  onSubmit = () => {
    this.submitted = true;
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
    //this.userService.login(this.loginForm.value);
  }
}
