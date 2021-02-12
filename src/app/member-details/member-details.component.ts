import { Component, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../app.service';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

interface Member {
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
export class MemberDetailsComponent implements OnInit, OnChanges {
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

  // TODO: Refactor here?
  ngOnInit() {
    if (this.isNewMemberPage()) {
      this.appService.getTeams().subscribe(teams => {
        this.teams = teams;
        this.memberForm = this.getMemberForm();
      });
    } else {
      this.memberId = this.activatedRoute.snapshot.params.id;
      forkJoin([
        this.appService.getTeams(),
        this.appService.getMember(this.memberId)
      ]).subscribe(([teams, member]) => {
        this.teams = teams;
        this.memberForm = this.getMemberForm();
        this.memberForm.patchValue(member);
        console.log(this.memberForm.value);
      });
    }
  }

  ngOnChanges() {}

  // TODO: refactor here
  onSubmit(form: FormGroup) {
    this.memberModel = form.value;
    if (this.isNewMemberPage()) {
      this.appService.addMember(this.memberModel).subscribe(res => {
        this.handleSuccess('success');
      });
    } else {
      this.appService
        .updateMember(this.memberId, this.memberModel)
        .subscribe(() => {
          this.handleSuccess('success');
        });
    }
  }

  onDelete(): void {
    this.appService.deleteMember(this.memberId).subscribe(res => {
      this.handleSuccess('Deteled great');
    });
  }

  handleSuccess(message: string): void {
    // TODO: add alert service to send message
    console.log(message);
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
}
