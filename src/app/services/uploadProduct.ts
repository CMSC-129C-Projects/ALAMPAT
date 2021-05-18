import { Injectable } from '@angular/core';
import axios from 'axios'
import { Products } from '../models/products'
import { Router} from '@angular/router';

const localAPI = 'http://localhost:3000'

interface uploadResponse {
    message: string;
    success: boolean;
}

@Injectable({
    providedIn: 'root',
})

export class UploadService {
    isUploaded: boolean = false;
    uploadError: string = '';

    constructor(private router: Router) { }

    uploadProduct = async (product: Products) => {
        try {
            const response = await axios.post<uploadResponse>(`${localAPI}/product/add`, product);
            const { message, success } = response.data
            console.log(response.data)
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
}