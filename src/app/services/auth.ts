import { Injectable } from '@angular/core';
import axios from 'axios'
import { User } from '../models/User'
import { Router } from '@angular/router';

const localAPI = 'https://alampat.herokuapp.com'

interface RegistrationResponse {
    message: string;
    success: boolean;
}

interface LoginResponse {
    message: string;
    userdata: any;
    token: any;
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
    userID: string;

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
        //localStorage.setItem('ACCESS_TOKEN', "access_token");
        this.showErrorMessage = false;
        try {
            const response = await axios.post<LoginResponse>(`${localAPI}/auth/login`, userInfo);
            const { message, token, userdata, loggedin } = response.data
            if (loggedin) {
                this.isLoggedin = true;
                this.userID = userdata._id
                console.log(message + JSON.stringify(userdata.userType))
                localStorage.setItem('isloggedIn', "true")
                localStorage.setItem('token', token )
                localStorage.setItem('id', userdata._id )
                localStorage.setItem('userType', userdata.userType)
                if(userdata.userType === "buyer"){
                    this.router.navigate(['/my-accounts-buyer'])
                    
                }
                if(userdata.userType === "seller"){
                    this.router.navigate(['/my-accounts-seller'])
                }
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
        localStorage.removeItem('id')
        localStorage.removeItem('token');
        localStorage.removeItem('isloggedIn');
        localStorage.removeItem('userType');
    }
}