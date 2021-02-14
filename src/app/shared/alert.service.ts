import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  onAlert = new Subject<any>();
  constructor(private snackBar: MatSnackBar) {}

  alert(message: string, duration = 2500) {
    this.snackBar.open(message, 'Close', { duration: duration });
  }
}
