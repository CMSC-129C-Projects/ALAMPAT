import { Injectable } from '@angular/core';
import axios from 'axios'
import { Portfolio } from '../models/Portfolio'
import { Router, ActivatedRoute } from '@angular/router';

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

    constructor(private router:Router) { }

    uploadPortfolio = async (portfolio: Portfolio) => {
        try {
            const response = await axios.post<uploadResponse>(`${localAPI}/portfolio/add`, portfolio);
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