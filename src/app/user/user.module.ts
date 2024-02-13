import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../materialdesign/angular-material.module';

import { UsersListComponent } from './user-components/users-list/users-list.component'; 
import { RegisterComponent } from './user-components/register/register.component'; 
import { UserDetailComponent } from './user-components/user-detail/user-detail.component'; 
import { UpdateDetailComponent } from './user-components/update-detail/update-detail.component';


@NgModule({
  declarations: [
    UsersListComponent,
    RegisterComponent,
    UserDetailComponent,
    UpdateDetailComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule
  ]
})
export class UserModule { }
