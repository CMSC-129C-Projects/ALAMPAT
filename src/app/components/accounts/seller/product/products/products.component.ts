import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from 'src/app/services/productServ';
import { Subscription, BehaviorSubject } from 'rxjs';
import {AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from '@angular/fire/storage';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SortService } from 'src/app/services/sortingService';

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
  showShortDesciption: boolean;
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
  showShortDesciption = true;

  option: string|null = "" ;
  sortForm: FormGroup

  @Input() productList: product[] = [];
  @Input() soldoutList: product[] = [];
  subs: Subscription[] = [];

  imageSRC: any;
  itemID: string;
  item: any;
  index: any;
  products: any;

  // showDeleteModal: boolean = false;
  constructor(
    private prodServ: ProductService,
    private afStorage: AngularFireStorage,
    private formBuilder: FormBuilder,
    private sortserv: SortService,
    ) {
    
    this.subscribebuttons()
  }

  ngOnInit(): void {
    
    this.sortForm = this.formBuilder.group({
      button: ['--Select Choice--']
    });
    this.subscribeProducts()
      //for sort Form
   

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

  get formControls() { return this.sortForm.controls; }

  subscribeProducts(){
    if("sort_prod" in localStorage){
      this.sortForm.patchValue({
        button: localStorage.getItem('sort_prod')
      })
      this.option = localStorage.getItem('sort_prod')
    }
    
    this.subs.push(
      this.prodServ.getProductdata().subscribe( prods =>{
        this.soldoutList = [];
        this.productList = []; 
        prods.data.productsArray.forEach((item:product) => {
          if (item.stock == 0) {
            this.soldoutList.push(item);
          }
          if(item.stock > 0) {
            this.productList.push(item);
          }
        })
        this.selectSortOption(this.option)
        //this.productList = products.productsArray
        //console.log("Products: " + JSON.stringify(this.productList))
      })
    )
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe())
    localStorage.removeItem('sort_prod')
  }

  alterDescriptionText(i) {
    const tabs = document.querySelectorAll('.tabs li');
    //this.curr_tab = tabs
    //console.log("Error", tabs)

    tabs.forEach((tab:any) => {
      if(tab.dataset.target == 'product-live' && tab.classList.value == 'is-active'){
        this.productList[i].showShortDesciption = ! this.productList[i].showShortDesciption
        return
      }
      if(tab.dataset.target =='product-soldout' && tab.classList.value == 'is-active'){
        //console.log("I am in soldout")
        this.soldoutList[i].showShortDesciption = ! this.soldoutList[i].showShortDesciption
      }
    })
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
    if(this.imageSRC){
      this.afStorage.storage.refFromURL(this.imageSRC).delete().catch(error=> {
        console.error(error)
      });
    }
    
    this.prodServ.selectProduct(this.item);
    this.prodServ.deleteProductdata(this.itemID);
    
    this.productList.forEach(x =>{
      if(this.itemID == x._id){
        if(this.index !== -1) {
          this.productList.splice(this.index, 1);
        }
      }
    })
    this.soldoutList.forEach(x =>{
      if(this.itemID == x._id){
        if(this.index !== -1) {
          this.soldoutList.splice(this.index, 1);
        }
      }
    })
    
    this.openDeleteModal = false;
  }

  reloadPage(refresh: boolean){
    
    if(refresh == true){
      this.subs.forEach(sub => sub.unsubscribe())
      //this.prodServ.getProductdata()
      this.ngOnInit()
      this.subscribebuttons()
    }
  }

  Orderby(event: Event){
    const option = event.target as HTMLInputElement
    this.option = option.value
    localStorage.setItem('sort_prod', option.value)
    this.subscribeProducts()
   
  }

  subscribebuttons(){
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

  selectSortOption(option:string|null){
    if(option == "Alphabetical"){
      this.productList.sort(this.sortserv.getStrAscendingSortOrder("productname"))
      this.soldoutList.sort(this.sortserv.getStrAscendingSortOrder("productname"))
    }
    if(option == "Date Created"){
      this.productList.sort(this.sortserv.getTimeAscendingSortOrder("createdAt"))
      this.soldoutList.sort(this.sortserv.getTimeAscendingSortOrder("createdAt"))
    }
    if(option == "Date Modified"){
      this.productList.sort(this.sortserv.getTimeDescendingSortOrder("updatedAt"))
      this.soldoutList.sort(this.sortserv.getTimeDescendingSortOrder("updatedAt"))
    }
  }
}
