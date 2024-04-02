import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  activeLink: string // evidence the actual page on COMMUNITY/POSTS  bar
  

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
      localStorage.removeItem('user')
      this.router.navigate(['/login']) 
    }
  }
  
  

}
