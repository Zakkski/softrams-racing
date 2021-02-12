import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MemberDetailsComponent } from './member-details.component';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AppService } from '../app.service';
import { of } from 'rxjs';

// Bonus points!
describe('MemberDetailsComponent', () => {
  let component: MemberDetailsComponent;
  let fixture: ComponentFixture<MemberDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MemberDetailsComponent],
      imports: [FormsModule, ReactiveFormsModule, RouterTestingModule],
      providers: [
        FormBuilder,
        {
          provide: AppService,
          useClass: class {
            getTeams = jasmine.createSpy('getTeams').and.returnValue(of([]));
          }
        },
        {
          provide: ActivatedRoute,
          useClass: class {
            snapshot = { params: { id: 3 }, url: [{ path: 'new' }] };
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
