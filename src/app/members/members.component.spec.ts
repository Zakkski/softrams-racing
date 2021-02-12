import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersComponent } from './members.component';

import { Router } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';
import { MasterServiceStub } from 'src/testing/stubs/master-service.stub';
import { AppService } from '../app.service';
import { Subject } from 'rxjs';

describe('MembersComponent', () => {
  let masterServiceStub: MasterServiceStub;
  beforeEach(async(() => {
    masterServiceStub = new MasterServiceStub();
    TestBed.configureTestingModule({
      declarations: [MembersComponent],
      imports: [HttpClientModule],
      providers: [
        {
          provide: Router,
          useValue: masterServiceStub.routerStub
        },
        {
          provide: AppService,
          useValue: masterServiceStub.appServiceStub
        }
      ]
    }).compileComponents();
  }));

  function setup() {
    const fixture: ComponentFixture<MembersComponent> = TestBed.createComponent(
      MembersComponent
    );
    const component: MembersComponent = fixture.componentInstance;
    return { fixture, component };
  }

  it('should create', () => {
    const { component } = setup();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set members after the observable emits a value', () => {
      const { component } = setup();
      const sub = new Subject();
      masterServiceStub.appServiceStub.getMembers.and.returnValue(sub);
      const testMembers = 'test';
      component.ngOnInit();
      expect(component.members).toEqual([]);
      sub.next(testMembers);
      expect(component.members).toEqual(testMembers);
      sub.complete();
    });
  });

  describe('goToAddMemberForm', () => {
    it('should call navigate with the proper arguments', () => {
      const { component } = setup();
      component.goToAddMemberForm();
      expect(masterServiceStub.routerStub.navigate).toHaveBeenCalledWith([
        '/members',
        'new'
      ]);
    });
  });

  describe('navigateToDetails', () => {
    it('should call navigate with the proper arguments', () => {
      const member = { id: 5 };
      const { component } = setup();
      component.navigateToDetails(member);
      expect(masterServiceStub.routerStub.navigate).toHaveBeenCalledWith([
        '/members',
        member.id
      ]);
    });
  });
});
