import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './services/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: UserService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      //const isAuth = this.authService.isLoggedin;
      const isAuth = localStorage.getItem('isloggedIn')
      const token = localStorage.getItem('token')

      if(isAuth === "true" && token){
        return true
      }

      console.log("You're not welcome")
      this.router.navigate(['/welcome']);
      return false
  }
  
}
