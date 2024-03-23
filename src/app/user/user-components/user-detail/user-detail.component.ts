import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/User';
import { UsersListService } from '../../user-service/users-list.service';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../../../models/Post';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdateDetailComponent } from '../update-detail/update-detail.component';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css'
})
export class UserDetailComponent implements OnInit{
  userInfo: User[]
  userPosts: Post[]
  commentsForm = new FormGroup({
    comments: new FormControl('', Validators.required)
  })
  actualUser: number
  noPostDiv: boolean = false

  constructor(private userService: UsersListService, private route: ActivatedRoute, private dialog: MatDialog, private snackBar: MatSnackBar){}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id']
  
    this.userService.getAllUser().subscribe((data: User[] )=> 
      this.userInfo = data.filter(user => user.id === Number(id))
    )

    this.userService.getUserPosts(id).subscribe((data: Post[]) => 
      {
        if(data.length === 0){
          this.noPostDiv = true
        }
        this.userPosts = data}
    )
    if(!localStorage.getItem('user')){
      this.actualUser = 0
    }
    else{
      this.actualUser = JSON.parse(localStorage.getItem('user')).id
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(UpdateDetailComponent, {
      width: '400px',
      height: '350px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
       this.ngOnInit()
       this.snackBar.open('user Updated', '', {duration: 3000})
      }
    });
  }

  onComments(id: number){

  }

 

}
