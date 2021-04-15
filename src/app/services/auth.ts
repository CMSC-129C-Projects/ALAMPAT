import { Injectable } from '@angular/core';
import axios from 'axios'
import { User } from '../models/User'
import { Router, ActivatedRoute } from '@angular/router';

const localAPI = 'http://localhost:3000'

interface RegistrationResponse {
    message: string;
    success: boolean;
}

interface LoginResponse {
    message: string;
    loggedin: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class UserService {
    isRegistered: boolean = false;
    registrationError: string = '';
    isLoggedin: boolean = false;
    loginError: string = '';

    constructor(private router:Router) { }

    registerUser = async (user: User) => {
        try {
            const response = await axios.post<RegistrationResponse>(`${localAPI}/user/register`, user);
            const { message, success } = response.data
            console.log(response.data)
            if (success) {
                this.isRegistered = true;
            } else {
                this.isRegistered = false;
                this.registrationError = 'Something went wrong'
            }
        } catch (error) {
            console.log(error)
            this.registrationError = error
        }
    }

    login = async (userInfo: User) => {
        localStorage.setItem('ACCESS_TOKEN', "access_token");
        try {
            const response = await axios.post<LoginResponse>(`${localAPI}/user/login`, userInfo);
            const { message, loggedin } = response.data
            if (loggedin) {
                this.isLoggedin = true;
                console.log(message)
                this.router.navigate(['/loading'])
            } else {
                this.loginError = message;
                console.log( this.loginError)
                this.isLoggedin = false;
                
            }
        } catch (error) {
            console.log(error)
            this.loginError = error
        }
      }
    
      //public isLoggedIn(){
       // return localStorage.getItem('ACCESS_TOKEN') !== null;
    
      //}
    
      public logout(){
        localStorage.removeItem('ACCESS_TOKEN');
      }
}