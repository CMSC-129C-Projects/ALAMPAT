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
  openDeleteModal: boolean = false;
  sureDeleteModal: boolean = false;

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
  onClickExit () {
    if(this.openImageModal) {
      this.openImageModal = false;
      // this.showed = false;
      // this.imageSRC = '';
    }
    if(this.openDeleteModal) {
      this.openDeleteModal = false;
    }
  }
  onClickDelete () {
    this.openDeleteModal = !this.openDeleteModal;
    // this.itemID = item._id;
    // this.item = item;
    // this.index = index;
    // this.imageSRC = this.portfolioList[index].images.imageBase64;
  }

  onClickSureDelete () {
    // this.afStorage.storage.refFromURL(this.imageSRC).delete();
    // this.uploadService.selectArt(this.item);
    // this.uploadService.deletePortfoliodata(this.itemID);
    // //console.log(this.index);
    // if(this.index !== -1) {
    //   this.portfolioList.splice(this.index, 1);
    // }
    this.openDeleteModal = false;
  }

}
