import { Injectable, EventEmitter } from '@angular/core';
import axios from 'axios'
import { Portfolio } from '../models/Portfolio'
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';


const localAPI = 'http://localhost:3000'


@Injectable({
    providedIn: 'root',
})

export class MarketService {
    market = new Subject<any>();
    // artSource = new Subject<any>();
    // //currArt = this.artSource.asObservable();
    // //currArt: EventEmitter<any> = new EventEmitter();
    // //portfolio: EventEmitter<any> = new EventEmitter();
    // showAdd: EventEmitter<boolean> = new EventEmitter();
    // showEdit: EventEmitter<boolean> = new EventEmitter();
    // portfolio = new Subject<any>();
    // //error: EventEmitter<any> = new EventEmitter();

    constructor(
        ) { }

    getMarket(): Observable<any>{
        this.getMarketdata()
        return this.market.asObservable()
    }    
    getMarketdata() {
       
            axios.get(`${localAPI}/buyer/market`)
            .then(resp => {
                this.market.next(resp.data.all)
                
                console.log("Market data: " + JSON.stringify(resp.data.all));
                //return resp.data
            })
            .catch(err => {
                // Handle Error Here
                //this.error.emit(err)
                console.log(err);
                //return err
            });
        
    }
   
    
}