import { Output, EventEmitter, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account';
import { DomSanitizer } from '@angular/platform-browser';

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

  constructor(private formBuilder: FormBuilder, private cd: ChangeDetectorRef, private domSanitizer: DomSanitizer,private accountService: AccountService) { }

  ngOnInit(): void {
    this.accountService.getUserdata()
    this.accountService.user.subscribe((user)=>{
      this.user = user 

      this.initForm()
      //replace this when frontend is integrated to backend since it will be saved in one string
      this.imageSRC = this.domSanitizer.bypassSecurityTrustUrl(this.user.profileImage?.imageBase64)
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
        
        this.BuyerForm.patchValue({
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

    if (this.BuyerForm.invalid) {
      this.submitted = true;
      this.initForm();
    } else {
      var userdata = await this.accountService.updateUserdata(this.BuyerForm.value);
      if (userdata === true) {
        this.ngOnInit()
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
    this.openEditAccountBuyerModal = false;
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