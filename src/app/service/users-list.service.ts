import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UsersListService {
  pageNumber: string = '10'
  token: string='55f8ed0796ca1a5ffc64baa13e552c669281b6b69e74b35d556286bb1101aec6'
  constructor(private http: HttpClient) { }

  signUp(email: string, name: string, gender: string, status: string){
    return this.http.post('https://gorest.co.in/public/v2/users', {email, name, gender, status}, {headers:{'Authorization': 'Bearer '+this.token}}) 
  }

  getUsersList(){
    return this.http.get('https://gorest.co.in/public/v2/users?page=1&per_page='+this.pageNumber,{headers:{'Authorization': 'Bearer '+this.token}})
  }

  getAllUser(){
    return this.http.get('https://gorest.co.in/public/v2/users?page=1&per_page=100')
  }

  deleteUser(id: number){
    return this.http.delete('https://gorest.co.in/public/v2/users/'+ String(id), {headers:{'Authorization': 'Bearer '+this.token}})
  }

  getUserPosts(id: string){
    return this.http.get(`https://gorest.co.in/public/v2/users/${id}/posts`)
  }
}
