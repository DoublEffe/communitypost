import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersListComponent } from './users-list.component';
import { UsersListService } from '../../user-service/users-list.service';
import { of } from 'rxjs';
import { AuthService } from '../../../service/auth/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularMaterialModule } from '../../../materialdesign/angular-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { By } from '@angular/platform-browser';

describe('UsersListComponent', () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;
  let userServiceStub: Partial<UsersListService>
  let authServiceStub: Partial<AuthService>
  let loader: HarnessLoader
  

  beforeEach(async () => {
    userServiceStub = {
      getUsersList() {
          return  of([{
            id: 0,
            email: 'test@test.it',
            name: 'test',
            gender: 'male',
            status: 'active'
          },
          {
            id: 1,
            email: 'test1@test.it',
            name: 'test1',
            gender: 'female',
            status: 'inactive'
          }
        ])
      },
    }
    await TestBed.configureTestingModule({
      declarations: [UsersListComponent],
      providers: [{provide: UsersListService, useValue: userServiceStub}, {provide: AuthService, useValue: authServiceStub}],
      imports: [RouterTestingModule, AngularMaterialModule, BrowserAnimationsModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture)
    userServiceStub.getUsersList().subscribe((data: [] )=> component.usersList = data)
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display users', async() => {
    component.ngOnInit()
    const divs = fixture.debugElement.queryAll(By.css('.a-active a'))
    expect(divs[0].nativeElement.innerText).toEqual('test')
  })

  it('enable/disable add user button', () => {
    let store = {}
    spyOn(window.localStorage, 'getItem').and.callFake((key:string) => store[key]||null )
    component.ngOnInit()
    spyOn(window.localStorage, 'setItem').and.callFake((key:string, value:string) => store[key] = value)
    expect(localStorage.getItem('user')).toBeNull()
    expect(component.addButtonVisible).toBeTruthy()
    expect(component.actualUserId).toBe(0)
    const div = fixture.debugElement.query(By.css('.button-div button'))
    expect(div).toBeDefined()
    localStorage.setItem('user', JSON.stringify({id: 0}))
    component.ngOnInit()
    fixture.detectChanges();
    expect(component.actualUserId).toEqual(0)
   
  })


});
