import { Component, OnInit } from '@angular/core';
import { MarketService } from 'src/app/services/market';
@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css']
})
export class MarketplaceComponent implements OnInit {

  marketdata: any[];
  constructor(
    private marketserv: MarketService
  ) { }

  ngOnInit(): void {
    this.marketserv.getMarket().subscribe( items => {
      this.marketdata  = items
    })
  }

}
