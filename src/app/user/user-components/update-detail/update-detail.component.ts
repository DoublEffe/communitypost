import { Component } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { UsersListService } from '../../user-service/users-list.service';
import { User } from '../../../models/User';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-update-detail',
  templateUrl: './update-detail.component.html',
  styleUrl: './update-detail.component.css'
})
export class UpdateDetailComponent {
  updateForm = new FormGroup({
    email: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required)
  })

  constructor(private userService: UsersListService, public dialogRef: MatDialogRef<UpdateDetailComponent>){}

  onSubmit(){
    this.userService.setUpdate(this.updateForm.value.email, this.updateForm.value.name, this.updateForm.value.gender, this.updateForm.value.status).subscribe((data: User) =>
      {
        this.dialogRef.close()
        localStorage.setItem('user', JSON.stringify({id: data.id, email: data.email, name: data.name, gender: data.gender, status: data.status}))
      },
      error => alert(+error.error[0].message)
    )
  }

  onNoClick(){
    this.dialogRef.close();
  }
}
