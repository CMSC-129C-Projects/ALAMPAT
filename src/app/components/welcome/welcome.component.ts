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

  isloggedIn: string|null;
  userType: string|null;

  constructor(private router: Router){ 
    this.isloggedIn = localStorage.getItem('isloggedIn')
    this.userType = localStorage.getItem('userType')
  }

  ngOnInit(): void {
    if(this.isloggedIn){
      if(this.userType === 'buyer'){
        this.router.navigate(['/my-account-buyer'])
      }
      if(this.userType === 'seller'){
        this.router.navigate(['/my-account-seller'])
      }
      this.router.navigate(['/'])
    }else{
      this.router.navigate(['/'])
    }
    
  }

  public navigateToLogin(section: string) {
    window.location.hash = '';
    window.location.hash = section;
}

  onClickSignUp = () => {
    this.showSignUp = !this.showSignUp;
  }

 
}
