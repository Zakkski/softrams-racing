import { NgModule } from '@angular/core';
import { AlertService } from './alert.service';

import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  imports: [MatSnackBarModule],
  providers: [AlertService]
})
export class SharedModule {}
