import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/services/auth';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  @Input() openRegisterModal: boolean;

  constructor(public userService: UserService, private router: Router) {
    this.openRegisterModal = false;
  }

  createForm = new FormGroup({});
  submitted = false;
  registeredUser: boolean = false;
  regSuccess = false;

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

      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(this.passwordPattern)
      ]),
      userType: new FormControl('', [
        Validators.required,
      ]),

    });
  }

  get name() { return this.createForm.get('name'); }
  get email() { return this.createForm.get('email'); }
  get phoneNumber() { return this.createForm.get('phoneNumber'); }
  
  get password() { return this.createForm.get('password'); }
  get userType() { return this.createForm.get('userType'); }

  onSubmit = async () => {
    if(this.createForm.invalid){
      this.submitted = true;
      console.log("Input all the required fields");
      this.createForm.reset();

    } else{
      const regUser: User = {
        name: this.createForm.get('name')?.value,
        email: this.createForm.get('email')?.value,
        phoneNumber: this.createForm.get('phoneNumber')?.value,
        address: '',
        password: this.createForm.get('password')?.value,
        userType: this.createForm.get('userType')?.value,
      }
      var reguser = await this.userService.registerUser(regUser);
      if(reguser === true){
        this.registeredUser = false
        this.regSuccess = true;
        //this.router.navigate(['/loading'])
      }
      else{
        this.registeredUser = true
        this.submitted = true
        this.openRegisterModal = true

        this.regSuccess = false;
      }
    }
  }

  onReset() {
    this.submitted = true;
    this.createForm.reset();
  }

  onClickExit = () => {
    this.regSuccess = false;
    this.registeredUser = false
    this.openRegisterModal = false;
  }
}
