import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/auth'

@Component({
  selector: 'app-headerseller',
  templateUrl: './headerseller.component.html',
  styleUrls: ['./headerseller.component.css']
})
export class HeadersellerComponent implements OnInit {

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
}
