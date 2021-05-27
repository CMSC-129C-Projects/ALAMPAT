import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/auth'

@Component({
  selector: 'app-headerbuyer',
  templateUrl: './headerbuyer.component.html',
  styleUrls: ['./headerbuyer.component.css']
})
export class HeaderbuyerComponent implements OnInit {

  constructor(
    private router: Router,
    private auth: UserService,
  ) { }

  ngOnInit(): void {
  }
  
  Logout(){
    this.auth.logout()
    this.router.navigate(['/'])
  }

  GotoMarketPlace(){
      localStorage.setItem('reload', 'true')
      localStorage.removeItem('curr_category')
      localStorage.removeItem('searched_item')
      this.router.navigate(['/marketplace'])
  }
}
