import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn: boolean = false
  token: string = '55f8ed0796ca1a5ffc64baa13e552c669281b6b69e74b35d556286bb1101aec6'
  storageObs = new BehaviorSubject(localStorage)
  
  constructor(private http: HttpClient)  { }

  
}
