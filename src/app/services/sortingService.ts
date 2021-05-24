import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})

export class SortService {
    
    constructor() { }

    getStrAscendingSortOrder(prop:string) {    
        return function(a:any, b:any) {    
            if (a[prop].toLowerCase() > b[prop].toLowerCase()) {    
                return 1;    
            } else if (a[prop].toLowerCase() < b[prop].toLowerCase()) {    
                return -1;    
            }    
            return 0;    
        }    
    }  
    
    getStrDescendingSortOrder(prop:string) {    
        return function(a:any, b:any) {    
            if (a[prop].toLowerCase() > b[prop].toLowerCase()) {    
                return -1;    
            } else if (a[prop].toLowerCase() < b[prop].toLowerCase()) {    
                return 1;    
            }    
            return 0;    
        }    
    }

    getNumAscendingSortOrder(prop:string) {    
        return function(a:any, b:any) {    
            if (a[prop] > b[prop]) {    
                return 1;    
            } else if (a[prop] < b[prop]) {    
                return -1;    
            }    
            return 0;    
        }    
    }  
    
    getNumDescendingSortOrder(prop:string) {    
        return function(a:any, b:any) {    
            if (a[prop] > b[prop]) {    
                return -1;    
            } else if (a[prop] < b[prop]) {    
                return 1;    
            }    
            return 0;    
        }    
    }
    getTimeAscendingSortOrder(prop:string) {    
        return function(a:any, b:any) { 
            var d1 = new Date(a[prop]) 
            var d2 = new Date(b[prop])   
            if (d1.getTime() > d2.getTime()) {    
                return 1;    
            } else if (d1.getTime() < d2.getTime()) {    
                return -1;    
            }    
            return 0;    
        }    
    }  
    
    getTimeDescendingSortOrder(prop:string) {    
        return function(a:any, b:any) {
            var d1 = new Date(a[prop]) 
            var d2 = new Date(b[prop])     
            if (d1.getTime() > d2.getTime()) {    
                return -1;    
            } else if (d1.getTime()  < d2.getTime()) {    
                return 1;    
            }    
            return 0;    
        }    
    }
    
    
}