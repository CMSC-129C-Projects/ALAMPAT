import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import axios from 'axios';
import { DomSanitizer } from '@angular/platform-browser';
import { User } from '../../models/User'

import { AccountService } from 'src/app/services/account';
import { Router, ActivatedRoute } from '@angular/router';


const localAPI = 'http://localhost:3000'

@Component({
  selector: 'app-editaccountseller',
  templateUrl: './editaccountseller.component.html',
  styleUrls: ['./editaccountseller.component.css']
})
export class EditaccountsellerComponent implements OnInit {
  @Input() openEditAccountSellerModal: boolean = false;
  submitted: boolean = false;
  SellerForm: FormGroup;


  user: any; // = new User;
  string64: any;
  filetype: any;
  public imageSRC : any
  userID: string = '607fe491958fa65f08f14d0e';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder, 
    private cd: ChangeDetectorRef, 
    private domSanitizer: DomSanitizer,
    private accountService: AccountService) { 
    
  }

  ngOnInit(): void {

    this.accountService.getUserdata()
    this.accountService.user.subscribe((user)=>{
      this.user = user 

      ///initialize the values present in the form
      this.initForm()
      
      //sanitizes the URL to be safe to avoid warnings
      this.imageSRC = this.domSanitizer.bypassSecurityTrustUrl(this.user.profileImage?.imageBase64)
      
      //console.log("User image: " + JSON.stringify(this.imageSRC))
  
    }, (error) => {
      
      console.log("Error", error)
  })
    
    this.SellerForm = this.formBuilder.group ({
      profileImage: this.formBuilder.group({
        filename: [''],
        contentType: [''],
        imageBase64:[''],
      }),
      name: [''],
      email: ['', [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.pattern('^(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]],
      phoneNumber: ['', [Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      description: [''],
      
    });

  }

  get formControls() { return this.SellerForm.controls; }

  onClickChangePhoto = (event: Event) => {
    const reader = new FileReader();
    const target= event.target as HTMLInputElement;

    if(target.files && target.files.length) {
      
      const file: File = (target.files as FileList)[0];
      this.filetype =this.domSanitizer.bypassSecurityTrustUrl(file.type)
      reader.readAsDataURL(file);
  
      reader.onload = () => {
        this.string64 = reader.result
        this.imageSRC = this.domSanitizer.bypassSecurityTrustUrl(this.string64);
        
        //console.log("Hello" + reader.result)
        
        this.SellerForm.patchValue({
          profileImage:{
          filename: file.name,
          contentType: file.type,
          imageBase64: reader.result as string
          }
       });
      
        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
      };
    }
  }

  onClickSave = async () => {
    
    if (this.SellerForm.invalid) {
      this.submitted = true;
      this.initForm();
    } else {
      var userdata = await this.accountService.updateUserdata(this.SellerForm.value);
      if (userdata === true) {
        this.ngOnInit()
        //this.router.navigate(['/']) //back to accounts page
      }
      else {
        this.initForm();
      }
    }

    //console.log("Seller Form Data: " + JSON.stringify(this.SellerForm.value));
    this.submitted = true;  
  }

  onClickExit = () => {
    this.openEditAccountSellerModal = false;
    this.submitted = false;
    this.initForm()
  }

  initForm = () => {
    this.SellerForm.reset({
      name: this.user?.name,
      email: this.user?.email,
      password: this.user?.password,
      phoneNumber: this.user?.phoneNumber,
      profileImage:{
        filename: this.user?.profileImage.filename,
        contentType: this.user?.profileImage.contentType,
        imageBase64: this.user?.profileImage.imageBase64
        },
      description: this.user?.description,
      });
  }

  
}
