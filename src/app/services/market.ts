import { Injectable, EventEmitter } from '@angular/core';
import axios from 'axios'
import { Portfolio } from '../models/Portfolio'
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

interface item {
    _id?: string;
    // productname?: string;
    // commissioname?:string;
    itemname:string;
    description: string;
    stock?: number;
    slot?: number;
    price: number;
    images: {
      filename: string;
      contentType: string;
      imageBase64: string;
    };
    category:string;
    sellername?: string;
    profileImage?: string;
  }

const localAPI = 'https://alampat.herokuapp.com'


@Injectable({
    providedIn: 'root',
})

export class MarketService {
    market: BehaviorSubject<any> ;
    item: BehaviorSubject<item>
    // artSource = new Subject<any>();
    // //currArt = this.artSource.asObservable();
    // //currArt: EventEmitter<any> = new EventEmitter();
    // //portfolio: EventEmitter<any> = new EventEmitter();
    // showAdd: EventEmitter<boolean> = new EventEmitter();
    // showEdit: EventEmitter<boolean> = new EventEmitter();
    // portfolio = new Subject<any>();
    // //error: EventEmitter<any> = new EventEmitter();
    reload: EventEmitter<boolean> ;

    constructor(
        ) {
           this.market = new BehaviorSubject<any>([])
           this.setItem()
           this.reload = new EventEmitter<boolean>(true)
           //this.getMarketdata()
           localStorage.setItem('reload', "true")
           localStorage.setItem('curr_category', "All")
         }
    
    public get marketValue(): any {
        
        return this.market.value;
    }

    setItem(){
        this.item = new BehaviorSubject<item>({
            _id: '',
            // productname?: string;
            // commissioname?:string;
            itemname:'',
            description: '',
            stock: 0,
            slot: 0,
            price: 0,
            images: {
              filename: '',
              contentType: '',
              imageBase64: '',
            },
            category:'',
            sellername: '',
            profileImage: '',
           })
    }
    editReload(reload:boolean){
        this.reload.emit(reload)
    }
    
    setmarket(){
        this.market.next([])
    }

    getallMarket(): Observable<any>{
        //this.market = new BehaviorSubject<any>([])
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

    getcommission(): Observable<any>{
        
        //this.getCommission(_id)
        return this.item.asObservable()
    }  

    getproduct(): Observable<any>{
        //this.getProduct(_id)
        return this.item.asObservable()
    }  

    getallMarketdata() {
        
        axios.get(`${localAPI}/buyer/market`)
        .then(resp => {
            this.market.next([])
            if(resp.status === 200){
                this.market.next(resp.data.all)
            }
            
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
            this.market.next([])
            if(resp.status === 200){
                this.market.next(resp.data.all)
            }
            
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
            
            if(resp.status === 200){
                this.market.next(resp.data.all)
            }
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
        this.setItem()
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
        this.setItem()
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