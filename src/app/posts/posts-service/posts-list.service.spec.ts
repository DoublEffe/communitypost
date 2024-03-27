import { TestBed } from '@angular/core/testing';

import { PostsListService } from './posts-list.service';
import { HttpClient } from '@angular/common/http';


describe('PostsListService', () => {
  let service: PostsListService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let headers: {}
  let getItemSpy: jasmine.Spy;


  beforeEach(() => {
    TestBed.configureTestingModule({});
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    let store = {}
    spyOn(window.localStorage, 'setItem').and.callFake((key:string, value:string) => store[key] = value)
    getItemSpy = spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({ token: 'testToken' }));
    service = new PostsListService(httpClientSpy);
    localStorage.setItem('token', 'token fake')
    service.token = localStorage.getItem('token')
    headers = {headers:{'Authorization': 'Bearer '+service.token}}
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve the posts', () => {
    service.getPostsList()
    httpClientSpy.get('fake get posts url', headers)
    expect(httpClientSpy.get).toHaveBeenCalled()   
    expect(httpClientSpy.get).toHaveBeenCalledWith('fake get posts url', headers)   
  })

  it('should retrieve the comments', () => {
    service.getPostComments('0')
    httpClientSpy.get('fake get comments url', headers)
    expect(httpClientSpy.get).toHaveBeenCalled()   
    expect(httpClientSpy.get).toHaveBeenCalledWith('fake get comments url', headers)   
  })

  it('should make new post', () => {
    const body = {tittle: 'fake title', body: 'fake body'}
    const id = localStorage.setItem('user', JSON.stringify({id:0, name:'test'}))
    service.makeNewPost('fake title', 'fake body')
    httpClientSpy.post('fake post posts url', body, headers)
    expect(httpClientSpy.post).toHaveBeenCalled()   
    expect(httpClientSpy.post).toHaveBeenCalledWith('fake post posts url', body ,  headers)   
  })

  it('should make comments', () => {
    localStorage.setItem('user', JSON.stringify({id:0, name:'test', email: 'testemail', body: 'fake comment body'}))
    const body = {name: 'test', body: 'fake comment body', emnail: 'testemail'}
    service.makeNewComment(0, 'fake comment body')
    httpClientSpy.post('fake post comment url', body, headers)
    expect(httpClientSpy.post).toHaveBeenCalled()   
    expect(httpClientSpy.post).toHaveBeenCalledWith('fake post comment url', body, headers)   
  })

   
});
