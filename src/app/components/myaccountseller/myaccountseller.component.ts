import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-myaccountseller',
  templateUrl: './myaccountseller.component.html',
  styleUrls: ['./myaccountseller.component.css']
})
export class MyaccountsellerComponent implements OnInit {
  showEditAccountSellerModal: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  onClickEditAccountSeller = () => {
    this.showEditAccountSellerModal = !this.showEditAccountSellerModal;
  }
}
