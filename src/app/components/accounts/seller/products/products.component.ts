import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from 'src/app/services/productServ';
import { Subscription } from 'rxjs';
import {AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from '@angular/fire/storage';

interface product {
  _id?: string;
  productname: string;
  description: string;
  stock: number;
  price: number;
  images: {
    filename: string;
    contentType: string;
    imageBase64: string;
  };
  category:string;
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
  showed: boolean = false;

  @Input() productList: product[] = [];
  @Input() soldoutList: product[] = [];
  subs: Subscription[] = [];

  imageSRC: any;
  itemID: any;
  item: any;
  index: any;
  products: any;

  // showDeleteModal: boolean = false;
  constructor(private prodServ: ProductService,
    private afStorage: AngularFireStorage) {
    //Refresh
    this.subs.push(
      this.prodServ.refresh().subscribe((m:any) => {
      //this.prodServ.getProductdata()
      console.log(m);
      this.ngOnInit();
      })
    )
    //Add
    this.subs.push(
      this.prodServ.showAddmodal.subscribe((x) => {
        this.showAddProductModal = x
      })
    )
    //Edit
    this.subs.push(
      this.prodServ.showEditmodal.subscribe((x) => {
        this.showEditProductModal = x
      })
    )
  }

  ngOnInit(): void {
    this.prodServ.getProductdata()
    this.subs.push(
      this.prodServ.productlist.asObservable().subscribe((prod) => {
        //put items to sold out array dugay kaayo mu load ssksksk
        //lagi maglisod sad ko build balik, nihinay guro internet ni casey 
        //hakdog ng forEach
        //anu raw what is wrong
        this.soldoutList = [];
        this.productList = []; 
        prod.forEach((item:product) => {
          if (item.stock == 0) {
            this.soldoutList.push(item);
          }
          if(item.stock > 0) {
            this.productList.push(item);
          }
        })
        //this.productList = products.productsArray
        //console.log("Products: " + JSON.stringify(this.productList))
      }, (error) => {
        console.log("Error", error)
      })
    )
    //For Tabs
    const tabs = document.querySelectorAll('.tabs li');
    const tabContentBoxes = document.querySelectorAll('#tab-content > div');

    tabs.forEach((tab: any) => {
      tab.addEventListener('click', () => {
        tabs.forEach(item => item.classList.remove('is-active'))
        tab.classList.add('is-active');

        const target = tab.dataset.target;
        tabContentBoxes.forEach( box => {
          console.log(target);
          if (box.getAttribute('id') == target) {
            box.classList.remove('is-hidden');
          } else {
            box.classList.add('is-hidden');
          }
        });
      })
    })
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe())
  }

  onClickOpen(item: any, index: any, tabId: any) {
    this.openImageModal = true;
    if(tabId == 0) {
      this.imageSRC = this.productList[index].images.imageBase64;
    } else {
      this.imageSRC = this.soldoutList[index].images.imageBase64;
    }
  }

  onClickAddProduct = () => {
    this.prodServ.addswitch(true)
    //this.showAddProductModal = !this.showAddProductModal;
  }

  onClickEditProduct = (item: any) => {
    this.prodServ.selectProduct(item);
    this.prodServ.editswitch(true)
    console.log("Product selected: " + JSON.stringify(item))
    // this.showEditProductModal = !this.showEditProductModal;
  }
  onClickExit() {
    if (this.openImageModal) {
      this.openImageModal = false;
      // this.showed = false;
      // this.imageSRC = '';
    }
    if (this.openDeleteModal) {
      this.openDeleteModal = false;
    }
  }
  onClickDelete(item:any, index:any) {
    this.openDeleteModal = !this.openDeleteModal;
    this.itemID = item._id;
    this.item = item;
    this.index = index;
    this.imageSRC = this.productList[index].images.imageBase64;
  }

  onClickSureDelete() {
    this.afStorage.storage.refFromURL(this.imageSRC).delete();
    this.prodServ.selectProduct(this.item);
    this.prodServ.deleteProductdata(this.itemID);
    
    if(this.index !== -1) {
      this.productList.splice(this.index, 1);
    }
    this.openDeleteModal = false;
  }

}
