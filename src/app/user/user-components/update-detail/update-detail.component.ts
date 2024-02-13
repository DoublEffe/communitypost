import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsersListService } from '../../user-service/users-list.service';
import { User } from '../../../models/User';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-update-detail',
  templateUrl: './update-detail.component.html',
  styleUrl: './update-detail.component.css'
})
export class UpdateDetailComponent {

  constructor(private userService: UsersListService, public dialogRef: MatDialogRef<UpdateDetailComponent>){}

  onSubmit(form: NgForm){
    this.userService.setUpdate(form.value.email, form.value.name, form.value.gender, form.value.status).subscribe((data: User) =>
      {
        this.dialogRef.close()
        
      },
      error => alert('email '+error.error[0].message)
    )
  }

  onNoClick(){
    this.dialogRef.close();
  }
}
