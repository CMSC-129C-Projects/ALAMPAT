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
    market: BehaviorSubject<any> ;
    item: BehaviorSubject<any>
    // artSource = new Subject<any>();
    // //currArt = this.artSource.asObservable();
    // //currArt: EventEmitter<any> = new EventEmitter();
    // //portfolio: EventEmitter<any> = new EventEmitter();
    // showAdd: EventEmitter<boolean> = new EventEmitter();
    // showEdit: EventEmitter<boolean> = new EventEmitter();
    // portfolio = new Subject<any>();
    // //error: EventEmitter<any> = new EventEmitter();

    constructor(
        ) {
           this.market = new BehaviorSubject<any>([])
           this.item = new BehaviorSubject<any>(null)
           //this.getMarketdata()
         }
    
    public get marketValue(): any {
        
        return this.market.value;
    }

    getallMarket(): Observable<any>{
        this.getallMarketdata()
        return this.market.asObservable()
    }   

    getproductMarket(): Observable<any>{
        this.getProductMarketdata()
        return this.market.asObservable()
    }  

    getcommissionMarket(): Observable<any>{
        this.getCommissionMarketdata()
        return this.market.asObservable()
    }  

    getcommission(_id: string|null): Observable<any>{
        this.getCommission(_id)
        return this.item.asObservable()
    }  

    getproduct(_id: string|null): Observable<any>{
        this.getProduct(_id)
        return this.item.asObservable()
    }  

    getallMarketdata() {
    
        axios.get(`${localAPI}/buyer/market`)
        .then(resp => {
            this.market.next(resp.data.all)
            // /console.log("market value: " + JSON.stringify(this.market))
            // /console.log("Market data: " + JSON.stringify(resp.data.all));
            //return resp.data
        })
        .catch(err => {
            // Handle Error Here
            //this.error.emit(err)
            console.log(err);
            //return err
        });
    
    }

    getProductMarketdata() {
    
        axios.get(`${localAPI}/buyer/productmarket`)
        .then(resp => {
            this.market.next(resp.data.all)
            // /console.log("market value: " + JSON.stringify(this.market))
            // /console.log("Market data: " + JSON.stringify(resp.data.all));
            //return resp.data
        })
        .catch(err => {
            // Handle Error Here
            //this.error.emit(err)
            console.log(err);
            //return err
        });
    
    }

    getCommissionMarketdata() {
    
        axios.get(`${localAPI}/buyer/commissionmarket`)
        .then(resp => {
            this.market.next(resp.data.all)
            // /console.log("market value: " + JSON.stringify(this.market))
            // /console.log("Market data: " + JSON.stringify(resp.data.all));
            //return resp.data
        })
        .catch(err => {
            // Handle Error Here
            //this.error.emit(err)
            console.log(err);
            //return err
        });
    
    }

    getCommission(_id: string|null) {
    
        axios.get(`${localAPI}/buyer/getCommission/${_id}`)
        .then(resp => {
            this.item.next(resp.data.commission)
            // /console.log("market value: " + JSON.stringify(this.market))
            // /console.log("Market data: " + JSON.stringify(resp.data.all));
            //return resp.data
        })
        .catch(err => {
            // Handle Error Here
            //this.error.emit(err)
            console.log(err);
            //return err
        });
    
    }
   
    getProduct(_id: string|null) {
    
        axios.get(`${localAPI}/buyer/getProduct/${_id}`)
        .then(resp => {
            this.item.next(resp.data.product)
            // /console.log("market value: " + JSON.stringify(this.market))
            // /console.log("Market data: " + JSON.stringify(resp.data.all));
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