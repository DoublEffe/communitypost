// Import necessari per il test
import { TestBed } from '@angular/core/testing';
import { PostsListService } from './posts-list.service';
import { HttpClient } from '@angular/common/http';


describe('PostsListService', () => {
  // Dichiarazione delle variabili necessarie
  let service: PostsListService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let headers: {}
  let getItemSpy: jasmine.Spy;


  beforeEach(() => {
    TestBed.configureTestingModule({});
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    let store = {}
    spyOn(window.localStorage, 'setItem').and.callFake((key:string, value:string) => store[key] = value)
    getItemSpy = spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({ token: 'testToken' }));
    service = new PostsListService(httpClientSpy);
    localStorage.setItem('token', 'token fake')
    service.token = localStorage.getItem('token')
    headers = {headers:{'Authorization': 'Bearer '+service.token}}
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve the posts', () => {
    // Chiamata al metodo getPostsList
    service.getPostsList()

    // Verifica che il metodo HttpClient.get sia stato chiamato con l'URL corretto e le intestazioni corrette
    httpClientSpy.get('fake get posts url', headers)
    expect(httpClientSpy.get).toHaveBeenCalled()   
    expect(httpClientSpy.get).toHaveBeenCalledWith('fake get posts url', headers)   
  })

  it('should retrieve the comments', () => {
    // Chiamata al metodo getPostComments con id '0'
    service.getPostComments('0')

    // Verifica che il metodo HttpClient.get sia stato chiamato con l'URL corretto e le intestazioni corrette
    httpClientSpy.get('fake get comments url', headers)
    expect(httpClientSpy.get).toHaveBeenCalled()   
    expect(httpClientSpy.get).toHaveBeenCalledWith('fake get comments url', headers)   
  })

  it('should make new post', () => {
    // Imposta un body di esempio per il nuovo post
    const body = {tittle: 'fake title', body: 'fake body'}

    // Chiamata al metodo makeNewPost con titolo e corpo del post fittizi
    service.makeNewPost('fake title', 'fake body')

    // Verifica che il metodo HttpClient.post sia stato chiamato con l'URL corretto e il corpo corretto
    httpClientSpy.post('fake post posts url', body, headers)
    expect(httpClientSpy.post).toHaveBeenCalled()   
    expect(httpClientSpy.post).toHaveBeenCalledWith('fake post posts url', body ,  headers)   
  })

  it('should make comments', () => {
    // Simula l'impostazione dell'utente locale e il corpo del commento fittizio
    localStorage.setItem('user', JSON.stringify({id:0, name:'test', email: 'testemail', body: 'fake comment body'}))
    const body = {name: 'test', body: 'fake comment body', emnail: 'testemail'}

    // Chiamata al metodo makeNewComment con id del post e corpo del commento fittizi
    service.makeNewComment(0, 'fake comment body')

    // Verifica che il metodo HttpClient.post sia stato chiamato con l'URL corretto e il corpo corretto
    httpClientSpy.post('fake post comment url', body, headers)
    expect(httpClientSpy.post).toHaveBeenCalled()   
    expect(httpClientSpy.post).toHaveBeenCalledWith('fake post comment url', body, headers)   
  })
  
});
