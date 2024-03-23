import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;


  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = new AuthService(httpClientSpy);
    let store = {}
    spyOn(window.localStorage, 'getItem').and.callFake((key:string) => store[key]||null )
    spyOn(window.localStorage, 'setItem').and.callFake((key:string, value:string) => store[key] = value)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('token should exist', () => {
    localStorage.setItem('token', 'fake token')
    service.token = localStorage.getItem('token')
    expect(service.token).toEqual('fake token')
  })

});
