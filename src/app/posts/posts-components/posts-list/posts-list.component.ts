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
  postsList: Post[]
  postListFiltered: Post[]
  showComment: boolean
  commentsForm = new FormGroup({
    comments: new FormControl('', Validators.required)
  }) 
  addButtonVisdible: boolean = false

  constructor(private postsService: PostsListService, private dialog: MatDialog){}

  ngOnInit(): void {
    this.postsService.getPostsList().subscribe((data: Post[]) => {
      this.postsList= data
    })
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
      console.log('The dialog was closed');
      
    });
  }

  onComments(post_id: number){
    this.postsService.makeNewComment(post_id, this.commentsForm.value.comments).subscribe(data => this.ngOnInit())
  }

}
