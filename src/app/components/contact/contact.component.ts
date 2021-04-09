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

  constructor(private userService: UserService) {
    this.openRegisterModal = false;
  }

  createForm = new FormGroup({});

  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  phonePattern = "^((\\+91-?)|0)?[0-9]{10}$";
  passwordPattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$";

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
      ])
    });
  }

  get name() { return this.createForm.get('name'); }
  get email() { return this.createForm.get('email'); }
  get phoneNumber() { return this.createForm.get('phoneNumber'); }
  get address() { return this.createForm.get('address'); }
  get password() { return this.createForm.get('password'); }
  get userType() { return this.createForm.get('userType'); }



  onSubmit = () => {
    const regUser: User = {
      name: this.createForm.get('name')?.value,
      email: this.createForm.get('email')?.value,
      phoneNumber: this.createForm.get('phoneNumber')?.value,
      address: this.createForm.get('address')?.value,
      password: this.createForm.get('password')?.value,
      userType: this.createForm.get('userType')?.value,
    }

    this.userService.registerUser(regUser);
    let { value } = this.createForm;
    console.log(value);
  }

  onClickExit = () => {
    this.openRegisterModal = false;
  }
}
