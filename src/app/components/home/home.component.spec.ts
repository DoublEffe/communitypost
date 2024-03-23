import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { AngularMaterialModule } from '../../materialdesign/angular-material.module';
import { RouterTestingHarness } from '@angular/router/testing';
import { MatTabNavBarHarness } from '@angular/material/tabs/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';


describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let harness: RouterTestingHarness
  let loader: HarnessLoader;
  const eventSubject = new ReplaySubject<RouterEvent>(1);
  const routerMock = {
    events: eventSubject.asObservable(),
  }

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [{provide: Router, useValue: routerMock}],
      imports: [AngularMaterialModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture)
    eventSubject.next(new NavigationEnd(1, '/users', '/urlAfterRedirect'))
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be on users page by default',() => {
    expect(component.activeLink).toEqual('/users')
  })

  it('should navigate to posts', async () => {
    const tabs = await loader.getHarness(MatTabNavBarHarness)
    const postsLink = await tabs.getLinks()
    await postsLink[1].click()
    expect(component.activeLink).toEqual('/posts')
  })

  it('should logout', () => {
    let store = {}
    spyOn(window.localStorage, 'getItem').and.callFake((key:string) => store[key]||null )
    spyOn(window.localStorage, 'removeItem').and.callFake((key:string) => store[key]=null )
    spyOn(window, 'confirm').and.returnValue(true);
    component.onLogout()
    localStorage.removeItem('user')
    expect(localStorage.removeItem).toHaveBeenCalled()
  })

  
});
