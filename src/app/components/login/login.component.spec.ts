// Import necessari per il test
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AngularMaterialModule } from '../../materialdesign/angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  // Dichiarazione delle variabili necessarie
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loader: HarnessLoader;

  // Configurazione del modulo di test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [AngularMaterialModule, ReactiveFormsModule, BrowserAnimationsModule]
    }).compileComponents();
    
    fixture = TestBed.createComponent(LoginComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Blocchi describe per organizzare i test
  describe('Component Creation', () => {
    // Test per verificare la creazione del componente
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('Form Validation', () => {
    // Test per verificare che il pulsante sia disabilitato con input errato
    it('button should be disabled with wrong input', async () => {
      const token_input = await loader.getHarness(MatInputHarness);
      const form = await loader.getHarness(MatFormFieldHarness);
      await token_input.setValue('wrong-token');
      expect(await token_input.isRequired()).toBe(true);
      const button = await loader.getHarness(MatButtonHarness);
      expect(await button.isDisabled()).toBe(true);
    });

    // Test per verificare che il pulsante sia abilitato con input corretto
    it('button should be enabled with correct input', async () => {
      const token_input = await loader.getHarness(MatInputHarness);
      await token_input.setValue('x'.repeat(64));
      const button = await loader.getHarness(MatButtonHarness);
      expect(await button.isDisabled()).toBe(false);
    });
  });

  describe('Navigation', () => {
    // Test per verificare la navigazione verso la pagina '/users'
    it('should navigate to users', async () => {
      const router = TestBed.inject(Router);
      spyOn(router, 'navigate');
      const token_input = await loader.getHarness(MatInputHarness);
      await token_input.setValue('x'.repeat(64));
      const button = fixture.debugElement.nativeElement.querySelector('button');
      button.click();
      fixture.detectChanges();
      expect(router.navigate).toHaveBeenCalledWith(['/users']);
    });
  });
});
