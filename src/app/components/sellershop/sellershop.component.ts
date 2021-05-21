import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sellershop',
  templateUrl: './sellershop.component.html',
  styleUrls: ['./sellershop.component.css']
})
export class SellershopComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  GotoPortfolio(){
    this.router.navigate(['/seller-portfolio'])
  }

  GotoProducts(){
    this.router.navigate(['/seller-products'])
  }

  GoToServices(){

  }

  GotoShopRating() {
    
  }
}
