import { Injectable, EventEmitter } from '@angular/core';
import axios from 'axios'
import { User } from '../models/User'
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
const localAPI = 'http://localhost:3000'


interface getUserResponse {
    message: string;
    userData: User;
    success: boolean;
}

@Injectable({
    providedIn: 'root',
})


export class AccountService {
    getUserError: string = '';
    userID: string = '607fe491958fa65f08f14d0e';
    isUpdated: boolean = false;

    //user: EventEmitter<any> = new EventEmitter();
    //error: EventEmitter<any> = new EventEmitter();
    error: Subject<any> = new Subject();
    user: Subject<any> = new Subject();

    showEdit: EventEmitter<any> = new EventEmitter();
    constructor(private router:Router,) { }

    editswitch(resp: boolean){
        this.showEdit.emit(resp)
    }

    getUserdata = () =>{
        try {
            axios.get<getUserResponse>(`${localAPI}/users/profile/` + this.userID)
            .then(resp => {
                this.user.next(resp.data.userData)
                
                console.log(this.user);
                //return resp.data
            })
            .catch(err => {
                // Handle Error Here
                this.error.next(err)
                console.log(err);
                //return err
            });
            

        } catch (error) {
            this.error.next(error)
            console.log(error)
            this.getUserError = error

            //return error
        }
    }

    updateUserdata = async (user: User ) => {
        try {
            const response = await axios.patch<getUserResponse>(`${localAPI}/users/updateAccount/${this.userID}`, user);
            const { message, success } = response.data
            //console.log(response.data)
            if (success) {
                this.isUpdated = true;
               
                console.log("User Registered!")
                console.log(response.data)
                //this.router.navigate(['/registration-confirmed'])
                return this.isUpdated
                //
            } else {
                this.isUpdated = false;
                
                console.log(" Update failed: " + response.data)
                return this.isUpdated 
            }

        } catch (error) {
            this.isUpdated = false
            console.log(error)
            return this.isUpdated;
        }  
    }

    
}