import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UsersListService } from '../../user-service/users-list.service';
import { User } from '../../../models/User';
import { RegisterComponent } from '../register/register.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../service/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent implements OnInit{
  usersList: User[]
  pageOption: number[] = [10, 20, 30, 40, 50, 60 ,70 ,80 , 90, 100]
  pageSelected: string = this.usersService.pageNumber
  usersFiltered: User[]
  addButtonVisible: boolean 
  actualUserId: number

  constructor(private usersService: UsersListService, private dialog: MatDialog, private auth: AuthService, private snackBar: MatSnackBar, private router: Router){ 
    this.pageSelected = this.usersService.pageNumber
  }

  ngOnInit(): void {
    this.usersService.getUsersList().subscribe((data: User[]) => {
      const inactiveUsers: User[] = data.filter(user => user.status === 'inactive')
      const activeUsers: User[] = data.filter(user => user.status === 'active')
      this.usersList = activeUsers.concat(inactiveUsers) 
    })    
    if(!localStorage.getItem('user')){
      this.actualUserId = 0
      this.addButtonVisible = true
    }
    else{
      this.actualUserId = JSON.parse(localStorage.getItem('user')).id
    }
  }

  filterName(event: Event){
    let filter = (<HTMLInputElement>event.target).value
    this.usersFiltered = this.usersList.filter(user => user.name.slice(0,filter.length).toLowerCase() === filter)
  }

  filterGender(event: Event){
    let filter = (<HTMLInputElement>event.target).value
    this.usersFiltered = this.usersList.filter(user => user.gender.slice(0,filter.length).toLowerCase() === filter)   
  }

  filterPage(page: string){
    this.usersService.pageNumber = page
    this.ngOnInit()
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(RegisterComponent, {
      width: '400px',
      height: '350px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.addButtonVisible = false
        this.auth.storageObs.subscribe({
          next: x => {
            if(x.length === 3){
              this.actualUserId = JSON.parse(x.getItem('user')).id
              this.ngOnInit()    
            } 
          }
        }
        )

      }
    });
  }

  onDelete(id: number, name: string) {
    if(window.confirm(`Are you sure you want to delete ${JSON.parse(localStorage.getItem('user')).name}`)){
      this.usersService.deleteUser(id).subscribe(data => 
      {
        localStorage.removeItem('user')
        this.ngOnInit()
      }
    )
      this.snackBar.open('Deleted user'+ name,'', {duration: 3000})
    }
  }

}
