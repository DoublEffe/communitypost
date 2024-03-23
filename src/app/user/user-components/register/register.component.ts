import { Component } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
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
  newuserForm = new FormGroup({
    email: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required),
  })

  constructor(private auth: AuthService, private userService: UsersListService, public dialogRef: MatDialogRef<RegisterComponent>, private snackBar: MatSnackBar){}

  onSubmit(){
    this.userService.signUp(this.newuserForm.value.email, this.newuserForm.value.name, this.newuserForm.value.gender, 'active').subscribe({next:(data: User) =>
      {
        this.dialogRef.close()
        localStorage.setItem('user', JSON.stringify({id: data.id, email: data.email, name: data.name, gender: data.gender, status: 'active'}))
        this.auth.storageObs.next(localStorage)
        this.snackBar.open('Added user '+ data.name,'', {duration: 3000})
      },
      error: (e)=> alert('email '+e.error[0].message)
    }
    )
  }

  onNoClick(){
    this.dialogRef.close();
  }
  
}
