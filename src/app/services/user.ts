import { Injectable, EventEmitter } from '@angular/core';
import axios from 'axios'
import { User } from '../models/User'
import { Router, ActivatedRoute } from '@angular/router';

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

    user: EventEmitter<any> = new EventEmitter();
    error: EventEmitter<any> = new EventEmitter();

    constructor(private router:Router,) { }

    getUserdata = () =>{
        try {
            axios.get<getUserResponse>(`${localAPI}/users/profile/` + this.userID)
            .then(resp => {
                this.user.emit(resp.data.userData)
                
                console.log(this.user);
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
            this.getUserError = error

            //return error
        }
    }

    updateUserdata = async (user: User ) => {
        try {
            const response = await axios.put<getUserResponse>(`${localAPI}/users/updateAccount/${this.userID}`, user);
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