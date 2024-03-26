import { Component, OnInit } from '@angular/core';
import { PostsListService } from '../../posts-service/posts-list.service';
import { Comment } from '../../../models/Comment';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../../../models/Post';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-posts-comments',
  templateUrl: './posts-comments.component.html',
  styleUrl: './posts-comments.component.css'
})
export class PostsCommentsComponent implements OnInit{
  postComments: Comment[]
  post: Post[]
  commentsForm = new FormGroup({
    comments: new FormControl('', Validators.required)
  })
  noCommentsDiv: boolean = false // show/hide div element
  showCommentBox: boolean = false // show/hide comment box

  constructor(private postService: PostsListService, private route: ActivatedRoute){}

  ngOnInit(): void {
    const postId = this.route.snapshot.params['id']
    this.postService.getPostsList().subscribe( (data: Post[]) =>  
      this.post = data.filter(post => post.id === Number(postId)) 
    )
      
    this.postService.getPostComments(postId).subscribe((data: Comment[]) => 
        { //checj if there are not comments and show a different div element
          if(data.length === 0){
            this.noCommentsDiv = true
          }
          this.postComments = data.filter(comment => comment.post_id === Number(postId))
        }
      )
      // check user exist and show comment box
      if(localStorage.getItem('user')){
        this.showCommentBox = true
      }
  }

  onComments(id: number){
    this.postService.makeNewComment(id, this.commentsForm.value.comments).subscribe(data => this.ngOnInit())
  }
}
