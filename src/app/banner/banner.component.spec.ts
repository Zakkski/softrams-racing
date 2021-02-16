import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerComponent } from './banner.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MasterServiceStub } from 'src/testing/stubs/master-service.stub';
import { Router } from '@angular/router';
import { AppService } from '../app.service';

describe('BannerComponent', () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;
  let masterServiceStub: MasterServiceStub;

  beforeEach(async(() => {
    masterServiceStub = new MasterServiceStub();
    TestBed.configureTestingModule({
      declarations: [BannerComponent],
      providers: [
        { provide: Router, useValue: masterServiceStub.routerStub },
        { provide: AppService, useValue: masterServiceStub.appServiceStub }
      ],
      imports: [HttpClientTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('logout', () => {
    it('should reset username', () => {
      masterServiceStub.appServiceStub.username = 'Value';
      component.logout();
      expect(masterServiceStub.appServiceStub.username).toEqual('');
    });

    it('should call navigate to login', () => {
      component.logout();
      expect(masterServiceStub.routerStub.navigate).toHaveBeenCalledTimes(1);
      expect(masterServiceStub.routerStub.navigate).toHaveBeenCalledWith([
        '/login'
      ]);
    });
  });
});
