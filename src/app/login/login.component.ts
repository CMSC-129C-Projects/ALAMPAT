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
 
  //returnUrl: string;

  constructor(private formBuilder: FormBuilder, private userService: UserService) {
 
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required, Validators.email],
      password: ['', Validators.required],
    });

    // get return url from route parameters or default to '/'
    //this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get formControls() { return this.loginForm.controls; }

  login () {
    console.log(this.loginForm.value);
    this.submitted = true;
    if(this.loginForm.invalid){
      return;
    }
    this.userService.login(this.loginForm.value);
    //this.router.navigateByUrl('/admin');
  }

  

}
