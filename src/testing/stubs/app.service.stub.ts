import { of } from 'rxjs';
import * as testData from '../data/testData.json';

export class AppServiceStub {
  username;
  getMembers = jasmine
    .createSpy('getMembers')
    .and.returnValue(of(testData.members));
  getMember = jasmine
    .createSpy('getMember')
    .and.returnValue(of(testData.members[0]));
  deleteMember = jasmine.createSpy('deleteMember').and.returnValue(of({}));
  updateMember = jasmine.createSpy('updateMember').and.returnValue(of({}));
  addMember = jasmine.createSpy('addMember').and.returnValue(of({}));
  getTeams = jasmine.createSpy('getTeams').and.returnValue(of([]));
  setUsername = jasmine.createSpy('setUsername').and.returnValue(of([]));
}
