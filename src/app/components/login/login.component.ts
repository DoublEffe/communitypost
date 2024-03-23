import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm = new FormGroup({
    token: new FormControl('', [Validators.required, Validators.minLength(64)],)
  })

  
  constructor(private router: Router){}


  onSubmit(){
    localStorage.setItem('auth', JSON.stringify({token: this.loginForm.value.token, isLoggedIn: true}))
    this.router.navigate(['/users'])
  }
}
