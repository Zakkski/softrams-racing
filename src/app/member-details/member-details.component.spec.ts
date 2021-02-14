import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MemberDetailsComponent } from './member-details.component';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppService } from '../app.service';
import { MasterServiceStub } from 'src/testing/stubs/master-service.stub';
import { Subject, of } from 'rxjs';
import { AlertService } from '../shared/alert.service';

describe('MemberDetailsComponent', () => {
  let fixture: ComponentFixture<MemberDetailsComponent>;
  let component: MemberDetailsComponent;
  let masterServiceStub: MasterServiceStub;

  beforeEach(async(() => {
    masterServiceStub = new MasterServiceStub();
    TestBed.configureTestingModule({
      declarations: [MemberDetailsComponent],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [
        FormBuilder,
        {
          provide: AppService,
          useValue: masterServiceStub.appServiceStub
        },
        {
          provide: ActivatedRoute,
          useValue: masterServiceStub.activatedRouteStub
        },
        {
          provide: Router,
          useValue: masterServiceStub.routerStub
        },
        {
          provide: AlertService,
          useValue: masterServiceStub.alertServiceStub
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberDetailsComponent);
    component = fixture.componentInstance;
    masterServiceStub.activatedRouteStub.snapshot = {
      url: [{ path: 'new' }],
      params: { id: 2 }
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    let isNewMemberPageSpy: jasmine.Spy;
    const testFormValue: any = { testControl: 'test value' };
    beforeEach(() => {
      isNewMemberPageSpy = spyOn(component, 'isNewMemberPage').and.returnValue(
        true
      );
      spyOn(component, 'getMemberForm').and.returnValue(
        new FormGroup({ testControl: new FormControl() })
      );
    });

    it('should set teams once a value is returned', () => {
      const sub = new Subject();
      const teams: any = ['team 1', 'team 2'];
      masterServiceStub.appServiceStub.getTeams.and.returnValue(sub);
      component.teams = null;
      component.ngOnInit();
      expect(component.teams).toEqual(null);
      sub.next(teams);
      expect(component.teams).toEqual(teams);
      sub.complete();
    });

    it('should call getMemberForm once a value is returned', () => {
      const sub = new Subject();
      masterServiceStub.appServiceStub.getTeams.and.returnValue(sub);
      component.ngOnInit();
      expect(component.getMemberForm).toHaveBeenCalledTimes(0);
      sub.next();
      expect(component.getMemberForm).toHaveBeenCalledTimes(1);
      sub.complete();
    });

    it('should set memberId if isNewMemberPage returns false', () => {
      isNewMemberPageSpy.and.returnValue(false);
      component.memberId = null;
      component.ngOnInit();
      expect(component.memberId).toEqual(
        masterServiceStub.activatedRouteStub.snapshot.params.id
      );
    });

    it('should patch the member form value if isNewMemberPage returns false', () => {
      isNewMemberPageSpy.and.returnValue(false);
      masterServiceStub.appServiceStub.getMember.and.returnValue(
        of(testFormValue)
      );
      component.ngOnInit();
      expect(component.memberForm.value).toEqual(testFormValue);
    });
  });

  describe('onSubmit', () => {
    const testVal: any = 'test form values';
    let isNewMemberPageSpy: jasmine.Spy;
    beforeEach(() => {
      isNewMemberPageSpy = spyOn(component, 'isNewMemberPage').and.returnValue(
        true
      );
      spyOn(component, 'onAdd');
      spyOn(component, 'onUpdate');
      component.memberForm = { value: testVal } as any;
    });

    it('should set memberModel to the value of the form', () => {
      expect(component.memberModel).toBeUndefined();
      component.onSubmit();
      expect(component.memberModel).toEqual(testVal);
    });

    it('should call onAdd if isMemberNewPage is true', () => {
      component.onSubmit();
      expect(component.onAdd).toHaveBeenCalledTimes(1);
    });

    it('should call onUpdate if isMemberNewPage is false', () => {
      isNewMemberPageSpy.and.returnValue(false);
      component.onSubmit();
      expect(component.onUpdate).toHaveBeenCalledTimes(1);
    });
  });

  describe('onAdd', () => {
    it('should call appService#addMember with the new member obj', () => {
      component.memberModel = { prop1: 'testVal', prop2: 'testVal2' } as any;
      component.onAdd();
      expect(masterServiceStub.appServiceStub.addMember).toHaveBeenCalledWith(
        component.memberModel
      );
    });
  });

  describe('onUpdate', () => {
    it('should call appService#updateMember with the current memberId and the updated member obj', () => {
      component.memberId = 1;
      component.memberModel = { prop1: 'testVal', prop2: 'testVal2' } as any;
      component.onUpdate();
      expect(
        masterServiceStub.appServiceStub.updateMember
      ).toHaveBeenCalledWith(component.memberId, component.memberModel);
    });
  });

  describe('onDelete', () => {
    let confirmSpy: jasmine.Spy;
    beforeEach(() => {
      confirmSpy = spyOn(window, 'confirm').and.returnValue(true);
    });

    it('should call appService#deleteMember with the current memberId if window#confirm returns true', () => {
      component.memberId = 1;
      component.onDelete();
      expect(
        masterServiceStub.appServiceStub.deleteMember
      ).toHaveBeenCalledWith(component.memberId);
    });

    it('should not call appService#deleteMember if window#confirm returns false', () => {
      confirmSpy.and.returnValue(false);
      component.onDelete();
      expect(
        masterServiceStub.appServiceStub.deleteMember
      ).toHaveBeenCalledTimes(0);
    });
  });

  describe('handleSuccess', () => {
    const message = 'This is a test alert message';
    it('should call alertService#alert with the message', () => {
      component.handleSuccess(message);
      expect(masterServiceStub.alertServiceStub.alert).toHaveBeenCalledTimes(1);
      expect(masterServiceStub.alertServiceStub.alert).toHaveBeenCalledWith(
        message
      );
    });

    it('should call router#navigate to route to the members page', () => {
      component.handleSuccess(message);
      expect(masterServiceStub.routerStub.navigate).toHaveBeenCalledTimes(1);
      expect(masterServiceStub.routerStub.navigate).toHaveBeenCalledWith([
        '/members'
      ]);
    });
  });

  describe('isMemberNewPage', () => {
    it('should return true when the url path contains "new"', () => {
      masterServiceStub.activatedRouteStub.snapshot = {
        url: [{ path: 'new' }]
      };
      expect(component.isNewMemberPage()).toEqual(true);
    });

    it('should return false when the url path does not contain "new"', () => {
      masterServiceStub.activatedRouteStub.snapshot = {
        url: [{ path: '' }]
      };
      expect(component.isNewMemberPage()).toEqual(false);
    });
  });

  describe('getMemberForm', () => {
    it('should return a form with controls for each property of member', () => {
      const form = component.getMemberForm();
      expect(Object.keys(form.controls).length).toEqual(5);
    });
  });
});
