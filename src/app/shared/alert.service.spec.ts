import { TestBed } from '@angular/core/testing';

import { AlertService } from './alert.service';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('AlertService', () => {
  let service: AlertService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  beforeEach(() => {
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    TestBed.configureTestingModule({
      providers: [AlertService, { provide: MatSnackBar, useValue: snackBarSpy }]
    });

    service = TestBed.get(AlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('alert', () => {
    const message = 'This is a test message';
    const duration = 1000;

    it('should call open with the message and default duration when none is passed', () => {
      service.alert(message);
      expect(snackBarSpy.open).toHaveBeenCalledTimes(1);
      expect(snackBarSpy.open).toHaveBeenCalledWith(message, 'Close', {
        duration: 2500
      });
    });

    it('should call open with the message and passed duration when one is passed', () => {
      service.alert(message, duration);
      expect(snackBarSpy.open).toHaveBeenCalledTimes(1);
      expect(snackBarSpy.open).toHaveBeenCalledWith(message, 'Close', {
        duration: 1000
      });
    });
  });
});
