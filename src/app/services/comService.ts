import { Injectable, EventEmitter } from '@angular/core';
import axios from 'axios'
import { Commission } from '../models/Commission'
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import Axios from 'axios-observable';

const localAPI = 'https://alampat.herokuapp.com'

interface uploadResponse {
    message: string;
    commissionData: Commission;
    success: boolean;
}

@Injectable({
    providedIn: 'root',
})

export class CommissionService {
    isUploaded: boolean = false;
    isDeleted: boolean = false;
    userID: string|null ;
    commissionID: string = '';
    uploadError: string = '';

    comSource: BehaviorSubject<any>;
    showAdd: EventEmitter<boolean> = new EventEmitter();
    showEdit: EventEmitter<boolean> = new EventEmitter();
    commission = new Subject<any>();

    constructor(private router:Router,
        private domSanitizer: DomSanitizer, 
        ) {
                this.comSource = new BehaviorSubject<any>({})
         }
    
    refresh(): Observable<any> {
        return this.comSource.asObservable();
    }

    addswitch(resp: boolean){
        this.showAdd.emit(resp)
    }

    editswitch(resp: boolean){
        this.showEdit.emit(resp)
    }

    selectItem(item: any) {
        this.comSource.next(item);
    }

    uploadItem = async (commission: Commission) => {
        console.log('in get commission service')
        this.userID = localStorage.getItem('id')
        try {
            const response = await axios.post<uploadResponse>(`${localAPI}/seller/${this.userID}/addcommission`, commission)
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
    
    getItemdata():Observable<any> {
        try {
            this.userID = localStorage.getItem('id')
            // axios.get(`${localAPI}/seller/${this.userID}/commission`)
            // .then(resp => {
            //     this.commission.next(resp.data.commissionsArray)
                
            //     console.log(this.commission);
            // })
            // .catch(err => {
            //     console.log(err);
            // });
            return Axios.get(`${localAPI}/seller/${this.userID}/commission`)

        } catch (error) {
            console.log(error)
            this.uploadError = error
            return error
        }
    }
    
    updateItemdata = async (commission: Commission, id: any ) => {
        try {
            this.userID = localStorage.getItem('id')
            const response = await axios.patch(`${localAPI}/seller/${this.userID}/editcommission/${id}`, commission);
            const { message, success } = response.data
            //console.log(response.data)
            if (success) {
                this.isUploaded = true;
               
                console.log("Commission Updated!" + response.data.result)
                
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

    deleteItemdata = async (id: any ) => {
        try {
            this.userID = localStorage.getItem('id')
            const response = await axios.delete(`${localAPI}/seller/${this.userID}/removecommission/`,{data : { _id :id}});
            const { message, success } = response.data
            console.log(response.data)
            if (success) {
                this.isDeleted = true;
                console.log("Commission Deleted!" + JSON.stringify(response.data))
                
                return this.isDeleted
            
            } else {
                this.isDeleted = false;
                console.log("Deletion failed: " + response.data)
                
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