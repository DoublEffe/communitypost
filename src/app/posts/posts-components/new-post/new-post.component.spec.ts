// Import necessari per il test
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



describe('NewPostComponent', () => {
  // Dichiarazione delle variabili necessarie
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
  

  // Configurazione del modulo di test
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

  // Blocco describe per i test relativi alla creazione del componente
  describe('Component Creation', () => {
    // Test per verificare la creazione del componente
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  // Blocco describe per i test relativi alla validazione del modulo
  describe('Form Validation', () => {
    // Test per verificare che il button sia disabilitato senza input
    it('button should be disabled without input', async () => {
      expect(await title.isRequired()).toBe(true);
      expect(await body.isRequired()).toBe(true);
      expect(await newPost.isDisabled()).toBe(true);
    });

    // Test per verificare che il button sia abilitato con input
    it('button should be enabled with input', async () => {  
      await title.setValue('test title');
      await body.setValue('test body');
      expect(await newPost.isDisabled()).toBe(false);
    });
  });
  
  // Blocco describe per i test relativi all'invio di un nuovo post
  describe('Sending New Post', () => {
    // Test per verificare l'invio del nuovo post al servizio
    it('should send new post to the service', async () => {
      await title.setValue('test title');
      await body.setValue('test body');
      const formValues = {
        title: await title.getValue(),
        body: await body.getValue()
      };
      await newPost.click();
      expect(postsServiceSpy.makeNewPost).toHaveBeenCalledWith(formValues.title, formValues.body);
    });
  });
  
  // Blocco describe per i test relativi alla chiusura del dialog
  describe('Closing Dialog', () => {
    // Test per verificare la chiusura del dialog
    it('should close dialog', async () => {
      await back.click();
      expect(dialogRefSpy.close).toHaveBeenCalled();
    });
  });

});
