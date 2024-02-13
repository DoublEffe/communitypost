import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { guardGuard } from './service/auth/guard.guard';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';


const routes: Routes = [
  {path: '', component: HomeComponent, canActivate: [guardGuard], children:[
    {path: 'posts', loadChildren: () => import('./posts/posts.module').then(m => m.PostsModule)},
    {path: 'users', loadChildren: () => import('./user/user.module').then(m => m.UserModule)},
    {path: '', redirectTo: 'users', pathMatch: 'full'},
  ]},
  {path: 'login', component: LoginComponent},
  {path: '**', component: NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
