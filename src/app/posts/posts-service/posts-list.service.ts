import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PostsListService {
  token: string = JSON.parse(localStorage.getItem('auth')).token

  constructor(private http: HttpClient) { }

  getPostsList(){
    return this.http.get('https://gorest.co.in/public/v2/posts?page=1&per_page=100', {headers:{'Authorization': 'Bearer '+ this.token}})
  }

  getPostComments(id: string){
    return this.http.get(`https://gorest.co.in/public/v2/posts/${id}/comments`, {headers:{'Authorization': 'Bearer '+this.token}})
  } 

  makeNewPost(title: string, body: string){
    const userId = JSON.parse(localStorage.getItem('user')).id
    return this.http.post(`https://gorest.co.in/public/v2/users/${userId}/posts`, {title, body}, {headers:{'Authorization': 'Bearer '+this.token}})
  }

  makeNewComment(post: number, body: string){
    const name = JSON.parse(localStorage.getItem('user')).name
    const email = JSON.parse(localStorage.getItem('user')).email
    return this.http.post(`https://gorest.co.in/public/v2/posts/${post}/comments`, { name, email, body}, {headers:{'Authorization': 'Bearer '+this.token}})
  }
}
