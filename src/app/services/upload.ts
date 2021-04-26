import { Injectable, EventEmitter } from '@angular/core';
import axios from 'axios'
import { Portfolio } from '../models/Portfolio'
import { Router, ActivatedRoute } from '@angular/router';

const localAPI = 'http://localhost:3000'

interface uploadResponse {
    message: string;
    portfolioData: Portfolio;
    success: boolean;
}

@Injectable({
    providedIn: 'root',
})

export class UploadService {
    isUploaded: boolean = false;
    uploadError: string = '';

    portfolio: EventEmitter<any> = new EventEmitter();
    error: EventEmitter<any> = new EventEmitter();

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
    getPortfoliodata = () =>{
        try {
            axios.get<uploadResponse>(`${localAPI}/portfolio/`)
            .then(resp => {
                this.portfolio.emit(resp.data.portfolioData)
                
                console.log(this.portfolio);
                //return resp.data
            })
            .catch(err => {
                // Handle Error Here
                this.error.emit(err)
                console.log(err);
                //return err
            });
            

        } catch (error) {
            this.error.emit(error)
            console.log(error)
            this.uploadError = error

            //return error
        }
    }
    updatePortfoliodata = async (portfolio: Portfolio ) => {
        try {
            const response = await axios.put<uploadResponse>(`${localAPI}/portfolio/edit`, portfolio);
            const { message, success } = response.data
            //console.log(response.data)
            if (success) {
                this.isUploaded = true;
               
                console.log("Artwork Updated!")
                console.log(response.data)
                //this.router.navigate(['/registration-confirmed'])
                return this.isUploaded
                //
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
}