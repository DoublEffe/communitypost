import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../models/User';

@Injectable({
  providedIn: 'root'
})
export class UsersListService {
  pageNumber: string = '10'
  token: string = JSON.parse(localStorage.getItem('auth')).token
  constructor(private http: HttpClient) { }

  signUp(email: string, name: string, gender: string, status: string){
    return this.http.post('https://gorest.co.in/public/v2/users', {email, name, gender, status}, {headers:{'Authorization': 'Bearer '+this.token}}) 
  }

  getUsersList(){
    return this.http.get('https://gorest.co.in/public/v2/users?page=1&per_page='+this.pageNumber, {headers:{'Authorization': 'Bearer '+this.token}})
  }

  getAllUser(){
    return this.http.get('https://gorest.co.in/public/v2/users?page=1&per_page=100', {headers:{'Authorization': 'Bearer '+this.token}})
  }

  deleteUser(id: number){
    return this.http.delete('https://gorest.co.in/public/v2/users/'+ String(id), {headers:{'Authorization': 'Bearer '+this.token}})
  }

  getUserPosts(id: string){
    return this.http.get(`https://gorest.co.in/public/v2/users/${id}/posts`, {headers:{'Authorization': 'Bearer '+this.token}})
  }

  getDetail(id: number){
    return this.http.get('https://gorest.co.in/public/v2/users/' + String(id), {headers:{'Authorization': 'Bearer '+this.token}})
  }

  setUpdate(email: string, name: string, gender: string, status: string){
    const id = JSON.parse(localStorage.getItem('user')).id
    return this.http.put('https://gorest.co.in/public/v2/users/'+ String(id), {email, name, gender, status}, {headers:{'Authorization': 'Bearer '+this.token}})
  }
}
