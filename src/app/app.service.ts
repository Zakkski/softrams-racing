import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  api = 'http://localhost:8000/api';
  username: string;

  constructor(private http: HttpClient) {}
  // TODO:
  // 14. Add authguard (can't access pages unless logged in)
  // 18. candeactivate guard for member form
  // 15. member detail form should have client side validation
  // 16. member detail form should have server side validation
  // 2. Implement snackbar
  // 3. implement canDeactivate with edited page
  // 4. add error handling for form
  // 5. add loading spinner for members deatils and list page
  // 6. possibly lock fields for member details until 'edit' is pressed
  // 7. Test Login component
  // 8. test app component
  // 9. test component interactions Member comp
  // 10. test component interactions Member detail comp
  // 11. investigate the 'cannot match routes' in test errors (app component)
  // 17. refactor server?
  // 12. final proof and refactor
  // 13. Try running with zip file

  getMembers() {
    return this.http
      .get(`${this.api}/members`)
      .pipe(catchError(this.handleError));
  }

  getMember(id: number) {
    return this.http
      .get(`${this.api}/members/${id}`)
      .pipe(catchError(this.handleError));
  }

  setUsername(name: string): void {
    this.username = name;
  }

  addMember(memberForm) {
    return this.http
      .post(`${this.api}/members`, memberForm)
      .pipe(catchError(this.handleError));
  }

  updateMember(memberId, memberForm) {
    return this.http
      .patch(`${this.api}/members/${memberId}`, memberForm)
      .pipe(catchError(this.handleError));
  }

  deleteMember(memberId) {
    return this.http
      .delete(`${this.api}/members/${memberId}`)
      .pipe(catchError(this.handleError));
  }

  getTeams() {
    return this.http.get<any[]>(`${this.api}/teams`);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return [];
  }
}
