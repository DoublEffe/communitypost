import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  activeLink: string 
  

  constructor(private router: Router){
    
    this.router.events.subscribe((data: NavigationEnd)=> {
      if(data.url !== undefined){
        this.activeLink=data.url
      }
    })
  }

  onLogout(){
    if(window.confirm('You are logging out. Are you sure?')){
      localStorage.removeItem('auth')
      //window.location.reload()  
    }
  }
  
  

}
