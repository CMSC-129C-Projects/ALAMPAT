import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Products } from 'src/app/models/products';
import { UploadService } from 'src/app/services/uploadProduct';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  @Input() openAddProductModal: boolean;
  submitted: boolean = false;
  productForm: FormGroup;
  file: File;

  constructor(private formBuilder: FormBuilder, public uploadService: UploadService) { }

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
    this.openAddProductModal = false;
    this.submitted = false;
    this.productForm.reset();
  }

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
    this.uploadService.uploadProduct(artwork);
    //this.userService.login(this.loginForm.value);
  }

}
