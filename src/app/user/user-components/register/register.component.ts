import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../service/auth/auth.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../../models/User';
import { UsersListService } from '../../user-service/users-list.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(private auth: AuthService, private userService: UsersListService, public dialogRef: MatDialogRef<RegisterComponent>, private snackBar: MatSnackBar){}

  onSubmit(form: NgForm){
    this.userService.signUp(form.value.email, form.value.name, form.value.gender, 'active').subscribe((data: User) =>
      {
        this.dialogRef.close()
        localStorage.setItem('user', JSON.stringify({id: data.id, email: data.email, name: data.name, gender: data.gender, status: 'active'}))
        this.auth.storageObs.next(localStorage)
        this.snackBar.open('Added user '+ data.name,'', {duration: 3000})
      },
      error => alert('email '+error.error[0].message)
    )
  }

  onNoClick(){
    this.dialogRef.close();
  }
  
}
