// Import necessari per il test
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { UsersListService } from '../../user-service/users-list.service';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, of } from 'rxjs';
import { AuthService } from '../../../service/auth/auth.service';
import {  ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../../materialdesign/angular-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import {MatSelectHarness} from '@angular/material/select/testing';
import { UsersListComponent } from '../users-list/users-list.component';


describe('RegisterComponent', () => {
  // Dichiarazione delle variabili necessarie
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

  describe('button should be disabled without input', () => {
    
    it('should have required fields', async () => {
      expect(await inputs[0].isRequired()).toBeTruthy();
      expect(await inputs[1].isRequired()).toBeTruthy();
      expect(await select.isRequired()).toBeTruthy();
    });

    it('should disable submit button', async () => {
      expect(await buttons[1].isDisabled()).toBeTruthy();
    });
  });

  describe('button should be enabled with input', () => {
    beforeEach(async () => {
      // Simula l'immissione di input nei campi prima di ogni test
      await inputs[0].setValue('test email');
      await inputs[1].setValue('test name');
      await select.clickOptions();
    });

    it('should enable submit button', async () => {
      expect(await buttons[1].isDisabled()).toBe(false);
    });
  });

  describe('should send new post to the service', () => {
    beforeEach(async () => {
      // Simula l'immissione di dati nei campi prima di ogni test
      await inputs[0].setValue('testemail');
      await inputs[1].setValue('test name');
      await select.clickOptions();
      fixture.detectChanges();
    });

    it('should call signUp method with form values', () => {
      // Ottiene i valori inseriti nel form
      const formValues = {
        email: 'testemail',
        name: 'test name',
        gender: 'Male',
        status: 'active'
      };
      // Simula l'invio del form e verifica che i dati siano stati inviati al servizio
      spyOn(userServiceStub, 'signUp').and.callThrough();
      component.onSubmit();
      expect(userServiceStub.signUp).toHaveBeenCalledWith(formValues.email, formValues.name, formValues.gender, formValues.status);
    });
  });

  describe('should close dialog', () => {
    it('should call close method of MatDialogRef', async () => {
      // Simula il clic sul pulsante di chiusura
      await buttons[0].click();
      component.onNoClick();
      // Verifica che il metodo close del MatDialogRef sia stato chiamato
      expect(dialogRefSpy.close).toHaveBeenCalled();
    });
  });
});
