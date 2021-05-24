import { Injectable, EventEmitter,  } from '@angular/core';
import axios from 'axios'
import { Products } from '../models/products'
import { Router} from '@angular/router';
import { Observable, BehaviorSubject, Subject } from 'rxjs';

const localAPI = 'http://localhost:3000'

interface uploadResponse {
    message: string;
    success: boolean;
}

@Injectable({
    providedIn: 'root',
})

export class ProductService {
    isUploaded: boolean = false;
    uploadError: string = '';

    productlist = new Subject<any>();
    showAddmodal: EventEmitter<boolean> = new EventEmitter();
    showEditmodal: EventEmitter<boolean> = new EventEmitter();

    userID: string|null = '607fe491958fa65f08f14d0e';

    constructor(private router: Router){
        
    }

    addswitch(resp: boolean){
        this.showAddmodal.emit(resp)
    }

    editswitch(resp: boolean){
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

    getProductdata() {
        try {
            this.userID = localStorage.getItem('id')
            axios.get(`${localAPI}/seller/${this.userID}/product`)
            .then(resp => {
                this.productlist.next(resp.data)
                
                console.log("Get prodlist " + JSON.stringify(resp.data));  
            })
            .catch(err => { 
                console.log(err);
            });

        } catch (error) {
            console.log(error)
            this.uploadError = error
        }
    }
}