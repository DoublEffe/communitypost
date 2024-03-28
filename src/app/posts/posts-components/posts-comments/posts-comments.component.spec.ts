// Import necessari per il test
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostsCommentsComponent } from './posts-comments.component';
import { PostsListService } from '../../posts-service/posts-list.service';
import {  ReactiveFormsModule } from '@angular/forms';
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


describe('PostsCommentsComponent', () => {
  // Dichiarazione delle variabili necessarie
  let component: PostsCommentsComponent;
  let fixture: ComponentFixture<PostsCommentsComponent>;
  let postsServiceStub: Partial<PostsListService>
  let snapshotStub: jasmine.SpyObj<ActivatedRoute>
  let loader: HarnessLoader
  let postsServiceSpy: jasmine.SpyObj<PostsListService>

  // Configurazione del modulo di test
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

 // Blocco describe per i test relativi alla creazione del componente
 describe('Component Creation', () => {
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

// Blocco describe per i test relativi all'inizializzazione del post e dei commenti
describe('Inizialization', () => {
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

    // Controllo dell'inizializzazione del post e dei commenti
    postsServiceStub.getPostsList().subscribe((data: [] )=> component.post = data.filter((post: any) => post.id === 0))
    expect(component.post).toEqual(post)
    postsServiceStub.getPostComments('0').subscribe((data: [] )=> component.postComments = data.filter((comment: any) => comment.post_id === 0))
    expect(component.postComments).toEqual(comment)

    // Controllo che la divisione dei commenti non sia visibile
    component.noCommentsDiv = false
    expect(component.noCommentsDiv).toBeFalsy()
    fixture.detectChanges()

    // Controllo che la card e il commento siano visualizzati correttamente
    const commentdiv = fixture.debugElement.query(By.css('.comments-div p'))
    const card = await loader.getHarness(MatCardHarness)
    expect(await card.getTitleText()).toBe('test title')
    expect(commentdiv.nativeElement.innerText).toEqual(`${comment[0].name} said: ${comment[0].body}`)

  })

  it('should not display comments if there are not', () => {
    // Simulazione di un servizio che ritorna una lista vuota di commenti
    spyOn(postsServiceStub, 'getPostComments').and.callFake(()=>of([]))
    component.ngOnInit()

    // Controllo che la divisione dei commenti non sia visibile
    expect(component.noCommentsDiv).toBeTruthy()
    fixture.detectChanges()

    // Controllo che il messaggio "No comments available" sia visualizzato
    const commentdiv = fixture.debugElement.query(By.css('.no-comments h4'))
    expect(commentdiv.nativeElement.innerText).toBe('No comments available')
  })
})

// Blocco describe per i test relativi al box di commento
describe('Comment Box', () => {
  it('comment button should not be avilable without text', async() => {
    // Simulazione del box commento visualizzato
    component.showCommentBox = true
    fixture.detectChanges()

    // Controllo che il campo di input sia obbligatorio e che il button sia disabilitato
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
    // Controllo che il box commento non sia disponibile inizialmente
    postsServiceStub.getPostsList().subscribe((data: [] )=> component.post = data.filter((post: any) => post.id === 0))
    expect(component.post).toEqual(post)
    postsServiceStub.getPostComments('0').subscribe((data: [] )=> component.postComments = data.filter((comment: any) => comment.post_id === 0))
    expect(component.postComments).toEqual(comment)
    fixture.detectChanges()
    expect(component.showCommentBox).toBeFalsy()

    // Simulazione dell'autenticazione dell'utente nel localStorage
    spyOn(window.localStorage, 'setItem').and.callFake((key:string, value:string) => store[key] = value)
    spyOn(window.localStorage, 'getItem').and.callFake((key:string) => store[key]||null )
    localStorage.setItem('user', JSON.stringify({name:'test',email:'test'}))
    fixture.detectChanges()

    // Inizializzazione del componente e controllo che il box commento sia disponibile
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

    // Controllo che il box commento sia visibile
    postsServiceStub.getPostsList().subscribe((data: [] )=> component.post = data.filter((post: any) => post.id === 0))
    expect(component.post).toEqual(post)
    postsServiceStub.getPostComments('0').subscribe((data: [] )=> component.postComments = data.filter((comment: any) => comment.post_id === 0))
    expect(component.postComments).toEqual(comment)
    fixture.detectChanges()
    component.showCommentBox = true
    fixture.detectChanges()

    // Simulazione dell'inserimento del testo del commento e controllo che il button di invio sia abilitato
    const input = await loader.getHarness(MatInputHarness)
    await input.setValue('test comment')
    fixture.detectChanges()
    const button= await loader.getHarness(MatButtonHarness)
    expect(await button.isDisabled()).toBeFalsy()
    fixture.detectChanges()

    // Simulazione dell'invio del commento e controllo che il metodo makeNewComment sia stato chiamato
    spyOn(postsServiceStub, 'makeNewComment').and.callThrough()
    component.onComments(0)
    expect(postsServiceStub.makeNewComment).toHaveBeenCalledWith(0, await input.getValue())
    })
  })
});
