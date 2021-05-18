import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import axios from 'axios';
import { DomSanitizer } from '@angular/platform-browser';
import { User } from '../../models/User'

import { AccountService } from 'src/app/services/account';
import { Router, ActivatedRoute } from '@angular/router';

import {AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from '@angular/fire/storage';

import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';


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
  imageSRC : any;
  userID: string = '607fe491958fa65f08f14d0e';

  prev_img: any;

  task: AngularFireUploadTask;
  snapshot: Observable<any>;

  constructor(
    private formBuilder: FormBuilder,
    private afStorage: AngularFireStorage,
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
      this.imageSRC = user.profileImage?.imageBase64
      this.prev_img = this.imageSRC
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
    //insert code here to open file explorer
    const target = event.target as HTMLInputElement

    const file: File = (target.files as FileList)[0]
    //Storage Path
    const path =  `/Account/${Date.now()}_` + file.name
    
    //reference to storage bucket
    const ref = this.afStorage.ref(path)

    //main task 
    this.task = this.afStorage.upload(path, file)
    
    //copying the url from the prev image for deleting
    //this.prev_img = this.imageSRC

    this.snapshot = this.task.snapshotChanges().pipe(
      finalize( async() => {
        this.imageSRC = await ref.getDownloadURL().toPromise()
        this.SellerForm.patchValue({
          profileImage: {
            filename: file.name,
            contentType: file.type,
            imageBase64: this.imageSRC
          }
        });
        
        
        console.log("Here: " + JSON.stringify(this.imageSRC) );
      })
    )

  }

  onClickSave = async () => {
    
    if (this.SellerForm.invalid) {
      this.submitted = true;
      this.initForm();
    } else {
      var userdata = await this.accountService.updateUserdata(this.SellerForm.value);
      if (userdata === true) {
        this.ngOnInit()
        this.afStorage.storage.refFromURL(this.prev_img).delete();
        this.accountService.editswitch(false)
        this.imageSRC = ''
        //this.openEditAccountSellerModal = false;
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
    this.accountService.editswitch(false)
    //this.openEditAccountSellerModal = false;
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
