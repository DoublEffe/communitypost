import { Component } from '@angular/core';
import { AuthService } from '../../../service/auth/auth.service';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostsListService } from '../../posts-service/posts-list.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.css'
})
export class NewPostComponent {
  newpostForm = new FormGroup({
    title: new FormControl('', Validators.required),
    body: new FormControl('', Validators.required),
  })

  constructor(public dialogRef: MatDialogRef<NewPostComponent>, private snackBar: MatSnackBar, private postService: PostsListService ){}
  
  onSubmit(){
    this.postService.makeNewPost(this.newpostForm.value.title, this.newpostForm.value.body).subscribe(data =>
      {
        this.dialogRef.close()
        this.snackBar.open('Added post','', {duration: 3000})
      }
    )
  }

  onNoClick(){
    this.dialogRef.close();
  }
}
