import { Injectable, EventEmitter } from '@angular/core';
import axios from 'axios';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import Axios from 'axios-observable';


const localAPI = 'https://alampat.herokuapp.com'
const test_API = 'http://localhost:3000'

interface uploadResponse {
    message: string;
    success: boolean;
}
@Injectable({
    providedIn: 'root',
})

export class OrderService {
    order: BehaviorSubject<any> ;
    //item: BehaviorSubject<item>
    reload: EventEmitter<boolean>;
    showDetails: EventEmitter<boolean> = new EventEmitter();


    order_id: BehaviorSubject<string>
    user_id:string|null
    
    constructor() {
        this.order = new BehaviorSubject<any>([])
        this.order_id = new BehaviorSubject<string>('')
        this.reload = new EventEmitter<boolean>(true)
    }
    
    public get orderValue(): any {
        return this.order.value;
    }

    save_OrderID(_id:string){
        this.order_id.next(_id)
    }

    get orderID_value(): string {
        return this.order_id.value
    }

    detailsswitch(resp: boolean){
        this.showDetails.emit(resp)
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

    // getallOrder(): Observable<any>{
    //     //this.order = new BehaviorSubject<any>([])
    //     this.getallOrderdata()
    //     return this.order.asObservable()
    // }   

    // getproductMarket(): Observable<any>{

    //     this.getProductMarketdata()
    //     return this.market.asObservable()
    // }  

    // getcommissionMarket(pg:any, limit:any, sortby:any, min:any, max:any, word:any): Observable<any>{
    //     this.getCommissionMarketdata(pg, limit, sortby, min, max, word)
    //     return this.market.asObservable()
    // }  
    

    addCommOrder = async(com_id: string, slot: number, reservation: any, reserv_id: string, seller_id: string)=>{
        try {
            this.user_id = localStorage.getItem('id')
            const response = await axios.post<uploadResponse>(`${test_API}/buyer/${this.user_id}/addCommOrder?orderStatus=${"P"}&orderType=${"Commission"}&reserv_id=${reserv_id}&seller_id=${seller_id}`, reservation);
            const { success } = response.data
            //console.log(JSON.stringify(response.data))
            if(success){
               const min_slot = slot - 1 
               console.log(min_slot)
               const response = await axios.patch<uploadResponse>(`${test_API}/buyer/${this.user_id}/deductSlot`, {_id: com_id ,slot: min_slot});
               const { message, success } = response.data
               console.log("Slot Update: " + message)
            }
            // if (success) {
            //     this.isUploaded = true;
            // } else {
            //     this.isUploaded = false;
            //     this.uploadError = 'Something went wrong'
            // }
        } catch (error) {
            console.error(error)
            //this.uploadError = error
        }
    }

    // getcommission(): Observable<any>{
        
    //     //this.getCommission(_id)
    //     return this.item.asObservable()
    // }  

    // getproduct(): Observable<any>{
    //     //this.getProduct(_id)
    //     return this.item.asObservable()
    // }  

    // getallOrderdata() {
        
    //     axios.get(`${localAPI}/buyer/order`)
    //     .then(resp => {
    //         this.order.next([])
    //         if(resp.status === 200){
    //             this.order.next(resp.data.all)
    //         }
            
    //     })
    //     .catch(err => {

    //         console.log(err);
    //     });
    
    // }

    getCheckoutdetails(reserv_id: string): Observable<any>{
            this.user_id = String(localStorage.getItem('id'))
            return Axios.get(`${test_API}/buyer/${this.user_id}/getCheckout?id=${reserv_id}`)
 
    }

    //For ALL TAB
    getAlldata(startindex: string): Observable<any>  {
        this.user_id = String(localStorage.getItem('id'))
        return Axios.get(`${test_API}/users/${this.user_id}/getOrders?startindex=${startindex}`)
  
    }
    //FOR PROCESSING TAB
    getProcessingdata(tab: string, startindex:string): Observable<any>  {
        this.user_id = String(localStorage.getItem('id'))
        return Axios.get(`${test_API}/users/${this.user_id}/getOrderswithFilter?tab=${tab}&startindex=${startindex}`)
    }

    //FOR COMPLETED TAB
    getCompleteddata(tab: string, startindex:string): Observable<any>  {
        this.user_id = String(localStorage.getItem('id'))
        return Axios.get(`${test_API}/users/${this.user_id}/getOrderswithFilter?tab=${tab}&startindex=${startindex}`)
    }

    //FOR CANCELLED TAB
    getCancelleddata(tab: string, startindex:string): Observable<any>  {
        this.user_id = String(localStorage.getItem('id'))
        return Axios.get(`${test_API}/users/${this.user_id}/getOrderswithFilter?tab=${tab}&startindex=${startindex}`)
    }

    getOrder(_id: string|null){
        this.user_id = String(localStorage.getItem('id'))
        return Axios.get(`${test_API}/users/${this.user_id}/getOrder/${_id}`)
    }

    getCommissionOrder(_id: string|null, ) {
       // this.setItem()
        // axios.get(`${localAPI}/buyer/getCommission/${_id}`)
        // .then(resp => {
        //     this.item.next(resp.data.commission) 
        //     // /console.log("market value: " + JSON.stringify(this.market))
        //     // /console.log("Market data: " + JSON.stringify(resp.data.all));
        //     //return resp.data
        // })
        // .catch(err => {
        //     // Handle Error Here
        //     //this.error.emit(err)
        //     console.log(err);
        //     //return err
        // });
    
    }
   
    getProductOrder(_id: string|null) {
        // //this.setItem()
        // axios.get(`${localAPI}/buyer/getProduct/${_id}`)
        // .then(resp => {
        //     this.item.next(resp.data.product)
        //     // /console.log("market value: " + JSON.stringify(this.market))
        //     // /console.log("Market data: " + JSON.stringify(resp.data.all));
        //     //return resp.data
        // })
        // .catch(err => {
        //     // Handle Error Here
        //     //this.error.emit(err)
        //     console.log(err);
        //     //return err
        // });
    
    }
}