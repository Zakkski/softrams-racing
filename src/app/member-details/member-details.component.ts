import { Component, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../app.service';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';

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
    private activatedRoute: ActivatedRoute
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
        this.handleSuccess('success');
      },
      err => {
        this.handleError(err);
      }
    );
  }

  onUpdate(): void {
    this.appService.updateMember(this.memberId, this.memberModel).subscribe(
      () => {
        this.handleSuccess('success');
      },
      err => {
        this.handleError(err);
      }
    );
  }

  onDelete(): void {
    this.appService.deleteMember(this.memberId).subscribe(
      () => {
        this.handleSuccess('Deleted great');
      },
      err => {
        this.handleError(err);
      }
    );
  }

  //TODO: refactor with alert service;
  handleSuccess(message: string): void {
    // TODO: add alert service to send message
    console.log(message);
    this.router.navigate(['/members']);
  }

  handleError(message: string): void {
    // TODO: add alert service to send message
    console.log(message);
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
}
