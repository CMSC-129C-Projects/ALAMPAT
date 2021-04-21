import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/services/auth';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  @Input() openRegisterModal: boolean;

  constructor(public userService: UserService,) {
    this.openRegisterModal = false;
  }

  createForm: FormGroup;
  submitted: boolean = false;
  registeredUser: boolean = false;

  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  phonePattern = "^((\\+91-?)|0)?[0-9]{10}$";
  passwordPattern = "^(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$";

  ngOnInit(): void {
    this.createForm = new FormGroup({
      name: new FormControl('', [
        Validators.required
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(this.emailPattern)
      ]),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(this.phonePattern)
      ]),
      address: new FormControl('', [
        Validators.required
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(this.passwordPattern)
      ]),
      userType: new FormControl('', [
        Validators.required,
      ]),
      agreeBox: new FormControl('', [
        Validators.required
      ])
    });
  }

  get name() { return this.createForm.get('name'); }
  get email() { return this.createForm.get('email'); }
  get phoneNumber() { return this.createForm.get('phoneNumber'); }
  get address() { return this.createForm.get('address'); }
  get password() { return this.createForm.get('password'); }
  get userType() { return this.createForm.get('userType'); }

  get formControls() { return this.createForm.controls };

  onSubmit = () => {
    console.log(this.createForm.value);
    this.submitted = true;
    if(this.createForm.invalid){
      return;
    }
    this.userService.registerUser(this.createForm.value);
  }

  onReset() {
    this.submitted = false;
    this.createForm.reset();
  }

  onClickExit = () => {
    this.openRegisterModal = false;
  }
}
