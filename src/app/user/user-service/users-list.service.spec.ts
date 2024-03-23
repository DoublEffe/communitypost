import { TestBed } from '@angular/core/testing';

import { UsersListService } from './users-list.service';
import { HttpClient } from '@angular/common/http';

describe('UsersListService', () => {
  let service: UsersListService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;


  beforeEach(() => {
    TestBed.configureTestingModule({});
    service =  new UsersListService(httpClientSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
