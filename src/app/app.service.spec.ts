import { TestBed } from '@angular/core/testing';

import { AppService } from './app.service';

import {
  HttpTestingController,
  HttpClientTestingModule
} from '@angular/common/http/testing';

describe('AppService', () => {
  let service: AppService;
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppService],
      imports: [HttpClientTestingModule]
    });
    service = TestBed.get(AppService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMembers', () => {
    it('should call the members endpoint', () => {
      service.getMembers().subscribe();
      const req = httpTestingController.expectOne(
        'http://localhost:8000/api/members'
      );

      expect(req.request.method).toEqual('GET');

      req.flush('');
    });
  });

  describe('getMember', () => {
    it('should call the member endpoint', () => {
      const id = 1;
      service.getMember(id).subscribe();
      const req = httpTestingController.expectOne(
        `http://localhost:8000/api/members/${id}`
      );

      expect(req.request.method).toEqual('GET');

      req.flush('');
    });
  });

  describe('setUsername', () => {
    it('should set the username', () => {
      const username = 'Username';
      service.username = null;
      service.setUsername(username);
      expect(service.username).toEqual(username);
    });
  });

  describe('addMember', () => {
    it('should call the members endpoint', () => {
      const formVal = 'value';
      service.addMember(formVal).subscribe();
      const req = httpTestingController.expectOne(
        'http://localhost:8000/api/members'
      );

      expect(req.request.method).toEqual('POST');

      req.flush('');
    });
  });

  describe('updateMember', () => {
    it('should call the members endpoint', () => {
      const formVal = 'value';
      const id = 1;
      service.updateMember(id, formVal).subscribe();
      const req = httpTestingController.expectOne(
        `http://localhost:8000/api/members/${id}`
      );

      expect(req.request.method).toEqual('PATCH');

      req.flush('');
    });
  });

  describe('deleteMember', () => {
    it('should call the members endpoint', () => {
      const id = 1;
      service.deleteMember(id).subscribe();
      const req = httpTestingController.expectOne(
        `http://localhost:8000/api/members/${id}`
      );

      expect(req.request.method).toEqual('DELETE');

      req.flush('');
    });
  });

  describe('getTeams', () => {
    it('should call the members endpoint', () => {
      service.getTeams().subscribe();
      const req = httpTestingController.expectOne(
        'http://localhost:8000/api/teams'
      );

      expect(req.request.method).toEqual('GET');

      req.flush('');
    });
  });
});
