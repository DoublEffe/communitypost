import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { UsersListService } from '../../user-service/users-list.service';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, of } from 'rxjs';
import { AuthService } from '../../../service/auth/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../../materialdesign/angular-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import {MatSelectHarness} from '@angular/material/select/testing';
import { UsersListComponent } from '../users-list/users-list.component';
import { input } from '@angular/core';

describe('RegisterComponent', () => {
  let userServiceStub: Partial<UsersListService>
  let authServiceStub: Partial<AuthService>
  let dialogRefStub: Partial<MatDialogRef<UsersListComponent>>
  let usersServiceSpy: jasmine.SpyObj<UsersListService>
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<UsersListComponent>>
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let loader: HarnessLoader
  let inputs: MatInputHarness[]
  let buttons: MatButtonHarness[]
  let select: MatSelectHarness


  beforeEach(async () => {
    usersServiceSpy = jasmine.createSpyObj('UsersListService', ['signUp'])
    dialogRefSpy = jasmine.createSpyObj('MatDIalogRef', ['close'])
    userServiceStub = {
      getUsersList() {
        return  of({
          id: 0,
          email: 'test@test.it',
          name: 'test',
          gender: 'male',
          status: 'active'
        })
    },
    signUp(email, name, gender, status) {
        return of()
    },
    }

    authServiceStub = {
      storageObs: new BehaviorSubject(localStorage)
    }
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [{provide: UsersListService, useValue: userServiceStub}, {provide: AuthService, useValue: authServiceStub}, {provide: MatDialogRef, useValue: dialogRefSpy}],
      imports: [ReactiveFormsModule, AngularMaterialModule, BrowserAnimationsModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture)
    inputs = await loader.getAllHarnesses(MatInputHarness)
    buttons = await loader.getAllHarnesses(MatButtonHarness)
    select = await loader.getHarness(MatSelectHarness)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('button should be disabled without input', async() => {
    expect(await inputs[0].isRequired()).toBeTruthy()
    expect(await inputs[1].isRequired()).toBeTruthy()
    expect(await select.isRequired()).toBeTruthy()
    expect(await buttons[1].isDisabled()).toBeTruthy()
  })

  it('button should be enable with input', async() => {  
    await inputs[0].setValue('test email')
    await inputs[1].setValue('test name')
    await select.clickOptions()
    expect(await buttons[1].isDisabled()).toBe(false)
  })

  it('should send new post to the service', async() => {
    await inputs[0].setValue('testemail')
    await inputs[1].setValue('test name') 
    await select.clickOptions() 
    fixture.detectChanges()
    const formValues = {
      email: await inputs[0].getValue(),
      name: await inputs[1].getValue(),
      gender: 'Male',
      status: 'active'
    }
    
    
    spyOn(userServiceStub, 'signUp').and.callThrough()
    component.onSubmit()
    expect(userServiceStub.signUp).toHaveBeenCalledWith( formValues.email, formValues.name, formValues.gender, formValues.status )  
  })

  it('should close dialog', async() => {
    await buttons[0].click()
    component.onNoClick()
    expect(dialogRefSpy.close).toHaveBeenCalled()
  })


});
