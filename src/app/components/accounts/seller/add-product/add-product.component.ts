import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Products } from 'src/app/models/products';
import { ProductService } from 'src/app/services/productServ';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})

export class AddProductComponent implements OnInit {
  @Input() openAddProductModal: boolean;
  @Input() openEditProductModal: boolean;
  @Input() openDeleteModal: boolean;

  submitted: boolean = false;
  productForm: FormGroup;
  file: File;
  addedFileName: string = '';

  constructor(private formBuilder: FormBuilder, private prodServ: ProductService) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      productImage: [null, Validators.required],
      productDescription: ['', Validators.required]
    });
  }
  get formControls() { return this.productForm.controls; }

  uploadFile(event: any) {
    console.log(event);
    this.file = <File>event.target.files[0];
    this.productForm.patchValue({
      artworkimage: this.file
    });
    this.productForm.get('productimage')?.updateValueAndValidity()
  }

  onClickExit = () => {
    this.prodServ.addswitch(false)
    this.submitted = false;
    this.productForm.reset();
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
    var formData: any = new FormData();
    formData.append("productName", this.productForm.get('productName')?.value);
    formData.append("productImage", this.productForm.get('productImage')?.value);
    formData.append("productDescription", this.productForm.get('productDescription')?.value);

    const artwork: Products = {
      productName: formData.get('productName')?.value,
      productImage: formData.get('productImage')?.value,
      productDescription: formData.get('productDescription')?.value,
    }
    this.prodServ.uploadProduct(artwork);
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
