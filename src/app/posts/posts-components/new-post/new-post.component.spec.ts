import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPostComponent } from './new-post.component';
import { PostsListComponent } from '../posts-list/posts-list.component';
import { MatDialogRef } from '@angular/material/dialog';
import { PostsListService } from '../../posts-service/posts-list.service';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../../materialdesign/angular-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { of } from 'rxjs';


describe('NewPostComponent', () => {
  let component: NewPostComponent;
  let fixture: ComponentFixture<NewPostComponent>;
  let postsServiceSpy: jasmine.SpyObj<PostsListService>
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<PostsListComponent>>
  let loader: HarnessLoader
  let inputs: MatInputHarness[]
  let buttons: MatButtonHarness[]
  let title: MatInputHarness
  let body: MatInputHarness
  let back: MatButtonHarness
  let newPost: MatButtonHarness
  


  beforeEach(async () => {
    postsServiceSpy = jasmine.createSpyObj('PostsListService', ['makeNewPost'])
    dialogRefSpy = jasmine.createSpyObj('MatDIalogRef', ['close'])

    await TestBed.configureTestingModule({
      declarations: [NewPostComponent],
      providers: [{provide: MatDialogRef, useValue: dialogRefSpy}, {provide: PostsListService, useValue: postsServiceSpy}],
      imports: [ReactiveFormsModule, AngularMaterialModule, BrowserAnimationsModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewPostComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture)
    inputs = await loader.getAllHarnesses(MatInputHarness)
    buttons = await loader.getAllHarnesses(MatButtonHarness)
    title = inputs[0]
    body = inputs[1]
    back = buttons[0]
    newPost = buttons[1]
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('button should be disabled without input', async() => {
    expect(await title.isRequired()).toBe(true)
    expect(await body.isRequired()).toBe(true)
    expect(await newPost.isDisabled()).toBe(true)
  })

  it('button should be enable with input', async() => {  
    await title.setValue('test title')
    await body.setValue('test body')
    expect(await newPost.isDisabled()).toBe(false)
  })
  
  it('should send new post to the service', async() => {
    await title.setValue('test title')
    await body.setValue('test body')  
    const formValues = {
      title : await title.getValue(),
      body: await body.getValue()
    }
    await newPost.click()
    expect(postsServiceSpy.makeNewPost).toHaveBeenCalledWith( formValues.title, formValues.body )  
  })
  
  it('should close dialog', async() => {
    await back.click()
    expect(dialogRefSpy.close).toHaveBeenCalled()
  })

});
