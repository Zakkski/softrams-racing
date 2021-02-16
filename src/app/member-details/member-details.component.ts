import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { AppService } from '../app.service';
import { Router, ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AlertService } from '../shared/alert.service';

export interface Member {
  firstName: string;
  lastName: string;
  jobTitle: string;
  team: number;
  status: string;
}

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit {
  memberModel: Member;
  memberForm: FormGroup;
  submitted = false;
  alertType: String;
  alertMessage: String;
  memberId: number;
  teams = [];

  constructor(
    private fb: FormBuilder,
    private appService: AppService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.appService
      .getTeams()
      .pipe(
        tap(() => {
          this.memberForm = this.getMemberForm();
          if (!this.isNewMemberPage()) {
            this.memberId = this.activatedRoute.snapshot.params.id;
            this.appService.getMember(this.memberId).subscribe(member => {
              this.memberForm.patchValue(member);
            });
          }
        })
      )
      .subscribe(teams => {
        this.teams = teams;
      });
  }

  onSubmit(): void {
    this.memberModel = this.memberForm.value;
    if (this.isNewMemberPage()) {
      this.onAdd();
    } else {
      this.onUpdate();
    }
  }

  onAdd(): void {
    this.appService.addMember(this.memberModel).subscribe(
      () => {
        this.handleSuccess('Member has been added!');
      },
      err => {
        this.alertService.alert(
          `There was an error adding this member: ${err}`
        );
      }
    );
  }

  onUpdate(): void {
    this.appService.updateMember(this.memberId, this.memberModel).subscribe(
      () => {
        this.handleSuccess('Member has been updated!');
      },
      err => {
        this.alertService.alert(
          `There was an error updating this member: ${err}`
        );
      }
    );
  }

  onDelete(): void {
    if (window.confirm('Are you sure you want to delete this member?')) {
      this.appService.deleteMember(this.memberId).subscribe(
        () => {
          this.handleSuccess('Member has been deleted!');
        },
        err => {
          this.alertService.alert(
            `There was an error deleting this member: ${err}`
          );
        }
      );
    }
  }

  handleSuccess(message: string): void {
    this.alertService.alert(message);
    this.memberForm.markAsPristine();
    this.router.navigate(['/members']);
  }

  isNewMemberPage(): boolean {
    return this.activatedRoute.snapshot.url[0].path === 'new';
  }

  getMemberForm(): FormGroup {
    return this.fb.group({
      firstName: this.fb.control('', Validators.required),
      lastName: this.fb.control('', Validators.required),
      jobTitle: this.fb.control('', Validators.required),
      team: this.fb.control('', Validators.required),
      status: this.fb.control('', Validators.required)
    });
  }

  canExit(): boolean {
    return this.memberForm.dirty
      ? window.confirm(
          'If you leave this page your current changes will not be saved'
        )
      : true;
  }

  isInvalidControl(controlName: string): boolean {
    const control = this.memberForm.get(controlName);
    return control.invalid && control.touched;
  }
}
