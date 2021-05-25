import { Component, Input, OnInit,OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Products } from 'src/app/models/products';
import { ProductService } from 'src/app/services/productServ';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage'

import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

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
  category: string;
}
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})

export class AddProductComponent implements OnInit, OnDestroy {
  @Input() openAddProductModal: boolean;
  @Input() openEditProductModal: boolean;
  @Input() openSuccessModal: boolean;

  submitted: boolean = false;
  productForm: FormGroup;
  editForm: FormGroup;
  file: File;

  //variables for edit product modal 
  filename: string ='';
  imagesrc: any;
  prev_image: any;
  saved: boolean;

  //variables for add product modal
  addedFileName: string = '';
  addedimagesrc: any;

  task: AngularFireUploadTask;
  snapshot: Observable<any>;
  subs: Subscription;
  percentage: Observable<number|undefined> = new Observable();


  url: any;
  prod: product;
  showEditArtworkModal: boolean;
  constructor(
    private formBuilder: FormBuilder, 
    private prodServ: ProductService,
    private afStorage: AngularFireStorage,
    ) {
      
     }

  ngOnInit(): void {
    this.prodServ.getProductdata()

    this.subs = this.prodServ.productSource.asObservable().subscribe(currProd =>{

      this.prod = currProd
      //this.fileName = this.artwork.images.filename
      //this.imagesrc = this.prod.images.imageBase64
      this.prev_image = this.prod.images.imageBase64
      this.initForm()
      console.log("Selected Product: " + JSON.stringify(this.prod))
    })
    
    this.productForm = this.formBuilder.group({
      productImage: this.formBuilder.group({
        filename: [''],
        contentType: [''],
        imageBase64:[''],
      }, {Validators: [Validators.required]} ),
      category: ['Product'],
      productName: ['', Validators.required],
      productDescription: ['', Validators.required],
      stock: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      price: ['', Validators.required],
    });

    this.editForm = this.formBuilder.group({
      productImage: this.formBuilder.group({
        filename: [''],
        contentType: [''],
        imageBase64:[''],
      }, {Validators: [Validators.required]} ),
      category: ['Product'],
      productName: ['', Validators.required],
      productDescription: ['', Validators.required],
      stock: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      price: ['', Validators.required],
    });
  }

  get formControls() { return this.productForm.controls; }
  

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  //upload file function for adding product
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

  //upload file function for editing product
  uploadFile_edit(event: Event) {
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
        this.editForm.patchValue({
          productImage: {
            filename: file.name,
            contentType: file.type,
            imageBase64: this.url
          }
        });
        this.filename = file.name
        
        this.imagesrc = this.url
        
        console.log("Here: " + JSON.stringify(this.url) );
      })
    )

  }

  onClickExit = () => {
    
    this.submitted = false;
    
    this.percentage = new Observable()
    this.snapshot = new Observable()

    if(this.openAddProductModal){
      this.productForm.reset()
      this.prodServ.addswitch(false)
      this.addedFileName = ''
      if(this.addedimagesrc){
        this.afStorage.storage.refFromURL(this.addedimagesrc).delete();
      }
      this.addedFileName = ''
      this.addedimagesrc = ''
    }
    if(this.openEditProductModal) {
      this.editForm.reset()
      if(this.imagesrc!== this.prev_image && this.imagesrc){
        this.afStorage.storage.refFromURL(this.imagesrc).delete();
      }
      this.imagesrc = '';
      this.prev_image = '';

      this.saved = false;
      this.prodServ.editswitch(false)
    }
  }
  

  addProduct = () => {
    this.productForm.patchValue({"category": 'Product'}),
  
    console.log(this.productForm.value);
    this.submitted = true;
    if (this.productForm.invalid) {
      return;
    }
    const product: Products = {
      productName: this.productForm.get('productName')?.value,
      productImage: this.productForm.get('productImage')?.value,
      productDescription: this.productForm.get('productDescription')?.value,
      category: this.productForm.get('category')?.value,
      stock: this.productForm.get('stock')?.value,
      price: this.productForm.get('price')?.value,
    }
    this.prodServ.uploadProduct(product);
    this.prodServ.addswitch(false)
    this.productForm.reset();
    this.ngOnInit()
    this.percentage = new Observable();
    this.snapshot = new Observable();
    this.addedFileName = '';
    this.addedimagesrc = '';
    //this.userService.login(this.loginForm.value);
  }
  
  save_ProductChanges  = async ()=> {
    if (this.editForm.invalid) {
      this.saved = true;
      this.initForm();
    } else {
      

      const proddata = await this.prodServ.updateProductdata(this.editForm.value, this.prod._id);
      if (proddata) {
        //console.log("On Save Art: " + JSON.stringify(this.editForm))
        //this.portfolioForm.get('artowkimage')?.reset();
        if(this.imagesrc != this.prev_image && this.prev_image){
          this.afStorage.storage.refFromURL(this.prev_image).delete();
        }
        //this.afStorage.storage.refFromURL(this.prev_image).delete();
        this.prev_image = '';
        this.ngOnInit();
        //this.portfolioForm.reset();
        this.saved = true
        this.percentage = new Observable()
        this.snapshot = new Observable()
        this.filename = '';
        this.imagesrc = '';
        this.prodServ.editswitch(false)
        
      }
      else{
        this.initForm();
      }
      
    }
  }

  initForm = () => {
    this.editForm.reset({
      productName: this.prod.productname,
      productDescription: this.prod?.description,
      productImage:{
        filename: this.prod?.images.filename,
        contentType: this.prod?.images.contentType,
        imageBase64: this.prod?.images.imageBase64
        },
      category:this.prod?.category,
      stock:this.prod?.stock,
      price:this.prod?.price
      });
  }

}
