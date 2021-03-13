import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//Module import
import { MaterialModule } from './material';
import { GameComponent } from './game/game.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';

import {WindowRefService} from './services/window-ref.service';
@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    FooterComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [
    WindowRefService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
