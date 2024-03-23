import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { UpdateDetailComponent } from './update-detail.component';
import { UsersListService } from '../../user-service/users-list.service';
import { of } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularMaterialModule } from '../../../materialdesign/angular-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserDetailComponent } from '../user-detail/user-detail.component';
import { MatDialogRef } from '@angular/material/dialog';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatSelectHarness } from '@angular/material/select/testing';




describe('UpdateDetailComponent', () => {
  let userServiceStub: Partial<UsersListService>
  let dialogRefStub: Partial<MatDialogRef<UserDetailComponent>>
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<UserDetailComponent>>
  let component: UpdateDetailComponent;
  let fixture: ComponentFixture<UpdateDetailComponent>;
  let loader: HarnessLoader
  let inputs: MatInputHarness[]
  let buttons: MatButtonHarness[]
  let select: MatSelectHarness[]

  
  const usersList = [{
    id: 0,
    email: 'test@test.it',
    name: 'test',
    gender: 'male',
    status: 'active'
  }]
  let UserServiceSpy = jasmine.createSpyObj('UsersListService', ['getUsersList'])
  dialogRefSpy = jasmine.createSpyObj('MatDIalogRef', ['close'])

  beforeEach( async() => {
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
      setUpdate(email, name, gender, status) {
          return of()
      },

    }
    const getUserListSpy = UserServiceSpy.getUsersList.and.returnValue(of(usersList))
   
    await TestBed.configureTestingModule({
      declarations: [UpdateDetailComponent, ],
      providers: [ {provide: UsersListService, useValue: userServiceStub}, {provide: MatDialogRef, useValue: dialogRefSpy}],
      imports: [AngularMaterialModule, BrowserAnimationsModule, ReactiveFormsModule ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateDetailComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture)
    inputs = await loader.getAllHarnesses(MatInputHarness)
    buttons = await loader.getAllHarnesses(MatButtonHarness)
    select = await loader.getAllHarnesses(MatSelectHarness)
    fixture.detectChanges();
  });

  it('should create', async () => {
    
    expect(component).toBeTruthy()
  });

  it('button should be disabled without input', async() => {
    expect(await inputs[0].isRequired()).toBeTruthy()
    expect(await inputs[1].isRequired()).toBeTruthy()
    expect(await select[0].isRequired()).toBeTruthy()
    expect(await select[1].isRequired()).toBeTruthy()
    expect(await buttons[1].isDisabled()).toBeTruthy()
  })

  it('button should be enable with input', async() => {  
    await inputs[0].setValue('test email')
    await inputs[1].setValue('test name')
    await select[0].clickOptions()
    await select[1].clickOptions()
    expect(await buttons[1].isDisabled()).toBe(false)
  })

  it('should send new post to the service', async() => {
    await inputs[0].setValue('testemail')
    await inputs[1].setValue('test name') 
    await select[0].clickOptions() 
    await select[1].clickOptions() 
    fixture.detectChanges()
    const formValues = {
      email: await inputs[0].getValue(),
      name: await inputs[1].getValue(),
      gender: 'Male',
      status: 'active'
    }
    
    
    spyOn(userServiceStub, 'setUpdate').and.callThrough()
    component.onSubmit()
    expect(userServiceStub.setUpdate).toHaveBeenCalledWith( formValues.email, formValues.name, formValues.gender, formValues.status )  
  })

  it('should close dialog', async() => {
    await buttons[0].click()
    component.onNoClick()
    expect(dialogRefSpy.close).toHaveBeenCalled()
  })
  

});
