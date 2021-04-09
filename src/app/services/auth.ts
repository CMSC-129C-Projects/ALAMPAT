import { Injectable } from '@angular/core';
import axios from 'axios'
import { User } from '../models/User'

const localAPI = 'http://localhost:3000'

interface RegistrationResponse {
    message: string;
    success: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class UserService {
    isRegistered: boolean = false;
    registrationError: string = '';
    isLoggedin: boolean = false;
    loginError: string = '';

    constructor() { }

    registerUser = async (user: User) => {
        try {
            const response = await axios.post<RegistrationResponse>(`${localAPI}/user/register`, user);
            const { message, success } = response.data
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
            const response = await axios.post<RegistrationResponse>(`${localAPI}/user/login`, userInfo);
            const { message, success } = response.data
            if (success) {
                this.isLoggedin = true;
            } else {
                this.isLoggedin = false;
                this.loginError = 'Something went wrong'
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