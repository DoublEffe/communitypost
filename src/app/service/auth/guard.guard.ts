import { CanActivateFn } from '@angular/router';

import { AuthService } from './auth.service';
import { Inject, inject } from '@angular/core';
import { Router } from '@angular/router';


export const guardGuard: CanActivateFn = (route, state) => {

  return localStorage.getItem('auth')
    ? true
    : inject(Router).createUrlTree(['login'])
};
