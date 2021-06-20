import { Component, OnInit, Input } from '@angular/core';
import { OrderService } from 'src/app/services/order';

@Component({
  selector: 'app-orderdetailsbuyer',
  templateUrl: './orderdetailsbuyer.component.html',
  styleUrls: ['./orderdetailsbuyer.component.css']
})
export class OrderdetailsbuyerComponent implements OnInit {
  @Input() openOrderDetailsModal: boolean;

  constructor(private orderserv: OrderService) { }

  ngOnInit(): void {
  }

  //Function when the modal exits or cancels
  onClickExit () {
    if(this.openOrderDetailsModal) {
      this.orderserv.detailsswitch(false)
    }
  }

}
