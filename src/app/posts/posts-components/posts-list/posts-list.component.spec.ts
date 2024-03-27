import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsListComponent } from './posts-list.component';
import { PostsListService } from '../../posts-service/posts-list.service';
import { AngularMaterialModule } from '../../../materialdesign/angular-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatCardHarness } from '@angular/material/card/testing';
import { By } from '@angular/platform-browser';


describe('PostsListComponent', () => {
  let component: PostsListComponent;
  let fixture: ComponentFixture<PostsListComponent>;
  let postsServiceStub: Partial<PostsListService>
  let loader: HarnessLoader




  beforeEach(async () => {
    postsServiceStub = {
      getPostsList() {
          return of([{
            id: 0,
            email: 'test@test.it',
            name: 'test',
            title: 'test title',
            body: 'test body',
          },
          {
            id: 1,
            email: 'test1@test1.it',
            name: 'test1',
            title: 'test title1',
            body: 'test body1',
          }
        ]
      )
      },
      makeNewComment(post, body) {
          return of()
      },
    }
    await TestBed.configureTestingModule({
      declarations: [PostsListComponent],
      providers: [{provide: PostsListService, useValue: postsServiceStub}],
      imports: [AngularMaterialModule, BrowserAnimationsModule, RouterTestingModule, FormsModule, ReactiveFormsModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostsListComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should see posts', async() => {
    const title = ['test title', 'test title1']
    postsServiceStub.getPostsList().subscribe((data: [] )=> component.postsList = data)
    fixture.detectChanges()
    const cards = await loader.getAllHarnesses(MatCardHarness)
    cards.map((card,i) => expect(component.postsList[i].title).toEqual(title[i]))
  })


  it('comment button should not be avilable without text', async() => {
    component.addButtonVisdible = true
    fixture.detectChanges()
    const input = await loader.getHarness(MatInputHarness.with({placeholder: 'Share your idea...'}))
    const button= await loader.getHarness(MatButtonHarness.with({text: 'Comment'}))
    expect( await input.isRequired()).toBeTruthy()
    expect(await button.isDisabled()).toBeTruthy()
  })

  it('should post a comment', async() => {
    postsServiceStub.getPostsList().subscribe((data: [] )=> component.postsList = data)
    component.addButtonVisdible = true
    fixture.detectChanges()
    const input = await loader.getHarness(MatInputHarness.with({placeholder: 'Share your idea...'}))
    await input.setValue('test comment')
    fixture.detectChanges()
    const button= await loader.getHarness(MatButtonHarness.with({text: 'Comment'}))
    expect(await button.isDisabled()).toBeFalsy()
    fixture.detectChanges()
    spyOn(postsServiceStub, 'makeNewComment').and.callThrough()
    component.onComments(0)
    expect(postsServiceStub.makeNewComment).toHaveBeenCalledWith(0, await input.getValue())
  })

  it('should show filtered posts', async() => {
    postsServiceStub.getPostsList().subscribe((data: [] )=> component.postsList = data)
    const input = await loader.getHarness(MatInputHarness.with({placeholder: 'Ex. example title'}))
    await input.setValue('test title1')
    fixture.detectChanges()
    const filter = await input.getValue()
    component.postListFiltered = component.postsList.filter((post) => post.title === filter)
    fixture.detectChanges()
    const cards = await loader.getAllHarnesses(MatCardHarness)
    cards.map(async(card,i) => expect(component.postListFiltered[i].title).toEqual(filter))
  })

  it('enable/disable add post button', async() => {
    let store = {}
    spyOn(window.localStorage, 'getItem').and.callFake((key:string) => store[key]||null )
    spyOn(window.localStorage, 'setItem').and.callFake((key:string, value:string) => store[key] = value)
    expect(localStorage.getItem('user')).toBeNull()
    expect(component.addButtonVisdible).toBeFalsy()
    const div = fixture.debugElement.query(By.css('.button-div button'))
    expect(div).toBeNull()
    localStorage.setItem('user', 'user fake data')
    expect(localStorage.getItem('user')).toEqual('user fake data')
    component.ngOnInit()
    expect(component.addButtonVisdible).toBeTruthy()
    expect(div).toBeDefined()
  })
  
});
