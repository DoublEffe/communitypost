import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersListComponent } from './user-components/users-list/users-list.component';
import { UserDetailComponent } from './user-components/user-detail/user-detail.component';
import { PostsCommentsComponent } from '../posts/posts-components/posts-comments/posts-comments.component';
import { HomeComponent } from '../components/home/home.component';

const routes: Routes = [
  {path: '', component: UsersListComponent}, 
  {path: ':id', component: UserDetailComponent},
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
