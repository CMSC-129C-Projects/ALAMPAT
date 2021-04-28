import { Injectable, EventEmitter } from '@angular/core';
import axios from 'axios'
import { Portfolio } from '../models/Portfolio'
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

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
    pseudo_art: any;
    isUploaded: boolean = false;
    userID: string = '607fe491958fa65f08f14d0e';
    artworkID: string = '6087e77a8431c85ee8f081dc';
    uploadError: string = '';

    private artSource = new BehaviorSubject<any>({});
    //currArt = this.artSource.asObservable();
    currArt: EventEmitter<any> = new EventEmitter();

    portfolio: EventEmitter<any> = new EventEmitter();
    error: EventEmitter<any> = new EventEmitter();


    constructor(private router:Router,
        private domSanitizer: DomSanitizer, 
        ) { }

    selectArt(art: any) {
        //console.log("Passed art: "+ JSON.stringify(art))
        this.currArt.emit(art)
    }

    uploadPortfolio = async (portfolio: Portfolio) => {
        console.log('in get portfolio')
        try {
            const response = await axios.post<uploadResponse>(`${localAPI}/seller/${this.userID}/addportfolio`, portfolio);
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
            axios.get(`${localAPI}/seller/${this.userID}/portfolio`)
            .then(resp => {
                this.portfolio.emit(resp.data.portfolioArray)
                
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
    updatePortfoliodata = async (portfolio: Portfolio, id: any ) => {
        try {
            const response = await axios.patch(`${localAPI}/seller/${this.userID}/editportfolio/${id}`, portfolio);
            const { message, success } = response.data
            //console.log(response.data)
            if (success) {
                this.isUploaded = true;
                //this.pseudo_art = response.data.result
                
                //this.pseudo_art.images.imageBase64 =  this.domSanitizer.bypassSecurityTrustUrl(response.data.result.images.imageBase64)
                //console.log("Pseudo_art: " + JSON.stringify(this.pseudo_art))
                //this.currArt.emit(this.pseudo_art)
                console.log("Artwork Updated!")
                
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