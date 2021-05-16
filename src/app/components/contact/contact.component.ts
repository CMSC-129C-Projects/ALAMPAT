import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/auth';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  @Input() openRegisterModal: boolean;

  constructor(public userService: UserService, private router: Router, private route: ActivatedRoute) {
    this.openRegisterModal = false;
  }


  submitted = false;
  regSuccess = false;
  createForm: FormGroup;
  registeredUser: boolean = false;


  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  phonePattern = "^((\\+91-?)|0)?[0-9]{10}$";
  passwordPattern = "^(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$";

  ngOnInit() {
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
    if (this.createForm.invalid) {
      this.submitted = true;
      console.log("Input all the required fields");
      this.createForm.reset();
    } else {
      var reguser = await this.userService.registerUser(this.createForm.value);
      if (reguser === true) {
        this.registeredUser = false
        this.regSuccess = true;
        //this.router.navigate(['/loading'])
      }
      else {
        this.registeredUser = true
        this.submitted = true
        this.openRegisterModal = true
        this.regSuccess = false;
      }
    }
  }
  onReset() {
    this.submitted = false;
    this.createForm.reset();
  }

  onClickExit = () => {
    this.regSuccess = false;
    this.registeredUser = false
    this.openRegisterModal = false;
    this.onReset();
  }
}
