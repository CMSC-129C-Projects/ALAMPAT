import { Output, EventEmitter, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account';
import { DomSanitizer } from '@angular/platform-browser';
import {AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from '@angular/fire/storage';

import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-editaccountbuyer',
  templateUrl: './editaccountbuyer.component.html',
  styleUrls: ['./editaccountbuyer.component.css']
})
export class EditaccountbuyerComponent implements OnInit {
  @Input() openEditAccountBuyerModal: boolean = false;
  
  submitted: boolean = false;
  BuyerForm: FormGroup;

  user: any; // = new User;
  string64: any;
  filetype: any;
  public imageSRC : any
  userID: string = '607fe491958fa65f08f14d0e';

  task: AngularFireUploadTask;
  snapshot: Observable<any>;

  prev_img: any;

  constructor(private formBuilder: FormBuilder, 
    private cd: ChangeDetectorRef, 
    private domSanitizer: DomSanitizer,
    private afStorage: AngularFireStorage,
    private accountService: AccountService){ }

  ngOnInit(): void {
    this.accountService.getUserdata()
    this.accountService.user.subscribe((user)=>{
      this.user = user 

      this.initForm()
      //replace this when frontend is integrated to backend since it will be saved in one string
      this.imageSRC = this.user.profileImage?.imageBase64
      this.prev_img = this.imageSRC
      //console.log("User image: " + JSON.stringify(this.imageSRC))
  }, (error) => {
      console.log("Error", error)
  })

    this.BuyerForm = this.formBuilder.group ({
      profileImage: this.formBuilder.group({
        filename: [''],
        contentType: [''],
        imageBase64:[''],
      }),
      name: [''],
      email: ['', [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.pattern('^(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]],
      phoneNumber: ['', [Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      sellerDescription: [''],
      address: ['']
    });
  }
  get formControls() { return this.BuyerForm.controls; }

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
    
    this.snapshot = this.task.snapshotChanges().pipe(
      finalize( async() => {
        this.imageSRC = await ref.getDownloadURL().toPromise()
        this.BuyerForm.patchValue({
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

    if (this.BuyerForm.invalid) {
      this.submitted = true;
      this.initForm();
    } else {
      var userdata = await this.accountService.updateUserdata(this.BuyerForm.value);
      if (userdata === true) {
        this.ngOnInit()
        this.afStorage.storage.refFromURL(this.prev_img).delete();
        this.accountService.editswitch(false)
        this.imageSRC = ''
        //this.router.navigate(['/']) back to accounts page
      }
      else{
        this.initForm();
      }
    }

    //console.log("Buyer Form Data: " + JSON.stringify(this.BuyerForm.value));
    this.submitted = true;  
  }

  onClickExit = () => {
    this.accountService.editswitch(false)
    //this.openEditAccountBuyerModal = false;
    this.submitted = false;
    this.initForm()
  }

  initForm = () => {
    this.BuyerForm.reset({
      name: this.user?.name,
      email: this.user?.email,
      password: this.user?.password,
      phoneNumber: this.user?.phoneNumber,
      address: this.user?.address,
      profileImage:{
        filename: this.user?.profileImage.filename,
        contentType: this.user?.profileImage.contentType,
        imageBase64: this.user?.profileImage.imageBase64
        }
      });
  }

}