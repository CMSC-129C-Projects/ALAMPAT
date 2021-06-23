import { Injectable, EventEmitter, } from '@angular/core';
import axios from 'axios'
import Axios from 'axios-observable';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, Subject } from 'rxjs';



const localAPI = 'https://alampat.herokuapp.com'
const test_API = 'http://localhost:3000'

interface uploadResponse {
    message: string;
    success: boolean;
    result: any;
}

@Injectable({
    providedIn: 'root',
})

export class ReservationService {
    
    userID: string|null;
    prod_added: boolean
    additem_error: string;
    isDeleted: boolean = false
    constructor(
      ) {

    }


    addtoCart = async (id: any) => {
        try {
            this.userID = localStorage.getItem('id')

            const response = await axios.post<uploadResponse>(`${localAPI}/buyer/${this.userID}/addtoCart/${id}`);
            const { message, result, success } = response.data
            console.log("" + JSON.stringify(result))
            if (success) {
                this.prod_added = true;
            } else {
                this.prod_added = false;
                this.additem_error = 'Something went wrong'
            }
        } catch (error) {
            console.log(error)
            this.additem_error = error
        }
    }

    addCommissionForm = async (id: any, form: string) => {
        try {
            this.userID = localStorage.getItem('id')

            const response = await axios.patch<uploadResponse>(`${localAPI}/seller/${this.userID}/addCommissionForm?res_id=${id}`, { form: form});
            //const { message, result, success } = response.data
            //console.log("" + JSON.stringify(result))
            
        } catch (error) {
            console.error(error.message)
            this.additem_error = error
        }
    }

    addtotalAmount = async (id: any, totalAmount: number) => {
        try {
            this.userID = localStorage.getItem('id')

            const response = await axios.patch<uploadResponse>(`${localAPI}/seller/${this.userID}/addTotalAmount?res_id=${id}`, { totalAmount: totalAmount});
            //const { message, result, success } = response.data
            //console.log("" + JSON.stringify(result))
            
        } catch (error) {
            console.error(error.message)
            this.additem_error = error
        }
    }

    addReservation = async (body: any) => {
        try {
            this.userID = localStorage.getItem('id')

           
            const response = await axios.post<uploadResponse>(`${localAPI}/buyer/${this.userID}/addReservation/`, body );
            const { message, result, success } = response.data
            console.log("Reservation" + JSON.stringify(result))
            if (success) {
                this.prod_added = true;
            } else {
                this.prod_added = false;
                this.additem_error = 'Something went wrong'
            }
        } catch (error) {
            console.log(error)
            this.additem_error = error
        }
    }

    getReservationList (): Observable<any>{
        this.userID = localStorage.getItem('id')
        return Axios.get(`${localAPI}/buyer/${this.userID}/getReservationList`)
    }

    getReservation(res_id: string): Observable<any>{
        this.userID = localStorage.getItem('id')
        return Axios.get(`${localAPI}/buyer/${this.userID}/getReservation?id=${res_id}`)
    }

    cancelReservation = async (res_id: string) => {
        try{
            this.userID = localStorage.getItem('id')
            const response = await axios.patch(`${localAPI}/buyer/${this.userID}/cancelReservation?id=${res_id}&status=Cancelled`)
            console.log("Response: " + response.data.message)
        }
        catch(error){
            console.error("Error: " + error)
        }
        
    }

    deleteReservation = async (res_id: string) => {
        try {
            this.userID = localStorage.getItem('id')
            const response = await axios.delete(`${localAPI}/users/${this.userID}/removeReservation?reserv_id=${res_id}`);
            const { message, success } = response.data
            console.log(response.data)
            if (success) {
                this.isDeleted = true;
                console.log(JSON.stringify(message))
                return this.isDeleted

            } else {
                this.isDeleted = false;
                console.error(JSON.stringify(message))

                return this.isDeleted
            }

        } catch (error) {
            this.isDeleted = false
            console.error(error.message)
            //console.log("faaaill")
            return this.isDeleted;
        }
    }

    removeReservation = async (res_id: string, seller_id: string) => {
        try {
            this.userID = localStorage.getItem('id')
            const response = await axios.delete(`${localAPI}/buyer/${this.userID}/removeReservation?reserv_id=${res_id}&seller_id=${seller_id}`);
            const { message, success } = response.data
            console.log(response.data)
            if (success) {
                this.isDeleted = true;
                console.log(JSON.stringify(message))
                return this.isDeleted

            } else {
                this.isDeleted = false;
                console.error(JSON.stringify(message))

                return this.isDeleted
            }

        } catch (error) {
            this.isDeleted = false
            console.error(error.message)
            //console.log("faaaill")
            return this.isDeleted;
        }
    }

    updateReservation = async (res_id: string, status_res: string) => {
        try{
            this.userID = localStorage.getItem('id')
            const response = await axios.patch(`${localAPI}/seller/${this.userID}/updateReservation?res_id=${res_id}&status=${status_res}`)
            console.log("Response: " + response.data.message)
        }
        catch(error){
            console.error("Error: " + error)
        }
        
    }


}