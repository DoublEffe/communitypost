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
  noCommentsDiv: boolean = false

  constructor(private postService: PostsListService, private route: ActivatedRoute){}

  ngOnInit(): void {
    const postId = this.route.snapshot.params['id']
    this.postService.getPostsList().subscribe( (data: Post[]) =>  
      this.post = data.filter(post => post.id === Number(postId)) 
    )
      
    this.postService.getPostComments(postId).subscribe((data: Comment[]) => 
        {
          if(data.length === 0){
            this.noCommentsDiv = true
          }
          this.postComments = data.filter(comment => comment.post_id === Number(postId))
        }
      )
  }

  onComments(id: number){
    this.postService.makeNewComment(id, this.commentsForm.value.comments).subscribe(data => this.ngOnInit())
  }
}
