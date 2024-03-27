import { TestBed } from '@angular/core/testing';

import { UsersListService } from './users-list.service';
import { HttpClient } from '@angular/common/http';

describe('UsersListService', () => {
  let service: UsersListService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let getItemSpy: jasmine.Spy;
  let headers: {}



  beforeEach(() => {
    TestBed.configureTestingModule({});
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    let store = {}
    spyOn(window.localStorage, 'setItem').and.callFake((key:string, value:string) => store[key] = value)
    getItemSpy = spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({ token: 'testToken' }));
    service =  new UsersListService(httpClientSpy);
    localStorage.setItem('token', 'token fake')
    service.token = localStorage.getItem('token')
    headers = {headers:{'Authorization': 'Bearer '+service.token}}
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve  the user', () => {
    service.getUsersList()
    httpClientSpy.get('fake get posts url', headers)
    expect(httpClientSpy.get).toHaveBeenCalled()   
    expect(httpClientSpy.get).toHaveBeenCalledWith('fake get posts url', headers)
  })

  it('should create new user', () => {
    const body = {name: 'fake name', email: 'fake email', gender: 'fake gender', status: 'acrive'}
    const id = localStorage.setItem('user', JSON.stringify({id:0, name:'test'}))
    service.signUp('fake name', 'fake email', 'fake gender', 'active')
    httpClientSpy.post('fake post posts url', body, headers)
    expect(httpClientSpy.post).toHaveBeenCalled()   
    expect(httpClientSpy.post).toHaveBeenCalledWith('fake post posts url', body ,  headers)
  })

  it('retrieve all user', () => {
    service.getAllUser()
    httpClientSpy.get('fake get posts url', headers)
    expect(httpClientSpy.get).toHaveBeenCalled()   
    expect(httpClientSpy.get).toHaveBeenCalledWith('fake get posts url', headers)
  })


});
