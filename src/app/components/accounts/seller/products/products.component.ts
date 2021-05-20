import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from 'src/app/services/productServ';
import { Subscription } from 'rxjs';

interface product{
  _id?: string;
  productname: string;
  images:{
    filename: string;
    contentType: string;
    imageBase64: string;
  }
  description: string;
  stock: number;
  price: number;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})

export class ProductsComponent implements OnInit, OnDestroy {
  showAddProductModal: boolean = false;
  showEditProductModal: boolean = false;
  openImageModal: boolean = false;
  showDeleteModal: boolean = false;

  productList: product[] = []

  subs: Subscription[] = []
  // showDeleteModal: boolean = false;
  constructor(private prodServ: ProductService){ 
    this.prodServ.getProductdata()
    
    this.subs.push(
      this.prodServ.showAddmodal.subscribe( x =>
        this.showAddProductModal = x
      )
    )
  }

  ngOnInit(): void {
    this.subs.push(
      this.prodServ.productlist.asObservable().pipe().subscribe((products)=>{
        this.productList = products;
        //console.log("Portfolio: " + JSON.stringify(this.portfolioList))
      }, (error) => {
        console.log("Error", error)
      })
    )
  }

  ngOnDestroy(): void {
    this.subs.forEach( sub => sub.unsubscribe())
  }

  // onClickOpen (item:any, index:any) {
  //   this.openImageModal = true;
  //   this.imageSRC = this.productList[index].images.imageBase64;
  // }
  onClickAddProduct = () => {
    this.showAddProductModal = !this.showAddProductModal;
  }
  onClickEditProduct = () => {
    this.showEditProductModal = !this.showEditProductModal;
  }
  onClickDelete () {
    this.showDeleteModal = !this.showDeleteModal;
    // this.itemID = item._id;
    // this.item = item;
    // this.index = index;
    // this.imageSRC = this.portfolioList[index].images.imageBase64;
  }
  onExit = () => {
    if(this.showDeleteModal) {
      this.showDeleteModal = false;
    }
  }

}
