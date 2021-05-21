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
    if(this.isloggedIn ==='true' ){
      if(this.userType === 'buyer'){
        this.router.navigate(['/my-accounts-buyer'])
      }
      else if(this.userType === 'seller'){
        this.router.navigate(['/my-accounts-seller'])
      }
      else{
        this.router.navigate(['/welcome'])
      }
    }else{
      this.router.navigate(['/welcome'])
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
