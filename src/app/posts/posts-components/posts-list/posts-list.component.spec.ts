// Import necessari per il test
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
  // Dichiarazione delle variabili necessarie
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

  describe('Post Display', () => {
    it('should see posts', async () => {
      // Ottieni i titoli dei post attesi
      const title = ['test title', 'test title1'];

      // Ottieni i post dal servizio e assegna al componente
      postsServiceStub.getPostsList().subscribe((data: [] ) => component.postsList = data);
      fixture.detectChanges();

      // Ottieni tutte le card dei post
      const cards = await loader.getAllHarnesses(MatCardHarness);

      // Verifica che il titolo di ogni post corrisponda al titolo atteso
      cards.map((card, i) => expect(component.postsList[i].title).toEqual(title[i]));
    });
  });

  describe('Comments Functionality', () => {
    it('comment button should not be available without text', async () => {
      // Abilita il pulsante di commento
      component.addButtonVisdible = true;
      fixture.detectChanges();

      // Ottieni l'input del commento e il pulsante di invio del commento
      const input = await loader.getHarness(MatInputHarness.with({placeholder: 'Share your idea...'}));
      const button = await loader.getHarness(MatButtonHarness.with({text: 'Comment'}));

      // Verifica che l'input sia obbligatorio e che il pulsante di invio sia disabilitato
      expect(await input.isRequired()).toBeTruthy();
      expect(await button.isDisabled()).toBeTruthy();
    });

    it('should post a comment', async () => {
      // Ottieni i post dal servizio e assegna al componente
      postsServiceStub.getPostsList().subscribe((data: [] ) => component.postsList = data);

      // Abilita il pulsante di commento
      component.addButtonVisdible = true;
      fixture.detectChanges();

      // Ottieni l'input del commento e imposta il testo del commento
      const input = await loader.getHarness(MatInputHarness.with({placeholder: 'Share your idea...'}));
      await input.setValue('test comment');
      fixture.detectChanges();

      // Ottieni il pulsante di invio del commento e verifica che sia abilitato
      const button = await loader.getHarness(MatButtonHarness.with({text: 'Comment'}));
      expect(await button.isDisabled()).toBeFalsy();
      fixture.detectChanges();

      // Simula l'invio del commento e verifica che il metodo makeNewComment del servizio sia chiamato
      spyOn(postsServiceStub, 'makeNewComment').and.callThrough();
      component.onComments(0);
      expect(postsServiceStub.makeNewComment).toHaveBeenCalledWith(0, await input.getValue());
    });
  });

  describe('Filtered Posts', () => {
    it('should show filtered posts', async () => {
      // Ottieni i post dal servizio e assegna al componente
      postsServiceStub.getPostsList().subscribe((data: [] ) => component.postsList = data);

      // Ottieni l'input per il filtro e imposta il testo del filtro
      const input = await loader.getHarness(MatInputHarness.with({placeholder: 'Ex. example title'}));
      await input.setValue('test title1');
      fixture.detectChanges();

      // Ottieni il valore del filtro
      const filter = await input.getValue();

      // Filtra i post e assegna al componente i post filtrati
      component.postListFiltered = component.postsList.filter((post) => post.title === filter);
      fixture.detectChanges();

      // Ottieni tutte le card dei post e verifica che il titolo di ogni card corrisponda al filtro
      const cards = await loader.getAllHarnesses(MatCardHarness);
      cards.map(async (card, i) => expect(component.postListFiltered[i].title).toEqual(filter));
    });
  });

  describe('Add Post Button', () => {
    it('enable/disable add post button', async () => {
      // Stub dello storage locale
      let store = {};

      // Simula la funzione getItem del localStorage e imposta un valore
      spyOn(window.localStorage, 'getItem').and.callFake((key:string) => store[key] || null);
      spyOn(window.localStorage, 'setItem').and.callFake((key:string, value:string) => store[key] = value);
      localStorage.setItem('user', 'user fake data');

      // Ottieni il valore dal localStorage e verifica che sia impostato
      expect(localStorage.getItem('user')).toEqual('user fake data');

      // Inizialmente il pulsante per aggiungere un post dovrebbe essere disabilitato
      expect(component.addButtonVisdible).toBeFalsy();
      const div = fixture.debugElement.query(By.css('.button-div button'));
      expect(div).toBeNull();

      // Simula l'inizializzazione del componente e verifica che il pulsante per aggiungere un post sia abilitato
      component.ngOnInit();
      expect(component.addButtonVisdible).toBeTruthy();
      expect(div).toBeDefined();
    });
  });
  
});
