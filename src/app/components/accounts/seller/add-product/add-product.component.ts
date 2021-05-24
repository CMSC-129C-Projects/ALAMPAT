import { Component, Input, OnInit,OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Products } from 'src/app/models/products';
import { ProductService } from 'src/app/services/productServ';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage'

import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})

export class AddProductComponent implements OnInit, OnDestroy {
  @Input() openAddProductModal: boolean;
  @Input() openEditProductModal: boolean;
  @Input() openDeleteModal: boolean;

  submitted: boolean = false;
  productForm: FormGroup;
  file: File;
  addedFileName: string = '';
  addedimagesrc: any;

  task: AngularFireUploadTask;
  snapshot: Observable<any>;
  subs: Subscription;
  subper: Subscription;
  percentage: Observable<number|undefined> = new Observable();


  url: any;
  constructor(
    private formBuilder: FormBuilder, 
    private prodServ: ProductService,
    private afStorage: AngularFireStorage,
    ) { }

  ngOnInit(): void {
    this.prodServ.getProductdata()
    this.productForm = this.formBuilder.group({
      productImage: this.formBuilder.group({
        filename: [''],
        contentType: [''],
        imageBase64:[''],
      }, {Validators: [Validators.required]} ),
      category: ['Product'],
      productName: ['', Validators.required],
      productDescription: ['', Validators.required],
      stock: ['', Validators.required, Validators.min(1), Validators.max(100)],
      price: ['', Validators.required],
    });
  }
  get formControls() { return this.productForm.controls; }

  ngOnDestroy(): void {

  }

  uploadFile(event: Event) {
    const target = event.target as HTMLInputElement

    const file: File = (target.files as FileList)[0]
    //Storage Path
    const path =  `/Products/${Date.now()}_` + file.name
    
    //reference to storage bucket
    const ref = this.afStorage.ref(path)

    //main task 
    this.task = this.afStorage.upload(path, file)

    //upload progress monitoring
    this.percentage = this.task.percentageChanges() ;
    

    this.snapshot = this.task.snapshotChanges().pipe(
      finalize( async() => {
        this.url = await ref.getDownloadURL().toPromise()
        this.productForm.patchValue({
          productImage: {
            filename: file.name,
            contentType: file.type,
            imageBase64: this.url
          }
        });
        this.addedFileName = file.name
        
        this.addedimagesrc = this.url
        
        console.log("Here: " + JSON.stringify(this.url) );
      })
    )

  }

  onClickExit = () => {
    
    this.submitted = false;
    this.productForm.reset();
    this.percentage = new Observable()
    this.snapshot = new Observable()
    if(this.openAddProductModal){
      this.prodServ.addswitch(false)
      this.addedFileName = ''
      if(this.addedimagesrc){
        this.afStorage.storage.refFromURL(this.addedimagesrc).delete();
      }
    }
    if(this.openEditProductModal) {
      this.openEditProductModal = !this.openEditProductModal;
    }
    if(this.openDeleteModal) {
      this.openDeleteModal = !this.openDeleteModal;
    }
  }
  

  // onClickEditArtwork (item: any) {
  //   //console.log("Passed Item: "+ JSON.stringify(item))
  //   this.uploadService.selectArt(item)
  //   this.showEditArtworkModal = !this.showEditArtworkModal;
  // }

  addProduct = async () => {
    console.log(this.productForm.value);
    this.submitted = true;
    if (this.productForm.invalid) {
      return;
    }
    const artwork: Products = {
      productName: this.productForm.get('productName')?.value,
      productImage: this.productForm.get('productImage')?.value,
      productDescription: this.productForm.get('productDescription')?.value,
      stock: this.productForm.get('stock')?.value,
      price: this.productForm.get('price')?.value,
    }
    this.prodServ.uploadProduct(artwork);
    this.prodServ.addswitch(false)
    this.productForm.reset();
    this.ngOnInit()
    this.percentage = new Observable();
    this.snapshot = new Observable();
    this.addedFileName = '';
    this.addedimagesrc = '';
    //this.userService.login(this.loginForm.value);
  }
  // onClickDelete (item: any, index: any) {
  //   this.openDeleteModal = !this.openDeleteModal;
  //   this.itemID = item._id;
  //   this.item = item;
  //   this.index = index;
  //   this.imageSRC = this.portfolioList[index].images.imageBase64;
  // }

  // onClickSureDelete () {
  //   this.afStorage.storage.refFromURL(this.imageSRC).delete();
  //   this.uploadService.selectArt(this.item);
  //   this.uploadService.deletePortfoliodata(this.itemID);
  //   //console.log(this.index);
  //   if(this.index !== -1) {
  //     this.portfolioList.splice(this.index, 1);
  //   }
  //   this.openDeleteModal = false;
  // }
}
