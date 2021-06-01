import { Injectable, EventEmitter } from '@angular/core';
import axios from 'axios'
import { Portfolio } from '../models/Portfolio'
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { tap } from 'rxjs/operators';
import Axios from 'axios-observable';

const localAPI = 'https://alampat.herokuapp.com'

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
    isDeleted: boolean = false;
    userID: string | null;
    artworkID: string = '6087e77a8431c85ee8f081dc';
    uploadError: string = '';

    artSource = new Subject<any>();
    //currArt = this.artSource.asObservable();
    //currArt: EventEmitter<any> = new EventEmitter();
    //portfolio: EventEmitter<any> = new EventEmitter();
    showAdd: EventEmitter<boolean> = new EventEmitter();
    showEdit: EventEmitter<boolean> = new EventEmitter();
    portfolio = new Subject<any>();
    //error: EventEmitter<any> = new EventEmitter();

    constructor(private router:Router,
        private domSanitizer: DomSanitizer, 
        ) {
            
         }
    

    refresh(): Observable<any> {
        return this.artSource.asObservable();
    }

    addswitch(resp: boolean){
        this.showAdd.emit(resp)
    }

    editswitch(resp: boolean){
        this.showEdit.emit(resp)
    }

    selectArt(art: any) {
  
        this.artSource.next(art);
    }

    uploadPortfolio = async (portfolio: Portfolio) => {
        console.log('in get portfolio')
        try {
            this.userID = localStorage.getItem('id')
            const response = await axios.post<uploadResponse>(`${localAPI}/seller/${this.userID}/addportfolio`, portfolio)
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
  
    
    getPortfoliodata(): Observable<any>{
        try {
            this.userID = localStorage.getItem('id')
            // axios.get(`${localAPI}/seller/${this.userID}/portfolio`)
            // .then(resp => {
            //     this.portfolio.next(resp.data.portfolioArray)
                
            //     console.log(this.portfolio);  
            // })
            // .catch(err => { 
            //     console.log(err);
            // });
            return Axios.get(`${localAPI}/seller/${this.userID}/portfolio`)
            
        } catch (error) {
            console.log(error)
            this.uploadError = error
            return error
        }
    }

    updatePortfoliodata = async (portfolio: Portfolio, id: any ) => {
        try {
            this.userID = localStorage.getItem('id')
            const response = await axios.patch(`${localAPI}/seller/${this.userID}/editportfolio/${id}`, portfolio);
            const { message, success } = response.data
            //console.log(response.data)
            if (success) {
                this.isUploaded = true;
            
                console.log("Artwork Updated!" + response.data.result)
                
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

    deletePortfoliodata = async (id: any ) => {
        try {
            this.userID = localStorage.getItem('id')
            const response = await axios.delete(`${localAPI}/seller/${this.userID}/removeportfolio/`,{data : { _id :id}});
            const { message, success } = response.data
            console.log(response.data)
            if (success) {
                this.isDeleted = true;
                console.log("Artwork Deleted!" + JSON.stringify(response.data))
                
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