import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder, public userService: UserService )  {
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['',[ Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]],
    });
  }

  // convenience getter for easy access to form fields
  get formControls() { return this.loginForm.controls; }

  login = async () => {
    console.log(this.loginForm.value);
    this.submitted = true;
    if(this.loginForm.invalid){
      return;
    }
    this.userService.login(this.loginForm.value);
  }
}
