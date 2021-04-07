import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { NgModule } from '@angular/core';

@NgModule({
  imports: [MatToolbarModule, MatFormFieldModule, MatInputModule, MatIconModule],
  exports: [MatToolbarModule, MatFormFieldModule, MatInputModule, MatIconModule],
})
export class MaterialModule {}
