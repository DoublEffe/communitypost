import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDetailComponent } from './user-detail.component';
import { UsersListService } from '../../user-service/users-list.service';
import { ActivatedRoute } from '@angular/router';
import {  of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularMaterialModule } from '../../../materialdesign/angular-material.module';
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UpdateDetailComponent } from '../update-detail/update-detail.component';
import { PostsListService } from '../../../posts/posts-service/posts-list.service';


describe('UserDetailComponent', () => {
  let component: UserDetailComponent;
  let fixture: ComponentFixture<UserDetailComponent>;
  let userServiceStub: Partial<UsersListService>
  let postServiceStub: Partial<PostsListService>
  let routeStub: ActivatedRoute
  let loader: HarnessLoader
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<UpdateDetailComponent>>
  let postsServiceSpy: jasmine.SpyObj<PostsListService>
  let userServiceSpy: jasmine.SpyObj<UsersListService>
  let dialogSpy: MatDialog


  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef',['afterClosed'] )
    postsServiceSpy = jasmine.createSpyObj('PostsListService', ['makeNewComment', 'getPostsList', 'getUserPosts', 'getPostComments'])
    userServiceSpy = jasmine.createSpyObj('UsersListService', ['getUsersList', 'getAllUser', 'getUserPosts', 'getPostComments'])
    
    postServiceStub = {
      getPostComments(id) {
          return of([{
            id: 0,
            post_id: 0,
            name: 'test name',
            email: 'test email',
            body: 'test body comment'
          }])
      },
    }

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
      getAllUser() {
        return  of([{
          id: 1,
          email: 'test@test.it',
          name: 'test',
          gender: 'male',
          status: 'active'
        }],
        )
      },
      getUserPosts(id) {
          return of([{
            id: 0,
            title: 'testtitle',
            body: 'testbody'
          }])
      },
    }
    await TestBed.configureTestingModule({
      declarations: [UserDetailComponent],
      providers: [{provide: UsersListService, useValue: userServiceStub}, {provide: PostsListService, useValue: postServiceStub}, {provide: ActivatedRoute, useValue: {snapshot: {params: '0'}}}, ],
      imports: [AngularMaterialModule, RouterTestingModule, FormsModule, ReactiveFormsModule, BrowserAnimationsModule,]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture)

    
    fixture.detectChanges();
    userServiceStub.getAllUser().subscribe((data:[]) => component.userInfo = data.filter((user: any) => user.id === 1))
    userServiceStub.getUserPosts('0').subscribe((data:[]) => data.map(post =>  postServiceStub.getPostComments('0').subscribe((data: any) => component.postsComments= data)))
    userServiceSpy.getAllUser.and.returnValue(of([{
      id: 1,
      email: 'test@test.it',
      name: 'test',
      gender: 'male',
      status: 'active'
    }],
    ))
    fixture.detectChanges();
    let store = {}
    spyOn(window.localStorage, 'getItem').and.callFake((key:string) => store[key]||null )
    spyOn(window.localStorage, 'setItem').and.callFake((key:string, value:string) => store[key] = value)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user post if there are', async () => {
    const userpost = [{
      id: 0,
      title: 'testtitle',
      body: 'testbody'
    }]
    expect(component.userPosts).toEqual(userpost)
    expect(component.noPostDiv).toBeFalsy()
    const postdiv = fixture.debugElement.query(By.css('.user-posts mat-card mat-card-header'))
    expect(postdiv.nativeElement.innerText).toEqual(userpost[0].title)
  })
  
  it('shoul display no post if there are not', async() => {
    spyOn(userServiceStub, 'getUserPosts').and.callFake(()=>of([]))
    
    component.ngOnInit()
    expect(component.noPostDiv).toBeTruthy()
    const postdiv = fixture.debugElement.query(By.css('.user-posts h3'))
    expect(postdiv).toBeDefined()
    
  })
  
  it('comment button should not be avilable without text', async() => {
    component.actualUser = 1
    fixture.detectChanges()
    const input = await loader.getHarness(MatInputHarness)
    const button= await loader.getAllHarnesses(MatButtonHarness)
    expect(await input.isRequired()).toBeTruthy()
    expect(await button[2].isDisabled()).toBeTruthy()
  })

  it('should post comment', async() => {
    component.actualUser = 1
    fixture.detectChanges()
    const input = await loader.getHarness(MatInputHarness)
    await input.setValue('test comment')
    fixture.detectChanges()
    const button= await loader.getAllHarnesses(MatButtonHarness)
    expect(await button[2].isDisabled()).toBeFalsy()
    fixture.detectChanges()
    
  })

  it('should display user info', () => {
    const postdiv = fixture.debugElement.queryAll(By.css('.user-info p'))
    expect(postdiv[1].nativeElement.innerText.split(' ')[1]).toEqual('test')
    expect(postdiv[2].nativeElement.innerText.split(' ')[1]).toEqual('test@test.it')
    expect(postdiv[3].nativeElement.innerText.split(' ')[1]).toEqual('male')
  })

  it('should diplay update button only when actual user', async() => {
    const postdiv = fixture.debugElement.query(By.css('.user-info button'))
    expect(localStorage.getItem('user')).toBeNull()
    expect(component.actualUser).toBeFalsy() 
    expect(component.actualUser).toBe(0)
    expect(postdiv).toBeNull()
    localStorage.setItem('user', '1')
    component.actualUser = Number(localStorage.getItem('user'))
    component.ngOnInit()
    fixture.detectChanges()
    expect(postdiv).toBeDefined() 
  }) 
});
