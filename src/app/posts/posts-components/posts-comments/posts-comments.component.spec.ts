import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsCommentsComponent } from './posts-comments.component';
import { PostsListService } from '../../posts-service/posts-list.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../../materialdesign/angular-material.module';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import {MatCardHarness} from '@angular/material/card/testing'
import { MatInputHarness } from '@angular/material/input/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';


describe('PostsCommentsComponent', () => {
  let component: PostsCommentsComponent;
  let fixture: ComponentFixture<PostsCommentsComponent>;
  let postsServiceStub: Partial<PostsListService>
  let snapshotStub: jasmine.SpyObj<ActivatedRoute>
  let loader: HarnessLoader
  let postsServiceSpy: jasmine.SpyObj<PostsListService>


  beforeEach(async () => {
    postsServiceSpy = jasmine.createSpyObj('PostsListService', ['makeNewComment', 'getPostsList', 'getPostComments'])

    postsServiceStub = {
      
      getPostsList() {
        return  of([{
          id: 0,
          email: 'test@test.it',
          name: 'test',
          title: 'test title',
          body: 'test body',
        }])
      },
      getPostComments(id) {
          return of([{
            id: 0,
            post_id: 0,
            name: 'test name',
            email: 'test email',
            body: 'test body comment'
          }])
      },
      makeNewComment(post, body) {
          return of()
      },
    }
    snapshotStub = jasmine.createSpyObj('ActivatedRoute', {snapshot: {params: {id: '0'}}})
    await TestBed.configureTestingModule({
      declarations: [PostsCommentsComponent],
      providers: [{provide: PostsListService, useValue: postsServiceStub}, {provide: ActivatedRoute, useValue: {snapshot: {params: '0'}}}],
      imports: [ReactiveFormsModule, AngularMaterialModule, BrowserAnimationsModule, NoopAnimationsModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostsCommentsComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init the post selected and the relative comments', async () => {
    const post = [{
      id: 0,
      email: 'test@test.it',
      name: 'test',
      title: 'test title',
      body: 'test body',
    }]

    const comment = [{
      id: 0,
      post_id: 0,
      name: 'test name',
      email: 'test email',
      body: 'test body comment'
    }]

    postsServiceStub.getPostsList().subscribe((data: [] )=> component.post = data.filter((post: any) => post.id === 0))
    expect(component.post).toEqual(post)
    postsServiceStub.getPostComments('0').subscribe((data: [] )=> component.postComments = data.filter((comment: any) => comment.post_id === 0))
    expect(component.postComments).toEqual(comment)
    component.noCommentsDiv = false
    expect(component.noCommentsDiv).toBeFalsy()
    fixture.detectChanges()
    const commentdiv = fixture.debugElement.query(By.css('.comments-div p'))
    const card = await loader.getHarness(MatCardHarness)
    expect(await card.getTitleText()).toBe('test title')
    expect(commentdiv.nativeElement.innerText).toEqual(`${comment[0].name} said: ${comment[0].body}`)

  })

  it('should not display comments if there are not', () => {
    spyOn(postsServiceStub, 'getPostComments').and.callFake(()=>of([]))
    component.ngOnInit()
    expect(component.noCommentsDiv).toBeTruthy()
    fixture.detectChanges()
    const commentdiv = fixture.debugElement.query(By.css('.no-comments h4'))
    expect(commentdiv.nativeElement.innerText).toBe('No comments available')
    
    


  })
  
  it('comment button should not be avilable without text', async() => {
    component.showCommentBox = true
    fixture.detectChanges()
    postsServiceStub.getPostsList().subscribe((data: [] )=> component.post = data.filter((post: any) => post.id === 0))
    const input = await loader.getHarness(MatInputHarness)
    const button= await loader.getHarness(MatButtonHarness)
    expect(await input.isRequired()).toBeTruthy()
    expect(await button.isDisabled()).toBeTruthy()
  })

  it('box comment available only after user in localstorage', () => {
    let store = {}
    const post = [{
      id: 0,
      email: 'test@test.it',
      name: 'test',
      title: 'test title',
      body: 'test body',
    }]

    const comment = [{
      id: 0,
      post_id: 0,
      name: 'test name',
      email: 'test email',
      body: 'test body comment'
    }]
    postsServiceStub.getPostsList().subscribe((data: [] )=> component.post = data.filter((post: any) => post.id === 0))
    expect(component.post).toEqual(post)
    postsServiceStub.getPostComments('0').subscribe((data: [] )=> component.postComments = data.filter((comment: any) => comment.post_id === 0))
    expect(component.postComments).toEqual(comment)
    fixture.detectChanges()
    expect(component.showCommentBox).toBeFalsy()
    spyOn(window.localStorage, 'setItem').and.callFake((key:string, value:string) => store[key] = value)
    spyOn(window.localStorage, 'getItem').and.callFake((key:string) => store[key]||null )
    localStorage.setItem('user', JSON.stringify({name:'test',email:'test'}))
    fixture.detectChanges()
    component.ngOnInit()
    expect(component.showCommentBox).toBeTruthy()
  })

  it('should post comment', async() => {
    let store = {}
    const post = [{
      id: 0,
      email: 'test@test.it',
      name: 'test',
      title: 'test title',
      body: 'test body',
    }]

    const comment = [{
      id: 0,
      post_id: 0,
      name: 'test name',
      email: 'test email',
      body: 'test body comment'
    }]

    spyOn(window.localStorage, 'setItem').and.callFake((key:string, value:string) => store[key] = value)
    spyOn(window.localStorage, 'getItem').and.callFake((key:string) => store[key]||null )
    localStorage.setItem('user', JSON.stringify({name:'test',email:'test'}))
    postsServiceStub.getPostsList().subscribe((data: [] )=> component.post = data.filter((post: any) => post.id === 0))
    expect(component.post).toEqual(post)
    postsServiceStub.getPostComments('0').subscribe((data: [] )=> component.postComments = data.filter((comment: any) => comment.post_id === 0))
    expect(component.postComments).toEqual(comment)
    fixture.detectChanges()
    component.showCommentBox = true
    fixture.detectChanges()
    const input = await loader.getHarness(MatInputHarness)
    await input.setValue('test comment')
    fixture.detectChanges()
    const button= await loader.getHarness(MatButtonHarness)
    expect(await button.isDisabled()).toBeFalsy()
    fixture.detectChanges()
    spyOn(postsServiceStub, 'makeNewComment').and.callThrough()
    component.onComments(0)
    expect(postsServiceStub.makeNewComment).toHaveBeenCalledWith(0, await input.getValue())
  })
});
