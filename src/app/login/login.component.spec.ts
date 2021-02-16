import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';

import { HttpClient } from '@angular/common/http';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import { MasterServiceStub } from 'src/testing/stubs/master-service.stub';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let masterServiceStub: MasterServiceStub;

  beforeEach(async(() => {
    masterServiceStub = new MasterServiceStub();
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, RouterModule, HttpClientModule],
      providers: [
        {
          provide: Router,
          useValue: masterServiceStub.routerStub
        },
        { provide: AppService, useValue: masterServiceStub.appServiceStub },
        HttpClient
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set the loginForm', () => {
      component.loginForm = null;
      component.ngOnInit();
      expect(Object.keys(component.loginForm.controls).length).toEqual(2);
    });
  });

  describe('login', () => {
    it('should call navigate', () => {
      component.login();
      expect(masterServiceStub.routerStub.navigate).toHaveBeenCalledTimes(1);
      expect(masterServiceStub.routerStub.navigate).toHaveBeenCalledWith([
        '/members'
      ]);
    });

    it('should call appService#setUsername', () => {
      component.login();
      expect(
        masterServiceStub.appServiceStub.setUsername
      ).toHaveBeenCalledTimes(1);
    });
  });
});
