// Import necessari per il test
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
  // Dichiarazione delle variabili necessarie
  let userServiceStub: Partial<UsersListService>; // Stub per il servizio degli utenti
  let dialogRefStub: Partial<MatDialogRef<UserDetailComponent>>; // Stub per MatDialogRef
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<UserDetailComponent>>; // Spy per MatDialogRef
  let component: UpdateDetailComponent; // Componente da testare
  let fixture: ComponentFixture<UpdateDetailComponent>; // Fixture per il componente
  let loader: HarnessLoader; // Loader per i componenti Material Harness
  let inputs: MatInputHarness[]; // Array di input harness
  let buttons: MatButtonHarness[]; // Array di button harness
  let select: MatSelectHarness[]; // Array di select harness

  // Dati di esempio per il test
  const usersList = [{
    id: 0,
    email: 'test@test.it',
    name: 'test',
    gender: 'male',
    status: 'active'
  }];

  // Creazione di uno spy per il servizio utenti
  let UserServiceSpy = jasmine.createSpyObj('UsersListService', ['getUsersList']);
  // Creazione di uno spy per il MatDialogRef
  dialogRefSpy = jasmine.createSpyObj('MatDIalogRef', ['close']);

  beforeEach(async () => {
    // Configurazione dello stub per il servizio utenti e del MatDialogRef
    userServiceStub = {
      getUsersList() {
        return of({
          id: 0,
          email: 'test@test.it',
          name: 'test',
          gender: 'male',
          status: 'active'
        });
      },
      setUpdate(email, name, gender, status) {
        return of();
      }
    };

    // Configurazione del metodo getUsersList del servizio utenti
    const getUserListSpy = UserServiceSpy.getUsersList.and.returnValue(of(usersList));

    // Configurazione del TestBed
    await TestBed.configureTestingModule({
      declarations: [UpdateDetailComponent],
      providers: [
        { provide: UsersListService, useValue: userServiceStub }, // Stub per il servizio utenti
        { provide: MatDialogRef, useValue: dialogRefSpy } // Stub per MatDialogRef
      ],
      imports: [AngularMaterialModule, BrowserAnimationsModule, ReactiveFormsModule, FormsModule] // Moduli necessari per i test
    }).compileComponents();

    // Creazione del componente e inizializzazione delle variabili
    fixture = TestBed.createComponent(UpdateDetailComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    inputs = await loader.getAllHarnesses(MatInputHarness);
    buttons = await loader.getAllHarnesses(MatButtonHarness);
    select = await loader.getAllHarnesses(MatSelectHarness);
    fixture.detectChanges(); // Rende il componente visibile
  });

  // Test per la creazione del componente
  it('should create', async () => {
    expect(component).toBeTruthy(); // Verifica che il componente sia stato creato con successo
  });

  // Blocchi di test per il comportamento dei bottoni in base all'input
  describe('button should be disabled without input', () => {
    // Verifica che i campi siano obbligatori
    it('should have required fields', async () => {
      expect(await inputs[0].isRequired()).toBeTruthy();
      expect(await inputs[1].isRequired()).toBeTruthy();
      expect(await select[0].isRequired()).toBeTruthy();
      expect(await select[1].isRequired()).toBeTruthy();
    });

    // Verifica che il bottone di submit sia disabilitato senza input
    it('should disable submit button', async () => {
      expect(await buttons[1].isDisabled()).toBeTruthy();
    });
  });

  // Blocchi di test per il comportamento dei bottoni con input
  describe('button should be enabled with input', () => {
    beforeEach(async () => {
      await inputs[0].setValue('test email');
      await inputs[1].setValue('test name');
      await select[0].clickOptions();
      await select[1].clickOptions();
    });

    // Verifica che il bottone di submit sia abilitato con input
    it('should enable submit button', async () => {
      expect(await buttons[1].isDisabled()).toBe(false);
    });
  });

  // Blocchi di test per l'invio di un nuovo post al servizio
  describe('should send new post to the service', () => {
    beforeEach(async () => {
      await inputs[0].setValue('testemail');
      await inputs[1].setValue('test name');
      await select[0].clickOptions();
      await select[1].clickOptions();
      fixture.detectChanges();
    });

    // Verifica che il metodo setUpdate del servizio sia chiamato con i valori del form
    it('should call setUpdate method with form values', () => {
      const formValues = {
        email: 'testemail',
        name: 'test name',
        gender: 'Male',
        status: 'active'
      };

      spyOn(userServiceStub, 'setUpdate').and.callThrough();
      component.onSubmit();
      expect(userServiceStub.setUpdate).toHaveBeenCalledWith(formValues.email, formValues.name, formValues.gender, formValues.status);
    });
  });

  // Blocchi di test per la chiusura del dialog
  describe('should close dialog', () => {
    // Verifica che il metodo close di MatDialogRef sia chiamato
    it('should call close method of MatDialogRef', async () => {
      await buttons[0].click();
      component.onNoClick();
      expect(dialogRefSpy.close).toHaveBeenCalled();
    });
  });
});