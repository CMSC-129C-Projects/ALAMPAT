import { Injectable, EventEmitter, } from '@angular/core';
import axios from 'axios'
import { Products } from '../models/products'
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';


const localAPI = 'https://alampat.herokuapp.com'

interface uploadResponse {
    message: string;
    success: boolean;
}

@Injectable({
    providedIn: 'root',
})

export class ProductService {
    selectArt(item: any) { //unsa ni?
        throw new Error('Method not implemented.');
    }
    isUploaded: boolean = false;
    isDeleted: boolean = false;
    uploadError: string = '';
    productSource = new Subject<any>();
    productlist = new Subject<any>();
    showAddmodal: EventEmitter<boolean> = new EventEmitter();
    showEditmodal: EventEmitter<boolean> = new EventEmitter();

    userID: string | null = '607fe491958fa65f08f14d0e';

    constructor(private router: Router, private domSanitizer: DomSanitizer) {

    }

    refresh(): Observable<any> {
        return this.productSource.asObservable();
    }

    addswitch(resp: boolean) {
        this.showAddmodal.emit(resp)
    }
    selectProduct(product: any) {
        this.productSource.next(product);
    }
    editswitch(resp: boolean) {
        this.showEditmodal.emit(resp)
    }

    uploadProduct = async (product: Products) => {
        try {
            this.userID = localStorage.getItem('id')
            const response = await axios.post<uploadResponse>(`${localAPI}/seller/${this.userID}/addproduct`, product);
            const { message, success } = response.data
            console.log(JSON.stringify(response.data))
            if (success) {
                this.isUploaded = true;
            } else {
                this.isUploaded = false;
                this.uploadError = 'Something went wrong'
            }
        } catch (error) {
            console.log(error)
            this.uploadError = error
        }
    }
    updateProductdata = async (product: Products, id: any) => {
        try {
            this.userID = localStorage.getItem('id')
            const response = await axios.patch(`${localAPI}/seller/${this.userID}/editproduct/${id}`, product);
            const { message, success } = response.data
            //console.log(response.data)
                if (success) {
                this.isUploaded = true;

                console.log("Product Updated!" + response.data.result)

                return this.isUploaded

            } else {
                this.isUploaded = false;

                console.log(" Update failed: " + response.data)
                return this.isUploaded
            }

        } catch (error) {
            this.isUploaded = false
            console.log(error)
            return this.isUploaded;
        }
    }

    getProductdata() {
        try {
            this.userID = localStorage.getItem('id')
            axios.get(`${localAPI}/seller/${this.userID}/product`)
                .then(resp => {
                    this.productlist.next(resp.data.productsArray)

                    //console.log("Get prodlist " + JSON.stringify(resp.data.productsArray));
                })
                .catch(err => {
                    console.log(err);
                });

        } catch (error) {
            console.log(error)
            this.uploadError = error
        }
    }
    deleteProductdata = async (id: any) => {
        try {
            this.userID = localStorage.getItem('id')
            const response = await axios.delete(`${localAPI}/seller/${this.userID}/removeproduct/`, { data: { _id: id } });
            const { message, success } = response.data
            console.log(response.data)
            if (success) {
                this.isDeleted = true;
                console.log("Product Deleted!" + JSON.stringify(response.data))

                return this.isDeleted

            } else {
                this.isDeleted = false;
                console.log(" Deletion failed: " + response.data)

                return this.isDeleted
            }

        } catch (error) {
            this.isDeleted = false
            console.log(error)
            console.log("faaaill")
            return this.isDeleted;
        }
    }
}