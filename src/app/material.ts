import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { NgModule } from '@angular/core';

@NgModule({
  imports: [MatToolbarModule, MatFormFieldModule, MatInputModule, MatIconModule, MatSnackBarModule],
  exports: [MatToolbarModule, MatFormFieldModule, MatInputModule, MatIconModule, MatSnackBarModule],
})
export class MaterialModule {}
