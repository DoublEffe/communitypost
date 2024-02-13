import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersListComponent } from './user-components/users-list/users-list.component';
import { UserDetailComponent } from './user-components/user-detail/user-detail.component';

const routes: Routes = [
  {path: '', component: UsersListComponent}, 
  {path: 'users/:id', component: UserDetailComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
