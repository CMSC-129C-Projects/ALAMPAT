import { Injectable, EventEmitter } from '@angular/core';
import axios from 'axios';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import Axios from 'axios-observable';

interface item {
    _id?: string;
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
    status: string;
}

const localAPI = 'https://alampat.herokuapp.com'
const test_API = 'http://localhost:3000'

@Injectable({
    providedIn: 'root',
})

@Injectable({
    providedIn: 'root',
})

export class OrderService {
    order: BehaviorSubject<any> ;
    item: BehaviorSubject<item>
    reload: EventEmitter<boolean> ;
    user_id:string
    constructor() {
        this.order = new BehaviorSubject<any>([])
        this.reload = new EventEmitter<boolean>(true)
    }
    
    public get orderValue(): any {
        return this.order.value;
    }

    //setItem(){
    //    this.item = new BehaviorSubject<item>({
    //        _id: '',
            // productname?: string;
            // commissioname?:string;
    //        itemname:'',
    //        description: '',
    //        stock: 0,
    //        slot: 0,
    //        price: 0,
    //        images: {
    //          filename: '',
    //         contentType: '',
    //          imageBase64: '',
    //        },
    //        category:'',
    //        sellername: '',
    //        profileImage: '',
    //       })
    //}

    editReload(reload:boolean){
        this.reload.emit(reload)
    }
    
    setorder(){
        this.order.next([])
    }

    getallOrder(): Observable<any>{
        //this.order = new BehaviorSubject<any>([])
        this.getallOrderdata()
        return this.order.asObservable()
    }   

    // getproductMarket(): Observable<any>{

    //     this.getProductMarketdata()
    //     return this.market.asObservable()
    // }  

    // getcommissionMarket(pg:any, limit:any, sortby:any, min:any, max:any, word:any): Observable<any>{
    //     this.getCommissionMarketdata(pg, limit, sortby, min, max, word)
    //     return this.market.asObservable()
    // }  

    getcommission(): Observable<any>{
        
        //this.getCommission(_id)
        return this.item.asObservable()
    }  

    getproduct(): Observable<any>{
        //this.getProduct(_id)
        return this.item.asObservable()
    }  

    getallOrderdata() {
        
        axios.get(`${localAPI}/buyer/order`)
        .then(resp => {
            this.order.next([])
            if(resp.status === 200){
                this.order.next(resp.data.all)
            }
            
        })
        .catch(err => {

            console.log(err);
        });
    
    }

    getCheckoutdetails(reserv_id: string): Observable<any>{
            this.user_id = String(localStorage.getItem('id'))
            return Axios.get(`${test_API}/buyer/${this.user_id}/getCheckout?id=${reserv_id}`)
 
    }

    //For ALL TAB
    getAlldata(pg:any, limit:any, status:any): Observable<any>  {
    
        return Axios.get(`${localAPI}/buyer/productmarket2?page=${pg}&limit=${limit}&status=${status}`)
  
    }
    //FOR PROCESSING TAB
    getProcessingdata(pg:any, limit:any, status:any): Observable<any>  {
        return Axios.get(`${localAPI}/buyer/productmarket2?page=${pg}&limit=${limit}&status=${status}`)
    }

    //FOR COMPLETED TAB
    getCompleteddata(pg:any, limit:any, status:any): Observable<any>  {
        return Axios.get(`${localAPI}/buyer/productmarket2?page=${pg}&limit=${limit}&status=${status}`)
    }

    //FOR CANCELLED TAB
    getCancelleddata(pg:any, limit:any, status:any): Observable<any>  {
        return Axios.get(`${localAPI}/buyer/productmarket2?page=${pg}&limit=${limit}&status=${status}`)
    }


    getCommissionOrder(_id: string|null, ) {
       // this.setItem()
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
   
    getProductOrder(_id: string|null) {
        //this.setItem()
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