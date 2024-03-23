import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { guardGuard } from './guard.guard';

describe('guardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => guardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
    let store = {}
    spyOn(window.localStorage, 'getItem').and.callFake((key:string) => store[key]||null )
    spyOn(window.localStorage, 'setItem').and.callFake((key:string, value:string) => store[key] = value)
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

 

});
