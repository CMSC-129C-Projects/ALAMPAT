import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  showAddProductModal: boolean = false;
  // showDeleteModal: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }
  onClickAddProduct = () => {
    this.showAddProductModal = !this.showAddProductModal;
  }
  // onClickDelete = () => {
  //   this.showDeleteModal = !this.showDeleteModal;
  // }

}
