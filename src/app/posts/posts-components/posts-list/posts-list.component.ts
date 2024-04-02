import { Component, OnInit } from '@angular/core';
import { PostsListService } from '../../posts-service/posts-list.service';
import { Post } from '../../../models/Post';
import { MatDialog } from '@angular/material/dialog';
import { NewPostComponent } from '../new-post/new-post.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../service/auth/auth.service';





@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.css'
})
export class PostsListComponent implements OnInit {
  postsList: Post[] //all post
  postListFiltered: Post[] // post after filters
  commentFormGroups: { [key: string]: FormGroup } = {}
  addButtonVisdible: boolean = false // show/hide add post button and comment box

  constructor(private postsService: PostsListService, private dialog: MatDialog){}

  ngOnInit(): void {
    this.postsService.getPostsList().subscribe((data: Post[]) => {
      this.postsList= data
      this.postsList.forEach(post => {
        this.commentFormGroups[post.id.toString()] = new FormGroup({
          comments: new FormControl('', Validators.required)
        })
      })
    })
    // show button to add post and comment box only if user exist
    if(localStorage.getItem('user')){
      this.addButtonVisdible = true
    }

  }

  onFilter(event: Event){
    let filter = (<HTMLInputElement>event.target).value
    this.postListFiltered = this.postsList.filter(post => post.title.slice(0,filter.length).toLowerCase() === filter)
  }

  openDialog() {
    
    const dialogRef = this.dialog.open(NewPostComponent, {
      width: '400px',
      height: '500px'
    
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit() 
    });
  }

  onComments(post_id: number){ 
    this.postsService.makeNewComment(post_id, this.commentFormGroups[String(post_id)].value.comments).subscribe(data => {
      this.commentFormGroups[String(post_id)].value.comments = ''
      this.ngOnInit()
    })
  }

}
