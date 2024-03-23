import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostsListComponent } from './posts-components/posts-list/posts-list.component';
import { PostsCommentsComponent } from './posts-components/posts-comments/posts-comments.component';

const routes: Routes = [
  {path: '', component: PostsListComponent},
  {path: ':id', component: PostsCommentsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostsRoutingModule { }
