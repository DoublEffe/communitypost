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
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports:[AngularMaterialModule, ReactiveFormsModule,BrowserAnimationsModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginComponent);
    loader = TestbedHarnessEnvironment.loader(fixture)
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('button should be disabled with wrong input', async() => {
    const token_input = await loader.getHarness(MatInputHarness)
    const form = await loader.getHarness(MatFormFieldHarness)
    await token_input.setValue('wrong-token')
    expect(await token_input.isRequired()).toBe(true)
    const button = await loader.getHarness(MatButtonHarness)
    expect(await button.isDisabled()).toBe(true)
  })

  it('button should be enabled with correct imput', async() => {
    const token_input = await loader.getHarness(MatInputHarness)
    await token_input.setValue('x'.repeat(64))
    const button = await loader.getHarness(MatButtonHarness)
    expect(await button.isDisabled()).toBe(false)
  })

  it('should navigate to users', async() => {
    const router= TestBed.inject(Router)
     spyOn(router, 'navigate')
     const token_input = await loader.getHarness(MatInputHarness)
     await token_input.setValue('x'.repeat(64))
     const button = fixture.debugElement.nativeElement.querySelector('button')
     button.click()
     fixture.detectChanges()
     expect(router.navigate).toHaveBeenCalledWith(['/users']);
  })
});
