// Import necessari per il test
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
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
  // Dichiarazione delle variabili necessarie
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let harness: RouterTestingHarness;
  let loader: HarnessLoader;
  const eventSubject = new ReplaySubject<RouterEvent>(1);

  // Mock del router
  const routerMock = {
    events: eventSubject.asObservable(),
    navigate: jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true)), // Lo spy per il metodo navigate
  };

  // Configurazione del modulo di test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [{ provide: Router, useValue: routerMock }], // Fornisce il mock del router come provider
      imports: [AngularMaterialModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    // Creazione del componente e inizializzazione delle variabili
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    eventSubject.next(new NavigationEnd(1, '/users', '/urlAfterRedirect'));
    fixture.detectChanges();
  });

  // Blocchi describe per organizzare i test
  describe('Component Creation', () => {
    // Test per verificare la creazione del componente
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('Default Active Link', () => {
    // Test per verificare il link attivo predefinito
    it('should be on users page by default', () => {
      expect(component.activeLink).toEqual('/users');
    });
  });

  describe('Navigation', () => {
    // Test per verificare la navigazione verso la pagina '/posts'
    it('should navigate to posts', async () => {
      const tabs = await loader.getHarness(MatTabNavBarHarness); // Ottiene il MatTabNavBarHarness
      const postsLink = await tabs.getLinks(); // Ottiene i link all'interno del tab bar
      await postsLink[1].click(); // Simula il click sul secondo link (assumendo che sia il link per 'posts')
      expect(component.activeLink).toEqual('/posts'); // Verifica che il link attivo sia '/posts'
    });
  });

  describe('Logout', () => {
    // Test per verificare la funzione di logout
    it('should logout', fakeAsync(() => {
      // Simula localStorage.getItem() restituendo un token
      spyOn(window.localStorage, 'getItem').and.returnValue('token');
      // Simula localStorage.removeItem()
      spyOn(window.localStorage, 'removeItem');
      // Simula la conferma dell'utente per il logout
      spyOn(window, 'confirm').and.returnValue(true);
      // Chiama la funzione di logout
      component.onLogout();
      tick(); // Simula il passare del tempo
      // Verifica che localStorage.removeItem() sia stato chiamato
      expect(localStorage.removeItem).toHaveBeenCalled();
    }));
  });
});

