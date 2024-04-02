import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/User';
import { UsersListService } from '../../user-service/users-list.service';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../../../models/Post';
import { Comment } from '../../../models/Comment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdateDetailComponent } from '../update-detail/update-detail.component';
import { PostsListService } from '../../../posts/posts-service/posts-list.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css'
})
export class UserDetailComponent implements OnInit{
  userInfo: User[] 
  userPosts: Post[]
  postsComments: Comment[]
  commentFormGroups: { [key: string]: FormGroup } = {}
  actualUser: number // user deatil page is/isn't the user logged
  noPostDiv: boolean = false // user has/has not post

  constructor(private userService: UsersListService, private postService: PostsListService , private route: ActivatedRoute, private dialog: MatDialog, private snackBar: MatSnackBar){}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id']
  
    this.userService.getAllUser().subscribe((data: User[] )=> 
      this.userInfo = data.filter(user => user.id === Number(id))
    )

    this.userService.getUserPosts(id).subscribe((data: Post[]) => 
      { // check if current user has post and update noPostDiv
        if(data.length === 0){
          this.noPostDiv = true
        }
        this.userPosts = data
        this.userPosts.forEach(post => {
          this.commentFormGroups[post.id.toString()] = new FormGroup({
            comments: new FormControl('', Validators.required)
          })
        }) 
        data.map(post => 
          this.postService.getPostComments(String(post.id)).subscribe((data: Comment[]) => 
              this.postsComments = data
            ))
      }
    )
    // check the user and update actualUser to show update button info
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
    this.postService.makeNewComment(id, this.commentFormGroups[String(id)].value.comments).subscribe(data => this.ngOnInit())
  }

 

}
