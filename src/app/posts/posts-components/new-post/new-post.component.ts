import { Component } from '@angular/core';
import { AuthService } from '../../../service/auth/auth.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostsListService } from '../../posts-service/posts-list.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.css'
})
export class NewPostComponent {
  constructor(public dialogRef: MatDialogRef<NewPostComponent>, private snackBar: MatSnackBar, private postService: PostsListService ){}

  
  onSubmit(form: NgForm){
    this.postService.makeNewPost(form.value.title, form.value.body).subscribe(data =>
      {
        this.dialogRef.close()
        this.snackBar.open('Added post','', {duration: 3000})
        console.log(data)
      }
    )
  }

  onNoClick(){
    this.dialogRef.close();
  }
}
