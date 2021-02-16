import { TestBed, async, inject } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { MasterServiceStub } from 'src/testing/stubs/master-service.stub';
import { Router } from '@angular/router';
import { AppService } from '../app.service';

describe('AuthGuard', () => {
  let masterServiceStub: MasterServiceStub;
  let guard: AuthGuard;
  beforeEach(() => {
    masterServiceStub = new MasterServiceStub();
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: masterServiceStub.routerStub },
        { provide: AppService, useValue: masterServiceStub.appServiceStub }
      ]
    });
    guard = TestBed.get(AuthGuard);
  });

  it('should ...', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    const next: any = '';
    const state: any = '';
    it('should return true if username is set', () => {
      masterServiceStub.appServiceStub.username = 'Username';
      expect(guard.canActivate(next, state)).toEqual(true);
    });

    it('should return false if username is not set', () => {
      masterServiceStub.appServiceStub.username = null;
      expect(guard.canActivate(next, state)).toEqual(false);
    });

    it('should call router if canActivate returns false', () => {
      masterServiceStub.appServiceStub.username = null;
      guard.canActivate(next, state);
      expect(masterServiceStub.routerStub.navigate).toHaveBeenCalledTimes(1);
      expect(masterServiceStub.routerStub.navigate).toHaveBeenCalledWith([
        'login'
      ]);
    });
  });
});
