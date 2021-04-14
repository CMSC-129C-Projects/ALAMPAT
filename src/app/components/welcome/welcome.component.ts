import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  showSignUp: boolean = false;
  showLogin: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }
  onClickSignUp = () => {
    this.showSignUp = !this.showSignUp;
  }

 
}
