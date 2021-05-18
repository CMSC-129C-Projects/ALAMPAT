import { Injectable } from '@angular/core';
import axios from 'axios'
import { User } from '../models/User'
import { Router } from '@angular/router';

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
    showRegistrationError: boolean = false;
    isLoggedin: boolean = false;
    loginError: string = '';
    showErrorMessage: boolean = false;

    constructor(private router: Router) { }

    registerUser = async (user: User) => {
        try {
            const response = await axios.post<RegistrationResponse>(`${localAPI}/auth/register`, user);
            const { message, success } = response.data
            console.log(response.data)
            if (success) {
                this.isRegistered = true;
                this.showRegistrationError = false;
                console.log("User Registered!")
                console.log(response.data)
                //this.router.navigate(['/loading'])
                return this.isRegistered
                //
            } else {
                this.isRegistered = false;
                this.showRegistrationError=true;
                this.registrationError = 'Something went wrong'
                console.log(this.registrationError)
                return this.isRegistered 
            }

        } catch (error) {
            this.isRegistered = false
            console.log(error)
            this.registrationError = error
            return this.isRegistered;
        }
    }

    login = async (userInfo: User) => {
        localStorage.setItem('ACCESS_TOKEN', "access_token");
        this.showErrorMessage = false;
        try {
            const response = await axios.post<LoginResponse>(`${localAPI}/auth/login`, userInfo);
            const { message, loggedin } = response.data
            if (loggedin) {
                this.isLoggedin = true;
                console.log(message)
                this.router.navigate(['/my-accounts-seller'])
            } else {
                this.showErrorMessage = true;
                this.loginError = message;
                console.log(this.loginError)
                this.isLoggedin = false;
            }
        } catch (error) {
            this.showErrorMessage = true;
            console.log(error)
            this.loginError = error
        }
    }

    //public isLoggedIn(){
    // return localStorage.getItem('ACCESS_TOKEN') !== null;

    //}

    public logout() {
        localStorage.removeItem('ACCESS_TOKEN');
    }
}